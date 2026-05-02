# -*- coding: utf-8 -*-
"""
板块池选股器 —— 第一层过滤器。

流程：
  1. 加载板块 RPS 宽表（date × block_code × RPS120/60/20/5）
  2. 对任意交易日，根据 RPS 阈值分出 核心/趋势/新生 三池
  3. 从 SQL Server sector_stocks_daily 获取每个板块的成分股
  4. 返回「池内股票」列表 → 供后续策略使用
"""

import json
import os
import sys

import pandas as pd

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)

from Tdx_ext_data_reader import load_all_rps_merged

# ============================================================
# 池阈值（与 rps_report_final_06.py 一致）
# ============================================================
POOL_THRESHOLDS = {
    "核心": {
        "RPS120_min": 90,
        "RPS60_min": 90,
        "RPS20_min": 85,
        "RPS5_min": 85,
    },
    "新兴": {
        "RPS20_min": 90,
        "RPS5_min": 95,
        "RPS120_max": 80,
    },
    "趋势": {
        "RPS60_min": 90,
        "RPS20_min": 85,
    },
}


def _load_sqlserver_config():
    """从 project_config.json 读取 SQL Server 配置"""
    cfg_path = os.path.join(_PROJECT_ROOT, "project_config.json")
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    sql = cfg.get("sqlserver", {})
    return {
        "host": sql.get("host", "127.0.0.1"),
        "database": sql.get("database", "tdx"),
        "user": sql.get("user", "sa"),
        "password": sql.get("password", ""),
        "table": sql.get("sector_stocks_table", "sector_stocks_daily"),
    }


