# -*- coding: utf-8 -*-
import os
import re
import sys
import time
import threading
from datetime import datetime, date, timedelta

from urllib.parse import quote

from flask import Flask, make_response, send_from_directory, Response, jsonify, request

from project_config import load_project_config, get_cfg
from rps import constants as C
from trading_calendar_service import get_expected_latest_trade_date, invalidate_trade_cal_cache


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

# 动态库表版（板块 RPS 从 SQL Server 拉取，见 rps_report_final_07）
REPORT_V01_HTML_FILENAME = "RPS_多周期分析报告_v01.html"
REPORT_V01_HTML_PATH = os.path.join(REPORTS_FOLDER, REPORT_V01_HTML_FILENAME)


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

_sector_stocks_cache_lock = threading.Lock()
_sector_stocks_cache = {}
# 悬停同一板块/日期会重复命中；略延长可减少 ODBC 建连 + 查询次数
_SECTOR_STOCKS_CACHE_TTL_SEC = 60

_project_config_cache_lock = threading.Lock()
_project_config_cache: dict = {"path": None, "mtime": None, "data": None}

_odbc_sqlserver_driver_lock = threading.Lock()
_odbc_sqlserver_driver_cached: str | None = None

_board_rps_status_lock = threading.Lock()
_board_rps_status_cache: dict = {"ts": 0.0, "payload": None}
_BOARD_RPS_STATUS_TTL_SEC = 45.0


def _sqlserver_connection_params():
    """读取与 rps_report_final_06 / project_config 一致的 SQL Server 连接参数及板块 RPS 表名。"""
    cfg = load_project_config()
    host = os.environ.get("RPS_SQLSERVER_HOST", get_cfg(cfg, "sqlserver", "host", default="")).strip()
    database = os.environ.get("RPS_SQLSERVER_DB", get_cfg(cfg, "sqlserver", "database", default="")).strip()
    user = os.environ.get("RPS_SQLSERVER_USER", get_cfg(cfg, "sqlserver", "user", default="")).strip()
    password = os.environ.get("RPS_SQLSERVER_PASSWORD", get_cfg(cfg, "sqlserver", "password", default="")).strip()
    table = os.environ.get("RPS_SQLSERVER_TABLE", get_cfg(cfg, "sqlserver", "table", default="board_rps_daily")).strip() or "board_rps_daily"
    return host, database, user, password, table


def _detect_odbc_driver_sqlserver() -> str:
    try:
        import pyodbc

        preferred = [
            "ODBC Driver 17 for SQL Server",
            "ODBC Driver 18 for SQL Server",
            "ODBC Driver 13 for SQL Server",
            "SQL Server Native Client 11.0",
            "SQL Server",
        ]
        available = [x for x in pyodbc.drivers()]
        for drv in preferred:
            if drv in available:
                return drv
        for drv in available:
            if "SQL Server" in drv:
                return drv
    except Exception:
        pass
    return "ODBC Driver 17 for SQL Server"


def _cached_project_config() -> dict:
    """悬停接口高频调用：按 project_config.json 的 mtime 缓存，避免每次读盘。"""
    cfg_path = os.environ.get("RPS_CONFIG_PATH", "").strip() or os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "project_config.json"
    )
    try:
        mtime = os.path.getmtime(cfg_path)
    except OSError:
        return load_project_config()
    with _project_config_cache_lock:
        if (
            _project_config_cache.get("path") == cfg_path
            and _project_config_cache.get("mtime") == mtime
            and isinstance(_project_config_cache.get("data"), dict)
        ):
            return _project_config_cache["data"]
    data = load_project_config()
    with _project_config_cache_lock:
        _project_config_cache["path"] = cfg_path
        _project_config_cache["mtime"] = mtime
        _project_config_cache["data"] = data
    return data


def _odbc_driver_sqlserver_cached() -> str:
    """避免每次悬停请求枚举 pyodbc.drivers()。"""
    global _odbc_sqlserver_driver_cached
    if _odbc_sqlserver_driver_cached is not None:
        return _odbc_sqlserver_driver_cached
    with _odbc_sqlserver_driver_lock:
        if _odbc_sqlserver_driver_cached is None:
            _odbc_sqlserver_driver_cached = _detect_odbc_driver_sqlserver()
        return _odbc_sqlserver_driver_cached


def _safe_board_rps_table_name(name: str) -> str:
    if re.match(r"^[A-Za-z0-9_]+$", str(name or "").strip()):
        return str(name).strip()
    return "board_rps_daily"


