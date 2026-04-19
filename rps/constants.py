# -*- coding: utf-8 -*-
"""
RPS 报告：常量与默认值（集中配置）。

业务逻辑中的可调参数仍以 project_config.json / 环境变量为准；
此处为未覆盖时的默认值及固定文案、环境变量名、技术常量。
"""

# ----- 报告输出 -----
OUTPUT_HTML_FILENAME = "RPS_多周期分析报告_06.html"
HTML_DOCUMENT_TITLE = "RPS多周期分析报告（通达信数据）06"
REPORT_BANNER_LINE = "=" * 60
CONSOLE_RUN_TAG = "run06"

# ----- Web / 缓存 key（与 web_app、Flask 约定一致） -----
# 入口模块名：用于 generation_key 第三段，须与 web_app.REPORT_MODULE_NAME 一致
REPORT_ENTRY_MODULE_NAME = "rps_report_final_06"

# extdata 参与缓存的 .dat 序号（板块 1~4、9 + 个股 5~8、10 + 个股换手率 11）
EXTDATA_CACHE_DAT_INDICES = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)

# ----- 路径默认值（可被 project_config / 环境变量覆盖） -----
DEFAULT_TDX_ANALYSIS_DIR = (
    r"e:\个人\个人备份\Users\diaox\PycharmProjects\获取热点板块及股票\通达信板块分析"
)
DEFAULT_WORKSPACE_ROOT = r"c:\tool\RPS市场分析系统"

# ----- 报告数值默认值 -----
DEFAULT_MAX_DAYS = 500
DEFAULT_DEFAULT_DAYS = 30

# ----- 调度 -----
DEFAULT_READ_TDX_BLOCKS_TIME = "09:01"
DEFAULT_READ_TDX_RPS_TIMES = ["09:25", "10:25", "11:25", "13:30", "14:30", "15:30"]

# ----- SQL Server 默认表名（物理表名，见 SSMS 对象资源管理器） -----
DEFAULT_SQL_TABLE_BOARD = "board_rps_daily"
DEFAULT_STOCK_RPS_DAILY_TABLE = "stock_rps_daily"
DEFAULT_SQL_TABLE_SECTOR_STOCKS = "sector_stocks_daily"

# ----- 环境变量名（仅集中记录，便于检索） -----
ENV_TDX_ANALYSIS_DIR = "TDX_ANALYSIS_DIR"
ENV_RPS_PROJECT_ROOT = "RPS_PROJECT_ROOT"
ENV_RPS_SQLSERVER_HOST = "RPS_SQLSERVER_HOST"
ENV_RPS_SQLSERVER_DB = "RPS_SQLSERVER_DB"
ENV_RPS_SQLSERVER_USER = "RPS_SQLSERVER_USER"
ENV_RPS_SQLSERVER_PASSWORD = "RPS_SQLSERVER_PASSWORD"
ENV_RPS_SQLSERVER_TABLE = "RPS_SQLSERVER_TABLE"
ENV_RPS_SQLSERVER_STOCK_TABLE = "RPS_SQLSERVER_STOCK_TABLE"
# 个股 RPS 日表（推荐）；未设置时仍兼容 RPS_SQLSERVER_STOCK_TABLE
ENV_RPS_SQLSERVER_STOCK_RPS_DAILY_TABLE = "RPS_SQLSERVER_STOCK_RPS_DAILY_TABLE"
# project_config.json → sqlserver 下键名（表名默认 stock_rps_daily）
SQLSERVER_CONFIG_KEY_STOCK_RPS_DAILY_TABLE = "stock_rps_daily_table"
# 个股 RPS 入库：每批 executemany 行数（过大易触发驱动/服务器参数限制，过小往返多）
ENV_RPS_STOCK_INSERT_BATCH_SIZE = "RPS_STOCK_INSERT_BATCH_SIZE"
DEFAULT_STOCK_RPS_INSERT_BATCH_SIZE = 5000
# 个股 RPS：默认仅写入数据中「最新交易日」一行（增量）；设为 1/true 则按 df 内日期区间全量覆盖（旧行为）
ENV_RPS_STOCK_RPS_FULL_REFRESH = "RPS_STOCK_RPS_FULL_REFRESH"
ENV_RPS_SQLSERVER_SECTOR_STOCKS_TABLE = "RPS_SQLSERVER_SECTOR_STOCKS_TABLE"
ENV_RPS_ENABLE_SECTOR_STOCKS_IMPORT = "RPS_ENABLE_SECTOR_STOCKS_IMPORT"
# 成分股拉取：每板块调用 TQ 后的休眠秒数（浮点）。不设则用下方默认，避免数千板块时仅 sleep 即数百秒。
ENV_RPS_SECTOR_TQ_SLEEP_STOCKS = "RPS_SECTOR_TQ_SLEEP_STOCKS"
ENV_RPS_SECTOR_TQ_SLEEP_EMPTY = "RPS_SECTOR_TQ_SLEEP_EMPTY"
DEFAULT_SECTOR_TQ_SLEEP_AFTER_STOCKS = 0.05
DEFAULT_SECTOR_TQ_SLEEP_EMPTY_SECTOR = 0.02
ENV_TDX_BLOCKS_DB = "TDX_BLOCKS_DB"
ENV_RPS_TQ_INIT_SCRIPT = "RPS_TQ_INIT_SCRIPT"

# ----- ODBC 驱动探测顺序 -----
ODBC_DRIVER_PREFERENCE = [
    "ODBC Driver 17 for SQL Server",
    "ODBC Driver 18 for SQL Server",
    "ODBC Driver 13 for SQL Server",
    "SQL Server Native Client 11.0",
    "SQL Server Native Client 10.0",
    "SQL Server",
]
ODBC_DRIVER_FALLBACK = "ODBC Driver 17 for SQL Server"

# ----- Block 库类型映射 -----
BLOCK_DB_TYPE_LABEL = {"hy": "行业", "gn": "概念", "yjhy": "一级行业"}

# ----- 成分股入库（需 SQL 已配置且通达信已登录） -----
DEFAULT_SECTOR_STOCKS_IMPORT = True

# ----- 控制台文案 -----
MSG_REPORT_TITLE = "RPS多周期分析报告（06：自包含，含板块+个股入库）"
