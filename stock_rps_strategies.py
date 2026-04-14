# -*- coding: utf-8 -*-
"""
个股 RPS 策略集合。

设计目标：
1) 把“个股 RPS 选股公式”统一收敛到一个类里，便于后续扩展更多思路；
2) 默认从 SQL Server 的 stock_rps_daily 读取（更贴近日常入库结果）；
3) 支持 extdata 回退（复用现有业务层）。
"""

from __future__ import annotations

import argparse
from datetime import datetime
from typing import Callable

import pandas as pd

from project_config import get_cfg, load_project_config


class 个股Rps策略:
    """
    个股 RPS 选股策略类。

    使用方式：
    - source="sql"：从 stock_rps_daily 读（默认）
    - source="extdata"：从 extdata_5~8、10 读取（通过 rps 业务层封装）
    """

    def __init__(self, source: str = "sql"):
        self.source = (source or "sql").strip().lower()
        if self.source not in {"sql", "extdata", "auto"}:
            raise ValueError("source 必须是 sql / extdata / auto")

    @staticmethod
    def _normalize_code(code) -> str:
        """统一证券代码到 6 位。"""
        if pd.isna(code):
            return ""
        s = str(code).strip()
        if not s:
            return ""
        if len(s) > 6:
            s = s[:6]
        return s.zfill(6)

    def _load_from_sql(self) -> pd.DataFrame:
        """
        从 SQL 读取个股 RPS 日表。
        必要字段：trade_date, stock_code, stock_name, rps5, rps20
        """
        cfg = load_project_config()
        host = str(get_cfg(cfg, "sqlserver", "host", default="")).strip()
        db = str(get_cfg(cfg, "sqlserver", "database", default="")).strip()
        user = str(get_cfg(cfg, "sqlserver", "user", default="")).strip()
        password = str(get_cfg(cfg, "sqlserver", "password", default="")).strip()
        table = str(get_cfg(cfg, "sqlserver", "stock_rps_daily_table", default="stock_rps_daily")).strip()
        if not table:
            table = "stock_rps_daily"
        if not (host and db and user and password):
            raise RuntimeError("SQL 配置不完整，请检查 project_config.json -> sqlserver")

        import pyodbc

        preferred = [
            "ODBC Driver 17 for SQL Server",
            "ODBC Driver 18 for SQL Server",
            "ODBC Driver 13 for SQL Server",
            "SQL Server Native Client 11.0",
            "SQL Server Native Client 10.0",
            "SQL Server",
        ]
        available = [d for d in pyodbc.drivers()]
        driver = next((d for d in preferred if d in available), "ODBC Driver 17 for SQL Server")
        conn_str = (
            f"DRIVER={{{driver}}};"
            f"SERVER={host};"
            f"DATABASE={db};"
            f"UID={user};"
            f"PWD={password};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )

        sql = f"""
SELECT
    trade_date,
    stock_code,
    stock_name,
    rps5,
    rps10,
    rps20,
    rps60,
    rps120
FROM dbo.{table}
WHERE rps5 IS NOT NULL OR rps20 IS NOT NULL
"""
        with pyodbc.connect(conn_str) as conn:
            df = pd.read_sql(sql, conn)
        return df

    @staticmethod
    def _load_from_extdata() -> pd.DataFrame:
        """从 extdata 读取个股 RPS（复用现有业务层封装）。"""
        from rps.board_analysis import 板块Rps分析服务
        from rps.report_settings import 多周期报告配置

        svc = 板块Rps分析服务(多周期报告配置())
        return svc.build_stock_daily_db_frame()

    def _load_data(self) -> pd.DataFrame:
        """按 source 读取原始数据并做基础清洗。"""
        if self.source == "sql":
            df = self._load_from_sql()
        elif self.source == "extdata":
            df = self._load_from_extdata()
        else:
            try:
                df = self._load_from_sql()
                if df is None or df.empty:
                    print("[个股RPS策略] SQL 数据为空，回退 extdata。")
                    df = self._load_from_extdata()
            except Exception as e:
                print(f"[个股RPS策略] SQL 不可用（{e}），回退 extdata。")
                df = self._load_from_extdata()

        if df is None or df.empty:
            return pd.DataFrame()

        work = df.copy()
        if "stock_code" not in work.columns:
            raise RuntimeError("数据缺少 stock_code 字段。")
        if "trade_date" not in work.columns:
            raise RuntimeError("数据缺少 trade_date 字段。")

        work["stock_code"] = work["stock_code"].apply(self._normalize_code)
        work = work[work["stock_code"] != ""]
        work["trade_date"] = pd.to_datetime(work["trade_date"], errors="coerce")
        work = work[pd.notna(work["trade_date"])]
        work["stock_name"] = work.get("stock_name", "").fillna("").astype(str)
        for c in ("rps5", "rps10", "rps20", "rps60", "rps120"):
            if c in work.columns:
                work[c] = pd.to_numeric(work[c], errors="coerce")
            else:
                work[c] = pd.NA
        work = work.sort_values(["stock_code", "trade_date"], kind="mergesort")
        return work

    @staticmethod
    def _latest_prev(work: pd.DataFrame) -> pd.DataFrame:
        """取每个股票最新日与前一日，用于“刚突破”判断。"""
        latest = work.groupby("stock_code", as_index=False).tail(1).copy()
        prev = (
            work.groupby("stock_code", as_index=False)
            .nth(-2)
            .reset_index()
            .rename(columns={"rps5": "rps5_prev", "rps20": "rps20_prev", "trade_date": "trade_date_prev"})
        )
        prev = prev[["stock_code", "trade_date_prev", "rps5_prev", "rps20_prev"]]
        out = latest.merge(prev, on="stock_code", how="left")
        out = out[pd.notna(out["rps5_prev"]) & pd.notna(out["rps20_prev"])]
        return out

    @staticmethod
    def _format_result(df: pd.DataFrame, strategy_name: str) -> pd.DataFrame:
        """统一输出列与排序。"""
        if df is None or df.empty:
            return pd.DataFrame()
        out = df.copy()
        out["strategy"] = strategy_name
        out["score"] = ((out["rps5"] + out["rps20"]) / 2.0).round(2)
        out["trade_date"] = pd.to_datetime(out["trade_date"], errors="coerce").dt.date
        out = out[
            [
                "strategy",
                "trade_date",
                "stock_code",
                "stock_name",
                "rps5_prev",
                "rps5",
                "rps20_prev",
                "rps20",
                "score",
            ]
        ].copy()
        out = out.sort_values(["score", "rps5"], ascending=False).reset_index(drop=True)
        return out

    def 选股_双突破_5上穿90且20上穿80(self) -> pd.DataFrame:
        """
        你的主策略：
        - 昨日 rps5 < 90，今日 rps5 >= 90
        - 昨日 rps20 < 80，今日 rps20 >= 80

        含义：
        - 短周期强势确认（5日突破90）
        - 中短趋势同步转强（20日突破80）
        """
        work = self._load_data()
        if work.empty:
            return pd.DataFrame()
        lp = self._latest_prev(work)
        if lp.empty:
            return pd.DataFrame()

        cond = (
            (lp["rps5_prev"] < 90)
            & (lp["rps5"] >= 90)
            & (lp["rps20_prev"] < 80)
            & (lp["rps20"] >= 80)
        )
        picked = lp[cond].copy()
        return self._format_result(picked, "双突破_5上穿90且20上穿80")

    def 选股_5日突破90_20日已强势(self) -> pd.DataFrame:
        """
        变体 1（更宽）：
        - 昨日 rps5 < 90，今日 rps5 >= 90
        - 今日 rps20 >= 80（不强制 20 日同日上穿）
        """
        work = self._load_data()
        if work.empty:
            return pd.DataFrame()
        lp = self._latest_prev(work)
        cond = (lp["rps5_prev"] < 90) & (lp["rps5"] >= 90) & (lp["rps20"] >= 80)
        picked = lp[cond].copy()
        return self._format_result(picked, "5日突破90_20日已强势")

    def 选股_20日突破80_5日高位共振(self) -> pd.DataFrame:
        """
        变体 2（趋势优先）：
        - 昨日 rps20 < 80，今日 rps20 >= 80
        - 今日 rps5 >= 90
        """
        work = self._load_data()
        if work.empty:
            return pd.DataFrame()
        lp = self._latest_prev(work)
        cond = (lp["rps20_prev"] < 80) & (lp["rps20"] >= 80) & (lp["rps5"] >= 90)
        picked = lp[cond].copy()
        return self._format_result(picked, "20日突破80_5日高位共振")


def main() -> None:
    parser = argparse.ArgumentParser(description="个股 RPS 策略执行器")
    parser.add_argument("--source", choices=["auto", "sql", "extdata"], default="sql", help="数据源")
    parser.add_argument(
        "--method",
        choices=["main", "m1", "m2"],
        default="main",
        help="策略方法：main=双突破, m1=5日突破90_20已强势, m2=20日突破80_5高位",
    )
    parser.add_argument("--out", type=str, default="reports/stock_rps_strategy.csv", help="输出 CSV 文件")
    args = parser.parse_args()

    runner = 个股Rps策略(source=args.source)
    method_map: dict[str, Callable[[], pd.DataFrame]] = {
        "main": runner.选股_双突破_5上穿90且20上穿80,
        "m1": runner.选股_5日突破90_20日已强势,
        "m2": runner.选股_20日突破80_5日高位共振,
    }
    t0 = datetime.now()
    df = method_map[args.method]()
    if df.empty:
        print("未筛出符合条件的股票。")
        return

    out_path = args.out
    out_dir = out_path.rsplit("\\", 1)[0] if "\\" in out_path else out_path.rsplit("/", 1)[0]
    if out_dir:
        import os

        os.makedirs(out_dir, exist_ok=True)
    df.to_csv(out_path, index=False, encoding="utf-8-sig")

    print(f"筛选完成，共 {len(df)} 只股票。")
    print(df.head(30).to_string(index=False))
    print(f"CSV 已输出: {out_path}")
    print(f"耗时: {(datetime.now() - t0).total_seconds():.2f}s")


if __name__ == "__main__":
    main()

