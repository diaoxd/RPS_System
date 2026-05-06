# -*- coding: utf-8 -*-
"""
回调箱体策略 — 2025年全年回测。

买入: MA20/MA30↑ + 回调上穿MA5 + 涨停箱体区间
卖出: PROT_ADJ 移动止盈
费用: 手续费+印花税 千分之1.5 (双边各0.075%)
资金: 100万初始, 单票10%仓位上限, 复利计算

用法:
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/run_pullback_box_2025.py
"""

import json
import os
import sys
from collections import defaultdict

import pandas as pd

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from SqlServerUtil import DBHelper
from bt_framework.engine import BacktestEngine
from bt_framework.block_pool import BlockPoolSelector
from bt_framework.examples.pullback_box_strategy import PullbackBoxStrategy


def _load_sqlserver_config():
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


# ============================================================
# 回测参数
# ============================================================
START_DATE = "2025-01-02"
END_DATE = "2025-12-31"
POOL_TAGS = ["核心", "新兴", "趋势"]
INITIAL_CASH = 1_000_000
COMMISSION = 0.00075
MAX_PER_STOCK = 0.1
STOP_LOSS = 0.10
PROFIT_PROTECTION = True
N_JOBS = 8

# 新策略参数
MA_SHORT = 5       # MA5 作为回调参考
MA_TREND_A = 20    # MA20 趋势确认
MA_TREND_B = 30    # MA30 趋势确认（与MA20二选一即可）
BOX_LOOKBACK = 120  # 箱体搜索天数

print("=" * 60)
print("回调箱体策略 — 2025年回测")
print("=" * 60)
print(f"策略: MA{MA_TREND_A}/{MA_TREND_B}↑ + 上穿MA{MA_SHORT} + 涨停箱体{BOX_LOOKBACK}日")
print(f"回测区间: {START_DATE} → {END_DATE}")
print(f"初始资金: {INITIAL_CASH:,.0f}")
print(f"单票上限: {MAX_PER_STOCK*100:.0f}%")
print(f"并行进程: {N_JOBS}")
print()

# ============================================================
# 1. 连接数据库 + 加载板块池
# ============================================================
print("=" * 60)
print("1. 初始化数据库 + 核心池")
print("=" * 60)

cfg = _load_sqlserver_config()
db = DBHelper(cfg["host"], cfg["database"], cfg["user"], cfg["password"])

pool = BlockPoolSelector(db_helper=db)
date = pd.Timestamp(START_DATE)
pools = pool.identify_pools(date, debug=True)

target_blocks = [c for c, t in pools.items() if t in POOL_TAGS]
print(f"核心池板块数: {len(target_blocks)}")

# ============================================================
# 2. 初始化策略 & 引擎
# ============================================================
print(f"\n{'=' * 60}")
print("2. 初始化策略 & 引擎")
print("=" * 60)

strategy = PullbackBoxStrategy(
    ma_short=MA_SHORT,
    ma_trend_a=MA_TREND_A,
    ma_trend_b=MA_TREND_B,
    box_lookback=BOX_LOOKBACK,
)
print(f"  策略: {strategy.name}")
print(f"  参数: {strategy.params}")

engine = BacktestEngine(verbose=True, n_jobs=N_JOBS)
engine.set_block_pool(pool, tags=POOL_TAGS)
engine.set_strategy(strategy)
engine.set_cash(INITIAL_CASH)
engine.set_commission(COMMISSION)
engine.set_max_per_stock(MAX_PER_STOCK)
engine.set_stop_loss(STOP_LOSS)
engine.set_profit_protection(PROFIT_PROTECTION)
engine.set_date_range(START_DATE, END_DATE)

# ============================================================
# 3. 运行回测
# ============================================================
print(f"\n{'=' * 60}")
print(f"3. 运行回测: {START_DATE} → {END_DATE}")
print("=" * 60)

result = engine.run()


# ============================================================
# 4. 配对 → 完整交易记录
# ============================================================
buy_map = {}
closed_trades = []
open_positions = []

for t in result.trades:
    if t.action == "buy":
        buy_map.setdefault(t.code, []).append(t)
    elif t.action == "sell":
        if t.code in buy_map and buy_map[t.code]:
            buy_rec = buy_map[t.code].pop(0)
            closed_trades.append((buy_rec, t))

for code, buys in buy_map.items():
    for b in buys:
        open_positions.append(b)

closed_trades.sort(key=lambda x: x[0].date)


# ============================================================
# 5. 统计
# ============================================================
print(f"\n{'=' * 60}")
print("5. 回测统计")
print("=" * 60)

