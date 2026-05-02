# -*- coding: utf-8 -*-
"""
均线趋势做多策略（通达信公式转写）。

均线打分系统（满分12分）：
  每条均线比 1天前高 +1分，比 5天前高 +1分，比 10天前高 +1分
  4条均线 = 4 × 3 = 12分

买入：总分 >= 8（趋势转强），且之前不在趋势中
卖出：总分 < 8（趋势转弱），且之前在趋势中
"""

import numpy as np
import pandas as pd
from MyTT import *

from bt_framework.base import BaseStrategy


class MaTrendStrategy(BaseStrategy):
    """均线趋势做多"""

    def __init__(self, score_threshold=8):
        """
        Parameters
        ----------
        score_threshold : int
            总分买入阈值（满分12，默认>=8买入）
        """
        self._t = score_threshold

    @property
    def name(self):
        return f"均线趋势做多(阈值={self._t})"

    @property
    def params(self):
        return {"score_threshold": self._t}

    def compute(self, df):
        C = df["Close"].values

        # ============================================================
        # 1. 均线
        # ============================================================
        MA5 = MA(C, 5)
        MA10 = MA(C, 10)
        MA20 = MA(C, 20)
        MA60 = MA(C, 60)

        # ============================================================
        # 2. 各均线打分
        #    比1天前高 +1分，比5天前高 +1分，比10天前高 +1分
        # ============================================================
        def _score(ma):
            """计算单条均线的得分（0~3）"""
            return (
                (ma > REF(ma, 1)).astype(int)
                + (ma > REF(ma, 5)).astype(int)
                + (ma > REF(ma, 10)).astype(int)
            )

        MA5分 = _score(MA5)
        MA10分 = _score(MA10)
        MA20分 = _score(MA20)
        MA60分 = _score(MA60)

        # ============================================================
        # 3. 总分（满分12）
        # ============================================================
        总分 = MA5分 + MA10分 + MA20分 + MA60分

        # ============================================================
        # 4. 信号（只在转折点交易）
        # ============================================================
        # 买入：总分从 < 阈值 变成 >= 阈值（趋势转强）
        buy = (总分 >= self._t) & (REF(总分.astype(float), 1) < self._t)

        # 卖出：总分从 >= 阈值 变成 < 阈值（趋势转弱）
        sell = (总分 < self._t) & (REF(总分.astype(float), 1) >= self._t)

        # ============================================================
        # 5. 写入 DataFrame
        # ============================================================
        df["signal"] = 0
        df.loc[pd.Series(buy, index=df.index), "signal"] = 1
        df.loc[pd.Series(sell, index=df.index), "signal"] = -1
        df["price"] = C

        # 只保留 MA60 已算出来的行
        return df.loc[~np.isnan(MA60)]
