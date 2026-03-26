from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import ScrapedItem

router = APIRouter(prefix="/api/data", tags=["data"])


@router.get("")
async def get_data(
    crawl_job_id: Optional[str] = None,
    spider_id: Optional[str] = None,
    page: int = 1,
    page_size: int = 50,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    q = select(ScrapedItem).order_by(ScrapedItem.scraped_at.desc())
    if crawl_job_id:
        q = q.where(ScrapedItem.crawl_job_id == crawl_job_id)
    if spider_id:
        q = q.where(ScrapedItem.spider_id == spider_id)

    if search:
        q = q.where(ScrapedItem.data.like(f"%{search}%"))

    count_q = select(func.count()).select_from(q.subquery())
    total = (await db.execute(count_q)).scalar()

    q = q.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(q)
    items = result.scalars().all()

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [
            {
                "id": i.id,
                "crawl_job_id": i.crawl_job_id,
                "spider_id": i.spider_id,
                "data": i.data,
                "url": i.url,
                "scraped_at": i.scraped_at.isoformat() if i.scraped_at else None,
            }
            for i in items
        ],
    }


@router.delete("/crawl/{job_id}")
async def delete_crawl_data(job_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ScrapedItem).where(ScrapedItem.crawl_job_id == job_id))
    for item in result.scalars().all():
        await db.delete(item)
    await db.commit()
    return {"deleted": True}


@router.delete("/all")
async def delete_all_data(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ScrapedItem))
    for item in result.scalars().all():
        await db.delete(item)
    await db.commit()
    return {"deleted": True}
