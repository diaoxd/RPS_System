# -*- coding: utf-8 -*-
"""将 FactorCalculator 产出的列注册为 PandasData 的额外 lines，供 Strategy 使用。"""
import backtrader as bt


class FactorPandasData(bt.feeds.PandasData):
    """在 OHLCV 基础上增加 mom_20、vol_20、rsi_14、reverse_factor。"""

    lines = ('mom_20', 'vol_20', 'rsi_14', 'reverse_factor')

    params = (
        ('datetime', None),
        ('open', 'open'),
        ('high', 'high'),
        ('low', 'low'),
        ('close', 'close'),
        ('volume', 'volume'),
        ('openinterest', -1),
        ('mom_20', 'mom_20'),
        ('vol_20', 'vol_20'),
        ('rsi_14', 'rsi_14'),
        ('reverse_factor', 'reverse_factor'),
    )
