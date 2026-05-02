# -*- coding: utf-8 -*-
"""
动态止盈止损策略（通达信"基础止盈线"公式转写）。

公式逻辑：
  1. 统计最近 10 天的"下跌幅度"平均值（DN_AVG）
  2. 止盈价 = 今天最低价 - 2 × DN_AVG（在最低价下方留出缓冲）
  3. 取最近 3 天的最大值作为"当日候选"止盈价
  4. 累积最大值：从开始到当天，取止盈价的最大值（**只升不降，向右延伸**）

效果：
  - 股价涨 → 止盈线跟着涨 → 锁定利润
  - 股价跌 → 止盈线不动 → 不会被假跌破洗出去
  - 一旦止盈线被刷新到更高位置 → 向右水平延伸，直到下次被刷新

策略：
  买入: MA5/20 金叉
  卖出: 跌破 PROTECTED 防守线（止盈止损）
"""

import numpy as np
import pandas as pd
from MyTT import *

from bt_framework.base import BaseStrategy


class ProtectedStopStrategy(BaseStrategy):
    """动态止盈止损策略"""

    def __init__(
        self,
        ma_short=5,
        ma_long=20,
        lookback=10,
        multiplier=2,
        let_profit=0.99,
    ):
        self._s = ma_short
        self._l = ma_long
        self._lb = lookback       # 统计周期，对应公式中的 10
        self._m = multiplier      # 倍数，对应公式中的 2
        self._lp = let_profit     # 让利系数，对应公式中的 0.99

    @property
    def name(self):
        return f"动态止盈止损"

    @property
    def params(self):
        return {
            "ma": f"{self._s}/{self._l}",
            "lookback": self._lb,
            "multiplier": self._m,
        }

    def compute(self, df):
        L = df["Low"].values
        C = df["Close"].values

        # ============================================================
        # 通达信原文（逐行对应）
        # ============================================================

        # DOWN_PEN := IF(REF(LOW,1)>LOW, REF(LOW,1)-LOW, 0);
        # ↓ 今天创新低了，跌了多少
        down_pen = IF(REF(L, 1) > L, REF(L, 1) - L, 0.0)

        # SUM_D_P := SUM(DOWN_PEN,10);
        sum_d_p = SUM(down_pen, self._lb)

        # PEN := IF(REF(LOW,1)>LOW, 1, 0);
        pen = IF(REF(L, 1) > L, 1.0, 0.0)

        # DOWN_NUMB := SUM(PEN,10);
        down_numb = SUM(pen, self._lb)

        # DN_AVG := SUM_D_P/MAX(DOWN_NUMB,1);
        dn_avg = sum_d_p / np.maximum(down_numb, 1.0)

        # SHORT_STOP := LOW-2*DN_AVG;
        short_stop = L - self._m * dn_avg

        # 当日候选止盈价：取最近3天 SHORT_STOP 的最大值
        candidate = np.maximum(
            np.maximum(short_stop, REF(short_stop, 1)),
            REF(short_stop, 2),
        )

        # PROTECTED := 候选止盈价的累积最大值
        # ↓ 从开始到今天，取所有候选止盈价的最大值
        # ↓ 效果：止盈价一旦涨上去，就保持在那个位置向右延伸，永不下降
        protected = pd.Series(candidate).cummax().values

        # ============================================================
        # 信号
        # ============================================================

        # 买入：MA5/20 金叉
        ma_short = MA(C, self._s)
        ma_long = MA(C, self._l)
        golden = CROSS(ma_short, ma_long)

        # 卖出：收盘价跌破 PROTECTED 线（线穿价 = 价破线）
        sell = CROSS(protected, C)

        # 写入 DataFrame
        df["signal"] = 0
        df.loc[pd.Series(golden.astype(bool), index=df.index), "signal"] = 1
        df.loc[pd.Series(sell.astype(bool), index=df.index), "signal"] = -1
        df["price"] = df["Close"]

        # 只保留有完整指标值的行
        valid = ~np.isnan(ma_long) & ~np.isnan(protected)
        return df.loc[valid]
