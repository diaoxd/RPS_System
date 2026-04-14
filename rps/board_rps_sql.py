# -*- coding: utf-8 -*-
from datetime import datetime

import pandas as pd

from rps import constants as C
from rps.report_settings import 多周期报告配置


class 板块Rps数据库写入:
    """板块日频 RPS 写入 SQL Server。"""

    def __init__(self, cfg: 多周期报告配置):
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
        try:
            import pyodbc

            available = [x for x in pyodbc.drivers()]
            for drv in C.ODBC_DRIVER_PREFERENCE:
                if drv in available:
                    print(f"[DB] 使用 ODBC 驱动: {drv}")
                    return drv
            for drv in available:
                if "SQL Server" in drv:
                    print(f"[DB] 使用 ODBC 驱动: {drv}")
                    return drv
        except Exception as e:
            print(f"[DB] 探测 ODBC 驱动失败: {e}")
        return C.ODBC_DRIVER_FALLBACK

    def write_daily_rps(self, df: pd.DataFrame) -> int:
        if df is None or df.empty:
            return 0

        import math
        import pyodbc

        tn = self.table_name
        create_sql = f"""
IF OBJECT_ID(N'dbo.{tn}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{tn} (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        board_code NVARCHAR(16) NOT NULL,
        board_name NVARCHAR(128) NOT NULL,
        board_group NVARCHAR(16) NOT NULL,
        board_type NVARCHAR(32) NULL,
        rps5 FLOAT NULL,
        rps10 FLOAT NULL,
        rps20 FLOAT NULL,
        rps60 FLOAT NULL,
        rps120 FLOAT NULL,
        rps250 FLOAT NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE())
    );
    CREATE INDEX IX_{tn}_date_code ON dbo.{tn}(trade_date, board_code);
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

        delete_sql = f"DELETE FROM dbo.{tn} WHERE trade_date >= ? AND trade_date <= ?"
        insert_sql = f"""
INSERT INTO dbo.{tn}
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
            cursor.execute(migrate_rps10_sql)
            cursor.execute(delete_sql, min_d, max_d)
            cursor.fast_executemany = True
            cursor.executemany(insert_sql, rows)
            conn.commit()
        return len(rows)
