@echo off
chcp 65001 >nul
cd /d c:\tool\RPS市场分析系统
echo 正在运行RPS报告生成脚本（通达信扩展数据版）...
python rps_report_final_01.py
echo.
pause
