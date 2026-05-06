# -*- coding: utf-8 -*-
"""快速验证分层利润保护在300285上的表现"""
import os
import sys
_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, _PROJECT_ROOT)

from bt_framework.engine import BacktestEngine
from bt_framework.data_loader import load_all_stock_data
from bt_framework.examples.f1f2f3_strategy import F1F2F3Strategy

TDX_DIR = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"

strategy = F1F2F3Strategy(
    ma_short=5, ma_mid=10, ma_long=20, ma_xlong=60,
    zt_lookback=20, zt_threshold=1.098,
    sell_mode="prot_adj",
    use_flash_crash=False,
)

engine = BacktestEngine(verbose=True)
engine.set_strategy(strategy)
engine.set_cash(1_000_000)
engine.set_commission(0.00075)
engine.set_max_per_stock(0.1)
engine.set_stop_loss(0.10)
engine.set_profit_protection(True)
engine.set_tdx_dir(TDX_DIR)
engine.add_stocks(["300285"])
engine.set_date_range("2025-01-02", "2026-04-30")

result = engine.run()

print("\n===== 交易明细 =====")
buy_map = {}
for t in result.trades:
    if t.action == "buy":
        buy_map.setdefault(t.code, []).append(t)
    elif t.action == "sell":
        b = buy_map.get(t.code, [None])[0]
        if b and buy_map[t.code]:
            buy_map[t.code].pop(0)
            ret = (t.price - b.price) / b.price * 100
            print(f"{t.code} 买{b.date}@{b.price:.2f} → 卖{t.date}@{t.price:.2f}  收益{ret:+.2f}%  原因:{t.reason}")

print(result)
