# -*- coding: utf-8 -*-
"""
逐只股票回测 —— 2025年全年，三池 + F1+F2+F3 买入 + PROT_ADJ 移动止盈卖出（4进程并行版）。

每只股票独立分析：
  1. 从2025-01-02开始，默认无持仓
  2. 逐日判断：当天是否在三池内 AND 是否产生买入信号（F1+F2+F3）
  3. 买入后按 PROT_ADJ 移动止盈 / 急跌止盈 / 10%止损 出局
  4. 记录每笔交易的买入/卖出日期和价格

用法:
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/per_stock_2025.py
"""

import json
import os
import re
import sys
from collections import defaultdict
from multiprocessing import Pool

import pandas as pd

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from bt_framework.examples.moving_stop_profit import compute_moving_stop

# ============================================================
# 回测参数
# ============================================================
START_DATE = "2025-01-02"
END_DATE = "2025-12-31"
POOL_TAGS = ["核心", "新兴", "趋势"]
COMMISSION = 0.00075        # 单边手续费
STOP_LOSS = 0.10            # 10% 固定止损
TDX_DIR = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"
NUM_WORKERS = 4
SELL_MODE = "prot_adj"      # "ma5" = 跌破MA5卖出, "prot_adj" = PROT_ADJ移动止盈


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


def resolve_file_path(code):
    """将股票代码转换为通达信文件路径"""
    code = code.strip()
    for market in ("SH", "SZ", "BJ"):
        fpath = os.path.join(TDX_DIR, f"{market}#{code}.txt")
        if os.path.exists(fpath):
            return fpath
    return os.path.join(TDX_DIR, f"SH#{code}.txt")


def load_one_stock(code):
    """加载单只股票日线数据"""
    from 分析前复权日线 import parse_single_file

    fpath = resolve_file_path(code)
    if not os.path.exists(fpath):
        return None

    try:
        _, df = parse_single_file(fpath)
    except Exception:
        return None
    df["date"] = pd.to_datetime(df["date"])
    df["prev_close"] = df["Close"].shift(1)
    df["turnover_rate"] = 0.0
    df.set_index("date", inplace=True)
    return df


def compute_signal(df, sell_mode="prot_adj"):
    """对单只股票计算 F1F2F3 策略信号"""
    import numpy as np
    from MyTT import MA, REF, COUNT

    C = df["Close"].values.astype(float)
    prev_close = (
        df["prev_close"].values.astype(float)
        if "prev_close" in df.columns
        else REF(C, 1)
    )

    MA5 = MA(C, 5)
    MA10 = MA(C, 10)
    MA20 = MA(C, 20)
    MA60 = MA(C, 60)

    # F1: 均线多头 + 斜率>0
    ma_order = (MA5 > MA10) & (MA10 > MA20) & (MA20 > MA60)
    ma5_up = MA5 > REF(MA5, 1)
    ma10_up = MA10 > REF(MA10, 1)
    ma20_up = MA20 > REF(MA20, 1)
    ma60_up = MA60 > REF(MA60, 1)
    cond_f1 = ma_order & ma5_up & ma10_up & ma20_up & ma60_up

    # F2: 近20天有过涨停
    with np.errstate(divide="ignore", invalid="ignore"):
        daily_ret = C / np.where(prev_close > 0, prev_close, np.nan)
    has_zt = daily_ret >= 1.098
    cond_f2 = COUNT(has_zt.astype(float), 20) >= 1

    # F3: 收盘在5日线上
    cond_f3 = C > MA5

    qualified = cond_f1 & cond_f2 & cond_f3
    buy = qualified & ~REF(qualified.astype(float), 1).astype(bool)

    # ---- 卖出信号 ----
    if sell_mode == "prot_adj":
        lines = compute_moving_stop(df)
        prot_adj = lines["prot_adj"].values
        drop5_stop = lines["drop5_stop"].values
        L = df["Low"].values.astype(float)
        # ① 收盘价跌破 PROT_ADJ 修正止盈线
        sell_trailing = (C < prot_adj) & (REF(C, 1) >= REF(prot_adj, 1))
        # ② 最低价触及四天跌5%急跌止盈线
        sell_flash = (L <= drop5_stop) & ~np.isnan(drop5_stop)
        sell = sell_trailing | sell_flash
    else:
        prot_adj = np.full_like(C, np.nan)
        sell = (C < MA5) & (REF(C, 1) >= REF(MA5, 1))

    df = df.copy()
    df["signal"] = 0
    df.loc[pd.Series(buy.astype(bool), index=df.index), "signal"] = 1
    df.loc[pd.Series(sell, index=df.index), "signal"] = -1
    df["price"] = C
    df["prot_adj"] = prot_adj

    valid = ~np.isnan(MA60)
    if sell_mode == "prot_adj":
        valid = valid & ~np.isnan(prot_adj)
    return df.loc[valid]


