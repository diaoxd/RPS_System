import backtrader as bt
import pandas as pd


# 1. 定义策略类（核心逻辑）
class SimpleMAStrategy(bt.Strategy):
    # 策略参数（可外部调整）
    params = (('ma_period', 5),)  # 5日均线

    def __init__(self):
        # 计算5日均线
        self.ma = bt.indicators.SimpleMovingAverage(
            self.data.close, period=self.params.ma_period
        )

    def next(self):
        # next()方法：每根K线执行一次，核心交易逻辑写在这里
        # 如果没有持仓，且收盘价上穿5日均线 → 买入
        if not self.position and self.data.close[0] > self.ma[0]:
            # 买入：用全部资金买入（size=None 表示满仓）
            self.buy(size=None)
            print(f"买入：{self.data.datetime.date(0)}，价格：{self.data.close[0]}")

        # 如果有持仓，且收盘价下穿5日均线 → 卖出
        elif self.position and self.data.close[0] < self.ma[0]:
            # 卖出：平仓全部持仓
            self.sell(size=self.position.size)
            print(f"卖出：{self.data.datetime.date(0)}，价格：{self.data.close[0]}")


# 2. 初始化回测引擎
cerebro = bt.Cerebro()

# 3. 添加策略到回测引擎
cerebro.addstrategy(SimpleMAStrategy)

# 4. 获取测试数据（这里用恒指ETF示例，也可以替换成自己的csv数据）
# 方式1：直接用pandas读取本地csv（推荐，格式需包含：datetime,open,high,low,close,volume）
# data = pd.read_csv('your_data.csv', index_col=0, parse_dates=True)
# feed = bt.feeds.PandasData(dataname=data)

# 方式2：用Backtrader内置的Yahoo财经数据（无需本地文件，直接运行）
data = bt.feeds.YahooFinanceData(
    dataname='02828.HK',  # 恒指ETF代码
    fromdate=pd.Timestamp('2023-01-01'),
    todate=pd.Timestamp('2024-01-01'),
    reverse=False
)

# 5. 将数据添加到回测引擎
cerebro.adddata(data)

# 6. 设置初始资金
cerebro.broker.setcash(100000.0)  # 初始资金10万

# 7. 设置手续费（可选，模拟真实交易）
cerebro.broker.setcommission(commission=0.001)  # 千分之一手续费

# 8. 运行回测
print(f"初始资金：{cerebro.broker.getvalue():.2f}")
cerebro.run()
print(f"回测结束资金：{cerebro.broker.getvalue():.2f}")

# 9. 绘制回测结果图（直观看到买卖点和资金曲线）
cerebro.plot()