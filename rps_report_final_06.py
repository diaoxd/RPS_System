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
import json
import os
import re
import sys
import time
from collections import defaultdict
from datetime import date, datetime

import pandas as pd
import plotly.graph_objects as go
from plotly.offline import plot

from project_config import load_project_config, get_cfg


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
        self.reports_folder = os.path.join(self.workspace_root, "reports")
        self.charts_folder = os.path.join(self.reports_folder, "charts")
        self.cache_dir = os.path.join(self.workspace_root, "cache")

        # 报告参数
        self.max_days = int(get_cfg(self._cfg, "report", "max_days", default=250))
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

        s = key.strip()
        if not s:
            self._norm_cache[key] = ""
            return ""
        if len(s) > 6:
            s = s[:6]
        norm = s.zfill(6)
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
                "board_code": work["代码"].astype(str),
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

    def build_stock_daily_db_frame(self) -> pd.DataFrame:
        """读取 extdata_5~8 个股 RPS 合并宽表，对齐个股日表字段。"""
        mod = self._workspace_tdx_ext_module()
        ext_dir = getattr(mod, "DEFAULT_EXTDATA_DIR", None)
        merged = mod.load_all_stock_rps_merged(base_dir=ext_dir, scale_0_100=True)
        if merged is None or merged.empty:
            return pd.DataFrame()

        rps_cols = [c for c in ("RPS120", "RPS60", "RPS20", "RPS10", "RPS5") if c in merged.columns]
        if not rps_cols:
            return pd.DataFrame()

        work = merged.copy()
        work["_c"] = work["code"].apply(self.normalize_code)
        work = work[work["_c"] != ""]
        all_dates = sorted(work["date"].unique())[-self.cfg.max_days :]
        work = work[work["date"].isin(all_dates)]

        name_map = self.load_stock_name_map()
        col_to_db = {
            "RPS5": "rps5",
            "RPS10": "rps10",
            "RPS20": "rps20",
            "RPS60": "rps60",
            "RPS120": "rps120",
        }

        rows = []
        for _, row in work.iterrows():
            c = row["_c"]
            d = int(row["date"]) if pd.notna(row["date"]) else None
            if d is None:
                continue
            trade_date = datetime.strptime(str(d), "%Y%m%d").date()
            item = {
                "trade_date": trade_date,
                "stock_code": c,
                "stock_name": name_map.get(c, c),
                "rps5": None,
                "rps10": None,
                "rps20": None,
                "rps60": None,
                "rps120": None,
            }
            for col in rps_cols:
                v = row[col] if col in row.index else None
                dbk = col_to_db.get(col)
                if dbk:
                    item[dbk] = None if pd.isna(v) else round(float(v), 1)
            if any(
                item.get(x) is not None
                for x in ("rps5", "rps10", "rps20", "rps60", "rps120")
            ):
                rows.append(item)

        if not rows:
            return pd.DataFrame()

        out = pd.DataFrame(rows)
        for x in ("rps5", "rps10", "rps20", "rps60", "rps120"):
            if x in out.columns:
                out[x] = pd.to_numeric(out[x], errors="coerce")

        out = out.drop_duplicates(subset=["trade_date", "stock_code"], keep="last")
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


class 个股Rps数据库写入:
    """个股日频 RPS 写入 SQL Server（extdata_5~8）。"""

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

        import math
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
        rps20 FLOAT NULL,
        rps60 FLOAT NULL,
        rps120 FLOAT NULL,
        created_at DATETIME NOT NULL DEFAULT(GETDATE())
    );
    CREATE INDEX IX_{tn}_date_code ON dbo.{tn}(trade_date, stock_code);
END
"""

        delete_sql = f"DELETE FROM dbo.{tn} WHERE trade_date >= ? AND trade_date <= ?"
        insert_sql = f"""
