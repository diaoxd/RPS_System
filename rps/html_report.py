# -*- coding: utf-8 -*-
import json
import re

from rps import constants as C

class 多周期Rps报告页面:
    """
    多周期 RPS 主报告 HTML/JS（纯展现层）

    原则：不做业务计算，只消费 context。
    """

    @staticmethod
    def _build_chart_filename(block_name: str, block_type: str) -> str:
        safe_name = re.sub(r'[\\/*?:"<>|]', "_", str(block_name))
        return f"{safe_name}_{block_type}.html"

    @staticmethod
    def _inject_chart_file(blocks_by_tag: dict) -> dict:
        """
        给前端块数据补充 chartFile，确保前后端文件名一致。
        """
        out = {}
        for tag, blocks in (blocks_by_tag or {}).items():
            new_blocks = []
            for b in blocks:
                item = dict(b)
                item["chartFile"] = 多周期Rps报告页面._build_chart_filename(item.get("name", ""), item.get("type", ""))
                new_blocks.append(item)
            out[tag] = new_blocks
        return out

    @staticmethod
    def _inject_chart_file_top20(top20_by_date: dict) -> dict:
        out = {}
        for ds, items in (top20_by_date or {}).items():
            arr = []
            for x in items:
                item = dict(x)
                item["chartFile"] = 多周期Rps报告页面._build_chart_filename(item.get("name", ""), item.get("type", ""))
                arr.append(item)
            out[ds] = arr
        return out

    @staticmethod
    def build_report_html(context: dict, default_days: int) -> str:
        """
        根据业务上下文构建主报告 HTML。
        """
        ind = dict(context["industry"])
        con = dict(context["concept"])
        ind["blocks_by_tag"] = 多周期Rps报告页面._inject_chart_file(ind.get("blocks_by_tag", {}))
        con["blocks_by_tag"] = 多周期Rps报告页面._inject_chart_file(con.get("blocks_by_tag", {}))
        ind["top20_by_date"] = 多周期Rps报告页面._inject_chart_file_top20(ind.get("top20_by_date", {}))
        con["top20_by_date"] = 多周期Rps报告页面._inject_chart_file_top20(con.get("top20_by_date", {}))
        default_start = context["default_start"]
        default_end = context["default_end"]

        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>{C.HTML_DOCUMENT_TITLE}</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 30px; background: #f5f7fa; }}
    .container {{ max-width: 100%; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
    h1 {{ font-size: 24px; margin: 0 0 12px 0; }}
    .layout {{ display: flex; gap: 16px; }}
    .board-tabs {{ width: 130px; display: flex; flex-direction: column; gap: 8px; }}
    .board-tab-button {{ padding: 10px 8px; border: 1px solid #d0d7de; background: #f3f4f6; border-radius: 8px; cursor: pointer; font-weight: bold; }}
    .board-tab-button.active {{ background: #2c3e50; color: #fff; }}
    .content-area {{ flex: 1; }}
    .tabs {{ display: flex; gap: 5px; margin-bottom: 20px; border-bottom: 2px solid #d0d7de; padding-bottom: 10px; }}
    .tab-button {{ padding: 8px 20px; font-size: 16px; font-weight: bold; border: none; background: #e9ecef; border-radius: 20px 20px 0 0; cursor: pointer; }}
    .tab-button.active {{ background: #2c3e50; color: white; }}
    .tab-pane {{ display: none; }} .tab-pane.active {{ display: block; }}
    .table-wrapper {{ background: white; border-radius: 8px; padding: 15px; border: 1px solid #d0d7de; overflow-x: auto; }}
    table {{ border-collapse: collapse; font-size: 12px; min-width: 100%; }}
    th {{ background: #2c3e50; color: white; padding: 6px; text-align: center; position: sticky; top: 0; z-index: 10; }}
    td {{ padding: 4px 6px; border-bottom: 1px solid #e2e8f0; text-align: center; }}
    .name-cell {{ cursor: pointer; }} .highlight-cell {{ background-color: #ff6666 !important; }}
    .core-title {{ color: #c0392b; }} .trend-title {{ color: #e67e22; }} .new-title {{ color: #27ae60; }}
    .rank-col {{ background-color: #f0f0f0; font-weight: bold; }}
    .type-industry {{ color: #000000; }} .type-concept {{ color: #0066cc; }}
    .pool-info {{ margin-top: 12px; padding: 10px; background: #ecf0f1; border-radius: 6px; font-size: 12px; }}
    .pool-list {{ max-height: 86px; overflow-y: auto; margin-bottom: 6px; }}
    .change-info {{ font-size: 12px; margin-top: 4px; padding-top: 5px; border-top: 1px dashed #aaa; }}
    .added {{ color: #27ae60; font-weight: bold; }}
    .removed {{ color: #c0392b; font-weight: bold; }}
    .source-dest {{ font-weight: normal; color: #555; }}
    /* 成分股浮框：黑底红字；序号 + 代码 + 名称 + 收盘价 + 涨幅 + 换手（最多 20 行，数据来自接口/ stock_rps_daily 联表） */
    #sector-stock-mask {{
      display: none;
      position: fixed;
      z-index: 10050;
      left: 0;
      top: 0;
      width: max-content;
      max-width: min(560px, 98vw);
      pointer-events: none;
    }}
    #sector-stock-mask.visible {{ display: block; }}
    .sector-stock-mask-panel {{
      pointer-events: auto;
      min-width: 430px;
      max-width: min(560px, 98vw);
      max-height: min(70vh, 480px);
      overflow: auto;
      background: #000000;
      color: #ff2020;
      border: 1px solid #441818;
      border-radius: 4px;
      box-shadow: 0 8px 28px rgba(0,0,0,0.5);
      padding: 6px 8px;
      font-size: 11px;
      line-height: 1.2;
    }}
    .sector-stock-mask-title {{
      font-weight: bold;
      margin-bottom: 4px;
      padding-bottom: 4px;
      border-bottom: 1px solid #331111;
      color: #ff2020;
      font-size: 11px;
    }}
    .sector-stock-grid.sector-stock-table {{
      display: block;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #6b7280;
      border-radius: 3px;
      overflow: hidden;
    }}
    .sg-table {{
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 11px;
      line-height: 1.25;
      font-variant-numeric: tabular-nums;
      margin: 0;
    }}
    .sg-table col.sgc-idx {{ width: 28px; }}
    .sg-table col.sgc-code {{ width: 72px; }}
    .sg-table col.sgc-name {{ width: auto; }}
    .sg-table col.sgc-q {{ width: 60px; }}
    .sg-table col.sgc-chg {{ width: 56px; }}
    .sg-table col.sgc-hs {{ width: 52px; }}
    .sg-table thead th {{
      background: #141414;
      color: #9ca3af;
      font-weight: 600;
      padding: 3px 5px;
      border: 1px solid #9ca3af;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }}
    .sg-table thead .sg-idx,
    .sg-table thead .sg-q,
    .sg-table thead .sg-chg,
    .sg-table thead .sg-hs {{ text-align: right; }}
    .sg-table thead .sg-code,
    .sg-table thead .sg-name {{ text-align: left; }}
    .sg-table tbody td {{
      padding: 2px 5px;
      border: 1px solid #6b7280;
      vertical-align: middle;
    }}
    .sg-table tbody .sg-idx {{
      text-align: right;
      color: #aa3333;
    }}
    .sg-table tbody .sg-code {{
      font-family: ui-monospace, Consolas, monospace;
      color: #ff6666;
      text-align: left;
    }}
    .sg-table tbody .sg-name {{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 0;
      color: #ff4040;
      text-align: left;
    }}
    .sg-table tbody .sg-q {{
      text-align: right;
      color: #ff5555;
    }}
    .sg-table tbody .sg-chg {{
      text-align: right;
      color: #ff3030;
    }}
    .sg-table tbody .sg-chg.sg-up {{ color: #ff2020; font-weight: 600; }}
    .sg-table tbody .sg-chg.sg-down {{ color: #1e9fd0; font-weight: 600; }}
    .sg-table tbody tr.sg-row-hi-turn td.sg-chg.sg-down {{ color: #0c6f8c !important; }}
    .sg-table tbody .sg-hs {{
      text-align: right;
      color: #ff5555;
      white-space: nowrap;
    }}
    .sg-table tbody tr.sg-row-hi-turn {{
      background: #fde047 !important;
    }}
    .sg-table tbody tr.sg-row-hi-turn td {{
      color: #991b1b !important;
      border-color: #a8a29e !important;
    }}
    .sector-stock-grid.sector-stock-msg .sg-msg-full {{
      padding: 6px;
      word-break: break-word;
      color: #ff5555;
    }}
    .sector-stock-hint {{ margin-top: 6px; font-size: 10px; color: #994444; }}
  </style>
</head>
<body>
<div class="container">
  <h1>📊 RPS多周期分析报告（行业/概念分开）</h1>
  <div style="margin:6px 0;">
    <label>起始日期：</label><input type="date" id="startDate" value="{default_start}">
    <label>结束日期：</label><input type="date" id="endDate" value="{default_end}">
    <button onclick="updateTables()">应用</button>
    <span style="margin-left:20px;">默认显示最近{default_days}天</span>
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
        <button class="tab-button" data-tab="top20">🏆前20</button>
      </div>
      <div id="core-pane" class="tab-pane active"></div>
      <div id="trend-pane" class="tab-pane"></div>
      <div id="new-pane" class="tab-pane"></div>
      <div id="top20-pane" class="tab-pane"></div>
    </div>
  </div>
</div>

<div id="sector-stock-mask" aria-hidden="true">
  <div class="sector-stock-mask-panel" id="sector-stock-mask-panel">
    <div class="sector-stock-mask-title" id="sector-stock-mask-title">成分股</div>
    <div class="sector-stock-grid" id="sector-stock-grid"></div>
    <div class="sector-stock-hint" id="sector-stock-hint">序号 · 代码 · 名称 · 收盘价 · 涨幅 · 换手率（涨幅降序 TOP20）</div>
  </div>
</div>

<script>
  const boardData = {{
    industry: {{
      blocksCore: {json.dumps(ind["blocks_by_tag"].get("🔥核心", []), ensure_ascii=False)},
      blocksTrend: {json.dumps(ind["blocks_by_tag"].get("📈趋势", []), ensure_ascii=False)},
      blocksNew: {json.dumps(ind["blocks_by_tag"].get("🆕新生", []), ensure_ascii=False)},
      allDates: {json.dumps(ind["all_dates"], ensure_ascii=False)},
      transitions: {json.dumps(ind["transitions"], ensure_ascii=False)},
      top20ByDate: {json.dumps(ind["top20_by_date"], ensure_ascii=False)}
    }},
    concept: {{
      blocksCore: {json.dumps(con["blocks_by_tag"].get("🔥核心", []), ensure_ascii=False)},
      blocksTrend: {json.dumps(con["blocks_by_tag"].get("📈趋势", []), ensure_ascii=False)},
      blocksNew: {json.dumps(con["blocks_by_tag"].get("🆕新生", []), ensure_ascii=False)},
      allDates: {json.dumps(con["all_dates"], ensure_ascii=False)},
      transitions: {json.dumps(con["transitions"], ensure_ascii=False)},
      top20ByDate: {json.dumps(con["top20_by_date"], ensure_ascii=False)}
    }}
  }};

  let activeBoard = 'industry';
  const poolTitles = {{ '🔥核心': '核心池', '📈趋势': '趋势池', '🆕新生': '新生池', '🏆前20': '前20' }};
  const poolColors = {{ '🔥核心': 'core-title', '📈趋势': 'trend-title', '🆕新生': 'new-title', '🏆前20': 'trend-title' }};
  let sectorHoverTimer = null;
  let sectorLeaveTimer = null;

  function hideSectorMask() {{
    const m = document.getElementById('sector-stock-mask');
    if (m) m.classList.remove('visible');
    if (sectorHoverTimer) {{ clearTimeout(sectorHoverTimer); sectorHoverTimer = null; }}
    if (sectorLeaveTimer) {{ clearTimeout(sectorLeaveTimer); sectorLeaveTimer = null; }}
  }}

  function positionSectorPanelNear(anchorEl) {{
    const wrap = document.getElementById('sector-stock-mask');
    const panel = document.getElementById('sector-stock-mask-panel');
    if (!wrap || !panel || !anchorEl) return;
    const ar = anchorEl.getBoundingClientRect();
    const margin = 8;
    const gap = 6;
    const pw = panel.offsetWidth || 280;
    const ph = panel.offsetHeight || 120;
    let left = ar.left + ar.width / 2 - pw / 2;
    let top = ar.bottom + gap;
    if (top + ph > window.innerHeight - margin) {{
      top = ar.top - gap - ph;
    }}
    if (top < margin) top = margin;
    left = Math.max(margin, Math.min(left, window.innerWidth - pw - margin));
    top = Math.max(margin, Math.min(top, window.innerHeight - ph - margin));
    wrap.style.left = Math.round(left) + 'px';
    wrap.style.top = Math.round(top) + 'px';
  }}

  function finalizeSectorPanel(anchorEl) {{
    if (!anchorEl) return;
    requestAnimationFrame(() => {{
      positionSectorPanelNear(anchorEl);
      requestAnimationFrame(() => positionSectorPanelNear(anchorEl));
    }});
  }}

  function sgEsc(s) {{
    if (s == null || s === '') return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }}

  function sgTurnoverPctAndHi(s) {{
    let n = null;
    if (s.turnover_num != null && s.turnover_num !== '') {{
      const v = Number(s.turnover_num);
      if (!isNaN(v)) n = v;
    }}
    if (n == null) {{
      const raw = (s.turnover != null) ? String(s.turnover) : '';
      const t = raw.replace(/换手/g, '').replace(/\\s+/g, ' ').trim();
      const m = t.match(/-?[\\d.]+/);
      if (m) {{
        const v = parseFloat(m[0]);
        if (!isNaN(v)) n = v;
      }}
    }}
    const text = (n != null && !isNaN(n)) ? (n.toFixed(2) + '%') : '--';
    const hi = (n != null && !isNaN(n) && n > 30);
    return {{ n: n, text: text, hi: hi }};
  }}

  function renderSectorStockTable(stocks) {{
    const list = (stocks || []).slice(0, 20);
    const head =
      '<table class="sg-table" cellspacing="0">' +
      '<colgroup>' +
      '<col class="sgc-idx" /><col class="sgc-code" /><col class="sgc-name" />' +
      '<col class="sgc-q" /><col class="sgc-chg" /><col class="sgc-hs" />' +
      '</colgroup>' +
      '<thead><tr>' +
      '<th class="sg-idx">序号</th>' +
      '<th class="sg-code">代码</th>' +
      '<th class="sg-name">名称</th>' +
      '<th class="sg-q">收盘价</th>' +
      '<th class="sg-chg">涨幅</th>' +
      '<th class="sg-hs">换手率</th>' +
      '</tr></thead><tbody>';
    const body = list.map(function(s, i) {{
      const idx = i + 1;
      const code = sgEsc((s.code != null) ? String(s.code).trim() : '');
      let nm = (s.name != null && String(s.name).trim() !== '') ? String(s.name).trim() : '';
      if (!nm && s.text) {{
        const t = String(s.text);
        const sp = t.indexOf(' ');
        nm = sp > 0 ? t.slice(sp + 1).trim() : '';
      }}
      const qfq = (s.qfq_close != null && String(s.qfq_close).trim() !== '')
        ? String(s.qfq_close).trim()
        : ((s.qfq_price != null && String(s.qfq_price).trim() !== '') ? String(s.qfq_price).trim() : '--');
      const chg = (s.chg != null && String(s.chg).trim() !== '') ? String(s.chg).trim() : '--';
      const to = sgTurnoverPctAndHi(s);
      const trAttr = to.hi ? ' class="sg-row-hi-turn"' : '';
      let cls = '';
      if (chg !== '--') {{
        const m = chg.replace(/%/g, '').trim().match(/-?[\\d.]+/);
        if (m) {{
          const v = parseFloat(m[0]);
          if (!isNaN(v)) {{
            if (v < 0) cls = 'sg-down';
            else if (v > 0) cls = 'sg-up';
          }}
        }}
      }}
      return '<tr' + trAttr + '>' +
        '<td class="sg-idx">' + idx + '</td>' +
        '<td class="sg-code">' + code + '</td>' +
        '<td class="sg-name" title="' + sgEsc(nm) + '">' + sgEsc(nm || '--') + '</td>' +
        '<td class="sg-q">' + sgEsc(qfq) + '</td>' +
        '<td class="sg-chg ' + cls + '">' + sgEsc(chg) + '</td>' +
        '<td class="sg-hs">' + sgEsc(to.text) + '</td>' +
        '</tr>';
    }}).join('');
    return head + body + '</tbody></table>';
  }}

  function setSectorGridMsg(html) {{
    const grid = document.getElementById('sector-stock-grid');
    grid.className = 'sector-stock-grid sector-stock-msg';
    grid.innerHTML = '<div class="sg-msg-full">' + html + '</div>';
  }}

  function formatSectorHoverTitle(boardCode, tradeDate, displayName) {{
    const c = (boardCode != null) ? String(boardCode).trim() : '';
    const n = (displayName != null) ? String(displayName).trim() : '';
    const d = (tradeDate != null) ? String(tradeDate).trim() : '';
    let head = '成分股';
    if (c && n && c !== n) head = c + ' ' + n;
    else if (n) head = n;
    else if (c) head = c;
    return d ? (head + ' · ' + d) : head;
  }}

  async function loadSectorStocks(boardCode, tradeDate, displayName, anchorEl) {{
    const mask = document.getElementById('sector-stock-mask');
    const title = document.getElementById('sector-stock-mask-title');
    const grid = document.getElementById('sector-stock-grid');
    if (!boardCode) {{
      title.textContent = '成分股';
      setSectorGridMsg('无板块代码，无法查询成分股');
      mask.classList.add('visible');
      finalizeSectorPanel(anchorEl);
      return;
    }}
    title.textContent = formatSectorHoverTitle(boardCode, tradeDate, displayName);
    setSectorGridMsg('加载中…');
    mask.classList.add('visible');
    finalizeSectorPanel(anchorEl);
    try {{
      const proto = (typeof location !== 'undefined' && location.protocol) ? location.protocol : '';
      if (proto === 'file:') {{
        setSectorGridMsg('无法请求接口：当前为本地文件打开。请通过本机 Web 访问，例如 <code>http://127.0.0.1:5001/report</code>（端口以实际为准），勿用资源管理器双击 HTML。');
        finalizeSectorPanel(anchorEl);
        return;
      }}
      if (proto !== 'http:' && proto !== 'https:') {{
        setSectorGridMsg('无法请求接口：请在 http(s) 页面中打开本报告。');
        finalizeSectorPanel(anchorEl);
        return;
      }}
      const u = new URL('/api/rps-board-stocks', location.origin);
      u.searchParams.set('sector_code', boardCode);
      u.searchParams.set('trade_date', tradeDate);
      const r = await fetch(u.toString(), {{ cache: 'no-store', credentials: 'same-origin' }});
      if (!r.ok) {{
        setSectorGridMsg('接口返回 ' + r.status + ' ' + (r.statusText || ''));
        finalizeSectorPanel(anchorEl);
        return;
      }}
      const j = await r.json();
      const stocks = (j && j.stocks) ? j.stocks : [];
      if (!stocks.length) {{
        setSectorGridMsg((j && j.error) ? sgEsc(j.error) : '暂无成分股（请先执行成分股入库）');
        finalizeSectorPanel(anchorEl);
        return;
      }}
      grid.className = 'sector-stock-grid sector-stock-table';
      grid.innerHTML = renderSectorStockTable(stocks);
      finalizeSectorPanel(anchorEl);
    }} catch (e) {{
      const msg = (e && e.message) ? e.message : String(e);
      setSectorGridMsg('加载失败：' + sgEsc(msg) + '（请确认 web_app 已启动，且通过 http 访问本报告，勿用本地文件双击打开）');
      finalizeSectorPanel(anchorEl);
    }}
  }}

  function scheduleSectorMask(boardCode, tradeDate, displayName, anchorEl) {{
    if (sectorHoverTimer) clearTimeout(sectorHoverTimer);
    sectorHoverTimer = setTimeout(() => loadSectorStocks(boardCode, tradeDate, displayName, anchorEl), 160);
  }}

  function getDatesInRange(start, end) {{
    const allDates = boardData[activeBoard].allDates || [];
    const s = allDates.indexOf(start), e = allDates.indexOf(end);
    if (s === -1 || e === -1) return [];
    return allDates.slice(Math.min(s, e), Math.max(s, e) + 1);
  }}

  function generateTableForPool(tag, dateList) {{
    const cur = boardData[activeBoard];
    const isTop20 = tag === '🏆前20';
    let blocks = tag === '🔥核心' ? cur.blocksCore : (tag === '📈趋势' ? cur.blocksTrend : cur.blocksNew);
    if (isTop20) blocks = [];
    if (!isTop20 && (!blocks || blocks.length === 0)) return '<p>无数据</p>';

    const dailyData = {{}};
    dateList.forEach(date => {{
      const arr = [];
      if (isTop20) {{
        const topArr = (cur.top20ByDate && cur.top20ByDate[date]) ? cur.top20ByDate[date] : [];
        topArr.forEach(x => arr.push({{name:x.name, type:x.type, avg:x.avg, chartFile:x.chartFile, board_code:x.board_code||''}}));
      }} else {{
        blocks.forEach(b => {{
          const avg = b.avgData[date];
          if (avg !== null) arr.push({{name:b.name, type:b.type, avg:avg, chartFile:b.chartFile, board_code:b.board_code||''}});
        }});
        arr.sort((a,b)=>b.avg-a.avg);
      }}
      dailyData[date] = arr;
    }});

    let maxRows = 0;
    dateList.forEach(d => maxRows = Math.max(maxRows, dailyData[d].length));
    maxRows = Math.min(maxRows, 20);

    let header = '<tr><th>序号</th>';
    dateList.forEach(d => header += `<th>${{d.slice(5)}}</th>`);
    header += '</tr>';

    let rows = '';
    for (let i=0;i<maxRows;i++) {{
      let cells = `<td class="rank-col">${{i+1}}</td>`;
      dateList.forEach(d => {{
        const arr = dailyData[d];
        if (i < arr.length) {{
          const b = arr[i];
          const tc = b.type === '行业' ? 'type-industry' : 'type-concept';
          const text = `${{b.name}} (${{b.avg.toFixed(1)}})`;
          const bc = (b.board_code || '').replace(/"/g, '&quot;');
          cells += `<td><span class="name-cell ${{tc}}" data-name="${{b.name}}" data-board-code="${{bc}}" data-trade-date="${{d}}">${{text}}</span></td>`;
        }} else cells += '<td></td>';
      }});
      rows += `<tr>${{cells}}</tr>`;
    }}
    
    const latestDate = dateList[0];
    const latestBlocks = dailyData[latestDate] || [];
    const blockListText = latestBlocks.map(b => b.name).join('、');

    const transMap = cur.transitions || {{}};
    const trans = transMap[tag] || {{ '新增': [], '退出': [] }};
    let changeHtml = '<div class="change-info">';
    if (!isTop20 && trans['新增'] && trans['新增'].length > 0) {{
      const addItems = trans['新增'].map(item => `<span class="added">↑${{item[0]}} <span class="source-dest">(${{item[1]}})</span></span>`).join(' ');
      changeHtml += `<div>新增：${{addItems}}</div>`;
    }}
    if (!isTop20 && trans['退出'] && trans['退出'].length > 0) {{
      const remItems = trans['退出'].map(item => `<span class="removed">↓${{item[0]}} <span class="source-dest">(${{item[1]}})</span></span>`).join(' ');
      changeHtml += `<div>退出：${{remItems}}</div>`;
    }}
    if (isTop20) {{
      changeHtml += '<div>说明：前20按当日综合RPS（RPS5/10/20/60/120 中有则参与）均值排序，不受分池阈值限制。</div>';
    }} else if ((!trans['新增'] || trans['新增'].length === 0) && (!trans['退出'] || trans['退出'].length === 0)) {{
      changeHtml += '<div>（与前一交易日相比无变动）</div>';
    }}
    changeHtml += '</div>';

    return `
      <div class="table-wrapper">
        <div class="${{poolColors[tag]}}"><b>${{poolTitles[tag]}}</b></div>
        <table>${{header}}${{rows}}</table>
        <div class="pool-info">
          <div class="pool-list"><strong>当前${{poolTitles[tag]}}板块：</strong>${{blockListText}}</div>
          ${{changeHtml}}
        </div>
      </div>
    `;
  }}

  function renderAllTables(startDate, endDate) {{
    let dates = getDatesInRange(startDate, endDate);
    if (dates.length === 0) {{
      document.getElementById('core-pane').innerHTML = '<p>所选范围内无数据</p>';
      document.getElementById('trend-pane').innerHTML = '';
      document.getElementById('new-pane').innerHTML = '';
      document.getElementById('top20-pane').innerHTML = '';
      return;
    }}
    dates.reverse();
    document.getElementById('core-pane').innerHTML = generateTableForPool('🔥核心', dates);
    document.getElementById('trend-pane').innerHTML = generateTableForPool('📈趋势', dates);
    document.getElementById('new-pane').innerHTML = generateTableForPool('🆕新生', dates);
    document.getElementById('top20-pane').innerHTML = generateTableForPool('🏆前20', dates);
    bindEvents();
  }}

  function bindEvents() {{
    const popPanel = document.getElementById('sector-stock-mask-panel');
    document.querySelectorAll('.name-cell').forEach(span => {{
      span.addEventListener('mouseenter', function() {{
        if (sectorLeaveTimer) {{ clearTimeout(sectorLeaveTimer); sectorLeaveTimer = null; }}
        const code = this.getAttribute('data-board-code') || '';
        const td = this.getAttribute('data-trade-date') || '';
        const nm = this.getAttribute('data-name') || '';
        scheduleSectorMask(code, td, nm, this);
      }});
      span.addEventListener('mouseleave', function(e) {{
        const rel = e.relatedTarget;
        if (rel && popPanel && (popPanel === rel || popPanel.contains(rel))) return;
        sectorLeaveTimer = setTimeout(hideSectorMask, 160);
      }});
      span.addEventListener('click', function() {{
        const name = this.getAttribute('data-name');
        document.querySelectorAll('.name-cell').forEach(x => x.closest('td').classList.remove('highlight-cell'));
        document.querySelectorAll(`.name-cell[data-name="${{name}}"]`).forEach(x => x.closest('td').classList.add('highlight-cell'));
      }});
      span.addEventListener('dblclick', function() {{
        const name = this.getAttribute('data-name');
        const cur = boardData[activeBoard];
        let block = cur.blocksCore.find(b=>b.name===name) || cur.blocksTrend.find(b=>b.name===name) || cur.blocksNew.find(b=>b.name===name);
        if (!block) {{
          const allTop = cur.top20ByDate || {{}};
          for (const d in allTop) {{
            const hit = (allTop[d] || []).find(x => x.name === name);
            if (hit) {{ block = hit; break; }}
          }}
        }}
        if (!block) return;
        window.open('charts/' + encodeURIComponent(block.chartFile || `${{name}}_${{block.type}}.html`), '_blank');
      }});
    }});
  }}

  function setupPoolTabs() {{
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(btn => btn.addEventListener('click', function() {{
      tabs.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.getElementById(this.getAttribute('data-tab') + '-pane').classList.add('active');
    }}));
  }}

  function setupBoardTabs() {{
    const tabs = document.querySelectorAll('.board-tab-button');
    tabs.forEach(btn => btn.addEventListener('click', function() {{
      tabs.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeBoard = this.getAttribute('data-board');
      updateTables();
    }}));
  }}

  function updateTables() {{
    const s = document.getElementById('startDate').value;
    const e = document.getElementById('endDate').value;
    if (s && e) renderAllTables(s, e);
  }}

  window.onload = function() {{
    setupBoardTabs();
    setupPoolTabs();
    renderAllTables('{default_start}', '{default_end}');
    const popPanel = document.getElementById('sector-stock-mask-panel');
    if (popPanel) {{
      popPanel.addEventListener('mouseenter', function() {{
        if (sectorLeaveTimer) {{ clearTimeout(sectorLeaveTimer); sectorLeaveTimer = null; }}
      }});
      popPanel.addEventListener('mouseleave', function() {{
        sectorLeaveTimer = setTimeout(hideSectorMask, 120);
      }});
    }}
    window.addEventListener('scroll', hideSectorMask, true);
    document.addEventListener('keydown', function(e) {{ if (e.key === 'Escape') hideSectorMask(); }});
  }};
</script>
</body>
</html>
"""


