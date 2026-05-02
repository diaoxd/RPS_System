# 股票配置
# 使用本地通达信导出的 CSV 时，写 6 位数字代码即可（与 sh600519.csv / sz000001.csv 等自动匹配）
STOCK_LIST = ['000001', '000002', '600036', '600519', '000858']

START_DATE = '20230101'

END_DATE = '20241231'

# 回测配置
INITIAL_CASH = 100000.0

COMMISSION = 0.0003  # 万三

# 大模型
LLM_API_KEY = 'your-api-key'

LLM_MODEL = 'gpt-4'

LLM_BASE_URL = 'https://api.openai.com/v1'

# ---------- 本地日线 CSV（shanghai_data / shenzhen_data / beijing_data）----------
# 默认：本文件所在目录的上一级目录（与「N字形模式检测系统」同级），即已加工好的三目录所在根路径。
# 也可通过环境变量 BACKTEST_DATA_ROOT 指定（仍在其下找 shanghai_data、shenzhen_data、beijing_data）。
import os

_CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
_REPO_ROOT = os.path.abspath(os.path.join(_CONFIG_DIR, '..'))
DATA_ROOT = os.environ.get('BACKTEST_DATA_ROOT', '').strip() or _REPO_ROOT

SHANGHAI_DIR = os.path.join(DATA_ROOT, 'shanghai_data')
SHENZHEN_DIR = os.path.join(DATA_ROOT, 'shenzhen_data')
BEIJING_DIR = os.path.join(DATA_ROOT, 'beijing_data')

# 若某只股票在本地找不到 CSV，是否回退 akshare 下载（默认 False，仅用本地加工数据）
USE_AKSHARE_FALLBACK = os.environ.get('BACKTEST_AKSHARE_FALLBACK', '').strip() in ('1', 'true', 'True', 'yes')

# ---------- 通达信前复权 ASCII 导出（T0002\\export，空格分隔 sh/sz/bj 前缀 .txt）----------
# 做「板块 RPS → 个股 RPS」时：板块指数 K 线与个股 K 线请分两个子目录导出（避免混在一个目录里一起算 RPS）
TDX_EXPORT_ROOT = os.environ.get('TDX_EXPORT_ROOT', '').strip() or r'C:\stock\tdx_zyyj\T0002\export'
TDX_EXPORT_BLOCK_DIR = os.environ.get('TDX_EXPORT_BLOCK_DIR', '').strip() or os.path.join(TDX_EXPORT_ROOT, 'blocks')
TDX_EXPORT_STOCK_DIR = os.environ.get('TDX_EXPORT_STOCK_DIR', '').strip() or os.path.join(TDX_EXPORT_ROOT, 'stocks')
