from datetime import datetime

import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import ProxyEntry

router = APIRouter(prefix="/api/proxies", tags=["proxies"])


class ProxyCreate(BaseModel):
    url: str
    protocol: str = "http"
    country: str = ""


def proxy_to_dict(p: ProxyEntry) -> dict:
    return {
        "id": p.id,
        "url": p.url,
        "protocol": p.protocol,
        "country": p.country,
        "is_active": p.is_active,
        "success_count": p.success_count,
        "fail_count": p.fail_count,
        "last_checked": p.last_checked.isoformat() if p.last_checked else None,
    }


@router.get("")
async def list_proxies(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProxyEntry).order_by(ProxyEntry.added_at.desc()))
    return [proxy_to_dict(p) for p in result.scalars().all()]


@router.post("")
async def add_proxy(data: ProxyCreate, db: AsyncSession = Depends(get_db)):
    proxy = ProxyEntry(**data.model_dump())
    db.add(proxy)
    await db.commit()
    await db.refresh(proxy)
    return proxy_to_dict(proxy)


@router.post("/import-free")
async def import_free_proxies(db: AsyncSession = Depends(get_db)):
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                "https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc&protocols=http"
            )
            data = resp.json()
    except Exception as exc:
        raise HTTPException(500, f"Failed to fetch proxies: {exc}")

    added = 0
    for p in data.get("data", []):
        url = f"http://{p['ip']}:{p['port']}"
        existing = await db.execute(select(ProxyEntry).where(ProxyEntry.url == url))
        if not existing.scalar():
            db.add(ProxyEntry(url=url, protocol="http", country=p.get("country", "")))
            added += 1

    await db.commit()
    return {"added": added}


@router.post("/test/{proxy_id}")
async def test_proxy(proxy_id: str, db: AsyncSession = Depends(get_db)):
    proxy = await db.get(ProxyEntry, proxy_id)
    if not proxy:
        raise HTTPException(404, "Proxy not found")

    try:
        async with httpx.AsyncClient(proxy=proxy.url, timeout=8) as client:
            resp = await client.get("http://httpbin.org/ip")
            is_working = resp.status_code == 200
    except Exception:
        is_working = False

    if is_working:
        proxy.success_count += 1
        proxy.is_active = True
    else:
        proxy.fail_count += 1
        proxy.is_active = False

    proxy.last_checked = datetime.utcnow()
    await db.commit()
    return {"working": is_working, **proxy_to_dict(proxy)}


@router.delete("/{proxy_id}")
async def delete_proxy(proxy_id: str, db: AsyncSession = Depends(get_db)):
    proxy = await db.get(ProxyEntry, proxy_id)
    if not proxy:
        raise HTTPException(404, "Proxy not found")
    await db.delete(proxy)
    await db.commit()
    return {"deleted": True}
