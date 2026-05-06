# -*- coding: utf-8 -*-
"""
通达信公式函数 → Python/pandas 转换工具集。

每个函数名与通达信保持一致，方便公式移植。
输入输出均为 pandas Series，与 myTT（numpy 数组）区分开。
"""

import pandas as pd
import numpy as np


def REF(series, n):
    """REF(X, N) → N 周期前的 X 值"""
    return series.shift(n)


def HHV(series, n):
    """HHV(X, N) → N 周期内的最高值"""
    return series.rolling(n, min_periods=1).max()


def LLV(series, n):
    """LLV(X, N) → N 周期内的最低值"""
    return series.rolling(n, min_periods=1).min()


def BACKSET(series, n):
    """
    BACKSET(X, N) → 向前赋值。
    当 X 成立时，将**包括当天在内的前 N 天**都设为 True。
    """
    result = pd.Series(False, index=series.index)
    true_indices = series[series].index
    for idx in true_indices:
        loc = series.index.get_loc(idx)
        start = max(0, loc - n + 1)
        result.iloc[start:loc + 1] = True
    return result


def FILTER(series, n):
    """
    FILTER(X, N) → 信号过滤。
    当 X 成立时，保留该信号，然后屏蔽其后 N-1 个周期，
    再搜索下一个 X。
    """
    result = pd.Series(False, index=series.index)
    i = 0
    while i < len(series):
        if series.iloc[i]:
            result.iloc[i] = True
            i += n
        else:
            i += 1
    return result


def BARSLAST(series):
    """
    BARSLAST(X) → 距上次 X 成立以来的周期数。
    若从未成立，返回从数据起始到当前的位置数。
    """
    result = pd.Series(index=series.index, dtype=int)
    last_true = -1
    for i in range(len(series)):
        if series.iloc[i]:
            last_true = i
        result.iloc[i] = i - last_true if last_true >= 0 else i + 1
    return result


def COUNT(series, n):
    """COUNT(X, N) → N 周期内 X 成立的次数"""
    return series.rolling(n, min_periods=1).sum().astype(int)


def IF(cond, true_val, false_val):
    """IF(C, A, B) → 条件 C 成立返回 A，否则返回 B"""
    return pd.Series(np.where(cond, true_val, false_val), index=cond.index)


def HHVBARS(series, n):
    """
    HHVBARS(X, N) → N 周期内最高值距今的周期数。
    当前 bar 为最高时返回 0，有多个相同最高值时取最近的。
    忽略 NaN。
    """
    vals = series.values.astype(float)
    n_int = int(n)
    result = np.full(len(vals), 0)
    for i in range(len(vals)):
        start = max(0, i - n_int + 1)
        window = vals[start:i + 1]
        # 忽略 NaN 取最大值；若全 NaN 则返回 0
        finite = window[~np.isnan(window)]
        if len(finite) == 0:
            result[i] = 0
            continue
        max_val = np.max(finite)
        dist = 0
        for j in range(i, start - 1, -1):
            if not np.isnan(vals[j]) and vals[j] == max_val:
                dist = i - j
                break
        result[i] = dist
    return pd.Series(result, index=series.index, dtype=int)


def CROSS(a, b):
    """CROSS(A, B) → A 上穿 B（A 从 ≤B 变成 >B）"""
    return (a > b) & (a.shift(1) <= b.shift(1))
