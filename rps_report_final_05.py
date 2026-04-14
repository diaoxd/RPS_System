#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
RPS 多周期分析报告（05）

在 04 版本基础上新增：
1) 将每日板块 RPS 明细写入 SQL Server。
2) 按“行业板块/概念板块”区分入库。
3) 输出报告文件切换为 05。
"""

import os
import time
from datetime import datetime

import pandas as pd

from project_config import get_cfg
from rps_report_final_04 import (
    AppConfig as BaseAppConfig,
    RpsBusinessService as BaseRpsBusinessService,
    ChartRenderer,
    HtmlViewBuilder,
)


OUTPUT_FILENAME = "RPS_多周期分析报告_05.html"
RPS_TABLE_NAME = "board_rps_daily"


class AppConfig(BaseAppConfig):
    def __init__(self):
        super().__init__()
        self.output_filename = OUTPUT_FILENAME

        # SQL Server 配置，优先级：环境变量 > project_config.json
        self.sqlserver_host = os.environ.get(
            "RPS_SQLSERVER_HOST", get_cfg(self._cfg, "sqlserver", "host", default="")
        ).strip()
        self.sqlserver_db = os.environ.get(
            "RPS_SQLSERVER_DB", get_cfg(self._cfg, "sqlserver", "database", default="")
        ).strip()
        self.sqlserver_user = os.environ.get(
            "RPS_SQLSERVER_USER", get_cfg(self._cfg, "sqlserver", "user", default="")
        ).strip()
        self.sqlserver_password = os.environ.get(
            "RPS_SQLSERVER_PASSWORD", get_cfg(self._cfg, "sqlserver", "password", default="")
        ).strip()
        self.sqlserver_table = os.environ.get(
            "RPS_SQLSERVER_TABLE", get_cfg(self._cfg, "sqlserver", "table", default=RPS_TABLE_NAME)
        ).strip() or RPS_TABLE_NAME

    def sqlserver_enabled(self) -> bool:
        return bool(self.sqlserver_host and self.sqlserver_db and self.sqlserver_user and self.sqlserver_password)


class SqlServerRpsWriter:
    """
    SQL Server 写入器（参考 SqlServerUtil.py 的 ODBC 驱动探测 + pyodbc 连接方式）
    """

    def __init__(self, cfg: AppConfig):
        self.cfg = cfg
        self.driver = self._detect_odbc_driver()
        self.table_name = cfg.sqlserver_table
        self.conn_str = (
            f"DRIVER={{{self.driver}}};"
            f"SERVER={cfg.sqlserver_host};"
            f"DATABASE={cfg.sqlserver_db};"
            f"UID={cfg.sqlserver_user};"
            f"PWD={cfg.sqlserver_password};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )

    @staticmethod
    def _detect_odbc_driver() -> str:
        preferred = [
            "ODBC Driver 17 for SQL Server",
            "ODBC Driver 18 for SQL Server",
            "ODBC Driver 13 for SQL Server",
            "SQL Server Native Client 11.0",
            "SQL Server Native Client 10.0",
            "SQL Server",
        ]
        try:
            import pyodbc

            available = [x for x in pyodbc.drivers()]
            for drv in preferred:
                if drv in available:
                    print(f"[DB] 使用 ODBC 驱动: {drv}")
                    return drv
            for drv in available:
                if "SQL Server" in drv:
                    print(f"[DB] 使用 ODBC 驱动: {drv}")
                    return drv
        except Exception as e:
            print(f"[DB] 探测 ODBC 驱动失败: {e}")
        return "ODBC Driver 17 for SQL Server"

    def write_daily_rps(self, df: pd.DataFrame) -> int:
        if df is None or df.empty:
            return 0

        import pyodbc
        import math

        create_sql = f"""
IF OBJECT_ID(N'dbo.{self.table_name}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{self.table_name} (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        board_code NVARCHAR(16) NOT NULL,
        board_name NVARCHAR(128) NOT NULL,
        board_group NVARCHAR(16) NOT NULL,   -- 行业板块/概念板块
        board_type NVARCHAR(32) NULL,        -- 行业/概念/一级行业
        rps5 FLOAT NULL,
        rps10 FLOAT NULL,
        rps20 FLOAT NULL,
        rps60 FLOAT NULL,
        rps120 FLOAT NULL,
        rps250 FLOAT NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE())
    );
    CREATE INDEX IX_{self.table_name}_date_code ON dbo.{self.table_name}(trade_date, board_code);
END
"""

        delete_sql = f"DELETE FROM dbo.{self.table_name} WHERE trade_date >= ? AND trade_date <= ?"
        insert_sql = f"""
