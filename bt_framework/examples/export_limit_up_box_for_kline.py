# -*- coding: utf-8 -*-
"""
计算回测涉及股票的涨停箱体模型，导出为 kline-web 可用数据。

每个股票可能有多个箱体，按规则标记：
  - largest_idx: 120日内最大的箱体
  - nearest_idx: 最接近当前日期的箱体
  - second_nearest_idx: 倒数第二近的箱体
  （三者可能是同一个，前端会去重渲染）

用法:
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/export_limit_up_box_for_kline.py
"""
import json
import os
import sys

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from bt_framework.data_loader import load_all_stock_data
from bt_framework.examples.limit_up_box import find_models

BACKTEST_JSON = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "backtest-trades.json")
OUTPUT_JS = os.path.join(_PROJECT_ROOT, "回测", "display", "kline-web", "js", "data", "limit-up-box-data.js")

TDX_DIR = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"


def _col(df, name):
    """兼容大小写列名"""
    for col in df.columns:
        if col.lower() == name.lower():
            return col
    return name


def _find_break_date(close_arr, top_idx, bottom_price, top_price):
    """
    从 top_idx+1 开始向后查找箱体突破日。
    跌破底部或突破顶部，箱体在该日结束（含该日）。
    未突破则返回最后一个索引。
    """
    n = len(close_arr)
    for i in range(top_idx + 1, n):
        if close_arr[i] < bottom_price or close_arr[i] > top_price:
            return i
    return n - 1  # 一直未被突破，持续到最新数据


def main():
    # 1. 读取回测涉及的股票列表
    with open(BACKTEST_JSON, "r", encoding="utf-8") as f:
        trades_data = json.load(f)
    stock_codes = sorted(trades_data.keys())
    print(f"回测涉及 {len(stock_codes)} 只股票")

    # 2. 加载日线数据（多线程）
    print("加载日线数据...")
    stock_dfs = load_all_stock_data(stock_codes, tdx_dir=TDX_DIR, verbose=True, n_jobs=8)

    # 3. 计算涨停箱体
    print("\n计算涨停箱体...")
    box_data = {}
    total_boxes = 0
    stock_with_boxes = 0

    for code in stock_codes:
        df = stock_dfs.get(code)
        if df is None or len(df) < 10:
            continue
        try:
            high_arr = df[_col(df, "high")].values
            close_arr = df[_col(df, "close")].values
            low_arr = df[_col(df, "low")].values

            models = find_models(high_arr, close_arr, low_arr, max_search_days=150)
            if not models:
                continue

            dates = df.index
            boxes = []
            for m in models:
                bottom_date = (str(dates[m["bottom_idx"]].date())
                               if hasattr(dates[m["bottom_idx"]], "date")
                               else str(dates[m["bottom_idx"]])[:10])
                top_date = (str(dates[m["top_idx"]].date())
                            if hasattr(dates[m["top_idx"]], "date")
                            else str(dates[m["top_idx"]])[:10])

                # 计算突破日：从 top_idx 之后开始找
                break_idx = _find_break_date(
                    close_arr, m["top_idx"],
                    m["bottom_price"], m["top_price"]
                )
                break_date = (str(dates[break_idx].date())
                              if hasattr(dates[break_idx], "date")
                              else str(dates[break_idx])[:10])

                boxes.append({
                    "bottom_date": bottom_date,
                    "top_date": top_date,
                    "break_date": break_date,
                    "bottom_price": m["bottom_price"],
                    "top_price": m["top_price"],
                    "box_size": m["box_size"],
                    "bottom_idx": m["bottom_idx"],
                    "top_idx": m["top_idx"],
                    "break_idx": int(break_idx),
                })

            n = len(boxes)
            if n == 0:
                continue

            # 标记: 按 box_size 降序，取前三大
            sorted_by_size = sorted(range(n), key=lambda i: boxes[i]["box_size"], reverse=True)
            idx1 = sorted_by_size[0]
            idx2 = sorted_by_size[1] if n >= 2 else idx1
            idx3 = sorted_by_size[2] if n >= 3 else idx2

            box_data[code] = {
                "boxes": boxes,
                "largest_idx": idx1,
                "second_largest_idx": idx2,
                "third_largest_idx": idx3,
            }
            stock_with_boxes += 1
            total_boxes += n
        except Exception:
            pass

    print(f"  箱体计算成功: {stock_with_boxes}/{len(stock_codes)} 只股票, 共 {total_boxes} 个箱体")

    # 4. 导出 JS
    js_content = (
        "// 自动生成，请勿手动编辑\n"
        "// 涨停箱体模型: {股票代码: {boxes: [...], largest_idx, second_largest_idx, third_largest_idx}}\n"
        f"// 股票数: {len(box_data)}, 总箱体数: {total_boxes}\n"
        "var LIMIT_UP_BOX = " + json.dumps(box_data, ensure_ascii=False) + ";\n"
    )
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write(js_content)
    print(f"JS 文件已导出: {OUTPUT_JS} ({os.path.getsize(OUTPUT_JS)} bytes)")


if __name__ == "__main__":
    main()