def probe_board_rps_daily_status() -> dict:
    """
    查询 board_rps_daily 中 MAX(trade_date)，与「期望最近交易日」比较（本地星期对齐或见 trading_calendar_service），用于提示 extdata/入库是否滞后。

    结果带短 TTL 缓存，避免每次轮询都打数据库。
    """
    with _board_rps_status_lock:
        now = time.time()
        if _board_rps_status_cache["payload"] is not None and now - float(_board_rps_status_cache["ts"]) < _BOARD_RPS_STATUS_TTL_SEC:
            return dict(_board_rps_status_cache["payload"])

    host, database, user, password, table = _sqlserver_connection_params()
    safe_tbl = _safe_board_rps_table_name(table)
    today = date.today()
    expected, trade_cal_src, trade_cal_note = get_expected_latest_trade_date()
    out = {
        "board_rps_sql_enabled": bool(host and database and user and password),
        "board_rps_table": safe_tbl,
        "board_rps_calendar_today": today.isoformat(),
        "board_rps_reference_trade_date": expected.isoformat(),
        "board_rps_trade_cal_source": trade_cal_src,
        "board_rps_trade_cal_note": trade_cal_note,
        "board_rps_latest_trade_date": None,
        "board_rps_meets_expected": None,
        "board_rps_matches_today": None,
        "board_rps_user_hint": None,
        "board_rps_probe_error": None,
    }

    if not out["board_rps_sql_enabled"]:
        with _board_rps_status_lock:
            _board_rps_status_cache["ts"] = time.time()
            _board_rps_status_cache["payload"] = dict(out)
        return out

    try:
        import pyodbc

        drv = _detect_odbc_driver_sqlserver()
        conn_str = (
            f"DRIVER={{{drv}}};"
            f"SERVER={host};"
            f"DATABASE={database};"
            f"UID={user};"
            f"PWD={password};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )
        sql = f"SELECT CAST(MAX(trade_date) AS DATE) AS mx FROM dbo.[{safe_tbl}]"
        mx = None
        with pyodbc.connect(conn_str, timeout=12) as conn:
            cur = conn.cursor()
            cur.execute(sql)
            row = cur.fetchone()
            if row and row[0] is not None:
                mx = row[0]
        if mx is None:
            out["board_rps_latest_trade_date"] = None
            out["board_rps_meets_expected"] = False
            out["board_rps_matches_today"] = False
            out["board_rps_user_hint"] = (
                "数据库 board_rps_daily 暂无数据。请确认已执行报告生成（含入库），并已在通达信下载/更新 RPS 扩展数据（extdata）。"
            )
        else:
            if isinstance(mx, datetime):
                d_mx = mx.date()
            elif isinstance(mx, date):
                d_mx = mx
            else:
                d_mx = datetime.strptime(str(mx)[:10], "%Y-%m-%d").date()
            out["board_rps_latest_trade_date"] = d_mx.isoformat()
            meets = d_mx >= expected
            out["board_rps_meets_expected"] = meets
            out["board_rps_matches_today"] = d_mx == today
            if not meets:
                note_tail = (trade_cal_note or "").strip()
                src_hint = f"（{note_tail}）" if note_tail else "（期望交易日为本地星期对齐，不含法定节假日）"
                out["board_rps_user_hint"] = (
                    f"数据库最新交易日为 {d_mx.isoformat()}，早于当前期望的最近交易日 {expected.isoformat()}。"
                    "若已重新生成报告后仍如此，可能没有更新通达信 RPS 扩展数据，或入库未成功。"
                    f"{src_hint}"
                )
    except Exception as e:
        err = str(e)
        out["board_rps_probe_error"] = err[:800]
        out["board_rps_matches_today"] = None
        out["board_rps_user_hint"] = f"无法查询板块 RPS 表最新交易日：{err[:240]}"

    with _board_rps_status_lock:
        _board_rps_status_cache["ts"] = time.time()
        _board_rps_status_cache["payload"] = dict(out)
    return out


def _tsql_norm_stock_code(expr: str) -> str:
    """
    SQL Server 表达式：将各类 A 股代码样式统一为 6 位数字串，便于 sector_stocks 与 stock_rps_daily 联表。
    与 rps_report_final_06.normalize_code 语义对齐（取首个连续 6 位数字；去 .SH/.SZ/.BJ 后缀）。
    expr 须为已校验的列表达式（如 CAST(stock_code AS NVARCHAR(30))）。
    """
    x = (
        f"REPLACE(REPLACE(REPLACE(UPPER(LTRIM(RTRIM({expr}))), N'.SH', N''), N'.SZ', N''), N'.BJ', N'')"
    )
    return (
        f"(CASE WHEN PATINDEX(N'%[0-9]%', {x}) > 0 "
        f"THEN RIGHT(N'000000' + SUBSTRING({x}, PATINDEX(N'%[0-9]%', {x}), 6), 6) "
        f"ELSE {x} END)"
    )


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

        with _board_rps_status_lock:
            _board_rps_status_cache["payload"] = None
            _board_rps_status_cache["ts"] = 0.0
        invalidate_trade_cal_cache()

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
    try:
        br = probe_board_rps_daily_status()
        state.update(br)
    except Exception as e:
        state["board_rps_probe_error"] = str(e)[:500]
        state["board_rps_user_hint"] = f"板块 RPS 数据探针异常：{str(e)[:200]}"
    return jsonify(state)


@app.route("/api/runtime", methods=["GET"])
def api_runtime():
    payload = {
        "report_module": REPORT_MODULE_NAME,
        "report_file": REPORT_HTML_FILENAME,
        "generation_key": _generation_key(),
    }
    try:
        payload.update(probe_board_rps_daily_status())
    except Exception as e:
        payload["board_rps_probe_error"] = str(e)[:500]
    return jsonify(payload)


def _parse_bool_like(value, default: bool = True) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        try:
            return int(value) != 0
        except Exception:
            return default
    s = str(value).strip().lower()
    if s in ("1", "true", "yes", "on", "y", "t"):
        return True
    if s in ("0", "false", "no", "off", "n", "f"):
        return False
    return default


@app.route("/api/db/incremental/trigger", methods=["POST", "GET"])
def api_db_incremental_trigger():
    try:
        args = request.args or {}
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            body = {}

        board_raw = args.get("board") if "board" in args else body.get("board")
        stock_raw = args.get("stock") if "stock" in args else body.get("stock")
        sector_raw = args.get("sector") if "sector" in args else body.get("sector")
        trade_date_raw = args.get("trade_date") if "trade_date" in args else body.get("trade_date")
        mode_raw = args.get("mode") if "mode" in args else body.get("mode")

        include_board = _parse_bool_like(board_raw, default=True)
        include_stock = _parse_bool_like(stock_raw, default=True)
        include_sector = _parse_bool_like(sector_raw, default=True)
        trade_date = str(trade_date_raw).strip() if trade_date_raw is not None else ""
        write_mode = str(mode_raw).strip().lower() if mode_raw is not None else ""
        if write_mode and write_mode not in ("incremental", "overwrite", "full", "replace"):
            return jsonify({"ok": False, "error": f"invalid mode: {write_mode} (expected incremental|overwrite)"})
        if trade_date:
            try:
                datetime.strptime(trade_date, "%Y-%m-%d")
            except Exception:
                return jsonify({"ok": False, "error": f"invalid trade_date: {trade_date} (expected YYYY-MM-DD)"})

        print(
            f"[INC][API] trigger incremental ingest: board={include_board}, stock={include_stock}, "
            f"sector={include_sector}, trade_date={trade_date or ''}, mode={write_mode or 'incremental'}"
        )

        import importlib

        mod = importlib.import_module(REPORT_MODULE_NAME)
        if not hasattr(mod, "run_incremental_ingest"):
            return jsonify({"ok": False, "error": f"{REPORT_MODULE_NAME}.py 缺少 run_incremental_ingest()"})

        result = mod.run_incremental_ingest(
            include_board=include_board,
            include_stock=include_stock,
            include_sector=include_sector,
            trade_date=trade_date or None,
            write_mode=write_mode or None,
        )
        if isinstance(result, dict):
            return jsonify(result)
        return jsonify({"ok": False, "error": "run_incremental_ingest 返回值不是 dict"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route("/api/db/incremental/gap-backfill", methods=["POST", "GET"])
def api_db_incremental_gap_backfill():
    """
    对比 extdata 板块 RPS 与库表 trade_date，补板块差额 → 暂存差额日至 cache/last_gap_trade_dates.json
    → 成分股（当前期望交易日）→ 个股 RPS（仅差额日）。见 rps_report_final_06.run_gap_backfill_ingest。
    """
    try:
        import importlib

        mod = importlib.import_module(REPORT_MODULE_NAME)
        if not hasattr(mod, "run_gap_backfill_ingest"):
            return jsonify(
                {"ok": False, "error": f"{REPORT_MODULE_NAME}.py 缺少 run_gap_backfill_ingest()"}
            )
        result = mod.run_gap_backfill_ingest()
        if isinstance(result, dict):
            return jsonify(result)
        return jsonify({"ok": False, "error": "run_gap_backfill_ingest 返回值不是 dict"})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)})


