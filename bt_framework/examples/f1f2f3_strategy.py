# -*- coding: utf-8 -*-
"""
F1+F2+F3 三因子策略。

买入条件（三者同时满足）：
  F1 均线趋势向上: MA60斜率>0, MA20或MA30至少一个斜率>0, MA5斜率>=0
  F2 涨停基因:    近20天内 max(close/prev_close) >= 1.098
  F3 上穿MA5:     CROSS(C,MA5)，且买入时MA5斜率>=0；
                  若上穿当天斜率不满足，次日close仍>MA5且MA5不下降也可买入

卖出条件：
  prot_adj: PROT_ADJ 移动止盈（让利修正_日线，HHVBARS峰值锁定）

风控止损: 由引擎处理（10% 固定止损 + 分层利润保护）

每只股票只在买入信号首次触发时买入，持有期间不重复买入。
"""

import numpy as np
import pandas as pd
from MyTT import MA, REF, HHV, COUNT

from bt_framework.base import BaseStrategy


class F1F2F3Strategy(BaseStrategy):
    """F1(均线做多) + F2(涨停基因) + F3(5日线之上)"""

    def __init__(
        self,
        ma_short=5,
        ma_mid=10,
        ma_long=20,
        ma_xlong=60,
        zt_lookback=20,
        zt_threshold=1.098,
        sell_mode="ma5",  # "ma5" = 跌破MA5, "prot_adj" = PROT_ADJ移动止盈
        use_flash_crash=True,  # 是否启用四天跌5%急跌止盈（profit_protection启用时建议关闭）
    ):
        self._ms = ma_short
        self._mm = ma_mid
        self._ml = ma_long
        self._mx = ma_xlong
        self._zl = zt_lookback
        self._zt = zt_threshold
        self._sell_mode = sell_mode
        self._use_flash_crash = use_flash_crash

    @property
    def name(self):
        base = (
            f"F1F2F3(MA60↑+MA20/30↑+MA5≥0"
            f"+涨停{self._zl}日+CROSS(C,MA{self._ms}))"
        )
        sell = "PROT_ADJ止盈" if self._sell_mode == "prot_adj" else "跌破MA5卖出"
        return f"{base} + {sell}"

    @property
    def params(self):
        return {
            "ma_short": self._ms,
            "ma_mid": self._mm,
            "ma_long": self._ml,
            "ma_xlong": self._mx,
            "zt_lookback": self._zl,
            "zt_threshold": self._zt,
            "sell_mode": self._sell_mode,
        }

    def compute(self, df):
        C = df["Close"].values.astype(float)
        prev_close = (
            df["prev_close"].values.astype(float)
            if "prev_close" in df.columns
            else REF(C, 1)
        )

        # ---- 计算均线 ----
        MA5 = MA(C, self._ms)
        MA10 = MA(C, self._mm)
        MA20 = MA(C, self._ml)
        MA30 = MA(C, 30)
        MA60 = MA(C, self._mx)

        # ---- F1: 均线趋势向上 ----
        # ① MA60 斜率 > 0（必须）
        ma60_up = MA60 > REF(MA60, 1)
        # ② MA20 或 MA30 至少一个斜率 > 0
        ma20_up = MA20 > REF(MA20, 1)
        ma30_up = MA30 > REF(MA30, 1)
        trend_ok = ma30_up | ma20_up
        # ③ MA5 斜率 >= 0（必须）
        ma5_slope_ok = MA5 >= REF(MA5, 1)
        cond_f1 = ma60_up & trend_ok & ma5_slope_ok

        # ---- F2: 涨停基因（近20天内有过涨停） ----
        daily_ret = C / prev_close
        has_zt = daily_ret >= self._zt
        cond_f2 = COUNT(has_zt.astype(float), self._zl) >= 1

        # ---- F3: CROSS(C,MA5) + MA5斜率确认（允许次日补买） ----
        cross_ma5 = (C > MA5) & (REF(C, 1) <= REF(MA5, 1))
        # 上穿当天 MA5 斜率满足 → 当天买入
        f3_same_day = cross_ma5 & ma5_slope_ok
        # 上穿当天 MA5 斜率不满足 → 次日 close 仍 > MA5 且 MA5 不下降 → 可买
        cross_yday_bad = cross_ma5 & ~ma5_slope_ok
        delayed_ok = (REF(cross_yday_bad.astype(float), 1).astype(bool)
                      & (C > MA5) & (MA5 >= REF(MA5, 1)))
        cond_f3 = f3_same_day | delayed_ok

        # ---- 买入信号: F1 AND F2 AND F3，仅首次触发 ----
        qualified = cond_f1 & cond_f2 & cond_f3
        # 去重：只在信号从 False→True 的当天买入
        buy = qualified & ~REF(qualified.astype(float), 1).astype(bool)

        # ---- 始终计算 PROT_ADJ（供引擎分层利润保护） ----
        from bt_framework.examples.moving_stop_profit import compute_moving_stop
        lines = compute_moving_stop(df)
        prot_adj = lines["rangli_adjusted"].values

        # ---- 卖出信号 ----
        if self._sell_mode == "prot_adj":
            L = df["Low"].values.astype(float)
            sell_trailing = (C < prot_adj) & (REF(C, 1) >= REF(prot_adj, 1))
            if self._use_flash_crash:
                drop5_stop = lines["drop5_stop"].values
                sell_flash = (L <= drop5_stop) & ~np.isnan(drop5_stop)
                sell = sell_trailing | sell_flash
            else:
                sell = sell_trailing
        else:
            sell = (C < MA5) & (REF(C, 1) >= REF(MA5, 1))

        # ---- 写入 DataFrame ----
        df["signal"] = 0
        df.loc[pd.Series(buy.astype(bool), index=df.index), "signal"] = 1
        df.loc[pd.Series(sell, index=df.index), "signal"] = -1
        df["price"] = C
        df["prot_adj"] = prot_adj  # 输出PROT_ADJ供引擎分层利润保护

        # 过滤掉均线未计算完成的早期数据
        valid = ~np.isnan(MA60) & ~np.isnan(MA30) & ~np.isnan(prot_adj)
        return df.loc[valid]
