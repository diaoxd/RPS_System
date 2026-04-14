@echo off
setlocal
cd /d c:\tool\RPS市场分析系统

REM Default port
set PORT=5001

echo Starting RPS web service...
start "" python web_app.py

timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:%PORT%/

echo Service started on http://127.0.0.1:%PORT%/
echo Close window to exit this launcher.
pause
