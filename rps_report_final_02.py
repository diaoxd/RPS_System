#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
RPS 多周期分析报告（重构版，02）

目标：
1) 不修改原脚本 `rps_report_final_01.py`，提供全新、可读性更高的实现。
2) 将“业务处理”和“页面展现”分层，避免前后端逻辑揉在一起。
3) 保留原有核心能力，并支持行业(880xxx)/概念(881xxx)分开处理。

输出：
- 主报告: reports/RPS_多周期分析报告_02.html
- 板块图表: reports/charts/*.html
"""

OUTPUT_FILENAME = "RPS_多周期分析报告_02.html"

import json
import os
import re
import sys
from collections import defaultdict
from datetime import datetime

import pandas as pd
import plotly.graph_objects as go
from plotly.offline import plot

from project_config import load_project_config, get_cfg


class AppConfig:
    """
    统一配置读取类

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

        # 注入 import 路径
        if self.tdx_analysis_dir not in sys.path:
            sys.path.insert(0, self.tdx_analysis_dir)
        if self.workflow_dir not in sys.path:
            sys.path.insert(0, self.workflow_dir)

        os.makedirs(self.reports_folder, exist_ok=True)
        os.makedirs(self.charts_folder, exist_ok=True)
        os.makedirs(self.cache_dir, exist_ok=True)


class RpsBusinessService:
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

    def __init__(self, config: AppConfig):
        """
        初始化业务服务

        参数：
        - config: 应用配置对象
        """
        self.cfg = config

    def load_merged_rps(self, base_dir=None) -> pd.DataFrame:
        """
        加载扩展数据中的 RPS 宽表。

        功能说明：
        - 调用 `Tdx_ext_data_reader.load_all_rps_merged` 获取 code/date/RPS*。
        - 所有 RPS 值归一化到 0-100。

        返回：
        - DataFrame，列至少包含: code, date, RPS120, RPS60, RPS20, RPS5
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
        if pd.isna(code):
            return ""
        s = str(code).strip()
        if len(s) > 6:
            s = s[:6]
        return s.zfill(6)

    def classify_board_group(self, code: str, board_type: str = "") -> str:
        """
        按板块代码归类到“行业板块/概念板块”。

        分类规则：
        - 880xxx -> 行业板块
        - 881xxx -> 概念板块
        - 其余代码回退用 type 判断（行业/概念/一级行业）
        """
        c = self.normalize_code(code)
        if c.startswith("880"):
            return "行业板块"
        if c.startswith("881"):
            return "概念板块"

        t = str(board_type).strip()
        if t == "行业":
            return "行业板块"
        if t in ("概念", "一级行业"):
            return "概念板块"
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
        norm_list = sorted({self.normalize_code(c) for c in codes if self.normalize_code(c)})
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
                blocks.append({"name": n, "type": block_type.get(n, ""), "avgData": avg_data})
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
        merged_rps = self.load_merged_rps()
        if merged_rps is None or merged_rps.empty:
            raise RuntimeError("未读取到扩展数据，请检查 extdata 目录")

        code_to_meta, n_hit = self.load_block_meta_for_codes(merged_rps["code"].unique())
        analysis_df = self.build_analysis_df(merged_rps, code_to_meta)
        if analysis_df.empty:
            raise RuntimeError("扩展数据与 block 映射未对齐，无法生成分析表")

        analysis_df["板块大类"] = analysis_df.apply(
            lambda r: self.classify_board_group(r.get("代码", ""), r.get("类型", "")),
            axis=1,
        )
        industry_df = analysis_df[analysis_df["板块大类"] == "行业板块"].copy()
        concept_df = analysis_df[analysis_df["板块大类"] == "概念板块"].copy()

        ind_blocks, ind_dates, ind_latest, ind_trans = self.prepare_historical_data(industry_df)
        con_blocks, con_dates, con_latest, con_trans = self.prepare_historical_data(concept_df)

        base_dates = ind_dates if ind_dates else con_dates
        if not base_dates:
            raise RuntimeError("行业和概念均无可用日期")
        default_end = base_dates[-1]
        default_start = base_dates[0] if len(base_dates) <= self.cfg.default_days else base_dates[-self.cfg.default_days]

        return {
            "n_hit_db": n_hit,
            "analysis_df": analysis_df,
            "industry": {
                "blocks_by_tag": ind_blocks,
                "all_dates": ind_dates,
                "latest_pool_map": ind_latest,
                "transitions": ind_trans,
            },
            "concept": {
                "blocks_by_tag": con_blocks,
                "all_dates": con_dates,
                "latest_pool_map": con_latest,
                "transitions": con_trans,
            },
            "default_start": default_start,
            "default_end": default_end,
        }


class ChartRenderer:
    """
    独立图表渲染类（纯展现层：图表文件）
    """

    def __init__(self, config: AppConfig):
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
        html = plot(fig, output_type="div", include_plotlyjs="cdn", show_link=False)
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
            if len(sub) < 2:
                continue
            block_type = sub["类型"].iloc[0] if not sub.empty else ""
            self.generate_block_chart_file(name, block_type, sub)


class HtmlViewBuilder:
    """
    前端视图构建类（纯展现层：HTML/JS字符串）

    原则：
    - 不做业务计算
    - 只消费 context 并产出页面文本
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
                item["chartFile"] = HtmlViewBuilder._build_chart_filename(item.get("name", ""), item.get("type", ""))
                new_blocks.append(item)
            out[tag] = new_blocks
        return out

    @staticmethod
    def build_report_html(context: dict, default_days: int) -> str:
        """
        根据业务上下文构建主报告 HTML。
        """
        ind = dict(context["industry"])
        con = dict(context["concept"])
        ind["blocks_by_tag"] = HtmlViewBuilder._inject_chart_file(ind.get("blocks_by_tag", {}))
        con["blocks_by_tag"] = HtmlViewBuilder._inject_chart_file(con.get("blocks_by_tag", {}))
        default_start = context["default_start"]
        default_end = context["default_end"]

        return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>RPS多周期分析报告（通达信数据）02</title>
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
  </style>
</head>
<body>
<div class="container">
  <h1>📊 RPS多周期分析报告（行业/概念分开）</h1>
  <div style="margin:12px 0;">
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
      blocksCore: {json.dumps(ind["blocks_by_tag"].get("🔥核心", []), ensure_ascii=False)},
      blocksTrend: {json.dumps(ind["blocks_by_tag"].get("📈趋势", []), ensure_ascii=False)},
      blocksNew: {json.dumps(ind["blocks_by_tag"].get("🆕新生", []), ensure_ascii=False)},
      allDates: {json.dumps(ind["all_dates"], ensure_ascii=False)},
      transitions: {json.dumps(ind["transitions"], ensure_ascii=False)}
    }},
    concept: {{
      blocksCore: {json.dumps(con["blocks_by_tag"].get("🔥核心", []), ensure_ascii=False)},
      blocksTrend: {json.dumps(con["blocks_by_tag"].get("📈趋势", []), ensure_ascii=False)},
      blocksNew: {json.dumps(con["blocks_by_tag"].get("🆕新生", []), ensure_ascii=False)},
      allDates: {json.dumps(con["all_dates"], ensure_ascii=False)},
      transitions: {json.dumps(con["transitions"], ensure_ascii=False)}
    }}
  }};

  let activeBoard = 'industry';
  const poolTitles = {{ '🔥核心': '核心池', '📈趋势': '趋势池', '🆕新生': '新生池' }};
  const poolColors = {{ '🔥核心': 'core-title', '📈趋势': 'trend-title', '🆕新生': 'new-title' }};

  function getDatesInRange(start, end) {{
    const allDates = boardData[activeBoard].allDates || [];
    const s = allDates.indexOf(start), e = allDates.indexOf(end);
    if (s === -1 || e === -1) return [];
    return allDates.slice(Math.min(s, e), Math.max(s, e) + 1);
  }}

  function generateTableForPool(tag, dateList) {{
    const cur = boardData[activeBoard];
    let blocks = tag === '🔥核心' ? cur.blocksCore : (tag === '📈趋势' ? cur.blocksTrend : cur.blocksNew);
    if (!blocks || blocks.length === 0) return '<p>无数据</p>';

    const dailyData = {{}};
    dateList.forEach(date => {{
      const arr = [];
      blocks.forEach(b => {{
        const avg = b.avgData[date];
        if (avg !== null) arr.push({{name:b.name, type:b.type, avg:avg}});
      }});
      arr.sort((a,b)=>b.avg-a.avg);
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
          cells += `<td><span class="name-cell ${{tc}}" data-name="${{b.name}}">${{text}}</span></td>`;
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
    if (trans['新增'] && trans['新增'].length > 0) {{
      const addItems = trans['新增'].map(item => `<span class="added">↑${{item[0]}} <span class="source-dest">(${{item[1]}})</span></span>`).join(' ');
      changeHtml += `<div>新增：${{addItems}}</div>`;
    }}
    if (trans['退出'] && trans['退出'].length > 0) {{
      const remItems = trans['退出'].map(item => `<span class="removed">↓${{item[0]}} <span class="source-dest">(${{item[1]}})</span></span>`).join(' ');
      changeHtml += `<div>退出：${{remItems}}</div>`;
    }}
    if ((!trans['新增'] || trans['新增'].length === 0) && (!trans['退出'] || trans['退出'].length === 0)) {{
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
      return;
    }}
    dates.reverse();
    document.getElementById('core-pane').innerHTML = generateTableForPool('🔥核心', dates);
    document.getElementById('trend-pane').innerHTML = generateTableForPool('📈趋势', dates);
    document.getElementById('new-pane').innerHTML = generateTableForPool('🆕新生', dates);
    bindEvents();
  }}

  function bindEvents() {{
    document.querySelectorAll('.name-cell').forEach(span => {{
      span.addEventListener('click', function() {{
        const name = this.getAttribute('data-name');
        document.querySelectorAll('.name-cell').forEach(x => x.closest('td').classList.remove('highlight-cell'));
        document.querySelectorAll(`.name-cell[data-name="${{name}}"]`).forEach(x => x.closest('td').classList.add('highlight-cell'));
      }});
      span.addEventListener('dblclick', function() {{
        const name = this.getAttribute('data-name');
        const cur = boardData[activeBoard];
        const block = cur.blocksCore.find(b=>b.name===name) || cur.blocksTrend.find(b=>b.name===name) || cur.blocksNew.find(b=>b.name===name);
        if (!block) return;
        window.open('charts/' + encodeURIComponent(block.chartFile), '_blank');
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
  }};
</script>
</body>
</html>
"""


class ReportApplication:
    """
    应用编排层（Application Layer）

    职责：
    - 串联业务服务、图表渲染、页面构建。
    - 控制执行顺序和日志输出。
    - 不承担具体业务计算和前端模板细节。
    """

    def __init__(self):
        self.config = AppConfig()
        self.biz = RpsBusinessService(self.config)
        self.chart = ChartRenderer(self.config)
        self.view = HtmlViewBuilder()

    def run(self):
        """
        执行报告生成流程。
        """
        print("=" * 60)
        print("RPS多周期分析报告（重构版02）")
        print("=" * 60)
        print(f"配置-板块读取时间: {self.config.read_tdx_blocks_time}")
        print(f"配置-RPS读取时间: {', '.join(self.config.read_tdx_rps_times)}")

        context = self.biz.build_report_context()
        print(f"block 映射命中: {context['n_hit_db']}")

        self.chart.render_all_visible_block_charts(context["analysis_df"])

        html = self.view.build_report_html(context, self.config.default_days)
        out_path = os.path.join(self.config.reports_folder, self.config.output_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(html)

        print(f"主报告已生成: {out_path}")
        print(f"图表目录: {self.config.charts_folder}")


def main():
    app = ReportApplication()
    app.run()


def preload_block_meta_cache():
    """
    供 web_app 异步预热调用的模块级入口。
    """
    cfg = AppConfig()
    biz = RpsBusinessService(cfg)
    return biz.preload_block_meta_cache()


if __name__ == "__main__":
    main()

