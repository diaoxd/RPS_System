import os

import akshare as ak
import pandas as pd

try:
    from config import (
        START_DATE,
        END_DATE,
        STOCK_LIST,
        SHANGHAI_DIR,
        SHENZHEN_DIR,
        BEIJING_DIR,
        USE_AKSHARE_FALLBACK,
    )
except ImportError:
    from 回测.config import (
        START_DATE,
        END_DATE,
        STOCK_LIST,
        SHANGHAI_DIR,
        SHENZHEN_DIR,
        BEIJING_DIR,
        USE_AKSHARE_FALLBACK,
    )


def _six_digit_to_file_stem(symbol: str) -> str:
    """
    将 config 中的 6 位代码转为通达信 CSV 文件名（不含 .csv）：
    沪市 sh6xx / sh688xx / sh900xxx（B 股），深市 sz0xx / sz3xx，
    北交所 bj43/83/87…、bj920xxx 等。若已是 sh/sz/bj 前缀则原样返回（小写）。
    """
    s = str(symbol).strip().lower()
    if s.startswith(('sh', 'sz', 'bj')) and len(s) >= 8:
        return s
    if not s.isdigit() or len(s) != 6:
        return s
    if s.startswith('6'):
        return 'sh' + s
    if s.startswith(('0', '3')):
        return 'sz' + s
    if s.startswith('900'):
        return 'sh' + s
    if s.startswith('920'):
        return 'bj' + s
    if s.startswith(('4', '8')):
        return 'bj' + s
    if s.startswith('9'):
        return 'bj' + s
    return 'sz' + s


def _csv_path_for_stem(stem: str) -> str | None:
    if stem.startswith('sh'):
        root = SHANGHAI_DIR
    elif stem.startswith('sz'):
        root = SHENZHEN_DIR
    elif stem.startswith('bj'):
        root = BEIJING_DIR
    else:
        return None
    fp = os.path.join(root, f'{stem}.csv')
    return fp if os.path.isfile(fp) else None


def _find_local_csv(symbol: str) -> str | None:
    stem = _six_digit_to_file_stem(symbol)
    fp = _csv_path_for_stem(stem)
    if fp:
        return fp
    for d in (SHANGHAI_DIR, SHENZHEN_DIR, BEIJING_DIR):
        alt = os.path.join(d, f'{stem}.csv')
        if os.path.isfile(alt):
            return alt
    return None


def _read_tdx_daily_csv(fp: str, symbol: str) -> pd.DataFrame:
    """通达信转换脚本列：date,open,high,low,close,amount,vol,reservation,pct_chg"""
    df = pd.read_csv(fp, parse_dates=['date'])
    df['symbol'] = symbol
    if 'vol' in df.columns and 'volume' not in df.columns:
        df['volume'] = df['vol']
    if 'pct_chg' in df.columns:
        # 与 clean_data 中 0.105（涨跌停约 10% 的分数形式）对齐：百分比 → 小数
        df['pct_change'] = pd.to_numeric(df['pct_chg'], errors='coerce') / 100.0
    start = pd.to_datetime(START_DATE, format='%Y%m%d')
    end = pd.to_datetime(END_DATE, format='%Y%m%d')
    df = df[(df['date'] >= start) & (df['date'] <= end)]
    return df


class DataLoader:

    def __init__(self, data_dir='data/'):

        self.data_dir = data_dir

        os.makedirs(data_dir, exist_ok=True)

    def download_data(self, symbol):

        try:

            df = ak.stock_zh_a_hist(

                symbol=symbol,

                period='daily',

                start_date=START_DATE,

                end_date=END_DATE,

                adjust='qfq'

            )

            df.columns = ['date', 'open', 'close', 'high', 'low', 'volume',

                          'amount', 'amplitude', 'pct_change', 'change', 'turnover']

            df['date'] = pd.to_datetime(df['date'])

            df['symbol'] = symbol

            return df

        except Exception as e:

            print(f"下载 {symbol} 失败: {e}")

        return None

    def load_all_data(self):

        all_data = {}

        for symbol in STOCK_LIST:

            local_fp = _find_local_csv(symbol)

            if local_fp:

                print(f"加载本地 CSV: {symbol} <- {local_fp}")

                df = _read_tdx_daily_csv(local_fp, symbol)

                all_data[symbol] = df

                continue

            print(f"未找到本地 CSV（已查 sh/sz/bj 与文件名 { _six_digit_to_file_stem(symbol) }.csv）: {symbol}")

            if not USE_AKSHARE_FALLBACK:

                continue

            fp = f"{self.data_dir}/{symbol}.csv"

            if os.path.exists(fp):

                df = pd.read_csv(fp, parse_dates=['date'])

            else:

                df = self.download_data(symbol)

                if df is not None:

                    df.to_csv(fp, index=False)

            if df is not None:

                all_data[symbol] = df

        return all_data

    def clean_data(self, df):

        df = df[(df['close'] > 0) & (df['volume'] > 0)]

        df = df[df['pct_change'].abs() <= 0.105]

        return df
