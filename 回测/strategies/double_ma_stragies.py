import backtrader as bt


class DoubleMAStrategy(bt.Strategy):


    params = (

        ('short', 5),

        ('long', 20),

    )


    def __init__(self):


        self.ma5 = bt.indicators.SMA(self.data.close, period=self.p.short)

        self.ma20 = bt.indicators.SMA(self.data.close, period=self.p.long)

        self.cross = bt.indicators.CrossOver(self.ma5, self.ma20)


    def next(self):


        if not self.position:

            if self.cross > 0:

                size = int(self.broker.getcash() * 0.95 // self.data.close[0])

                if size > 0:

                    self.buy(size=size)

                else:

                    if self.cross < 0:

                        self.sell(size=self.position.size)
