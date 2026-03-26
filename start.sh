#!/bin/bash
cd "$(dirname "$0")"
echo "Starting Harvester..."
pip install -r backend/requirements.txt -q
cd frontend && npm install -s && cd ..
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
sleep 3
cd frontend && npm run dev &
echo "UI: http://localhost:5173"
echo "API: http://localhost:8000"
