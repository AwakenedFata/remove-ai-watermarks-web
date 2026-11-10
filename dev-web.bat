@echo off
title AI Watermark Studio - Dev Mode
echo ========================================================
echo       AI Watermark Studio - Fullstack Dev Server
echo ========================================================
echo Starting Backend API (port 8000)...
start "Backend API" cmd /k "cd /d D:\remove-ai-watermarks-project && D:\python.exe -m uvicorn server.app:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo Starting Vite Dev Server (port 5173)...
start "Vite Dev" cmd /k "cd /d D:\remove-ai-watermarks-project\frontend && npm run dev"

timeout /t 2 /nobreak >nul
start http://localhost:5173
echo Running! Press any key in this window to close.
pause
