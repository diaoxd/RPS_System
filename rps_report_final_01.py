#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
RPS多周期分析报告生成脚本（通达信扩展数据版）

数据来源：
- 板块代码与 RPS120/RPS60/RPS20/RPS5：Tdx_ext_data_reader.py（通达信 extdata）
- 板块名称与类别：以 extdata 中出现的 code 为键，从 read_tdx_blocks 维护的 SQLite block 表查询

功能：与 rps_report_final 相同（核心/趋势/新生池、选项卡、走势图等）
输出：RPS_多周期分析报告_01.html（保存在 reports 目录）
"""

import os
import sys
import pandas as pd
from datetime import datetime
import plotly.graph_objects as go
from plotly.offline import plot
import re
import json
from collections import defaultdict
from project_config import load_project_config, get_cfg

# ================== 路径配置 ==================
_CFG = load_project_config()
# 通达信板块分析目录（包含 Tdx_ext_data_reader.py）
TDX_ANALYSIS_DIR = os.environ.get(
    'TDX_ANALYSIS_DIR',
    get_cfg(
        _CFG, 'paths', 'tdx_analysis_dir',
        default=r'e:\个人\个人备份\Users\diaox\PycharmProjects\获取热点板块及股票\通达信板块分析'
    )
)
# 项目根目录（包含 workflow 文件夹）
PROJECT_ROOT = os.environ.get(
    'RPS_PROJECT_ROOT',
    get_cfg(_CFG, 'paths', 'rps_project_root', default=os.path.dirname(TDX_ANALYSIS_DIR))
)

# 添加路径以便导入
if TDX_ANALYSIS_DIR not in sys.path:
    sys.path.insert(0, TDX_ANALYSIS_DIR)
WORKFLOW_DIR = os.path.join(PROJECT_ROOT, 'workflow')
if WORKFLOW_DIR not in sys.path:
    sys.path.insert(0, WORKFLOW_DIR)

# ================== 配置参数（与 rps_report_final 一致） ==================
WORKSPACE_ROOT = get_cfg(_CFG, 'paths', 'workspace_root', default='c:\\tool\\RPS市场分析系统')
REPORTS_FOLDER = os.path.join(WORKSPACE_ROOT, 'reports')
CHARTS_FOLDER = os.path.join(REPORTS_FOLDER, 'charts')
MAX_DAYS = int(get_cfg(_CFG, 'report', 'max_days', default=250))
DEFAULT_DAYS = int(get_cfg(_CFG, 'report', 'default_days', default=30))
OUTPUT_FILENAME = str(get_cfg(_CFG, 'report', 'output_filename', default='RPS_多周期分析报告_01.html'))

READ_TDX_BLOCKS_TIME = str(get_cfg(_CFG, 'schedule', 'read_tdx_blocks_time', default='09:00'))
READ_TDX_RPS_TIMES = get_cfg(
    _CFG, 'schedule', 'read_tdx_rps_times',
    default=['09:25', '10:25', '11:25', '13:30', '14:30', '15:30']
)

os.makedirs(CHARTS_FOLDER, exist_ok=True)

# block 表的 code->name/type 缓存（避免每次生成 report 都全表查询）
CACHE_DIR = os.path.join(WORKSPACE_ROOT, "cache")
os.makedirs(CACHE_DIR, exist_ok=True)


# ================== 从 Tdx_ext_data_reader 加载板块 RPS（宽表） ==================

def load_merged_rps_from_tdx(base_dir=None):
    """
    调用 Tdx_ext_data_reader.load_all_rps_merged，得到 code, date, RPS120, RPS60, RPS20, RPS5。
    extdata 中 code 需与 read_tdx_blocks 中板块 code 一致（通常为指数/板块代码）。
    """
    try:
        from Tdx_ext_data_reader import load_all_rps_merged, DEFAULT_EXTDATA_DIR
    except ImportError:
        raise ImportError(
            f"无法导入 Tdx_ext_data_reader，请确认路径正确: {TDX_ANALYSIS_DIR}\n"
            f"可设置环境变量 TDX_ANALYSIS_DIR 指定通达信板块分析目录"
        )
    extdata_dir = base_dir or DEFAULT_EXTDATA_DIR
    return load_all_rps_merged(base_dir=extdata_dir, scale_0_100=True)


def _normalize_code(c):
    if pd.isna(c):
        return ''
    s = str(c).strip()
    if len(s) > 6:
        s = s[:6]
    return s.zfill(6)


# ================== 板块 code -> 名称（SQLite block 表，按 ext 中出现的 code 查） ==================

# block 表 type 字段（hy/gn/yjhy）-> 报告里「类型」列展示用
_BLOCK_DB_TYPE_LABEL = {
    'hy': '行业',
    'gn': '概念',
    'yjhy': '一级行业',
}


def _tdx_blocks_db_path():
    env = os.environ.get('TDX_BLOCKS_DB')
    cfg_db = get_cfg(_CFG, 'paths', 'tdx_blocks_db', default='')
    for p in (env, cfg_db):
        if p and os.path.isfile(p):
            return p
    for p in (
        os.path.join(WORKFLOW_DIR, 'tdx_blocks.db'),
        os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tdx_blocks.db'),
    ):
        if os.path.isfile(p):
            return p
    return os.path.join(WORKFLOW_DIR, 'tdx_blocks.db')


def _block_meta_cache_path(db_path: str) -> str:
    """
    为指定 block 库生成缓存文件路径。
    缓存会随 db 文件 mtime 变化而失效重建。
    """
    try:
        mt_ms = int(os.path.getmtime(db_path) * 1000)
    except OSError:
        mt_ms = 0
    safe_mt = str(mt_ms)
    return os.path.join(CACHE_DIR, f"block_meta_cache_{safe_mt}.json")


def _load_all_block_meta_from_db(db_path: str) -> dict:
    """
    从 block 表读取全量，生成 norm_code -> {'name', 'type'} 映射。
    """
    from read_tdx_blocks import TdxBlockDb

    db = TdxBlockDb(db_path)
    try:
        df = db.get_blocks(block_type=None, as_dataframe=True)
    finally:
        db.close()

    if df is None or df.empty:
        return {}

    df = df.copy()
    df['_c'] = df['code'].apply(_normalize_code)
    df = df.sort_values('date', ascending=False).drop_duplicates(subset=['_c'], keep='first')

    meta = {}
    for _, row in df.iterrows():
        c = row['_c']
        if not c:
            continue
        name = str(row['name']).strip() if pd.notna(row.get('name')) else ''
        raw_t = str(row['type']).strip() if pd.notna(row.get('type')) else ''
        meta[c] = {
            'name': name or c,
            'type': _BLOCK_DB_TYPE_LABEL.get(raw_t, raw_t or ''),
        }
    return meta


def preload_block_meta_cache():
    """
    预热/生成 block 表的 code->name/type 缓存文件。
    用于 web 端在 09:01（或配置时间）提前加载。
    """
    db_path = _tdx_blocks_db_path()
    if not os.path.isfile(db_path):
        raise FileNotFoundError(f"block 库不存在: {db_path}")

    cache_path = _block_meta_cache_path(db_path)
    if os.path.isfile(cache_path):
        return {"cache_path": cache_path, "cached": True}

    meta = _load_all_block_meta_from_db(db_path)
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False)
    return {"cache_path": cache_path, "cached": True, "count": len(meta)}


def load_block_meta_from_db_for_codes(codes):
    """
    根据 extdata 中出现的板块 code（已归一化或原始均可），从 tdx_blocks.db 的 block 表查 name、type。
    返回 (code_to_meta, n_hit_db):
      - code_to_meta: norm_code -> {'name', 'type'}；库中无记录时用 code 作名称、类型为空
      - n_hit_db: 在 block 表中找到对应 code 的条数（按归一化 code 去重后计）
    """
    norm_list = sorted({_normalize_code(c) for c in codes if _normalize_code(c)})
    if not norm_list:
        return {}, 0

    db_path = _tdx_blocks_db_path()
    if not os.path.isfile(db_path):
        print(f"警告: 未找到 block 库 {db_path}，板块名将用代码占位；可设置 TDX_BLOCKS_DB")
        return {c: {'name': c, 'type': ''} for c in norm_list}, 0

    cache_path = _block_meta_cache_path(db_path)
    if os.path.isfile(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                all_meta = json.load(f)
        except Exception:
            all_meta = _load_all_block_meta_from_db(db_path)
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(all_meta, f, ensure_ascii=False)
    else:
        all_meta = _load_all_block_meta_from_db(db_path)
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(all_meta, f, ensure_ascii=False)

    meta = {c: all_meta.get(c, {'name': c, 'type': ''}) for c in norm_list}
    n_hit_db = sum(1 for c in norm_list if c in all_meta and all_meta[c].get('name') and all_meta[c].get('name') != c)
    return meta, n_hit_db


# ================== 板块 RPS（ext 宽表 + 库表名称） ==================

def build_block_rps_from_merged_extdata(merged_df, code_to_meta, max_days=MAX_DAYS):
    """
    将 Tdx_ext_data_reader 合并后的板块 RPS 宽表与 block 库解析出的 code->名称/类型 对齐。
    code_to_meta 由 load_block_meta_from_db_for_codes 根据 ext 中出现的 code 生成。
    返回 DataFrame: 代码, 名称, RPS120, RPS60, RPS20, RPS5, 类型, 日期
    """
    if merged_df is None or merged_df.empty or not code_to_meta:
        return pd.DataFrame()

    rps_cols = [c for c in ('RPS120', 'RPS60', 'RPS20', 'RPS5') if c in merged_df.columns]
    if not rps_cols:
        return pd.DataFrame()

    work = merged_df.copy()
    work['_c'] = work['code'].apply(_normalize_code)
    work = work[work['_c'].isin(code_to_meta)]
    if work.empty:
        return pd.DataFrame()

    all_dates = sorted(work['date'].unique())[-max_days:]
    work = work[work['date'].isin(all_dates)]

    rows = []
    for _, row in work.iterrows():
        c = row['_c']
        meta = code_to_meta.get(c, {'name': c, 'type': ''})
        d = int(row['date']) if pd.notna(row['date']) else None
        if d is None:
            continue
        def _cell(col):
            if col not in row.index:
                return None
            v = row[col]
            if pd.isna(v):
                return None
            return round(float(v), 1)

        row_dict = {
            '代码': c,
            '名称': meta['name'],
            '类型': meta['type'],
            '日期': datetime.strptime(str(d), '%Y%m%d').date(),
        }
        for col in rps_cols:
            row_dict[col] = _cell(col)
        if not any(row_dict.get(col) is not None for col in rps_cols):
            continue
        rows.append(row_dict)

    return pd.DataFrame(rows)


# ================== 板块大类（行业/概念）分类 ==================

def classify_board_group(code, typ=''):
    """
    根据板块代码前缀分类：
    - 880xxx -> 行业板块
    - 881xxx -> 概念板块
    若代码不符合，再回退到类型字段判断。
    """
    c = _normalize_code(code)
    if c.startswith('880'):
        return '行业板块'
    if c.startswith('881'):
        return '概念板块'

    t = str(typ).strip()
    if t == '行业':
        return '行业板块'
    if t in ('概念', '一级行业'):
        return '概念板块'
    return '其他板块'


# ================== 以下与 rps_report_final 完全一致 ==================

def identify_pools(df):
    core_cond = (df['RPS120'] > 90) & (df['RPS60'] > 90) & \
                (df['RPS20'] > 85) & (df['RPS5'] > 85)
    core_blocks = set(df[core_cond]['名称'])

    new_cond = (df['RPS20'] > 90) & (df['RPS5'] > 95) & (df['RPS120'] < 80)
    new_blocks = set(df[new_cond & ~core_cond]['名称'])

    trend_cond = (df['RPS60'] > 90) & (df['RPS20'] > 85)
    trend_blocks = set(df[trend_cond & ~core_cond & ~new_cond]['名称'])

    pool_map = {}
    for name in core_blocks:
        pool_map[name] = '🔥核心'
    for name in trend_blocks:
        pool_map[name] = '📈趋势'
    for name in new_blocks:
        pool_map[name] = '🆕新生'
    return pool_map


def prepare_historical_data(multi_df):
    if multi_df is None or multi_df.empty:
        return {'🔥核心': [], '📈趋势': [], '🆕新生': []}, [], {}, {}

    all_dates = sorted(multi_df['日期'].unique())
    all_dates_str = [d.strftime('%Y-%m-%d') for d in all_dates]

    pool_members_by_date = {}
    for date in all_dates:
        df_day = multi_df[multi_df['日期'] == date]
        pool_map = identify_pools(df_day)
        by_tag = defaultdict(set)
        for name, tag in pool_map.items():
            by_tag[tag].add(name)
        pool_members_by_date[date] = by_tag

    pool_blocks = defaultdict(set)
    for by_tag in pool_members_by_date.values():
        for tag, names in by_tag.items():
            pool_blocks[tag].update(names)

    block_avg_raw = defaultdict(dict)
    block_type = {}
    for name in set().union(*pool_blocks.values()):
        sub = multi_df[multi_df['名称'] == name].set_index('日期')
        if not sub.empty:
            block_type[name] = sub['类型'].iloc[0]
        for date in all_dates:
            date_str = date.strftime('%Y-%m-%d')
            if date in sub.index:
                row = sub.loc[date]
                avg = (row['RPS5'] + row['RPS20'] + row['RPS60'] + row['RPS120']) / 4.0
                block_avg_raw[name][date_str] = round(avg, 1)
            else:
                block_avg_raw[name][date_str] = None

    blocks_by_tag = {}
    for tag, names in pool_blocks.items():
        blocks = []
        for name in names:
            avg_data = {}
            for date_obj in all_dates:
                date_str = date_obj.strftime('%Y-%m-%d')
                belongs = False
                if date_obj in pool_members_by_date:
                    if tag in pool_members_by_date[date_obj]:
                        if name in pool_members_by_date[date_obj][tag]:
                            belongs = True
                if belongs:
                    avg_data[date_str] = block_avg_raw[name][date_str]
                else:
                    avg_data[date_str] = None
            blocks.append({
                'name': name,
                'type': block_type.get(name, ''),
                'avgData': avg_data
            })
        blocks_by_tag[tag] = blocks

    latest_date = all_dates[-1]
    df_latest = multi_df[multi_df['日期'] == latest_date]
    latest_pool_map = identify_pools(df_latest)
    transitions = get_detailed_transitions(multi_df)

    return blocks_by_tag, all_dates_str, latest_pool_map, transitions


def get_detailed_transitions(multi_df):
    dates = sorted(multi_df['日期'].unique())
    if len(dates) < 2:
        return {}

    latest_date = dates[-1]
    prev_date = dates[-2]

    df_latest = multi_df[multi_df['日期'] == latest_date]
    df_prev = multi_df[multi_df['日期'] == prev_date]

    latest_pools = identify_pools(df_latest)
    prev_pools = identify_pools(df_prev)

    all_names = set(latest_pools.keys()) | set(prev_pools.keys())

    transitions = {}
    for name in all_names:
        curr_tag = latest_pools.get(name, None)
        prev_tag = prev_pools.get(name, None)
        transitions[name] = (prev_tag, curr_tag)

    result = {}
    for name, (prev, curr) in transitions.items():
        if curr is not None:
            if curr not in result:
                result[curr] = {'新增': [], '退出': []}
            if prev is None:
                result[curr]['新增'].append((name, '新晋'))
            elif prev != curr:
                result[curr]['新增'].append((name, f'来自{prev}'))

        if prev is not None:
            if prev not in result:
                result[prev] = {'新增': [], '退出': []}
            if curr is None:
                result[prev]['退出'].append((name, '退出池子'))
            elif curr != prev:
                result[prev]['退出'].append((name, f'去向{curr}'))

    return result


def generate_block_chart_file(block_name, block_type, history_df, output_folder):
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=history_df['日期'], y=history_df['RPS120'],
        mode='lines+markers', name='RPS120',
        line=dict(color='#1f77b4', width=2)
    ))
    fig.add_trace(go.Scatter(
        x=history_df['日期'], y=history_df['RPS60'],
        mode='lines+markers', name='RPS60',
        line=dict(color='#ff7f0e', width=2)
    ))
    fig.add_trace(go.Scatter(
        x=history_df['日期'], y=history_df['RPS20'],
        mode='lines+markers', name='RPS20',
        line=dict(color='#2ca02c', width=2)
    ))
    fig.add_trace(go.Scatter(
        x=history_df['日期'], y=history_df['RPS5'],
        mode='lines+markers', name='RPS5',
        line=dict(color='#d62728', width=2)
    ))

    fig.update_xaxes(
        rangeselector=dict(
            buttons=list([
                dict(count=1, label="1月", step="month", stepmode="backward"),
                dict(count=3, label="3月", step="month", stepmode="backward"),
                dict(count=6, label="6月", step="month", stepmode="backward"),
                dict(step="all", label="全部")
            ]),
            bgcolor='lightgrey',
            activecolor='#3498db'
        ),
        rangeslider=dict(visible=True),
        type="date"
    )

    fig.update_layout(
        title=f"{block_name} ({block_type}) RPS走势",
        xaxis_title="日期",
        yaxis_title="RPS值",
        height=450,
        hovermode='x unified',
        template='plotly_white',
        margin=dict(l=40, r=40, t=50, b=40)
    )

    safe_name = re.sub(r'[\\/*?:"<>|]', '_', block_name)
    filename = f"{safe_name}_{block_type}.html"
    filepath = os.path.join(output_folder, filename)

    html = plot(fig, output_type='div', include_plotlyjs='cdn', show_link=False)
    full_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>{block_name} RPS走势</title></head>
<body style="margin:0; padding:20px; font-family:Arial;">
{html}
</body>
</html>"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(full_html)
    return filename


def main():
    print("=" * 60)
    print("RPS多周期分析报告（通达信扩展数据版）")
    print("=" * 60)
    print(f"配置-板块数据读取时间: {READ_TDX_BLOCKS_TIME}")
    print(f"配置-RPS统计读取时间: {', '.join(READ_TDX_RPS_TIMES)}")

    print("\n1. 从 Tdx_ext_data_reader 加载板块 RPS（extdata 宽表）...")
    merged_rps = load_merged_rps_from_tdx()
    if merged_rps is None or merged_rps.empty:
        print("错误：未找到 RPS 扩展数据，请检查通达信 extdata 目录")
        return
    print(f"   合并表 {len(merged_rps)} 条，列: {list(merged_rps.columns)}")

    ext_codes = merged_rps['code'].unique()
    print(f"\n2. 按 extdata 中的 code 查 block 库名称…（原始 code 种类: {len(ext_codes)}）")
    code_to_meta, n_hit_db = load_block_meta_from_db_for_codes(ext_codes)
    print(f"   归一化后代码数: {len(code_to_meta)}，block 表命中: {n_hit_db}")

    print("\n3. 合并 ext RPS 与库表名称，生成报告用序列...")
    multi_df = build_block_rps_from_merged_extdata(merged_rps, code_to_meta, MAX_DAYS)
    if multi_df.empty:
        print("错误：未能生成板块 RPS 数据")
        return

    latest_date = multi_df['日期'].max()
    print(f"   数据日期范围：{multi_df['日期'].min()} 至 {latest_date}")
    print(f"   总数据量：{len(multi_df)} 条")

    # 按 880/881 前缀拆成行业与概念两套数据流（各自独立分池）
    multi_df['板块大类'] = multi_df.apply(
        lambda r: classify_board_group(r.get('代码', ''), r.get('类型', '')),
        axis=1
    )
    industry_df = multi_df[multi_df['板块大类'] == '行业板块'].copy()
    concept_df = multi_df[multi_df['板块大类'] == '概念板块'].copy()

    print("\n4. 准备报告数据（行业/概念分开）...")
    blocks_by_tag_ind, all_dates_ind, latest_pool_map_ind, transitions_ind = prepare_historical_data(industry_df)
    blocks_by_tag_con, all_dates_con, latest_pool_map_con, transitions_con = prepare_historical_data(concept_df)

    for tag in ['🔥核心', '📈趋势', '🆕新生']:
        print(f"   行业 {tag}: {len(blocks_by_tag_ind.get(tag, []))} 个")
        print(f"   概念 {tag}: {len(blocks_by_tag_con.get(tag, []))} 个")

    print("\n5. 生成独立走势图（行业/概念的最新池子成员）...")
    latest_names = set(latest_pool_map_ind.keys()) | set(latest_pool_map_con.keys())
    for name in latest_names:
        typ = multi_df[multi_df['名称'] == name]['类型'].iloc[0] if not multi_df[multi_df['名称'] == name].empty else ''
        hist = multi_df[multi_df['名称'] == name].sort_values('日期')
        if len(hist) >= 2:
            generate_block_chart_file(name, typ, hist, CHARTS_FOLDER)

    # 默认时间范围：优先行业日期，其次概念日期
    base_dates = all_dates_ind if all_dates_ind else all_dates_con
    if not base_dates:
        print("错误：行业和概念均无可用日期数据")
        return
    default_end = base_dates[-1]
    if len(base_dates) <= DEFAULT_DAYS:
        default_start = base_dates[0]
    else:
        default_start = base_dates[-DEFAULT_DAYS]

    # 构建 HTML 模板（与 rps_report_final 相同）
    html_template = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>RPS多周期分析报告（通达信数据）</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 30px; background: #f5f7fa; }}
        .container {{ max-width: 100%; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
        h1 {{ color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }}
        .controls {{ margin: 20px 0; padding: 15px; background: #ecf0f1; border-radius: 8px; }}
        .controls label {{ margin-right: 10px; }}
        .controls input {{ margin-right: 20px; padding: 5px; }}
        .note {{ background: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-size: 13px; }}

        .layout {{ display: flex; gap: 16px; }}
        .board-tabs {{
            width: 130px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }}
        .board-tab-button {{
            padding: 10px 8px;
            font-size: 14px;
            font-weight: bold;
            border: 1px solid #d0d7de;
            background: #f3f4f6;
            border-radius: 8px;
            cursor: pointer;
            text-align: center;
        }}
        .board-tab-button.active {{
            background: #2c3e50;
            color: #fff;
        }}
        .content-area {{ flex: 1; }}
        .tabs {{
            display: flex;
            gap: 5px;
            margin-bottom: 20px;
            border-bottom: 2px solid #d0d7de;
            padding-bottom: 10px;
        }}
        .tab-button {{
            padding: 8px 20px;
            font-size: 16px;
            font-weight: bold;
            border: none;
            background: #e9ecef;
            border-radius: 20px 20px 0 0;
            cursor: pointer;
            transition: 0.2s;
        }}
        .tab-button.active {{
            background: #2c3e50;
            color: white;
        }}
        .tab-pane {{ display: none; }}
        .tab-pane.active {{ display: block; }}

        .table-wrapper {{
            background: white;
            border-radius: 8px;
            padding: 15px;
            border: 1px solid #d0d7de;
            overflow-x: auto;
        }}
        table {{ border-collapse: collapse; font-size: 12px; min-width: 100%; }}
        th {{
            background: #2c3e50;
            color: white;
            padding: 6px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 10;
        }}
        td {{ padding: 4px 6px; border-bottom: 1px solid #e2e8f0; text-align: center; }}
        tr:hover {{ filter: brightness(95%); }}
        .name-cell {{ cursor: pointer; }}
        .highlight-cell {{ background-color: #ff6666 !important; }}
        .table-title {{ font-size: 18px; font-weight: bold; margin-bottom: 10px; text-align: center; }}
        .core-title {{ color: #c0392b; }}
        .trend-title {{ color: #e67e22; }}
        .new-title {{ color: #27ae60; }}
        .pool-info {{ margin-top: 15px; padding: 10px; background: #ecf0f1; border-radius: 5px; font-size: 12px; }}
        .pool-list {{ max-height: 80px; overflow-y: auto; margin-bottom: 5px; }}
        .change-info {{ font-size: 12px; margin-top: 5px; padding-top: 5px; border-top: 1px dashed #aaa; }}
        .added {{ color: #27ae60; font-weight: bold; }}
        .removed {{ color: #c0392b; font-weight: bold; }}
        .type-industry {{ color: #000000; }}
        .type-concept {{ color: #0066cc; }}
        .rank-col {{ background-color: #f0f0f0; font-weight: bold; }}
        .source-dest {{ font-weight: normal; color: #555; }}
    </style>
</head>
<body>
<div class="container">
    <h1>📊 RPS多周期分析报告（通达信数据）</h1>

    <div class="controls">
        <label>起始日期：</label>
        <input type="date" id="startDate" value="{default_start}">
        <label>结束日期：</label>
        <input type="date" id="endDate" value="{default_end}">
        <button onclick="updateTables()">应用</button>
        <span style="margin-left:20px;">默认显示最近{DEFAULT_DAYS}天，可自由调整范围。时间从左到右由新到旧。</span>
    </div>

    <div class="note">
        <strong>说明：</strong> RPS 来自通达信扩展数据；板块名称按扩展数据中的代码从 tdx_blocks 库 block 表匹配。通过上方标签页切换核心、趋势、新生池。每列按当日平均值降序排列，行号为组内排名。
        表格包含历史上所有曾出现在该池子的板块，每个日期显示当日实际存在的板块，空缺留白。
        下方显示该组当前板块列表，并标注相对于前一日的详细变动（新增来源/退出去向）。
        单击板块名称红色高亮所有同名单元格，双击打开走势图。
    </div>

    <div class="layout">
        <div class="board-tabs" id="boardTabNav">
            <button class="board-tab-button active" data-board="industry">行业板块</button>
            <button class="board-tab-button" data-board="concept">概念板块</button>
        </div>
        <div class="content-area">
            <div class="tabs" id="tabNav">
                <button class="tab-button active" data-tab="core">🔥核心池</button>
                <button class="tab-button" data-tab="trend">📈趋势池</button>
                <button class="tab-button" data-tab="new">🆕新生池</button>
            </div>

            <div id="core-pane" class="tab-pane active"></div>
            <div id="trend-pane" class="tab-pane"></div>
            <div id="new-pane" class="tab-pane"></div>
        </div>
    </div>
</div>

<script>
    const boardData = {{
        industry: {{
            blocksCore: {json.dumps(blocks_by_tag_ind.get('🔥核心', []), ensure_ascii=False)},
            blocksTrend: {json.dumps(blocks_by_tag_ind.get('📈趋势', []), ensure_ascii=False)},
            blocksNew: {json.dumps(blocks_by_tag_ind.get('🆕新生', []), ensure_ascii=False)},
            allDates: {json.dumps(all_dates_ind, ensure_ascii=False)},
            transitions: {json.dumps(transitions_ind, ensure_ascii=False)},
            latestPoolMap: {json.dumps(latest_pool_map_ind, ensure_ascii=False)}
        }},
        concept: {{
            blocksCore: {json.dumps(blocks_by_tag_con.get('🔥核心', []), ensure_ascii=False)},
            blocksTrend: {json.dumps(blocks_by_tag_con.get('📈趋势', []), ensure_ascii=False)},
            blocksNew: {json.dumps(blocks_by_tag_con.get('🆕新生', []), ensure_ascii=False)},
            allDates: {json.dumps(all_dates_con, ensure_ascii=False)},
            transitions: {json.dumps(transitions_con, ensure_ascii=False)},
            latestPoolMap: {json.dumps(latest_pool_map_con, ensure_ascii=False)}
        }}
    }};
    let activeBoard = 'industry';

    const poolTitles = {{ '🔥核心': '核心池', '📈趋势': '趋势池', '🆕新生': '新生池' }};
    const poolColors = {{ '🔥核心': 'core-title', '📈趋势': 'trend-title', '🆕新生': 'new-title' }};

    function getDatesInRange(start, end) {{
        const allDates = boardData[activeBoard].allDates || [];
        const startIdx = allDates.indexOf(start);
        const endIdx = allDates.indexOf(end);
        if (startIdx === -1 || endIdx === -1) return [];
        const startPos = Math.min(startIdx, endIdx);
        const endPos = Math.max(startIdx, endIdx);
        return allDates.slice(startPos, endPos + 1);
    }}

    function generateTableForPool(tag, dateList) {{
        let blocks;
        if (tag === '🔥核心') blocks = boardData[activeBoard].blocksCore;
        else if (tag === '📈趋势') blocks = boardData[activeBoard].blocksTrend;
        else blocks = boardData[activeBoard].blocksNew;

        if (blocks.length === 0) return '<p>无数据</p>';

        const dailyData = {{}};
        dateList.forEach(date => {{
            const dayBlocks = [];
            blocks.forEach(block => {{
                const avg = block.avgData[date];
                if (avg !== null) {{
                    dayBlocks.push({{ name: block.name, type: block.type, avg: avg }});
                }}
            }});
            dayBlocks.sort((a, b) => b.avg - a.avg);
            dailyData[date] = dayBlocks;
        }});

        let maxRows = 0;
        dateList.forEach(date => {{
            maxRows = Math.max(maxRows, dailyData[date].length);
        }});

        let headerHtml = '<tr><th>序号</th>';
        dateList.forEach(date => {{
            headerHtml += `<th>${{date.slice(5)}}</th>`;
        }});
        headerHtml += '</tr>';

        let rowsHtml = '';
        for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {{
            let rowCells = `<td class="rank-col">${{rowIdx + 1}}</td>`;
            dateList.forEach(date => {{
                const dayBlocks = dailyData[date];
                if (rowIdx < dayBlocks.length) {{
                    const block = dayBlocks[rowIdx];
                    const typeClass = block.type === '行业' ? 'type-industry' : 'type-concept';
                    const displayText = `${{block.name}} (${{block.avg.toFixed(1)}})`;
                    rowCells += `<td><span class="name-cell ${{typeClass}}" data-name="${{block.name}}" data-avg="${{block.avg}}" title="${{date}} 平均RPS: ${{block.avg}}">${{displayText}}</span></td>`;
                }} else {{
                    rowCells += '<td></td>';
                }}
            }});
            rowsHtml += `<tr>${{rowCells}}</tr>`;
        }}

        const latestDate = dateList[0];
        const latestBlocks = dailyData[latestDate] || [];
        const blockListText = latestBlocks.map(b => b.name).join('、');

        const transMap = boardData[activeBoard].transitions || {{}};
        const trans = transMap[tag] || {{ '新增': [], '退出': [] }};
        let changeHtml = '<div class="change-info">';
        if (trans['新增'].length > 0) {{
            const addItems = trans['新增'].map(item => {{
                return `<span class="added">↑${{item[0]}} <span class="source-dest">(${{item[1]}})</span></span>`;
            }}).join(' ');
            changeHtml += `<div>新增：${{addItems}}</div>`;
        }}
        if (trans['退出'].length > 0) {{
            const remItems = trans['退出'].map(item => {{
                return `<span class="removed">↓${{item[0]}} <span class="source-dest">(${{item[1]}})</span></span>`;
            }}).join(' ');
            changeHtml += `<div>退出：${{remItems}}</div>`;
        }}
        if (trans['新增'].length === 0 && trans['退出'].length === 0) {{
            changeHtml += '<div>（与前一交易日相比无变动）</div>';
        }}
        changeHtml += '</div>';

        return `
            <div class="table-wrapper">
                <div class="table-title ${{poolColors[tag]}}">${{poolTitles[tag]}}</div>
                <table>${{headerHtml}}${{rowsHtml}}</table>
                <div class="pool-info">
                    <div class="pool-list"><strong>当前${{poolTitles[tag]}}板块：</strong>${{blockListText}}</div>
                    ${{changeHtml}}
                </div>
            </div>
        `;
    }}

    function renderAllTables(startDate, endDate) {{
        let dateList = getDatesInRange(startDate, endDate);
        if (dateList.length === 0) {{
            document.getElementById('core-pane').innerHTML = '<p>所选范围内无数据</p>';
            document.getElementById('trend-pane').innerHTML = '';
            document.getElementById('new-pane').innerHTML = '';
            return;
        }}
        dateList.reverse();

        document.getElementById('core-pane').innerHTML = generateTableForPool('🔥核心', dateList);
        document.getElementById('trend-pane').innerHTML = generateTableForPool('📈趋势', dateList);
        document.getElementById('new-pane').innerHTML = generateTableForPool('🆕新生', dateList);

        bindEvents();
    }}

    function bindEvents() {{
        document.querySelectorAll('.name-cell').forEach(span => {{
            span.addEventListener('click', function(e) {{
                e.stopPropagation();
                const name = this.getAttribute('data-name');
                highlightByName(name);
            }});
            span.addEventListener('dblclick', function(e) {{
                e.stopPropagation();
                const name = this.getAttribute('data-name');
                const cur = boardData[activeBoard];
                let block = cur.blocksCore.find(b => b.name === name) ||
                            cur.blocksTrend.find(b => b.name === name) ||
                            cur.blocksNew.find(b => b.name === name);
                if (block) {{
                    const chartFile = `${{name}}_${{block.type}}.html`;
                    window.open('charts/' + encodeURIComponent(chartFile), '_blank');
                }} else {{
                    alert('未找到走势图');
                }}
            }});
        }});
    }}

    function highlightByName(name) {{
        document.querySelectorAll('.name-cell').forEach(span => {{
            span.closest('td').classList.remove('highlight-cell');
        }});
        document.querySelectorAll(`.name-cell[data-name="${{name}}"]`).forEach(span => {{
            span.closest('td').classList.add('highlight-cell');
        }});
    }}

    function setupTabs() {{
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {{
            btn.addEventListener('click', function() {{
                tabButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
                const tab = this.getAttribute('data-tab');
                document.getElementById(tab + '-pane').classList.add('active');
            }});
        }});
    }}

    function setupBoardTabs() {{
        const boardButtons = document.querySelectorAll('.board-tab-button');
        boardButtons.forEach(btn => {{
            btn.addEventListener('click', function() {{
                boardButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeBoard = this.getAttribute('data-board');
                updateTables();
            }});
        }});
    }}

    function updateTables() {{
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;
        if (start && end) {{
            renderAllTables(start, end);
        }}
    }}

    window.onload = function() {{
        setupBoardTabs();
        setupTabs();
        renderAllTables('{default_start}', '{default_end}');
    }};
</script>
</body>
</html>'''

    output_path = os.path.join(REPORTS_FOLDER, OUTPUT_FILENAME)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_template)

    print(f"\n主报告已生成：{output_path}")
    print(f"独立图表保存在：{CHARTS_FOLDER}")


if __name__ == '__main__':
    main()