def backtest_one_stock(code, pool_daily_stocks, all_dates_sorted, sell_mode="prot_adj"):
    """回测单只股票，返回交易记录列表"""
    df = load_one_stock(code)
    if df is None or len(df) < 60:
        return []

    try:
        df = compute_signal(df, sell_mode=sell_mode)
    except Exception:
        return []

    if df.empty or "signal" not in df.columns:
        return []

    trades = []
    holding = False
    buy_date = None
    buy_price = 0.0

    for date in all_dates_sorted:
        if date not in df.index:
            continue

        row = df.loc[date]
        price = float(row["price"])
        signal = int(row["signal"])
        date_str = date.strftime("%Y%m%d")

        in_pool = code in pool_daily_stocks.get(date_str, set())

        if not holding:
            if in_pool and signal == 1:
                holding = True
                buy_date = date
                buy_price = price
        else:
            sell_reason = None

            loss_pct = (price - buy_price) / buy_price
            if loss_pct <= -STOP_LOSS:
                sell_reason = "stop_loss"

            if sell_reason is None and signal == -1:
                sell_reason = "trailing" if sell_mode == "prot_adj" else "signal"

            if sell_reason is not None:
                gross_pnl = (price - buy_price) / buy_price * 100
                commission_total = COMMISSION * 2 * 100
                net_pnl_pct = gross_pnl - commission_total
                hold_days = (date - buy_date).days

                trades.append({
                    "code": code,
                    "buy_date": str(buy_date.date()),
                    "buy_price": round(buy_price, 2),
                    "sell_date": str(date.date()),
                    "sell_price": round(price, 2),
                    "hold_days": hold_days,
                    "pnl_pct": round(net_pnl_pct, 2),
                    "reason": sell_reason,
                })
                holding = False
                buy_date = None
                buy_price = 0.0

    return trades


def worker(args):
    """子进程入口：处理一批股票"""
    stock_codes, pool_daily_stocks, all_dates, sell_mode = args
    all_trades = []
    for i, code in enumerate(stock_codes):
        trades = backtest_one_stock(code, pool_daily_stocks, all_dates, sell_mode)
        all_trades.extend(trades)
    return all_trades


