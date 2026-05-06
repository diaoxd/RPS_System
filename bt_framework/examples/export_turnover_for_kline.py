# -*- coding: utf-8 -*-
"""
将个股换手率数据导出为 kline-web 可用的 JS 文件（紧凑数组格式）。

输出:
  var TURNOVER_DATES = ["2025-01-02", ...];        // 共享日期索引
  var TURNOVER_DATA = {"000001": [0.64, null, ...]}; // 值对齐日期索引

用法:
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/export_turnover_for_kline.py
"""
import json
import os
import sys

import pandas as pd

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from Tdx_ext_data_reader import load_stock_turnover_rate_extdata11

BACKTEST_JSON = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "backtest-trades.json")
OUTPUT_JS = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "turnover-data.js")


def main():
    # 1. 加载回测涉及的全部股票
    with open(BACKTEST_JSON, "r", encoding="utf-8") as f:
        backtest_data = json.load(f)

    backtest_stocks = set(str(c).strip().zfill(6) for c in backtest_data.keys())
    print(f"回测股票数: {len(backtest_stocks)}")

    # 2. 加载换手率数据
    print("加载换手率数据 (extdata_11)...")
    df = load_stock_turnover_rate_extdata11()
    if df is None or df.empty:
        print("换手率数据不可用")
        return

    df["code"] = df["code"].astype(str).str.strip().str.zfill(6)
    df["date"] = df["date"].astype(int)

    # 过滤: 只保留回测股票 + 2025年数据
    df = df[df["code"].isin(backtest_stocks)]
    df = df[(df["date"] >= 20250101) & (df["date"] <= 20260630)]  # 覆盖回测区间+当前
    print(f"过滤后: {len(df)} 行, {df['code'].nunique()} 只股票")

    # 3. 构建紧凑格式: date_index → turnover_rate 数组
    all_dates = sorted(df["date"].unique())
    date_list = []
    date_index = {}
    for d in all_dates:
        ds = f"{str(d)[:4]}-{str(d)[4:6]}-{str(d)[6:8]}"
        date_list.append(ds)
        date_index[d] = len(date_list) - 1

    print(f"日期数: {len(date_list)}, 范围: {date_list[0]} ~ {date_list[-1]}")

    # stock → [value or null] 数组
    turnover_data = {}
    for code in sorted(backtest_stocks):
        turnover_data[code] = [None] * len(date_list)

    for row in df.itertuples(index=False):
        code = str(row.code).strip().zfill(6)
        d = int(row.date)
        val = float(row.turnover_rate)
        idx = date_index.get(d)
        if idx is not None:
            turnover_data[code][idx] = round(val, 2)

    # 去掉全 null 的股票
    empty_stocks = [c for c, arr in turnover_data.items() if all(v is None for v in arr)]
    for c in empty_stocks:
        del turnover_data[c]
    print(f"有换手率数据的股票: {len(turnover_data)}/{len(backtest_stocks)}")

    # 4. 导出 JS（紧凑数组格式）
    # 序列化 turnover_data: 把 None 写成 null, 数字保留2位精度
    js_lines = [
        "// 自动生成，请勿手动编辑",
        "// 来源: 通达信 extdata_11.dat (个股换手率)",
        f"// 股票: {len(turnover_data)} 只, 日期: {len(date_list)} 天",
        f"// 范围: {date_list[0]} ~ {date_list[-1]}",
        "",
        "// 共享日期索引，TURNOVER_DATA 数组值对齐此索引",
        "var TURNOVER_DATES = " + json.dumps(date_list, ensure_ascii=False) + ";",
        "",
    ]

    # 每个股票的数组序列化
    parts = ["var TURNOVER_DATA = {"]
    for code in sorted(turnover_data.keys()):
        arr = turnover_data[code]
        # 压缩尾部 null
        last_idx = len(arr) - 1
        while last_idx >= 0 and arr[last_idx] is None:
            last_idx -= 1
        trimmed = arr[:last_idx + 1]
        arr_str = json.dumps(trimmed, separators=(',', ':'))
        parts.append(f'  "{code}": {arr_str},')
    parts.append("};")

    js_content = "\n".join(js_lines) + "\n" + "\n".join(parts)

    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"\nJS 文件已导出: {OUTPUT_JS} ({os.path.getsize(OUTPUT_JS):,} bytes)")


if __name__ == "__main__":
    main()
