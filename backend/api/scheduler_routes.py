import uuid

from apscheduler.triggers.cron import CronTrigger
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import ScheduledJob
from backend.scheduler.job_scheduler import _run_scheduled_spider, scheduler

router = APIRouter(prefix="/api/scheduler", tags=["scheduler"])


class ScheduleCreate(BaseModel):
    spider_id: str
    cron_expression: str
    enabled: bool = True


def job_to_dict(j: ScheduledJob) -> dict:
    return {
        "id": j.id,
        "spider_id": j.spider_id,
        "cron_expression": j.cron_expression,
        "enabled": j.enabled,
        "last_run": j.last_run.isoformat() if j.last_run else None,
        "next_run": j.next_run.isoformat() if j.next_run else None,
        "created_at": j.created_at.isoformat() if j.created_at else None,
    }


@router.get("")
async def list_jobs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ScheduledJob).order_by(ScheduledJob.created_at.desc()))
    return [job_to_dict(j) for j in result.scalars().all()]


@router.post("")
async def create_job(data: ScheduleCreate, db: AsyncSession = Depends(get_db)):
    job = ScheduledJob(id=str(uuid.uuid4()), **data.model_dump())
    db.add(job)
    await db.commit()
    await db.refresh(job)
    if job.enabled:
        parts = job.cron_expression.split()
        if len(parts) == 5:
            minute, hour, day, month, dow = parts
            trigger = CronTrigger(minute=minute, hour=hour, day=day, month=month, day_of_week=dow)
            scheduler.add_job(
                _run_scheduled_spider,
                trigger,
                args=[job.spider_id, job.id],
                id=job.id,
                replace_existing=True,
            )
    return job_to_dict(job)


@router.delete("/{job_id}")
async def delete_job(job_id: str, db: AsyncSession = Depends(get_db)):
    job = await db.get(ScheduledJob, job_id)
    if not job:
        raise HTTPException(404, "Schedule not found")
    try:
        scheduler.remove_job(job_id)
    except Exception:
        pass
    await db.delete(job)
    await db.commit()
    return {"deleted": True}
