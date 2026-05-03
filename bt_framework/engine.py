# -*- coding: utf-8 -*-
"""
回测引擎 —— 风控 + 交易执行 + 统计输出。
"""

import os
import sys
from dataclasses import dataclass, field
from typing import List, Optional

import pandas as pd

from .data_loader import load_all_stock_data


def _compute_single_stock(args):
    """
    多进程 worker：对单只股票执行策略计算。
    参数: (code, df_dict, strategy)
    返回: (code, df_out)
    """
    code, df_dict, strategy = args

    # Windows spawn 模式下需恢复项目路径
    _PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if _PROJECT_ROOT not in sys.path:
        sys.path.insert(0, _PROJECT_ROOT)

    df = pd.DataFrame(df_dict)
    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"])
        df.set_index("date", inplace=True)

    df_out = strategy.compute(df.copy())
    return code, df_out


# ============================================================
# 数据结构
# ============================================================
@dataclass
class TradeRecord:
    """一笔交易的记录（买入或卖出）"""

    date: str
    code: str
    action: str  # 'buy' | 'sell'
    price: float
    shares: int
    amount: float
    commission: float
    pnl: float = 0.0  # 卖出时的净利润
    hold_days: int = 0  # 卖出时的持仓天数
    reason: str = "signal"  # 'signal' | 'stop_loss' | 'take_profit' | 'trailing_stop'


@dataclass
class BacktestResult:
    """回测结果"""

    start_cash: float
    end_value: float
    total_return_pct: float
    annual_return_pct: float
    win_rate: float
    total_trades: int
    max_drawdown_pct: float
    max_drawdown_days: int
    total_commission: float
    trades: List[TradeRecord] = field(default_factory=list)
    daily_equity: list = field(default_factory=list)

    def __str__(self):
        lines = [
            f"\n{'=' * 42}",
            f"  回测结果",
            f"{'=' * 42}",
            f"  初始资金:     {self.start_cash:>12,.2f}",
            f"  期末总资产:   {self.end_value:>12,.2f}",
            f"  总收益率:     {self.total_return_pct:>11.2f}%",
            f"  年化收益率:   {self.annual_return_pct:>11.2f}%",
            f"  总交易次数:   {self.total_trades:>12}",
            f"  胜率:         {self.win_rate:>11.2f}%",
            f"  最大回撤:     {self.max_drawdown_pct:>11.2f}%",
            f"  回撤天数:     {self.max_drawdown_days:>12}",
            f"  总手续费:     {self.total_commission:>12,.2f}",
            f"{'=' * 42}",
        ]
        return "\n".join(lines)


