# Harvester - Web Scraping Platform

Harvester is a production-grade web scraping platform built on Scrapy 2.14.2 (BSD-3).

## Features
- Visual no-code spider builder (click elements to select)
- AI-style selector assistance via free heuristic analysis
- Smart anti-bot evasion (rotating UAs, delays, fingerprinting)
- Free proxy rotation with auto-import
- Real-time crawl monitoring with WebSocket logs
- Scheduled crawls with cron expressions
- Export to JSON, CSV, XLSX
- Scrapy-powered async engine with Playwright support

## Setup and Run

### Windows
Double-click `start.bat`

### Mac/Linux
```bash
chmod +x start.sh && ./start.sh
```

Open http://localhost:5173

## AI Notes
This build is configured to work without paid Anthropic API usage.
Selector generation uses built-in heuristic logic by default.

## Architecture
- Backend: FastAPI + Scrapy + SQLite
- Frontend: React + Vite + Tailwind
- Real-time: WebSockets
- Scheduler: APScheduler
