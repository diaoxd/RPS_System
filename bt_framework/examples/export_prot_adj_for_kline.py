# -*- coding: utf-8 -*-
"""
计算回测涉及股票的 PROT_ADJ 修正止盈线，导出为 kline-web 可用数据。

用法:
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/export_prot_adj_for_kline.py
"""
import json
import os
import sys
from collections import defaultdict

import numpy as np
import pandas as pd

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from bt_framework.data_loader import load_all_stock_data
from bt_framework.examples.moving_stop_profit import compute_moving_stop

BACKTEST_JSON = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "backtest-trades.json")
OUTPUT_JS = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "prot-adj-data.js")
OUTPUT_JSON = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "prot-adj-data.json")

TDX_DIR = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"


def main():
    # 1. 读取回测涉及的股票列表
    with open(BACKTEST_JSON, "r", encoding="utf-8") as f:
        trades_data = json.load(f)
    stock_codes = sorted(trades_data.keys())
    print(f"回测涉及 {len(stock_codes)} 只股票")

    # 2. 加载日线数据（多线程）
    print("加载日线数据...")
    stock_dfs = load_all_stock_data(stock_codes, tdx_dir=TDX_DIR, verbose=True, n_jobs=8)

    # 3. 计算 PROT_ADJ
    print("\n计算 PROT_ADJ...")
    prot_adj_data = {}
    success = 0

    for code in stock_codes:
        df = stock_dfs.get(code)
        if df is None or len(df) == 0:
            continue
        try:
            lines = compute_moving_stop(df)
            # 过滤有效值（让利修正_日线）
            prot_adj = lines["rangli_adjusted"]
            valid = prot_adj.notna() & (prot_adj > 0)

            # 输出格式: {date: value}，只保留有效日期
            date_map = {}
            for idx in prot_adj[valid].index:
                date_str = str(idx.date()) if hasattr(idx, "date") else str(idx)[:10]
                val = float(prot_adj[idx])
                date_map[date_str] = round(val, 2)

            if date_map:
                prot_adj_data[code] = date_map
                success += 1
        except Exception as e:
            pass

    print(f"  PROT_ADJ 计算成功: {success}/{len(stock_codes)}")

    # 4. 导出 JS
    js_content = (
        "// 自动生成，请勿手动编辑\n"
        "// PROT_ADJ 修正止盈线: {股票代码: {日期: 价格}}\n"
        f"// 股票数: {len(prot_adj_data)}\n"
        "var PROT_ADJ_DATA = " + json.dumps(prot_adj_data, ensure_ascii=False) + ";\n"
    )
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"JS 文件已导出: {OUTPUT_JS} ({os.path.getsize(OUTPUT_JS)} bytes)")

    # 5. 导出 JSON（备用）
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(prot_adj_data, f, ensure_ascii=False)
    print(f"JSON 文件已导出: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
