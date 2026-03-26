import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure `backend.*` imports work when running from inside backend directory.
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.api import ai, crawls, data, exports, proxy, settings as settings_api, spiders
from backend.api.scheduler_routes import router as scheduler_router
from backend.database import init_db
from backend.scheduler.job_scheduler import load_scheduled_jobs, start_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    start_scheduler()
    await load_scheduled_jobs()
    yield


app = FastAPI(
    title="Harvester API",
    description="Harvester Web Scraping Platform",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(spiders.router)
app.include_router(crawls.router)
app.include_router(data.router)
app.include_router(ai.router)
app.include_router(proxy.router)
app.include_router(exports.router)
app.include_router(settings_api.router)
app.include_router(scheduler_router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "Harvester"}