# ============================================================
# 主流程
# ============================================================
def main():
    from SqlServerUtil import DBHelper
    from bt_framework.block_pool import BlockPoolSelector

    print("=" * 60)
    print("逐只股票回测 — 2025年 三池 + F1+F2+F3 (4进程)")
    print("=" * 60)
    print(f"回测区间: {START_DATE} → {END_DATE}")
    print(f"池标签:   {POOL_TAGS}")
    print(f"止损线:   {STOP_LOSS*100:.0f}%")
    print(f"手续费:   {COMMISSION*100:.2f}% 单边")
    print(f"卖出模式: {SELL_MODE}")
    print()

    # ---- 1. 板块池：收集候选股票 + 预计算每日池内股票 ----
    print("1. 初始化板块池...")
    cfg = load_sqlserver_config()
    db = DBHelper(cfg["host"], cfg["database"], cfg["user"], cfg["password"])
    pool = BlockPoolSelector(db_helper=db)

    all_dates = pool.get_all_dates()
    all_dates = [d for d in all_dates if pd.Timestamp(START_DATE) <= d <= pd.Timestamp(END_DATE)]
    all_dates_sorted = sorted(all_dates)

    pool_daily_stocks = {}
    candidate_stocks = set()
    for date in all_dates_sorted:
        stocks = pool.get_pool_stocks(date, POOL_TAGS)
        date_str = date.strftime("%Y%m%d")
        pool_daily_stocks[date_str] = set(stocks)
        candidate_stocks.update(stocks)

    candidate_stocks = sorted(candidate_stocks)
    print(f"  交易日: {len(all_dates_sorted)} 天, 候选股票: {len(candidate_stocks)} 只")

    # ---- 2. 分4组并行处理 ----
    print(f"\n2. 启动 {NUM_WORKERS} 进程并行处理...")
    chunk_size = (len(candidate_stocks) + NUM_WORKERS - 1) // NUM_WORKERS
    chunks = []
    for i in range(NUM_WORKERS):
        start = i * chunk_size
        end = min((i + 1) * chunk_size, len(candidate_stocks))
        chunks.append(candidate_stocks[start:end])
    print(f"   每组: {[len(c) for c in chunks]} 只")

    all_dates_ts = sorted([pd.Timestamp(d) for d in all_dates_sorted])
    args_list = [(chunk, pool_daily_stocks, all_dates_ts, SELL_MODE) for chunk in chunks]

    with Pool(NUM_WORKERS) as p:
        all_results = p.map(worker, args_list)

    # ---- 3. 合并结果 ----
    trade_records = []
    for trades in all_results:
        trade_records.extend(trades)
    trade_records.sort(key=lambda x: x["buy_date"])

    # 统计涉及的股票
    stock_trades = defaultdict(list)
    for t in trade_records:
        stock_trades[t["code"]].append(t)

    print(f"完成！共 {len(trade_records)} 笔交易, 涉及 {len(stock_trades)} 只股票\n")

    # ============================================================
    # 4. 统计
    # ============================================================
    if not trade_records:
        print("无交易记录！")
        return

    win_trades = [t for t in trade_records if t["pnl_pct"] > 0]
    loss_trades = [t for t in trade_records if t["pnl_pct"] <= 0]
    total_trades = len(trade_records)
    win_rate = len(win_trades) / total_trades * 100

    print(f"{'=' * 80}")
    print("4. 回测统计")
    print(f"{'=' * 80}")
    print(f"  交易股票数:   {len(stock_trades)}")
    print(f"  总交易次数:   {total_trades}")
    print(f"  盈利次数:     {len(win_trades)}")
    print(f"  亏损次数:     {len(loss_trades)}")
    print(f"  胜率:         {win_rate:.1f}%")

    pnl_list = [t["pnl_pct"] for t in trade_records]
    avg_pnl = sum(pnl_list) / len(pnl_list)
    max_win = max(pnl_list)
    max_loss = min(pnl_list)

    print(f"\n  ── 收益率分布 ──")
    print(f"  平均收益率:   {avg_pnl:+.2f}%")
    print(f"  最大单笔盈利: {max_win:+.2f}%")
    print(f"  最大单笔亏损: {max_loss:+.2f}%")
    print(f"  累计收益率:   {sum(pnl_list):+.2f}%")

    hold_days_all = [t["hold_days"] for t in trade_records if t["hold_days"] > 0]
    if hold_days_all:
        print(f"\n  ── 持仓分析 ──")
        print(f"  平均持仓:     {sum(hold_days_all)/len(hold_days_all):.1f} 天")
        print(f"  最短:         {min(hold_days_all)} 天")
        print(f"  最长:         {max(hold_days_all)} 天")

    # 卖出原因分布
    print(f"\n  ── 卖出原因分布 ──")
    reason_stats = defaultdict(lambda: {"count": 0, "total_pnl": 0.0, "hold_days": []})
    for t in trade_records:
        reason_stats[t["reason"]]["count"] += 1
        reason_stats[t["reason"]]["total_pnl"] += t["pnl_pct"]
        reason_stats[t["reason"]]["hold_days"].append(t["hold_days"])

    for reason, stats in sorted(reason_stats.items(), key=lambda x: -x[1]["count"]):
        avg_h = sum(stats["hold_days"]) / len(stats["hold_days"])
        win_count = sum(1 for t in trade_records if t["reason"] == reason and t["pnl_pct"] > 0)
        reason_wr = win_count / stats["count"] * 100 if stats["count"] > 0 else 0
        print(f"    {reason}: {stats['count']}笔, "
              f"盈亏合计 {stats['total_pnl']:+.1f}%, "
              f"平均持仓 {avg_h:.0f}天, "
              f"胜率 {reason_wr:.0f}%")

    # 月度分布
    print(f"\n  ── 月度交易分布 ──")
    monthly = defaultdict(lambda: {"buy": 0, "pnl": 0.0})
    for t in trade_records:
        m = t["buy_date"][:7]
        monthly[m]["buy"] += 1
        monthly[m]["pnl"] += t["pnl_pct"]

    for m in sorted(monthly.keys()):
        st = monthly[m]
        print(f"    {m}: 交易{st['buy']}笔, 盈亏{st['pnl']:+.1f}%")

    # 交易最活跃的股票 Top 10
    print(f"\n  ── 交易最活跃的股票 Top 10 ──")
    stock_trade_count = sorted(stock_trades.items(), key=lambda x: -len(x[1]))
    for code, trades in stock_trade_count[:10]:
        total_pnl = sum(t["pnl_pct"] for t in trades)
        wins = sum(1 for t in trades if t["pnl_pct"] > 0)
        print(f"    {code}: {len(trades)}笔, 盈亏{total_pnl:+.1f}%, 胜率{wins/len(trades)*100:.0f}%")

    # ============================================================
    # 5. 交易明细
    # ============================================================
    print(f"\n{'=' * 100}")
    print("5. 交易明细（前20笔 + 后20笔）")
    print(f"{'=' * 100}")
    print(f"  {'代码':<8s} {'买入日':<12s} {'买入价':>8s} {'卖出日':<12s} {'卖出价':>8s} {'持仓':>4s}天  {'收益率':>8s}  {'原因':<12s}")
    print(f"  {'-' * 90}")

    show = trade_records[:20] + trade_records[-20:] if len(trade_records) > 40 else trade_records
    for rec in show:
        print(
            f"  {rec['code']:<8s} {rec['buy_date']:<12s} {rec['buy_price']:>8.2f} "
            f"{rec['sell_date']:<12s} {rec['sell_price']:>8.2f} {rec['hold_days']:>4d}天 "
            f"{rec['pnl_pct']:>+7.2f}%  {rec['reason']:<12s}"
        )

    print(f"\n全量回测完成。")

    # ============================================================
    # 6. 导出 Excel
    # ============================================================
    _export_to_excel(trade_records, SELL_MODE, START_DATE, END_DATE)


