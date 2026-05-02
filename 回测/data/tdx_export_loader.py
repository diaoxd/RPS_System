# -*- coding: utf-8 -*-
"""
通达信「数据导出」ASCII：T0002\\export 下 sh*.txt / sz*.txt / bj*.txt，空格分隔。

常见列：日期(YYYYMMDD) 开盘 最高 最低 收盘 [成交量] [成交额]
前复权导出时，收盘价已是复权价，可直接用于 RPS 涨幅计算。

与 block_rps_calculator 衔接：本模块产出与 load_single_csv 一致的长表字段
(date, code, close_adj)，再 concat 后走 compute_returns / compute_rps_rank_and_normalize。
"""
from __future__ import annotations

import os
import re
from pathlib import Path
from typing import List, Optional

import pandas as pd


def _parse_date_token(s: str) -> Optional[pd.Timestamp]:
    s = str(s).strip()
    if re.match(r"^\d{8}$", s):
        return pd.to_datetime(s, format="%Y%m%d")
    if re.match(r"^\d{8}\.0$", s):
        return pd.to_datetime(s.split(".")[0], format="%Y%m%d")
    return None


def load_tdx_export_txt(path: str, code: Optional[str] = None) -> pd.DataFrame:
    """
    读取单只通达信导出 txt（空格分隔，GBK 编码常见）。

    Returns:
        DataFrame: index=date, columns code, close_adj（close 即前复权收盘）
    """
    p = Path(path)
    if code is None:
        code = p.stem.lower()

    rows: List[tuple] = []
    encodings = ("gbk", "utf-8-sig", "utf-8")
    last_err = None
    for enc in encodings:
        try:
            with open(path, "r", encoding=enc, errors="replace") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    parts = line.split()
                    if len(parts) < 5:
                        continue
                    dt = _parse_date_token(parts[0])
                    if dt is None:
                        continue
                    try:
                        o, h, l, c = map(float, parts[1:5])
                    except ValueError:
                        continue
                    rows.append((dt, c))
            last_err = None
            break
        except OSError as e:
            last_err = e
    if last_err is not None:
        raise last_err
    if not rows:
        raise ValueError(f"无有效行情行: {path}")

    df = pd.DataFrame(rows, columns=["date", "close_adj"])
    df = df.sort_values("date").drop_duplicates(subset=["date"])
    df["code"] = code
    df = df.set_index("date")[["code", "close_adj"]]
    df.index.name = "date"
    return df


def load_all_tdx_export_dir(
    dir_path: str,
    patterns: tuple = ("sh*.txt", "sz*.txt", "bj*.txt"),
) -> pd.DataFrame:
    """
    扫描目录下符合前缀的 txt，合并为长表（index=date, 多 code 纵向 concat）。

    用于：
    - 板块指数导出：单独放一个目录，只扫该目录 → 板块 RPS
    - 个股导出：另一目录 → 成分股 RPS
    """
    root = Path(dir_path)
    if not root.is_dir():
        return pd.DataFrame()

    dfs: List[pd.DataFrame] = []
    for pat in patterns:
        for f in sorted(root.glob(pat)):
            try:
                dfs.append(load_tdx_export_txt(str(f)))
            except Exception as e:
                print(f"跳过 {f}: {e}")
    if not dfs:
        return pd.DataFrame()
    return pd.concat(dfs, axis=0)


def long_to_close_panel(long_df: pd.DataFrame) -> pd.DataFrame:
    """长表 → 宽表 date × code，值为 close_adj（供自定义计算）。"""
    if long_df.empty:
        return pd.DataFrame()
    x = long_df.reset_index()
    return x.pivot(index="date", columns="code", values="close_adj")
