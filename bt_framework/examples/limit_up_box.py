# -*- coding: utf-8 -*-
"""
涨停箱体模型 — 从 C++ TCalcFuncSets.cpp 翻译为 Python。

核心思路：
  1. 从 search_end_idx 向左扫描，找到"孤立涨停"作为箱体底部
  2. 从底部向右扫描，找到箱体顶部（受涨停数、涨幅、连续非涨停天数约束）
  3. 修正底部（区间内涨停K线的最低价）和顶部（区间内涨停K线的最高价）
  4. 多个箱体按大小排序，取最大的作为最终结果

适配 kline-web：
  - search_end_idx 参数支持在任意位置截断数据查找（回测时在买入日T查找）
  - 返回包含日期信息，方便前端直接使用

参考: C:\tool\stock\通达信dll编程\zhangtingPluginTCale\TCalcFuncSets.cpp
"""

import numpy as np
import pandas as pd


def round_float(num: float, decimal_places: int = 2) -> float:
    """保留指定小数位数"""
    factor = 10.0 ** decimal_places
    return round(num * factor) / factor


def is_limit_up(high: float, close: float, prev_close: float) -> bool:
    """
    判断是否为涨停或炸板。
    zt: 收盘价 >= 前收盘价 x 1.1（精确到2位小数）
    zb: 收盘价 < 涨停价，但最高价 >= 涨停价（炸板）
    """
    zt = close >= round_float(prev_close * 1.1, 2)
    zb = (close < high) and (high >= round_float(prev_close * 1.1, 2))
    return zt or zb


def has_gap(open_price: float, prev_close: float) -> bool:
    """判断是否有跳空缺口（开盘价高于前收盘价）"""
    return open_price > prev_close * 1.001


def find_bottom(high_arr, close_arr, low_arr, search_end_idx: int) -> int:
    """
    从 search_end_idx-1 向左扫描，寻找孤立涨停底部。
    条件：当前K线是涨停/炸板，且前1~4天都不是涨停/炸板。

    参数:
        search_end_idx: 搜索终点（不含），从这个位置开始向左扫描。
                        传入 len(data) 表示从数据末尾扫描。

    返回: 底部索引（0-based），未找到返回 -1
    """
    if search_end_idx < 5:
        return -1

    for i in range(search_end_idx - 1, 3, -1):
        if is_limit_up(high_arr[i], close_arr[i], close_arr[i - 1]):
            valid = True
            for j in range(1, 5):
                if is_limit_up(high_arr[i - j], close_arr[i - j], close_arr[i - j - 1]):
                    valid = False
                    break
            if valid:
                return i
    return -1


def find_top(high_arr, close_arr, low_arr, bottom_idx: int,
             search_end_idx: int = None) -> int:
    """
    从底部向右寻找箱体顶部。
    停止条件：
      - 涨停数 >= 5 → 返回 -1（模型失效）
      - 涨幅 > 47% → 返回当前索引作为顶部
      - 连续非涨停天数 > 3 → 返回最后一个涨停索引作为顶部

    参数:
        search_end_idx: 搜索上限（不含），顶部不能超过此索引。
                        传入 None 则搜索到数据末尾。

    返回: 顶部索引（0-based），-1 表示失效
    """
    data_len = len(close_arr)
    max_idx = search_end_idx if search_end_idx is not None else data_len

    if bottom_idx < 0 or bottom_idx >= max_idx:
        return -1
    if bottom_idx >= max_idx - 1:
        return bottom_idx

    bottom_price = min(low_arr[bottom_idx], close_arr[bottom_idx - 1])

    limit_up_count = 1
    last_limit_up_idx = bottom_idx

    for i in range(bottom_idx + 1, max_idx):
        if is_limit_up(high_arr[i], close_arr[i], close_arr[i - 1]):
            limit_up_count += 1
            last_limit_up_idx = i

            if limit_up_count >= 5:
                return -1

            increase = (max(close_arr[i], high_arr[i]) - bottom_price) / bottom_price
            if increase > 0.47:
                return i
        else:
            limit_up_count = 0
            if last_limit_up_idx != -1:
                non_limit_up_days = i - last_limit_up_idx
                if non_limit_up_days > 3:
                    return last_limit_up_idx

    if last_limit_up_idx != -1:
        return last_limit_up_idx
    return -1


def find_min_bottom(bottom_idx: int, top_idx: int,
                    close_arr, high_arr, low_arr) -> int:
    """
    在 [bottom_idx, top_idx] 区间内，找到涨停K线中最低价最小的索引。
    这修正了原始底部可能不是真正最低点的问题。
    """
    tmp_low_idx = bottom_idx
    for i in range(bottom_idx + 1, top_idx + 1):
        if (low_arr[i] <= low_arr[tmp_low_idx]
                and is_limit_up(high_arr[i], close_arr[i], close_arr[i - 1])):
            tmp_low_idx = i
    return tmp_low_idx