# ============================================================
# 回测引擎
# ============================================================
# 回测引擎：加载数据→策略计算信号→逐日模拟交易（含风控止损止盈）→输出结果
class BacktestEngine:
    """回测引擎"""

    def __init__(self, verbose=True, n_jobs=1):
        # ----- 用户配置 -----
        self.stock_codes = []
        self.strategy = None
        self.block_pool = None  # BlockPoolSelector 实例（动态股票池）
        self.tdx_dir = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"
        self._date_start = None  # 回测起始日期（可选）
        self._date_end = None    # 回测结束日期（可选）
        self._verbose = verbose
        self._n_jobs = n_jobs    # 多进程并行数（1=单进程）

        # ----- 资金 & 风控参数 -----
        self.risk = {
            "cash": 1_000_000,  # 初始资金
            "max_per_stock": 0.1,  # 单只股票最大仓位（占总资产比例）
            "commission": 0.001,  # 手续费率
            "trailing_stop": None,  # 移动止损（从最高点回落 %）
            "stop_loss": None,  # 固定止损（亏损 %）
            "take_profit": None,  # 固定止盈（盈利 %）
            "profit_protection": False,  # 分层利润保护（基于PROT_ADJ）
        }

        # ----- 运行时状态 -----
        self.data = {}  # {code: DataFrame} 原始日线
        self.signals = {}  # {code: DataFrame} 含 signal, price 列
        self.cash = 0.0
        self.positions = {}  # {code: {shares, avg_cost, high_water, buy_date}}
        self.trades: List[TradeRecord] = []
        self.daily_equity = []  # [(date, total_equity)]
        self._risk_trade_count = 0  # 风控触发的卖出次数（用于胜率排除）

    # ---- 配置接口 ----

    def add_stocks(self, codes):
        """指定要回测的股票代码列表"""
        self.stock_codes = list(codes)
        return self

    def set_strategy(self, strategy):
        """设置策略实例"""
        self.strategy = strategy
        return self

    def set_cash(self, cash: float):
        self.risk["cash"] = cash
        return self

    def set_commission(self, rate: float):
        self.risk["commission"] = rate
        return self

    def set_max_per_stock(self, pct: float):
        """单只股票最大仓位，如 0.1 = 10%"""
        self.risk["max_per_stock"] = pct
        return self

    def set_trailing_stop(self, pct: float):
        """移动止损，如 0.08 = 从最高点回落 8% 卖出"""
        self.risk["trailing_stop"] = pct
        return self

    def set_stop_loss(self, pct: float):
        """固定止损，如 0.07 = 亏损 7% 卖出"""
        self.risk["stop_loss"] = pct
        return self

    def set_take_profit(self, pct: float):
        """固定止盈，如 0.15 = 盈利 15% 卖出"""
        self.risk["take_profit"] = pct
        return self

    def set_profit_protection(self, enable=True):
        """启用分层利润保护（需策略输出 prot_adj 列）"""
        self.risk["profit_protection"] = enable
        return self

    def set_block_pool(self, block_pool, tags=None):
        """设置动态板块池过滤器。tags 如 ['核心', '新兴', '趋势']"""
        self.block_pool = block_pool
        self._pool_tags = tags
        return self

    def set_date_range(self, start=None, end=None):
        """限制回测日期范围，start/end 为 'YYYY-MM-DD' 或 datetime"""
        self._date_start = pd.Timestamp(start) if start else None
        self._date_end = pd.Timestamp(end) if end else None
        return self

    def set_tdx_dir(self, path: str):
        self.tdx_dir = path
        return self

    # ---- 运行回测 ----

    def run(self):
        """执行回测"""
        if not self.strategy:
            raise ValueError("请先通过 set_strategy() 设置策略")

        if self._verbose:
            print(f"\n策略: {self.strategy.name}")
            print(f"参数: {self.strategy.params}\n")

        # 1. 加载数据
        self._load_data()

        # 2. 策略计算信号
        self._compute_signals()

        # 3. 主循环
        self._run_loop()

        # 4. 构建结果
        return self._build_result()

    def _load_data(self):
        """加载所有股票数据"""
        if self.block_pool is not None:
            # 动态池：从回测日期范围内收集候选股票（所有出现过核心池的日期）
            print("收集动态池候选股票...")
            all_stocks = set()
            for date in self.block_pool.get_all_dates():
                if self._date_start and date < self._date_start:
                    continue
                if self._date_end and date > self._date_end:
                    continue
                stocks = self.block_pool.get_pool_stocks(date, self._pool_tags)
                all_stocks.update(stocks)
            self.stock_codes = sorted(all_stocks)
            print(f"  候选股票: {len(self.stock_codes)} 只")

        print("加载股票数据...")
        self.data = load_all_stock_data(
            self.stock_codes, self.tdx_dir, verbose=self._verbose,
            n_jobs=self._n_jobs
        )
        if not self.data:
            raise RuntimeError("没有成功加载任何股票数据")

    def _compute_signals(self):
        """对每只股票调用策略的 compute()，支持多进程并行"""
        if self._verbose:
            print(f"\n策略计算信号...  (并行进程: {self._n_jobs})")

        if self._n_jobs > 1:
            self._compute_signals_parallel()
        else:
            self._compute_signals_sequential()

        if self._verbose:
            total_signals = sum(
                (df["signal"] != 0).sum() for df in self.signals.values()
            )
            print(f"  [OK] 共 {len(self.signals)} 只股票, {total_signals} 条信号")

    def _compute_signals_sequential(self):
        """单进程顺序计算"""
        for code, df in self.data.items():
            df_out = self.strategy.compute(df.copy())
            self._validate_and_store(code, df_out)

    def _compute_signals_parallel(self):
        """多进程并行计算"""
        from concurrent.futures import ProcessPoolExecutor

        # 将 DataFrame 转为 dict 以便序列化
        tasks = []
        for code, df in self.data.items():
            df_dict = df.reset_index().to_dict("list")
            tasks.append((code, df_dict, self.strategy))

        with ProcessPoolExecutor(max_workers=self._n_jobs) as executor:
            futures = [executor.submit(_compute_single_stock, t) for t in tasks]
            for future in futures:
                code, df_out = future.result()
                self._validate_and_store(code, df_out)

    def _validate_and_store(self, code, df_out):
        """验证策略输出并存储"""
        required = {"signal", "price"}
        missing = required - set(df_out.columns)
        if missing:
            raise ValueError(
                f"策略 compute() 返回缺少列: {missing} (股票: {code})"
            )
        self.signals[code] = df_out

    def _run_loop(self):
        """逐日回测主循环"""
        # 收集所有日期并排序
        all_dates = sorted(
            set().union(*[set(df.index) for df in self.signals.values()])
        )
        if not all_dates:
            raise RuntimeError("信号数据为空，无法回测")

        # 过滤日期范围
        if self._date_start:
            all_dates = [d for d in all_dates if d >= self._date_start]
        if self._date_end:
            all_dates = [d for d in all_dates if d <= self._date_end]
        if not all_dates:
            raise RuntimeError("指定日期范围内无交易日")

        self.cash = self.risk["cash"]
        self.positions = {}
        self.trades = []
        self.daily_equity = []
        self._risk_trade_count = 0

        if self._verbose:
            print(f"\n开始回测...  ({all_dates[0].date()} ~ {all_dates[-1].date()})")
            print(f"初始资金: {self.cash:,.2f}")
            print(f"股票数量: {len(self.signals)}")

        bar_interval = max(len(all_dates) // 10, 1)

        for t, date in enumerate(all_dates):
            # ---- 第0遍：计算今日池内股票（仅用于买入过滤） ----
            pool_stocks_today = None
            if self.block_pool is not None:
                pool_stocks_today = set(
                    self.block_pool.get_pool_stocks(date, self._pool_tags)
                )

            # ---- 第一遍：先处理风控（卖出） ----
            risk_sells_today = []
            for code, pos in list(self.positions.items()):
                if code not in self.signals or date not in self.signals[code].index:
                    continue
                row = self.signals[code].loc[date]
                if self._check_stops(code, row, date):
                    risk_sells_today.append(code)

            # ---- 第二遍：处理策略信号（卖出 → 买入） ----
            for code in self.signals:
                if date not in self.signals[code].index:
                    continue
                row = self.signals[code].loc[date]
                signal = int(row["signal"])
                pos_shares = self.positions.get(code, {}).get("shares", 0)

                if signal == -1 and pos_shares > 0 and code not in risk_sells_today:
                    # 策略卖出
                    self._sell(code, row, date, reason="signal")
                elif signal == 1 and pos_shares == 0:
                    # 策略买入 —— 动态池检查
                    if pool_stocks_today is None or code in pool_stocks_today:
                        self._buy(code, row, date)

            # ---- 第三遍：更新持仓股票的最高价和最大浮盈（用于下一日风控） ----
            for code, pos in self.positions.items():
                if date in self.signals[code].index:
                    row = self.signals[code].loc[date]
                    pos["high_water"] = max(pos["high_water"], row["High"])
                    high_profit = (row["High"] - pos["avg_cost"]) / pos["avg_cost"]
                    pos["max_profit"] = max(pos.get("max_profit", 0.0), high_profit)

            # ---- 记录每日总资产 ----
            self._record_equity(date)

            # 进度
            if self._verbose and t % bar_interval == 0 and t > 0:
                pct = t / len(all_dates) * 100
                print(f"  进度: {pct:.0f}%")

        if self._verbose:
            print("  进度: 100%")
            print("回测完成！\n")

    # ---- 风控检查 ----

    def _check_stops(self, code, row, date) -> bool:
        """
        检查是否触发止损/止盈/分层利润保护。
        返回 True 表示已卖出。
        """
        pos = self.positions.get(code)
        if not pos or pos["shares"] <= 0:
            return False

        high_water = pos["high_water"]
        close_price = row["Close"]
        avg_cost = pos["avg_cost"]
        current_profit = (close_price - avg_cost) / avg_cost

        # 更新最大浮盈（基于收盘价）
        pos["max_profit"] = max(pos.get("max_profit", current_profit), current_profit)
        max_profit = pos["max_profit"]

        # 移动止损：从最高点回落 X%
        if self.risk["trailing_stop"] is not None:
            if high_water > 0:
                drawdown = (high_water - close_price) / high_water
                if drawdown >= self.risk["trailing_stop"]:
                    self._sell(code, row, date, reason="trailing_stop")
                    return True

        # 固定止损：亏损 X%
        if self.risk["stop_loss"] is not None:
            loss_pct = (close_price - avg_cost) / avg_cost
            if loss_pct <= -self.risk["stop_loss"]:
                self._sell(code, row, date, reason="stop_loss")
                return True

        # 固定止盈：盈利 X%
        if self.risk["take_profit"] is not None:
            profit_pct = (close_price - avg_cost) / avg_cost
            if profit_pct >= self.risk["take_profit"]:
                self._sell(code, row, date, reason="take_profit")
                return True

        # 分层利润保护（基于PROT_ADJ移动止盈线）
        if self.risk.get("profit_protection"):
            prot_adj = row.get("prot_adj")
            if prot_adj is not None and not pd.isna(prot_adj) and prot_adj > 0:
                prot_adj_profit = (prot_adj - avg_cost) / avg_cost
                low_price = row["Low"]

                # 规则1: 浮盈曾≥10%, 盘中最低价跌破10%利润线, 但未破PROT_ADJ → 保10%
                if max_profit >= 0.10:
                    low_profit = (low_price - avg_cost) / avg_cost
                    if low_profit < 0.10 and low_price > prot_adj:
                        self._sell(code, row, date, reason="profit_lock_10pct")
                        return True

                # 规则2: 浮盈曾≥10%, PROT_ADJ已高于10%利润线, 收盘跌破PROT_ADJ → 更大获利
                if max_profit >= 0.10 and prot_adj_profit > 0.10:
                    if close_price < prot_adj:
                        self._sell(code, row, date, reason="prot_adj_10pct")
                        return True

                # 规则3: 浮盈曾≥5%, PROT_ADJ利润不足3%, 收盘利润≤3% → 保3%
                if max_profit >= 0.05 and prot_adj_profit < 0.03:
                    if current_profit <= 0.03:
                        self._sell(code, row, date, reason="profit_lock_3pct")
                        return True

        return False

    # ---- 交易执行 ----

    def _can_buy(self, row) -> bool:
        """检查能否买入（涨停检查）"""
        prev_close = row.get("prev_close")
        if pd.isna(prev_close):
            return True  # 第一天数据，不判断
        limit_up = round(prev_close * 1.10, 2)
        # 全天最低价 >= 涨停价 → 封死涨停，买不进
        return row["Low"] < limit_up

    def _can_sell(self, row) -> bool:
        """检查能否卖出（跌停检查）"""
        prev_close = row.get("prev_close")
        if pd.isna(prev_close):
            return True
        limit_down = round(prev_close * 0.90, 2)
        # 全天最高价 <= 跌停价 → 封死跌停，卖不出
        return row["High"] > limit_down

    def _buy(self, code, row, date, reason="signal"):
        """执行买入"""
        if not self._can_buy(row):
            return

        price = float(row["price"])
        if price <= 0:
            return

        # 计算总资产 = 现金 + 持仓市值
        total_equity = self._current_equity(date)

        # 预算 = min(总资产×单股上限, 可用现金)
        budget = min(
            total_equity * self.risk["max_per_stock"], self.cash
        )
        if budget <= 0:
            return

        # 预留手续费
        shares = int(budget / (price * (1 + self.risk["commission"])))
        if shares <= 0:
            return

        amount = shares * price
        commission = amount * self.risk["commission"]
        self.cash -= amount + commission

        self.positions[code] = {
            "shares": shares,
            "avg_cost": price,
            "high_water": price,  # 初始最高价 = 买入价
            "max_profit": 0.0,  # 最大浮盈比例
            "buy_date": date,
        }

        self.trades.append(
            TradeRecord(
                date=str(date.date()),
                code=code,
                action="buy",
                price=price,
                shares=shares,
                amount=amount,
                commission=commission,
            )
        )

    def _sell(self, code, row, date, reason="signal"):
        """执行卖出"""
        pos = self.positions.get(code)
        if not pos or pos["shares"] <= 0:
            return

        if not self._can_sell(row):
            # 跌停卖不掉，继续持有
            return

        price = float(row["price"])
        shares = pos["shares"]
        amount = shares * price
        commission = amount * self.risk["commission"]
        self.cash += amount - commission

        # 计算盈亏
        cost_total = pos["avg_cost"] * shares
        pnl = amount - cost_total - commission

        buy_date = pos.get("buy_date", date)
        if pd.isna(buy_date):
            hold_days = 0
        else:
            hold_days = (pd.to_datetime(date) - pd.to_datetime(buy_date)).days

        self.trades.append(
            TradeRecord(
                date=str(date.date()),
                code=code,
                action="sell",
                price=price,
                shares=shares,
                amount=amount,
                commission=commission,
                pnl=pnl,
                hold_days=hold_days,
                reason=reason,
            )
        )

        del self.positions[code]
        if reason != "signal":
            self._risk_trade_count += 1

    # ---- 辅助 ----

    def _current_equity(self, date) -> float:
        """计算当天总资产（现金 + 持仓市值）"""
        equity = self.cash
        for code, pos in self.positions.items():
            if pos["shares"] <= 0:
                continue
            if date in self.signals[code].index:
                mkt_price = float(self.signals[code].loc[date]["price"])
            else:
                mkt_price = pos["avg_cost"]
            equity += pos["shares"] * mkt_price
        return equity

    def _record_equity(self, date):
        """记录每日总资产"""
        equity = self._current_equity(date)
        self.daily_equity.append((pd.Timestamp(date), equity))

    def _calc_max_drawdown(self):
        """从每日净值曲线计算最大回撤"""
        if len(self.daily_equity) < 2:
            return 0.0, 0
        peak = self.daily_equity[0][1]
        max_dd = 0.0
        max_dd_days = 0
        peak_date = self.daily_equity[0][0]

        for date, equity in self.daily_equity:
            if equity > peak:
                peak = equity
                peak_date = date
            dd = (peak - equity) / peak * 100 if peak > 0 else 0
            if dd > max_dd:
                max_dd = dd
                max_dd_days = (date - peak_date).days if peak_date else 0

        return max_dd, max_dd_days

    # ---- 结果 ----

    def _build_result(self) -> BacktestResult:
        """构建回测结果"""
        end_value = self._current_equity(
            self.daily_equity[-1][0] if self.daily_equity else None
        )

        total_return = (end_value / self.risk["cash"] - 1) * 100

        # 胜率（只统计策略信号产生的完整买卖）
        sell_trades = [
            t for t in self.trades if t.action == "sell"
        ]
        total_trades = len(sell_trades)
        win_trades = sum(1 for t in sell_trades if t.pnl > 0)
        win_rate = (win_trades / total_trades * 100) if total_trades > 0 else 0.0

        # 年化收益率
        if len(self.daily_equity) >= 2:
            start = self.daily_equity[0][0]
            end = self.daily_equity[-1][0]
            days = (end - start).days
            years = days / 365.0 if days > 0 else 1.0
            annual_return = ((1 + total_return / 100) ** (1 / years) - 1) * 100
        else:
            annual_return = 0.0

        max_dd, max_dd_days = self._calc_max_drawdown()

        total_commission = sum(t.commission for t in self.trades)

        return BacktestResult(
            start_cash=self.risk["cash"],
            end_value=round(end_value, 2),
            total_return_pct=round(total_return, 2),
            annual_return_pct=round(annual_return, 2),
            win_rate=round(win_rate, 2),
            total_trades=total_trades,
            max_drawdown_pct=round(max_dd, 2),
            max_drawdown_days=max_dd_days,
            total_commission=round(total_commission, 2),
            trades=self.trades,
            daily_equity=self.daily_equity,
        )