def _export_to_excel(trade_records, sell_mode, start_date, end_date):
    """导出交易记录和汇总统计到 Excel"""
    if not trade_records:
        print("无交易记录，跳过 Excel 导出。")
        return

    output_dir = os.path.join(_PROJECT_ROOT, "reports")
    os.makedirs(output_dir, exist_ok=True)
    filename = f"回测交易记录_{sell_mode}_{start_date}_{end_date}.xlsx"
    filepath = os.path.join(output_dir, filename)

    # ---- Sheet 1: 交易明细 ----
    df_trades = pd.DataFrame(trade_records)
    # 调整列顺序
    cols = ["code", "buy_date", "buy_price", "sell_date", "sell_price",
            "hold_days", "pnl_pct", "reason"]
    df_trades = df_trades[cols]
    df_trades.columns = ["股票代码", "买入日期", "买入价", "卖出日期", "卖出价",
                          "持仓天数", "收益率%", "卖出原因"]

    # ---- Sheet 2: 汇总统计 ----
    total_trades = len(trade_records)
    win_trades = [t for t in trade_records if t["pnl_pct"] > 0]
    loss_trades = [t for t in trade_records if t["pnl_pct"] <= 0]
    win_rate = len(win_trades) / total_trades * 100 if total_trades > 0 else 0
    pnl_list = [t["pnl_pct"] for t in trade_records]
    avg_pnl = sum(pnl_list) / len(pnl_list) if pnl_list else 0
    hold_days_all = [t["hold_days"] for t in trade_records if t["hold_days"] > 0]
    avg_hold = sum(hold_days_all) / len(hold_days_all) if hold_days_all else 0

    # 月度统计
    monthly = defaultdict(lambda: {"交易笔数": 0, "盈亏合计": 0.0})
    for t in trade_records:
        m = t["buy_date"][:7]
        monthly[m]["交易笔数"] += 1
        monthly[m]["盈亏合计"] += t["pnl_pct"]

    # 卖出原因统计
    reason_stats = defaultdict(lambda: {"笔数": 0, "盈亏合计": 0.0, "持仓天数合计": 0})
    for t in trade_records:
        reason_stats[t["reason"]]["笔数"] += 1
        reason_stats[t["reason"]]["盈亏合计"] += t["pnl_pct"]
        reason_stats[t["reason"]]["持仓天数合计"] += t["hold_days"]

    summary_data = {
        "指标": ["回测区间", "卖出模式", "交易股票数", "总交易次数", "盈利次数", "亏损次数",
                "胜率", "平均收益率", "最大单笔盈利", "最大单笔亏损", "累计收益率",
                "平均持仓(天)", "最短持仓(天)", "最长持仓(天)"],
        "数值": [f"{start_date} ~ {end_date}", sell_mode,
                len(set(t["code"] for t in trade_records)),
                total_trades, len(win_trades), len(loss_trades),
                f"{win_rate:.1f}%", f"{avg_pnl:+.2f}%",
                f"{max(pnl_list):+.2f}%", f"{min(pnl_list):+.2f}%",
                f"{sum(pnl_list):+.2f}%",
                f"{avg_hold:.1f}", str(min(hold_days_all)) if hold_days_all else "0",
                str(max(hold_days_all)) if hold_days_all else "0"],
    }
    df_summary = pd.DataFrame(summary_data)

    # 月度统计 DataFrame
    monthly_rows = []
    for m in sorted(monthly.keys()):
        monthly_rows.append({
            "月份": m, "交易笔数": monthly[m]["交易笔数"],
            "盈亏合计%": round(monthly[m]["盈亏合计"], 2),
        })
    df_monthly = pd.DataFrame(monthly_rows)

    # 卖出原因 DataFrame
    reason_rows = []
    for reason, stats in sorted(reason_stats.items(), key=lambda x: -x[1]["笔数"]):
        avg_h = stats["持仓天数合计"] / stats["笔数"] if stats["笔数"] > 0 else 0
        win_count = sum(1 for t in trade_records if t["reason"] == reason and t["pnl_pct"] > 0)
        wr = win_count / stats["笔数"] * 100 if stats["笔数"] > 0 else 0
        reason_rows.append({
            "卖出原因": reason, "笔数": stats["笔数"],
            "盈亏合计%": round(stats["盈亏合计"], 2),
            "平均持仓天": round(avg_h, 1), "胜率%": round(wr, 1),
        })
    df_reason = pd.DataFrame(reason_rows)

    # ---- 写入 Excel ----
    with pd.ExcelWriter(filepath, engine="openpyxl") as writer:
        df_trades.to_excel(writer, sheet_name="交易明细", index=False)
        df_summary.to_excel(writer, sheet_name="汇总统计", index=False)
        df_monthly.to_excel(writer, sheet_name="月度分布", index=False)
        df_reason.to_excel(writer, sheet_name="卖出原因", index=False)

    print(f"Excel 已导出: {filepath}")


if __name__ == "__main__":
    main()