INSERT INTO dbo.{self.table_name}
(trade_date, board_code, board_name, board_group, board_type, rps5, rps10, rps20, rps60, rps120, rps250, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

        min_d = df["trade_date"].min()
        max_d = df["trade_date"].max()

        def _safe_num(v):
            if v is None:
                return None
            if pd.isna(v):
                return None
            try:
                fv = float(v)
            except Exception:
                return None
            if math.isnan(fv) or math.isinf(fv):
                return None
            return fv

        rows = []
        now_ts = datetime.now()
        for _, r in df.iterrows():
            rows.append(
                (
                    r["trade_date"],
                    r["board_code"],
                    r["board_name"],
                    r["board_group"],
                    r["board_type"],
                    _safe_num(r["rps5"]),
                    _safe_num(r["rps10"]),
                    _safe_num(r["rps20"]),
                    _safe_num(r["rps60"]),
                    _safe_num(r["rps120"]),
                    _safe_num(r["rps250"]),
                    now_ts,
                )
            )

        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute(create_sql)
            cursor.execute(delete_sql, min_d, max_d)
            cursor.fast_executemany = True
            cursor.executemany(insert_sql, rows)
            conn.commit()
        return len(rows)


class RpsBusinessService(BaseRpsBusinessService):
    def build_daily_db_frame(self, context: dict) -> pd.DataFrame:
        """
        将 analysis_df 规范为入库表结构。
        字段覆盖：rps5 / rps10 / rps20 / rps60 / rps120 / rps250
        """
        df = context.get("analysis_df")
        if df is None or df.empty:
            return pd.DataFrame()

        work = df.copy()
        if "板块大类" not in work.columns:
            work["板块大类"] = work.apply(
                lambda r: self.classify_board_group(r.get("代码", ""), r.get("类型", "")),
                axis=1,
            )
        work = work[work["板块大类"].isin(["行业板块", "概念板块"])].copy()
        if work.empty:
            return pd.DataFrame()

        def _pick_col(name: str):
            return work[name] if name in work.columns else None

        out = pd.DataFrame(
            {
                "trade_date": pd.to_datetime(work["日期"]).dt.date,
                "board_code": work["代码"].astype(str),
                "board_name": work["名称"].astype(str),
                "board_group": work["板块大类"].astype(str),
                "board_type": work["类型"].astype(str),
                "rps5": _pick_col("RPS5"),
                "rps10": _pick_col("RPS10"),
                "rps20": _pick_col("RPS20"),
                "rps60": _pick_col("RPS60"),
                "rps120": _pick_col("RPS120"),
                "rps250": _pick_col("RPS250"),
            }
        )

        for c in ("rps5", "rps10", "rps20", "rps60", "rps120", "rps250"):
            if c in out.columns:
                out[c] = pd.to_numeric(out[c], errors="coerce")

        out = out.drop_duplicates(subset=["trade_date", "board_code"], keep="last")
        return out


class ReportApplication:
    def __init__(self):
        self.config = AppConfig()
        self.biz = RpsBusinessService(self.config)
        self.chart = ChartRenderer(self.config)
        self.view = HtmlViewBuilder()

    def run(self):
        t0 = time.perf_counter()
        t_prev = t0

        def _mark(stage: str):
            nonlocal t_prev
            now = time.perf_counter()
            print(f"[TIMER][run05] {stage}: +{now - t_prev:.3f}s (total {now - t0:.3f}s)")
            t_prev = now

        print("=" * 60)
        print("RPS多周期分析报告（05：含板块RPS入库）")
        print("=" * 60)
        print(f"配置-板块读取时间: {self.config.read_tdx_blocks_time}")
        print(f"配置-RPS读取时间: {', '.join(self.config.read_tdx_rps_times)}")

        context = self.biz.build_report_context()
        _mark("build_report_context")
        print(f"block 映射命中: {context['n_hit_db']}")

        db_df = self.biz.build_daily_db_frame(context)
        _mark("build_daily_db_frame")
        if self.config.sqlserver_enabled():
            try:
                writer = SqlServerRpsWriter(self.config)
                n = writer.write_daily_rps(db_df)
                print(f"[DB] 入库成功，写入 {n} 条到 {self.config.sqlserver_db}.dbo.{self.config.sqlserver_table}")
            except Exception as e:
                print(f"[DB] 入库失败: {e}")
        else:
            print("[DB] 未配置 SQL Server（RPS_SQLSERVER_* 或 project_config.sqlserver），跳过入库。")
        _mark("write_daily_rps")

        self.chart.render_all_visible_block_charts(context["analysis_df"])
        _mark("render_all_visible_block_charts")

        html = self.view.build_report_html(context, self.config.default_days)
        _mark("build_report_html")
        out_path = os.path.join(self.config.reports_folder, self.config.output_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        _mark("write_report_file")

        print(f"主报告已生成: {out_path}")
        print(f"图表目录: {self.config.charts_folder}")
        print(f"[TIMER][run05] total_elapsed: {time.perf_counter() - t0:.3f}s")


def main():
    app = ReportApplication()
    app.run()


if __name__ == "__main__":
    main()

