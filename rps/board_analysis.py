# -*- coding: utf-8 -*-
import json
import os
import time
from collections import defaultdict
from datetime import datetime

import numpy as np
import pandas as pd

from project_config import get_cfg

from rps import constants as C
from rps.report_settings import 多周期报告配置

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

    BLOCK_DB_TYPE_LABEL = C.BLOCK_DB_TYPE_LABEL

    def __init__(self, config: 多周期报告配置):
        """
        初始化业务服务

        参数：
        - config: 应用配置对象
        """
        self.cfg = config
        # code 规范化结果缓存：同一个 code 在一次构建流程中只计算一次
        self._norm_cache = {}

    def load_merged_rps(self, base_dir=None) -> pd.DataFrame:
        """
        加载扩展数据中的 RPS 宽表。

        功能说明：
        - 调用 `Tdx_ext_data_reader.load_all_rps_merged` 获取 code/date/RPS*。
        - 所有 RPS 值归一化到 0-100。

        返回：
        - DataFrame，列至少包含: code, date, RPS120, RPS60, RPS20, RPS10（若有）, RPS5
        """
        from Tdx_ext_data_reader import load_all_rps_merged, DEFAULT_EXTDATA_DIR

        ext_dir = base_dir or DEFAULT_EXTDATA_DIR
        return load_all_rps_merged(base_dir=ext_dir, scale_0_100=True)

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
            os.path.join(self.cfg.workspace_root, "tdx_blocks.db"),
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
        - 每行转成: 代码/名称/类型/日期/RPS120/60/20/10/5（存在的周期）
        """
        if merged_df is None or merged_df.empty or not code_to_meta:
            return pd.DataFrame()

        rps_cols = [c for c in ("RPS120", "RPS60", "RPS20", "RPS10", "RPS5") if c in merged_df.columns]
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
                    _cols = [c for c in ("RPS5", "RPS10", "RPS20", "RPS60", "RPS120") if c in row.index]
                    avg = float(row[_cols].mean()) if _cols else float("nan")
                    block_avg_raw[n][ds] = round(avg, 1) if avg == avg else None
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
                _cols = [c for c in ("RPS5", "RPS10", "RPS20", "RPS60", "RPS120") if c in one.columns]
                one["avg"] = one[_cols].mean(axis=1) if _cols else 0.0
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
        """读取 extdata_5~8、10 个股 RPS 合并宽表，对齐个股日表字段。"""
        from rps.extdata_stock_rps import get_default_extdata_dir, load_all_stock_rps_merged

        ext_dir = get_default_extdata_dir() or None
        merged = load_all_stock_rps_merged(base_dir=ext_dir, scale_0_100=True)
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

        # 至少有一个周期有值才保留（与原先 iterrows 条件一致）
        work = work[work[rps_cols].notna().any(axis=1)]
        if work.empty:
            return pd.DataFrame()

        name_map = self.load_stock_name_map()
        col_to_db = {
            "RPS5": "rps5",
            "RPS10": "rps10",
            "RPS20": "rps20",
            "RPS60": "rps60",
            "RPS120": "rps120",
        }

        # 向量化：避免对百万级行 iterrows（此前会卡十几分钟以上）
        work["trade_date"] = pd.to_datetime(work["date"].astype(str), format="%Y%m%d", errors="coerce").dt.date
        work = work[pd.notna(work["trade_date"])]
        if work.empty:
            return pd.DataFrame()

        work["stock_code"] = work["_c"]
        work["stock_name"] = work["_c"].map(name_map).fillna(work["_c"])

        rename = {k: col_to_db[k] for k in rps_cols if k in col_to_db}
        out = work.rename(columns=rename)
        for c in (col_to_db[k] for k in rps_cols if k in col_to_db):
            if c in out.columns:
                out[c] = pd.to_numeric(out[c], errors="coerce").round(1)

        for c in ("rps5", "rps10", "rps20", "rps60", "rps120"):
            if c not in out.columns:
                out[c] = np.nan

        out = out[
            ["trade_date", "stock_code", "stock_name", "rps5", "rps10", "rps20", "rps60", "rps120"]
        ]
        out = out.drop_duplicates(subset=["trade_date", "stock_code"], keep="last")
        return out

