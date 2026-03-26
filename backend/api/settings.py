from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.database import get_db
from backend.models import AppSettings

router = APIRouter(prefix="/api/settings", tags=["settings"])


class SettingUpdate(BaseModel):
    key: str
    value: str


@router.get("")
async def get_all_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AppSettings))
    return {s.key: s.value for s in result.scalars().all()}


@router.post("")
async def upsert_setting(data: SettingUpdate, db: AsyncSession = Depends(get_db)):
    existing = await db.get(AppSettings, data.key)
    if existing:
        existing.value = data.value
    else:
        db.add(AppSettings(key=data.key, value=data.value))
    await db.commit()
    return {"key": data.key, "value": data.value}
