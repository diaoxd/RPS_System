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

# 原因编码 → 中文描述映射
BUY_REASON_MAP = {
    "F1+F2+F3": "均线多头+涨停基因+5日线上",
}

BUY_REASON_DETAIL = {
    "F1+F2+F3": {
        "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
        "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
        "F3 5日线上": "收盘价 > MA5 均线",
    },
}

SELL_REASON_MAP = {
    "signal": "PROT_ADJ移动止盈",
    "stop_loss": "-10%固定止损",
    "trailing": "PROT_ADJ移动止盈",
    "profit_lock_10pct": "保10%利润",
    "profit_lock_3pct": "保3%利润",
    "prot_adj_10pct": "PROT_ADJ止盈(>10%)",
    "flash_crash": "四天急跌5%止盈",
}

SELL_REASON_DETAIL = {
    "signal": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
    "trailing": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
    "stop_loss": "亏损达到-10%固定止损线，强制平仓",
    "profit_lock_10pct": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
    "profit_lock_3pct": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
    "prot_adj_10pct": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
    "flash_crash": "四天内最高价累计跌幅≥5%，触发急跌止盈",
}


def _map_reason(raw, mapping, default=None):
    """将原因编码映射为中文描述"""
    if not raw:
        return default or raw
    return mapping.get(raw, raw)


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

        raw_buy_reason = str(row.get("买入原因", "F1+F2+F3")).strip() if "买入原因" in row else "F1+F2+F3"
        raw_sell_reason = str(row["卖出原因"]).strip()

        buy_reason = _map_reason(raw_buy_reason, BUY_REASON_MAP)
        sell_reason = _map_reason(raw_sell_reason, SELL_REASON_MAP)
        buy_detail = BUY_REASON_DETAIL.get(raw_buy_reason, {})
        sell_detail = SELL_REASON_DETAIL.get(raw_sell_reason, raw_sell_reason)

        if code not in trades_by_code:
            trades_by_code[code] = {"daily": []}

        # 买入点
        trades_by_code[code]["daily"].append({
            "date": buy_date,
            "price": buy_price,
            "type": "buy",
            "reason": buy_reason,
            "reason_detail": buy_detail,
        })
        # 卖出点
        trades_by_code[code]["daily"].append({
            "date": sell_date,
            "price": sell_price,
            "type": "sell",
            "reason": sell_reason,
            "reason_detail": sell_detail,
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
        f"// 原因映射: 买入={list(BUY_REASON_MAP.values())}, 卖出={list(SELL_REASON_MAP.values())}\n"
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