# 板块池选股器：根据板块RPS值将板块分为核心/新兴/趋势三池，并从SQL Server加载成分股
class BlockPoolSelector:
    """板块池选股器"""

    def __init__(self, db_helper=None):
        """
        db_helper: SqlServerUtil.DBHelper 实例，用于数据库访问。
                   为 None 则使用内置 pyodbc 直连。
        """
        self._db = db_helper

        print("加载板块 RPS 数据...")
        self.rps_df = load_all_rps_merged(scale_0_100=True)
        self.rps_df["code"] = self.rps_df["code"].astype(str).str.strip()

        self.rps_dates = sorted(
            pd.to_datetime(d, format="%Y%m%d")
            for d in sorted(self.rps_df["date"].unique())
        )

        # block_code -> {date_str: [stock_codes]}
        self._mapping_cache = {}
        # available dates in sector_stocks_daily
        self._mapping_dates = []

        print("加载板块→成分股映射 (SQL Server)...")
        self._load_block_mapping()

        print(
            f"  板块数据: {len(self.rps_df)} 行, "
            f"{self.rps_df['code'].nunique()} 个板块, "
            f"{len(self.rps_dates)} 个交易日"
        )
        print(
            f"  成分股映射: {len(self._mapping_cache)} 个板块, "
            f"{len(self._mapping_dates)} 个交易日"
        )

    # ============================================================
    # 板块→成分股映射
    # ============================================================

    def _load_block_mapping(self):
        """从 SQL Server sector_stocks_daily 加载板块→成分股映射（优先使用 DBHelper）"""
        cfg = _load_sqlserver_config()

        if self._db is not None:
            # 使用 DBHelper（来自 SqlServerUtil.py）
            self._load_mapping_via_dbhelper(cfg)
            return

        try:
            import pyodbc
        except ImportError:
            print("  pyodbc 未安装，跳过 SQL Server 映射")
            self._fallback_file_mapping()
            return

        conn_str = (
            f"DRIVER={{ODBC Driver 17 for SQL Server}};"
            f"SERVER={cfg['host']};"
            f"DATABASE={cfg['database']};"
            f"UID={cfg['user']};"
            f"PWD={cfg['password']};"
            "Encrypt=No;"
            "TrustServerCertificate=Yes;"
        )
        try:
            conn = pyodbc.connect(conn_str, timeout=10)
        except Exception as e:
            print(f"  SQL Server 连接失败: {e}")
            self._fallback_file_mapping()
            return

        try:
            cursor = conn.cursor()
            cursor.execute(
                f"SELECT DISTINCT trade_date FROM {cfg['table']} ORDER BY trade_date"
            )
            self._mapping_dates = [d[0] for d in cursor.fetchall()]

            cursor.execute(
                f"SELECT sector_code, stock_code, trade_date "
                f"FROM {cfg['table']} "
                f"ORDER BY trade_date, sector_code"
            )
            for sector_code, stock_code, trade_date in cursor:
                code = str(sector_code).strip()
                stock = str(stock_code).strip()
                d = trade_date.isoformat() if hasattr(trade_date, "isoformat") else str(trade_date)
                if code not in self._mapping_cache:
                    self._mapping_cache[code] = {}
                self._mapping_cache[code].setdefault(d, []).append(stock)
        finally:
            conn.close()

    def _load_mapping_via_dbhelper(self, cfg):
        """通过 DBHelper 加载板块→成分股映射"""
        try:
            df_dates = self._db.read_data(
                f"SELECT DISTINCT trade_date FROM {cfg['table']} ORDER BY trade_date"
            )
            self._mapping_dates = []
            for d in df_dates.itertuples(index=False):
                val = d[0]
                self._mapping_dates.append(
                    val.isoformat() if hasattr(val, "isoformat") else str(val)
                )

            df_map = self._db.read_data(
                f"SELECT sector_code, stock_code, trade_date "
                f"FROM {cfg['table']} "
                f"ORDER BY trade_date, sector_code"
            )
            for row in df_map.itertuples(index=False):
                code = str(row[0]).strip()
                stock = str(row[1]).strip()
                td = row[2]
                d = td.isoformat() if hasattr(td, "isoformat") else str(td)
                if code not in self._mapping_cache:
                    self._mapping_cache[code] = {}
                self._mapping_cache[code].setdefault(d, []).append(stock)
        except Exception as e:
            print(f"  DBHelper 加载映射失败: {e}，尝试降级...")
            self._fallback_file_mapping()

    def _fallback_file_mapping(self):
        """降级：从 hy_block / tdx_blocks.db 获取有限映射"""
        try:
            from read_tdx_blocks import hy_block
            df = hy_block()
            for _, row in df.iterrows():
                code = str(row["code"]).strip()
                stocks = row.get("stocks", [])
                if isinstance(stocks, str):
                    stocks = [s.strip() for s in stocks.split(",") if s.strip()]
                if code and stocks:
                    self._mapping_cache.setdefault(code, {})["_fallback"] = stocks

            import sqlite3
            db_path = os.path.join(_PROJECT_ROOT, "tdx_blocks.db")
            if os.path.isfile(db_path):
                conn = sqlite3.connect(db_path)
                cur = conn.cursor()
                cur.execute(
                    "SELECT DISTINCT code, T_industry_code FROM stock_industry"
                )
                for stock, ind_code in cur.fetchall():
                    if ind_code:
                        ind_code = str(ind_code).strip()
                        stock = str(stock).strip()
                        self._mapping_cache.setdefault(ind_code, {}).setdefault(
                            "_fallback", []
                        ).append(stock)
                conn.close()
        except Exception as e:
            print(f"  降级映射也失败: {e}")

    def _get_mapping_for_date(self, block_code, date_str):
        """
        获取某个板块的成分股列表。始终使用最新的映射数据。
        date_str: '20260417'
        """
        by_date = self._mapping_cache.get(block_code)
        if not by_date:
            return []

        # 始终使用最新的映射日期（排除 _fallback）
        real_dates = sorted([d for d in by_date.keys() if d != "_fallback"])
        if real_dates:
            latest_date = real_dates[-1]
            return by_date[latest_date]

        return by_date.get("_fallback", [])

    # ============================================================
    # 池识别
    # ============================================================

    def identify_pools(self, date, debug=False) -> dict:
        """
        对单个交易日分池。

        Returns
        -------
        dict : {block_code: pool_tag}
        """
        date_str = pd.Timestamp(date).strftime("%Y%m%d")
        day_df = self.rps_df[self.rps_df["date"] == int(date_str)]
        if day_df.empty:
            return {}

        core = self._match(day_df, POOL_THRESHOLDS["核心"])
        new = self._match(day_df, POOL_THRESHOLDS["新兴"])
        trend = self._match(day_df, POOL_THRESHOLDS["趋势"])

        if debug:
            print(f"\n{'='*60}")
            print(f"  池筛选 debug — {date_str}")
            print(f"{'='*60}")
            print(f"  总板块数: {len(day_df)}")
            print(f"\n  核心池 (RPS120>90 & RPS60>90 & RPS20>85 & RPS5>85)")
            print(f"    原始命中: {len(core)} 个")
            self._print_match_detail(day_df, POOL_THRESHOLDS["核心"], core)
            print(f"\n  新兴池 (RPS20>90 & RPS5>95 & RPS120<80)")
            print(f"    原始命中: {len(new)} 个")
            self._print_match_detail(day_df, POOL_THRESHOLDS["新兴"], new)
            print(f"\n  趋势池 (RPS60>90 & RPS20>85)")
            print(f"    原始命中: {len(trend)} 个")
            self._print_match_detail(day_df, POOL_THRESHOLDS["趋势"], trend)

        overlap_core_new = core & new
        overlap_core_trend = core & trend
        overlap_new_trend = new & trend
        overlap_all = core & new & trend

        new_before = len(new)
        trend_before = len(trend)
        new = new - core
        trend = trend - core - new

        if debug:
            print(f"\n  ── 去重（优先级: 核心 > 新兴 > 趋势）──")
            if overlap_core_new:
                print(f"    核心 ∩ 新兴: {len(overlap_core_new)} 个 → 归核心")
            if overlap_core_trend:
                print(f"    核心 ∩ 趋势: {len(overlap_core_trend)} 个 → 归核心")
            if overlap_new_trend:
                print(f"    新兴 ∩ 趋势: {len(overlap_new_trend)} 个 → 归新兴")
            if overlap_all:
                print(f"    三池重叠: {len(overlap_all)} 个 → 归核心")
            print(f"\n  最终:")
            print(f"    核心: {len(core)} 个")
            print(f"    新兴: {len(new)} 个  (原始{new_before}, 被核心抢走{new_before - len(new)})")
            print(f"    趋势: {len(trend)} 个  (原始{trend_before}, 被核心抢走{trend_before - len(trend) - len(new) + (new_before - len(new))})")
            print(f"  未入选: {len(day_df) - len(core) - len(new) - len(trend)} 个")
            print(f"{'='*60}\n")

        result = {}
        for code in core:
            result[code] = "核心"
        for code in new:
            result[code] = "新兴"
        for code in trend:
            result[code] = "趋势"
        return result

    @staticmethod
    def _print_match_detail(day_df, thresholds, matched):
        """打印每个条件的命中数，以及最终命中的板块 RPS 值"""
        cond = pd.Series(True, index=day_df.index)
        for col, threshold in thresholds.items():
            if col.endswith("_min"):
                rps_col = col.replace("_min", "")
                sub = day_df[rps_col] > threshold
                cond &= sub
                print(f"    {rps_col} > {threshold}:  {sub.sum()} 个")
            elif col.endswith("_max"):
                rps_col = col.replace("_max", "")
                sub = day_df[rps_col] < threshold
                cond &= sub
                print(f"    {rps_col} < {threshold}:  {sub.sum()} 个")
        if matched:
            sample = list(matched)[:5]
            print(f"    命中板块: {sample}")

    @staticmethod
    def _match(day_df, thresholds) -> set:
        cond = pd.Series(True, index=day_df.index)
        for col, threshold in thresholds.items():
            if col.endswith("_min"):
                rps_col = col.replace("_min", "")
                cond &= day_df[rps_col] > threshold
            elif col.endswith("_max"):
                rps_col = col.replace("_max", "")
                cond &= day_df[rps_col] < threshold
        return set(day_df.loc[cond, "code"])

    # ============================================================
    # 成分股获取
    # ============================================================

    def get_stocks_for_block(self, block_code, date=None):
        """获取板块的成分股列表"""
        code = str(block_code).strip()
        if date:
            date_str = pd.Timestamp(date).strftime("%Y%m%d")
            return self._get_mapping_for_date(code, date_str)
        by_date = self._mapping_cache.get(code, {})
        all_stocks = set()
        for d, stocks in by_date.items():
            if d != "_fallback":
                all_stocks.update(stocks)
        return sorted(all_stocks) if all_stocks else by_date.get("_fallback", [])

    def get_pool_stocks(self, date, include_tags=None) -> list:
        """
        获取当天三池内的所有股票。

        Parameters
        ----------
        date : str 或 datetime
        include_tags : list, optional
            仅包含指定池，如 ['核心']；None 表示包含全部三池。

        Returns
        -------
        list[str] : 去重后的股票代码
        """
        pools = self.identify_pools(date)
        if include_tags:
            pools = {c: t for c, t in pools.items() if t in include_tags}

        date_str = pd.Timestamp(date).strftime("%Y%m%d")
        stock_set = set()
        for block_code in pools:
            stocks = self._get_mapping_for_date(block_code, date_str)
            stock_set.update(stocks)

        return sorted(stock_set)

    def get_all_dates(self):
        """返回所有交易日"""
        return self.rps_dates

    def get_latest_date(self):
        """最新交易日"""
        return self.rps_dates[-1] if self.rps_dates else None
