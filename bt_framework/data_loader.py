# -*- coding: utf-8 -*-
"""
通达信数据加载 —— 将股票代码映射为本地文件，返回 DataFrame。
"""

import os
import re
import sys

import pandas as pd

# bt_framework 的父目录 = 项目根目录
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, _PROJECT_ROOT)

from 分析前复权日线 import parse_single_file
from Tdx_ext_data_reader import load_stock_turnover_rate_extdata11

# 通达信日线导出目录
DEFAULT_TDX_DIR = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"


def resolve_file_path(code: str, tdx_dir: str = DEFAULT_TDX_DIR):
    """将股票代码转换为通达信文件路径"""
    code = code.strip()
    # 已有完整前缀如 SH#600519
    if "#" in code:
        return os.path.join(tdx_dir, f"{code}.txt")
    # 市场前缀如 SH600519
    if code.startswith(("SH", "SZ", "BJ")):
        market = code[:2]
        num = code[2:]
        return os.path.join(tdx_dir, f"{market}#{num}.txt")
    # 纯数字，逐个市场试探
    for market in ("SH", "SZ", "BJ"):
        fpath = os.path.join(tdx_dir, f"{market}#{code}.txt")
        if os.path.exists(fpath):
            return fpath
    return os.path.join(tdx_dir, f"SH#{code}.txt")  # 默认返回 SH


def load_stock(file_path: str, turnover_df=None):
    """
    读取一只股票的通达信日线，可选合并换手率。

    返回 (df, code)
        - df: 索引为 date，含 Open,High,Low,Close,volume,amount,turnover_rate,prev_close
        - code: 6 位股票代码
    """
    stock_name, df = parse_single_file(file_path)

    m = re.search(r"(\d{6})", os.path.basename(file_path))
    code = m.group(1) if m else stock_name

    df["date"] = pd.to_datetime(df["date"])

    # 合并换手率
    if turnover_df is not None and code in turnover_df["code"].values:
        tdf = (
            turnover_df[turnover_df["code"] == code][["date", "turnover_rate"]]
            .copy()
        )
        tdf["date"] = pd.to_datetime(tdf["date"])
        df = df.merge(tdf, on="date", how="left")
        df["turnover_rate"] = df["turnover_rate"].fillna(0.0)
    else:
        df["turnover_rate"] = 0.0

    # 前收盘（用于涨跌停判断）
    df["prev_close"] = df["Close"].shift(1)

    df.set_index("date", inplace=True)
    return df, code


def load_all_stock_data(codes, tdx_dir: str = DEFAULT_TDX_DIR, verbose=True):
    """批量加载多只股票数据，返回 {code: DataFrame}"""
    print("加载换手率数据...")
    turnover_df = load_stock_turnover_rate_extdata11()

    result = {}
    skipped = 0
    for code in codes:
        fpath = resolve_file_path(code, tdx_dir)
        if not os.path.exists(fpath):
            if verbose:
                print(f"  [跳过] 文件不存在: {os.path.basename(fpath)}")
            skipped += 1
            continue
        try:
            df, real_code = load_stock(fpath, turnover_df)
            result[real_code] = df
            if verbose:
                print(
                    f"  [OK] {real_code}  "
                    f"({df.index[0].date()} ~ {df.index[-1].date()}, "
                    f"{len(df)} 日线)"
                )
        except Exception as e:
            if verbose:
                print(f"  [跳过] {os.path.basename(fpath)}: {e}")
            skipped += 1

    print(f"  成功加载: {len(result)} 只, 跳过: {skipped} 只")
    return result
