# -*- coding: utf-8 -*-
"""
MA5 金叉 MA20 买入，MA5 死叉 MA20 卖出策略。
"""

from bt_framework.base import BaseStrategy


class MACrossStrategy(BaseStrategy):
    """MA5/MA20 金叉死叉策略"""

    def __init__(self, ma_short=5, ma_long=20):
        self._ma_short = ma_short
        self._ma_long = ma_long

    @property
    def name(self):
        return f"MA{self._ma_short}金叉MA{self._ma_long}"

    @property
    def params(self):
        return {
            "ma_short": self._ma_short,
            "ma_long": self._ma_long,
        }

    def compute(self, df):
        """
        输入: 包含 Close 列的日线 DataFrame
        输出: 增加 signal, price 两列
        """
        # 计算均线
        df["ma_short"] = df["Close"].rolling(self._ma_short).mean()
        df["ma_long"] = df["Close"].rolling(self._ma_long).mean()

        # 金叉: ma_short 上穿 ma_long
        df["golden_cross"] = (df["ma_short"] > df["ma_long"]) & (
            df["ma_short"].shift(1) <= df["ma_long"].shift(1)
        )
        # 死叉: ma_short 下穿 ma_long
        df["death_cross"] = (df["ma_short"] < df["ma_long"]) & (
            df["ma_short"].shift(1) >= df["ma_long"].shift(1)
        )

        # 信号列
        df["signal"] = 0
        df.loc[df["golden_cross"], "signal"] = 1
        df.loc[df["death_cross"], "signal"] = -1

        # 以收盘价作为成交价
        df["price"] = df["Close"]

        # 去掉 NaN 行（指标还没算出来的天数）
        df.dropna(subset=["ma_short", "ma_long"], inplace=True)

        return df