total_closed = len(closed_trades)
if total_closed > 0:
    total_win = sum(1 for _, s in closed_trades if s.pnl > 0)
    total_loss = sum(1 for _, s in closed_trades if s.pnl <= 0)
    win_rate = total_win / total_closed * 100
    total_pnl = sum(s.pnl for _, s in closed_trades)
    total_commission = sum(t.commission for t in result.trades)
    pnl_list = [s.pnl for _, s in closed_trades]

    hold_days_list = [s.hold_days for _, s in closed_trades if s.hold_days > 0]
    avg_hold = sum(hold_days_list) / len(hold_days_list) if hold_days_list else 0

    print(f"\n  总交易:   {total_closed}  胜率: {win_rate:.1f}%")
    print(f"  总盈亏:   {total_pnl:+,.0f}元  总手续费: {total_commission:,.0f}元")
    print(f"  最大盈利: {max(pnl_list):+,.0f}  最大亏损: {min(pnl_list):+,.0f}")
    print(f"  平均持仓: {avg_hold:.1f}天")

    # 卖出原因分布
    print(f"\n  卖出原因:")
    reason_stats = defaultdict(lambda: {"count": 0, "pnl": 0.0})
    for _, s in closed_trades:
        reason_stats[s.reason]["count"] += 1
        reason_stats[s.reason]["pnl"] += s.pnl
    for reason, stats in sorted(reason_stats.items(), key=lambda x: -x[1]["count"]):
        print(f"    {reason}: {stats['count']}笔, 盈亏{stats['pnl']:+,.0f}元")

    # 买入原因分布
    print(f"\n  买入原因:")
    buy_reason_stats = defaultdict(lambda: {"count": 0, "pnl": 0.0, "wins": 0})
    for b, s in closed_trades:
        br = getattr(b, "reason", "signal") or "signal"
        buy_reason_stats[br]["count"] += 1
        buy_reason_stats[br]["pnl"] += s.pnl
        if s.pnl > 0:
            buy_reason_stats[br]["wins"] += 1
    for reason, stats in sorted(buy_reason_stats.items(), key=lambda x: -x[1]["count"]):
        wr = stats["wins"] / stats["count"] * 100 if stats["count"] > 0 else 0
        print(f"    {reason}: {stats['count']}笔, 胜率{wr:.0f}%, 盈亏{stats['pnl']:+,.0f}元")

else:
    print("\n  无已平仓交易")

print(result)


def _export_to_excel(result, closed_trades, open_positions, start_date, end_date):
    """导出交易记录到 Excel"""
    output_dir = os.path.join(_PROJECT_ROOT, "reports")
    os.makedirs(output_dir, exist_ok=True)
    filename = f"引擎回测_pullback_box_{start_date}_{end_date}.xlsx"
    filepath = os.path.join(output_dir, filename)

    import json as _json
    trade_rows = []
    for b, s in closed_trades:
        ret_pct = (s.price - b.price) / b.price * 100
        buy_reason = getattr(b, "reason", "回调上穿MA5+涨停箱体支撑") or "回调上穿MA5+涨停箱体支撑"
        buy_detail = getattr(b, "reason_detail", None)
        trade_rows.append({
            "股票代码": b.code, "买入日期": b.date, "买入价": round(b.price, 2),
            "卖出日期": s.date, "卖出价": round(s.price, 2),
            "持仓天数": s.hold_days, "收益率%": round(ret_pct, 2),
            "盈亏金额": round(s.pnl, 2),
            "买入原因": buy_reason,
            "买入原因详解": _json.dumps(buy_detail, ensure_ascii=False) if isinstance(buy_detail, dict) else str(buy_detail or ""),
            "卖出原因": s.reason,
        })
    df_trades = pd.DataFrame(trade_rows)

    df_equity = pd.DataFrame(result.daily_equity, columns=["日期", "总资产"])
    df_equity["日期"] = df_equity["日期"].astype(str)
    df_equity["收益率%"] = (df_equity["总资产"] / result.start_cash - 1) * 100
    peak = df_equity["总资产"].cummax()
    df_equity["回撤%"] = ((peak - df_equity["总资产"]) / peak) * 100

    with pd.ExcelWriter(filepath, engine="openpyxl") as writer:
        df_trades.to_excel(writer, sheet_name="交易明细", index=False)
        df_equity.to_excel(writer, sheet_name="每日净值", index=False)

    print(f"Excel 已导出: {filepath}")
    return filepath


# ============================================================
# 6. 导出 Excel
# ============================================================
excel_path = _export_to_excel(result, closed_trades, open_positions, START_DATE, END_DATE)

print(f"\n完成。Excel: {excel_path}")