def find_max_high_top(bottom_idx: int, top_idx: int,
                      close_arr, high_arr, low_arr) -> int:
    """
    在 [bottom_idx, top_idx] 区间内，找到涨停K线中最高价最大的索引。
    这修正了原始顶部可能不是真正最高点的问题。
    """
    tmp_high_idx = bottom_idx
    for i in range(bottom_idx + 1, top_idx + 1):
        if (high_arr[i] >= high_arr[tmp_high_idx]
                and is_limit_up(high_arr[i], close_arr[i], close_arr[i - 1])):
            tmp_high_idx = i
    return tmp_high_idx


def calc_box_size(bottom_idx: int, top_idx: int,
                  close_arr, high_arr, low_arr) -> float:
    """
    计算箱体大小（百分比）。
    箱底 = min(low[bottom_idx], close[bottom_idx-1])
    箱顶 = high[top_idx]
    大小 = 100 x (箱顶 - 箱底) / 箱底
    """
    bottom_price = min(low_arr[bottom_idx], close_arr[bottom_idx - 1])
    top_price = high_arr[top_idx]
    if bottom_price <= 0:
        return 0.0
    return 100.0 * (top_price - bottom_price) / bottom_price


def sort_boxes_by_size(bottom_arr, top_arr, n,
                       close_arr, high_arr, low_arr):
    """按箱体大小降序排列（冒泡排序），返回排序后的箱体大小数组。"""
    sizes = np.zeros(n)
    for i in range(n):
        sizes[i] = calc_box_size(bottom_arr[i], top_arr[i],
                                 close_arr, high_arr, low_arr)

    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if sizes[j] < sizes[j + 1]:
                bottom_arr[j], bottom_arr[j + 1] = bottom_arr[j + 1], bottom_arr[j]
                top_arr[j], top_arr[j + 1] = top_arr[j + 1], top_arr[j]
                sizes[j], sizes[j + 1] = sizes[j + 1], sizes[j]
                swapped = True
        if not swapped:
            break
    return sizes


def find_models(high_arr, close_arr, low_arr,
                max_search_days: int = 120,
                search_end_idx: int = None):
    """
    主函数：寻找所有涨停箱体模型，返回按大小排序的结果。

    参数:
        high_arr: 最高价数组
        close_arr: 收盘价数组
        low_arr: 最低价数组
        max_search_days: 最大搜索天数（默认120）
        search_end_idx: 搜索终点索引（不含），从该位置向左扫描。
                        None = 数据末尾（适用于展示场景）
                        传入具体索引 = 从该位置截断（适用于回测场景，在买入日T查找）

    返回: list of dict, 按箱体大小降序排列
        [{"bottom_idx": int, "top_idx": int, "box_size": float,
          "bottom_price": float, "top_price": float}, ...]
    """
    data_len = len(close_arr)
    end_idx = search_end_idx if search_end_idx is not None else data_len

    bott_arr = [-1] * 60
    top_arr = [-1] * 60
    real_bott_arr = [-1] * 60
    real_top_arr = [-1] * 60

    current_idx = end_idx
    search_count = 0
    i = 0

    # 第一步：搜索所有底部和顶部配对（向前最多120天）
    while current_idx >= 0 and search_count < max_search_days and i < 60:
        bottom_idx = find_bottom(high_arr, close_arr, low_arr, current_idx)
        bott_arr[i] = bottom_idx

        if bottom_idx == -1:
            break

        # top 也不能超过 end_idx（对于回测场景，不能看到未来数据）
        top_idx = find_top(high_arr, close_arr, low_arr, bottom_idx, search_end_idx)
        top_arr[i] = top_idx
        i += 1

        if top_idx == -1:
            break

        current_idx = bottom_idx
        search_count = end_idx - current_idx

    # 第二步：修正底部和顶部（找到区间内涨停K线的真实极值）
    ii = 0
    while ii < 60 and bott_arr[ii] != -1:
        if top_arr[ii] == -1:
            break

        real_bottom = find_min_bottom(bott_arr[ii], top_arr[ii],
                                      close_arr, high_arr, low_arr)
        real_top = find_max_high_top(bott_arr[ii], top_arr[ii],
                                     close_arr, high_arr, low_arr)

        real_bott_arr[ii] = real_bottom
        real_top_arr[ii] = real_top
        ii += 1

    if ii == 0:
        return []

    # 第三步：复制数组用于排序
    dest_bott = list(real_bott_arr[:ii])
    dest_top = list(real_top_arr[:ii])

    # 第四步：按箱体大小降序排列
    sizes = sort_boxes_by_size(dest_bott, dest_top, ii,
                               close_arr, high_arr, low_arr)

    # 构建结果
    results = []
    for k in range(ii):
        bottom_price = min(low_arr[dest_bott[k]], close_arr[dest_bott[k] - 1])
        top_price = high_arr[dest_top[k]]
        results.append({
            "bottom_idx": int(dest_bott[k]),
            "top_idx": int(dest_top[k]),
            "box_size": float(round(sizes[k], 2)),
            "bottom_price": float(round(bottom_price, 2)),
            "top_price": float(round(top_price, 2)),
        })

    return results


