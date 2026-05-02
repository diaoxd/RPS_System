# -*- coding: utf-8 -*-
"""
策略基类 —— 所有策略继承此类。
策略只做一件事：给定一只股票的完整日线，返回买卖信号。
"""


class BaseStrategy:
    """策略基类"""

    @property
    def name(self) -> str:
        """策略名称，默认取类名"""
        return self.__class__.__name__

    @property
    def params(self) -> dict:
        """策略参数（用于结果展示）"""
        return {}

    def compute(self, df):
        """
        核心方法：对一只股票计算买卖信号。

        参数
        ----------
        df : pd.DataFrame
            包含列: date, Open, High, Low, Close, volume, amount,
                    turnover_rate, prev_close
            已按 date 升序排列，index 为 date

        返回
        -------
        pd.DataFrame
            在原 df 基础上增加两列:
            - signal:  1=买入, -1=卖出, 0=持有
            - price:   成交价格（策略认为应该以什么价成交）
        """
        raise NotImplementedError("子类必须实现 compute() 方法")
