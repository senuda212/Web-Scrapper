import csv
import io
import json

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from openpyxl import Workbook
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import ScrapedItem

router = APIRouter(prefix="/api/export", tags=["export"])


async def _get_items(db: AsyncSession, crawl_job_id: str | None = None, spider_id: str | None = None):
    q = select(ScrapedItem).order_by(ScrapedItem.scraped_at.asc())
    if crawl_job_id:
        q = q.where(ScrapedItem.crawl_job_id == crawl_job_id)
    if spider_id:
        q = q.where(ScrapedItem.spider_id == spider_id)
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/json")
async def export_json(
    crawl_job_id: str | None = None,
    spider_id: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    items = await _get_items(db, crawl_job_id, spider_id)
    data = [{"url": i.url, **i.data} for i in items]
    content = json.dumps(data, indent=2, ensure_ascii=False)
    return StreamingResponse(
        iter([content]),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=harvester_export.json"},
    )


@router.get("/csv")
async def export_csv(
    crawl_job_id: str | None = None,
    spider_id: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    items = await _get_items(db, crawl_job_id, spider_id)
    if not items:
        return StreamingResponse(iter([""]), media_type="text/csv")

    rows = [{"url": i.url, **i.data} for i in items]
    keys = list(rows[0].keys()) if rows else []

    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=keys, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(rows)

    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=harvester_export.csv"},
    )


@router.get("/xlsx")
async def export_xlsx(
    crawl_job_id: str | None = None,
    spider_id: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    items = await _get_items(db, crawl_job_id, spider_id)
    rows = [{"url": i.url, **i.data} for i in items]

    wb = Workbook()
    ws = wb.active
    ws.title = "Harvested Data"

    if rows:
        keys = list(rows[0].keys())
        ws.append(keys)
        for row in rows:
            ws.append([str(row.get(k, "")) for k in keys])

    buf = io.BytesIO()
    wb.save(buf)
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=harvester_export.xlsx"},
    )
