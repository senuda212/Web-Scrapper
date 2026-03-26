from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import Spider

router = APIRouter(prefix="/api/spiders", tags=["spiders"])


class SpiderCreate(BaseModel):
    name: str
    description: str = ""
    start_urls: List[str] = []
    fields: List[dict] = []
    custom_code: str = ""
    use_playwright: bool = False
    follow_links: bool = False
    follow_link_selector: str = ""
    max_pages: int = 100
    download_delay: float = 1.0
    randomize_delay: bool = True
    rotate_user_agent: bool = True
    use_proxies: bool = False
    respect_robots: bool = True


class SpiderUpdate(SpiderCreate):
    pass


def spider_to_dict(s: Spider) -> dict:
    return {
        "id": s.id,
        "name": s.name,
        "description": s.description,
        "start_urls": s.start_urls or [],
        "fields": s.fields or [],
        "custom_code": s.custom_code,
        "use_playwright": s.use_playwright,
        "follow_links": s.follow_links,
        "follow_link_selector": s.follow_link_selector,
        "max_pages": s.max_pages,
        "download_delay": s.download_delay,
        "randomize_delay": s.randomize_delay,
        "rotate_user_agent": s.rotate_user_agent,
        "use_proxies": s.use_proxies,
        "respect_robots": s.respect_robots,
        "created_at": s.created_at.isoformat() if s.created_at else None,
        "updated_at": s.updated_at.isoformat() if s.updated_at else None,
    }


@router.get("")
async def list_spiders(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Spider).order_by(Spider.created_at.desc()))
    return [spider_to_dict(s) for s in result.scalars().all()]


@router.post("")
async def create_spider(data: SpiderCreate, db: AsyncSession = Depends(get_db)):
    spider = Spider(**data.model_dump())
    db.add(spider)
    await db.commit()
    await db.refresh(spider)
    return spider_to_dict(spider)


@router.get("/{spider_id}")
async def get_spider(spider_id: str, db: AsyncSession = Depends(get_db)):
    spider = await db.get(Spider, spider_id)
    if not spider:
        raise HTTPException(404, "Spider not found")
    return spider_to_dict(spider)


@router.put("/{spider_id}")
async def update_spider(spider_id: str, data: SpiderUpdate, db: AsyncSession = Depends(get_db)):
    spider = await db.get(Spider, spider_id)
    if not spider:
        raise HTTPException(404, "Spider not found")
    for key, value in data.model_dump().items():
        setattr(spider, key, value)
    spider.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(spider)
    return spider_to_dict(spider)


@router.delete("/{spider_id}")
async def delete_spider(spider_id: str, db: AsyncSession = Depends(get_db)):
    spider = await db.get(Spider, spider_id)
    if not spider:
        raise HTTPException(404, "Spider not found")
    await db.delete(spider)
    await db.commit()
    return {"deleted": True}
