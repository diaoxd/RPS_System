# -*- coding: utf-8 -*-
"""
Layer2 策略 — 逐股票完整生命周期回测。

每只股票从买入到卖出展示完整链路：
  板块 → 股票代码 → 买入日期 → 买入价 → 卖出日期 → 卖出价 → 持仓天数 → 收益率 → 卖出原因

用法：
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/Layer2策略_逐股完整生命周期回测.py
"""

import os
import sys

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from collections import defaultdict

import pandas as pd

from bt_framework.engine import BacktestEngine
from bt_framework.block_pool import BlockPoolSelector
from bt_framework.examples.过前高炸板均线回撤买入策略 import Layer2BuyStrategy

# ============================================================
# 配置
# ============================================================
TEST_DATE = "2025-01-02"       # 从哪天开始回测
END_DATE = "2025-06-30"        # 回测结束日（调试先跑半年）
POOL_TAGS = ["核心"]  # 调试时先只测核心池，放开可加 "新兴", "趋势"
CASH = 1_000_000
MAX_PER_STOCK = 0.10           # 单只最大仓位 10%

# ============================================================
# 1. 加载板块池（保留 debug 输出看池子构成）
# ============================================================
print("=" * 60)
print(f"1. 加载板块池，目标日期: {TEST_DATE}")
print("=" * 60)

pool = BlockPoolSelector()
date = pd.Timestamp(TEST_DATE)
pools = pool.identify_pools(date, debug=True)

target_blocks = [c for c, t in pools.items() if t in POOL_TAGS]
print(f"本次测试: {len(target_blocks)} 个板块 ({', '.join(POOL_TAGS)})")

# ============================================================
# 2. 初始化策略 & 引擎
# ============================================================
print("\n" + "=" * 60)
print("2. 初始化策略 & 引擎")
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

engine = BacktestEngine(verbose=False)
engine.set_block_pool(pool, tags=POOL_TAGS)
engine.set_strategy(strategy)
engine.set_cash(CASH)
engine.set_commission(0.001)
engine.set_max_per_stock(MAX_PER_STOCK)
# 风控：移动止损 8%，固定止损 7%
engine.set_trailing_stop(0.08)
engine.set_stop_loss(0.07)
engine.set_date_range(TEST_DATE, END_DATE)

# ============================================================
# 3. 运行回测
# ============================================================
print(f"\n回测区间: {TEST_DATE} → {END_DATE}\n")

result = engine.run()

# ============================================================
# 4. 展示：每笔交易的完整生命周期（买入 → 持有 → 卖出）
# ============================================================
print("\n" + "=" * 120)
print("4. 逐股交易生命周期明细（买入 → 卖出）")
print("=" * 120)

# 将买入和卖出配对
buy_map = {}           # code -> [未配对买入]
closed_trades = []     # [(买入记录, 卖出记录)]
open_positions = []    # 尚未卖出的买入记录

for t in result.trades:
    if t.action == "buy":
        buy_map.setdefault(t.code, []).append(t)
    elif t.action == "sell":
        if t.code in buy_map and buy_map[t.code]:
            buy_rec = buy_map[t.code].pop(0)
            closed_trades.append((buy_rec, t))
        # 卖出但没有买入记录（回测开始前就持仓的），跳过

# 剩余未配对买入 = 未平仓
for code, buys in buy_map.items():
    for b in buys:
        open_positions.append(b)

closed_trades.sort(key=lambda x: x[0].date)

# --- 建立股票→板块 反查表 ---
stock_block = {}
for block_code in target_blocks:
    for s in pool.get_stocks_for_block(block_code, date):
        stock_block[s] = block_code

block_tag = {c: pools.get(c, "?") for c in target_blocks}

all_codes = sorted(set(t[0].code for t in closed_trades) | set(b.code for b in open_positions))

total_pnl = 0.0
total_win = 0
total_loss = 0

