# -*- coding: utf-8 -*-
"""
全量回测调试脚本 —— 遍历指定日期所有池的所有板块的所有股票。

用法：
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/debug_layer2.py

断点建议位置：
    ① strategy.compute(df)           — 策略信号计算
    ② 主循环中当天信号判断           — 看 signal 值
"""

import os
import sys

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

import pandas as pd

from bt_framework.block_pool import BlockPoolSelector
from bt_framework.data_loader import load_stock, resolve_file_path
from bt_framework.examples.过前高炸板均线回撤买入策略 import Layer2BuyStrategy

# ============================================================
# 配置
# ============================================================
TEST_DATE = "2025-01-02"
POOL_TAGS = ["核心", "新兴", "趋势"]  # 测哪些池

# ============================================================
# 1. 加载板块池
# ============================================================
print("=" * 60)
print(f"1. 加载板块池，目标日期: {TEST_DATE}")
print("=" * 60)

pool = BlockPoolSelector()
date = pd.Timestamp(TEST_DATE)

pools = pool.identify_pools(date, debug=True)

# 筛选要测的板块
target_blocks = [c for c, t in pools.items() if t in POOL_TAGS]
print(f"\n本次测试: {len(target_blocks)} 个板块 ({', '.join(POOL_TAGS)})")

# ============================================================
# 2. 初始化策略
# ============================================================
print("\n" + "=" * 60)
print("2. 初始化策略")
print("=" * 60)

strategy = Layer2BuyStrategy(
    breakout_n=60,
    zt_days=10,
    ma_score_min=8,
    pullback_pct=0.03,
    rise_lookback=20,
    rise_min_pct=0.15,
)
print(f"  策略: {strategy.name}")
print(f"  参数: {strategy.params}")

# ============================================================
# 3. 逐板块、逐股票回测（全量）
# ============================================================
print("\n" + "=" * 60)
print("3. 逐板块全量回测（不限制股票数）")
print("=" * 60)

# 统计
total_stocks = 0
skipped_stocks = 0
total_buy = 0
total_sell = 0
today_buy = 0
today_sell = 0
block_stats = []  # [{block_code, stocks, buy_count, sell_count, today_buy, today_sell}]

for bi, block_code in enumerate(target_blocks):
    stocks = pool.get_stocks_for_block(block_code, date)
    stock_count = len(stocks)

    block_buy = 0
    block_sell = 0
    block_today_buy = 0
    block_today_sell = 0
    block_skipped = 0

    for si, code in enumerate(stocks):
        # ---- 断点①：加载数据 ----
        try:
            fpath = resolve_file_path(code)
            df, _ = load_stock(fpath)
        except Exception:
            block_skipped += 1
            continue

        # 截取回测日期之前的数据
        df_backtest = df[df.index <= date].copy()
        if len(df_backtest) < 120:
            block_skipped += 1
            continue  # 数据太少，不够算 MA60

        # ---- 断点②：策略计算 ----
        try:
            result = strategy.compute(df_backtest)
        except Exception:
            block_skipped += 1
            continue

        # 全时段信号统计
        buy_count = int((result["signal"] == 1).sum())
        sell_count = int((result["signal"] == -1).sum())
        block_buy += buy_count
        block_sell += sell_count

        # 当天信号
        if date in result.index:
            sig = int(result.loc[date, "signal"])
            if sig == 1:
                block_today_buy += 1
            elif sig == -1:
                block_today_sell += 1

    stocks_tested = stock_count - block_skipped
    total_stocks += stocks_tested
    skipped_stocks += block_skipped
    total_buy += block_buy
    total_sell += block_sell
    today_buy += block_today_buy
    today_sell += block_today_sell

    block_stats.append({
        "code": block_code,
        "tag": pools.get(block_code, "?"),
        "stocks": stock_count,
        "tested": stocks_tested,
        "buy": block_buy,
        "sell": block_sell,
        "today_buy": block_today_buy,
        "today_sell": block_today_sell,
    })

    print(
        f"  [{bi+1:3d}/{len(target_blocks)}] "
        f"{block_code} ({pools.get(block_code, '?')})  "
        f"股票{stock_count}→实测{stocks_tested}  "
        f"全时段买入{block_buy}/卖出{block_sell}  "
        f"当日买入{block_today_buy}/卖出{block_today_sell}"
    )

# ============================================================
# 4. 汇总
# ============================================================
print("\n" + "=" * 60)
print("4. 汇总")
print("=" * 60)
print(f"  测试日期: {TEST_DATE}")
print(f"  板块总数: {len(target_blocks)}")
print(f"  股票总数: {total_stocks}")
print(f"  跳过:     {skipped_stocks}")
print(f"  全时段买入信号: {total_buy}")
print(f"  全时段卖出信号: {total_sell}")
print(f"  当日({TEST_DATE})买入: {today_buy}")
print(f"  当日({TEST_DATE})卖出: {today_sell}")

# 按池汇总
print(f"\n  ── 按池汇总 ──")
for tag in POOL_TAGS:
    tag_blocks = [b for b in block_stats if b["tag"] == tag]
    if not tag_blocks:
        continue
    t_stocks = sum(b["tested"] for b in tag_blocks)
    t_buy = sum(b["buy"] for b in tag_blocks)
    t_sell = sum(b["sell"] for b in tag_blocks)
    t_today_buy = sum(b["today_buy"] for b in tag_blocks)
    t_today_sell = sum(b["today_sell"] for b in tag_blocks)
    print(f"  {tag}: {len(tag_blocks)}板块, {t_stocks}股票, "
          f"全时段买入{t_buy}/卖出{t_sell}, 当日买入{t_today_buy}/卖出{t_today_sell}")

# 当日有买入信号的股票（高亮）
today_buy_stocks = [
    b for b in block_stats if b["today_buy"] > 0
]
if today_buy_stocks:
    print(f"\n  ⚡ 当日有买入信号的板块:")
    for b in today_buy_stocks:
        print(f"    {b['code']} ({b['tag']})  {b['today_buy']}只")

print("\n全量回测完成。")
