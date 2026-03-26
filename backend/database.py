from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = "sqlite+aiosqlite:///./harvester.db"

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        from backend.models import (
            AppSettings,
            CrawlJob,
            ProxyEntry,
            ScheduledJob,
            ScrapedItem,
            Spider,
        )

        _ = (Spider, CrawlJob, ScrapedItem, ScheduledJob, ProxyEntry, AppSettings)
        await conn.run_sync(Base.metadata.create_all)
