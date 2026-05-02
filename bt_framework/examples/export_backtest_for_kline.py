# -*- coding: utf-8 -*-
"""
将回测 Excel 导出为 kline-web 可用的 JS 数据文件。

用法:
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/export_backtest_for_kline.py
"""
import json
import os
import sys

import pandas as pd

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

EXCEL_PATH = os.path.join(_PROJECT_ROOT, "reports", "引擎回测_prot_adj_2025-01-02_2025-12-31.xlsx")
OUTPUT_JS = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "backtest-trades.js")
OUTPUT_JSON = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "backtest-trades.json")


def main():
    df = pd.read_excel(EXCEL_PATH, sheet_name="交易明细")
    print(f"读取 {len(df)} 笔交易记录")

    # 按股票代码分组
    trades_by_code = {}

    for _, row in df.iterrows():
        code = str(row["股票代码"]).strip().zfill(6)
        buy_date = str(row["买入日期"]).strip()
        sell_date = str(row["卖出日期"]).strip()
        buy_price = float(row["买入价"])
        sell_price = float(row["卖出价"])
        hold_days = int(row["持仓天数"])
        pnl_pct = float(row["收益率%"])
        reason = str(row["卖出原因"]).strip()

        if code not in trades_by_code:
            trades_by_code[code] = {"daily": []}

        # 买入点
        trades_by_code[code]["daily"].append({
            "date": buy_date,
            "price": buy_price,
            "type": "buy",
        })
        # 卖出点
        trades_by_code[code]["daily"].append({
            "date": sell_date,
            "price": sell_price,
            "type": "sell",
            "reason": reason,
            "pnl_pct": pnl_pct,
            "hold_days": hold_days,
        })

    # 按日期排序每只股票的买卖点
    for code in trades_by_code:
        trades_by_code[code]["daily"].sort(key=lambda x: x["date"])

    print(f"涉及 {len(trades_by_code)} 只股票")

    # 导出 JS 文件（直接赋值到全局变量）
    js_content = (
        "// 自动生成，请勿手动编辑\n"
        "// 来源: 引擎回测_prot_adj_2025-01-02_2025-12-31.xlsx\n"
        f"// 交易: {len(df)} 笔, 股票: {len(trades_by_code)} 只\n"
        "var BACKTEST_TRADES = " + json.dumps(trades_by_code, ensure_ascii=False, indent=2) + ";\n"
    )
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"JS 文件已导出: {OUTPUT_JS} ({os.path.getsize(OUTPUT_JS)} bytes)")

    # 同时导出 JSON（备用）
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(trades_by_code, f, ensure_ascii=False, indent=2)
    print(f"JSON 文件已导出: {OUTPUT_JSON}")


if __name__ == "__main__":
    main()
