@echo off
chcp 65001 >nul
cd /d c:\tool\RPS市场分析系统
echo 正在运行RPS报告生成脚本...
python rps_report_final.py
echo 正在清理data文件夹，保留最近3个月数据...
powershell -Command "& { $limit=(Get-Date).AddMonths(-3); Get-ChildItem 'data' -Filter '*.xlsx' | Where-Object { $_.Name -match '(\d{8})' } | ForEach-Object { $dateStr = $matches[1]; $fileDate = [datetime]::ParseExact($dateStr, 'yyyyMMdd', $null); if ($fileDate -lt $limit) { Remove-Item $_.FullName -Force; Write-Host '已删除:' $_.Name } } }"
echo 清理完成。
pause