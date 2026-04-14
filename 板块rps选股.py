# -*- coding: utf-8 -*-
"""
板块 RPS 选股策略（类化版本）。

说明：
- 提供 SQL / extdata 双数据源；
- 不同方法代表不同选股思路；
- 默认策略为：RPS10 昨日<50 今日>=50，且今日 RPS20>80、RPS60>80。
"""

from __future__ import annotations

import argparse
import os
from datetime import datetime

import pandas as pd

from project_config import get_cfg, load_project_config
from read_tdx_blocks import TdxBlockDb
from rps.board_analysis import 板块Rps分析服务
from rps.report_settings import 多周期报告配置


class 板块Rps选股策略:
    """板块 RPS 策略集合。"""

    def __init__(self, source: str = "auto"):
        self.source = (source or "auto").strip().lower()
        if self.source not in {"auto", "sql", "extdata"}:
            raise ValueError("source 必须是 auto/sql/extdata")

    @staticmethod
    def _normalize_code(code) -> str:
        if pd.isna(code):
            return ""
        s = str(code).strip()
        if not s:
            return ""
        if len(s) > 6:
            s = s[:6]
        return s.zfill(6)

    @staticmethod
    def _board_group_by_prefix(code: str) -> str:
        if code.startswith("880"):
            return "行业板块"
        if code.startswith("881"):
            return "概念板块"
        return "其他板块"

    def _load_block_meta(self) -> dict:
        cfg = load_project_config()
        db_path = get_cfg(cfg, "paths", "tdx_blocks_db", default="c:/tool/RPS市场分析系统/tdx_blocks.db")
        if not os.path.isfile(db_path):
            return {}
        db = TdxBlockDb(db_path)
        try:
            df = db.get_blocks(block_type=None, as_dataframe=True)
        finally:
            db.close()
        if df is None or df.empty:
            return {}
        work = df.copy()
        work["_c"] = work["code"].apply(self._normalize_code)
        work = work[work["_c"] != ""]
        if "date" in work.columns:
            work = work.sort_values("date", ascending=False)
        work = work.drop_duplicates(subset=["_c"], keep="first")
        out = {}
        for _, row in work.iterrows():
            c = row["_c"]
            out[c] = {
                "name": str(row.get("name", "")).strip() or c,
                "type": str(row.get("type", "")).strip(),
            }
        return out

    @staticmethod
    def _load_board_rps_from_sql() -> pd.DataFrame:
        cfg = load_project_config()
        host = str(get_cfg(cfg, "sqlserver", "host", default="")).strip()
        db = str(get_cfg(cfg, "sqlserver", "database", default="")).strip()
        user = str(get_cfg(cfg, "sqlserver", "user", default="")).strip()
        password = str(get_cfg(cfg, "sqlserver", "password", default="")).strip()
        table = str(get_cfg(cfg, "sqlserver", "table", default="board_rps_daily")).strip() or "board_rps_daily"
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
SELECT trade_date, board_code, board_name, board_group, board_type, rps10, rps20, rps60
FROM dbo.{table}
WHERE rps10 IS NOT NULL AND rps20 IS NOT NULL AND rps60 IS NOT NULL
"""
        with pyodbc.connect(conn_str) as conn:
            return pd.read_sql(sql, conn)

    def _load_board_rps_from_extdata(self) -> pd.DataFrame:
        cfg = 多周期报告配置()
        svc = 板块Rps分析服务(cfg)
        merged = svc.load_merged_rps()
        if merged is None or merged.empty:
            return pd.DataFrame()
        need = {"code", "date", "RPS10", "RPS20", "RPS60"}
        missing = need - set(merged.columns)
        if missing:
            raise RuntimeError(f"extdata 缺少必要列: {sorted(missing)}")
        out = merged.copy()
        out["board_code"] = out["code"].apply(self._normalize_code)
        out = out[out["board_code"] != ""]
        out["trade_date"] = pd.to_datetime(out["date"].astype(str), format="%Y%m%d", errors="coerce")
        out = out[pd.notna(out["trade_date"])]
        out = out.rename(columns={"RPS10": "rps10", "RPS20": "rps20", "RPS60": "rps60"})
        return out[["trade_date", "board_code", "rps10", "rps20", "rps60"]]

    def _load_data(self) -> pd.DataFrame:
        if self.source == "sql":
            work = self._load_board_rps_from_sql()
        elif self.source == "extdata":
            work = self._load_board_rps_from_extdata()
        else:
            try:
                work = self._load_board_rps_from_sql()
                if work is None or work.empty:
                    print("[策略] SQL 数据为空，回退 extdata")
                    work = self._load_board_rps_from_extdata()
                else:
                    print("[策略] 使用 SQL 数据源")
            except Exception as e:
                print(f"[策略] SQL 不可用（{e}），回退 extdata")
                work = self._load_board_rps_from_extdata()

        if work is None or work.empty:
            return pd.DataFrame()
        work = work.copy()
        work["board_code"] = work["board_code"].apply(self._normalize_code)
        work = work[work["board_code"] != ""]
        work["trade_date"] = pd.to_datetime(work["trade_date"], errors="coerce")
        work = work[pd.notna(work["trade_date"])]
        for c in ("rps10", "rps20", "rps60"):
            work[c] = pd.to_numeric(work[c], errors="coerce")
        return work.sort_values(["board_code", "trade_date"], kind="mergesort")

    def _latest_prev(self, work: pd.DataFrame) -> pd.DataFrame:
        latest = work.groupby("board_code", as_index=False).tail(1).copy()
        prev = work.groupby("board_code", as_index=False).nth(-2).reset_index().rename(
            columns={"rps10": "rps10_prev", "trade_date": "date_prev"}
        )
        prev = prev[["board_code", "date_prev", "rps10_prev"]]
        merged = latest.merge(prev, on="board_code", how="left")
        return merged[pd.notna(merged["rps10_prev"])]

    def _enrich_meta(self, df: pd.DataFrame) -> pd.DataFrame:
        if df is None or df.empty:
            return pd.DataFrame()
        out = df.copy()
        if "board_name" not in out.columns:
            out["board_name"] = ""
        if "board_type" not in out.columns:
            out["board_type"] = ""
        if "board_group" not in out.columns:
            out["board_group"] = ""
        if (out["board_name"].fillna("").astype(str).str.strip() == "").any():
            meta = self._load_block_meta()
            out["board_name"] = out["board_name"].fillna("").astype(str)
            out["board_name"] = out.apply(
                lambda r: r["board_name"] if r["board_name"].strip() else meta.get(r["board_code"], {}).get("name", r["board_code"]),
                axis=1,
            )
            out["board_type"] = out["board_type"].fillna("").astype(str)
            out["board_type"] = out.apply(
                lambda r: r["board_type"] if r["board_type"].strip() else meta.get(r["board_code"], {}).get("type", ""),
                axis=1,
            )
        out["board_group"] = out["board_group"].fillna("").astype(str)
        out["board_group"] = out.apply(
            lambda r: r["board_group"] if r["board_group"].strip() else self._board_group_by_prefix(r["board_code"]),
            axis=1,
        )
        return out

    @staticmethod
    def _format_result(df: pd.DataFrame, strategy_name: str) -> pd.DataFrame:
        out = df.copy()
        out["trade_date"] = pd.to_datetime(out["trade_date"], errors="coerce").dt.date
        out["score"] = ((out["rps10"] + out["rps20"] + out["rps60"]) / 3.0).round(2)
        out["strategy"] = strategy_name
        out = out[
            [
                "strategy",
                "trade_date",
                "board_code",
                "board_name",
                "board_group",
                "board_type",
                "rps10_prev",
                "rps10",
                "rps20",
                "rps60",
                "score",
            ]
        ]
        return out.sort_values(["score", "rps10"], ascending=False).reset_index(drop=True)

    # 策略说明：
    # rps10 从下向上突破 50（昨日<50, 今日>=50），同时今日 rps20、rps60 都高于强势阈值。
    # 目标是捕捉“中周期已强 + 短周期刚启动”的板块。
    def pick_cross_10_50_with_20_60_strength(
        self, rps20_threshold: float = 80, rps60_threshold: float = 80, cross_level: float = 50
    ) -> pd.DataFrame:
        work = self._load_data()
        if work.empty:
            return pd.DataFrame()
        lp = self._latest_prev(work)
        cond = (
            (lp["rps20"] > rps20_threshold)
            & (lp["rps60"] > rps60_threshold)
            & (lp["rps10_prev"] < cross_level)
            & (lp["rps10"] >= cross_level)
        )
        picked = self._enrich_meta(lp[cond].copy())
        if picked.empty:
            return pd.DataFrame()
        return self._format_result(picked, "cross_10_50_with_20_60_strength")

    # 策略说明：
    # 今日 rps20、rps60 持续强势，且 rps10 比昨日抬升（不要求跨阈值）。
    # 目标是抓“趋势延续中的短线抬升”。
    def pick_trend_20_60_with_10_rising(
        self, rps20_threshold: float = 80, rps60_threshold: float = 80
    ) -> pd.DataFrame:
        work = self._load_data()
        if work.empty:
            return pd.DataFrame()
        lp = self._latest_prev(work)
        cond = (lp["rps20"] > rps20_threshold) & (lp["rps60"] > rps60_threshold) & (lp["rps10"] > lp["rps10_prev"])
        picked = self._enrich_meta(lp[cond].copy())
        if picked.empty:
            return pd.DataFrame()
        return self._format_result(picked, "trend_20_60_with_10_rising")

    # 策略说明：
    # rps10 从阈值下方刚突破到阈值上方（默认 70）。
    # 相比 50 阈值更激进，偏向短线加速启动。
    def pick_breakout_10_70(self, breakout: float = 70) -> pd.DataFrame:
        work = self._load_data()
        if work.empty:
            return pd.DataFrame()
        lp = self._latest_prev(work)
        cond = (lp["rps10_prev"] < breakout) & (lp["rps10"] >= breakout)
        picked = self._enrich_meta(lp[cond].copy())
        if picked.empty:
            return pd.DataFrame()
        return self._format_result(picked, "breakout_10_70")



'''
    现在默认运行的是这个策略：

    pick_cross_10_50_with_20_60_strength
    对应条件是：

    昨日
    rps10 < 50，今日
    rps10 >= 50
    今日
    rps20 > 80
    今日
    rps60 > 80
'''
def main() -> None:
    parser = argparse.ArgumentParser(description="板块 RPS 选股策略")
    parser.add_argument("--source", choices=["auto", "sql", "extdata"], default="auto", help="数据源")
    parser.add_argument(
        "--method",
        choices=[
            "cross_10_50_with_20_60_strength",
            "trend_20_60_with_10_rising",
            "breakout_10_70",
            "m0",
            "m1",
            "m2",
        ],

        default="cross_10_50_with_20_60_strength",
        help="策略方法（支持英文名；m0/m1/m2 为兼容别名）",
    )
    parser.add_argument("--rps20", type=float, default=80.0, help="20 日阈值（m0/m1）")
    parser.add_argument("--rps60", type=float, default=80.0, help="60 日阈值（m0/m1）")
    parser.add_argument("--cross", type=float, default=50.0, help="10 日上穿阈值（m0）")
    parser.add_argument("--out", type=str, default="reports/board_rps_strategy.csv", help="输出 CSV")
    args = parser.parse_args()

    runner = 板块Rps选股策略(source=args.source)
    t0 = datetime.now()
    if args.method in {"cross_10_50_with_20_60_strength", "m0"}:
        df = runner.pick_cross_10_50_with_20_60_strength(args.rps20, args.rps60, args.cross)
    elif args.method in {"trend_20_60_with_10_rising", "m1"}:
        df = runner.pick_trend_20_60_with_10_rising(args.rps20, args.rps60)
    else:
        df = runner.pick_breakout_10_70()

    if df.empty:
        print("未筛出符合条件的板块。")
        return

    out_path = args.out
    out_dir = os.path.dirname(out_path)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    df.to_csv(out_path, index=False, encoding="utf-8-sig")
    print(f"筛选完成，共 {len(df)} 个候选。")
    print(df.head(30).to_string(index=False))
    print(f"CSV 已输出: {out_path}")
    print(f"耗时: {(datetime.now() - t0).total_seconds():.2f}s")


if __name__ == "__main__":


    main()

