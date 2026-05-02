# -*- coding: utf-8 -*-
"""
演示：同一个引擎，切换三种不同策略（都基于 myTT）。
"""

import os
import sys

_PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from bt_framework.engine import BacktestEngine
from bt_framework.examples.mytt_strategies import (
    MyTT_MACrossStrategy,
    MyTT_RSIFilterStrategy,
    MyTT_MACDStrategy,
)

STOCKS = ["600519", "600036", "600276", "000858", "601318"]


def run_one(strategy, label):
    print(f"\n{'#' * 60}")
    print(f"#  {label}")
    print(f"{'#' * 60}")

    engine = BacktestEngine()
    engine.add_stocks(STOCKS)
    engine.set_strategy(strategy)
    engine.set_cash(1_000_000)
    engine.set_max_per_stock(0.1)
    engine.set_commission(0.001)

    result = engine.run()
    print(result)
    return result


def main():
    results = []

    # 策略1：MA5/20 金叉死叉
    r1 = run_one(MyTT_MACrossStrategy(5, 20), "策略1: MA5金叉MA20")

    # 策略2：MA金叉 + RSI过滤
    r2 = run_one(
        MyTT_RSIFilterStrategy(5, 20, rsi_period=14, rsi_min=30, rsi_max=70),
        "策略2: MA金叉 + RSI过滤(30~70)",
    )

    # 策略3：MACD 金叉死叉
    r3 = run_one(MyTT_MACDStrategy(12, 26, 9), "策略3: MACD金叉死叉(12/26/9)")

    # 简单对比
    print(f"\n{'=' * 60}")
    print(f"  策略对比")
    print(f"{'=' * 60}")
    print(f"{'策略':<30} {'收益率':>8} {'胜率':>8} {'交易次数':>8} {'最大回撤':>8}")
    print("-" * 66)
    for label, r in [
        ("MA5金叉MA20", r1),
        ("MA金叉+RSI过滤", r2),
        ("MACD金叉死叉", r3),
    ]:
        print(
            f"{label:<30} {r.total_return_pct:>7.2f}% "
            f"{r.win_rate:>7.2f}% {r.total_trades:>8} "
            f"{r.max_drawdown_pct:>7.2f}%"
        )


if __name__ == "__main__":
    main()
