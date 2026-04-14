# -*- coding: utf-8 -*-
"""命令行入口与 web 预热。"""

from rps.board_analysis import 板块Rps分析服务
from rps.report_settings import 多周期报告配置
from rps.report_task import 多周期Rps报告任务


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
