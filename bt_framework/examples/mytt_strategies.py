# -*- coding: utf-8 -*-
"""
使用 myTT 计算指标的策略示例。
展示三种策略，都基于 myTT 实现。
"""

import numpy as np
import pandas as pd
from MyTT import *

from bt_framework.base import BaseStrategy


class MyTT_MACrossStrategy(BaseStrategy):
    """【策略1】MA5/MA20 金叉死叉（用 myTT 的 CROSS）"""

    def __init__(self, ma_short=5, ma_long=20):
        self._s = ma_short
        self._l = ma_long

    @property
    def name(self):
        return f"MA{self._s}金叉MA{self._l}(myTT)"

    @property
    def params(self):
        return {"ma_short": self._s, "ma_long": self._l}

    def compute(self, df):
        close = df["Close"].values

        ma_short = MA(close, self._s)
        ma_long = MA(close, self._l)

        # CROSS(a, b) = a 上穿 b 的那天返回 1
        golden = CROSS(ma_short, ma_long)  # 金叉 → 买入
        death = CROSS(ma_long, ma_short)   # 死叉 → 卖出

        df["signal"] = 0
        df.loc[golden == 1, "signal"] = 1
        df.loc[death == 1, "signal"] = -1
        df["price"] = df["Close"]

        # 去掉 myTT 算不出的前几行（NaN）
        valid = ~np.isnan(ma_short)
        return df.loc[valid]


class MyTT_RSIFilterStrategy(BaseStrategy):
    """【策略2】MA5/MA20 金叉 + RSI 过滤（用 myTT 的 RSI）"""

    def __init__(self, ma_short=5, ma_long=20, rsi_period=14, rsi_min=30, rsi_max=70):
        self._s = ma_short
        self._l = ma_long
        self._rp = rsi_period
        self._rmin = rsi_min
        self._rmax = rsi_max

    @property
    def name(self):
        return f"MA金叉+RSI过滤"

    @property
    def params(self):
        return {
            "ma_short": self._s, "ma_long": self._l,
            "rsi_period": self._rp,
            "rsi_range": f"[{self._rmin}, {self._rmax}]",
        }

    def compute(self, df):
        close = df["Close"].values

        ma_short = MA(close, self._s)
        ma_long = MA(close, self._l)
        rsi = RSI(close, self._rp)

        golden = CROSS(ma_short, ma_long)
        death = CROSS(ma_long, ma_short)

        df["signal"] = 0

        # 买入：金叉 + RSI 不在超买区 (rsi < rsi_max)
        buy = (golden == 1) & (rsi < self._rmax)
        df.loc[buy, "signal"] = 1

        # 卖出：死叉 OR RSI 进入超买区后回落（rsi 是 numpy 数组，用 pd.Series 移位）
        rsi_series = pd.Series(rsi, index=df.index)
        rsi_falling = (rsi > 80) & (rsi < rsi_series.shift(1).values)
        sell = (death == 1) | rsi_falling
        df.loc[sell, "signal"] = -1

        df["price"] = df["Close"]

        valid = ~np.isnan(ma_short) & ~np.isnan(rsi)
        return df.loc[valid]


class MyTT_MACDStrategy(BaseStrategy):
    """【策略3】MACD 金叉死叉（用 myTT 的 MACD）"""

    def __init__(self, fast=12, slow=26, signal=9):
        self._f = fast
        self._s = slow
        self._sg = signal

    @property
    def name(self):
        return "MACD金叉死叉"

    @property
    def params(self):
        return {"fast": self._f, "slow": self._s, "signal": self._sg}

    def compute(self, df):
        close = df["Close"].values

        # myTT 的 MACD 返回 (DIF, DEA, MACD)
        dif, dea, macd_bar = MACD(close, self._f, self._s, self._sg)

        # DIF 上穿 DEA → 金叉买入，下穿 → 死叉卖出
        golden = CROSS(dif, dea)
        death = CROSS(dea, dif)

        df["signal"] = 0
        df.loc[golden == 1, "signal"] = 1
        df.loc[death == 1, "signal"] = -1
        df["price"] = df["Close"]

        valid = ~np.isnan(dif) & ~np.isnan(dea)
        return df.loc[valid]
