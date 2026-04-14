@echo off
setlocal
cd /d c:\tool\RPS市场分析系统

REM Fixed port for web_app
set PORT=5001

echo [1/3] Cleaning old process on port %PORT% ...
powershell -NoProfile -Command ^
  "$p = Get-NetTCPConnection -LocalPort %PORT% -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if($p){$p | ForEach-Object { try { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } catch {} }};"

echo [1.5/3] Clearing report cache key ...
if exist "c:\tool\RPS市场分析系统\cache\latest_report_key.txt" del /f /q "c:\tool\RPS市场分析系统\cache\latest_report_key.txt" >nul 2>nul

echo [2/3] Starting web_app.py ...
start "" python web_app.py

echo [3/3] Waiting for server ...
timeout /t 3 /nobreak >nul

echo Triggering report regeneration ...
powershell -NoProfile -Command ^
  "$u='http://127.0.0.1:%PORT%/api/report/trigger'; try { $r=Invoke-WebRequest $u -Method POST -UseBasicParsing -TimeoutSec 8; Write-Host $r.Content } catch { Write-Host 'trigger failed'; }"

echo Checking runtime module ...
powershell -NoProfile -Command ^
  "$u='http://127.0.0.1:%PORT%/api/report/status'; try { $r=Invoke-WebRequest $u -UseBasicParsing -TimeoutSec 5; $j=$r.Content | ConvertFrom-Json; Write-Host ('report_module=' + $j.report_module); Write-Host ('report_file=' + $j.report_file) } catch { Write-Host 'runtime check failed'; }"

echo Opening browser ...
start "" http://127.0.0.1:%PORT%/
start "" http://127.0.0.1:%PORT%/api/runtime

echo Done. Ensure report_module is rps_report_final_04 and report_file is RPS_多周期分析报告_04.html.
pause
