# -*- coding: utf-8 -*-
import os
import sys

from project_config import get_cfg, load_project_config

from rps import constants as C


class 多周期报告配置:
    """
    多周期报告运行时配置（路径、报告参数、SQL Server 等）
    """

    def __init__(self):
        self._cfg = load_project_config()

        self.tdx_analysis_dir = os.environ.get(
            C.ENV_TDX_ANALYSIS_DIR,
            get_cfg(self._cfg, "paths", "tdx_analysis_dir", default=C.DEFAULT_TDX_ANALYSIS_DIR),
        )
        self.project_root = os.environ.get(
            C.ENV_RPS_PROJECT_ROOT,
            get_cfg(self._cfg, "paths", "rps_project_root", default=os.path.dirname(self.tdx_analysis_dir)),
        )
        self.workflow_dir = os.path.join(self.project_root, "workflow")
        self.workspace_root = get_cfg(
            self._cfg, "paths", "workspace_root", default=C.DEFAULT_WORKSPACE_ROOT
        )
        self.reports_folder = os.path.join(self.workspace_root, "reports")
        self.charts_folder = os.path.join(self.reports_folder, "charts")
        self.cache_dir = os.path.join(self.workspace_root, "cache")

        self.max_days = int(get_cfg(self._cfg, "report", "max_days", default=C.DEFAULT_MAX_DAYS))
        self.default_days = int(
            get_cfg(self._cfg, "report", "default_days", default=C.DEFAULT_DEFAULT_DAYS)
        )
        self.output_filename = C.OUTPUT_HTML_FILENAME

        self.read_tdx_blocks_time = str(
            get_cfg(self._cfg, "schedule", "read_tdx_blocks_time", default=C.DEFAULT_READ_TDX_BLOCKS_TIME)
        )
        self.read_tdx_rps_times = get_cfg(
            self._cfg,
            "schedule",
            "read_tdx_rps_times",
            default=list(C.DEFAULT_READ_TDX_RPS_TIMES),
        )

        # 工作区必须优先于「通达信板块分析」目录，否则会错误导入同名旧版 Tdx_ext_data_reader
        #（缺个股 load_all_stock_rps_merged 等 API）。
        _wr = os.path.abspath(self.workspace_root)
        if _wr in sys.path:
            sys.path.remove(_wr)
        sys.path.insert(0, _wr)

        if self.tdx_analysis_dir not in sys.path:
            sys.path.append(self.tdx_analysis_dir)
        if self.workflow_dir not in sys.path:
            sys.path.append(self.workflow_dir)

        os.makedirs(self.reports_folder, exist_ok=True)
        os.makedirs(self.charts_folder, exist_ok=True)
        os.makedirs(self.cache_dir, exist_ok=True)

        self.sqlserver_host = os.environ.get(
            C.ENV_RPS_SQLSERVER_HOST, get_cfg(self._cfg, "sqlserver", "host", default="")
        ).strip()
        self.sqlserver_db = os.environ.get(
            C.ENV_RPS_SQLSERVER_DB, get_cfg(self._cfg, "sqlserver", "database", default="")
        ).strip()
        self.sqlserver_user = os.environ.get(
            C.ENV_RPS_SQLSERVER_USER, get_cfg(self._cfg, "sqlserver", "user", default="")
        ).strip()
        self.sqlserver_password = os.environ.get(
            C.ENV_RPS_SQLSERVER_PASSWORD, get_cfg(self._cfg, "sqlserver", "password", default="")
        ).strip()
        self.sqlserver_table = os.environ.get(
            C.ENV_RPS_SQLSERVER_TABLE,
            get_cfg(self._cfg, "sqlserver", "table", default=C.DEFAULT_SQL_TABLE_BOARD),
        ).strip() or C.DEFAULT_SQL_TABLE_BOARD
        _stock_tbl = get_cfg(self._cfg, "sqlserver", C.SQLSERVER_CONFIG_KEY_STOCK_RPS_DAILY_TABLE, default=None)
        if _stock_tbl is None or str(_stock_tbl).strip() == "":
            _stock_tbl = get_cfg(self._cfg, "sqlserver", "stock_table", default=C.DEFAULT_STOCK_RPS_DAILY_TABLE)
        _stock_env = (
            os.environ.get(C.ENV_RPS_SQLSERVER_STOCK_RPS_DAILY_TABLE, "").strip()
            or os.environ.get(C.ENV_RPS_SQLSERVER_STOCK_TABLE, "").strip()
        )
        self.stock_rps_daily_table = _stock_env or str(_stock_tbl).strip() or C.DEFAULT_STOCK_RPS_DAILY_TABLE
        self.sector_stocks_table = os.environ.get(
            C.ENV_RPS_SQLSERVER_SECTOR_STOCKS_TABLE,
            get_cfg(self._cfg, "sqlserver", "sector_stocks_table", default=C.DEFAULT_SQL_TABLE_SECTOR_STOCKS),
        ).strip() or C.DEFAULT_SQL_TABLE_SECTOR_STOCKS

    @property
    def sqlserver_stock_table(self) -> str:
        """兼容旧代码：与 ``stock_rps_daily_table`` 相同（物理表名，默认 stock_rps_daily）。"""
        return self.stock_rps_daily_table

    def sqlserver_enabled(self) -> bool:
        return bool(self.sqlserver_host and self.sqlserver_db and self.sqlserver_user and self.sqlserver_password)

    def sector_constituents_import_enabled(self) -> bool:
        env = os.environ.get(C.ENV_RPS_ENABLE_SECTOR_STOCKS_IMPORT, "").strip().lower()
        if env in ("1", "true", "yes", "on"):
            return True
        if env in ("0", "false", "no", "off"):
            return False
        return bool(
            get_cfg(
                self._cfg,
                "sqlserver",
                "sector_stocks_import",
                default=C.DEFAULT_SECTOR_STOCKS_IMPORT,
            )
        )
