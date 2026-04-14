# -*- coding: utf-8 -*-
import os
import sys
import time
import threading
from datetime import datetime

from urllib.parse import quote

from flask import Flask, make_response, send_from_directory, Response, jsonify, request

from project_config import load_project_config, get_cfg
from rps import constants as C


def _workspace_root():
    cfg = load_project_config()
    return get_cfg(cfg, "paths", "workspace_root", default=os.path.dirname(os.path.abspath(__file__)))


WORKSPACE_ROOT = _workspace_root()
REPORTS_FOLDER = os.path.join(WORKSPACE_ROOT, "reports")
CHARTS_FOLDER = os.path.join(REPORTS_FOLDER, "charts")

# 主版本：rps_report_final_06（板块+个股入库；缓存 key 见该模块内 build_report_cache_key）
REPORT_MODULE_NAME = "rps_report_final_06"
REPORT_HTML_FILENAME = "RPS_多周期分析报告_06.html"
REPORT_HTML_PATH = os.path.join(REPORTS_FOLDER, REPORT_HTML_FILENAME)


def _report_html_mtime_ms() -> int:
    """报告 HTML 文件 mtime（毫秒），用于 iframe 穿透缓存；文件不存在返回 0。"""
    try:
        return int(os.path.getmtime(REPORT_HTML_PATH) * 1000)
    except OSError:
        return 0


CACHE_DIR = os.path.join(WORKSPACE_ROOT, "cache")
os.makedirs(CACHE_DIR, exist_ok=True)
REPORT_KEY_FILE = os.path.join(CACHE_DIR, "latest_report_key.txt")

# 缓存 key 与 06 内实现一致（含 extdata_1~10）
sys.path.insert(0, WORKSPACE_ROOT)
from rps_report_final_06 import build_report_cache_key as _generation_key  # noqa: E402


_job_lock = threading.Lock()

_job_state = {
    "status": "idle",  # idle/running/ready/error
    "report_key": "",
    "current_key": "",
    "error": "",
    "started_at": None,
    "finished_at": None,
}

_blockmeta_lock = threading.Lock()
_blockmeta_state = {
    "status": "idle",  # idle/running/ready/error
    "error": "",
    "started_at": None,
    "finished_at": None,
    "last_result": None,
}


def _run_blockmeta_preload():
    with _blockmeta_lock:
        _blockmeta_state["status"] = "running"
        _blockmeta_state["error"] = ""
        _blockmeta_state["started_at"] = datetime.now().isoformat(timespec="seconds")
        _blockmeta_state["finished_at"] = None
        _blockmeta_state["last_result"] = None

    try:
        sys.path.insert(0, WORKSPACE_ROOT)
        import importlib

        mod = importlib.import_module(REPORT_MODULE_NAME)
        if not hasattr(mod, "preload_block_meta_cache"):
            raise RuntimeError(f"{REPORT_MODULE_NAME} 缺少 preload_block_meta_cache()")
        result = mod.preload_block_meta_cache()

        with _blockmeta_lock:
            _blockmeta_state["status"] = "ready"
            _blockmeta_state["last_result"] = result
            _blockmeta_state["finished_at"] = datetime.now().isoformat(timespec="seconds")
            _blockmeta_state["error"] = ""
    except Exception as e:
        with _blockmeta_lock:
            _blockmeta_state["status"] = "error"
            _blockmeta_state["error"] = str(e)
            _blockmeta_state["finished_at"] = datetime.now().isoformat(timespec="seconds")


