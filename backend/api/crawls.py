import asyncio
import uuid

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.engine.runner import start_crawl, stop_crawl
from backend.models import CrawlJob, Spider
from backend.ws.manager import ws_manager

router = APIRouter(prefix="/api/crawls", tags=["crawls"])


def job_to_dict(j: CrawlJob) -> dict:
    return {
        "id": j.id,
        "spider_id": j.spider_id,
        "status": j.status,
        "items_scraped": j.items_scraped,
        "pages_crawled": j.pages_crawled,
        "errors": j.errors,
        "log": j.log,
        "started_at": j.started_at.isoformat() if j.started_at else None,
        "finished_at": j.finished_at.isoformat() if j.finished_at else None,
    }


@router.post("/start/{spider_id}")
async def start_spider_crawl(spider_id: str, db: AsyncSession = Depends(get_db)):
    spider = await db.get(Spider, spider_id)
    if not spider:
        raise HTTPException(404, "Spider not found")

    job = CrawlJob(id=str(uuid.uuid4()), spider_id=spider_id, status="pending")
    db.add(job)
    await db.commit()
    await db.refresh(job)

    spider_dict = {
        "id": spider.id,
        "name": spider.name,
        "start_urls": spider.start_urls or [],
        "fields": spider.fields or [],
        "custom_code": spider.custom_code or "",
        "use_playwright": spider.use_playwright,
        "follow_links": spider.follow_links,
        "follow_link_selector": spider.follow_link_selector or "",
        "max_pages": spider.max_pages,
        "download_delay": spider.download_delay,
        "randomize_delay": spider.randomize_delay,
        "rotate_user_agent": spider.rotate_user_agent,
        "use_proxies": spider.use_proxies,
        "respect_robots": spider.respect_robots,
    }

    asyncio.create_task(start_crawl(spider_dict, job.id, db))
    return job_to_dict(job)


@router.post("/stop/{job_id}")
async def stop_crawl_job(job_id: str):
    stopped = await stop_crawl(job_id)
    return {"stopped": stopped}


@router.get("")
async def list_crawls(spider_id: str | None = None, db: AsyncSession = Depends(get_db)):
    q = select(CrawlJob).order_by(CrawlJob.started_at.desc())
    if spider_id:
        q = q.where(CrawlJob.spider_id == spider_id)
    result = await db.execute(q)
    return [job_to_dict(j) for j in result.scalars().all()]


@router.get("/{job_id}")
async def get_crawl(job_id: str, db: AsyncSession = Depends(get_db)):
    job = await db.get(CrawlJob, job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job_to_dict(job)


@router.delete("/{job_id}")
async def delete_crawl(job_id: str, db: AsyncSession = Depends(get_db)):
    job = await db.get(CrawlJob, job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    await db.delete(job)
    await db.commit()
    return {"deleted": True}


@router.websocket("/ws/{job_id}")
async def crawl_websocket(websocket: WebSocket, job_id: str):
    await ws_manager.connect(websocket, job_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, job_id)
