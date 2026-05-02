# -*- coding: utf-8 -*-
"""
完整回测示例：Layer 1 板块池 + Layer 2 买入策略 + 风控。

用法：从项目根目录运行
    cd c:/tool/RPS市场分析系统
    python bt_framework/examples/run_layer2.py
"""

import os
import sys

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from bt_framework.engine import BacktestEngine
from bt_framework.block_pool import BlockPoolSelector
from bt_framework.examples.过前高炸板均线回撤买入策略 import Layer2BuyStrategy


def main():
    # ============================================================
    # Layer 1：初始化板块池
    # ============================================================
    print("=" * 60)
    print("  Layer 1: 加载板块池...")
    print("=" * 60)
    pool = BlockPoolSelector()

    latest = pool.get_latest_date()
    print(f"\n最新交易日: {latest.date()}")

    # 看下三池情况
    pools = pool.identify_pools(latest)
    for tag in ["核心", "新兴", "趋势"]:
        blocks = [c for c, t in pools.items() if t == tag]
        print(f"  {tag}池: {len(blocks)} 个板块")

    # ============================================================
    # Layer 2: 构建策略
    # ============================================================
    strategy = Layer2BuyStrategy(
        breakout_n=60,
        zt_days=10,
        ma_score_min=8,
        pullback_pct=0.03,
        rise_lookback=20,
        rise_min_pct=0.15,
    )

    # ============================================================
    # 引擎配置
    # ============================================================
    engine = BacktestEngine()
    engine.set_block_pool(pool, tags=["核心", "新兴", "趋势"])
    engine.set_strategy(strategy)
    engine.set_cash(1_000_000)
    engine.set_commission(0.001)
    engine.set_max_per_stock(0.1)
    engine.set_trailing_stop(0.08)  # 移动止损 8%
    engine.set_stop_loss(0.07)       # 固定止损 7%
    engine.set_date_range("2025-01-01", "2026-04-27")  # 近一年测试

    # ============================================================
    # 运行回测
    # ============================================================
    result = engine.run()
    print(result)

    # 最近 5 笔交易
    if result.trades:
        print("\n最近 5 笔交易:")
        for t in result.trades[-5:]:
            print(
                f"  {t.date} {t.action:4s} {t.code} "
                f"@{t.price:>8.2f} x{t.shares:>5d} "
                f"金额={t.amount:>10,.2f} "
                f"手续费={t.commission:>6.2f}"
                + (f" 盈亏={t.pnl:>10,.2f}" if t.action == "sell" else "")
            )


if __name__ == "__main__":
    main()
