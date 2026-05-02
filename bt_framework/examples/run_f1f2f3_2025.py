# -*- coding: utf-8 -*-
"""
F1+F2+F3 策略 — 2025年全年核心池回测。

买入: F1(均线严格做多) AND F2(涨停基因) AND F3(5日线之上)
卖出: PROT_ADJ 移动止盈 / 四天跌5%急跌 / 10%固定止损
费用: 手续费+印花税 千分之1.5 (双边各0.075%)
资金: 100万初始, 单票10%仓位上限, 复利计算

用法:
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/run_f1f2f3_2025.py
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
from bt_framework.examples.f1f2f3_strategy import F1F2F3Strategy


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
    }


# ============================================================
# 回测参数
# ============================================================
START_DATE = "2025-01-02"      # 2025年第一个交易日
END_DATE = "2025-12-31"        # 2025年最后一个交易日
POOL_TAGS = ["核心", "新兴", "趋势"]  # 买入必须来自三池之一
INITIAL_CASH = 1_000_000       # 初始资金100万
COMMISSION = 0.00075           # 双边千分之1.5 (每边0.075%)
MAX_PER_STOCK = 0.1            # 单只最大仓位10%
STOP_LOSS = 0.10               # 10%固定止损
SELL_MODE = "prot_adj"         # "ma5" = 跌破MA5, "prot_adj" = PROT_ADJ移动止盈

print("=" * 60)
print("F1+F2+F3 策略 — 2025年核心池回测")
print("=" * 60)
print(f"回测区间: {START_DATE} → {END_DATE}")
print(f"初始资金: {INITIAL_CASH:,.0f}")
print(f"手续费率: {COMMISSION:.4f} ({COMMISSION*2*100:.2f}% 双边)")
print(f"止损线:   {STOP_LOSS*100:.0f}%")
print(f"单票上限: {MAX_PER_STOCK*100:.0f}%")
print()

# ============================================================
# 1. 连接数据库 + 加载板块池
# ============================================================
print("=" * 60)
print("1. 初始化数据库连接 + 加载核心池")
print("=" * 60)

cfg = load_sqlserver_config()
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

strategy = F1F2F3Strategy(
    ma_short=5,
    ma_mid=10,
    ma_long=20,
    ma_xlong=60,
    zt_lookback=20,
    zt_threshold=1.098,
    sell_mode=SELL_MODE,
)
print(f"  策略: {strategy.name}")
print(f"  参数: {strategy.params}")

engine = BacktestEngine(verbose=True)
engine.set_block_pool(pool, tags=POOL_TAGS)
engine.set_strategy(strategy)
engine.set_cash(INITIAL_CASH)
engine.set_commission(COMMISSION)
engine.set_max_per_stock(MAX_PER_STOCK)
engine.set_stop_loss(STOP_LOSS)
engine.set_date_range(START_DATE, END_DATE)

# ============================================================
# 3. 运行回测
# ============================================================
print(f"\n{'=' * 60}")
print(f"3. 运行回测: {START_DATE} → {END_DATE}")
print("=" * 60)

result = engine.run()

# ============================================================
# 4. 配对买卖 → 完整交易记录
# ============================================================
buy_map = {}            # code → [未配对的买入记录]
closed_trades = []      # [(buy_record, sell_record)]
open_positions = []     # 尚未卖出的买入记录

for t in result.trades:
    if t.action == "buy":
        buy_map.setdefault(t.code, []).append(t)
    elif t.action == "sell":
        if t.code in buy_map and buy_map[t.code]:
            buy_rec = buy_map[t.code].pop(0)
            closed_trades.append((buy_rec, t))
        # 卖出但没买入记录 → 跳过（可能是回测开始前的持仓）

for code, buys in buy_map.items():
    for b in buys:
        open_positions.append(b)

closed_trades.sort(key=lambda x: x[0].date)

# ============================================================
# 5. 统计汇总
# ============================================================
print(f"\n{'=' * 120}")
print("5. 回测结果统计")
print("=" * 120)

total_win = sum(1 for _, s in closed_trades if s.pnl > 0)
total_loss = sum(1 for _, s in closed_trades if s.pnl <= 0)
total_closed = len(closed_trades)
total_pnl = sum(s.pnl for _, s in closed_trades)
total_commission = sum(t.commission for t in result.trades)

if total_closed > 0:
    win_rate = total_win / total_closed * 100

    hold_days_list = [s.hold_days for _, s in closed_trades if s.hold_days > 0]
    avg_hold = sum(hold_days_list) / len(hold_days_list) if hold_days_list else 0
    max_hold = max(hold_days_list) if hold_days_list else 0
    min_hold = min(hold_days_list) if hold_days_list else 0

    # 盈亏分布
    pnl_list = [s.pnl for _, s in closed_trades]
    max_win = max(pnl_list)
    max_loss = min(pnl_list)

    print(f"\n  ── 交易统计 ──")
    print(f"  总交易次数:     {total_closed}")
    print(f"  盈利次数:       {total_win}")
    print(f"  亏损次数:       {total_loss}")
    print(f"  胜率:           {win_rate:.1f}%")
    print(f"  未平仓:         {len(open_positions)}")

    print(f"\n  ── 收益统计 ──")
    print(f"  总盈亏:         {total_pnl:+,.0f} 元")
    print(f"  总手续费:       {total_commission:,.0f} 元")
    print(f"  最大单笔盈利:   {max_win:+,.0f} 元")
    print(f"  最大单笔亏损:   {max_loss:+,.0f} 元")
    print(f"  平均每笔盈亏:   {total_pnl/total_closed:+,.0f} 元")

    print(f"\n  ── 持仓分析 ──")
    print(f"  平均持仓天数:   {avg_hold:.1f} 天")
    print(f"  最短持仓:       {min_hold} 天")
    print(f"  最长持仓:       {max_hold} 天")

    # ---- 按卖出原因统计 ----
    print(f"\n  ── 卖出原因分布 ──")
    reason_stats = defaultdict(lambda: {"count": 0, "pnl": 0.0, "hold_days": []})
    for _, s in closed_trades:
        reason_stats[s.reason]["count"] += 1
        reason_stats[s.reason]["pnl"] += s.pnl
        reason_stats[s.reason]["hold_days"].append(s.hold_days)

    for reason, stats in sorted(reason_stats.items(), key=lambda x: -x[1]["count"]):
        avg_h = sum(stats["hold_days"]) / len(stats["hold_days"])
        wr = sum(1 for h in stats["hold_days"] if h > 0)  # 简化为有持仓天数的
        print(f"    {reason}: {stats['count']}笔, "
              f"盈亏合计 {stats['pnl']:+,.0f}元, "
              f"平均持仓 {avg_h:.0f}天")

    # ---- 月度分布 ----
    print(f"\n  ── 月度交易分布 ──")
    monthly = defaultdict(lambda: {"buy": 0, "sell": 0, "pnl": 0.0})
    for b, s in closed_trades:
        m = b.date[:7]  # YYYY-MM
        monthly[m]["buy"] += 1
        monthly[m]["sell"] += 1
        monthly[m]["pnl"] += s.pnl

    for m in sorted(monthly.keys()):
        st = monthly[m]
        print(f"    {m}: 交易{st['buy']}笔, 盈亏{st['pnl']:+,.0f}元")

else:
    print("\n  无已平仓交易")

# ============================================================
# 6. 引擎自带摘要
# ============================================================
print(result)

# ============================================================
# 7. 交易明细（前30笔 + 后30笔）
# ============================================================
print(f"\n{'=' * 120}")
print("7. 交易明细（前30笔 + 后30笔）")
print("=" * 120)

show_trades = closed_trades[:30] + closed_trades[-30:] if len(closed_trades) > 60 else closed_trades
if len(closed_trades) > 60:
    print(f"  ... 中间省略 {len(closed_trades) - 60} 笔 ...\n")

for bi, (b, s) in enumerate(show_trades):
    ret_pct = (s.price - b.price) / b.price * 100
    idx = bi + 1 if bi < 30 else len(closed_trades) - (len(show_trades) - bi) + 1
    print(
        f"  #{idx:<4d} {b.code}  "
        f"买 {b.date} @{b.price:>8.2f} → "
        f"卖 {s.date} @{s.price:>8.2f}  │  "
        f"持仓{s.hold_days:>3d}天  │  "
        f"收益{ret_pct:>+7.2f}%  │  "
        f"盈亏{s.pnl:>+10,.0f}元  │  "
        f"{s.reason}"
    )

print(f"\n全量回测完成。")


def _export_to_excel(result, closed_trades, open_positions, sell_mode, start_date, end_date):
    """导出交易记录、净值曲线和汇总统计到 Excel"""
    output_dir = os.path.join(_PROJECT_ROOT, "reports")
    os.makedirs(output_dir, exist_ok=True)
    filename = f"引擎回测_{sell_mode}_{start_date}_{end_date}.xlsx"
    filepath = os.path.join(output_dir, filename)

    # ---- Sheet 1: 交易明细 ----
    trade_rows = []
    for b, s in closed_trades:
        ret_pct = (s.price - b.price) / b.price * 100
        trade_rows.append({
            "股票代码": b.code, "买入日期": b.date, "买入价": round(b.price, 2),
            "卖出日期": s.date, "卖出价": round(s.price, 2),
            "持仓天数": s.hold_days, "收益率%": round(ret_pct, 2),
            "盈亏金额": round(s.pnl, 2), "卖出原因": s.reason,
        })
    df_trades = pd.DataFrame(trade_rows)

    # 未平仓
    open_rows = []
    for b in open_positions:
        open_rows.append({
            "股票代码": b.code, "买入日期": b.date, "买入价": round(b.price, 2),
            "持仓数量": b.shares, "买入金额": round(b.amount, 2),
        })
    df_open = pd.DataFrame(open_rows)

    # ---- Sheet 2: 每日净值 ----
    df_equity = pd.DataFrame(result.daily_equity, columns=["日期", "总资产"])
    df_equity["日期"] = df_equity["日期"].astype(str)
    df_equity["收益率%"] = (df_equity["总资产"] / result.start_cash - 1) * 100
    # 计算回撤
    peak = df_equity["总资产"].cummax()
    df_equity["回撤%"] = ((peak - df_equity["总资产"]) / peak) * 100

    # ---- Sheet 3: 汇总统计 ----
    total_closed = len(closed_trades)
    if total_closed > 0:
        total_win = sum(1 for _, s in closed_trades if s.pnl > 0)
        total_loss = sum(1 for _, s in closed_trades if s.pnl <= 0)
        win_rate = total_win / total_closed * 100
        total_pnl = sum(s.pnl for _, s in closed_trades)
        pnl_list = [s.pnl for _, s in closed_trades]
        avg_pnl = total_pnl / total_closed
        hold_days_all = [s.hold_days for _, s in closed_trades if s.hold_days > 0]
        avg_hold = sum(hold_days_all) / len(hold_days_all) if hold_days_all else 0
    else:
        total_win = total_loss = 0
        win_rate = 0
        total_pnl = 0
        pnl_list = [0]
        avg_pnl = 0
        avg_hold = 0
        hold_days_all = [0]

    summary_data = {
        "指标": [
            "回测区间", "卖出模式", "初始资金", "期末总资产", "总收益率",
            "年化收益率", "最大回撤", "回撤天数",
            "总交易次数(已平仓)", "未平仓数", "盈利次数", "亏损次数", "胜率",
            "总盈亏(元)", "总手续费(元)", "平均每笔盈亏(元)",
            "最大单笔盈利(元)", "最大单笔亏损(元)",
            "平均持仓(天)", "最短持仓(天)", "最长持仓(天)",
        ],
        "数值": [
            f"{start_date} ~ {end_date}", sell_mode,
            f"{result.start_cash:,.0f}", f"{result.end_value:,.2f}",
            f"{result.total_return_pct:.2f}%", f"{result.annual_return_pct:.2f}%",
            f"{result.max_drawdown_pct:.2f}%", str(result.max_drawdown_days),
            str(total_closed), str(len(open_positions)),
            str(total_win), str(total_loss), f"{win_rate:.1f}%",
            f"{total_pnl:+,.0f}", f"{result.total_commission:,.0f}",
            f"{avg_pnl:+,.0f}",
            f"{max(pnl_list):+,.0f}" if pnl_list else "0",
            f"{min(pnl_list):+,.0f}" if pnl_list else "0",
            f"{avg_hold:.1f}",
            str(min(hold_days_all)) if hold_days_all else "0",
            str(max(hold_days_all)) if hold_days_all else "0",
        ],
    }
    df_summary = pd.DataFrame(summary_data)

    # 月度统计
    monthly = defaultdict(lambda: {"交易笔数": 0, "盈亏合计": 0.0})
    for b, s in closed_trades:
        m = b.date[:7]
        monthly[m]["交易笔数"] += 1
        monthly[m]["盈亏合计"] += s.pnl
    monthly_rows = [{"月份": m, "交易笔数": s["交易笔数"], "盈亏合计": round(s["盈亏合计"], 2)}
                    for m, s in sorted(monthly.items())]
    df_monthly = pd.DataFrame(monthly_rows)

    # 卖出原因
    reason_stats = defaultdict(lambda: {"笔数": 0, "盈亏合计": 0.0, "持仓合计": 0})
    for _, s in closed_trades:
        reason_stats[s.reason]["笔数"] += 1
        reason_stats[s.reason]["盈亏合计"] += s.pnl
        reason_stats[s.reason]["持仓合计"] += s.hold_days
    reason_rows = []
    for reason, stats in sorted(reason_stats.items(), key=lambda x: -x[1]["笔数"]):
        avg_h = stats["持仓合计"] / stats["笔数"] if stats["笔数"] > 0 else 0
        wr = sum(1 for _, s in closed_trades if s.reason == reason and s.pnl > 0)
        wr_pct = wr / stats["笔数"] * 100 if stats["笔数"] > 0 else 0
        reason_rows.append({
            "卖出原因": reason, "笔数": stats["笔数"],
            "盈亏合计": round(stats["盈亏合计"], 2),
            "平均持仓天": round(avg_h, 1), "胜率%": round(wr_pct, 1),
        })
    df_reason = pd.DataFrame(reason_rows)

    # ---- 写入 Excel ----
    with pd.ExcelWriter(filepath, engine="openpyxl") as writer:
        df_trades.to_excel(writer, sheet_name="交易明细", index=False)
        if not df_open.empty:
            df_open.to_excel(writer, sheet_name="未平仓", index=False)
        df_equity.to_excel(writer, sheet_name="每日净值", index=False)
        df_summary.to_excel(writer, sheet_name="汇总统计", index=False)
        df_monthly.to_excel(writer, sheet_name="月度分布", index=False)
        df_reason.to_excel(writer, sheet_name="卖出原因", index=False)

    print(f"Excel 已导出: {filepath}")

# ============================================================
# 8. 导出 Excel
# ============================================================
_export_to_excel(result, closed_trades, open_positions, SELL_MODE, START_DATE, END_DATE)
