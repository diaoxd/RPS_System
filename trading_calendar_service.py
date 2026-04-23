# -*- coding: utf-8 -*-
"""
A 股「最近应覆盖到的交易日」：**不使用 Tushare**。

- **QMT**：``ContextInfo.get_trading_dates`` 仅在 QMT 策略进程内可用。请在策略里把日期导出为
  逗号分隔 ``YYYY-MM-DD``，写入环境变量 ``RPS_QMT_TRADING_DATES``，或写入本仓库
  ``cache/qmt_trading_dates.txt``（见根目录 ``qmt_context_trading_dates_export.py`` 模板）。
- **无 QMT 数据时**：``get_expected_latest_trade_date`` 按本地星期近似对齐（**不含法定节假日**）。
"""

from __future__ import annotations

import os
import threading
import time
from datetime import date, datetime, timedelta
from typing import Literal

_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_DEFAULT_QMT_DATES_FILE = os.path.join(_BASE_DIR, "cache", "qmt_trading_dates.txt")

_cache_lock = threading.Lock()
_cache: dict = {"cache_day": None, "expected": None, "source": None, "note": None, "ts": 0.0}
_CACHE_TTL_SEC = 4 * 3600


def _parse_comma_yyyy_mm_dd(raw: str) -> list[date]:
    days: list[date] = []
    for part in (raw or "").split(","):
        p = part.strip()[:10]
        if len(p) < 10:
            continue
        try:
            days.append(datetime.strptime(p, "%Y-%m-%d").date())
        except ValueError:
            continue
    return days


def _read_qmt_calendar_raw() -> str:
    """环境变量优先，其次可选文件路径，再其次默认 cache 文件。"""
    env1 = os.environ.get("RPS_SSE_TRADING_DATES_LAST10", "").strip()
    if env1:
        return env1
    env2 = os.environ.get("RPS_QMT_TRADING_DATES", "").strip()
    if env2:
        return env2
    path = os.environ.get("RPS_QMT_TRADING_DATES_FILE", "").strip()
    candidates = []
    if path:
        candidates.append(path)
    candidates.append(_DEFAULT_QMT_DATES_FILE)
    for fp in candidates:
        try:
            with open(fp, "r", encoding="utf-8-sig") as f:
                s = f.read().strip()
                if s:
                    return s
        except OSError:
            continue
    return ""


def _expected_from_qmt_raw(raw: str, today: date) -> date | None:
    if not raw:
        return None
    days = _parse_comma_yyyy_mm_dd(raw)
    past = [d for d in days if d <= today]
    return max(past) if past else None


def _fallback_expected_trade_date(today: date) -> date:
    """弱兜底：周六日→周五，周一→上周五，其余→当天（不处理长假）。"""
    wd = today.weekday()
    if wd == 5:
        return today - timedelta(days=1)
    if wd == 6:
        return today - timedelta(days=2)
    if wd == 0:
        return today - timedelta(days=3)
    return today


def _fallback_open_days_between(lo: date, hi: date) -> list[date]:
    """区间内仅 **工作日（周一至周五）**，不剔除法定节假日。"""
    out: list[date] = []
    d = lo
    while d <= hi:
        if d.weekday() < 5:
            out.append(d)
        d += timedelta(days=1)
    return out


def get_expected_latest_trade_date() -> tuple[date, Literal["fallback", "qmt_calendar"], str | None]:
    """
    返回用于与 board_rps_daily.MAX(trade_date) 对比的「期望最近交易日」。

    返回:
        (expected_date, source, note)
        - ``qmt_calendar``：来自 QMT 导出（环境变量或 ``cache/qmt_trading_dates.txt``）
        - ``fallback``：本地星期规则
    """
    today = date.today()
    raw = _read_qmt_calendar_raw()
    ex_qmt = _expected_from_qmt_raw(raw, today)
    if ex_qmt is not None:
        return (
            ex_qmt,
            "qmt_calendar",
            "来自 QMT 导出：RPS_QMT_TRADING_DATES / RPS_SSE_TRADING_DATES_LAST10 / cache/qmt_trading_dates.txt",
        )

    now = time.time()
    with _cache_lock:
        if (
            _cache["cache_day"] == today
            and _cache["expected"] is not None
            and _cache.get("source") == "fallback"
            and now - float(_cache["ts"]) < _CACHE_TTL_SEC
        ):
            return _cache["expected"], "fallback", _cache["note"]

    expected = _fallback_expected_trade_date(today)
    note: str | None = "本地星期对齐，不含法定节假日；精确日历请用 QMT ContextInfo 导出到环境变量或 cache 文件"

    with _cache_lock:
        _cache["cache_day"] = today
        _cache["expected"] = expected
        _cache["source"] = "fallback"
        _cache["note"] = note
        _cache["ts"] = time.time()

    return expected, "fallback", note


def sse_trading_days_between(lo: date, hi: date) -> tuple[list[date], str]:
    """
    闭区间 [lo, hi] 内的「交易日」列表：**仅工作日**，不含法定节假日判断。
    """
    return _fallback_open_days_between(lo, hi), "fallback_weekdays"


def list_last_n_sse_trading_days(n: int = 10, end_date: date | None = None) -> tuple[list[date], str]:
    """
    以 end_date（默认：QMT 导出推断的最近交易日，否则本地星期近似）为右端点，向过去取至多 n 个交易日。

    QMT ``ContextInfo.get_trading_dates`` 仅在策略进程内可用；导出为逗号分隔 ``YYYY-MM-DD`` 到
    ``RPS_SSE_TRADING_DATES_LAST10`` / ``RPS_QMT_TRADING_DATES``，或 ``cache/qmt_trading_dates.txt``。
    """
    today = date.today()
    raw = _read_qmt_calendar_raw()

    if end_date is not None:
        end = end_date
    else:
        ex = _expected_from_qmt_raw(raw, today)
        end = ex if ex is not None else _fallback_expected_trade_date(today)

    if raw:
        days = sorted({d for d in _parse_comma_yyyy_mm_dd(raw) if d <= end})
        if days:
            return (days[-n:] if len(days) > n else days), "qmt_calendar"

    lo = end - timedelta(days=400)
    all_open, src = sse_trading_days_between(lo, end)
    if not all_open:
        return [], src
    tail = all_open[-n:] if len(all_open) > n else all_open
    return tail, src


def resolve_sector_constituents_trade_date(explicit: date | None = None) -> tuple[date, str]:
    """
    ``sector_stocks_daily.trade_date`` 语义：成分股快照所对应的 **A 股交易日**，
    不是执行 tqcenter 拉取动作时的系统日历日（避免周末/节假日误入库）。

    - ``explicit`` 非空：由调用方指定（如增量补某日）；
    - ``explicit`` 为空：使用 ``get_expected_latest_trade_date()``，与 ``board_rps_daily``、报告悬停单元格交易日对齐。

    返回:
        (trade_date, log_note) — log_note 供入库日志一行说明来源。
    """
    if explicit is not None:
        return explicit, "调用方指定交易日"
    d, src, note = get_expected_latest_trade_date()
    tail = f"; {note}" if note else ""
    return d, f"期望最近交易日({src}){tail}"


def invalidate_trade_cal_cache() -> None:
    """报告生成成功后如需立即重算日历期望，可调用清空缓存。"""
    with _cache_lock:
        _cache["cache_day"] = None
        _cache["expected"] = None
        _cache["source"] = None
        _cache["note"] = None
        _cache["ts"] = 0.0
