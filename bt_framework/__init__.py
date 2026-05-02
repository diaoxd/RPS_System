"""
bt_framework - 多品种股票回测框架

用法示例:
    from bt_framework.engine import BacktestEngine
    from bt_framework.examples.ma_cross import MACrossStrategy

    engine = BacktestEngine()
    engine.add_stocks(['600519', '600036'])
    engine.set_strategy(MACrossStrategy(ma_short=5, ma_long=20))
    engine.set_cash(1_000_000)
    engine.set_max_per_stock(0.1)
    engine.set_commission(0.001)
    engine.set_trailing_stop(0.08)  # 移动止损 8%

    result = engine.run()
    print(result)
"""

from .base import BaseStrategy
from .engine import BacktestEngine, BacktestResult