def _read_latest_key():
    try:
        with open(REPORT_KEY_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""


def _write_latest_key(key: str):
    with open(REPORT_KEY_FILE, "w", encoding="utf-8") as f:
        f.write(key)


def _run_report_generation_for_key(target_key: str):
    with _job_lock:
        _job_state["status"] = "running"
        _job_state["current_key"] = target_key
        _job_state["error"] = ""
        _job_state["started_at"] = datetime.now().isoformat(timespec="seconds")
        _job_state["finished_at"] = None
        # 保留旧 report_key，直到成功生成后更新

    try:
        # 打包成 exe 后 sys.executable 不再是 python；因此在进程内直接调用生成逻辑。
        start = time.time()
        sys.path.insert(0, WORKSPACE_ROOT)
        import importlib

        mod = importlib.import_module(REPORT_MODULE_NAME)
        if not hasattr(mod, "main"):
            raise RuntimeError(f"{REPORT_MODULE_NAME}.py 缺少 main() 函数")
        mod.main()
        _ = time.time() - start

        if not os.path.isfile(REPORT_HTML_PATH):
            raise FileNotFoundError(f"生成后未找到报告文件: {REPORT_HTML_PATH}")

        _write_latest_key(target_key)

        with _job_lock:
            _job_state["status"] = "ready"
            _job_state["report_key"] = target_key
            _job_state["current_key"] = target_key
            _job_state["finished_at"] = datetime.now().isoformat(timespec="seconds")
            _job_state["error"] = ""
    except Exception as e:
        with _job_lock:
            _job_state["status"] = "error"
            _job_state["error"] = str(e)
            _job_state["finished_at"] = datetime.now().isoformat(timespec="seconds")


def trigger_report_generation_if_needed():
    """
    根据 extdata mtime key 判断是否需要重新生成。
    需要时异步启动生成线程，并立即返回当前状态给前端。
    """
    current_key = _generation_key()
    cached_key = _read_latest_key()

    with _job_lock:
        # 正常已是最新
        if cached_key == current_key and os.path.isfile(REPORT_HTML_PATH):
            _job_state["status"] = "ready"
            _job_state["report_key"] = cached_key
            _job_state["current_key"] = current_key
            _job_state["error"] = ""
            return {
                "triggered": False,
                "needed": False,
                "status": "ready",
                "report_key": cached_key,
                "current_key": current_key,
            }

        # 已在生成（可能是同一个 key）
        if _job_state.get("status") == "running" and _job_state.get("current_key") == current_key:
            return {
                "triggered": False,
                "needed": True,
                "status": "running",
                "report_key": cached_key,
                "current_key": current_key,
            }

        # 启动新生成
        t = threading.Thread(target=_run_report_generation_for_key, args=(current_key,), daemon=True)
        t.start()
        return {
            "triggered": True,
            "needed": True,
            "status": "running",
            "report_key": cached_key,
            "current_key": current_key,
        }


app = Flask(__name__, static_folder=CHARTS_FOLDER)


@app.route("/health")
def health():
    return {"ok": True, "ts": datetime.now().isoformat(timespec="seconds")}


@app.route("/api/report/trigger", methods=["POST", "GET"])
def api_report_trigger():
    return jsonify(trigger_report_generation_if_needed())


@app.route("/api/report/status", methods=["GET"])
def api_report_status():
    cached_key = _read_latest_key()
    exists = os.path.isfile(REPORT_HTML_PATH)
    with _job_lock:
        state = dict(_job_state)
    state["cached_key"] = cached_key
    state["report_exists"] = exists
    state["report_module"] = REPORT_MODULE_NAME
    state["report_file"] = REPORT_HTML_FILENAME
    state["report_html_mtime_ms"] = _report_html_mtime_ms()
    return jsonify(state)


@app.route("/api/runtime", methods=["GET"])
def api_runtime():
    return jsonify(
        {
            "report_module": REPORT_MODULE_NAME,
            "report_file": REPORT_HTML_FILENAME,
            "generation_key": _generation_key(),
        }
    )


@app.route("/api/sector-stocks", methods=["GET"])
@app.route("/api/rps-board-stocks", methods=["GET"])
def api_sector_stocks():
    """
    板块成分股（sector_stocks_daily），供报告页 hover 蒙版使用，最多 20 条。
    查询参数：sector_code（必填，支持 880xxx 或 880xxx.SH）、trade_date（YYYY-MM-DD，可选）。
    """
    sector_code = request.args.get("sector_code", "").strip()
    trade_date = request.args.get("trade_date", "").strip()
    if not sector_code:
        return jsonify({"ok": False, "error": "missing sector_code", "stocks": []})

    cfg = load_project_config()
    host = str(get_cfg(cfg, "sqlserver", "host", default="")).strip()
    db = str(get_cfg(cfg, "sqlserver", "database", default="")).strip()
    user = str(get_cfg(cfg, "sqlserver", "user", default="")).strip()
    password = str(get_cfg(cfg, "sqlserver", "password", default="")).strip()
    table = str(
        get_cfg(cfg, "sqlserver", "sector_stocks_table", default=C.DEFAULT_SQL_TABLE_SECTOR_STOCKS)
    ).strip() or C.DEFAULT_SQL_TABLE_SECTOR_STOCKS

    if not (host and db and user and password):
        return jsonify({"ok": False, "error": "sql 未配置", "stocks": []})

    raw = sector_code.strip()
    base = raw.split(".")[0].strip()
    if base.isdigit() and len(base) > 6:
        base = base[:6]
    if base.isdigit():
        base = base.zfill(6)
    variants = [raw, base]
    if base and len(base) == 6 and base.isdigit():
        variants.extend([f"{base}.SH", f"{base}.SZ", f"{base}.BJ"])
    variants = list(dict.fromkeys([v for v in variants if v]))
    ph = ",".join(["?"] * len(variants))

    try:
        import pyodbc

        available = [x for x in pyodbc.drivers()]
        driver = next((d for d in C.ODBC_DRIVER_PREFERENCE if d in available), C.ODBC_DRIVER_FALLBACK)
        conn_str = (
            f"DRIVER={{{driver}}};SERVER={host};DATABASE={db};UID={user};PWD={password};"
            "Encrypt=No;TrustServerCertificate=Yes;"
        )

        def _rows(cur, sql, params):
            cur.execute(sql, params)
            return cur.fetchall()

        with pyodbc.connect(conn_str) as conn:
            cur = conn.cursor()
            rows = []
            if trade_date:
                sql_dt = f"""
SELECT TOP 20 stock_code,
       COALESCE(NULLIF(LTRIM(RTRIM(CAST(stock_name AS NVARCHAR(100)))),''), stock_code) AS sn
FROM dbo.{table}
WHERE trade_date = CAST(? AS DATE) AND sector_code IN ({ph})
ORDER BY stock_code
"""
                rows = _rows(cur, sql_dt, [trade_date] + variants)
            if not rows:
                sql_fb = f"""
SELECT TOP 20 stock_code,
       COALESCE(NULLIF(LTRIM(RTRIM(CAST(stock_name AS NVARCHAR(100)))),''), stock_code) AS sn
FROM dbo.{table}
WHERE sector_code IN ({ph})
ORDER BY trade_date DESC, stock_code
"""
                rows = _rows(cur, sql_fb, variants)

        stocks = []
        for r in rows[:20]:
            code = str(r[0]).strip()
            name = str(r[1]).strip() if len(r) > 1 else code
            stocks.append(
                {
                    "code": code,
                    "name": name,
                    "chg": "",
                    "text": f"{code} {name}" if name != code else code,
                }
            )

        return jsonify(
            {
                "ok": True,
                "stocks": stocks,
                "sector_code": sector_code,
                "trade_date": trade_date,
                "table": table,
            }
        )
    except Exception as e:
        return jsonify({"ok": False, "error": str(e), "stocks": []})


@app.route("/api/blockmeta/preload", methods=["POST", "GET"])
def api_blockmeta_preload():
    # 防止并发重复预热
    with _blockmeta_lock:
        if _blockmeta_state.get("status") == "running":
            return jsonify({"status": "running", "error": ""})

    t = threading.Thread(target=_run_blockmeta_preload, daemon=True)
    t.start()
    return jsonify({"status": "started"})


@app.route("/api/blockmeta/status", methods=["GET"])
def api_blockmeta_status():
    with _blockmeta_lock:
        return jsonify(dict(_blockmeta_state))


@app.route("/charts/<path:filename>")
def charts(filename):
    # 把 window.open('charts/' + chartFile) 的请求映射到这里
    resp = make_response(send_from_directory(CHARTS_FOLDER, filename))
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    return resp


@app.route("/report")
def report():
    # 允许前端用 ?key= / ?t= 做缓存穿透；查询串不影响实际返回的文件内容。
    resp = make_response(send_from_directory(REPORTS_FOLDER, REPORT_HTML_FILENAME))
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    return resp


@app.route("/")
def index():
    cfg = load_project_config()
    auto_times = get_cfg(
        cfg,
        "schedule",
        "read_tdx_rps_times",
        default=["09:25", "10:25", "11:25", "13:30", "14:30", "15:30"],
    )
    latest_key = _read_latest_key()
    mtime_ms = _report_html_mtime_ms()
    qs_parts = []
    if latest_key:
        qs_parts.append("key=" + quote(latest_key, safe=""))
    if mtime_ms:
        qs_parts.append("t=" + str(mtime_ms))
    report_url = "/report" + ("?" + "&".join(qs_parts) if qs_parts else "")

    auto_times_js = "[" + ",".join([f"'{t}'" for t in auto_times]) + "]"
    read_blocks_time = get_cfg(cfg, "schedule", "read_tdx_blocks_time", default="09:01")

    html_template = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>RPS 市场分析系统</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 16px; background: #f5f7fa; }
    .top { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 12px; }
    button { padding: 6px 14px; cursor: pointer; }
    .status { font-size: 13px; color: #333; }
    iframe { width: 100%; height: 900px; border: 1px solid #d0d7de; background: #fff; }
    code { background: #eef2f7; padding: 2px 6px; border-radius: 6px; }
    .hint { color: #666; font-size: 12px; margin-left: 6px; }
    .version-tag {
      position: fixed;
      right: 10px;
      bottom: 10px;
      z-index: 9999;
      background: rgba(31, 41, 55, 0.92);
      color: #f9fafb;
      font-size: 11px;
      line-height: 1.4;
      padding: 6px 8px;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,.2);
      max-width: 48vw;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="top">
    <div class="status" id="statusText">状态：初始化…</div>
    <div class="status">
      自动触发时间（HH:MM）：
      <code>__AUTO_TIMES__</code>
      <span class="hint">(页面打开后会自动触发；若未打开则不会触发)</span>
    </div>
    <div class="status">
      自动预热板块名称缓存时间（HH:MM）：
      <code>__BLOCKMETA_TIME__</code>
      <span class="hint">(到时间后将调用后端预热接口)</span>
    </div>
  </div>

  <iframe id="reportFrame" src="__REPORT_URL__"></iframe>
  <div id="versionTag" class="version-tag">module=__REPORT_MODULE__ | key=init</div>

  <script>
    const AUTO_TIMES = __AUTO_TIMES_JS__;
    const AUTO_BLOCKMETA_TIME = '__BLOCKMETA_TIME__';
    const POLL_MS = 10000; // 10 秒轮询一次
    let lastAutoTriggeredStamp = '';
    let lastBlockMetaTriggeredStamp = '';

    function hhmmNow() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return hh + ':' + mm;
    }

    function todayKey() {
      const d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    }

    async function trigger() {
      const r = await fetch('/api/report/trigger', { method: 'POST' });
      return await r.json();
    }

    async function loadStatus() {
      const r = await fetch('/api/report/status');
      return await r.json();
    }

    function updateIframeUrlIfReady(status) {
      const key = status.report_key || status.cached_key || '';
      const mtime = status.report_html_mtime_ms || 0;
      const iframe = document.getElementById('reportFrame');
      const qs = new URLSearchParams();
      if (key) qs.set('key', key);
      if (mtime) qs.set('t', String(mtime));
      const q = qs.toString();
      const target = q ? ('/report?' + q) : '/report';
      if (iframe.getAttribute('src') !== target) {
        iframe.setAttribute('src', target);
      }
    }

    async function tickAuto() {
      const nowHHMM = hhmmNow();
      if (!AUTO_TIMES.includes(nowHHMM)) return;
      const stamp = todayKey() + '|' + nowHHMM;
      if (lastAutoTriggeredStamp === stamp) return;
      lastAutoTriggeredStamp = stamp;
      document.getElementById('statusText').textContent = '状态：自动触发生成…';
      await trigger();
    }

    async function tickAutoBlockMetaPreload() {
      const nowHHMM = hhmmNow();
      if (nowHHMM !== AUTO_BLOCKMETA_TIME) return;
      const stamp = todayKey() + '|' + nowHHMM;
      if (lastBlockMetaTriggeredStamp === stamp) return;
      lastBlockMetaTriggeredStamp = stamp;
      document.getElementById('statusText').textContent = '状态：预热板块名称缓存…';
      await fetch('/api/blockmeta/preload', { method: 'POST' });
    }

    async function pollStatus() {
      try {
        const st = await loadStatus();
        let msg = '状态：' + st.status;
        if (st.status === 'running') msg += '（生成中…）';
        if (st.status === 'error') msg += '（失败：' + (st.error || '').slice(0, 120) + '）';
        document.getElementById('statusText').textContent = msg;
        updateIframeUrlIfReady(st);
        const tag = document.getElementById('versionTag');
        if (tag) {
          const k = st.report_key || st.cached_key || 'none';
          const m = st.report_module || '__REPORT_MODULE__';
          tag.textContent = `module=${m} | key=${k}`;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 首次加载自动触发一次，避免必须手动回车才刷新
    trigger().catch(console.error);
    pollStatus();
    setInterval(async () => {
      await tickAuto();
      await tickAutoBlockMetaPreload();
      await pollStatus();
    }, POLL_MS);
  </script>
</body>
</html>"""

    html_template = html_template.replace("__AUTO_TIMES_JS__", auto_times_js)
    html_template = html_template.replace("__AUTO_TIMES__", ",".join(auto_times))
    html_template = html_template.replace("__REPORT_URL__", report_url)
    html_template = html_template.replace("__BLOCKMETA_TIME__", read_blocks_time)
    html_template = html_template.replace("__REPORT_MODULE__", REPORT_MODULE_NAME)

    return Response(html_template, mimetype="text/html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5001"))
    print(f"[web_app] report_module={REPORT_MODULE_NAME}, report_file={REPORT_HTML_FILENAME}")
    # 开发环境建议：debug=False 避免重复生成两次
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)

