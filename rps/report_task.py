# -*- coding: utf-8 -*-
import os
import time

from rps import constants as C
from rps.board_analysis import 板块Rps分析服务
from rps.board_rps_sql import 板块Rps数据库写入
from rps.chart_export import 板块Rps走势图导出
from rps.html_report import 多周期Rps报告页面
from rps.report_settings import 多周期报告配置
from rps.sector_constituents_import import 板块成分股每日入库服务
from rps.stock_rps_sql import 个股Rps数据库写入


class 多周期Rps报告任务:
    """
    业务流程编排：

    1. 解析板块 RPS（extdata_1~4、9 含 RPS10）并生成报告上下文、HTML 数据
    2. 解析个股 RPS（extdata_5~8、10）→ ``build_stock_daily_db_frame``
    3. 板块成分股：tqcenter 拉取成分股 → ``板块成分股每日入库服务``（默认开启，可用 ``RPS_ENABLE_SECTOR_STOCKS_IMPORT=0`` 关闭）
    4. SQL Server：板块日表 → 个股日表（**智能增量**：补洞 + 刷新 extdata 最新日）→ 成分股日表（均已配置 SQL 时执行；成分股另需通达信已登录）

    计时说明：``build_stock_daily_db_frame`` 之后的 ``sql_*`` 分段分别对应上述三步；
    旧版单一 ``write_sql`` 实为三步之和，易被误认为仅 SQL 插入耗时。

    其后：生成板块走势图、写主报告 HTML。
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
            print(f"[TIMER][{C.CONSOLE_RUN_TAG}] {stage}: +{now - t_prev:.3f}s (total {now - t0:.3f}s)")
            t_prev = now

        print(C.REPORT_BANNER_LINE)
        print(C.MSG_REPORT_TITLE)
        print(C.REPORT_BANNER_LINE)
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
            print("存板块rps开始")
            try:
                w_board = 板块Rps数据库写入(self.config)
                n_b = w_board.write_daily_rps(db_board)
                print(f"[DB] 板块入库 {n_b} 条 → {self.config.sqlserver_db}.dbo.{self.config.sqlserver_table}")
            except Exception as e:
                print(f"[DB] 板块入库失败: {e}")
            finally:
                print("存板块rps结束")
            _mark("sql_board_rps")

            print("存个股rps开始")
            try:
                w_stock = 个股Rps数据库写入(self.config)
                n_s = w_stock.write_stock_daily_rps(db_stock)
                print(
                    f"[DB] 个股入库 {n_s} 条 → {self.config.sqlserver_db}.dbo.{self.config.stock_rps_daily_table}"
                )
            except Exception as e:
                print(f"[DB] 个股入库失败: {e}")
            finally:
                print("存个股rps结束")
            _mark("sql_stock_rps")

            if self.config.sector_constituents_import_enabled():
                print("存板块成分股开始")
                try:
                    板块成分股每日入库服务(self.config).run()
                except Exception as e:
                    print(f"[成分股] 未预期错误: {e}")
                finally:
                    print("存板块成分股结束")
                _mark("sql_sector_constituents")
            else:
                _mark("sql_sector_constituents_skipped")
        else:
            print("[DB] 未配置 SQL Server，跳过入库。")
            _mark("sql_skipped")

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
        print(f"[TIMER][{C.CONSOLE_RUN_TAG}] total_elapsed: {time.perf_counter() - t0:.3f}s")
