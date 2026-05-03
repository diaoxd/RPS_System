# -*- coding: utf-8 -*-
"""
移动止盈策略 —— 通达信公式转写。

包含两部分止盈逻辑：
  1. 基础动态止盈线（PROTECTED / 让利线 / PROT_ADJ）
     - 统计10日内下跌幅度均值，在最低价下方留2倍缓冲
     - PROTECTED = 近3日 SHORT_STOP 的最大值（原始线，可升可降）
     - PROT_ADJ = 修正止盈线：上升时跟涨，走平/下跌时锁定在最近走平点

  2. 四天跌5个点止盈（急跌保护）
     - 4日内最高价回撤≥5%时，以最高价的 20/21 作为止盈价
"""

import numpy as np
import pandas as pd

from bt_framework.base import BaseStrategy
from bt_framework.tdx_funcs import REF, IF, BARSLAST, HHV


# ============================================================
# 辅助函数
# ============================================================

def REF_AT(series, offsets):
    """
    动态 REF：每根 bar 按不同偏移量取历史值。
    offset[i] 表示第 i 根 bar 往前看多少根。
    对应 TDX 中 REF(X, 动态变量) 的用法。
    """
    vals = series.values if isinstance(series, pd.Series) else series
    result = np.empty(len(vals))
    for i, offset in enumerate(offsets):
        o = int(offset)
        if o < 0 or i - o < 0:
            result[i] = vals[i]
        else:
            result[i] = vals[i - o]
    return pd.Series(result, index=series.index)


def SUM_10(series):
    """10 周期滚动求和，等效 TDX SUM(X, 10)"""
    return series.rolling(10, min_periods=1).sum()


def MAX(a, b):
    """逐元素取最大值"""
    return np.maximum(a, b)


# ============================================================
# 核心计算
# ============================================================

def compute_moving_stop(df):
    """
    计算全部止盈线。

    参数
    ----------
    df : pd.DataFrame
        含 Open, High, Low, Close 列，已按日期升序排列

    返回
    -------
    pd.DataFrame
        含止盈线各列，index 与 df 一致
    """
    L = df["Low"].values
    H = df["High"].values
    C = df["Close"].values

    L_s = pd.Series(L, index=df.index)
    H_s = pd.Series(H, index=df.index)
    C_s = pd.Series(C, index=df.index)

    # ---------- 基础止盈线 ----------

    # DOWN_PEN := IF(REF(LOW,1)>LOW, REF(LOW,1)-LOW, 0)
    down_pen = IF(REF(L_s, 1) > L_s, REF(L_s, 1) - L_s, 0.0)

    # SUM_D_P := SUM(DOWN_PEN,10)
    sum_d_p = SUM_10(down_pen)

    # PEN := IF(REF(LOW,1)>LOW, 1, 0)
    pen = IF(REF(L_s, 1) > L_s, 1.0, 0.0)

    # DOWN_NUMB := SUM(PEN,10)
    down_numb = SUM_10(pen)

    # DN_AVG := SUM_D_P/MAX(DOWN_NUMB,1)
    dn_avg = sum_d_p / MAX(down_numb.values, 1.0)

    # SHORT_STOP := LOW-2*DN_AVG
    short_stop = L - 2.0 * dn_avg.values

    # PROTECTED := MAX(MAX(SHORT_STOP, REF(SHORT_STOP,1)), REF(SHORT_STOP,2))
    ss_s = pd.Series(short_stop, index=df.index)
    # PROTECTED 是原始 3 日最大值（可升可降），真正的只升不降由 PROT_ADJ 实现
    protected = MAX(MAX(short_stop, REF(ss_s, 1).values), REF(ss_s, 2).values)

    # 让利线_日线 := PROTECTED * 0.99
    rangli_line = protected * 0.99

    # ---------- 四天跌 5 个点止盈 ----------

    # 四天跌5个点 := 100*(HHV(H,4)-C)/C >= 5
    hhv4 = HHV(H_s, 4)
    four_day_drop_5 = (100.0 * (hhv4 - C_s) / C_s) >= 5.0

    # 跌5个点止盈 := HHV(H,4) * (20/21)
    drop5_stop = hhv4.values * (20.0 / 21.0)

    # 跌5个点止盈最终 := IF(L>跌5个点止盈, DRAWNULL, 跌5个点止盈)
    # DRAWNULL → NaN（突破止盈线则不绘制）
    drop5_final = np.where(L > drop5_stop, np.nan, drop5_stop)

    # ---------- 止盈线状态判断 ----------

    prot_s = pd.Series(protected, index=df.index)

    # IS_RISING  := PROTECTED >  REF(PROTECTED,1)
    is_rising = protected > REF(prot_s, 1).values

    # IS_FLAT    := PROTECTED == REF(PROTECTED,1)
    is_flat = protected == REF(prot_s, 1).values

    # IS_FALLING := PROTECTED <  REF(PROTECTED,1)
    is_falling = protected < REF(prot_s, 1).values

    # ---------- 特殊走平点（走平且前一根在下跌）----------

    ref1_prot = REF(prot_s, 1).values
    ref2_prot = REF(prot_s, 2).values

    # SPCL_FLAT := IS_FLAT AND REF(PROTECTED,1) < REF(PROTECTED,2)
    spcl_flat = is_flat & (ref1_prot < ref2_prot)

    # SFLAT_DAY := BARSLAST(SPCL_FLAT)
    sflat_day = BARSLAST(pd.Series(spcl_flat, index=df.index))

    # 最高止盈线 := REF(让利线, SFLAT_DAY+1)
    # (原始代码中此行被注释，但 PROT_ADJ 依赖此值)
    rangli_s = pd.Series(rangli_line, index=df.index)
    highest_stop = REF_AT(rangli_s, sflat_day.values + 1).values

    # ---------- 走平点追踪 ----------

    # FLAT_BAR := IF(IS_FLAT, 1, 0)
    flat_bar = IF(pd.Series(is_flat, index=df.index), 1.0, 0.0)

    # FLAT_COUNT := BARSLAST(FLAT_BAR)
    flat_count = BARSLAST(flat_bar.astype(bool))

    # LAST_FLAT_PROT := REF(PROTECTED, FLAT_COUNT)
    last_flat_prot = REF_AT(prot_s, flat_count.values).values

    # ---------- 修正止盈线 ----------

    # PROT_ADJ :
    #   IS_RISING  → 让利线（当前值，随涨随升）
    #   IS_FLAT    → 最高止盈线（锁定在特殊走平点的让利线值）
    #   IS_FALLING → 最高止盈线（锁定不降）
    prot_adj = np.where(
        is_rising, rangli_line,
        np.where(is_flat | is_falling, highest_stop, rangli_line)
    )

    # ---------- 特殊条件（价格在止盈线上方但止盈线下跌）----------

    # SPECIAL_COND := IS_FALLING AND C>PROTECTED AND REF(C,1)>REF(PROTECTED,1)
    ref1_c = REF(C_s, 1).values
    special_cond = is_falling & (C > protected) & (ref1_c > ref1_prot)

    # ---------- 组合输出 ----------

    result = pd.DataFrame(index=df.index)
    result["short_stop"] = short_stop
    result["protected"] = protected
    result["rangli_line"] = rangli_line
    result["drop5_stop"] = drop5_stop
    result["drop5_final"] = drop5_final
    result["is_rising"] = is_rising
    result["is_flat"] = is_flat
    result["is_falling"] = is_falling
    result["spcl_flat"] = spcl_flat
    result["sflat_day"] = sflat_day.values
    result["highest_stop"] = highest_stop
    result["last_flat_prot"] = last_flat_prot
    result["prot_adj"] = prot_adj
    result["special_cond"] = special_cond

    return result