@app.route("/api/sector-stocks", methods=["GET"])
@app.route("/api/rps-board-stocks", methods=["GET"])
def api_sector_stocks():
    """
    板块成分股（sector_stocks_daily）+ 指标表（涨幅/换手率）联查，按涨幅降序 TOP20。
    查询参数：sector_code（必填，支持 880xxx 或 880xxx.SH）、trade_date（YYYY-MM-DD，可选）。
    性能优化：
    - 单 SQL 完成「成分股 + 涨幅」联查（避免逐股查询）
    - TTL 内存缓存（悬停重复请求直接命中）
    - 指标日 / 成分股快照日解析合并为少量 SQL，减少 ODBC 往返
    - 建议索引：sector_stocks_daily(trade_date, sector_code)；stock_rps_daily(trade_date, stock_code)
    指标日期：与悬停单元格对齐，无则回退到指标表不晚于该日的最近交易日。
    成分股快照日（sector_stocks_daily.trade_date，语义为 **A 股交易日**，由入库脚本写入
    ``resolve_sector_constituents_trade_date`` 的期望最近交易日，非执行接口时的系统日历日）：
    1）若该板块在「期望最近交易日」已有成分股快照，则优先用该日（与 board_rps 对齐）；
    2）否则若单元格交易日有快照，则用该日；
    3）否则取不晚于单元格日的最近 trade_date；
    4）仍无则取该板块在表中的全局最新 trade_date。
    """
    sector_code = request.args.get("sector_code", "").strip()
    trade_date = request.args.get("trade_date", "").strip()
    if not sector_code:
        return jsonify({"ok": False, "error": "missing sector_code", "stocks": []})

    cfg = _cached_project_config()
    host = str(get_cfg(cfg, "sqlserver", "host", default="")).strip()
    db = str(get_cfg(cfg, "sqlserver", "database", default="")).strip()
    user = str(get_cfg(cfg, "sqlserver", "user", default="")).strip()
    password = str(get_cfg(cfg, "sqlserver", "password", default="")).strip()
    table = str(
        get_cfg(cfg, "sqlserver", "sector_stocks_table", default=C.DEFAULT_SQL_TABLE_SECTOR_STOCKS)
    ).strip() or C.DEFAULT_SQL_TABLE_SECTOR_STOCKS
    chg_table = str(get_cfg(cfg, "sqlserver", "stock_change_table", default="stock_rps_daily")).strip()
    chg_code_col = str(get_cfg(cfg, "sqlserver", "stock_change_code_col", default="stock_code")).strip()
    chg_name_col = str(get_cfg(cfg, "sqlserver", "stock_change_name_col", default="stock_name")).strip()
    chg_date_col = str(get_cfg(cfg, "sqlserver", "stock_change_date_col", default="trade_date")).strip()
    chg_pct_col = str(get_cfg(cfg, "sqlserver", "stock_change_pct_col", default="pct_chg")).strip()
    chg_turn_col = str(get_cfg(cfg, "sqlserver", "stock_change_turnover_col", default="turnover_rate")).strip()

    if not (host and db and user and password):
        return jsonify({"ok": False, "error": "sql 未配置", "stocks": []})

    ident_re = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")

    def _safe_ident(name: str, default: str) -> str:
        s = (name or "").strip()
        return s if ident_re.match(s) else default

    table = _safe_ident(table, C.DEFAULT_SQL_TABLE_SECTOR_STOCKS)
    chg_table = _safe_ident(chg_table, "stock_rps_daily")
    chg_code_col = _safe_ident(chg_code_col, "stock_code")
    chg_name_col = _safe_ident(chg_name_col, "stock_name")
    chg_date_col = _safe_ident(chg_date_col, "trade_date")
    chg_pct_col = _safe_ident(chg_pct_col, "pct_chg")
    chg_turn_col = _safe_ident(chg_turn_col, "turnover_rate")

    raw = sector_code.strip()
    base = raw.split(".")[0].strip()
    if base.isdigit() and len(base) > 6:
        base = base[:6]
    if base.isdigit():
        base = base.zfill(6)
    variants = [raw, base]
    if base and len(base) == 6 and base.isdigit():
        variants.extend([f"{base}.SH", f"{base}.SZ", f"{base}.BJ"])
    for part in (raw, base, sector_code):
        for m in re.findall(r"\d{6}", str(part)):
            if m not in variants:
                variants.append(m)
    variants = list(dict.fromkeys([v for v in variants if v]))
    ph = ",".join(["?"] * len(variants))
    cache_key = (
        tuple(variants),
        trade_date,
        table,
        chg_table,
        chg_code_col,
        chg_name_col,
        chg_date_col,
        chg_pct_col,
        chg_turn_col,
    )
    now_ts = time.time()
    with _sector_stocks_cache_lock:
        hit = _sector_stocks_cache.get(cache_key)
        if hit and float(hit.get("expire_at", 0)) > now_ts:
            return jsonify(hit["payload"])

    try:
        import pyodbc

        driver = _odbc_driver_sqlserver_cached()
        conn_str = (
            f"DRIVER={{{driver}}};SERVER={host};DATABASE={db};UID={user};PWD={password};"
            "Encrypt=No;TrustServerCertificate=Yes;"
        )

        def _rows(cur, sql, params):
            cur.execute(sql, params)
            return cur.fetchall()

        with pyodbc.connect(conn_str, timeout=8) as conn:
            cur = conn.cursor()
            norm_sec = _tsql_norm_stock_code("stock_code")
            norm_chg = _tsql_norm_stock_code(f"CAST({chg_code_col} AS NVARCHAR(30))")
            sec_in = "LTRIM(RTRIM(CAST(sector_code AS NVARCHAR(64))))"

            target_date = trade_date
            if not target_date:
                sql_date = f"SELECT MAX(trade_date) FROM dbo.{table} WHERE {sec_in} IN ({ph})"
                max_rows = _rows(cur, sql_date, variants)
                if max_rows and max_rows[0] and max_rows[0][0] is not None:
                    target_date = str(max_rows[0][0])

            # 指标日：与悬停单元格「交易日」对齐（优先同日）；无则取指标表中不晚于该日的最近交易日。
            # 合并为单次 COALESCE，减少 ODBC 往返。
            metric_date = date.today().isoformat()
            try:
                if target_date:
                    td = str(target_date)[:10]
                    sql_metric = (
                        f"SELECT COALESCE("
                        f"(SELECT MAX({chg_date_col}) FROM dbo.{chg_table} WHERE {chg_date_col} = CAST(? AS DATE)), "
                        f"(SELECT MAX({chg_date_col}) FROM dbo.{chg_table} WHERE {chg_date_col} <= CAST(? AS DATE)), "
                        f"(SELECT MAX({chg_date_col}) FROM dbo.{chg_table})"
                        f")"
                    )
                    mr = _rows(cur, sql_metric, [td, td])
                    if mr and mr[0] and mr[0][0] is not None:
                        metric_date = str(mr[0][0])[:10]
                else:
                    sql_gmax = f"SELECT MAX({chg_date_col}) FROM dbo.{chg_table}"
                    gmr = _rows(cur, sql_gmax, [])
                    if gmr and gmr[0] and gmr[0][0] is not None:
                        metric_date = str(gmr[0][0])[:10]
            except Exception:
                metric_date = date.today().isoformat()

            if not target_date:
                payload = {
                    "ok": True,
                    "stocks": [],
                    "sector_code": sector_code,
                    "trade_date": trade_date,
                    "target_date": "",
                    "metric_date": metric_date,
                    "table": table,
                    "change_table": chg_table,
                }
                with _sector_stocks_cache_lock:
                    _sector_stocks_cache[cache_key] = {
                        "expire_at": now_ts + _SECTOR_STOCKS_CACHE_TTL_SEC,
                        "payload": payload,
                    }
                    return jsonify(payload)

            # 成分股快照日：期望最近交易日优先 → 单元格日 → MAX<=单元格 → 全局 MAX（单次查询）。
            requested_cell_date = str(target_date)[:10]
            latest_expected_trade_str = get_expected_latest_trade_date()[0].isoformat()[:10]
            exp_s = str(latest_expected_trade_str)[:10]
            cell_s = requested_cell_date

            sector_snapshot_date = requested_cell_date
            sector_snapshot_fallback = False
            try:
                sql_pick_snap = (
                    f"SELECT CASE "
                    f"WHEN EXISTS ("
                    f"  SELECT 1 FROM dbo.{table} s WHERE {sec_in} IN ({ph}) AND s.trade_date = CAST(? AS DATE)"
                    f") THEN CAST(? AS DATE) "
                    f"WHEN EXISTS ("
                    f"  SELECT 1 FROM dbo.{table} s WHERE {sec_in} IN ({ph}) AND s.trade_date = CAST(? AS DATE)"
                    f") THEN CAST(? AS DATE) "
                    f"ELSE COALESCE("
                    f"  (SELECT MAX(s.trade_date) FROM dbo.{table} s WHERE {sec_in} IN ({ph}) AND s.trade_date <= CAST(? AS DATE)), "
                    f"  (SELECT MAX(s.trade_date) FROM dbo.{table} s WHERE {sec_in} IN ({ph}))"
                    f") END AS snap_d"
                )
                p_snap = (
                    list(variants)
                    + [exp_s, exp_s]
                    + list(variants)
                    + [cell_s, cell_s]
                    + list(variants)
                    + [cell_s]
                    + list(variants)
                )
                snap_rows = _rows(cur, sql_pick_snap, p_snap)
                if snap_rows and snap_rows[0] and snap_rows[0][0] is not None:
                    sector_snapshot_date = str(snap_rows[0][0])[:10]
                    sector_snapshot_fallback = sector_snapshot_date != cell_s
            except Exception:
                pass

            # 优先联表 stock_rps_daily.qfq_close（前复权收盘价）；旧库无该列时回退不含 qfq_close 的 SQL
            sql_join = f"""
WITH sector_rows AS (
    SELECT stock_code,
           {norm_sec} AS code_k,
           COALESCE(NULLIF(LTRIM(RTRIM(CAST(stock_name AS NVARCHAR(100)))),''), stock_code) AS sector_name
    FROM dbo.{table}
    WHERE trade_date = CAST(? AS DATE) AND {sec_in} IN ({ph})
),
chg_rows AS (
    SELECT {norm_chg} AS code_k,
           COALESCE(NULLIF(LTRIM(RTRIM(CAST({chg_name_col} AS NVARCHAR(100)))),''), CAST({chg_code_col} AS NVARCHAR(20))) AS chg_name,
           TRY_CONVERT(FLOAT, {chg_pct_col}) AS pct_chg,
           TRY_CONVERT(FLOAT, {chg_turn_col}) AS turnover_rate,
           TRY_CONVERT(FLOAT, qfq_close) AS qfq_close
    FROM dbo.{chg_table}
    WHERE {chg_date_col} = CAST(? AS DATE)
)
SELECT TOP 20 s.stock_code,
       COALESCE(NULLIF(c.chg_name,''), NULLIF(s.sector_name,''), s.stock_code) AS sn,
       c.pct_chg,
       c.turnover_rate,
       c.qfq_close
FROM sector_rows s
LEFT JOIN chg_rows c ON c.code_k = s.code_k
ORDER BY CASE WHEN c.pct_chg IS NULL THEN 1 ELSE 0 END,
         c.pct_chg DESC,
         s.stock_code ASC
"""
            sql_join_no_qfq = f"""
WITH sector_rows AS (
    SELECT stock_code,
           {norm_sec} AS code_k,
           COALESCE(NULLIF(LTRIM(RTRIM(CAST(stock_name AS NVARCHAR(100)))),''), stock_code) AS sector_name
    FROM dbo.{table}
    WHERE trade_date = CAST(? AS DATE) AND {sec_in} IN ({ph})
),
chg_rows AS (
    SELECT {norm_chg} AS code_k,
           COALESCE(NULLIF(LTRIM(RTRIM(CAST({chg_name_col} AS NVARCHAR(100)))),''), CAST({chg_code_col} AS NVARCHAR(20))) AS chg_name,
           TRY_CONVERT(FLOAT, {chg_pct_col}) AS pct_chg,
           TRY_CONVERT(FLOAT, {chg_turn_col}) AS turnover_rate
    FROM dbo.{chg_table}
    WHERE {chg_date_col} = CAST(? AS DATE)
)
SELECT TOP 20 s.stock_code,
       COALESCE(NULLIF(c.chg_name,''), NULLIF(s.sector_name,''), s.stock_code) AS sn,
       c.pct_chg,
       c.turnover_rate,
       CAST(NULL AS FLOAT) AS qfq_close
FROM sector_rows s
LEFT JOIN chg_rows c ON c.code_k = s.code_k
ORDER BY CASE WHEN c.pct_chg IS NULL THEN 1 ELSE 0 END,
         c.pct_chg DESC,
         s.stock_code ASC
"""
            rows = []
            try:
                rows = _rows(cur, sql_join, [sector_snapshot_date] + variants + [metric_date])
            except Exception:
                try:
                    rows = _rows(cur, sql_join_no_qfq, [sector_snapshot_date] + variants + [metric_date])
                except Exception:
                    rows = []

            if not rows:
                # 兼容：若换手率列不存在，回退到仅取涨幅；若涨幅源不可用，再降级成分股。
                sql_no_turnover = f"""
WITH sector_rows AS (
    SELECT stock_code,
           {norm_sec} AS code_k,
           COALESCE(NULLIF(LTRIM(RTRIM(CAST(stock_name AS NVARCHAR(100)))),''), stock_code) AS sector_name
    FROM dbo.{table}
    WHERE trade_date = CAST(? AS DATE) AND {sec_in} IN ({ph})
),
chg_rows AS (
    SELECT {norm_chg} AS code_k,
           COALESCE(NULLIF(LTRIM(RTRIM(CAST({chg_name_col} AS NVARCHAR(100)))),''), CAST({chg_code_col} AS NVARCHAR(20))) AS chg_name,
           TRY_CONVERT(FLOAT, {chg_pct_col}) AS pct_chg
    FROM dbo.{chg_table}
    WHERE {chg_date_col} = CAST(? AS DATE)
)
SELECT TOP 20 s.stock_code,
       COALESCE(NULLIF(c.chg_name,''), NULLIF(s.sector_name,''), s.stock_code) AS sn,
       c.pct_chg,
       NULL AS turnover_rate,
       CAST(NULL AS FLOAT) AS qfq_close
FROM sector_rows s
LEFT JOIN chg_rows c ON c.code_k = s.code_k
ORDER BY CASE WHEN c.pct_chg IS NULL THEN 1 ELSE 0 END,
         c.pct_chg DESC,
         s.stock_code ASC
"""
                try:
                    rows = _rows(cur, sql_no_turnover, [sector_snapshot_date] + variants + [metric_date])
                except Exception:
                    sql_fallback = f"""
SELECT TOP 20 stock_code,
       COALESCE(NULLIF(LTRIM(RTRIM(CAST(stock_name AS NVARCHAR(100)))),''), stock_code) AS sn,
       NULL AS pct_chg,
       NULL AS turnover_rate,
       CAST(NULL AS FLOAT) AS qfq_close
FROM dbo.{table}
WHERE trade_date = CAST(? AS DATE) AND {sec_in} IN ({ph})
ORDER BY stock_code
"""
                    try:
                        rows = _rows(cur, sql_fallback, [sector_snapshot_date] + variants)
                    except Exception:
                        rows = []

        stocks = []
        for r in rows[:20]:
            code = str(r[0]).strip()
            name = str(r[1]).strip() if len(r) > 1 else code
            pct = r[2] if len(r) > 2 else None
            turn = r[3] if len(r) > 3 else None
            qfq_close_raw = r[4] if len(r) > 4 else None
            pct_num = None
            pct_text = ""
            turn_num = None
            turn_text = ""
            qfq_num = None
            qfq_text = ""
            if pct is not None:
                try:
                    pct_num = float(pct)
                    pct_text = f"{pct_num:+.2f}%"
                except Exception:
                    pct_num = None
                    pct_text = ""
            if turn is not None:
                try:
                    turn_num = float(turn)
                    turn_text = f"换手 {turn_num:.2f}%"
                except Exception:
                    turn_num = None
                    turn_text = ""
            if qfq_close_raw is not None:
                try:
                    qfq_num = float(qfq_close_raw)
                    qfq_text = f"{qfq_num:.2f}"
                except Exception:
                    qfq_num = None
                    qfq_text = ""
            stocks.append(
                {
                    "code": code,
                    "name": name,
                    "chg": pct_text,
                    "chg_num": pct_num,
                    "turnover": turn_text,
                    "turnover_num": turn_num,
                    "qfq_close": qfq_text,
                    "qfq_close_num": qfq_num,
                    "qfq_price": qfq_text,
                    "qfq_price_num": qfq_num,
                    "current_price": "",
                    "current_price_num": None,
                    "text": f"{code} {name}" if name != code else code,
                }
            )

        payload = {
            "ok": True,
            "stocks": stocks,
            "sector_code": sector_code,
            "trade_date": trade_date,
            "target_date": target_date,
            "sector_snapshot_date": sector_snapshot_date,
            "sector_snapshot_fallback": sector_snapshot_fallback,
            "metric_date": metric_date,
            "table": table,
            "change_table": chg_table,
        }
        with _sector_stocks_cache_lock:
            # 简单控量，避免缓存无限增长
            if len(_sector_stocks_cache) > 300:
                _sector_stocks_cache.clear()
            _sector_stocks_cache[cache_key] = {
                "expire_at": time.time() + _SECTOR_STOCKS_CACHE_TTL_SEC,
                "payload": payload,
            }
        return jsonify(payload)
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


