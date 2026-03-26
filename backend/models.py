import uuid
from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


def gen_id():
    return str(uuid.uuid4())


class Spider(Base):
    __tablename__ = "spiders"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_id)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    start_urls: Mapped[list] = mapped_column(JSON, default=list)
    fields: Mapped[list] = mapped_column(JSON, default=list)
    custom_code: Mapped[str] = mapped_column(Text, default="")
    use_playwright: Mapped[bool] = mapped_column(Boolean, default=False)
    follow_links: Mapped[bool] = mapped_column(Boolean, default=False)
    follow_link_selector: Mapped[str] = mapped_column(String, default="")
    max_pages: Mapped[int] = mapped_column(Integer, default=100)
    download_delay: Mapped[float] = mapped_column(Float, default=1.0)
    randomize_delay: Mapped[bool] = mapped_column(Boolean, default=True)
    rotate_user_agent: Mapped[bool] = mapped_column(Boolean, default=True)
    use_proxies: Mapped[bool] = mapped_column(Boolean, default=False)
    respect_robots: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    crawl_jobs: Mapped[list["CrawlJob"]] = relationship(
        "CrawlJob", back_populates="spider", cascade="all, delete-orphan"
    )


class CrawlJob(Base):
    __tablename__ = "crawl_jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_id)
    spider_id: Mapped[str] = mapped_column(String, ForeignKey("spiders.id"), nullable=False)
    status: Mapped[str] = mapped_column(String, default="pending")
    items_scraped: Mapped[int] = mapped_column(Integer, default=0)
    pages_crawled: Mapped[int] = mapped_column(Integer, default=0)
    errors: Mapped[int] = mapped_column(Integer, default=0)
    requests_per_minute: Mapped[float] = mapped_column(Float, default=0.0)
    log: Mapped[str] = mapped_column(Text, default="")
    started_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    finished_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    spider: Mapped["Spider"] = relationship("Spider", back_populates="crawl_jobs")
    items: Mapped[list["ScrapedItem"]] = relationship(
        "ScrapedItem", back_populates="crawl_job", cascade="all, delete-orphan"
    )


class ScrapedItem(Base):
    __tablename__ = "scraped_items"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_id)
    crawl_job_id: Mapped[str] = mapped_column(
        String, ForeignKey("crawl_jobs.id"), nullable=False
    )
    spider_id: Mapped[str] = mapped_column(String, nullable=False)
    data: Mapped[dict] = mapped_column(JSON, default=dict)
    url: Mapped[str] = mapped_column(String, default="")
    fingerprint: Mapped[str] = mapped_column(String, default="")
    scraped_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    crawl_job: Mapped["CrawlJob"] = relationship("CrawlJob", back_populates="items")


class ScheduledJob(Base):
    __tablename__ = "scheduled_jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_id)
    spider_id: Mapped[str] = mapped_column(String, ForeignKey("spiders.id"), nullable=False)
    cron_expression: Mapped[str] = mapped_column(String, nullable=False)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    last_run: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    next_run: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ProxyEntry(Base):
    __tablename__ = "proxies"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=gen_id)
    url: Mapped[str] = mapped_column(String, nullable=False)
    protocol: Mapped[str] = mapped_column(String, default="http")
    country: Mapped[str] = mapped_column(String, default="")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    success_count: Mapped[int] = mapped_column(Integer, default=0)
    fail_count: Mapped[int] = mapped_column(Integer, default=0)
    last_checked: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    added_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AppSettings(Base):
    __tablename__ = "app_settings"

    key: Mapped[str] = mapped_column(String, primary_key=True)
    value: Mapped[str] = mapped_column(Text, default="")
