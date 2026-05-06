# -*- coding: utf-8 -*-
"""
将所有通达信日线 .txt 文件合并为单个 pickle 文件，加速回测数据加载。

输出: bt_framework/data/stock_daily.pkl
列:   code, date, Open, High, Low, Close, volume, amount
"""

import os
import re
import sys
from concurrent.futures import ProcessPoolExecutor

import pandas as pd

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, _PROJECT_ROOT)

TDX_DIR = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "stock_daily.pkl")
FILENAME_PATTERN = re.compile(r"^(BJ|SH|SZ)#(\d{6})", re.IGNORECASE)


def _parse_one(filepath):
    """解析单个通达信文件，返回 DataFrame（含 code 列）"""
    fname = os.path.basename(filepath)
    m = FILENAME_PATTERN.match(fname)
    if not m:
        return None
    market, code = m.group(1), m.group(2)
    full_code = f"{market}{code}"

    try:
        with open(filepath, "r", encoding="gbk", errors="ignore") as f:
            lines = [line.strip() for line in f if line.strip()]
    except Exception:
        return None

    if len(lines) < 3:
        return None

    records = []
    for row in lines[2:]:
        parts = [x.strip() for x in row.split(",")]
        if len(parts) < 7:
            continue
        try:
            records.append({
                "date": parts[0],
                "Open": float(parts[1]),
                "High": float(parts[2]),
                "Low": float(parts[3]),
                "Close": float(parts[4]),
                "volume": float(parts[5]),
                "amount": float(parts[6]),
            })
        except ValueError:
            continue

    if not records:
        return None

    df = pd.DataFrame(records)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"]).sort_values("date")
    df["code"] = full_code
    return df


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    all_files = sorted([
        os.path.join(TDX_DIR, f)
        for f in os.listdir(TDX_DIR)
        if f.endswith(".txt") and FILENAME_PATTERN.match(f)
    ])
    print(f"找到 {len(all_files)} 个日线文件")

    n_workers = min(8, os.cpu_count() or 4)
    print(f"使用 {n_workers} 进程并行解析...")

    dfs = []
    with ProcessPoolExecutor(max_workers=n_workers) as executor:
        for i, df in enumerate(executor.map(_parse_one, all_files)):
            if df is not None:
                dfs.append(df)
            if (i + 1) % 500 == 0:
                print(f"  已处理 {i+1}/{len(all_files)}, 有效 {len(dfs)} 只")

    print(f"有效股票: {len(dfs)} 只, 正在合并...")

    full_df = pd.concat(dfs, ignore_index=True)

    # 只保留 2024-09-01 起的数据（往前60天做MA缓冲即可，其余历史不需要）
    cut_date = pd.Timestamp("2024-09-01")
    full_df = full_df[full_df["date"] >= cut_date]

    for col in ["Open", "High", "Low", "Close", "volume", "amount"]:
        full_df[col] = full_df[col].astype("float32")

    total_rows = len(full_df)
    print(f"总行数: {total_rows:,} (日期 ≥ 2024-09-01)")

    print(f"写入 {OUTPUT_PATH} ...")
    full_df.to_pickle(OUTPUT_PATH)

    file_size_mb = os.path.getsize(OUTPUT_PATH) / 1024 / 1024
    print(f"完成! 文件大小: {file_size_mb:.1f} MB")
    print(f"股票数: {full_df['code'].nunique()}")
    print(f"日期范围: {full_df['date'].min().date()} ~ {full_df['date'].max().date()}")


if __name__ == "__main__":
    main()
