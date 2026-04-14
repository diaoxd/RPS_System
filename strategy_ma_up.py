# -*- coding: utf-8 -*-
"""
MA 多周期向上 + 强势涨幅 选股策略

策略条件（按每只股票“最新交易日”判定）：
1) MA5 今日 > MA5 昨日
2) MA20 今日 > MA20 昨日
3) MA60 今日 > MA60 昨日
4) 今日涨幅 >= 5%

输入文件要求（CSV）：
- 必须包含: code, date, close
- 可选包含: pct_chg（单位 %）
  若未提供 pct_chg，将使用 close 的日收益自动计算

示例:
python strategy_ma_up.py --input "c:/tool/RPS市场分析系统/data/daily_bars.csv" --output "c:/tool/RPS市场分析系统/reports/ma_up_pick.csv"
"""

import argparse
import os
import pandas as pd


REQUIRED_COLUMNS = {"code", "date", "close"}


def prepare_data(df: pd.DataFrame) -> pd.DataFrame:
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise ValueError(f"输入数据缺少必要列: {sorted(missing)}")

    work = df.copy()
    work["code"] = work["code"].astype(str).str.strip()
    work["date"] = pd.to_datetime(work["date"])
    work["close"] = pd.to_numeric(work["close"], errors="coerce")
    work = work.dropna(subset=["code", "date", "close"])
    work = work.sort_values(["code", "date"]).reset_index(drop=True)

    # 计算均线
    work["ma5"] = work.groupby("code")["close"].transform(lambda s: s.rolling(5).mean())
    work["ma20"] = work.groupby("code")["close"].transform(lambda s: s.rolling(20).mean())
    work["ma60"] = work.groupby("code")["close"].transform(lambda s: s.rolling(60).mean())

    # 今日涨幅（%）
    if "pct_chg" not in work.columns:
        prev_close = work.groupby("code")["close"].shift(1)
        work["pct_chg"] = (work["close"] / prev_close - 1) * 100
    else:
        work["pct_chg"] = pd.to_numeric(work["pct_chg"], errors="coerce")

    return work


def pick_stocks(df: pd.DataFrame, min_pct_chg: float = 5.0) -> pd.DataFrame:
    work = prepare_data(df)

    # 只看每只股票最新一根K线
    latest_idx = work.groupby("code")["date"].idxmax()
    latest = work.loc[latest_idx].copy()

    # 对应昨天均线（从全量表按 index-1 对应同 code 取值）
    work["ma5_prev"] = work.groupby("code")["ma5"].shift(1)
    work["ma20_prev"] = work.groupby("code")["ma20"].shift(1)
    work["ma60_prev"] = work.groupby("code")["ma60"].shift(1)

    latest = latest.merge(
        work[["code", "date", "ma5_prev", "ma20_prev", "ma60_prev", "pct_chg"]],
        on=["code", "date"],
        how="left",
        suffixes=("", "_dup"),
    )

    cond = (
        (latest["ma5"] > latest["ma5_prev"]) &
        (latest["ma20"] > latest["ma20_prev"]) &
        (latest["ma60"] > latest["ma60_prev"]) &
        (latest["pct_chg"] >= float(min_pct_chg))
    )

    picked = latest.loc[cond, ["code", "date", "close", "pct_chg", "ma5", "ma20", "ma60"]].copy()
    picked = picked.sort_values(["pct_chg", "code"], ascending=[False, True]).reset_index(drop=True)
    return picked


def main():
    parser = argparse.ArgumentParser(description="MA5/20/60 同向上 + 涨幅筛选策略")
    parser.add_argument("--input", required=True, help="输入 CSV 文件路径（含 code,date,close）")
    parser.add_argument("--output", default="", help="输出 CSV 文件路径")
    parser.add_argument("--min-pct", type=float, default=5.0, help="最小涨幅阈值，默认 5")
    args = parser.parse_args()

    in_path = args.input
    if not os.path.isfile(in_path):
        raise FileNotFoundError(f"输入文件不存在: {in_path}")

    df = pd.read_csv(in_path, encoding="utf-8-sig")
    picked = pick_stocks(df, min_pct_chg=args.min_pct)

    if args.output:
        out_path = args.output
    else:
        out_path = os.path.join(os.path.dirname(in_path), "ma_up_pick.csv")
    picked.to_csv(out_path, index=False, encoding="utf-8-sig")

    print(f"输入记录: {len(df)}")
    print(f"命中数量: {len(picked)}")
    print(f"输出文件: {out_path}")
    if not picked.empty:
        print(picked.head(20).to_string(index=False))


if __name__ == "__main__":
    main()

