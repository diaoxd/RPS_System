#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
RPS多周期分析报告生成脚本（最终版）
功能：三个独立表格（核心、趋势、新生）通过选项卡切换，每列按当日组内平均值降序排列。
      表格包含历史上所有曾出现在该池子的板块，每个日期显示当日实际存在的板块，空缺留白。
      时间从左到右由新到旧（最新日期在最左，最早日期在最右）。
      下方显示该组当前板块列表，并标注相对于前一日的详细变动（新增来源/退出去向）。
      单击板块名称红色高亮所有同名单元格，双击打开走势图。
      导出文件名为 RPS_多周期分析报告.html。
"""

import os
import glob
import pandas as pd
from datetime import datetime
import plotly.graph_objects as go
from plotly.offline import plot
import re
import json
from collections import defaultdict

# ================== 配置参数 ==================
DATA_FOLDER = os.path.join('c:\\tool\\RPS市场分析系统', 'data')
REPORTS_FOLDER = os.path.join('c:\\tool\\RPS市场分析系统', 'reports')
CHARTS_FOLDER = os.path.join(REPORTS_FOLDER, 'charts')
MAX_FILES = 250               # 最多加载多少个文件（从最新往前）
DEFAULT_DAYS = 30             # 默认显示最近多少天
# =============================================

os.makedirs(CHARTS_FOLDER, exist_ok=True)


def standardize_columns(df, file_desc=""):
    """列名标准化：将各种可能的列名映射为统一名称"""
    mapping_rules = {
        '代码': ['代码', 'code', '板块代码', '行业代码', '概念代码'],
        '名称': ['名称', 'name', '板块名称', '行业名称', '概念名称'],
        'RPS120': ['rps120', 'rps_120', '120日rps'],
        'RPS60': ['rps60', 'rps_60', '60日rps'],
        'RPS20': ['rps20', 'rps_20', '20日rps'],
        'RPS5': ['rps5', 'rps_5', '5日rps']
    }

    rename_map = {}
    for col in df.columns:
        col_lower = col.lower().replace(' ', '')
        for std_col, keywords in mapping_rules.items():
            if any(keyword.lower().replace(' ', '') in col_lower for keyword in keywords):
                rename_map[col] = std_col
                break

    if rename_map:
        df.rename(columns=rename_map, inplace=True)

    required = ['代码', '名称', 'RPS120', 'RPS60', 'RPS20', 'RPS5']
    missing = [r for r in required if r not in df.columns]
    if missing:
        print(f"警告：文件 {file_desc} 缺少必要列 {missing}，现有列名为：{list(df.columns)}")
        raise ValueError(f"文件 {file_desc} 列名不匹配")
    return df


def load_historical_rps(folder, max_files):
    """加载历史数据，合并行业和概念文件"""
    industry_files = glob.glob(os.path.join(folder, '行业_*.xlsx'))
    concept_files = glob.glob(os.path.join(folder, '概念_*.xlsx'))

    def extract_date(filename):
        base = os.path.basename(filename)
        date_str = base.split('_')[1].split('.')[0]
        return datetime.strptime(date_str, '%Y%m%d').date()

    industry_files.sort(key=extract_date)
    concept_files.sort(key=extract_date)

    industry_files = industry_files[-max_files:]
    concept_files = concept_files[-max_files:]

    min_len = min(len(industry_files), len(concept_files))
    industry_files = industry_files[:min_len]
    concept_files = concept_files[:min_len]

    all_dfs = []
    for ind_f, con_f in zip(industry_files, concept_files):
        date_ind = extract_date(ind_f)
        date_con = extract_date(con_f)
        if date_ind != date_con:
            continue

        df_ind = pd.read_excel(ind_f)
        df_ind = standardize_columns(df_ind, file_desc=ind_f)
        df_ind['类型'] = '行业'

        df_con = pd.read_excel(con_f)
        df_con = standardize_columns(df_con, file_desc=con_f)
        df_con['类型'] = '概念'

        df = pd.concat([df_ind, df_con], ignore_index=True)
        df['日期'] = date_ind
        all_dfs.append(df)

    if all_dfs:
        return pd.concat(all_dfs, ignore_index=True)
    return pd.DataFrame()


def identify_pools(df):
    """
    识别三个池子（互斥）
    返回字典：{板块名称: 池子标签, ...}
    """
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
    """
    为三个池子准备历史全量数据
    返回:
        blocks_by_tag: dict {tag: list of block_info}
        all_dates_str: list of date strings (升序，由远及近，供前端使用)
        latest_pool_map: 最新日池子映射
        transitions: 详细变动信息
    """
    all_dates = sorted(multi_df['日期'].unique())  # 升序，由远及近
    all_dates_str = [d.strftime('%Y-%m-%d') for d in all_dates]

    # 获取每个日期各池子的成员
    pool_members_by_date = {}  # date -> {tag: set of names}
    for date in all_dates:
        df_day = multi_df[multi_df['日期'] == date]
        pool_map = identify_pools(df_day)
        by_tag = defaultdict(set)
        for name, tag in pool_map.items():
            by_tag[tag].add(name)
        pool_members_by_date[date] = by_tag

    # 收集每个池子历史上所有板块
    pool_blocks = defaultdict(set)
    for by_tag in pool_members_by_date.values():
        for tag, names in by_tag.items():
            pool_blocks[tag].update(names)

    # 预计算每个板块每日平均值和类型
    block_avg_raw = defaultdict(dict)  # name -> {date_str: avg}
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

    # 为每个池子构建 blocks 列表（每个板块仅当日在池子中才显示平均值）
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

    # 最新日池子映射
    latest_date = all_dates[-1]
    df_latest = multi_df[multi_df['日期'] == latest_date]
    latest_pool_map = identify_pools(df_latest)

    # 详细变动（基于最新日和前一日）
    transitions = get_detailed_transitions(multi_df)

    return blocks_by_tag, all_dates_str, latest_pool_map, transitions


def get_detailed_transitions(multi_df):
    """计算相对于前一日的详细变动（包括来源和去向）"""
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
    """生成独立走势图HTML文件"""
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
    print("正在加载历史RPS数据...")
    multi_df = load_historical_rps(DATA_FOLDER, MAX_FILES)
    if multi_df.empty:
        print("错误：未找到RPS数据文件")
        return

    latest_date = multi_df['日期'].max()
    print(f"数据日期范围：{multi_df['日期'].min()} 至 {latest_date}")
    print(f"总数据量：{len(multi_df)} 条")

    # 准备历史全量数据
    blocks_by_tag, all_dates, latest_pool_map, transitions = prepare_historical_data(multi_df)

    # 打印统计信息
    for tag in ['🔥核心', '📈趋势', '🆕新生']:
        cnt = len(blocks_by_tag.get(tag, []))
        print(f"{tag}历史累计板块: {cnt} 个")

    # 为每个板块生成走势图（仅对最新池子成员，避免生成过多无用图表）
    print("正在生成独立走势图（仅最新池子成员）...")
    for name in latest_pool_map.keys():
        typ = multi_df[multi_df['名称'] == name]['类型'].iloc[0] if not multi_df[multi_df['名称'] == name].empty else ''
        hist = multi_df[multi_df['名称'] == name].sort_values('日期')
        if len(hist) >= 2:
            generate_block_chart_file(name, typ, hist, CHARTS_FOLDER)

    # 默认显示最近 DEFAULT_DAYS 天，起始日期为最新日期前 DEFAULT_DAYS-1 天，结束日期为最新日期
    default_end = all_dates[-1]  # 最新日期
    # 计算起始日期：如果总天数小于 DEFAULT_DAYS，则取最早日期，否则取倒数第 DEFAULT_DAYS 个日期
    if len(all_dates) <= DEFAULT_DAYS:
        default_start = all_dates[0]
    else:
        default_start = all_dates[-DEFAULT_DAYS]

    # 构建HTML模板
    html_template = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>RPS多周期分析报告</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 30px; background: #f5f7fa; }}
        .container {{ max-width: 100%; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
        h1 {{ color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }}
        .controls {{ margin: 20px 0; padding: 15px; background: #ecf0f1; border-radius: 8px; }}
        .controls label {{ margin-right: 10px; }}
        .controls input {{ margin-right: 20px; padding: 5px; }}
        .note {{ background: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-size: 13px; }}

        /* 选项卡样式 */
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
        .tab-pane {{
            display: none;
        }}
        .tab-pane.active {{
            display: block;
        }}

        /* 表格样式 */
        .table-wrapper {{
            background: white;
            border-radius: 8px;
            padding: 15px;
            border: 1px solid #d0d7de;
            overflow-x: auto;
        }}
        table {{
            border-collapse: collapse;
            font-size: 12px;
            min-width: 100%;
        }}
        th {{
            background: #2c3e50;
            color: white;
            padding: 6px;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 10;
        }}
        td {{
            padding: 4px 6px;
            border-bottom: 1px solid #e2e8f0;
            text-align: center;
        }}
        tr:hover {{ filter: brightness(95%); }}
        .name-cell {{ cursor: pointer; }}
        .highlight-cell {{ background-color: #ff6666 !important; }}
        .table-title {{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
        }}
        .core-title {{ color: #c0392b; }}
        .trend-title {{ color: #e67e22; }}
        .new-title {{ color: #27ae60; }}
        .pool-info {{
            margin-top: 15px;
            padding: 10px;
            background: #ecf0f1;
            border-radius: 5px;
            font-size: 12px;
        }}
        .pool-list {{
            max-height: 80px;
            overflow-y: auto;
            margin-bottom: 5px;
        }}
        .change-info {{
            font-size: 12px;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px dashed #aaa;
        }}
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
    <h1>📊 RPS多周期分析报告</h1>

    <div class="controls">
        <label>起始日期：</label>
        <input type="date" id="startDate" value="{default_start}">
        <label>结束日期：</label>
        <input type="date" id="endDate" value="{default_end}">
        <button onclick="updateTables()">应用</button>
        <span style="margin-left:20px;">默认显示最近{DEFAULT_DAYS}天，可自由调整范围。时间从左到右由新到旧。</span>
    </div>

    <div class="note">
        <strong>说明：</strong> 通过上方标签页切换核心、趋势、新生池。每列按当日平均值降序排列，行号为组内排名。
        表格包含历史上所有曾出现在该池子的板块，每个日期显示当日实际存在的板块，空缺留白。
        下方显示该组当前板块列表，并标注相对于前一日的详细变动（新增来源/退出去向）。
        单击板块名称红色高亮所有同名单元格，双击打开走势图。
    </div>

    <!-- 选项卡导航 -->
    <div class="tabs" id="tabNav">
        <button class="tab-button active" data-tab="core">🔥核心池</button>
        <button class="tab-button" data-tab="trend">📈趋势池</button>
        <button class="tab-button" data-tab="new">🆕新生池</button>
    </div>

    <!-- 三个表格容器（将动态填充） -->
    <div id="core-pane" class="tab-pane active"></div>
    <div id="trend-pane" class="tab-pane"></div>
    <div id="new-pane" class="tab-pane"></div>
</div>

<script>
    // 嵌入数据（三个池子独立）
    const blocksCore = {json.dumps(blocks_by_tag.get('🔥核心', []), ensure_ascii=False)};
    const blocksTrend = {json.dumps(blocks_by_tag.get('📈趋势', []), ensure_ascii=False)};
    const blocksNew = {json.dumps(blocks_by_tag.get('🆕新生', []), ensure_ascii=False)};
    const allDates = {json.dumps(all_dates, ensure_ascii=False)};  // 升序，由远及近
    // 详细变动数据
    const transitions = {json.dumps(transitions, ensure_ascii=False)};
    // 最新池子成员（用于当前板块列表）
    const latestPoolMap = {json.dumps(latest_pool_map, ensure_ascii=False)};

    const poolTitles = {{ '🔥核心': '核心池', '📈趋势': '趋势池', '🆕新生': '新生池' }};
    const poolColors = {{ '🔥核心': 'core-title', '📈趋势': 'trend-title', '🆕新生': 'new-title' }};

    // 获取日期范围内的日期列表（保持升序）
    function getDatesInRange(start, end) {{
        const startIdx = allDates.indexOf(start);
        const endIdx = allDates.indexOf(end);
        if (startIdx === -1 || endIdx === -1) return [];
        const startPos = Math.min(startIdx, endIdx);
        const endPos = Math.max(startIdx, endIdx);
        return allDates.slice(startPos, endPos + 1);
    }}

    // 生成某个池子的表格HTML（传入的 dateList 已是降序）
    function generateTableForPool(tag, dateList) {{
        let blocks;
        if (tag === '🔥核心') blocks = blocksCore;
        else if (tag === '📈趋势') blocks = blocksTrend;
        else blocks = blocksNew;

        if (blocks.length === 0) return '<p>无数据</p>';

        // 构建该组每天的数据：date -> 该组板块按平均值排序后的数组
        const dailyData = {{}};
        dateList.forEach(date => {{
            const dayBlocks = [];
            blocks.forEach(block => {{
                const avg = block.avgData[date];
                if (avg !== null) {{
                    dayBlocks.push({{
                        name: block.name,
                        type: block.type,
                        avg: avg
                    }});
                }}
            }});
            // 组内按平均值降序排序
            dayBlocks.sort((a, b) => b.avg - a.avg);
            dailyData[date] = dayBlocks;
        }});

        // 确定该组最大行数（所有日期中最大板块数）
        let maxRows = 0;
        dateList.forEach(date => {{
            maxRows = Math.max(maxRows, dailyData[date].length);
        }});

        // 表头
        let headerHtml = '<tr><th>序号</th>';
        dateList.forEach(date => {{
            headerHtml += `<th>${{date.slice(5)}}</th>`;
        }});
        headerHtml += '</tr>';

        // 表格主体
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

        // 最新日板块列表（最新日期是 dateList[0]）
        const latestDate = dateList[0];
        const latestBlocks = dailyData[latestDate] || [];
        const blockListText = latestBlocks.map(b => b.name).join('、');

        // 详细变动信息
        const trans = transitions[tag] || {{ '新增': [], '退出': [] }};
        let changeHtml = '<div class="change-info">';
        if (trans['新增'].length > 0) {{
            const addItems = trans['新增'].map(item => {{
                const name = item[0];
                const source = item[1];
                return `<span class="added">↑${{name}} <span class="source-dest">(${{source}})</span></span>`;
            }}).join(' ');
            changeHtml += `<div>新增：${{addItems}}</div>`;
        }}
        if (trans['退出'].length > 0) {{
            const remItems = trans['退出'].map(item => {{
                const name = item[0];
                const dest = item[1];
                return `<span class="removed">↓${{name}} <span class="source-dest">(${{dest}})</span></span>`;
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

    // 重新渲染所有选项卡内容
    function renderAllTables(startDate, endDate) {{
        let dateList = getDatesInRange(startDate, endDate);
        if (dateList.length === 0) {{
            document.getElementById('core-pane').innerHTML = '<p>所选范围内无数据</p>';
            document.getElementById('trend-pane').innerHTML = '';
            document.getElementById('new-pane').innerHTML = '';
            return;
        }}
        // 反转日期列表，使得最新日期在最左边
        dateList.reverse();

        document.getElementById('core-pane').innerHTML = generateTableForPool('🔥核心', dateList);
        document.getElementById('trend-pane').innerHTML = generateTableForPool('📈趋势', dateList);
        document.getElementById('new-pane').innerHTML = generateTableForPool('🆕新生', dateList);

        // 重新绑定事件
        bindEvents();
    }}

    // 绑定单元格事件（单击高亮，双击打开图表）
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
                // 在所有池子中查找板块类型
                let block = blocksCore.find(b => b.name === name) ||
                            blocksTrend.find(b => b.name === name) ||
                            blocksNew.find(b => b.name === name);
                if (block) {{
                    const chartFile = `${{name}}_${{block.type}}.html`;
                    window.open('charts/' + encodeURIComponent(chartFile), '_blank');
                }} else {{
                    alert('未找到走势图');
                }}
            }});
        }});
    }}

    // 高亮同名单元格
    function highlightByName(name) {{
        document.querySelectorAll('.name-cell').forEach(span => {{
            span.closest('td').classList.remove('highlight-cell');
        }});
        document.querySelectorAll(`.name-cell[data-name="${{name}}"]`).forEach(span => {{
            span.closest('td').classList.add('highlight-cell');
        }});
    }}

    // 选项卡切换
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

    // 更新表格（由日期控件触发）
    function updateTables() {{
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;
        if (start && end) {{
            renderAllTables(start, end);
        }}
    }}

    // 页面初始化
    window.onload = function() {{
        setupTabs();
        renderAllTables('{default_start}', '{default_end}');
    }};
</script>
</body>
</html>'''

    output_filename = 'RPS_多周期分析报告.html'
    output_path = os.path.join(REPORTS_FOLDER, output_filename)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_template)

    print(f"主报告已生成：{output_path}")
    print(f"独立图表保存在：{CHARTS_FOLDER}")


if __name__ == '__main__':
    main()