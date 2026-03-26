import asyncio
import os
import sqlite3
import sys
import traceback
from datetime import datetime
from pathlib import Path

from backend.engine.spider_builder import WORKSPACE, write_spider_file
from backend.ws.manager import ws_manager

DB_PATH = str((Path(__file__).parent.parent / "harvester.db").resolve())
RUNNING_PROCESSES: dict[str, asyncio.subprocess.Process] = {}


async def start_crawl(spider: dict, crawl_job_id: str, db: object):
    spider_file = write_spider_file(spider, crawl_job_id, DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        "UPDATE crawl_jobs SET status='running', started_at=? WHERE id=?",
        (datetime.utcnow().isoformat(), crawl_job_id),
    )
    conn.commit()
    conn.close()

    await ws_manager.broadcast(
        crawl_job_id, {"type": "status", "status": "running", "job_id": crawl_job_id}
    )

    env = os.environ.copy()
    env["PYTHONPATH"] = str(WORKSPACE) + os.pathsep + env.get("PYTHONPATH", "")

    try:
        proc = await asyncio.create_subprocess_exec(
            sys.executable,
            "-m",
            "scrapy",
            "runspider",
            str(spider_file),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
            cwd=str(WORKSPACE),
        )
    except Exception as exc:
        details = f"{type(exc).__name__}: {repr(exc)}\n{traceback.format_exc()}"
        conn = sqlite3.connect(DB_PATH)
        conn.execute(
            "UPDATE crawl_jobs SET status='error', finished_at=?, log=? WHERE id=?",
            (datetime.utcnow().isoformat(), f"Failed to start crawl process:\n{details}", crawl_job_id),
        )
        conn.commit()
        conn.close()
        await ws_manager.broadcast(
            crawl_job_id,
            {
                "type": "status",
                "status": "error",
                "job_id": crawl_job_id,
            },
        )
        return
    RUNNING_PROCESSES[crawl_job_id] = proc

    asyncio.create_task(_stream_output(proc, crawl_job_id))
    asyncio.create_task(_wait_for_finish(proc, crawl_job_id))


async def _stream_output(proc: asyncio.subprocess.Process, job_id: str):
    log_buffer: list[str] = []
    assert proc.stdout is not None
    assert proc.stderr is not None

    async def consume(stream: asyncio.StreamReader):
        async for line in stream:
            text = line.decode("utf-8", errors="ignore").strip()
            if not text:
                continue
            log_buffer.append(text)
            await ws_manager.broadcast(job_id, {"type": "log", "line": text, "job_id": job_id})
            if len(log_buffer) % 10 == 0:
                conn = sqlite3.connect(DB_PATH)
                conn.execute(
                    "UPDATE crawl_jobs SET log=? WHERE id=?",
                    ("\n".join(log_buffer[-500:]), job_id),
                )
                conn.commit()
                conn.close()

    await asyncio.gather(consume(proc.stdout), consume(proc.stderr))

    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "UPDATE crawl_jobs SET log=? WHERE id=?",
        ("\n".join(log_buffer[-500:]), job_id),
    )
    conn.commit()
    conn.close()


async def _wait_for_finish(proc: asyncio.subprocess.Process, job_id: str):
    await proc.wait()
    status = "finished" if proc.returncode == 0 else "error"
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "UPDATE crawl_jobs SET status=?, finished_at=? WHERE id=?",
        (status, datetime.utcnow().isoformat(), job_id),
    )
    conn.commit()
    conn.close()
    RUNNING_PROCESSES.pop(job_id, None)
    await ws_manager.broadcast(job_id, {"type": "status", "status": status, "job_id": job_id})


async def stop_crawl(crawl_job_id: str):
    proc = RUNNING_PROCESSES.get(crawl_job_id)
    if proc and proc.returncode is None:
        proc.terminate()
        conn = sqlite3.connect(DB_PATH)
        conn.execute(
            "UPDATE crawl_jobs SET status='stopped', finished_at=? WHERE id=?",
            (datetime.utcnow().isoformat(), crawl_job_id),
        )
        conn.commit()
        conn.close()
        await ws_manager.broadcast(
            crawl_job_id,
            {"type": "status", "status": "stopped", "job_id": crawl_job_id},
        )
        return True
    return False