@app.route("/report/v01")
def report_v01():
    """板块 RPS 从数据库动态加载的 v01 报告（需 SQL Server 已入库 board_rps_daily）。"""
    if not os.path.isfile(REPORT_V01_HTML_PATH):
        return Response(
            f"未找到 {REPORT_V01_HTML_FILENAME}，请确认 reports 目录已生成该文件。",
            status=404,
            mimetype="text/plain; charset=utf-8",
        )
    resp = make_response(send_from_directory(REPORTS_FOLDER, REPORT_V01_HTML_FILENAME))
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    return resp


@app.route("/api/report/v01/meta", methods=["GET"])
def api_report_v01_meta():
    try:
        from RPS_FINAL_06.config import RpsFinal06Config
        import rps_report_final_07 as r7

        return jsonify(r7.build_v01_meta_dict(RpsFinal06Config()))
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)[:800]})


@app.route("/api/report/v01/suggest-range", methods=["GET"])
def api_report_v01_suggest_range():
    """
    根据结束日计算向前 window 个交易日（默认 project_config report.default_days）的起止，用于 v01 改结束日自动对齐开始日。
    参数：end=YYYY-MM-DD（必填），window（可选，正整数）。
    """
    try:
        from datetime import datetime as _dt

        from RPS_FINAL_06.config import RpsFinal06Config
        import rps_report_final_07 as r7

        raw_e = (request.args.get("end") or "").strip()
        if not raw_e:
            return jsonify({"ok": False, "error": "缺少 end（YYYY-MM-DD）"})
        try:
            end_d = _dt.strptime(raw_e[:10], "%Y-%m-%d").date()
        except Exception:
            return jsonify({"ok": False, "error": "end 须为 YYYY-MM-DD"})

        raw_w = (request.args.get("window") or "").strip()
        window = int(raw_w) if raw_w.isdigit() else None

        cfg = RpsFinal06Config()
        return jsonify(r7.build_v01_suggest_range_dict(cfg, end_d, window))
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)[:800]})


