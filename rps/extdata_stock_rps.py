# -*- coding: utf-8 -*-
"""
个股 RPS 扩展数据读取（extdata_5~8、10，含 RPS10）。

不依赖 ``sys.path`` 上谁先被解析为 ``Tdx_ext_data_reader``（通达信分析目录里常有同名旧文件），
始终从 **本工作区根目录** 的 ``Tdx_ext_data_reader.py`` 按路径加载后调用 ``load_all_stock_rps_merged``。
"""
import importlib.util
import os
from functools import lru_cache


@lru_cache(maxsize=1)
def _workspace_tdx_module():
    """加载项目根目录下的 Tdx_ext_data_reader（含个股 API）。"""
    here = os.path.dirname(os.path.abspath(__file__))
    root = os.path.dirname(here)
    path = os.path.join(root, "Tdx_ext_data_reader.py")
    if not os.path.isfile(path):
        raise FileNotFoundError(f"未找到工作区扩展数据读取模块: {path}")
    spec = importlib.util.spec_from_file_location("tdx_ext_data_reader_workspace", path)
    if spec is None or spec.loader is None:
        raise ImportError(f"无法加载: {path}")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def get_default_extdata_dir() -> str:
    mod = _workspace_tdx_module()
    return getattr(mod, "DEFAULT_EXTDATA_DIR", "")


def load_all_stock_rps_merged(base_dir=None, scale_0_100=True):
    """
    与 ``Tdx_ext_data_reader.load_all_stock_rps_merged`` 相同语义，保证走工作区实现。
    """
    mod = _workspace_tdx_module()
    fn = getattr(mod, "load_all_stock_rps_merged", None)
    if fn is None:
        raise ImportError(
            "工作区 Tdx_ext_data_reader.py 中缺少 load_all_stock_rps_merged，请同步更新该文件。"
        )
    return fn(base_dir=base_dir, scale_0_100=scale_0_100)
