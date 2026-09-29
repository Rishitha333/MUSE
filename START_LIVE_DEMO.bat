@echo off
title MUSE - Live Cloudflare Demo Launcher
echo ============================================================
echo   MUSE: Multilingual Sentiment & Sarcasm Engine
echo   Live Demo Launcher (Backend + Cloudflare Tunnel)
echo ============================================================
echo.

cd /d "%~dp0"

REM 1. Check / Start MongoDB
echo [1/3] Checking MongoDB...
sc query MongoDB | findstr "RUNNING" >nul
if errorlevel 1 (
    echo     Starting local MongoDB service...
    net start MongoDB >nul 2>&1
    if errorlevel 1 (
        echo     [!] Note: If using MongoDB Atlas in backend/.env, local service is optional.
    ) else (
        echo     [OK] MongoDB is running.
    )
) else (
    echo     [OK] MongoDB is running.
)
echo.

REM 2. Start Backend
echo [2/3] Starting MUSE Backend on port 5000...
start "MUSE Backend API (port 5000)" cmd /k "cd /d "%~dp0\backend" && call venv311\Scripts\activate.bat && python app.py"

echo     Waiting for backend to initialize...
timeout /t 6 /nobreak >nul
echo     [OK] Backend launched.
echo.

REM 3. Start Cloudflare Tunnel
echo [3/3] Starting Cloudflare Public Tunnel...
echo ============================================================
echo   LOOK BELOW: Cloudflare will generate your public HTTPS URL!
echo   It will look like: https://xxxx-xxxx.trycloudflare.com
echo   Copy that URL and use it as VITE_API_URL on Vercel!
echo ============================================================
echo.

"%~dp0\cloudflared.exe" tunnel --url http://127.0.0.1:5000

pause
