@echo off
echo Starting Harvester...
cd /d "%~dp0"

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt --quiet
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install --silent
cd ..

echo Starting backend...
start "Harvester Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak > nul

echo Starting frontend...
start "Harvester Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 4 /nobreak > nul

echo.
echo ====================================
echo  HARVESTER is running!
echo  UI:  http://localhost:5173
echo  API: http://localhost:8000
echo ====================================

start http://localhost:5173
