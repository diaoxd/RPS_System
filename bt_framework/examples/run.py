# -*- coding: utf-8 -*-
"""
运行示例：MA5/MA20 金叉死叉回测。

用法:
    python bt_framework/examples/run.py
    python -m bt_framework.examples.run          （从项目根目录）

可自行修改股票列表、策略参数、风控参数。
"""

import os
import sys

# 项目根目录 = 本文件向上两级
_PROJECT_ROOT = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from bt_framework.engine import BacktestEngine
from bt_framework.examples.ma_cross import MACrossStrategy


def main():
    engine = BacktestEngine()

    # ========== 配置 ==========

    # 测哪些股票
    engine.add_stocks([
        "600519",  # 贵州茅台
        "600036",  # 招商银行
        "600276",  # 恒瑞医药
        "000858",  # 五粮液
        "000333",  # 美的集团
        "601318",  # 中国平安
        "600887",  # 伊利股份
        "600585",  # 海螺水泥
        "002415",  # 海康威视
        "600309",  # 万华化学
    ])

    # 用什么策略
    engine.set_strategy(MACrossStrategy(ma_short=5, ma_long=20))

    # 资金 & 仓位 & 手续费
    engine.set_cash(1_000_000)
    engine.set_max_per_stock(0.1)  # 每只最多 10 万
    engine.set_commission(0.001)  # 千分之一

    # 风控（可选，不需要就注释掉）
    # engine.set_trailing_stop(0.08)   # 从最高点回落 8% 卖出
    # engine.set_stop_loss(0.07)       # 亏损 7% 止损
    # engine.set_take_profit(0.20)     # 盈利 20% 止盈

    # ========== 运行 ==========

    result = engine.run()

    # ========== 输出 ==========

    print(result)

    # 打印近期交易明细（最近10笔）
    sells = [t for t in result.trades if t.action == "sell"]
    if sells:
        print(f"\n最近 10 笔卖出交易:")
        print(f"{'日期':<12} {'代码':<8} {'卖出价':>8} {'持仓(天)':>8} {'盈亏':>10} {'原因':<14}")
        print("-" * 62)
        for t in sells[-10:]:
            print(
                f"{t.date:<12} {t.code:<8} {t.price:>8.2f} "
                f"{t.hold_days:>8} {t.pnl:>+10.2f} {t.reason:<14}"
            )


if __name__ == "__main__":
    main()
