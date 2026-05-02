# -*- coding: utf-8 -*-
"""
从通达信 T0002/export 前复权 txt 计算 RPS，衔接「板块 → 个股 → 仓位」流程。

依赖：同仓库 通达信板块分析/block_rps_calculator.py（动态加载，避免包名问题）。
"""
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple

import pandas as pd

try:
    from 回测.data.tdx_export_loader import load_all_tdx_export_dir
except ImportError:
    from data.tdx_export_loader import load_all_tdx_export_dir

_REPO_ROOT = Path(__file__).resolve().parents[2]
_BRC_PATH = _REPO_ROOT / "通达信板块分析" / "block_rps_calculator.py"


def _load_block_rps_calculator():
    if not _BRC_PATH.is_file():
        raise FileNotFoundError(f"找不到: {_BRC_PATH}")
    spec = importlib.util.spec_from_file_location("block_rps_calculator", _BRC_PATH)
    mod = importlib.util.module_from_spec(spec)
    sys.modules["block_rps_calculator"] = mod
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return mod


def build_rps_from_export_dir(
    export_dir: str,
    periods: Sequence[int] = (5, 10, 20, 60),
    patterns: Tuple[str, ...] = ("sh*.txt", "sz*.txt", "bj*.txt"),
) -> pd.DataFrame:
    """
    对某一目录下全部导出 txt 计算各周期 RPS，返回长表（含 date, code, rps_N）。
    """
    brc = _load_block_rps_calculator()
    long_df = load_all_tdx_export_dir(export_dir, patterns=patterns)
    if long_df.empty:
        return pd.DataFrame()
    long_df = long_df.reset_index()
    if "date" not in long_df.columns:
        c0 = long_df.columns[0]
        long_df = long_df.rename(columns={c0: "date"})
    long_df = long_df[["date", "code", "close_adj"]]
    long_df = brc.compute_returns(long_df, list(periods))
    for n in periods:
        long_df = brc.compute_rps_rank_and_normalize(long_df, int(n), scale=1000)
    return long_df


def top_codes_by_rps(
    long_rps: pd.DataFrame,
    as_of_date,
    period: int = 20,
    top_k: int = 10,
) -> List[str]:
    """
    在指定交易日，按 rps_{period} 取前 top_k 个 code（板块或股票均可）。
    as_of_date: datetime / str / Timestamp，会转为当日日期比较。
    """
    col = f"rps_{period}"
    if long_rps.empty or col not in long_rps.columns:
        return []
    df = long_rps.copy()
    df["date"] = pd.to_datetime(df["date"])
    d = pd.to_datetime(as_of_date).normalize()
    day = df[df["date"].dt.normalize() == d]
    if day.empty:
        # 取不大于 as_of 的最近交易日
        past = df[df["date"].dt.normalize() <= d]
        if past.empty:
            return []
        last = past["date"].max()
        day = df[df["date"] == last]
    day = day.sort_values(col, ascending=False).head(top_k)
    return day["code"].astype(str).tolist()


def equal_weight_allocation(
    codes: Sequence[str],
    total_cash: float,
    max_single_pct: float = 0.2,
) -> Dict[str, float]:
    """
    简单等权资金分配（示例）：每只股票目标金额，且单票不超过总资金的 max_single_pct。

    Returns:
        code -> 目标买入金额（元）
    """
    if not codes:
        return {}
    n = len(codes)
    per = total_cash / n
    cap = total_cash * max_single_pct
    per = min(per, cap)
    return {c: float(per) for c in codes}
