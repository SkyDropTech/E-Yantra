# E-Yantra Service Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting E-Yantra Wildlife Monitoring System..." -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

$root = $PSScriptRoot

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm run dev"

Write-Host "Services launched in background windows:" -ForegroundColor Yellow
Write-Host " - Backend API: http://127.0.0.1:8000" -ForegroundColor White
Write-Host " - API Docs:    http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host " - Frontend UI: http://localhost:5173" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