INSERT INTO dbo.{tn}
(trade_date, stock_code, stock_name, rps5, rps20, rps60, rps120, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
                    r["stock_code"],
                    r["stock_name"] if pd.notna(r.get("stock_name")) else None,
                    _safe_num(r["rps5"]),
                    _safe_num(r["rps20"]),
                    _safe_num(r["rps60"]),
                    _safe_num(r["rps120"]),
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
        """
        import pyodbc

        trade_date = date.today()
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

                rows = []
                total_sectors = len(sectors)
                for i, sector in enumerate(sectors, 1):
                    sector_code = sector.get("code") if isinstance(sector, dict) else None
                    if sector_code is None and isinstance(sector, dict):
                        sector_code = sector.get("block")
                    if not sector_code:
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
                    for stock_code in stocks:
                        sc = str(stock_code).strip()
                        if sc:
                            rows.append((trade_date, str(sector_code).strip(), str(sector_name).strip(), sc))
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
    /* 成分股：悬停时在板块单元格旁半透明浮动层，不遮整页 */
    #sector-stock-mask {{
      display: none;
      position: fixed;
      z-index: 10050;
      left: 0;
      top: 0;
      width: max-content;
      max-width: min(520px, 92vw);
      pointer-events: none;
    }}
    #sector-stock-mask.visible {{ display: block; }}
    .sector-stock-mask-panel {{
      pointer-events: auto;
      min-width: 300px;
      max-height: min(48vh, 380px);
      overflow: auto;
      background: rgba(255, 255, 255, 0.88);
      color: #1e293b;
      border: 1px solid rgba(15, 23, 42, 0.12);
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(15, 23, 42, 0.15);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 10px 12px;
      font-size: 12px;
      line-height: 1.35;
    }}
    .sector-stock-mask-title {{
      font-weight: bold;
      margin-bottom: 8px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.1);
      padding-bottom: 6px;
      color: #0f172a;
    }}
    .sector-stock-grid.sector-stock-table {{
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(15, 23, 42, 0.1);
      border-radius: 6px;
      overflow: hidden;
      min-width: 280px;
    }}
    .sg-row {{
      display: grid;
      grid-template-columns: 88px 1fr 52px;
      column-gap: 8px;
      align-items: center;
      padding: 5px 8px;
      min-height: 26px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.07);
      background: rgba(248, 250, 252, 0.65);
    }}
    .sg-row:last-child {{ border-bottom: none; }}
    .sg-row.sg-head {{
      font-weight: 600;
      background: rgba(15, 23, 42, 0.06);
      color: #334155;
    }}
    .sg-code {{
      font-family: ui-monospace, Consolas, monospace;
      font-size: 11px;
      text-align: left;
    }}
    .sg-name {{
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }}
    .sg-chg {{
      text-align: right;
      color: #64748b;
      font-variant-numeric: tabular-nums;
    }}
    .sector-stock-grid.sector-stock-msg .sg-msg-full {{
      padding: 8px;
      word-break: break-word;
    }}
    .sector-stock-hint {{ margin-top: 8px; font-size: 11px; color: #64748b; }}
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
    <div class="sector-stock-hint" id="sector-stock-hint">数据来源：sector_stocks_daily（最多 20 条）</div>
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

  function renderSectorStockTable(stocks) {{
    const list = (stocks || []).slice(0, 20);
    const head = '<div class="sg-row sg-head"><span class="sg-code">代码</span><span class="sg-name">名称</span><span class="sg-chg">涨幅</span></div>';
    const rows = list.map(function(s) {{
      const code = sgEsc(s.code || '');
      let nm = (s.name != null && String(s.name).trim() !== '') ? String(s.name).trim() : '';
      if (!nm && s.text) {{
        const t = String(s.text);
        const sp = t.indexOf(' ');
        nm = sp > 0 ? t.slice(sp + 1).trim() : '';
      }}
      const chg = (s.chg != null && String(s.chg).trim() !== '') ? String(s.chg).trim() : '';
      return '<div class="sg-row"><span class="sg-code">' + code + '</span><span class="sg-name">' + sgEsc(nm) + '</span><span class="sg-chg">' + sgEsc(chg) + '</span></div>';
    }}).join('');
    return head + rows;
  }}

  function setSectorGridMsg(html) {{
    const grid = document.getElementById('sector-stock-grid');
    grid.className = 'sector-stock-grid sector-stock-msg';
    grid.innerHTML = '<div class="sg-msg-full">' + html + '</div>';
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
    title.textContent = (displayName || boardCode) + ' · ' + tradeDate;
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
                w_board = 板块Rps数据库写入(self.config)
                n_b = w_board.write_daily_rps(db_board)
                print(f"[DB] 板块入库 {n_b} 条 → {self.config.sqlserver_db}.dbo.{self.config.sqlserver_table}")
            except Exception as e:
                print(f"[DB] 板块入库失败: {e}")
            try:
                w_stock = 个股Rps数据库写入(self.config)
                n_s = w_stock.write_stock_daily_rps(db_stock)
                print(f"[DB] 个股入库 {n_s} 条 → {self.config.sqlserver_db}.dbo.{self.config.sqlserver_stock_table}")
            except Exception as e:
                print(f"[DB] 个股入库失败: {e}")
            if self.config.sector_constituents_import_enabled():
                try:
                    板块成分股每日入库服务(self.config).run()
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
    参与缓存失效判断的 extdata 数据文件：板块 1~4、9 + 个股 5~8、10。
    与项目根目录 Tdx_ext_data_reader 中 RPS_FILE_MAP / STOCK_RPS_FILE_MAP 对应。
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
    return [os.path.join(base, f"extdata_{i}.dat") for i in range(1, 11)]


def extdata_mtime_cache_key(extdata_dir: str | None = None) -> str:
    """extdata_1~10.dat 中最新 mtime（毫秒级整数串）；缺失文件按 0 处理。"""
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

