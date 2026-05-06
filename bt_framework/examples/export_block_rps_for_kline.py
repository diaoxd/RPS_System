# -*- coding: utf-8 -*-
"""
将板块RPS数据 + 股票→板块映射导出为 kline-web 可用的 JS 数据文件。

输出两个全局变量：
  BLOCK_STOCK_MAP:  stock_code → [{code, name}]  (股票所属板块, 基于最新成分股数据)
  BLOCK_RPS_BY_DATE: block_code → {date_str: {r20, r60, r120}}

用法:
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/export_block_rps_for_kline.py
"""
import json
import os
import sys

import sqlite3

import pandas as pd

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from Tdx_ext_data_reader import load_all_rps_merged
from SqlServerUtil import DBHelper

TDX_BLOCKS_DB = os.path.join(_PROJECT_ROOT, "tdx_blocks.db")


def load_block_name_map():
    """从 tdx_blocks.db 加载 block_code → block_name 映射"""
    if not os.path.exists(TDX_BLOCKS_DB):
        print(f"警告: {TDX_BLOCKS_DB} 不存在，板块名称将使用代码")
        return {}
    conn = sqlite3.connect(TDX_BLOCKS_DB)
    cur = conn.cursor()
    cur.execute("SELECT DISTINCT code, name FROM block ORDER BY code")
    name_map = {}
    for code, name in cur.fetchall():
        name_map[str(code).strip()] = str(name).strip()
    conn.close()
    print(f"从 tdx_blocks.db 加载 {len(name_map)} 个板块名称")
    return name_map

BACKTEST_JSON = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "backtest-trades.json")
OUTPUT_JS = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "block-rps-data.js")
OUTPUT_JSON = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "block-rps-data.json")


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
        "table": sql.get("sector_stocks_table", "sector_stocks_daily"),
    }


def main():
    # 1. 加载回测涉及的全部股票代码和日期
    with open(BACKTEST_JSON, "r", encoding="utf-8") as f:
        backtest_data = json.load(f)

    backtest_stocks = set(str(c).strip().zfill(6) for c in backtest_data.keys())
    all_dates = set()
    for sd in backtest_data.values():
        for t in sd.get("daily", []):
            all_dates.add(t["date"])
    all_dates = sorted(all_dates)

    print(f"回测股票数: {len(backtest_stocks)}")
    print(f"交易日期数: {len(all_dates)}")
    print(f"日期范围:   {all_dates[0]} ~ {all_dates[-1]}")

    # 2. 加载板块名称映射（从 SQLite）
    block_name_map = load_block_name_map()

    # 3. 从 SQL Server 加载股票→板块映射（取最新交易日数据）
    cfg = load_sqlserver_config()
    db = DBHelper(cfg["host"], cfg["database"], cfg["user"], cfg["password"])

    # 获取最新交易日
    df_latest_date = db.read_data(
        f"SELECT MAX(trade_date) FROM {cfg['table']}"
    )
    latest_date = df_latest_date.iloc[0, 0]
    print(f"\n板块成分股最新日期: {latest_date}")

    # 查询回测股票的板块归属
    stock_list = "','".join(backtest_stocks)
    sql_map = (
        f"SELECT stock_code, sector_code, sector_name "
        f"FROM {cfg['table']} "
        f"WHERE trade_date = '{latest_date}' "
        f"AND stock_code IN ('{stock_list}') "
        f"ORDER BY stock_code, sector_code"
    )
    df_map = db.read_data(sql_map)
    print(f"股票→板块映射: {len(df_map)} 条")

    # 构建 stock → [{code, name}] 映射
    block_stock_map = {}
    used_blocks = set()
    for row in df_map.itertuples(index=False):
        stock = str(row[0]).strip().zfill(6)
        block_code = str(row[1]).strip()
        # 优先用 SQLite 中的中文名，其次用 SQL Server 中的名称
        block_name = block_name_map.get(block_code) or str(row[2]).strip() if row[2] else block_code
        used_blocks.add(block_code)
        block_stock_map.setdefault(stock, []).append({
            "code": block_code,
            "name": block_name,
        })

    # 为没有映射数据的股票添加空数组
    for stock in backtest_stocks:
        if stock not in block_stock_map:
            block_stock_map[stock] = []

    stocks_with_blocks = sum(1 for v in block_stock_map.values() if v)
    print(f"有板块归属的股票: {stocks_with_blocks}/{len(backtest_stocks)}")
    print(f"涉及板块数: {len(used_blocks)}")

    # 3. 加载板块 RPS 数据
    print("\n加载板块 RPS 数据...")
    rps_df = load_all_rps_merged(scale_0_100=True)
    rps_df["code"] = rps_df["code"].astype(str).str.strip()
    rps_df["date"] = rps_df["date"].astype(int)
    print(f"板块 RPS 总行数: {len(rps_df)}, 板块数: {rps_df['code'].nunique()}")

    # 过滤：只保留回测涉及的板块和日期范围
    rps_df = rps_df[rps_df["code"].isin(used_blocks)]
    start_date_int = int(all_dates[0].replace("-", ""))
    end_date_int = int(all_dates[-1].replace("-", ""))
    rps_df = rps_df[(rps_df["date"] >= start_date_int) & (rps_df["date"] <= end_date_int)]
    print(f"过滤后: {len(rps_df)} 行 (板块数: {rps_df['code'].nunique()})")

    # 4. 构建 block_code → {date_str: {r20, r60, r120}} 映射
    block_rps_by_date = {}
    for row in rps_df.itertuples(index=False):
        block_code = str(row.code).strip()
        date_int = int(row.date)
        date_str = f"{str(date_int)[:4]}-{str(date_int)[4:6]}-{str(date_int)[6:8]}"

        r20 = round(float(row.RPS20), 1) if hasattr(row, 'RPS20') and pd.notna(row.RPS20) else None
        r60 = round(float(row.RPS60), 1) if hasattr(row, 'RPS60') and pd.notna(row.RPS60) else None
        r120 = round(float(row.RPS120), 1) if hasattr(row, 'RPS120') and pd.notna(row.RPS120) else None

        block_rps_by_date.setdefault(block_code, {})[date_str] = {
            "r20": r20,
            "r60": r60,
            "r120": r120,
        }

    # 统计覆盖情况
    blocks_with_rps = len(block_rps_by_date)
    print(f"\n有 RPS 数据的板块: {blocks_with_rps}/{len(used_blocks)}")

    # 5. 导出 JS 文件
    js_lines = [
        "// 自动生成，请勿手动编辑",
        "// 来源: SQL Server sector_stocks_daily + extdata 板块RPS",
        f"// 回测股票: {len(backtest_stocks)} 只, 板块: {blocks_with_rps} 个, 日期: {len(all_dates)} 天",
        "",
        "// 股票→板块映射（基于最新成分股数据）",
        "var BLOCK_STOCK_MAP = " + json.dumps(block_stock_map, ensure_ascii=False, indent=2) + ";",
        "",
        "// 板块RPS按日期: block_code → {date: {r20, r60, r120}}",
        "var BLOCK_RPS_BY_DATE = " + json.dumps(block_rps_by_date, ensure_ascii=False, indent=2) + ";",
        "",
    ]

    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write("\n".join(js_lines))
    print(f"\nJS 文件已导出: {OUTPUT_JS} ({os.path.getsize(OUTPUT_JS):,} bytes)")

    # 同时导出 JSON 备用
    json_data = {
        "block_stock_map": block_stock_map,
        "block_rps_by_date": block_rps_by_date,
    }
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(json_data, f, ensure_ascii=False, indent=2)
    print(f"JSON 文件已导出: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
