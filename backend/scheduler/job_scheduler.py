import uuid
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy import select

from backend.database import AsyncSessionLocal
from backend.engine.runner import start_crawl
from backend.models import CrawlJob, ScheduledJob, Spider

scheduler = AsyncIOScheduler()


async def _run_scheduled_spider(spider_id: str, job_id: str):
    async with AsyncSessionLocal() as db:
        spider = await db.get(Spider, spider_id)
        if not spider:
            return

        crawl_job = CrawlJob(id=str(uuid.uuid4()), spider_id=spider_id, status="pending")
        db.add(crawl_job)
        await db.commit()

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
        await start_crawl(spider_dict, crawl_job.id, db)

        sched_job = await db.get(ScheduledJob, job_id)
        if sched_job:
            sched_job.last_run = datetime.utcnow()
            await db.commit()


async def load_scheduled_jobs():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(ScheduledJob).where(ScheduledJob.enabled == True))
        for job in result.scalars().all():
            try:
                parts = job.cron_expression.split()
                if len(parts) != 5:
                    continue
                minute, hour, day, month, dow = parts
                trigger = CronTrigger(minute=minute, hour=hour, day=day, month=month, day_of_week=dow)
                aps_job = scheduler.add_job(
                    _run_scheduled_spider,
                    trigger,
                    args=[job.spider_id, job.id],
                    id=job.id,
                    replace_existing=True,
                )
                if aps_job and aps_job.next_run_time:
                    job.next_run = aps_job.next_run_time
            except Exception:
                continue
        await db.commit()


def start_scheduler():
    if not scheduler.running:
        scheduler.start()
