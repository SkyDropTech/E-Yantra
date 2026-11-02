@echo off
echo ========================================================
echo Starting E-Yantra Wildlife Monitoring System
echo ========================================================

REM Start Backend Server
start "E-Yantra Backend (FastAPI)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

REM Start Frontend Server
start "E-Yantra Frontend (Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both services are starting:
echo  - Backend API: http://127.0.0.1:8000
echo  - API Docs:    http://127.0.0.1:8000/docs
echo  - Frontend UI: http://localhost:5173
echo ========================================================