for code in all_codes:
    code_trades = [(b, s) for b, s in closed_trades if b.code == code]
    code_opens = [b for b in open_positions if b.code == code]

    blk = stock_block.get(code, "?")
    tag = block_tag.get(blk, "?")

    pnl_sum = sum(s.pnl for _, s in code_trades)
    win_count = sum(1 for _, s in code_trades if s.pnl > 0)
    loss_count = len(code_trades) - win_count

    total_pnl += pnl_sum
    total_win += win_count
    total_loss += loss_count

    print(f"\n{'─' * 120}")
    print(f"  【{code}】 {tag}池 / 板块{blk}  "
          f"交易{len(code_trades)}笔（盈{win_count} 亏{loss_count}）  "
          f"累计盈亏: {pnl_sum:+,.0f}元")

    for bi, (b, s) in enumerate(code_trades):
        ret_pct = (s.price - b.price) / b.price * 100
        print(
            f"    #{bi+1:02d}  "
            f"买入 {b.date} @{b.price:>8.2f}  →  "
            f"卖出 {s.date} @{s.price:>8.2f}  │  "
            f"持仓 {s.hold_days:>3d}天  │  "
            f"收益率 {ret_pct:>+7.2f}%  │  "
            f"盈亏 {s.pnl:>+10,.0f}元  │  "
            f"触发: {s.reason}"
        )

    # 未平仓（还没卖出的持仓）
    for b in code_opens:
        print(
            f"    [未平仓] 买入 {b.date} @{b.price:>8.2f}  —  尚未触发卖出"
        )

# ============================================================
# 5. 汇总
# ============================================================
print(f"\n{'=' * 120}")
print("5. 汇总统计")
print(f"{'=' * 120}")

total_closed = len(closed_trades)
if total_closed > 0:
    win_rate = total_win / total_closed * 100

    # 持仓天数分布
    hold_days_list = [s.hold_days for _, s in closed_trades]
    avg_hold = sum(hold_days_list) / len(hold_days_list)
    max_hold = max(hold_days_list)
    min_hold = min(hold_days_list)

    print(f"  回测区间: {TEST_DATE} → {END_DATE}")
    print(f"  已平仓交易: {total_closed} 笔  |  盈利 {total_win} 笔 / 亏损 {total_loss} 笔  |  胜率 {win_rate:.1f}%")
    print(f"  交易盈亏合计: {total_pnl:+,.0f}元")
    print(f"  持仓天数: 平均 {avg_hold:.0f}天 / 最短 {min_hold}天 / 最长 {max_hold}天")
    print(f"  未平仓: {len(open_positions)} 笔")

    # 按卖出原因统计
    print(f"\n  卖出原因分布:")
    reason_stats = defaultdict(lambda: {"count": 0, "pnl": 0.0, "avg_hold": []})
    for _, s in closed_trades:
        reason_stats[s.reason]["count"] += 1
        reason_stats[s.reason]["pnl"] += s.pnl
        reason_stats[s.reason]["avg_hold"].append(s.hold_days)

    for reason, stats in sorted(reason_stats.items(), key=lambda x: -x[1]["count"]):
        avg_h = sum(stats["avg_hold"]) / len(stats["avg_hold"])
        print(f"    {reason}: {stats['count']}笔, 盈亏合计 {stats['pnl']:+,.0f}元, 平均持仓 {avg_h:.0f}天")
else:
    print("  无已平仓交易")

# 按池汇总
print(f"\n  按池汇总:")
for tag in POOL_TAGS:
    tag_codes = [c for c in all_codes if block_tag.get(stock_block.get(c, ""), "") == tag]
    if not tag_codes:
        continue
    tag_trades = [(b, s) for b, s in closed_trades if b.code in tag_codes]
    if not tag_trades:
        print(f"    {tag}: {len(tag_codes)}只股票, 无交易")
        continue
    tag_pnl = sum(s.pnl for _, s in tag_trades)
    tag_win = sum(1 for _, s in tag_trades if s.pnl > 0)
    print(f"    {tag}: {len(tag_codes)}只股票, {len(tag_trades)}笔交易, "
          f"胜率{tag_win/len(tag_trades)*100:.0f}%, 盈亏{tag_pnl:+,.0f}元")

print(f"\n{result}")
print("\n全量回测完成。")
