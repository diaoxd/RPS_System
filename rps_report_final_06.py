#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
RPS 多周期分析报告（06，自包含）

在单文件内实现：板块多周期 RPS 分析、HTML/图表、板块/个股 RPS 入库、
可选「板块成分股每日入库」（tqcenter，见 板块成分股每日入库服务）。
类名采用业务语义命名；不继承 rps_report_final_04/05。

输出：
- 主报告: reports/RPS_多周期分析报告_06.html
- 板块图表: reports/charts/*.html
"""

OUTPUT_FILENAME = "RPS_多周期分析报告_06.html"

import importlib.util
import itertools
import json
import os
import re
import sys
import time
from collections import defaultdict
from datetime import date, datetime

import numpy as np
import pandas as pd
import plotly.graph_objects as go
from plotly.offline import plot

from project_config import load_project_config, get_cfg

from read_tdx_blocks import load_rps_board_codes_from_tdxzs3
from trading_calendar_service import resolve_sector_constituents_trade_date

from RPS_FINAL_06.block_rps_analysis_service import normalize_board_code_for_db
from RPS_FINAL_06.sector_constituents_daily_importer import maybe_log_tq_sector_stocks_shape_once
from RPS_FINAL_06.stock_rps_qfq_merge import (
    assemble_stock_daily_db_output,
    attach_merge_qfq_for_stock_daily,
    list_stock_rps_wide_columns,
)
from RPS_FINAL_06.stock_rps_sql_writer import stock_rps_executemany_batch_size


def _parse_tdx_export_date_to_int(s: str) -> int | None:
    """通达信导出日线首列日期 → YYYYMMDD 整数。避免逐行 pd.to_datetime（极慢）。"""
    s = (s or "").strip()
    if not s:
        return None
    if " " in s:
        s = s.split()[0].strip()
    s = s.replace("/", "-")
    if len(s) >= 10 and s[4] == "-" and s[7] == "-":
        try:
            y = int(s[0:4])
            m = int(s[5:7])
            d = int(s[8:10])
            if 1990 <= y <= 2100 and 1 <= m <= 12 and 1 <= d <= 31:
                return y * 10000 + m * 100 + d
        except Exception:
            return None
    if len(s) == 8 and s.isdigit():
        v = int(s)
        if 19900000 < v < 21000000:
            return v
    return None


class 多周期报告配置:
    """
    多周期报告运行时配置（路径、报告参数、SQL Server 等）

    职责：
    - 读取 project_config.json + 环境变量，生成运行时配置对象。
    - 处理路径拼接、默认值、sys.path 注入等启动期工作。

    工作流程：
    1) 读取配置字典 _cfg
    2) 解析各类路径（分析目录、workflow、输出目录）
    3) 解析报告参数（max_days/default_days/output）
    4) 解析调度参数（读板块时间、读RPS时间）
    5) 确保输出目录存在
    """

    def __init__(self):
        self._cfg = load_project_config()

        # 路径
        self.tdx_analysis_dir = os.environ.get(
            "TDX_ANALYSIS_DIR",
            get_cfg(
                self._cfg,
                "paths",
                "tdx_analysis_dir",
                default=r"e:\个人\个人备份\Users\diaox\PycharmProjects\获取热点板块及股票\通达信板块分析",
            ),
        )
        self.project_root = os.environ.get(
            "RPS_PROJECT_ROOT",
            get_cfg(self._cfg, "paths", "rps_project_root", default=os.path.dirname(self.tdx_analysis_dir)),
        )
        self.workflow_dir = os.path.join(self.project_root, "workflow")
        self.workspace_root = get_cfg(self._cfg, "paths", "workspace_root", default=r"c:\tool\RPS市场分析系统")
        self.tdx_hq_cache_dir = str(get_cfg(self._cfg, "paths", "tdx_hq_cache_dir", default="")).strip()
        self.reports_folder = os.path.join(self.workspace_root, "reports")
        self.charts_folder = os.path.join(self.reports_folder, "charts")
        self.cache_dir = os.path.join(self.workspace_root, "cache")
        self.tdx_day_export_dir = get_cfg(
            self._cfg,
            "paths",
            "tdx_day_export_dir",
            default=r"C:\tool\Tdx MPV V1.24++\T0002\export\1day",
        )
        self.stock_code_name_mapping_csv = get_cfg(
            self._cfg,
            "paths",
            "stock_code_name_mapping_csv",
            default=os.path.join(self.workspace_root, "stock_code_name_mapping.csv"),
        )

        # 报告参数
        self.max_days = int(get_cfg(self._cfg, "report", "max_days", default=500))
        self.default_days = int(get_cfg(self._cfg, "report", "default_days", default=30))
        self.output_filename = OUTPUT_FILENAME

        # 调度参数
        self.read_tdx_blocks_time = str(get_cfg(self._cfg, "schedule", "read_tdx_blocks_time", default="09:01"))
        self.read_tdx_rps_times = get_cfg(
            self._cfg,
            "schedule",
            "read_tdx_rps_times",
            default=["09:25", "10:25", "11:25", "13:30", "14:30", "15:30"],
        )

        # 工作区必须优先于「通达信板块分析」目录，否则会错误导入旧版 Tdx_ext_data_reader（缺个股 API）。
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
            "RPS_SQLSERVER_HOST", get_cfg(self._cfg, "sqlserver", "host", default="")
        ).strip()
        self.sqlserver_db = os.environ.get(
            "RPS_SQLSERVER_DB", get_cfg(self._cfg, "sqlserver", "database", default="")
        ).strip()
        self.sqlserver_user = os.environ.get(
            "RPS_SQLSERVER_USER", get_cfg(self._cfg, "sqlserver", "user", default="")
        ).strip()
        self.sqlserver_password = os.environ.get(
            "RPS_SQLSERVER_PASSWORD", get_cfg(self._cfg, "sqlserver", "password", default="")
        ).strip()
        self.sqlserver_table = os.environ.get(
            "RPS_SQLSERVER_TABLE", get_cfg(self._cfg, "sqlserver", "table", default="board_rps_daily")
        ).strip() or "board_rps_daily"
        self.sqlserver_stock_table = os.environ.get(
            "RPS_SQLSERVER_STOCK_TABLE", get_cfg(self._cfg, "sqlserver", "stock_table", default="stock_rps_daily")
        ).strip() or "stock_rps_daily"
        self.sector_stocks_table = os.environ.get(
            "RPS_SQLSERVER_SECTOR_STOCKS_TABLE",
            get_cfg(self._cfg, "sqlserver", "sector_stocks_table", default="sector_stocks_daily"),
        ).strip() or "sector_stocks_daily"
        self.sql_incremental_keep_trade_days = max(
            1,
            int(
                os.environ.get(
                    "RPS_SQL_INCREMENTAL_KEEP_DAYS",
                    get_cfg(self._cfg, "sqlserver", "incremental_keep_trade_days", default=3),
                )
                or 3
            ),
        )
        self.sql_write_mode = self._resolve_sql_write_mode()

    def sqlserver_enabled(self) -> bool:
        return bool(self.sqlserver_host and self.sqlserver_db and self.sqlserver_user and self.sqlserver_password)

    def sector_constituents_import_enabled(self) -> bool:
        """
        是否执行「板块成分股每日入库」（需通达信已登录 + tqcenter）。
        环境变量 RPS_ENABLE_SECTOR_STOCKS_IMPORT：1/true/yes 开启，0/false 关闭；
        未设置时读 project_config.sqlserver.sector_stocks_import（默认 false）。
        """
        env = os.environ.get("RPS_ENABLE_SECTOR_STOCKS_IMPORT", "").strip().lower()
        if env in ("1", "true", "yes", "on"):
            return True
        if env in ("0", "false", "no", "off"):
            return False
        return bool(get_cfg(self._cfg, "sqlserver", "sector_stocks_import", default=False))

    def sector_stocks_use_tdxzs3_whitelist(self) -> bool:
        """
        成分股入库是否仅保留 tdxzs3.cfg 中出现的板块（hy+gn+yjhy）。

        环境变量 RPS_SECTOR_STOCKS_TDXZS3_WHITELIST：1/true 开、0/false 关；
        未设置时读 sqlserver.sector_stocks_use_tdxzs3_whitelist，默认 True。
        """
        env = os.environ.get("RPS_SECTOR_STOCKS_TDXZS3_WHITELIST", "").strip().lower()
        if env in ("0", "false", "no", "off"):
            return False
        if env in ("1", "true", "yes", "on"):
            return True
        return bool(get_cfg(self._cfg, "sqlserver", "sector_stocks_use_tdxzs3_whitelist", default=True))

    def _resolve_sql_write_mode(self) -> str:
        """
        SQL 写入模式：
        - incremental（默认）：仅插入不存在的 (trade_date, code)
        - overwrite：按日期区间删除后重写（历史兼容行为）
        """
        raw = os.environ.get(
            "RPS_SQL_WRITE_MODE",
            get_cfg(self._cfg, "sqlserver", "write_mode", default="incremental"),
        )
        s = str(raw or "").strip().lower()
        if s in ("overwrite", "full", "replace"):
            return "overwrite"
        return "incremental"

    def sql_write_mode_is_overwrite(self) -> bool:
        return self.sql_write_mode == "overwrite"

    @staticmethod
    def trim_df_to_recent_trade_days(df: pd.DataFrame, keep_days: int, label: str) -> pd.DataFrame:
        """
        增量写库前仅保留最近 N 个交易日候选，避免将整窗历史（数十万/数百万行）重复灌入临时表。
        历史缺口由 gap-backfill 专门处理。
        """
        if df is None or df.empty or "trade_date" not in df.columns:
            return df
        days = sorted(df["trade_date"].dropna().unique())
        if len(days) <= keep_days:
            return df
        keep_set = set(days[-keep_days:])
        out = df[df["trade_date"].isin(keep_set)].copy()
        print(
            f"[INC][{label}] 候选按最近交易日裁剪: {len(df)} -> {len(out)} "
            f"(keep_days={keep_days}, range={min(keep_set)}~{max(keep_set)})"
        )
        return out


def _sector_code_passes_tdxzs3_whitelist(db_code: str, *, use_whitelist: bool, whitelist: set[str]) -> bool:
    if not db_code:
        return False
    if not use_whitelist:
        return True
    if whitelist:
        return db_code in whitelist
    return db_code.startswith("880") or db_code.startswith("881")


class 板块Rps分析服务:
    """
    RPS 报告业务处理类（纯业务层，不负责页面字符串拼接）

    该类负责“数据获取、缓存、清洗、分池分析”的全部业务过程。

    工作流程：
    1) 从扩展数据读取板块 RPS 宽表
    2) 从 block 库读取 code->name/type（支持落盘缓存）
    3) 组装报告分析长表
    4) 将长表按 880/881 拆为行业/概念两套数据
    5) 对每套数据执行分池、历史结构化、变动分析
    """

    BLOCK_DB_TYPE_LABEL = {"hy": "行业", "gn": "概念", "yjhy": "一级行业"}

    def __init__(self, config: 多周期报告配置):
        """
        初始化业务服务

        参数：
        - config: 应用配置对象
        """
        self.cfg = config
        # code 规范化结果缓存：同一个 code 在一次构建流程中只计算一次
        self._norm_cache = {}
        self._stock_mapping_cache = None

    def _workspace_tdx_ext_module(self):
        """从工作区根目录加载 Tdx_ext_data_reader.py，避免 sys.path 上同名旧文件抢先。"""
        path = os.path.join(self.cfg.workspace_root, "Tdx_ext_data_reader.py")
        if not os.path.isfile(path):
            raise FileNotFoundError(f"未找到工作区扩展数据模块: {path}")
        spec = importlib.util.spec_from_file_location("tdx_ext_data_reader_workspace_06", path)
        if spec is None or spec.loader is None:
            raise ImportError(f"无法加载: {path}")
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return mod

    def load_merged_rps(self, base_dir=None) -> pd.DataFrame:
        """
        加载扩展数据中的 RPS 宽表。

        功能说明：
        - 调用 `Tdx_ext_data_reader.load_all_rps_merged` 获取 code/date/RPS*。
        - 所有 RPS 值归一化到 0-100。

        返回：
        - DataFrame，列至少包含: code, date, RPS120, RPS60, RPS20, RPS5
        """
        mod = self._workspace_tdx_ext_module()
        ext_dir = base_dir or getattr(mod, "DEFAULT_EXTDATA_DIR", None)
        return mod.load_all_rps_merged(base_dir=ext_dir, scale_0_100=True)

    def normalize_code(self, code) -> str:
        """
        统一板块代码格式，确保后续匹配稳定。

        处理规则：
        - 空值 -> ''
        - 非空转字符串并去空白
        - 超过 6 位只保留前 6 位
        - 不足 6 位左侧补 0
        """
        key = "" if pd.isna(code) else str(code)
        cached = self._norm_cache.get(key)
        if cached is not None:
            return cached

        norm = normalize_board_code_for_db(code)
        self._norm_cache[key] = norm
        return norm

    def classify_board_group(self, code: str, board_type: str = "") -> str:
        """
        按板块代码归类到“行业板块/概念板块”。

        分类规则：
        - 880xxx -> 行业板块
        - 881xxx -> 概念板块
        - 其余前缀 -> 其他板块（不参与行业/概念视图）
        """
        c = self.normalize_code(code)
        if c.startswith("880"):
            return "概念板块"
        if c.startswith("881"):
            return "行业板块"
        return "其他板块"

    def resolve_block_db_path(self) -> str:
        """
        解析 block 数据库路径（带优先级）。

        优先级：
        1) 环境变量 TDX_BLOCKS_DB
        2) 配置 paths.tdx_blocks_db
        3) workflow/tdx_blocks.db
        4) 当前脚本目录 tdx_blocks.db
        """
        env = os.environ.get("TDX_BLOCKS_DB", "").strip()
        cfg_db = get_cfg(self.cfg._cfg, "paths", "tdx_blocks_db", default="")

        for p in (env, cfg_db):
            if p and os.path.isfile(p):
                return p

        for p in (
            os.path.join(self.cfg.workflow_dir, "tdx_blocks.db"),
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "tdx_blocks.db"),
        ):
            if os.path.isfile(p):
                return p
        return os.path.join(self.cfg.workflow_dir, "tdx_blocks.db")

    def block_meta_cache_path(self, db_path: str) -> str:
        """
        生成 block 元数据缓存文件路径。

        设计思路：
        - 使用 db 文件 mtime 参与命名，库更新后自动使用新缓存文件。
        """
        try:
            mt_ms = int(os.path.getmtime(db_path) * 1000)
        except OSError:
            mt_ms = 0
        return os.path.join(self.cfg.cache_dir, f"block_meta_cache_{mt_ms}.json")

    def load_all_block_meta_from_db(self, db_path: str) -> dict:
        """
        全量读取 block 表并构建 code->name/type 映射。

        处理细节：
        - 代码归一化到 6 位
        - 同一 code 存在多条时保留最新 date
        - type 从 hy/gn/yjhy 映射为中文
        """
        from read_tdx_blocks import TdxBlockDb

        db = TdxBlockDb(db_path)
        try:
            df = db.get_blocks(block_type=None, as_dataframe=True)
        finally:
            db.close()

        if df is None or df.empty:
            return {}

        work = df.copy()
        work["_c"] = work["code"].apply(self.normalize_code)
        work = work.sort_values("date", ascending=False).drop_duplicates(subset=["_c"], keep="first")

        meta = {}
        for _, row in work.iterrows():
            c = row["_c"]
            if not c:
                continue
            name = str(row["name"]).strip() if pd.notna(row.get("name")) else c
            raw_t = str(row["type"]).strip() if pd.notna(row.get("type")) else ""
            meta[c] = {"name": name or c, "type": self.BLOCK_DB_TYPE_LABEL.get(raw_t, raw_t or "")}
        return meta

    def preload_block_meta_cache(self) -> dict:
        """
        主动预热 block 元数据缓存（供 web 定时预热调用）。

        返回：
        - dict，包含 cache_path / cached / count 等信息
        """
        db_path = self.resolve_block_db_path()
        if not os.path.isfile(db_path):
            raise FileNotFoundError(f"block 库不存在: {db_path}")

        cache_path = self.block_meta_cache_path(db_path)
        if os.path.isfile(cache_path):
            return {"cache_path": cache_path, "cached": True}

        meta = self.load_all_block_meta_from_db(db_path)
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, ensure_ascii=False)
        return {"cache_path": cache_path, "cached": True, "count": len(meta)}

    def load_block_meta_for_codes(self, codes) -> tuple[dict, int]:
        """
        为 extdata 出现的代码加载名称映射（缓存优先）。

        参数：
        - codes: 代码序列（可重复）

        返回：
        - code_to_meta: dict，归一化 code -> name/type
        - n_hit_db: 命中数据库映射的数量
        """
        norm_set = set()
        for c in codes:
            n = self.normalize_code(c)
            if n:
                norm_set.add(n)
        norm_list = sorted(norm_set)
        if not norm_list:
            return {}, 0

        db_path = self.resolve_block_db_path()
        if not os.path.isfile(db_path):
            fallback = {c: {"name": c, "type": ""} for c in norm_list}
            return fallback, 0

        cache_path = self.block_meta_cache_path(db_path)
        if os.path.isfile(cache_path):
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    all_meta = json.load(f)
            except Exception:
                all_meta = self.load_all_block_meta_from_db(db_path)
                with open(cache_path, "w", encoding="utf-8") as f:
                    json.dump(all_meta, f, ensure_ascii=False)
        else:
            all_meta = self.load_all_block_meta_from_db(db_path)
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(all_meta, f, ensure_ascii=False)

        code_to_meta = {c: all_meta.get(c, {"name": c, "type": ""}) for c in norm_list}
        n_hit_db = sum(
            1
            for c in norm_list
            if c in all_meta and all_meta[c].get("name") and all_meta[c].get("name") != c
        )
        return code_to_meta, n_hit_db

    def build_analysis_df(self, merged_df: pd.DataFrame, code_to_meta: dict) -> pd.DataFrame:
        """
        将 ext 宽表和代码映射合并为分析长表。

        逻辑：
        - 仅保留映射中存在的 code
        - 仅保留最近 max_days 的日期
        - 每行转成: 代码/名称/类型/日期/RPS120/60/20/5
        """
        if merged_df is None or merged_df.empty or not code_to_meta:
            return pd.DataFrame()

        rps_cols = [c for c in ("RPS120", "RPS60", "RPS20", "RPS5") if c in merged_df.columns]
        if not rps_cols:
            return pd.DataFrame()

        work = merged_df.copy()
        work["_c"] = work["code"].apply(self.normalize_code)
        work = work[work["_c"].isin(code_to_meta)]
        if work.empty:
            return pd.DataFrame()

        all_dates = sorted(work["date"].unique())[-self.cfg.max_days :]
        work = work[work["date"].isin(all_dates)]

        rows = []
        for _, row in work.iterrows():
            c = row["_c"]
            d = int(row["date"]) if pd.notna(row["date"]) else None
            if d is None:
                continue
            meta = code_to_meta.get(c, {"name": c, "type": ""})

            item = {
                "代码": c,
                "名称": meta["name"],
                "类型": meta["type"],
                "日期": datetime.strptime(str(d), "%Y%m%d").date(),
            }
            for col in rps_cols:
                v = row[col] if col in row.index else None
                item[col] = None if pd.isna(v) else round(float(v), 1)

            if any(item.get(col) is not None for col in rps_cols):
                rows.append(item)

        return pd.DataFrame(rows)

    def identify_pools(self, day_df: pd.DataFrame) -> dict:
        """
        单日分池规则：核心/趋势/新生。

        返回：
        - dict: 板块名称 -> 池标签
        """
        core_cond = (
            (day_df["RPS120"] > 90)
            & (day_df["RPS60"] > 90)
            & (day_df["RPS20"] > 85)
            & (day_df["RPS5"] > 85)
        )
        new_cond = (day_df["RPS20"] > 90) & (day_df["RPS5"] > 95) & (day_df["RPS120"] < 80)
        trend_cond = (day_df["RPS60"] > 90) & (day_df["RPS20"] > 85)

        core_blocks = set(day_df[core_cond]["名称"])
        new_blocks = set(day_df[new_cond & ~core_cond]["名称"])
        trend_blocks = set(day_df[trend_cond & ~core_cond & ~new_cond]["名称"])

        m = {}
        for n in core_blocks:
            m[n] = "🔥核心"
        for n in trend_blocks:
            m[n] = "📈趋势"
        for n in new_blocks:
            m[n] = "🆕新生"
        return m

    def get_detailed_transitions(self, df_all: pd.DataFrame) -> dict:
        """
        计算最新两日的池子变动（新增/退出）。

        返回：
        - dict: {池标签: {'新增': [...], '退出': [...]}}
        """
        dates = sorted(df_all["日期"].unique())
        if len(dates) < 2:
            return {}

        latest_date, prev_date = dates[-1], dates[-2]
        latest_pools = self.identify_pools(df_all[df_all["日期"] == latest_date])
        prev_pools = self.identify_pools(df_all[df_all["日期"] == prev_date])

        all_names = set(latest_pools.keys()) | set(prev_pools.keys())
        result = {}
        for name in all_names:
            prev_tag = prev_pools.get(name)
            curr_tag = latest_pools.get(name)

            if curr_tag is not None:
                result.setdefault(curr_tag, {"新增": [], "退出": []})
                if prev_tag is None:
                    result[curr_tag]["新增"].append((name, "新晋"))
                elif prev_tag != curr_tag:
                    result[curr_tag]["新增"].append((name, f"来自{prev_tag}"))

            if prev_tag is not None:
                result.setdefault(prev_tag, {"新增": [], "退出": []})
                if curr_tag is None:
                    result[prev_tag]["退出"].append((name, "退出池子"))
                elif curr_tag != prev_tag:
                    result[prev_tag]["退出"].append((name, f"去向{curr_tag}"))

        return result

    def prepare_historical_data(self, df_all: pd.DataFrame) -> tuple[dict, list, dict, dict]:
        """
        将分析长表整理为前端渲染结构。

        输出：
        - blocks_by_tag: 每个池的板块历史数据
        - all_dates_str: 日期字符串数组
        - latest_pool_map: 最新日期分池映射
        - transitions: 最新两日池子变动
        """
        if df_all is None or df_all.empty:
            return {"🔥核心": [], "📈趋势": [], "🆕新生": []}, [], {}, {}

        all_dates = sorted(df_all["日期"].unique())
        all_dates_str = [d.strftime("%Y-%m-%d") for d in all_dates]

        pool_members_by_date = {}
        for d in all_dates:
            one_day = df_all[df_all["日期"] == d]
            pool_map = self.identify_pools(one_day)
            by_tag = defaultdict(set)
            for n, tag in pool_map.items():
                by_tag[tag].add(n)
            pool_members_by_date[d] = by_tag

        pool_blocks = defaultdict(set)
        for by_tag in pool_members_by_date.values():
            for tag, names in by_tag.items():
                pool_blocks[tag].update(names)

        # 名称 -> 板块代码（取每个名称最新一日，供前端 hover 拉成分股）
        name_to_code: dict[str, str] = {}
        if "代码" in df_all.columns and "名称" in df_all.columns:
            _last = df_all.sort_values("日期").drop_duplicates(subset=["名称"], keep="last")
            for _, r in _last.iterrows():
                name_to_code[str(r["名称"])] = self.normalize_code(r.get("代码", ""))

        block_avg_raw = defaultdict(dict)
        block_type = {}
        for n in set().union(*pool_blocks.values()):
            sub = df_all[df_all["名称"] == n].set_index("日期")
            if not sub.empty:
                block_type[n] = sub["类型"].iloc[0]
            for d in all_dates:
                ds = d.strftime("%Y-%m-%d")
                if d in sub.index:
                    row = sub.loc[d]
                    avg = (row["RPS5"] + row["RPS20"] + row["RPS60"] + row["RPS120"]) / 4.0
                    block_avg_raw[n][ds] = round(avg, 1)
                else:
                    block_avg_raw[n][ds] = None

        blocks_by_tag = {}
        for tag, names in pool_blocks.items():
            blocks = []
            for n in names:
                avg_data = {}
                for d in all_dates:
                    ds = d.strftime("%Y-%m-%d")
                    belongs = (
                        d in pool_members_by_date
                        and tag in pool_members_by_date[d]
                        and n in pool_members_by_date[d][tag]
                    )
                    avg_data[ds] = block_avg_raw[n][ds] if belongs else None
                blocks.append(
                    {
                        "name": n,
                        "type": block_type.get(n, ""),
                        "board_code": name_to_code.get(n, ""),
                        "avgData": avg_data,
                    }
                )
            blocks_by_tag[tag] = blocks

        latest_date = all_dates[-1]
        latest_pool_map = self.identify_pools(df_all[df_all["日期"] == latest_date])
        transitions = self.get_detailed_transitions(df_all)
        return blocks_by_tag, all_dates_str, latest_pool_map, transitions

    def build_report_context(self) -> dict:
        """
        组装报告所需完整上下文（应用层直接消费）。

        返回 context 字典，包含：
        - 行业/概念分组后的 blocks/date/transitions/latestMap
        - 默认展示日期范围
        - 原始合并长表（供图表生成）
        """
        t0 = time.perf_counter()
        t_prev = t0

        def _mark(stage: str):
            nonlocal t_prev
            now = time.perf_counter()
            print(f"[TIMER][context] {stage}: +{now - t_prev:.3f}s (total {now - t0:.3f}s)")
            t_prev = now

        # 每轮构建前清空一次，避免缓存无限累积
        self._norm_cache.clear()
        merged_rps = self.load_merged_rps()
        _mark("load_merged_rps")
        if merged_rps is None or merged_rps.empty:
            raise RuntimeError("未读取到扩展数据，请检查 extdata 目录")

        code_to_meta, n_hit = self.load_block_meta_for_codes(merged_rps["code"].unique())
        _mark("load_block_meta_for_codes")
        analysis_df = self.build_analysis_df(merged_rps, code_to_meta)
        _mark("build_analysis_df")
        if analysis_df.empty:
            raise RuntimeError("扩展数据与 block 映射未对齐，无法生成分析表")

        analysis_df["板块大类"] = analysis_df.apply(
            lambda r: self.classify_board_group(r.get("代码", ""), r.get("类型", "")),
            axis=1,
        )
        _mark("classify_board_group_apply")
        industry_df = analysis_df[analysis_df["板块大类"] == "行业板块"].copy()
        concept_df = analysis_df[analysis_df["板块大类"] == "概念板块"].copy()
        _mark("split_industry_concept")

        def _top20_by_date(df_sub: pd.DataFrame) -> dict:
            out = {}
            if df_sub is None or df_sub.empty:
                return out
            for d in sorted(df_sub["日期"].unique()):
                one = df_sub[df_sub["日期"] == d].copy()
                if one.empty:
                    out[d.strftime("%Y-%m-%d")] = []
                    continue
                one["avg"] = (one["RPS5"] + one["RPS20"] + one["RPS60"] + one["RPS120"]) / 4.0
                one = one.sort_values("avg", ascending=False).head(20)
                out[d.strftime("%Y-%m-%d")] = [
                    {
                        "name": r["名称"],
                        "type": r["类型"],
                        "avg": round(float(r["avg"]), 1),
                        "board_code": self.normalize_code(r["代码"]) if "代码" in one.columns else "",
                    }
                    for _, r in one.iterrows()
                ]
            return out

        ind_blocks, ind_dates, ind_latest, ind_trans = self.prepare_historical_data(industry_df)
        _mark("prepare_historical_data_industry")
        con_blocks, con_dates, con_latest, con_trans = self.prepare_historical_data(concept_df)
        _mark("prepare_historical_data_concept")

        base_dates = ind_dates if ind_dates else con_dates
        if not base_dates:
            raise RuntimeError("行业和概念均无可用日期")
        default_end = base_dates[-1]
        default_start = base_dates[0] if len(base_dates) <= self.cfg.default_days else base_dates[-self.cfg.default_days]

        out = {
            "n_hit_db": n_hit,
            "analysis_df": analysis_df,
            "industry": {
                "blocks_by_tag": ind_blocks,
                "all_dates": ind_dates,
                "latest_pool_map": ind_latest,
                "transitions": ind_trans,
                "top20_by_date": _top20_by_date(industry_df),
            },
            "concept": {
                "blocks_by_tag": con_blocks,
                "all_dates": con_dates,
                "latest_pool_map": con_latest,
                "transitions": con_trans,
                "top20_by_date": _top20_by_date(concept_df),
            },
            "default_start": default_start,
            "default_end": default_end,
        }
        _mark("build_report_context_done")
        return out

    def build_board_daily_db_frame(self, context: dict) -> pd.DataFrame:
        """将 analysis_df 规范为板块日频入库表（与 SQL 表 board_rps_daily 对齐）。"""
        df = context.get("analysis_df")
        if df is None or df.empty:
            return pd.DataFrame()

        work = df.copy()
        if "板块大类" not in work.columns:
            work["板块大类"] = work.apply(
                lambda r: self.classify_board_group(r.get("代码", ""), r.get("类型", "")),
                axis=1,
            )
        work = work[work["板块大类"].isin(["行业板块", "概念板块"])].copy()
        if work.empty:
            return pd.DataFrame()

        def _pick_col(name: str):
            return work[name] if name in work.columns else None

        out = pd.DataFrame(
            {
                "trade_date": pd.to_datetime(work["日期"]).dt.date,
                "board_code": work["代码"].map(normalize_board_code_for_db),
                "board_name": work["名称"].astype(str),
                "board_group": work["板块大类"].astype(str),
                "board_type": work["类型"].astype(str),
                "rps5": _pick_col("RPS5"),
                "rps10": _pick_col("RPS10"),
                "rps20": _pick_col("RPS20"),
                "rps60": _pick_col("RPS60"),
                "rps120": _pick_col("RPS120"),
                "rps250": _pick_col("RPS250"),
            }
        )

        for c in ("rps5", "rps10", "rps20", "rps60", "rps120", "rps250"):
            if c in out.columns:
                out[c] = pd.to_numeric(out[c], errors="coerce")

        out = out.drop_duplicates(subset=["trade_date", "board_code"], keep="last")
        return out

    def load_stock_name_map(self) -> dict:
        """从 tdx_blocks.db 的 stock_industry 取证券简称（按 date 最新一条）。"""
        db_path = self.resolve_block_db_path()
        if not os.path.isfile(db_path):
            return {}

        from read_tdx_blocks import TdxBlockDb

        db = TdxBlockDb(db_path)
        try:
            df = db.get_stock_industry()
        finally:
            db.close()

        if df is None or df.empty:
            return {}

        work = df.copy()
        work["_c"] = work["code"].apply(self.normalize_code)
        work = work[work["_c"] != ""]
        if "date" in work.columns:
            work = work.sort_values("date", ascending=False)
        work = work.drop_duplicates(subset=["_c"], keep="first")

        out = {}
        for _, row in work.iterrows():
            c = row["_c"]
            raw = row.get("name")
            nm = str(raw).strip() if pd.notna(raw) else ""
            out[c] = nm if nm else c
        return out

    def _normalize_stock_code6(self, code: str) -> str:
        s = "" if code is None else str(code).strip().upper()
        if not s:
            return ""
        if len(s) > 6 and s[-6:].isdigit():
            return s[-6:]
        if s.isdigit():
            return s.zfill(6)
        return ""

    def load_stock_code_name_mapping(self) -> dict:
        """读取 stock_code_name_mapping.csv，返回 6 位 code -> 中文名。"""
        if self._stock_mapping_cache is not None:
            return self._stock_mapping_cache

        path = self.cfg.stock_code_name_mapping_csv
        out = {}
        if not os.path.isfile(path):
            self._stock_mapping_cache = out
            return out
        df = None
        last_err = None
        for enc in ("utf-8-sig", "utf-8", "gbk"):
            try:
                df = pd.read_csv(path, encoding=enc)
                break
            except Exception as e:
                last_err = e
        if df is None:
            print(f"[QFQ] 读取映射失败: {last_err}")
            self._stock_mapping_cache = out
            return out

        if {"stock_code", "stock_name"}.issubset(df.columns):
            for _, r in df.iterrows():
                c6 = self._normalize_stock_code6(r.get("stock_code"))
                if not c6:
                    continue
                nm = str(r.get("stock_name")).strip() if pd.notna(r.get("stock_name")) else ""
                if nm:
                    out[c6] = nm
        self._stock_mapping_cache = out
        return out

    def load_qfq_daily_metrics(self, target_codes: set[str], target_dates: set[int]) -> pd.DataFrame:
        """
        从前复权导出目录提取个股日线指标（按目标 code/date 裁剪）。

        返回列：
        - code6: 6 位代码
        - date: YYYYMMDD 整数
        - stock_name_qfq: 名称（优先 mapping）
        - pct_chg: 涨幅（%）
        """
        src = self.cfg.tdx_day_export_dir
        if not os.path.isdir(src) or not target_codes or not target_dates:
            return pd.DataFrame()

        pat = re.compile(r"^(BJ|SH|SZ)#(\d{6})", re.IGNORECASE)
        mapping = self.load_stock_code_name_mapping()
        rows = []
        t0 = time.perf_counter()
        processed = 0
        td = target_dates

        for fn in os.listdir(src):
            m = pat.match(fn)
            if not m:
                continue
            code6 = m.group(2)
            if code6 not in target_codes:
                continue
            fp = os.path.join(src, fn)
            try:
                with open(fp, "r", encoding="gbk", errors="ignore") as f:
                    lines = [x.strip() for x in f if x.strip()]
            except Exception:
                continue
            if len(lines) < 3:
                continue

            first_parts = lines[0].split()
            fallback_name = first_parts[1].strip() if len(first_parts) >= 2 else code6
            stock_name = mapping.get(code6, fallback_name)

            d_ints: list[int] = []
            closes: list[float] = []
            for raw in lines[2:]:
                parts = [x.strip() for x in raw.split(",")]
                if len(parts) < 5:
                    continue
                di = _parse_tdx_export_date_to_int(parts[0])
                if di is None:
                    continue
                try:
                    close = float(parts[4])
                except Exception:
                    continue
                d_ints.append(di)
                closes.append(close)

            if not d_ints:
                continue

            d_arr = np.asarray(d_ints, dtype=np.int64)
            c_arr = np.asarray(closes, dtype=np.float64)
            prev = np.empty_like(c_arr)
            prev[0] = np.nan
            prev[1:] = c_arr[:-1]
            with np.errstate(divide="ignore", invalid="ignore"):
                pct = np.where((prev == 0) | np.isnan(prev), 0.0, (c_arr - prev) / prev * 100.0)

            for i in range(len(d_arr)):
                d_int = int(d_arr[i])
                if d_int not in td:
                    continue
                rows.append(
                    {
                        "code6": code6,
                        "date": d_int,
                        "stock_name_qfq": stock_name,
                        "pct_chg": round(float(pct[i]), 2),
                    }
                )

            processed += 1
            if processed % 200 == 0:
                print(
                    f"[QFQ] 已处理前复权文件 {processed} 个，"
                    f"累计行 {len(rows)}，用时 {time.perf_counter() - t0:.1f}s …"
                )

        if processed:
            print(
                f"[QFQ] 前复权完成：文件 {processed} 个，输出行 {len(rows)}，"
                f"用时 {time.perf_counter() - t0:.1f}s"
            )

        if not rows:
            return pd.DataFrame()
        df = pd.DataFrame(rows)
        df = df.sort_values(["code6", "date"]).drop_duplicates(subset=["code6", "date"], keep="last")
        return df

    def build_stock_daily_db_frame(self) -> pd.DataFrame:
        """读取 extdata 个股 RPS（含 extdata_11 换手率），与前复权 OHLCV 合并后，再组装入库 DataFrame。"""
        mod = self._workspace_tdx_ext_module()
        ext_dir = getattr(mod, "DEFAULT_EXTDATA_DIR", None)
        t_m = time.perf_counter()
        merged = mod.load_all_stock_rps_merged(base_dir=ext_dir, scale_0_100=True)
        print(
            f"[STOCK-DB] load_all_stock_rps_merged: {time.perf_counter() - t_m:.1f}s, 行数={0 if merged is None else len(merged)}"
        )
        if merged is None or merged.empty:
            return pd.DataFrame()

        rps_cols = list_stock_rps_wide_columns(merged)
        if not rps_cols:
            return pd.DataFrame()

        t_pipe = time.perf_counter()
        work = attach_merge_qfq_for_stock_daily(
            merged,
            normalize_code_fn=self.normalize_code,
            max_days=self.cfg.max_days,
            export_dir=self.cfg.tdx_day_export_dir,
            code_to_name=self.load_stock_code_name_mapping(),
        )
        print(
            f"[STOCK-DB] rps+换手率+前复权 合并: {time.perf_counter() - t_pipe:.1f}s, "
            f"股票数={work['_c'].nunique() if not work.empty else 0}, 行数={len(work)}"
        )
        if work.empty:
            return pd.DataFrame()

        name_map = self.load_stock_name_map()
        mapping_name_map = self.load_stock_code_name_mapping()

        t_asm = time.perf_counter()
        out = assemble_stock_daily_db_output(
            work,
            rps_cols,
            mapping_name_map=mapping_name_map,
            name_map=name_map,
        )
        print(f"[STOCK-DB] assemble output: {time.perf_counter() - t_asm:.1f}s, 行数={len(out)}")
        return out


class 板块Rps数据库写入:
    """板块日频 RPS 写入 SQL Server。"""

    def __init__(self, cfg: 多周期报告配置):
        self.cfg = cfg
        self.driver = self._detect_odbc_driver()
        self.table_name = cfg.sqlserver_table
        self.conn_str = (
            f"DRIVER={{{self.driver}}};"
            f"SERVER={cfg.sqlserver_host};"
            f"DATABASE={cfg.sqlserver_db};"
            f"UID={cfg.sqlserver_user};"
            f"PWD={cfg.sqlserver_password};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )

    @staticmethod
    def _detect_odbc_driver() -> str:
        preferred = [
            "ODBC Driver 17 for SQL Server",
            "ODBC Driver 18 for SQL Server",
            "ODBC Driver 13 for SQL Server",
            "SQL Server Native Client 11.0",
            "SQL Server Native Client 10.0",
            "SQL Server",
        ]
        try:
            import pyodbc

            available = [x for x in pyodbc.drivers()]
            for drv in preferred:
                if drv in available:
                    print(f"[DB] 使用 ODBC 驱动: {drv}")
                    return drv
            for drv in available:
                if "SQL Server" in drv:
                    print(f"[DB] 使用 ODBC 驱动: {drv}")
                    return drv
        except Exception as e:
            print(f"[DB] 探测 ODBC 驱动失败: {e}")
        return "ODBC Driver 17 for SQL Server"

    def write_daily_rps(self, df: pd.DataFrame) -> int:
        if df is None or df.empty:
            return 0

        import math
        import pyodbc

        create_sql = f"""
IF OBJECT_ID(N'dbo.{self.table_name}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{self.table_name} (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        board_code NVARCHAR(16) NOT NULL,
        board_name NVARCHAR(128) NOT NULL,
        board_group NVARCHAR(16) NOT NULL,
        board_type NVARCHAR(32) NULL,
        rps5 FLOAT NULL,
        rps10 FLOAT NULL,
        rps20 FLOAT NULL,
        rps60 FLOAT NULL,
        rps120 FLOAT NULL,
        rps250 FLOAT NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE())
    );
    CREATE INDEX IX_{self.table_name}_date_code ON dbo.{self.table_name}(trade_date, board_code);
END
"""

        delete_sql = f"DELETE FROM dbo.{self.table_name} WHERE trade_date >= ? AND trade_date <= ?"
        insert_sql = f"""
INSERT INTO dbo.{self.table_name}
(trade_date, board_code, board_name, board_group, board_type, rps5, rps10, rps20, rps60, rps120, rps250, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

        min_d = df["trade_date"].min()
        max_d = df["trade_date"].max()

        def _safe_num(v):
            if v is None:
                return None
            if pd.isna(v):
                return None
            try:
                fv = float(v)
            except Exception:
                return None
            if math.isnan(fv) or math.isinf(fv):
                return None
            return fv

        rows = []
        now_ts = datetime.now()
        for _, r in df.iterrows():
            rows.append(
                (
                    r["trade_date"],
                    r["board_code"],
                    r["board_name"],
                    r["board_group"],
                    r["board_type"],
                    _safe_num(r["rps5"]),
                    _safe_num(r["rps10"]),
                    _safe_num(r["rps20"]),
                    _safe_num(r["rps60"]),
                    _safe_num(r["rps120"]),
                    _safe_num(r["rps250"]),
                    now_ts,
                )
            )

        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute(create_sql)
            cursor.execute(delete_sql, min_d, max_d)
            cursor.fast_executemany = True
            cursor.executemany(insert_sql, rows)
            conn.commit()
        return len(rows)

    def write_daily_rps_incremental(self, df: pd.DataFrame) -> int:
        """板块 RPS 增量入库：仅插入不存在的 (trade_date, board_code)。"""
        if df is None or df.empty:
            print("[INC][板块] 输入为空，跳过。")
            return 0

        import math
        import pyodbc

        create_sql = f"""
IF OBJECT_ID(N'dbo.{self.table_name}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{self.table_name} (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        board_code NVARCHAR(16) NOT NULL,
        board_name NVARCHAR(128) NOT NULL,
        board_group NVARCHAR(16) NOT NULL,
        board_type NVARCHAR(32) NULL,
        rps5 FLOAT NULL,
        rps10 FLOAT NULL,
        rps20 FLOAT NULL,
        rps60 FLOAT NULL,
        rps120 FLOAT NULL,
        rps250 FLOAT NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE())
    );
    CREATE INDEX IX_{self.table_name}_date_code ON dbo.{self.table_name}(trade_date, board_code);
END
"""
        create_tmp_sql = """
IF OBJECT_ID('tempdb..#tmp_board_rps_inc') IS NOT NULL DROP TABLE #tmp_board_rps_inc;
CREATE TABLE #tmp_board_rps_inc (
    trade_date DATE NOT NULL,
    board_code NVARCHAR(16) NOT NULL,
    board_name NVARCHAR(128) NOT NULL,
    board_group NVARCHAR(16) NOT NULL,
    board_type NVARCHAR(32) NULL,
    rps5 FLOAT NULL,
    rps10 FLOAT NULL,
    rps20 FLOAT NULL,
    rps60 FLOAT NULL,
    rps120 FLOAT NULL,
    rps250 FLOAT NULL,
    created_at DATETIME NOT NULL
);
"""
        insert_tmp_sql = """
INSERT INTO #tmp_board_rps_inc
(trade_date, board_code, board_name, board_group, board_type, rps5, rps10, rps20, rps60, rps120, rps250, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""
        insert_new_sql = f"""
INSERT INTO dbo.{self.table_name}
(trade_date, board_code, board_name, board_group, board_type, rps5, rps10, rps20, rps60, rps120, rps250, created_at)
SELECT
    s.trade_date, s.board_code, s.board_name, s.board_group, s.board_type,
    s.rps5, s.rps10, s.rps20, s.rps60, s.rps120, s.rps250, s.created_at
FROM #tmp_board_rps_inc s
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.{self.table_name} t
    WHERE t.trade_date = s.trade_date
      AND t.board_code = s.board_code
);
"""

        work = df.copy()
        td_col = pd.to_datetime(work["trade_date"], errors="coerce")
        work = work[td_col.notna()].copy()
        if work.empty:
            print("[INC][板块] trade_date 全为空，跳过。")
            return 0
        work["trade_date"] = td_col[td_col.notna()].dt.date.values
        work["board_code"] = work["board_code"].astype(str).str.strip()
        work = work[work["board_code"] != ""].copy()
        if work.empty:
            print("[INC][板块] board_code 全为空，跳过。")
            return 0

        # 先按日期范围读取库内已存在 key，在 Pandas 侧做 anti-join，避免把大量已存在行灌入临时表。
        min_d = work["trade_date"].min()
        max_d = work["trade_date"].max()
        t_filter = time.perf_counter()
        existing_keys: set[tuple[date, str]] = set()
        sql_exist = (
            f"SELECT CAST(trade_date AS DATE), LTRIM(RTRIM(CAST(board_code AS NVARCHAR(16)))) "
            f"FROM dbo.{self.table_name} WHERE trade_date >= ? AND trade_date <= ?"
        )
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute(create_sql)
            cursor.execute(sql_exist, min_d, max_d)
            for row in cursor.fetchall():
                if not row or row[0] is None:
                    continue
                d = row[0].date() if isinstance(row[0], datetime) else row[0]
                c = str(row[1]).strip() if len(row) > 1 and row[1] is not None else ""
                if c:
                    existing_keys.add((d, c))
        if existing_keys:
            mask = [(d, c) not in existing_keys for d, c in zip(work["trade_date"], work["board_code"])]
            work = work.loc[mask].copy()
        print(
            f"[INC][板块] Pandas anti-join 过滤: {len(df)} -> {len(work)}，"
            f"已存在key={len(existing_keys)}，耗时 {time.perf_counter() - t_filter:.2f}s"
        )
        if work.empty:
            print("[INC][板块] 候选均已存在，无需入库。")
            return 0

        def _safe_num(v):
            if v is None:
                return None
            if pd.isna(v):
                return None
            try:
                fv = float(v)
            except Exception:
                return None
            if math.isnan(fv) or math.isinf(fv):
                return None
            return fv

        rows = []
        now_ts = datetime.now()
        for _, r in work.iterrows():
            rows.append(
                (
                    r["trade_date"],
                    r["board_code"],
                    r["board_name"],
                    r["board_group"],
                    r["board_type"],
                    _safe_num(r["rps5"]),
                    _safe_num(r["rps10"]),
                    _safe_num(r["rps20"]),
                    _safe_num(r["rps60"]),
                    _safe_num(r["rps120"]),
                    _safe_num(r["rps250"]),
                    now_ts,
                )
            )

        inserted = 0
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute(create_sql)
            cursor.execute(create_tmp_sql)
            cursor.fast_executemany = True
            cursor.executemany(insert_tmp_sql, rows)
            cursor.execute(insert_new_sql)
            rc = cursor.rowcount
            inserted = int(rc) if rc is not None and rc >= 0 else 0
            conn.commit()
        print(f"[INC][板块] 候选 {len(rows)} 条，新增 {inserted} 条。")
        return inserted

    def _table_sql_ident(self) -> str:
        t = str(self.table_name or "").strip() or "board_rps_daily"
        return f"[{t}]"

    def fetch_latest_trade_date(self) -> date | None:
        """板块 RPS 表中 MAX(trade_date)；无数据时为 None。"""
        import pyodbc

        sql = f"SELECT CAST(MAX(trade_date) AS DATE) AS mx FROM dbo.{self._table_sql_ident()}"
        with pyodbc.connect(self.conn_str) as conn:
            cur = conn.cursor()
            cur.execute(sql)
            row = cur.fetchone()
            if not row or row[0] is None:
                return None
            v = row[0]
            if isinstance(v, datetime):
                return v.date()
            if isinstance(v, date):
                return v
            return datetime.strptime(str(v)[:10], "%Y-%m-%d").date()

    def fetch_trade_dates_in_range(self, dmin: date, dmax: date) -> set[date]:
        """闭区间内已存在至少一行板块 RPS 的 trade_date 集合。"""
        import pyodbc

        sql = (
            f"SELECT CAST(trade_date AS DATE) AS d FROM dbo.{self._table_sql_ident()} "
            "WHERE trade_date >= ? AND trade_date <= ? GROUP BY trade_date"
        )
        out: set[date] = set()
        with pyodbc.connect(self.conn_str) as conn:
            cur = conn.cursor()
            cur.execute(sql, dmin, dmax)
            for row in cur.fetchall():
                if not row or row[0] is None:
                    continue
                v = row[0]
                if isinstance(v, datetime):
                    out.add(v.date())
                elif isinstance(v, date):
                    out.add(v)
                else:
                    out.add(datetime.strptime(str(v)[:10], "%Y-%m-%d").date())
        return out


class 个股Rps数据库写入:
    """个股日频写入 SQL Server：RPS、换手率、前复权 OHLCV/量额/涨幅合并后落库（stock_rps_daily）。"""

    def __init__(self, cfg: 多周期报告配置):
        self.cfg = cfg
        self.driver = 板块Rps数据库写入._detect_odbc_driver()
        self.table_name = cfg.sqlserver_stock_table
        self.conn_str = (
            f"DRIVER={{{self.driver}}};"
            f"SERVER={cfg.sqlserver_host};"
            f"DATABASE={cfg.sqlserver_db};"
            f"UID={cfg.sqlserver_user};"
            f"PWD={cfg.sqlserver_password};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )

    def write_stock_daily_rps(self, df: pd.DataFrame) -> int:
        if df is None or df.empty:
            return 0

        import pyodbc

        tn = self.table_name
        create_sql = f"""
IF OBJECT_ID(N'dbo.{tn}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{tn} (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        stock_code NVARCHAR(16) NOT NULL,
        stock_name NVARCHAR(64) NULL,
        rps5 FLOAT NULL,
        rps10 FLOAT NULL,
        rps20 FLOAT NULL,
        rps60 FLOAT NULL,
        rps120 FLOAT NULL,
        pct_chg FLOAT NULL,
        turnover_rate FLOAT NULL,
        qfq_open FLOAT NULL,
        qfq_high FLOAT NULL,
        qfq_low FLOAT NULL,
        qfq_close FLOAT NULL,
        volume FLOAT NULL,
        amount FLOAT NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE())
    );
    CREATE INDEX IX_{tn}_date_code ON dbo.{tn}(trade_date, stock_code);
END
IF COL_LENGTH(N'dbo.{tn}', N'rps10') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD rps10 FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'pct_chg') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD pct_chg FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'turnover_rate') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD turnover_rate FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'qfq_open') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD qfq_open FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'qfq_high') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD qfq_high FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'qfq_low') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD qfq_low FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'qfq_close') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD qfq_close FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'volume') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD volume FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'amount') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD amount FLOAT NULL;
END
"""

        delete_sql = f"DELETE FROM dbo.{tn} WHERE trade_date >= ? AND trade_date <= ?"
        insert_sql = f"""
INSERT INTO dbo.{tn}
(trade_date, stock_code, stock_name, rps5, rps10, rps20, rps60, rps120, pct_chg, turnover_rate,
 qfq_open, qfq_high, qfq_low, qfq_close, volume, amount, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""

        min_d = df["trade_date"].min()
        max_d = df["trade_date"].max()

        def _nullable_float_col(series: pd.Series) -> np.ndarray:
            """转为 object 数组：非有限值 -> None，供 pyodbc 写 NULL。"""
            x = pd.to_numeric(series, errors="coerce").to_numpy(dtype=np.float64)
            out = np.empty(len(x), dtype=object)
            m = np.isfinite(x)
            out[~m] = None
            out[m] = x[m]
            return out

        def _nullable_name_col(series: pd.Series) -> list:
            if series is None or len(series) == 0:
                return []
            out = []
            for v in series.values:
                if v is None or (isinstance(v, float) and np.isnan(v)):
                    out.append(None)
                elif pd.isna(v):
                    out.append(None)
                else:
                    s = str(v).strip()
                    out.append(s if s else None)
            return out

        t_rows = time.perf_counter()
        n = len(df)
        td_col = df["trade_date"]
        if pd.api.types.is_datetime64_any_dtype(td_col):
            trade_dates = list(td_col.dt.date)
        else:
            trade_dates = td_col.tolist()

        sc_col = df["stock_code"].astype(str).str.strip()
        stock_codes = sc_col.tolist()

        if "stock_name" in df.columns:
            names = _nullable_name_col(df["stock_name"])
        else:
            names = [None] * n

        r5 = _nullable_float_col(df["rps5"]) if "rps5" in df.columns else np.full(n, None, dtype=object)
        r10 = _nullable_float_col(df["rps10"]) if "rps10" in df.columns else np.full(n, None, dtype=object)
        r20 = _nullable_float_col(df["rps20"]) if "rps20" in df.columns else np.full(n, None, dtype=object)
        r60 = _nullable_float_col(df["rps60"]) if "rps60" in df.columns else np.full(n, None, dtype=object)
        r120 = _nullable_float_col(df["rps120"]) if "rps120" in df.columns else np.full(n, None, dtype=object)
        pct = _nullable_float_col(df["pct_chg"]) if "pct_chg" in df.columns else np.full(n, None, dtype=object)
        turn = _nullable_float_col(df["turnover_rate"]) if "turnover_rate" in df.columns else np.full(n, None, dtype=object)
        qo = _nullable_float_col(df["qfq_open"]) if "qfq_open" in df.columns else np.full(n, None, dtype=object)
        qh = _nullable_float_col(df["qfq_high"]) if "qfq_high" in df.columns else np.full(n, None, dtype=object)
        ql = _nullable_float_col(df["qfq_low"]) if "qfq_low" in df.columns else np.full(n, None, dtype=object)
        qc = _nullable_float_col(df["qfq_close"]) if "qfq_close" in df.columns else np.full(n, None, dtype=object)
        vol = _nullable_float_col(df["volume"]) if "volume" in df.columns else np.full(n, None, dtype=object)
        amt = _nullable_float_col(df["amount"]) if "amount" in df.columns else np.full(n, None, dtype=object)

        now_ts = datetime.now()
        print(f"[DB] 个股列向量化准备: {time.perf_counter() - t_rows:.2f}s, {n} 行（分批 zip，不一次性物化全表）")

        batch_size = stock_rps_executemany_batch_size()
        t_db = time.perf_counter()
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute(create_sql)
            cursor.execute(delete_sql, min_d, max_d)
            cursor.fast_executemany = True
            for start in range(0, n, batch_size):
                end = min(start + batch_size, n)
                chunk = list(
                    zip(
                        trade_dates[start:end],
                        stock_codes[start:end],
                        names[start:end],
                        r5[start:end],
                        r10[start:end],
                        r20[start:end],
                        r60[start:end],
                        r120[start:end],
                        pct[start:end],
                        turn[start:end],
                        qo[start:end],
                        qh[start:end],
                        ql[start:end],
                        qc[start:end],
                        vol[start:end],
                        amt[start:end],
                        itertools.repeat(now_ts, end - start),
                    )
                )
                cursor.executemany(insert_sql, chunk)
            conn.commit()
        print(f"[DB] 个股 executemany({batch_size}/批): {time.perf_counter() - t_db:.2f}s")
        return n

    def write_stock_daily_rps_incremental(self, df: pd.DataFrame) -> int:
        """个股 RPS 增量入库：仅插入不存在的 (trade_date, stock_code)。"""
        if df is None or df.empty:
            print("[INC][个股] 输入为空，跳过。")
            return 0

        import pyodbc

        tn = self.table_name
        create_sql = f"""
IF OBJECT_ID(N'dbo.{tn}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{tn} (
        id BIGINT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        stock_code NVARCHAR(16) NOT NULL,
        stock_name NVARCHAR(64) NULL,
        rps5 FLOAT NULL,
        rps10 FLOAT NULL,
        rps20 FLOAT NULL,
        rps60 FLOAT NULL,
        rps120 FLOAT NULL,
        pct_chg FLOAT NULL,
        turnover_rate FLOAT NULL,
        qfq_open FLOAT NULL,
        qfq_high FLOAT NULL,
        qfq_low FLOAT NULL,
        qfq_close FLOAT NULL,
        volume FLOAT NULL,
        amount FLOAT NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE())
    );
    CREATE INDEX IX_{tn}_date_code ON dbo.{tn}(trade_date, stock_code);
END
IF COL_LENGTH(N'dbo.{tn}', N'rps10') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD rps10 FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'pct_chg') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD pct_chg FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'turnover_rate') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD turnover_rate FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'qfq_open') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD qfq_open FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'qfq_high') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD qfq_high FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'qfq_low') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD qfq_low FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'qfq_close') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD qfq_close FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'volume') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD volume FLOAT NULL;
END
IF COL_LENGTH(N'dbo.{tn}', N'amount') IS NULL
BEGIN
    ALTER TABLE dbo.{tn} ADD amount FLOAT NULL;
END
"""
        create_tmp_sql = """
IF OBJECT_ID('tempdb..#tmp_stock_rps_inc') IS NOT NULL DROP TABLE #tmp_stock_rps_inc;
CREATE TABLE #tmp_stock_rps_inc (
    trade_date DATE NOT NULL,
    stock_code NVARCHAR(16) NOT NULL,
    stock_name NVARCHAR(64) NULL,
    rps5 FLOAT NULL,
    rps10 FLOAT NULL,
    rps20 FLOAT NULL,
    rps60 FLOAT NULL,
    rps120 FLOAT NULL,
    pct_chg FLOAT NULL,
    turnover_rate FLOAT NULL,
    qfq_open FLOAT NULL,
    qfq_high FLOAT NULL,
    qfq_low FLOAT NULL,
    qfq_close FLOAT NULL,
    volume FLOAT NULL,
    amount FLOAT NULL,
    created_at DATETIME NOT NULL
);
"""
        insert_tmp_sql = """
INSERT INTO #tmp_stock_rps_inc
(trade_date, stock_code, stock_name, rps5, rps10, rps20, rps60, rps120, pct_chg, turnover_rate,
 qfq_open, qfq_high, qfq_low, qfq_close, volume, amount, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
"""
        insert_new_sql = f"""
INSERT INTO dbo.{tn}
(trade_date, stock_code, stock_name, rps5, rps10, rps20, rps60, rps120, pct_chg, turnover_rate,
 qfq_open, qfq_high, qfq_low, qfq_close, volume, amount, created_at)
SELECT
    s.trade_date, s.stock_code, s.stock_name, s.rps5, s.rps10, s.rps20, s.rps60, s.rps120, s.pct_chg, s.turnover_rate,
    s.qfq_open, s.qfq_high, s.qfq_low, s.qfq_close, s.volume, s.amount, s.created_at
FROM #tmp_stock_rps_inc s
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.{tn} t
    WHERE t.trade_date = s.trade_date
      AND t.stock_code = s.stock_code
);
"""

        work = df.copy()
        td_col = pd.to_datetime(work["trade_date"], errors="coerce")
        work = work[td_col.notna()].copy()
        if work.empty:
            print("[INC][个股] trade_date 全为空，跳过。")
            return 0
        work["trade_date"] = td_col[td_col.notna()].dt.date.values
        work["stock_code"] = work["stock_code"].astype(str).str.strip()
        work = work[work["stock_code"] != ""].copy()
        if work.empty:
            print("[INC][个股] stock_code 全为空，跳过。")
            return 0

        # 先查库内 key，再在 Pandas 侧 anti-join，避免对已存在数据做大批量临时表写入。
        min_d = work["trade_date"].min()
        max_d = work["trade_date"].max()
        t_filter = time.perf_counter()
        existing_keys: set[tuple[date, str]] = set()
        sql_exist = (
            f"SELECT CAST(trade_date AS DATE), LTRIM(RTRIM(CAST(stock_code AS NVARCHAR(16)))) "
            f"FROM dbo.{tn} WHERE trade_date >= ? AND trade_date <= ?"
        )
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute(create_sql)
            cursor.execute(sql_exist, min_d, max_d)
            for row in cursor.fetchall():
                if not row or row[0] is None:
                    continue
                d = row[0].date() if isinstance(row[0], datetime) else row[0]
                c = str(row[1]).strip() if len(row) > 1 and row[1] is not None else ""
                if c:
                    existing_keys.add((d, c))
        if existing_keys:
            mask = [(d, c) not in existing_keys for d, c in zip(work["trade_date"], work["stock_code"])]
            work = work.loc[mask].copy()
        print(
            f"[INC][个股] Pandas anti-join 过滤: {len(df)} -> {len(work)}，"
            f"已存在key={len(existing_keys)}，耗时 {time.perf_counter() - t_filter:.2f}s"
        )
        if work.empty:
            print("[INC][个股] 候选均已存在，无需入库。")
            return 0

        def _nullable_float_col(series: pd.Series) -> np.ndarray:
            """转为 object 数组：非有限值 -> None，供 pyodbc 写 NULL。"""
            x = pd.to_numeric(series, errors="coerce").to_numpy(dtype=np.float64)
            out = np.empty(len(x), dtype=object)
            m = np.isfinite(x)
            out[~m] = None
            out[m] = x[m]
            return out

        def _nullable_name_col(series: pd.Series) -> list:
            if series is None or len(series) == 0:
                return []
            out = []
            for v in series.values:
                if v is None or (isinstance(v, float) and np.isnan(v)):
                    out.append(None)
                elif pd.isna(v):
                    out.append(None)
                else:
                    s = str(v).strip()
                    out.append(s if s else None)
            return out

        t_rows = time.perf_counter()
        n = len(work)
        td_col = work["trade_date"]
        if pd.api.types.is_datetime64_any_dtype(td_col):
            trade_dates = list(td_col.dt.date)
        else:
            trade_dates = td_col.tolist()

        sc_col = work["stock_code"].astype(str).str.strip()
        stock_codes = sc_col.tolist()

        if "stock_name" in work.columns:
            names = _nullable_name_col(work["stock_name"])
        else:
            names = [None] * n

        r5 = _nullable_float_col(work["rps5"]) if "rps5" in work.columns else np.full(n, None, dtype=object)
        r10 = _nullable_float_col(work["rps10"]) if "rps10" in work.columns else np.full(n, None, dtype=object)
        r20 = _nullable_float_col(work["rps20"]) if "rps20" in work.columns else np.full(n, None, dtype=object)
        r60 = _nullable_float_col(work["rps60"]) if "rps60" in work.columns else np.full(n, None, dtype=object)
        r120 = _nullable_float_col(work["rps120"]) if "rps120" in work.columns else np.full(n, None, dtype=object)
        pct = _nullable_float_col(work["pct_chg"]) if "pct_chg" in work.columns else np.full(n, None, dtype=object)
        turn = (
            _nullable_float_col(work["turnover_rate"]) if "turnover_rate" in work.columns else np.full(n, None, dtype=object)
        )
        qo = _nullable_float_col(work["qfq_open"]) if "qfq_open" in work.columns else np.full(n, None, dtype=object)
        qh = _nullable_float_col(work["qfq_high"]) if "qfq_high" in work.columns else np.full(n, None, dtype=object)
        ql = _nullable_float_col(work["qfq_low"]) if "qfq_low" in work.columns else np.full(n, None, dtype=object)
        qc = _nullable_float_col(work["qfq_close"]) if "qfq_close" in work.columns else np.full(n, None, dtype=object)
        vol = _nullable_float_col(work["volume"]) if "volume" in work.columns else np.full(n, None, dtype=object)
        amt = _nullable_float_col(work["amount"]) if "amount" in work.columns else np.full(n, None, dtype=object)

        now_ts = datetime.now()
        print(f"[INC][个股] 列向量化准备: {time.perf_counter() - t_rows:.2f}s, 候选 {n} 条（分批写入临时表）")

        batch_size = stock_rps_executemany_batch_size()
        inserted = 0
        t_db = time.perf_counter()
        with pyodbc.connect(self.conn_str) as conn:
            cursor = conn.cursor()
            cursor.execute(create_sql)
            cursor.execute(create_tmp_sql)
            cursor.fast_executemany = True
            for start in range(0, n, batch_size):
                end = min(start + batch_size, n)
                chunk = list(
                    zip(
                        trade_dates[start:end],
                        stock_codes[start:end],
                        names[start:end],
                        r5[start:end],
                        r10[start:end],
                        r20[start:end],
                        r60[start:end],
                        r120[start:end],
                        pct[start:end],
                        turn[start:end],
                        qo[start:end],
                        qh[start:end],
                        ql[start:end],
                        qc[start:end],
                        vol[start:end],
                        amt[start:end],
                        itertools.repeat(now_ts, end - start),
                    )
                )
                cursor.executemany(insert_tmp_sql, chunk)
            cursor.execute(insert_new_sql)
            rc = cursor.rowcount
            inserted = int(rc) if rc is not None and rc >= 0 else 0
            conn.commit()
        print(f"[INC][个股] 批量写入临时表({batch_size}/批)+增量入库: {time.perf_counter() - t_db:.2f}s, 新增 {inserted} 条")
        return inserted


class 板块成分股每日入库服务:
    """
    板块成分股每日入库（逻辑同 PYPlugins「板块成分股每日入库.py」）。

    从通达信 tqcenter 拉取各板块成分股，写入 SQL Server 表 sector_stocks_daily（表名可配置）。
    依赖：客户端已启动并登录；与 DBHelper 等价使用 pyodbc + 多周期报告配置中的 SQL 账号。

    说明：不自动做历史回填；需历史时可另行调用原脚本的 fill 逻辑或扩展本类。
    """

    def __init__(self, cfg: 多周期报告配置):
        self.cfg = cfg
        self.driver = 板块Rps数据库写入._detect_odbc_driver()
        self.table_name = cfg.sector_stocks_table
        self.conn_str = (
            f"DRIVER={{{self.driver}}};"
            f"SERVER={cfg.sqlserver_host};"
            f"DATABASE={cfg.sqlserver_db};"
            f"UID={cfg.sqlserver_user};"
            f"PWD={cfg.sqlserver_password};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )

    def run(self) -> tuple[bool, int]:
        """
        执行当日全板块成分股入库。

        返回：
            (是否整体成功, 写入行数)；tq 不可用时返回 (False, 0)，不抛异常以便报告流程继续。

        说明：
            ``sector_stocks_daily.trade_date`` 存 A 股交易日（期望最近交易日），不是执行脚本的系统日历日。
        """
        import pyodbc

        trade_date, td_note = resolve_sector_constituents_trade_date(None)
        print(f"[成分股] sector_stocks_daily.trade_date={trade_date.isoformat()} ({td_note})")
        tq = None
        try:
            from tqcenter import tq as tq_mod
        except ImportError as e:
            print(f"[成分股] 无法导入 tqcenter: {e}，跳过板块成分股入库。")
            return False, 0

        tq = tq_mod
        try:
            tq.initialize(os.path.abspath(__file__))
        except Exception as e:
            print(f"[成分股] 通达信 tq.initialize 失败: {e}（请确认客户端已登录），跳过。")
            try:
                tq.close()
            except Exception:
                pass
            return False, 0

        # 防止 tqcenter 内部流程在循环中反复 close/init：
        # 1) 外层已初始化一次；
        # 2) 抓取期间屏蔽 initialize/close/_auto_close；
        # 3) 完成后恢复原方法并仅真正 close 一次。
        _orig_init = tq.initialize
        _orig_close = tq.close
        _orig_auto_close = getattr(tq, "_auto_close", None)
        _noop = lambda *a, **k: None

        try:
            tq.initialize = _noop
            tq.close = _noop
            if _orig_auto_close is not None:
                tq._auto_close = _noop
            try:
                try:
                    # 禁用按 code 逐个反查名称（该过程会触发更多内部调用，易出现反复 close/init 日志）
                    sectors = tq.get_sector_list_with_names(fetch_name_by_code=False)
                except TypeError:
                    sectors = tq.get_sector_list_with_names()
                if not sectors:
                    try:
                        codes = tq.get_sector_list()
                    except Exception:
                        codes = []
                    sectors = [{"code": c, "name": c} for c in (codes or [])]

                use_wl = self.cfg.sector_stocks_use_tdxzs3_whitelist()
                wl: set[str] = set()
                if use_wl:
                    hq = (self.cfg.tdx_hq_cache_dir or "").strip()
                    wl = load_rps_board_codes_from_tdxzs3(hq if hq else None)
                    print(
                        f"[成分股] tdxzs3 白名单 {len(wl)} 个板块码（hy+gn+yjhy）；"
                        f"为 0 时退化为仅 880/881 前缀。关闭过滤：sector_stocks_use_tdxzs3_whitelist=false"
                    )

                rows = []
                total_sectors = len(sectors)
                for i, sector in enumerate(sectors, 1):
                    sector_code = sector.get("code") if isinstance(sector, dict) else None
                    if sector_code is None and isinstance(sector, dict):
                        sector_code = sector.get("block")
                    if not sector_code:
                        continue
                    sector_code_db = normalize_board_code_for_db(sector_code)
                    if not sector_code_db or not _sector_code_passes_tdxzs3_whitelist(
                        sector_code_db, use_whitelist=use_wl, whitelist=wl
                    ):
                        continue
                    sector_name = (sector.get("name") if isinstance(sector, dict) else None) or sector_code
                    try:
                        stocks = tq.get_stock_list_in_sector(sector_code, block_type=0)
                    except Exception as e:
                        print(f"[成分股] [{i}/{total_sectors}] {sector_code} 成分股失败: {e}")
                        stocks = []
                    if not stocks:
                        time.sleep(0.05)
                        continue
                    maybe_log_tq_sector_stocks_shape_once(sector_code, stocks)
                    for stock_code in stocks:
                        sc_db = normalize_board_code_for_db(stock_code)
                        if sc_db:
                            rows.append((trade_date, sector_code_db, str(sector_name).strip(), sc_db))
                    time.sleep(0.1)
            finally:
                tq.initialize = _orig_init
                tq.close = _orig_close
                if _orig_auto_close is not None:
                    tq._auto_close = _orig_auto_close

            if not rows:
                print("[成分股] 未收集到任何成分股记录。")
                return True, 0

            tn = self.table_name
            create_sql = f"""
IF OBJECT_ID(N'dbo.{tn}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{tn} (
        id INT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        sector_code NVARCHAR(50) NOT NULL,
        sector_name NVARCHAR(200) NULL,
        stock_code NVARCHAR(20) NOT NULL,
        stock_name NVARCHAR(100) NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT UQ_{tn}_sector_daily UNIQUE (trade_date, sector_code, stock_code)
    );
END
"""
            del_sql = f"DELETE FROM dbo.{tn} WHERE trade_date = ?"
            ins_sql = f"""
INSERT INTO dbo.{tn} (trade_date, sector_code, sector_name, stock_code)
VALUES (?, ?, ?, ?)
"""

            with pyodbc.connect(self.conn_str) as conn:
                cur = conn.cursor()
                cur.execute(create_sql)
                cur.execute(del_sql, trade_date)
                cur.fast_executemany = True
                cur.executemany(ins_sql, rows)
                conn.commit()

            print(f"[成分股] 入库 {len(rows)} 条 → {self.cfg.sqlserver_db}.dbo.{tn}")
            return True, len(rows)
        except Exception as e:
            print(f"[成分股] 入库失败: {e}")
            return False, 0
        finally:
            if tq is not None:
                try:
                    tq.close()
                except Exception:
                    pass

    def run_incremental(self, target_trade_date: date | None = None) -> tuple[bool, int]:
        """
        执行当日全板块成分股增量入库（不删除旧数据，仅插入缺失键）。

        返回：
            (是否整体成功, 实际新增行数)；tq 不可用时返回 (False, 0)，不抛异常以便外层流程继续。
        """
        import pyodbc

        trade_date, td_note = resolve_sector_constituents_trade_date(target_trade_date)
        print(f"[INC][成分股] sector_stocks_daily.trade_date={trade_date.isoformat()} ({td_note})")
        tq = None
        try:
            from tqcenter import tq as tq_mod
        except ImportError as e:
            print(f"[INC][成分股] 无法导入 tqcenter: {e}，跳过板块成分股入库。")
            return False, 0

        tq = tq_mod
        try:
            tq.initialize(os.path.abspath(__file__))
        except Exception as e:
            print(f"[INC][成分股] 通达信 tq.initialize 失败: {e}（请确认客户端已登录），跳过。")
            try:
                tq.close()
            except Exception:
                pass
            return False, 0

        _orig_init = tq.initialize
        _orig_close = tq.close
        _orig_auto_close = getattr(tq, "_auto_close", None)
        _noop = lambda *a, **k: None

        try:
            tq.initialize = _noop
            tq.close = _noop
            if _orig_auto_close is not None:
                tq._auto_close = _noop
            try:
                try:
                    sectors = tq.get_sector_list_with_names(fetch_name_by_code=False)
                except TypeError:
                    sectors = tq.get_sector_list_with_names()
                if not sectors:
                    try:
                        codes = tq.get_sector_list()
                    except Exception:
                        codes = []
                    sectors = [{"code": c, "name": c} for c in (codes or [])]

                use_wl = self.cfg.sector_stocks_use_tdxzs3_whitelist()
                wl: set[str] = set()
                if use_wl:
                    hq = (self.cfg.tdx_hq_cache_dir or "").strip()
                    wl = load_rps_board_codes_from_tdxzs3(hq if hq else None)
                    print(
                        f"[INC][成分股] tdxzs3 白名单 {len(wl)} 个板块码（hy+gn+yjhy）；"
                        f"为 0 时退化为仅 880/881 前缀。"
                    )

                rows = []
                total_sectors = len(sectors)
                for i, sector in enumerate(sectors, 1):
                    sector_code = sector.get("code") if isinstance(sector, dict) else None
                    if sector_code is None and isinstance(sector, dict):
                        sector_code = sector.get("block")
                    if not sector_code:
                        continue
                    sector_code_db = normalize_board_code_for_db(sector_code)
                    if not sector_code_db or not _sector_code_passes_tdxzs3_whitelist(
                        sector_code_db, use_whitelist=use_wl, whitelist=wl
                    ):
                        continue
                    sector_name = (sector.get("name") if isinstance(sector, dict) else None) or sector_code
                    try:
                        stocks = tq.get_stock_list_in_sector(sector_code, block_type=0)
                    except Exception as e:
                        print(f"[INC][成分股] [{i}/{total_sectors}] {sector_code} 成分股失败: {e}")
                        stocks = []
                    if not stocks:
                        time.sleep(0.05)
                        continue
                    maybe_log_tq_sector_stocks_shape_once(sector_code, stocks)
                    for stock_code in stocks:
                        sc_db = normalize_board_code_for_db(stock_code)
                        if sc_db:
                            rows.append((trade_date, sector_code_db, str(sector_name).strip(), sc_db))
                    time.sleep(0.1)
            finally:
                tq.initialize = _orig_init
                tq.close = _orig_close
                if _orig_auto_close is not None:
                    tq._auto_close = _orig_auto_close

            if not rows:
                print("[INC][成分股] 未收集到任何成分股记录。")
                return True, 0

            tn = self.table_name
            create_sql = f"""
IF OBJECT_ID(N'dbo.{tn}', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.{tn} (
        id INT IDENTITY(1,1) PRIMARY KEY,
        trade_date DATE NOT NULL,
        sector_code NVARCHAR(50) NOT NULL,
        sector_name NVARCHAR(200) NULL,
        stock_code NVARCHAR(20) NOT NULL,
        stock_name NVARCHAR(100) NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE()),
        CONSTRAINT UQ_{tn}_sector_daily UNIQUE (trade_date, sector_code, stock_code)
    );
END
"""
            create_tmp_sql = """
IF OBJECT_ID('tempdb..#tmp_sector_inc') IS NOT NULL DROP TABLE #tmp_sector_inc;
CREATE TABLE #tmp_sector_inc (
    trade_date DATE NOT NULL,
    sector_code NVARCHAR(50) NOT NULL,
    sector_name NVARCHAR(200) NULL,
    stock_code NVARCHAR(20) NOT NULL
);
"""
            insert_tmp_sql = """
INSERT INTO #tmp_sector_inc (trade_date, sector_code, sector_name, stock_code)
VALUES (?, ?, ?, ?)
"""
            insert_new_sql = f"""
INSERT INTO dbo.{tn} (trade_date, sector_code, sector_name, stock_code)
SELECT s.trade_date, s.sector_code, s.sector_name, s.stock_code
FROM #tmp_sector_inc s
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.{tn} t
    WHERE t.trade_date = s.trade_date
      AND t.sector_code = s.sector_code
      AND t.stock_code = s.stock_code
);
"""

            inserted = 0
            with pyodbc.connect(self.conn_str) as conn:
                cur = conn.cursor()
                cur.execute(create_sql)
                cur.execute(create_tmp_sql)
                cur.fast_executemany = True
                cur.executemany(insert_tmp_sql, rows)
                cur.execute(insert_new_sql)
                rc = cur.rowcount
                inserted = int(rc) if rc is not None and rc >= 0 else 0
                conn.commit()

            print(f"[INC][成分股] 候选 {len(rows)} 条，新增 {inserted} 条 → {self.cfg.sqlserver_db}.dbo.{tn}")
            return True, inserted
        except Exception as e:
            print(f"[INC][成分股] 入库失败: {e}")
            return False, 0
        finally:
            if tq is not None:
                try:
                    tq.close()
                except Exception:
                    pass


class 板块Rps走势图导出:
    """
    板块 RPS 走势图文件导出（纯展现层）
    """

    def __init__(self, config: 多周期报告配置):
        self.cfg = config

    @staticmethod
    def build_chart_filename(block_name: str, block_type: str) -> str:
        """
        统一构造图表文件名（前后端共用逻辑）。
        """
        safe_name = re.sub(r'[\\/*?:"<>|]', "_", str(block_name))
        return f"{safe_name}_{block_type}.html"

    def generate_block_chart_file(self, block_name: str, block_type: str, history_df: pd.DataFrame) -> str:
        """
        为单板块生成独立 RPS 走势图。
        """
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=history_df["日期"], y=history_df["RPS120"], mode="lines+markers", name="RPS120"))
        fig.add_trace(go.Scatter(x=history_df["日期"], y=history_df["RPS60"], mode="lines+markers", name="RPS60"))
        fig.add_trace(go.Scatter(x=history_df["日期"], y=history_df["RPS20"], mode="lines+markers", name="RPS20"))
        fig.add_trace(go.Scatter(x=history_df["日期"], y=history_df["RPS5"], mode="lines+markers", name="RPS5"))

        fig.update_xaxes(
            rangeselector=dict(
                buttons=[
                    dict(count=1, label="1月", step="month", stepmode="backward"),
                    dict(count=3, label="3月", step="month", stepmode="backward"),
                    dict(count=6, label="6月", step="month", stepmode="backward"),
                    dict(step="all", label="全部"),
                ]
            ),
            rangeslider=dict(visible=True),
            type="date",
        )
        fig.update_layout(
            title=f"{block_name} ({block_type}) RPS走势",
            xaxis_title="日期",
            yaxis_title="RPS值",
            height=450,
            hovermode="x unified",
            template="plotly_white",
            margin=dict(l=40, r=40, t=50, b=40),
        )

        filename = self.build_chart_filename(block_name, block_type)
        path = os.path.join(self.cfg.charts_folder, filename)
        # 使用 inline 模式，确保 file:// 本地打开也能渲染（不依赖外网 CDN）
        html = plot(fig, output_type="div", include_plotlyjs=True, show_link=False)
        with open(path, "w", encoding="utf-8") as f:
            f.write(
                f"<!DOCTYPE html><html><head><meta charset='UTF-8'><title>{block_name} RPS走势</title></head>"
                f"<body style='margin:0;padding:20px;font-family:Arial'>{html}</body></html>"
            )
        return filename

    def render_all_visible_block_charts(self, analysis_df: pd.DataFrame):
        """
        为报告中所有出现过的板块批量生成图表文件。

        说明：
        - 旧逻辑仅对“最新池成员”生成图表，导致历史行/新出现行可能无对应 chart 文件。
        - 新逻辑按分析表中的全部板块名称生成，避免双击打开时找不到文件。
        """
        if analysis_df is None or analysis_df.empty:
            return
        all_names = set(analysis_df["名称"].dropna().astype(str).tolist())
        for name in all_names:
            sub = analysis_df[analysis_df["名称"] == name].sort_values("日期")
            # 允许单日数据也生成图，避免表格可见但双击无 chart 文件
            if len(sub) < 1:
                continue
            block_type = sub["类型"].iloc[0] if not sub.empty else ""
            self.generate_block_chart_file(name, block_type, sub)


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
  <title>RPS多周期分析报告（通达信数据）06</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 30px; background: #f5f7fa; }}
    .container {{ max-width: 100%; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }}
    h1 {{ font-size: 24px; margin: 0 0 12px 0; }}
    .layout {{ display: flex; gap: 16px; }}
    .board-tabs {{ width: 130px; display: flex; flex-direction: column; gap: 8px; }}
    .board-tab-button {{ padding: 10px 8px; border: 1px solid #d0d7de; background: #f3f4f6; border-radius: 8px; cursor: pointer; font-weight: bold; }}
    .board-tab-button.active {{ background: #d32f2f; color: #fff; }}
    .content-area {{ flex: 1; }}
    .tabs {{ display: flex; gap: 5px; margin-bottom: 20px; border-bottom: 2px solid #d0d7de; padding-bottom: 10px; }}
    .tab-button {{ padding: 8px 20px; font-size: 16px; font-weight: bold; border: none; background: #e9ecef; border-radius: 20px 20px 0 0; cursor: pointer; }}
    .tab-button.active {{ background: #d32f2f; color: white; }}
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
    <span style="margin-left:20px;">默认最近{default_days}个交易日；修改结束日期时自动将起始日期对齐为向前{default_days}个交易日（便于历史复盘）。</span>
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
  const rangeTradingDays = {default_days};
  const poolTitles = {{ '🔥核心': '核心池', '📈趋势': '趋势池', '🆕新生': '新生池', '🏆前20': '前20' }};
  const poolColors = {{ '🔥核心': 'core-title', '📈趋势': 'trend-title', '🆕新生': 'new-title', '🏆前20': 'trend-title' }};
  let sectorHoverTimer = null;
  let sectorLeaveTimer = null;
  let sectorStocksAbort = null;

  function hideSectorMask() {{
    const m = document.getElementById('sector-stock-mask');
    if (m) m.classList.remove('visible');
    if (sectorHoverTimer) {{ clearTimeout(sectorHoverTimer); sectorHoverTimer = null; }}
    if (sectorLeaveTimer) {{ clearTimeout(sectorLeaveTimer); sectorLeaveTimer = null; }}
    if (sectorStocksAbort) {{ try {{ sectorStocksAbort.abort(); }} catch (e) {{}} sectorStocksAbort = null; }}
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
    const hint = document.getElementById('sector-stock-hint');
    if (!boardCode) {{
      title.textContent = '成分股';
      setSectorGridMsg('无板块代码，无法查询成分股');
      mask.classList.add('visible');
      finalizeSectorPanel(anchorEl);
      return;
    }}
    title.textContent = formatSectorHoverTitle(boardCode, tradeDate, displayName);
    if (hint) hint.textContent = '序号 · 代码 · 名称 · 收盘价 · 涨幅 · 换手率（TOP20）';
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
      if (sectorStocksAbort) {{ try {{ sectorStocksAbort.abort(); }} catch (e) {{}} }}
      sectorStocksAbort = new AbortController();
      const r = await fetch(u.toString(), {{
        cache: 'no-store',
        credentials: 'same-origin',
        signal: sectorStocksAbort.signal
      }});
      if (!r.ok) {{
        setSectorGridMsg('接口返回 ' + r.status + ' ' + (r.statusText || ''));
        finalizeSectorPanel(anchorEl);
        return;
      }}
      const j = await r.json();
      const stocks = (j && j.stocks) ? j.stocks : [];
      if (hint) {{
        const md = (j && j.metric_date) ? String(j.metric_date) : '';
        const snap = (j && j.sector_snapshot_date) ? String(j.sector_snapshot_date) : '';
        const cellTd = (j && j.target_date) ? String(j.target_date) : '';
        let parts = [];
        if (snap) {{
          if (cellTd && snap !== cellTd.slice(0, 10)) {{
            parts.push('成分股快照：' + snap + '（单元格日 ' + cellTd.slice(0, 10) + ' 无入库记录，已用最近快照）');
          }} else {{
            parts.push('成分股快照：' + snap);
          }}
        }}
        if (md) parts.push('指标日期：' + md);
        hint.textContent = parts.length ? parts.join('；') : '序号 · 代码 · 名称 · 收盘价 · 涨幅 · 换手率（TOP20）';
      }}
      if (!stocks.length) {{
        setSectorGridMsg((j && j.error) ? sgEsc(j.error) : '暂无成分股（请先执行成分股入库）');
        finalizeSectorPanel(anchorEl);
        return;
      }}
      grid.className = 'sector-stock-grid sector-stock-table';
      grid.innerHTML = renderSectorStockTable(stocks);
      finalizeSectorPanel(anchorEl);
    }} catch (e) {{
      if (e && e.name === 'AbortError') return;
      const msg = (e && e.message) ? e.message : String(e);
      setSectorGridMsg('加载失败：' + sgEsc(msg) + '（请确认 web_app 已启动，且通过 http 访问本报告，勿用本地文件双击打开）');
      finalizeSectorPanel(anchorEl);
    }}
  }}

  function scheduleSectorMask(boardCode, tradeDate, displayName, anchorEl) {{
    if (sectorHoverTimer) clearTimeout(sectorHoverTimer);
    if (sectorStocksAbort) {{ try {{ sectorStocksAbort.abort(); }} catch (e) {{}} }}
    sectorHoverTimer = setTimeout(() => loadSectorStocks(boardCode, tradeDate, displayName, anchorEl), 160);
  }}

  function indexOfTradeDayOnOrBefore(allDates, ymd) {{
    if (!allDates || !ymd) return -1;
    let lo = 0, hi = allDates.length - 1, ans = -1;
    while (lo <= hi) {{
      const mid = (lo + hi) >> 1;
      if (allDates[mid] <= ymd) {{ ans = mid; lo = mid + 1; }} else {{ hi = mid - 1; }}
    }}
    return ans;
  }}

  /** 按当前板块交易日历：将结束日对齐到不大于所选日的最近交易日，并把起始日设为向前 rangeTradingDays 个交易日（含起止共 N 列）。 */
  function syncStartFromEndDate() {{
    const allDates = boardData[activeBoard].allDates || [];
    const endEl = document.getElementById('endDate');
    const startEl = document.getElementById('startDate');
    if (!allDates.length || !endEl || !startEl) return;
    const picked = endEl.value;
    if (!picked) return;
    let idx = allDates.indexOf(picked);
    if (idx === -1) idx = indexOfTradeDayOnOrBefore(allDates, picked);
    if (idx === -1) return;
    endEl.value = allDates[idx];
    const span = Math.max(1, rangeTradingDays);
    const startIdx = Math.max(0, idx - (span - 1));
    startEl.value = allDates[startIdx];
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
      changeHtml += '<div>说明：前20按当日综合RPS（RPS5/20/60/120均值）排序，不受分池阈值限制。</div>';
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
      syncStartFromEndDate();
      updateTables();
    }}));
  }}

  function updateTables() {{
    const s = document.getElementById('startDate').value;
    const e = document.getElementById('endDate').value;
    if (s && e) renderAllTables(s, e);
  }}

  window.onload = function() {{
    const endDateEl = document.getElementById('endDate');
    if (endDateEl) endDateEl.addEventListener('change', function() {{
      syncStartFromEndDate();
      updateTables();
    }});
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


class 多周期Rps报告任务:
    """
    编排：板块分析 → 板块/个股入库 → 图表 → HTML。
    """

    def __init__(self):
        self.config = 多周期报告配置()
        self.biz = 板块Rps分析服务(self.config)
        self.chart = 板块Rps走势图导出(self.config)
        self.view = 多周期Rps报告页面()

    def run(self):
        from RPS_FINAL_06.console_hints import print_run06_preparation_hints

        print_run06_preparation_hints()
        print()

        t0 = time.perf_counter()
        t_prev = t0

        def _mark(stage: str):
            nonlocal t_prev
            now = time.perf_counter()
            print(f"[TIMER][run06] {stage}: +{now - t_prev:.3f}s (total {now - t0:.3f}s)")
            t_prev = now

        print("=" * 60)
        print("RPS多周期分析报告（06：自包含，含板块+个股入库）")
        print("=" * 60)
        print(f"配置-板块读取时间: {self.config.read_tdx_blocks_time}")
        print(f"配置-RPS读取时间: {', '.join(self.config.read_tdx_rps_times)}")

        context = self.biz.build_report_context()
        _mark("build_report_context")
        print(f"block 映射命中: {context['n_hit_db']}")

        db_board = self.biz.build_board_daily_db_frame(context)
        _mark("build_board_daily_db_frame")
        db_stock = self.biz.build_stock_daily_db_frame()
        _mark("build_stock_daily_db_frame")

        if self.config.sqlserver_enabled():
            try:
                t_db_board = time.perf_counter()
                mode = "overwrite" if self.config.sql_write_mode_is_overwrite() else "incremental"
                print(f"[DB][板块RPS] 开始入库 mode={mode} ...")
                w_board = 板块Rps数据库写入(self.config)
                if self.config.sql_write_mode_is_overwrite():
                    n_b = w_board.write_daily_rps(db_board)
                else:
                    db_board_inc = self.config.trim_df_to_recent_trade_days(
                        db_board, self.config.sql_incremental_keep_trade_days, "板块RPS"
                    )
                    n_b = w_board.write_daily_rps_incremental(db_board_inc)
                print(
                    f"[DB][板块RPS] 结束：新增/写入 {n_b} 条，耗时 {time.perf_counter() - t_db_board:.2f}s "
                    f"→ {self.config.sqlserver_db}.dbo.{self.config.sqlserver_table}"
                )
            except Exception as e:
                print(f"[DB] 板块入库失败: {e}")
            try:
                t_db_stock = time.perf_counter()
                mode = "overwrite" if self.config.sql_write_mode_is_overwrite() else "incremental"
                print(f"[DB][个股RPS] 开始入库 mode={mode} ...")
                w_stock = 个股Rps数据库写入(self.config)
                if self.config.sql_write_mode_is_overwrite():
                    n_s = w_stock.write_stock_daily_rps(db_stock)
                else:
                    db_stock_inc = self.config.trim_df_to_recent_trade_days(
                        db_stock, self.config.sql_incremental_keep_trade_days, "个股RPS"
                    )
                    n_s = w_stock.write_stock_daily_rps_incremental(db_stock_inc)
                print(
                    f"[DB][个股RPS] 结束：新增/写入 {n_s} 条，耗时 {time.perf_counter() - t_db_stock:.2f}s "
                    f"→ {self.config.sqlserver_db}.dbo.{self.config.sqlserver_stock_table}"
                )
            except Exception as e:
                print(f"[DB] 个股入库失败: {e}")
            if self.config.sector_constituents_import_enabled():
                try:
                    t_db_sector = time.perf_counter()
                    print("[DB][板块成分股映射] 开始入库 ...")
                    sec_ok, sec_inserted = 板块成分股每日入库服务(self.config).run()
                    print(
                        f"[DB][板块成分股映射] 结束：新增/写入 {int(sec_inserted or 0)} 条，"
                        f"ok={bool(sec_ok)}，耗时 {time.perf_counter() - t_db_sector:.2f}s "
                        f"→ {self.config.sqlserver_db}.dbo.{self.config.sector_stocks_table}"
                    )
                except Exception as e:
                    print(f"[成分股] 未预期错误: {e}")
        else:
            print("[DB] 未配置 SQL Server，跳过入库。")
        _mark("write_sql")

        self.chart.render_all_visible_block_charts(context["analysis_df"])
        _mark("render_all_visible_block_charts")

        html = self.view.build_report_html(context, self.config.default_days)
        _mark("build_report_html")
        out_path = os.path.join(self.config.reports_folder, self.config.output_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)
        _mark("write_report_file")

        print(f"主报告已生成: {out_path}")
        print(f"图表目录: {self.config.charts_folder}")
        print(f"[TIMER][run06] total_elapsed: {time.perf_counter() - t0:.3f}s")


def run_incremental_ingest(
    include_board: bool = True,
    include_stock: bool = True,
    include_sector: bool = True,
    trade_date: str | None = None,
    write_mode: str | None = None,
) -> dict:
    """
    独立增量入库入口：板块RPS / 个股RPS / 板块成分股（可按开关选择）。
    """
    t0 = time.perf_counter()
    result = {
        "ok": True,
        "board_inserted": 0,
        "stock_inserted": 0,
        "sector_inserted": 0,
        "sector_ok": False,
        "elapsed_s": 0.0,
        "target_trade_date": "",
        "errors": [],
    }
    print(
        f"[INC] run_incremental_ingest start: include_board={include_board}, include_stock={include_stock}, "
        f"include_sector={include_sector}, trade_date={trade_date or ''}, write_mode={write_mode or ''}"
    )
    try:
        cfg = 多周期报告配置()
        mode_raw = str(write_mode or cfg.sql_write_mode or "").strip().lower()
        use_overwrite = mode_raw in ("overwrite", "full", "replace")
        if not cfg.sqlserver_enabled():
            msg = "SQL Server 未启用，无法执行增量入库。"
            print(f"[INC] {msg}")
            result["ok"] = False
            result["errors"].append(msg)
            result["elapsed_s"] = round(time.perf_counter() - t0, 3)
            return result

        biz = 板块Rps分析服务(cfg)
        context = None
        target_trade_date = None
        if trade_date:
            try:
                target_trade_date = datetime.strptime(str(trade_date).strip(), "%Y-%m-%d").date()
                result["target_trade_date"] = target_trade_date.isoformat()
            except Exception:
                err = f"invalid_trade_date: {trade_date} (expected YYYY-MM-DD)"
                print(f"[INC] {err}")
                result["ok"] = False
                result["errors"].append(err)
                result["elapsed_s"] = round(time.perf_counter() - t0, 3)
                return result

        if include_board:
            try:
                t_db_board = time.perf_counter()
                mode = "overwrite" if use_overwrite else "incremental"
                print(f"[INC][板块RPS] 开始入库 mode={mode} ...")
                context = biz.build_report_context()
                db_board = biz.build_board_daily_db_frame(context)
                if target_trade_date is not None and db_board is not None and not db_board.empty:
                    db_board = db_board[db_board["trade_date"] == target_trade_date].copy()
                db_writer_board = 板块Rps数据库写入(cfg)
                if use_overwrite:
                    result["board_inserted"] = int(db_writer_board.write_daily_rps(db_board))
                else:
                    db_board = cfg.trim_df_to_recent_trade_days(
                        db_board, cfg.sql_incremental_keep_trade_days, "板块RPS"
                    )
                    result["board_inserted"] = int(db_writer_board.write_daily_rps_incremental(db_board))
                print(
                    f"[INC][板块RPS] 结束：新增/写入 {result['board_inserted']} 条，"
                    f"耗时 {time.perf_counter() - t_db_board:.2f}s"
                )
            except Exception as e:
                err = f"board_incremental_failed: {e}"
                print(f"[INC] {err}")
                result["ok"] = False
                result["errors"].append(err)

        if include_stock:
            try:
                t_db_stock = time.perf_counter()
                mode = "overwrite" if use_overwrite else "incremental"
                print(f"[INC][个股RPS] 开始入库 mode={mode} ...")
                db_stock = biz.build_stock_daily_db_frame()
                if target_trade_date is not None and db_stock is not None and not db_stock.empty:
                    db_stock = db_stock[db_stock["trade_date"] == target_trade_date].copy()
                db_writer_stock = 个股Rps数据库写入(cfg)
                if use_overwrite:
                    result["stock_inserted"] = int(db_writer_stock.write_stock_daily_rps(db_stock))
                else:
                    db_stock = cfg.trim_df_to_recent_trade_days(
                        db_stock, cfg.sql_incremental_keep_trade_days, "个股RPS"
                    )
                    result["stock_inserted"] = int(db_writer_stock.write_stock_daily_rps_incremental(db_stock))
                print(
                    f"[INC][个股RPS] 结束：新增/写入 {result['stock_inserted']} 条，"
                    f"耗时 {time.perf_counter() - t_db_stock:.2f}s"
                )
            except Exception as e:
                err = f"stock_incremental_failed: {e}"
                print(f"[INC] {err}")
                result["ok"] = False
                result["errors"].append(err)

        if include_sector:
            try:
                t_db_sector = time.perf_counter()
                print("[INC][板块成分股映射] 开始入库 ...")
                sec_ok, sec_inserted = 板块成分股每日入库服务(cfg).run_incremental(
                    target_trade_date=target_trade_date
                )
                result["sector_ok"] = bool(sec_ok)
                result["sector_inserted"] = int(sec_inserted or 0)
                print(
                    f"[INC][板块成分股映射] 结束：新增/写入 {result['sector_inserted']} 条，"
                    f"ok={result['sector_ok']}，耗时 {time.perf_counter() - t_db_sector:.2f}s"
                )
                if not sec_ok:
                    result["ok"] = False
                    result["errors"].append("sector_incremental_failed")
            except Exception as e:
                err = f"sector_incremental_failed: {e}"
                print(f"[INC] {err}")
                result["ok"] = False
                result["sector_ok"] = False
                result["errors"].append(err)
    except Exception as e:
        err = f"incremental_ingest_fatal: {e}"
        print(f"[INC] {err}")
        result["ok"] = False
        result["errors"].append(err)
    finally:
        result["elapsed_s"] = round(time.perf_counter() - t0, 3)
        print(
            f"[INC] done: ok={result['ok']}, board={result['board_inserted']}, stock={result['stock_inserted']}, "
            f"sector={result['sector_inserted']}, sector_ok={result['sector_ok']}, elapsed_s={result['elapsed_s']}"
        )
    return result


def run_gap_backfill_ingest() -> dict:
    """
    缺口回填：对比 extdata 板块宽表与库表 trade_date，补板块 → 写 cache/last_gap_trade_dates.json
    → 成分股 → 个股（仅差额日）。详见 RPS_FINAL_06.gap_backfill_ingest。
    """
    from RPS_FINAL_06.gap_backfill_ingest import run_gap_backfill_ingest as _gap

    return _gap()


def main():
    app = 多周期Rps报告任务()
    app.run()


def preload_block_meta_cache():
    """
    供 web_app 异步预热调用的模块级入口。
    """
    cfg = 多周期报告配置()
    biz = 板块Rps分析服务(cfg)
    return biz.preload_block_meta_cache()


# ----- Web 报告缓存 key（与 Flask web_app 约定一致，勿随意改名） -----
REPORT_CACHE_MODULE_NAME = "rps_report_final_06"


def extdata_dat_paths_for_cache(extdata_dir: str | None = None) -> list:
    """
    参与缓存失效判断的 extdata 数据文件：板块 1~4、9 + 个股 5~8、10 + 个股换手率 11。
    与项目根目录 Tdx_ext_data_reader 中 RPS_FILE_MAP / STOCK_RPS_FILE_MAP / extdata_11 对应。
    """
    cfg = load_project_config()
    wr = os.path.abspath(
        get_cfg(cfg, "paths", "workspace_root", default=os.path.dirname(os.path.abspath(__file__)))
    )
    if extdata_dir:
        base = extdata_dir
    else:
        base = get_cfg(cfg, "paths", "tdx_extdata_dir", default="")
        tdx_path = os.path.join(wr, "Tdx_ext_data_reader.py")
        if os.path.isfile(tdx_path):
            spec = importlib.util.spec_from_file_location("_tdx_ext_cache_probe", tdx_path)
            if spec and spec.loader:
                mod = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                base = getattr(mod, "DEFAULT_EXTDATA_DIR", None) or base
    if not base:
        base = wr
    return [os.path.join(base, f"extdata_{i}.dat") for i in range(1, 12)]


def extdata_mtime_cache_key(extdata_dir: str | None = None) -> str:
    """extdata_1~11.dat 中最新 mtime（毫秒级整数串）；缺失文件按 0 处理。"""
    mt = []
    for p in extdata_dat_paths_for_cache(extdata_dir):
        try:
            mt.append(os.path.getmtime(p))
        except OSError:
            mt.append(0.0)
    return str(int(max(mt) * 1000))


def report_module_mtime_cache_key() -> str:
    """本模块源码 mtime，代码变更后触发重新生成报告。"""
    try:
        return str(int(os.path.getmtime(__file__) * 1000))
    except OSError:
        return "0"


def build_report_cache_key(extdata_dir: str | None = None) -> str:
    """
    组合缓存 key：extdata 版本 | 报告代码版本 | 模块名。
    web_app.trigger_report_generation_if_needed 与 /api/runtime 使用。
    """
    return f"{extdata_mtime_cache_key(extdata_dir)}|{report_module_mtime_cache_key()}|{REPORT_CACHE_MODULE_NAME}"


if __name__ == "__main__":
    main()

