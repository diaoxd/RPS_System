# -*- coding: utf-8 -*-
"""
预计算板块池每日快照，存为 pickle。

输出: bt_framework/data/pool_daily_snapshots.pkl
格式: {"20250102": ["000001","000002",...], "20250103": [...], ...}

用途: 回测引擎不再逐日查DB，直接读快照，大幅加速。
"""

import json
import os
import sys
import time

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, _PROJECT_ROOT)

import pandas as pd
from SqlServerUtil import DBHelper
from bt_framework.block_pool import BlockPoolSelector

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "pool_daily_snapshots.pkl")

POOL_TAGS = ["核心", "新兴", "趋势"]
START_DATE = "2024-09-01"
END_DATE = "2026-04-30"


def load_sqlserver_config():
    cfg_path = os.path.join(_PROJECT_ROOT, "project_config.json")
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    sql = cfg.get("sqlserver", {})
    return {
        "host": sql.get("host", "127.0.0.1"),
        "database": sql.get("database", "tdx"),
        "user": sql.get("user", "sa"),
        "password": sql.get("password", ""),
    }


def main():
    print("=" * 60)
    print("预计算板块池每日快照")
    print("=" * 60)
    print(f"区间: {START_DATE} ~ {END_DATE}")
    print(f"池:   {POOL_TAGS}")
    print()

    cfg = load_sqlserver_config()
    db = DBHelper(cfg["host"], cfg["database"], cfg["user"], cfg["password"])
    pool = BlockPoolSelector(db_helper=db)

    all_dates = pool.get_all_dates()
    all_dates = [
        d for d in all_dates
        if pd.Timestamp(START_DATE) <= d <= pd.Timestamp(END_DATE)
    ]
    all_dates_sorted = sorted(all_dates)
    print(f"交易日: {len(all_dates_sorted)} 天")

    t0 = time.time()
    snapshots = {}
    for i, date in enumerate(all_dates_sorted):
        stocks = pool.get_pool_stocks(date, POOL_TAGS)
        date_str = date.strftime("%Y%m%d")
        snapshots[date_str] = stocks
        if (i + 1) % 50 == 0:
            elapsed = time.time() - t0
            print(f"  进度: {i+1}/{len(all_dates_sorted)} ({elapsed:.1f}s)")

    elapsed = time.time() - t0
    print(f"完成! 耗时: {elapsed:.1f}s")

    # 统计
    total_stocks = set()
    for stocks in snapshots.values():
        total_stocks.update(stocks)
    print(f"去重股票总数: {len(total_stocks)}")

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    import pickle
    with open(OUTPUT_PATH, "wb") as f:
        pickle.dump(snapshots, f, protocol=pickle.HIGHEST_PROTOCOL)

    file_size = os.path.getsize(OUTPUT_PATH) / 1024 / 1024
    print(f"已保存: {OUTPUT_PATH} ({file_size:.1f} MB)")


if __name__ == "__main__":
    main()
