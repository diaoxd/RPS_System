# -*- coding: utf-8 -*-
"""
简单多因子示例策略（与 FactorCalculator 的列对接）

逻辑（仅演示，非实盘建议）：
- 动量 mom_20：相对 20 日前涨幅，>0 表示中期偏强
- 相对强弱 rsi_14：低位配合动量买入，高位或动量转弱卖出

买入：空仓时，mom_20>0 且 30<rsi_14<50（有动量、未过热）
卖出：持仓时，rsi_14>72 或 mom_20<-0.01（超买或动量明显走弱）
"""
import math

import backtrader as bt


class MultiFactorSimpleStrategy(bt.Strategy):

    params = (
        ('min_bars', 22),
    )

    def __init__(self):
        pass

    def _num(self, x) -> float:
        try:
            v = float(x)
            if math.isnan(v) or math.isinf(v):
                return float('nan')
            return v
        except Exception:
            return float('nan')

    def next(self):
        if len(self) < self.p.min_bars:
            return

        mom = self._num(self.data.mom_20[0])
        rsi = self._num(self.data.rsi_14[0])
        if math.isnan(mom) or math.isnan(rsi):
            return

        if not self.position:
            if mom > 0 and 30.0 < rsi < 50.0:
                size = int(self.broker.getcash() * 0.95 // self.data.close[0])
                if size > 0:
                    self.buy(size=size)
        else:
            if rsi > 72.0 or mom < -0.01:
                self.sell(size=self.position.size)
