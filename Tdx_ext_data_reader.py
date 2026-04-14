# -*- coding: utf-8 -*-
"""
核心思路：
1、读取通达信固定位置的统计数据；该统计数据已经通过刷界面程序更新；
2、数据对应关系如下

   板块 RPS（与板块扩展数据序号一致）：
        读取 extdata_1~4、9.dat 获取 RPS120、RPS60、RPS20、RPS5、RPS10。
        - RPS120: extdata_1.dat
        - RPS60:  extdata_2.dat
        - RPS20:  extdata_3.dat
        - RPS5:   extdata_4.dat
        - RPS10:  extdata_9.dat

   个股 RPS（解析逻辑与板块相同，仅文件序号不同）：
        读取 extdata_5~8、10.dat 获取个股 RPS120、RPS60、RPS20、RPS5、RPS10。
        - RPS120: extdata_5.dat
        - RPS60:  extdata_6.dat
        - RPS20:  extdata_7.dat
        - RPS5:   extdata_8.dat
        - RPS10:  extdata_10.dat
"""

import os
import struct
from concurrent.futures import ThreadPoolExecutor, as_completed

import pandas as pd
from project_config import load_project_config, get_cfg

# 默认扩展数据目录
_CFG = load_project_config()
DEFAULT_EXTDATA_DIR = get_cfg(
    _CFG, 'paths', 'tdx_extdata_dir',
    default=r'C:/tool/Tdx MPV V1.24++/T0002/extdata'
)

RPS_FILE_MAP = {
    'RPS120': ('extdata_1.dat', 'extdata_1.idx'),
    'RPS60':  ('extdata_2.dat', 'extdata_2.idx'),
    'RPS20':  ('extdata_3.dat', 'extdata_3.idx'),
    'RPS10':  ('extdata_9.dat', 'extdata_9.idx'),
    'RPS5':   ('extdata_4.dat', 'extdata_4.idx'),
}

# 个股 RPS：文件 5~8、10 对应 120/60/20/5/10（与板块相同的二进制格式）
STOCK_RPS_FILE_MAP = {
    'RPS120': ('extdata_5.dat', 'extdata_5.idx'),
    'RPS60':  ('extdata_6.dat', 'extdata_6.idx'),
    'RPS20':  ('extdata_7.dat', 'extdata_7.idx'),
    'RPS10':  ('extdata_10.dat', 'extdata_10.idx'),
    'RPS5':   ('extdata_8.dat', 'extdata_8.idx'),
}


def read_extdata_dat(dat_path, idx_path=None):
    """
    读取单个通达信扩展数据 .dat 文件

    Args:
        dat_path: .dat 文件路径
        idx_path: .idx 索引文件路径，默认根据 dat_path 自动推断

    Returns:
        DataFrame: 列 code, date, value
        - code: 股票代码（6位）
        - date: 日期整数 YYYYMMDD
        - value: 原始值（通达信 0-1000 归一化）
    """
    if idx_path is None:
        idx_path = dat_path.replace('.dat', '.idx')
    if not os.path.exists(idx_path):
        idx_path = dat_path.replace('.dat', '.IDX')
    if not os.path.exists(idx_path):
        raise FileNotFoundError(f"索引文件不存在: {idx_path}")
    if not os.path.exists(dat_path):
        raise FileNotFoundError(f"数据文件不存在: {dat_path}")

    idx_list = []
    with open(idx_path, 'rb') as f:
        while True:
            buf = f.read(29)
            if not buf:
                break
            market, code, _, count = struct.unpack('<H7s16sI', buf)
            code = code.decode('gbk').strip('\x00')
            idx_list.append((code.strip(), count))

    data = []
    with open(dat_path, 'rb') as f:
        for code, count in idx_list:
            for _ in range(count):
                buf = f.read(12)
                if not buf:
                    break
                date_int, time_int, val = struct.unpack('<II f', buf)
                data.append({
                    'code': code,
                    'date': date_int,
                    'value': val
                })

    return pd.DataFrame(data)


def load_all_rps(base_dir=None, scale_0_100=True):
    """
    加载 RPS120、RPS60、RPS20、RPS10（可选）、RPS5 全部数据

    Args:
        base_dir: 扩展数据目录，默认 DEFAULT_EXTDATA_DIR
        scale_0_100: 是否将 value 转为 0-100（通达信存 0-1000，除以10）

    Returns:
        dict: {
            'RPS120': DataFrame(code, date, value),
            'RPS60':  DataFrame(code, date, value),
            'RPS20':  DataFrame(code, date, value),
            'RPS5':   DataFrame(code, date, value),
            （若配置了 extdata_9）'RPS10': ...
        }
        若某文件不存在则跳过，不包含在返回的 dict 中。
    """
    base_dir = base_dir or DEFAULT_EXTDATA_DIR
    result = {}

    for name, (dat_name, idx_name) in RPS_FILE_MAP.items():
        dat_path = os.path.join(base_dir, dat_name)
        idx_path = os.path.join(base_dir, idx_name)
        if not os.path.exists(dat_path):
            print(f"警告: 文件不存在 {dat_path}，跳过 {name}")
            continue
        try:
            df = read_extdata_dat(dat_path, idx_path)
            if scale_0_100:
                df['value'] = (df['value'] / 10).clip(0, 100)
            df = df.rename(columns={'value': name})
            result[name] = df
        except Exception as e:
            print(f"警告: 读取 {name} 失败: {e}")

    return result


