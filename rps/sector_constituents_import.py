# -*- coding: utf-8 -*-
import os
import time
from datetime import date

from rps import constants as C
from rps.board_rps_sql import 板块Rps数据库写入
from rps.report_settings import 多周期报告配置
from trading_calendar_service import resolve_sector_constituents_trade_date

from RPS_FINAL_06.block_rps_analysis_service import normalize_board_code_for_db


def _sleep_after_sector_fetch(has_stocks: bool) -> None:
    """TQ 节流：每板块拉取后休眠，避免压垮客户端。可通过环境变量覆盖（见 rps.constants）。"""
    if has_stocks:
        raw = os.environ.get(C.ENV_RPS_SECTOR_TQ_SLEEP_STOCKS, "").strip()
        default = C.DEFAULT_SECTOR_TQ_SLEEP_AFTER_STOCKS
    else:
        raw = os.environ.get(C.ENV_RPS_SECTOR_TQ_SLEEP_EMPTY, "").strip()
        default = C.DEFAULT_SECTOR_TQ_SLEEP_EMPTY_SECTOR
    try:
        sec = float(raw) if raw else default
    except ValueError:
        sec = default
    if sec > 0:
        time.sleep(sec)


def _tq_init_script_path(cfg: 多周期报告配置) -> str:
    """供 tq.initialize 使用的脚本路径（优先项目根目录入口模块）。"""
    env = os.environ.get(C.ENV_RPS_TQ_INIT_SCRIPT, "").strip()
    if env and os.path.isfile(env):
        return env
    candidate = os.path.join(cfg.workspace_root, "rps_report_final_06.py")
    if os.path.isfile(candidate):
        return candidate
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "rps_report_final_06.py"))


class 板块成分股每日入库服务:
    """
    板块成分股每日入库（逻辑同 PYPlugins「板块成分股每日入库.py」）。

    从通达信 tqcenter 拉取各板块成分股，写入 SQL Server（表名可配置）。
    依赖：客户端已启动并登录；pyodbc + 多周期报告配置中的 SQL 账号。
    """

    def __init__(self, cfg: 多周期报告配置):
        self.cfg = cfg
        self.driver = 板块Rps数据库写入._detect_odbc_driver()
        self.table_name = cfg.sector_stocks_table
        self.conn_str = (
            f"DRIVER={{{self.driver}}};"
            f"SERVER={cfg.sqlserver_host};"
            f"DATABASE={cfg.sqlserver_db};"
            f"UID={cfg.sqlserver_user};"
            f"PWD={cfg.sqlserver_password};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )

    def run(self) -> tuple[bool, int]:
        import pyodbc

        trade_date, td_note = resolve_sector_constituents_trade_date(None)
        print(f"[成分股] sector_stocks_daily.trade_date={trade_date.isoformat()} ({td_note})")
        try:
            from tqcenter import tq as tq_mod
        except ImportError as e:
            print(f"[成分股] 无法导入 tqcenter: {e}，跳过板块成分股入库。")
            return False, 0

        tq = tq_mod
        try:
            tq.initialize(_tq_init_script_path(self.cfg))
        except Exception as e:
            print(f"[成分股] 通达信 tq.initialize 失败: {e}（请确认客户端已登录），跳过。")
            try:
                tq.close()
            except Exception:
                pass
            return False, 0

        # tqcenter 往往在内部流程中调用 initialize/close（包括异常分支触发 close/_auto_close）。
        # 外层已建立连接：在拉取板块列表与遍历成分股期间屏蔽内部 init/close/auto_close，
        # 全部取完后再真正 close 一次，避免日志里反复“初始化成功/连接已关闭”。
        _orig_init = tq.initialize
        _orig_close = tq.close
        _orig_auto_close = getattr(tq, "_auto_close", None)
        _noop = lambda *a, **k: None

        rows: list = []
        tn = self.table_name

        try:
            tq.initialize = _noop
            tq.close = _noop
            if _orig_auto_close is not None:
                tq._auto_close = _noop
            try:
                try:
                    # 不再按代码逐个反查名称（该过程会触发更多内部调用，且新版 tqcenter 容易带来反复 close/init）。
                    sectors = tq.get_sector_list_with_names(fetch_name_by_code=False)
                except TypeError:
                    sectors = tq.get_sector_list_with_names()
                if not sectors:
                    try:
                        codes = tq.get_sector_list()
                    except Exception:
                        codes = []
                    sectors = [{"code": c, "name": c} for c in (codes or [])]

                total_sectors = len(sectors)
                for i, sector in enumerate(sectors, 1):
                    sector_code = sector.get("code") if isinstance(sector, dict) else None
                    if sector_code is None and isinstance(sector, dict):
                        sector_code = sector.get("block")
                    if not sector_code:
                        continue
                    sector_name = (sector.get("name") if isinstance(sector, dict) else None) or sector_code
                    try:
                        stocks = tq.get_stock_list_in_sector(sector_code, block_type=0)
                    except Exception as e:
                        print(f"[成分股] [{i}/{total_sectors}] {sector_code} 成分股失败: {e}")
                        stocks = []
                    if not stocks:
                        _sleep_after_sector_fetch(False)
                        continue
                    for stock_code in stocks:
                        sc_db = normalize_board_code_for_db(stock_code)
                        if sc_db:
                            rows.append((trade_date, str(sector_code).strip(), str(sector_name).strip(), sc_db))
                    _sleep_after_sector_fetch(True)
            finally:
                tq.initialize = _orig_init
                tq.close = _orig_close
                if _orig_auto_close is not None:
                    tq._auto_close = _orig_auto_close
                try:
                    _orig_close()
                except Exception:
                    pass

            if not rows:
                print("[成分股] 未收集到任何成分股记录。")
                return True, 0

            create_sql = f"""
IF OBJECT_ID(N'dbo.{tn}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{tn} (
        id INT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        sector_code NVARCHAR(50) NOT NULL,
        sector_name NVARCHAR(200) NULL,
        stock_code NVARCHAR(20) NOT NULL,
        stock_name NVARCHAR(100) NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT UQ_{tn}_sector_daily UNIQUE (trade_date, sector_code, stock_code)
    );
END
"""
            del_sql = f"DELETE FROM dbo.{tn} WHERE trade_date = ?"
            ins_sql = f"""
INSERT INTO dbo.{tn} (trade_date, sector_code, sector_name, stock_code)
VALUES (?, ?, ?, ?)
"""

            with pyodbc.connect(self.conn_str) as conn:
                cur = conn.cursor()
                cur.execute(create_sql)
                cur.execute(del_sql, trade_date)
                cur.fast_executemany = True
                cur.executemany(ins_sql, rows)
                conn.commit()

            print(f"[成分股] 入库 {len(rows)} 条 → {self.cfg.sqlserver_db}.dbo.{tn}")
            return True, len(rows)
        except Exception as e:
            print(f"[成分股] 入库失败: {e}")
            return False, 0
