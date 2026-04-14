# -*- coding: utf-8 -*-
import os
from datetime import date, datetime

import pandas as pd

from rps import constants as C
from rps.board_rps_sql import 板块Rps数据库写入
from rps.report_settings import 多周期报告配置


def _stock_insert_batch_size() -> int:
    raw = os.environ.get(C.ENV_RPS_STOCK_INSERT_BATCH_SIZE, "").strip()
    if raw.isdigit():
        return max(1, int(raw))
    return C.DEFAULT_STOCK_RPS_INSERT_BATCH_SIZE


def _stock_rps_full_refresh() -> bool:
    """全量覆盖 df 内日期区间（旧行为）；默认 False = 智能增量（补洞 + 刷新最新日）。"""
    raw = os.environ.get(C.ENV_RPS_STOCK_RPS_FULL_REFRESH, "").strip().lower()
    if raw in ("1", "true", "yes", "on"):
        return True
    if raw in ("0", "false", "no", "off"):
        return False
    return False


def _norm_sql_date(x) -> date:
    """pyodbc 可能返回 date 或 datetime，统一为 date。"""
    if isinstance(x, datetime):
        return x.date()
    return x


def _fetch_existing_trade_dates(pyodbc_cursor, table_name: str, d_min: date, d_max: date) -> set[date]:
    sql = f"""
SELECT DISTINCT trade_date FROM dbo.{table_name}
WHERE trade_date >= ? AND trade_date <= ?
"""
    pyodbc_cursor.execute(sql, d_min, d_max)
    return {_norm_sql_date(r[0]) for r in pyodbc_cursor.fetchall() if r[0] is not None}


class 个股Rps数据库写入:
    """个股日频 RPS 写入 SQL Server（extdata_5~8、10，含 rps10）。

    默认 **智能增量**（非 ``RPS_STOCK_RPS_FULL_REFRESH`` 时）：

    - 在 **df 所含日期范围** 内查询库中已有 ``trade_date``；
    - **库中完全不存在** 的交易日 → 补录（中间漏跑、出错未入库）；
    - **extdata 中的最新交易日** → 每次运行都删除后重插（当日可重复跑、修正）；
    - 已有完整日期的历史行不重写。

    全量重导：环境变量 ``RPS_STOCK_RPS_FULL_REFRESH=1``（按 df 的 min~max 区间整段删除再插入）。
    """

    def __init__(self, cfg: 多周期报告配置):
        self.cfg = cfg
        self.driver = 板块Rps数据库写入._detect_odbc_driver()
        self.table_name = cfg.stock_rps_daily_table
        self.conn_str = (
            f"DRIVER={{{self.driver}}};"
            f"SERVER={cfg.sqlserver_host};"
            f"DATABASE={cfg.sqlserver_db};"
            f"UID={cfg.sqlserver_user};"
            f"PWD={cfg.sqlserver_password};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )

    def write_stock_daily_rps(self, df: pd.DataFrame) -> int:
        import math
        import pyodbc

        tn = self.table_name
        create_sql = f"""
IF OBJECT_ID(N'dbo.{tn}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{tn} (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        stock_code NVARCHAR(16) NOT NULL,
        stock_name NVARCHAR(64) NULL,
        rps5 FLOAT NULL,
        rps10 FLOAT NULL,
        rps20 FLOAT NULL,
        rps60 FLOAT NULL,
        rps120 FLOAT NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE())
    );
    CREATE INDEX IX_{tn}_date_code ON dbo.{tn}(trade_date, stock_code);
END
"""

        migrate_rps10_sql = f"""
IF OBJECT_ID(N'dbo.{tn}', N'U') IS NOT NULL
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM sys.columns c
        INNER JOIN sys.tables t ON c.object_id = t.object_id
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        WHERE s.name = N'dbo' AND t.name = N'{tn}' AND c.name = N'rps10'
    )
        ALTER TABLE dbo.{tn} ADD rps10 FLOAT NULL;
END
"""

        delete_range_sql = f"DELETE FROM dbo.{tn} WHERE trade_date >= ? AND trade_date <= ?"
        delete_one_sql = f"DELETE FROM dbo.{tn} WHERE trade_date = ?"
        insert_sql = f"""
INSERT INTO dbo.{tn}
(trade_date, stock_code, stock_name, rps5, rps10, rps20, rps60, rps120, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

        # 先建表（IF NOT EXISTS），避免 extdata 无数据时从未执行 CREATE，库里看不到 stock_rps_daily
        if df is None or df.empty:
            with pyodbc.connect(self.conn_str) as conn:
                cur = conn.cursor()
                cur.execute(create_sql)
                cur.execute(migrate_rps10_sql)
                conn.commit()
            return 0

        work = df.copy()
        work["trade_date"] = pd.to_datetime(work["trade_date"]).dt.date
        full_refresh = _stock_rps_full_refresh()
        if not full_refresh:
            df_dates = set(work["trade_date"].unique())
            latest_d = max(df_dates)
            if not df_dates:
                return 0
        else:
            print(
                f"[DB] 个股 RPS 全量入库：trade_date 区间 {work['trade_date'].min()} ~ "
                f"{work['trade_date'].max()}，共 {len(work)} 条"
            )

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

        now_ts = datetime.now()
        batch_size = _stock_insert_batch_size()
        col_order = ["trade_date", "stock_code", "stock_name", "rps5", "rps10", "rps20", "rps60", "rps120"]
        for c in col_order:
            if c not in work.columns:
                work[c] = pd.NA
        work = work[col_order]

        def _row_from_tuple(tup):
            # itertuples(name=None)：按 col_order 顺序，避免列名被改写后无法属性访问
            return (
                tup[0],
                tup[1],
                None if pd.isna(tup[2]) else tup[2],
                _safe_num(tup[3]),
                _safe_num(tup[4]),
                _safe_num(tup[5]),
                _safe_num(tup[6]),
                _safe_num(tup[7]),
                now_ts,
            )

        def _insert_days(cursor, day_list: list[date]) -> int:
            total = 0
            cursor.fast_executemany = True
            for d in day_list:
                part = work.loc[work["trade_date"] == d]
                if part.empty:
                    continue
                cursor.execute(delete_one_sql, d)
                n_part = len(part)
                for start in range(0, n_part, batch_size):
                    sub = part.iloc[start : start + batch_size]
                    rows = [_row_from_tuple(t) for t in sub.itertuples(index=False, name=None)]
                    cursor.executemany(insert_sql, rows)
                total += n_part
            return total

        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute(create_sql)
            cursor.execute(migrate_rps10_sql)
            if full_refresh:
                cursor.execute(
                    delete_range_sql, work["trade_date"].min(), work["trade_date"].max()
                )
                n_out = _insert_days(cursor, sorted(work["trade_date"].unique()))
            else:
                d_min = min(df_dates)
                d_max = max(df_dates)
                existing = _fetch_existing_trade_dates(cursor, tn, d_min, d_max)
                missing = df_dates - existing
                to_write = sorted(missing | {latest_d})
                gap_only = sorted(missing - {latest_d})
                print(
                    f"[DB] 个股 RPS 增量：待写入 {len(to_write)} 个交易日（extdata 范围内）"
                    f"，其中补洞 {len(gap_only)} 天、含最新日 {latest_d}；"
                    f"全区间重导请设 {C.ENV_RPS_STOCK_RPS_FULL_REFRESH}=1"
                )
                n_out = _insert_days(cursor, to_write)
            conn.commit()
        return n_out
