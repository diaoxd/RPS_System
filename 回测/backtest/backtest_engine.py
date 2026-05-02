import backtrader as bt

import pandas as pd

try:
    from 回测.config import INITIAL_CASH, COMMISSION
    from 回测.backtest.factor_feed import FactorPandasData
    from 回测.strategies.multi_factor_simple_strategy import MultiFactorSimpleStrategy
except ImportError:
    from config import INITIAL_CASH, COMMISSION
    from backtest.factor_feed import FactorPandasData
    from strategies.multi_factor_simple_strategy import MultiFactorSimpleStrategy


class BacktestEngine:

    def __init__(self, strategy_cls=None):

        self.cerebro = bt.Cerebro()

        if strategy_cls is None:
            strategy_cls = MultiFactorSimpleStrategy

        self.cerebro.addstrategy(strategy_cls)

        self.cerebro.broker.setcash(INITIAL_CASH)

        self.cerebro.broker.setcommission(COMMISSION)

    def add_data(self, df):

        df = df.copy()

        df['datetime'] = pd.to_datetime(df['date'])

        df.set_index('datetime', inplace=True)

        if 'mom_20' in df.columns and 'rsi_14' in df.columns:
            data = FactorPandasData(dataname=df)
        else:
            data = bt.feeds.PandasData(
                dataname=df,
                open='open',
                high='high',
                low='low',
                close='close',
                volume='volume',
            )

        self.cerebro.adddata(data)

        return self

    def add_analyzers(self):

        self.cerebro.addanalyzer(bt.analyzers.SharpeRatio, _name='sharpe')

        self.cerebro.addanalyzer(bt.analyzers.DrawDown, _name='dd')

        self.cerebro.addanalyzer(bt.analyzers.Returns, _name='ret')

        self.cerebro.addanalyzer(bt.analyzers.TradeAnalyzer, _name='trade')

        return self

    def run(self):

        print("初始资金：",
        self.cerebro.broker.getvalue())

        res = self.cerebro.run()

        print("最终资金：",
        self.cerebro.broker.getvalue())

        return res

    def get_metrics(self, res):

        st = res[0]

        return {

        "sharpe": st.analyzers.sharpe.get_analysis().get("sharperatio", 0),

        "max_drawdown": st.analyzers.dd.get_analysis()["max"]["drawdown"],

        "total_ret": st.analyzers.ret.get_analysis()["rtot"] * 100,

        "annual_ret": st.analyzers.ret.get_analysis()["rnorm100"],

        }