def find_largest_box(high_arr, close_arr, low_arr,
                     max_search_days: int = 120,
                     search_end_idx: int = None):
    """
    便捷函数：找到最大的涨停箱体模型。

    参数:
        search_end_idx: 搜索终点索引，None = 数据末尾

    返回: dict 或 None
    """
    models = find_models(high_arr, close_arr, low_arr, max_search_days, search_end_idx)
    if models:
        return models[0]
    return None


def find_box_for_df(df: pd.DataFrame, max_search_days: int = 120,
                    search_end_idx: int = None):
    """
    从 DataFrame 中查找涨停箱体。

    参数:
        df: 包含 high/High, close/Close, low/Low 列的 DataFrame，按日期升序排列
        max_search_days: 最大搜索天数
        search_end_idx: 搜索终点索引，None = 数据末尾

    返回: dict 或 None
    """
    col_map = {}
    for col in df.columns:
        col_map[col.lower()] = col
    high_arr = df[col_map["high"]].values
    close_arr = df[col_map["close"]].values
    low_arr = df[col_map["low"]].values
    return find_largest_box(high_arr, close_arr, low_arr, max_search_days, search_end_idx)


def is_price_in_box(price: float, box: dict) -> bool:
    """判断价格是否在箱体区间内 [箱底, 箱顶]"""
    if box is None:
        return False
    return box["bottom_price"] <= price <= box["top_price"]


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
    return n - 1


def compute_boxes_for_df(df, max_search_days=150):
    """
    从 DataFrame 计算所有涨停箱体，返回供前端使用的完整 dict。

    参数:
        df: 包含 high/High, close/Close, low/Low 列的 DataFrame，按日期升序排列，日期索引
        max_search_days: 最大搜索天数

    返回: {"boxes": [...], "largest_idx": int, "second_largest_idx": int, "third_largest_idx": int} 或 None
    """
    col_map = {}
    for col in df.columns:
        col_map[col.lower()] = col
    high_arr = df[col_map["high"]].values
    close_arr = df[col_map["close"]].values
    low_arr = df[col_map["low"]].values

    models = find_models(high_arr, close_arr, low_arr, max_search_days=max_search_days)
    if not models:
        return None

    dates = df.index
    boxes = []
    for m in models:
        bottom_date = (str(dates[m["bottom_idx"]].date())
                       if hasattr(dates[m["bottom_idx"]], "date")
                       else str(dates[m["bottom_idx"]])[:10])
        top_date = (str(dates[m["top_idx"]].date())
                    if hasattr(dates[m["top_idx"]], "date")
                    else str(dates[m["top_idx"]])[:10])
        break_idx = _find_break_date(close_arr, m["top_idx"], m["bottom_price"], m["top_price"])
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
            "bottom_idx": int(m["bottom_idx"]),
            "top_idx": int(m["top_idx"]),
            "break_idx": int(break_idx),
        })

    n = len(boxes)
    sorted_by_size = sorted(range(n), key=lambda i: boxes[i]["box_size"], reverse=True)
    idx1 = sorted_by_size[0]
    idx2 = sorted_by_size[1] if n >= 2 else idx1
    idx3 = sorted_by_size[2] if n >= 3 else idx2

    return {
        "boxes": boxes,
        "largest_idx": idx1,
        "second_largest_idx": idx2,
        "third_largest_idx": idx3,
    }


# ── 测试入口 ──
if __name__ == "__main__":
    import sys
    sys.path.insert(0, "c:/tool/RPS市场分析系统")

    from bt_framework.data_loader import load_all_stock_data
    import json
    import os

    BACKTEST_JSON = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "回测", "display", "kline-web", "js", "data", "backtest-trades.json"
    )
    TDX_DIR = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"

    with open(BACKTEST_JSON, "r", encoding="utf-8") as f:
        trades_data = json.load(f)

    stock_codes = sorted(trades_data.keys())[:10]
    print(f"测试股票: {stock_codes}")

    stock_dfs = load_all_stock_data(stock_codes, tdx_dir=TDX_DIR, verbose=True, n_jobs=4)

    for code in stock_codes:
        df = stock_dfs.get(code)
        if df is None or len(df) < 10:
            continue
        box = find_box_for_df(df)
        if box:
            dates = df.index
            bottom_date = str(dates[box["bottom_idx"]].date()) if hasattr(dates[box["bottom_idx"]], "date") else str(dates[box["bottom_idx"]])[:10]
            top_date = str(dates[box["top_idx"]].date()) if hasattr(dates[box["top_idx"]], "date") else str(dates[box["top_idx"]])[:10]
            print(f"\n{code}: 箱体大小={box['box_size']:.1f}%")
            print(f"  底部: {bottom_date} 价格={box['bottom_price']:.2f}")
            print(f"  顶部: {top_date} 价格={box['top_price']:.2f}")
        else:
            print(f"\n{code}: 未找到涨停箱体")
