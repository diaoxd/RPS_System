# -*- coding: utf-8 -*-
"""
回调箱体策略 — MA回调上穿 + 涨停箱体区间 + PROT_ADJ移动止盈。

买入条件（三者同时满足）：
  条件1 均线支撑:  MA20 或 MA30 至少有一条斜率 > 0（中期趋势向上）
  条件2 回调上穿:  收盘价由下向上突破 MA5，且上穿时 MA5 斜率 >= 0
  条件3 箱体区间:  买入价位于近120日最大涨停箱体的 [箱底, 箱顶] 区间内

卖出条件:
  PROT_ADJ 移动止盈（只升不降）

风控止损:
  由引擎处理（10% 固定止损 + 分层利润保护）
"""

import numpy as np
import pandas as pd
from MyTT import MA, REF

from bt_framework.base import BaseStrategy
from bt_framework.examples.limit_up_box import find_largest_box
from bt_framework.examples.moving_stop_profit import compute_moving_stop


class PullbackBoxStrategy(BaseStrategy):
    """回调上穿MA5 + 涨停箱体 + PROT_ADJ止盈"""

    def __init__(
        self,
        ma_short=5,
        ma_trend_a=20,
        ma_trend_b=30,
        box_lookback=120,
    ):
        self._ms = ma_short
        self._ma = ma_trend_a
        self._mb = ma_trend_b
        self._box_lookback = box_lookback

    @property
    def name(self):
        return (
            f"回调箱体(MA{self._ma}/{self._mb}↑"
            f"+上穿MA{self._ms}"
            f"+涨停箱体{self._box_lookback}日)"
        )

    @property
    def params(self):
        return {
            "ma_short": self._ms,
            "ma_trend_a": self._ma,
            "ma_trend_b": self._mb,
            "box_lookback": self._box_lookback,
        }

    @staticmethod
    def _find_box_at(high_arr, close_arr, low_arr, end_idx, max_search):
        """在 end_idx 处查找涨停箱体（切片到 end_idx）"""
        # 切片：只看到 end_idx 为止的数据（不含未来）
        end = min(end_idx + 1, len(close_arr))
        start = max(0, end - max_search)
        return find_largest_box(
            high_arr[start:end],
            close_arr[start:end],
            low_arr[start:end],
            max_search_days=max_search,
        )

    def compute(self, df):
        C = df["Close"].values.astype(float)
        H = df["High"].values.astype(float)
        L = df["Low"].values.astype(float)

        n = len(C)

        # ── 均线 ──
        MA5 = MA(C, self._ms)
        MA20 = MA(C, self._ma)
        MA30 = MA(C, self._mb)

        # ── 条件1: MA20 或 MA30 斜率 > 0 ──
        ma20_up = MA20 > REF(MA20, 1)
        ma30_up = MA30 > REF(MA30, 1)
        cond_trend = ma20_up | ma30_up

        # ── 条件2: close 上穿 MA5，且 MA5 斜率 >= 0 ──
        cross_above_ma5 = (C > MA5) & (REF(C, 1) <= REF(MA5, 1))
        ma5_slope_ok = MA5 >= REF(MA5, 1)
        cond_cross = cross_above_ma5 & ma5_slope_ok

        # ── 买入信号（条件1 + 条件2） ──
        base_buy = cond_trend & cond_cross

        # ── 逐日检查条件3（箱体区间） ──
        buy_signal = np.zeros(n, dtype=bool)
        buy_reasons = [None] * n
        buy_reason_details = [None] * n

        buy_indices = np.where(base_buy)[0]
        for idx in buy_indices:
            if idx < max(self._ma, self._mb, self._ms) + 5:
                continue  # 均线未充分计算

            # 查找当日之前的涨停箱体
            box = self._find_box_at(H, C, L, idx, self._box_lookback)
            if box is None:
                continue

            buy_price = C[idx]
            if not (box["bottom_price"] <= buy_price <= box["top_price"]):
                continue

            # 三个条件全部满足
            buy_signal[idx] = True
            buy_reasons[idx] = "回调上穿MA5+涨停箱体支撑"
            buy_reason_details[idx] = {
                "均线支撑": f"MA{self._ma}或MA{self._mb}斜率向上，中期趋势确立",
                "回调上穿": "收盘价由下向上突破MA5，且MA5斜率非负，回调结束信号",
                "箱体区间": (
                    f"买入价{buy_price:.2f}位于涨停箱体"
                    f"[{box['bottom_price']:.2f}～{box['top_price']:.2f}]内，"
                    f"箱体大小{box['box_size']:.1f}%"
                ),
            }

        # ── 卖出: PROT_ADJ 移动止盈 ──
        lines = compute_moving_stop(df)
        prot_adj = lines["rangli_adjusted"].values

        sell_trailing = (C < prot_adj) & (REF(C, 1) >= REF(prot_adj, 1))
        sell_signal = sell_trailing

        # ── 写入 DataFrame ──
        df["signal"] = 0
        df.loc[pd.Series(buy_signal, index=df.index), "signal"] = 1
        df.loc[pd.Series(sell_signal, index=df.index), "signal"] = -1
        df["price"] = C
        df["prot_adj"] = prot_adj

        # 附加买入原因（供导出脚本使用）
        df["_buy_reason"] = buy_reasons
        df["_buy_reason_detail"] = buy_reason_details

        # 过滤均线未完成计算的早期数据
        valid = ~np.isnan(MA30) & ~np.isnan(prot_adj)
        return df.loc[valid]