@app.route("/api/report/v01/data", methods=["GET"])
def api_report_v01_data():
    """
    查询参数：
    - 皆省略：库内最近 default_days 个交易日；
    - 仅 end：以结束日（对齐交易日）向前 window 个交易日（默认 default_days，可用 window= 覆盖）；
    - start + end：指定闭区间（可任意长度，便于复盘）。
    返回与 06 页 `boardData` 同构的 JSON；服务端磁盘+内存缓存。
    """
    try:
        from datetime import datetime as _dt

        from RPS_FINAL_06.config import RpsFinal06Config
        import rps_report_final_07 as r7

        raw_s = (request.args.get("start") or "").strip()
        raw_e = (request.args.get("end") or "").strip()
        raw_w = (request.args.get("window") or "").strip()
        window = int(raw_w) if raw_w.isdigit() else None

        start_d = None
        end_d = None
        if raw_s:
            try:
                start_d = _dt.strptime(raw_s[:10], "%Y-%m-%d").date()
            except Exception:
                return jsonify({"ok": False, "error": "start 须为 YYYY-MM-DD"})
        if raw_e:
            try:
                end_d = _dt.strptime(raw_e[:10], "%Y-%m-%d").date()
            except Exception:
                return jsonify({"ok": False, "error": "end 须为 YYYY-MM-DD"})

        if raw_s and not raw_e:
            return jsonify({"ok": False, "error": "仅提供 start 无效，请提供 end，或同时提供 start 与 end。"})

        cfg = RpsFinal06Config()
        payload, from_cache, fp = r7.get_v01_payload_for_request(cfg, start_d, end_d, window)
        out = dict(payload)
        out["cached"] = bool(from_cache)
        out["fingerprint"] = fp
        return jsonify(out)
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)[:1200], "cached": False})


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
    #dbHint { margin-bottom: 10px; padding: 10px 12px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; color: #856404; font-size: 13px; line-height: 1.45; display: none; }
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

  <div id="dbHint" role="status"></div>

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
        const hintEl = document.getElementById('dbHint');
        if (hintEl) {
          if (st.board_rps_user_hint) {
            hintEl.style.display = 'block';
            hintEl.textContent = st.board_rps_user_hint;
          } else {
            hintEl.style.display = 'none';
            hintEl.textContent = '';
          }
        }
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

