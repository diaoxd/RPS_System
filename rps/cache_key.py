# -*- coding: utf-8 -*-
"""
Web 报告缓存 key：extdata 数据版本 + 本包源码版本 + 模块名。
"""
import os

from project_config import get_cfg, load_project_config

from rps import constants as C


def _default_extdata_dir() -> str:
    """与 Tdx_ext_data_reader 默认目录一致，避免依赖 sys.path 上的同名模块。"""
    cfg = load_project_config()
    return get_cfg(
        cfg,
        "paths",
        "tdx_extdata_dir",
        default=r"C:/tool/Tdx MPV V1.24++/T0002/extdata",
    )


def extdata_dat_paths_for_cache(extdata_dir: str | None = None) -> list:
    """
    参与缓存失效判断的 extdata 数据文件：板块 1~4、9 + 个股 5~8、10。
    """
    base = extdata_dir or _default_extdata_dir()
    return [os.path.join(base, f"extdata_{i}.dat") for i in C.EXTDATA_CACHE_DAT_INDICES]


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
    """
    rps 包内全部 .py 的最新 mtime（拆分模块后仍能在任一处代码变更时使缓存失效）。
    """
    root = os.path.dirname(os.path.abspath(__file__))
    mt = []
    for dp, _, files in os.walk(root):
        if "__pycache__" in dp:
            continue
        for f in files:
            if not f.endswith(".py"):
                continue
            fp = os.path.join(dp, f)
            try:
                mt.append(os.path.getmtime(fp))
            except OSError:
                pass
    return str(int(max(mt) * 1000)) if mt else "0"


def build_report_cache_key(extdata_dir: str | None = None) -> str:
    """
    组合缓存 key：extdata 版本 | 报告代码版本 | 模块名。
    """
    return f"{extdata_mtime_cache_key(extdata_dir)}|{report_module_mtime_cache_key()}|{C.REPORT_ENTRY_MODULE_NAME}"


REPORT_CACHE_MODULE_NAME = C.REPORT_ENTRY_MODULE_NAME
