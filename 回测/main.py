from 回测.data.dataLoader import DataLoader

from factors.factor_calculator import FactorCalculator

from backtest.backtest_engine import BacktestEngine

from risk.risk_monitor import RiskMonitor

from config import STOCK_LIST



def main():

    print("=" * 50)

    print(" 大模型量化交易系统")

    print("=" * 50)



    # 1. 加载数据

    print("\n[1/4] 加载数据...")

    loader = DataLoader()

    data_dict = loader.load_all_data()



    # 2. 计算因子

    print("\n[2/4] 计算因子...")

    fc = FactorCalculator()

    for code, df in data_dict.items():

        data_dict[code] = fc.calc_all(df)



    # 3. 回测（多因子：FactorCalculator 列经 FactorPandasData 进入 MultiFactorSimpleStrategy）

    print("\n[3/4] 策略回测（多因子示例：mom_20 + rsi_14）...")

    engine = BacktestEngine()

    # 若要用纯双均线、不接因子列，可改为：
    # from backtest.backtest_engine import BacktestEngine
    # from strategies.double_ma_stragies import DoubleMAStrategy
    # engine = BacktestEngine(strategy_cls=DoubleMAStrategy)

    engine.add_data(data_dict[STOCK_LIST[0]])

    engine.add_analyzers()

    res = engine.run()

    m = engine.get_metrics(res)

    print(f"\n=== 回测结果 ===")

    print(f"夏普比率: {m['sharpe']:.2f}")

    print(f"最大回撤: {m['max_drawdown']:.2f}%")

    print(f"总收益: {m['total_ret']:.2f}%")

    print(f"年化收益: {m['annual_ret']:.2f}%")



    # 4. 风控

    print("\n[4/4] 风险监控...")

    pos = {

    "000001": {"value": 50000},

    "600519": {"value": 80000},

    }

    rm = RiskMonitor(pos)

    print(rm.report())



    print("\n✅ 系统运行完成！")



if __name__ == "__main__":

    main()



