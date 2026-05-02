# -*- coding: utf-8 -*-
"""
平台突破选股策略（通达信公式 → myTT 实现）。

买入: 股价突破"平台高点"（最近5天内有穿越）
卖出: 跌破10日均线

myTT 已覆盖: REF, HHV, FILTER, BARSLAST, COUNT, CROSS, MA
仅 BACKSET 需要自己实现
"""

import numpy as np
import pandas as pd
from MyTT import *

from bt_framework.base import BaseStrategy


class PlatformBreakoutStrategy(BaseStrategy):
    """平台突破选股"""

    def __init__(self, n=5, sell_ma=10):
        self._n = n
        self._sell_ma = sell_ma

    @property
    def name(self):
        return f"平台突破(周期={self._n})"

    @property
    def params(self):
        return {"n": self._n, "sell_ma": self._sell_ma}

    def compute(self, df):
        # ---------- 通达信公式逐行转写 ----------

        H = df["High"].values   # 最高价
        L = df["Low"].values    # 最低价
        C = df["Close"].values  # 收盘价

        # LAA:=REF(H,5)=HHV(H,2*5+1)
        # 5天前的最高价 == 近11天的最高价 → 确认阶段性高点
        LAA = REF(H, self._n) == HHV(H, 2 * self._n + 1)

        # LQY:=BACKSET(LAA,5+1)
        # 从阶段性高点向前填充6天
        LQY = _BACKSET(LAA, self._n + 1)

        # LCC:=FILTER(LQY,5) AND H=HHV(H,5+1)
        # 每5天取第一个信号 + 当天最高是近6天最高 → 确认平台高点
        # 价格保留2位小数再比，避免浮点误差
        LCC = FILTER(LQY, self._n).astype(bool) & (
            np.round(H, 2) == np.round(HHV(H, self._n + 1), 2)
        )

        # LDDD:=BARSLAST(LCC) 距离上次平台高点过去了多少天
        LDDD = BARSLAST(LCC.astype(float))

        # 平台高点价:=IF(LDDD=0, H, REF(H, LDDD))
        平台高点价 = _dynamic_ref(H, LDDD)

        # 穿越:=平台高点价>0 AND LOW<=平台高点价 AND CLOSE>平台高点价
        穿越 = (平台高点价 > 0) & (L <= 平台高点价) & (C > 平台高点价)

        # XG:COUNT(穿越,5)>=1  买入信号
        buy = COUNT(穿越.astype(float), self._n) >= 1

        # ---------- 卖出信号 ----------
        # 收盘价跌破10日均线（趋势走弱）
        sell_ma = MA(C, self._sell_ma)
        sell = CROSS(sell_ma, C)  # 均线下穿收盘价

        # ---------- 写入 DataFrame ----------
        df["signal"] = 0
        df.loc[pd.Series(buy, index=df.index), "signal"] = 1
        df.loc[pd.Series(sell.astype(bool), index=df.index), "signal"] = -1
        df["price"] = df["Close"]

        return df


# ============================================================
# myTT 没有的函数，自己实现
# ============================================================

def _BACKSET(arr, n):
    """
    通达信 BACKSET(X, N)：当 X 为 True 时，
    把它前面的 N 天（含当天）都设为 True。
    arr : numpy array (bool)
    n   : 向前填充天数
    """
    result = np.zeros_like(arr, dtype=bool)
    for i in range(len(arr)):
        if arr[i]:
            start = max(0, i - n + 1)
            result[start:i + 1] = True
    return result


def _dynamic_ref(value, offset):
    """
    通达信 REF(H, LDDD) 的向量化实现：
    对每行 i，取 offset[i] 天前的 value 值。
    value, offset : numpy array
    """
    n = len(value)
    result = np.zeros(n, dtype=float)
    for i in range(n):
        off = int(offset[i])
        if off == 0:
            result[i] = value[i]
        elif i >= off:
            result[i] = value[i - off]
        else:
            result[i] = 0.0
    return result