def _read_one_stock_rps_file(args):
    """供多线程读取单个股 RPS 文件；返回 (name, DataFrame|None, err_msg|None)。"""
    name, dat_path, idx_path, scale_0_100 = args
    try:
        df = read_extdata_dat(dat_path, idx_path)
        if scale_0_100:
            df["value"] = (df["value"] / 10).clip(0, 100)
        df = df.rename(columns={"value": name})
        return name, df, None
    except Exception as e:
        return name, None, str(e)


def load_all_stock_rps(base_dir=None, scale_0_100=True):
    """
    加载个股 RPS120、RPS60、RPS20、RPS10（可选）、RPS5（extdata_5~8、10），逻辑同 load_all_rps。

    extdata 体量较大时，多文件 **并行读取**（线程，主要释放磁盘 I/O 等待），缩短总耗时。

    Returns:
        dict: {
            'RPS120': DataFrame(code, date, value),
            ...
        }
        若某文件不存在则跳过，不包含在返回的 dict 中。
    """
    base_dir = base_dir or DEFAULT_EXTDATA_DIR
    tasks = []
    for name, (dat_name, idx_name) in STOCK_RPS_FILE_MAP.items():
        dat_path = os.path.join(base_dir, dat_name)
        idx_path = os.path.join(base_dir, idx_name)
        if not os.path.exists(dat_path):
            print(f"警告: 文件不存在 {dat_path}，跳过个股 {name}")
            continue
        tasks.append((name, dat_path, idx_path, scale_0_100))

    result = {}
    if not tasks:
        return result

    max_workers = min(5, len(tasks))
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        futures = {ex.submit(_read_one_stock_rps_file, t): t[0] for t in tasks}
        for fut in as_completed(futures):
            name, df, err = fut.result()
            if err is not None:
                print(f"警告: 读取个股 {name} 失败: {err}")
            elif df is not None:
                result[name] = df

    return result


def load_all_rps_merged(base_dir=None, scale_0_100=True):
    """
    加载全部 RPS 数据并合并为宽表

    Returns:
        DataFrame: 列 code, date, RPS120, RPS60, RPS20, RPS10（若有）, RPS5
        按 code, date 合并，缺失值为 NaN
    """
    rps_dict = load_all_rps(base_dir, scale_0_100)
    if not rps_dict:
        return pd.DataFrame()

    merged = None
    for name, df in rps_dict.items():
        df = df[['code', 'date', name]].copy()
        if merged is None:
            merged = df
        else:
            merged = merged.merge(
                df, on=['code', 'date'], how='outer'
            )

    return merged.sort_values(['code', 'date']).reset_index(drop=True)


def load_all_stock_rps_merged(base_dir=None, scale_0_100=True):
    """
    加载全部个股 RPS 并合并为宽表。

    使用 (code,date) 多级索引 **outer join** 替代多次 ``merge``，减少中间大表与重复排序开销。

    Returns:
        DataFrame: 列 code, date, RPS120, RPS60, RPS20, RPS10（若有）, RPS5
        按 code, date 合并，缺失值为 NaN
    """
    rps_dict = load_all_stock_rps(base_dir, scale_0_100)
    if not rps_dict:
        return pd.DataFrame()

    order = ("RPS120", "RPS60", "RPS20", "RPS10", "RPS5")
    parts = []
    for key in order:
        if key not in rps_dict:
            continue
        parts.append(rps_dict[key][["code", "date", key]].copy())

    if not parts:
        return pd.DataFrame()

    merged = parts[0].set_index(["code", "date"])
    for df in parts[1:]:
        merged = merged.join(df.set_index(["code", "date"]), how="outer")
    merged = merged.reset_index().sort_values(["code", "date"], kind="mergesort").reset_index(drop=True)
    return merged


if __name__ == '__main__':
    base = DEFAULT_EXTDATA_DIR
    print(f"读取扩展数据目录: {base}")
    print("-" * 50)

    rps_dict = load_all_rps(base)
    for name, df in rps_dict.items():
        print(f"{name}: {len(df)} 条, 日期范围 {df['date'].min()} ~ {df['date'].max()}")

    print("-" * 50)
    merged = load_all_rps_merged(base)
    if not merged.empty:
        print(f"板块合并后: {len(merged)} 条")
        print(merged.tail(100))

    print("-" * 50)
    stock_dict = load_all_stock_rps(base)
    for name, df in stock_dict.items():
        print(f"个股 {name}: {len(df)} 条, 日期范围 {df['date'].min()} ~ {df['date'].max()}")
    stock_merged = load_all_stock_rps_merged(base)
    if not stock_merged.empty:
        print(f"个股合并后: {len(stock_merged)} 条")
        print(stock_merged.tail(20))