# ============================================================
# 综合策略：均线金叉买入 + 移动止盈卖出
# ============================================================

# 买入：均线金叉 ｜ 卖出：移动止盈 + 四天跌5%急跌
class GoldenCrossTrailingStopStrategy(BaseStrategy):
    """
    综合策略 —— 均线金叉买入 + 移动止盈卖出。

    买入条件：
      - MA短 上穿 MA长（金叉），以收盘价买入

    卖出条件（满足任一即卖出）：
      1. 收盘价跌破 PROT_ADJ 修正止盈线（动态移动止盈）
      2. 最低价触及四天跌5个点急跌止盈线

    止盈线逻辑：
      - 统计10日内下跌幅度均值，在最低价下方留2倍缓冲作为 SHORT_STOP
      - PROTECTED = 近3日 SHORT_STOP 最大值（原始线，可升可降）
      - PROT_ADJ = 修正线：上升时跟涨，走平/下跌时锁定在上次走平点，做到只升不降
    """

    def __init__(self, ma_short=5, ma_long=20, stop_lookback=10, stop_multiplier=2, stop_let=0.99):
        self.ma_short = ma_short
        self.ma_long = ma_long
        self.stop_lookback = stop_lookback
        self.stop_multiplier = stop_multiplier
        self.stop_let = stop_let

    @property
    def name(self):
        return f"MA{self.ma_short}/{self.ma_long}金叉 + 移动止盈"

    @property
    def params(self):
        return {
            "买入": f"MA{self.ma_short}金叉MA{self.ma_long}",
            "卖出": "PROT_ADJ移动止盈 + 四天跌5%急跌",
            "止盈周期": self.stop_lookback,
            "止盈倍数": self.stop_multiplier,
            "让利系数": self.stop_let,
        }

    def compute(self, df):
        from MyTT import MA, CROSS

        # ============================================================
        # 一、计算止盈线
        # ============================================================
        lines = compute_moving_stop(df)

        # ============================================================
        # 二、买入信号：MA短 上穿 MA长（金叉）
        # ============================================================
        C = df["Close"].values
        ma_s = MA(C, self.ma_short)
        ma_l = MA(C, self.ma_long)
        buy = CROSS(ma_s, ma_l)

        # ============================================================
        # 三、卖出信号
        # ============================================================
        prot_adj = lines["prot_adj"].values

        # ① 收盘价跌破 PROT_ADJ 修正止盈线
        sell_trailing = CROSS(prot_adj, C)

        # ② 最低价触及四天跌5个点急跌止盈线
        L = df["Low"].values
        drop5 = lines["drop5_stop"].values
        sell_flash = (L <= drop5) & ~np.isnan(drop5)

        sell = sell_trailing | sell_flash

        # ============================================================
        # 四、写入信号
        # ============================================================
        df["signal"] = 0
        df.loc[pd.Series(buy.astype(bool), index=df.index), "signal"] = 1
        df.loc[pd.Series(sell, index=df.index), "signal"] = -1
        df["price"] = df["Close"]

        for col in ["protected", "rangli_line", "prot_adj", "drop5_stop", "drop5_final"]:
            df[col] = lines[col].values

        df["prot_adj"] = prot_adj  # 确保prot_adj列存在（供引擎分层利润保护）

        valid = ~np.isnan(ma_l) & ~np.isnan(prot_adj)
        return df.loc[valid]
