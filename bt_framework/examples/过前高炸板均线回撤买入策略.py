# -*- coding: utf-8 -*-
"""
Layer 2 买入策略 —— 多条件组合。

三个筛选条件（股票必须满足才能被考虑）：
  1. 过前高：近期收盘价曾突破 N 日最高价，且当前仍在突破位上方（结构看多）
  2. 涨停炸板：过去10天内有过涨停或炸板（近期有资金关注）
  3. 均线做多：MA趋势打分 >= 阈值（趋势向上）

一个触发条件（实际买入时机）：
  4. 回撤买入：近期有过大涨，当日从5日高点回撤 >= 阈值，且当日收跌

卖出：暂用 MA20 下穿 MA5 作为默认卖出（待 Layer 3 替换）。
"""

import numpy as np
import pandas as pd
from MyTT import MA, REF, HHV, CROSS, COUNT

from bt_framework.base import BaseStrategy


# Layer2买入策略：过前高 + 涨停炸板 + 均线多头排列 + 回撤买入，四个条件组合筛选买点
class Layer2BuyStrategy(BaseStrategy):
    """多条件组合买入策略"""

    def __init__(
        self,
        breakout_n=60,          # 过前高：突破N日高点
        breakout_hold_days=20,  # 突破有效期内仍视为"过前高"
        zt_days=10,             # 涨停炸板：过去N天
        ma_score_min=8,         # 均线做多：最低分
        pullback_pct=0.03,      # 回撤比例
        rise_lookback=20,       # 大涨检测回溯天数
        rise_min_pct=0.15,      # 大涨阈值
    ):
        self._bn = breakout_n
        self._bh = breakout_hold_days
        self._zt = zt_days
        self._ms = ma_score_min
        self._pp = pullback_pct
        self._rl = rise_lookback
        self._rp = rise_min_pct

    @property
    def name(self):
        return (
            f"Layer2买入(过前高{self._bn}日+炸板{self._zt}日"
            f"+均线{self._ms}分+回撤{self._pp*100:.0f}%)"
        )

    @property
    def params(self):
        return {
            "breakout_n": self._bn,
            "breakout_hold_days": self._bh,
            "zt_days": self._zt,
            "ma_score_min": self._ms,
            "pullback_pct": self._pp,
            "rise_lookback": self._rl,
            "rise_min_pct": self._rp,
        }

    def compute(self, df):
        C = df["Close"].values
        H = df["High"].values
        O = df["Open"].values

        # ============================================================
        # 条件1：过前高
        #   最近 breakout_hold_days 天内，曾出现收盘价 > 前 N 日最高价
        #   且当前收盘价仍在前 N 日最高价的 98% 以上（结构未破坏）
        # ============================================================
        prev_n_high = REF(HHV(H, self._bn), 1)
        breakout_day = C > prev_n_high
        recent_breakout = COUNT(breakout_day.astype(float), self._bh) >= 1
        still_above_breakout = C > prev_n_high * 0.98
        cond_breakout = recent_breakout & still_above_breakout

        # ============================================================
        # 条件2：涨停炸板 —— 过去 N 天内有涨停或炸板
        # ============================================================
        prev_close = (
            df["prev_close"].values if "prev_close" in df.columns else REF(C, 1)
        )
        limit_up_price = np.round(prev_close * 1.1, 2)

        is_limit_up = np.round(C, 2) >= limit_up_price
        is_zhaban = (
            (np.round(O, 2) >= limit_up_price) & (np.round(C, 2) < limit_up_price)
        )
        cond_zt = COUNT((is_limit_up | is_zhaban).astype(float), self._zt) >= 1

        # ============================================================
        # 条件3：均线做多 —— 4均线打分 >= 阈值（满分12）
        # ============================================================
        MA5 = MA(C, 5)
        MA10 = MA(C, 10)
        MA20 = MA(C, 20)
        MA60 = MA(C, 60)

        def _score(ma):
            return (
                (ma > REF(ma, 1)).astype(int)
                + (ma > REF(ma, 5)).astype(int)
                + (ma > REF(ma, 10)).astype(int)
            )

        ma_total = _score(MA5) + _score(MA10) + _score(MA20) + _score(MA60)
        cond_ma = ma_total >= self._ms

        # ============================================================
        # 条件4（触发）：回撤买入
        #   a) 近期有过大涨（N 日涨幅 >= 阈值）
        #   b) 当日收跌
        #   c) 收盘价从 5 日高点回撤 >= 阈值
        # ============================================================
        had_big_rise = C > REF(C, self._rl) * (1 + self._rp)
        down_day = C < REF(C, 1)
        h5 = HHV(H, 5)
        pullback_trigger = (C < h5 * (1 - self._pp)) & down_day & had_big_rise

        # ============================================================
        # 买入：三个筛选条件 + 一个触发条件同时满足
        #   只在触发条件首次成立时产生信号
        # ============================================================
        qualified = cond_breakout & cond_zt & cond_ma
        buy_signal = qualified & pullback_trigger

        buy = buy_signal & ~REF(buy_signal.astype(float), 1).astype(bool)

        # ============================================================
        # 卖出：MA20 下穿 MA5（占位）
        # ============================================================
        sell = CROSS(MA20, MA5)

        # ============================================================
        # 写入 DataFrame
        # ============================================================
        df["signal"] = 0
        df.loc[pd.Series(buy.astype(bool), index=df.index), "signal"] = 1
        df.loc[pd.Series(sell.astype(bool), index=df.index), "signal"] = -1
        df["price"] = C

        valid = ~np.isnan(MA60)
        return df.loc[valid]
