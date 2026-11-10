@echo off
title AI Watermark Studio Web App
echo ========================================================
echo       AI Watermark Studio - Production Web App
echo ========================================================
echo Starting FastAPI + React Vite Unified Server on http://localhost:8000
echo.
cd /d "D:\remove-ai-watermarks-project"

:: Check if frontend dist exists, if not build it
if not exist "frontend\dist" (
    echo Building frontend production assets...
    cd frontend
    call npm run build
    cd ..
)

echo Opening browser...
start http://localhost:8000

echo Starting backend server...
D:\python.exe -m uvicorn server.app:app --host 0.0.0.0 --port 8000
pause
