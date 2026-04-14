# -*- coding: utf-8 -*-
import os
import re

import pandas as pd
import plotly.graph_objects as go
from plotly.offline import plot

from rps.report_settings import 多周期报告配置


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

    def generate_block_chart_file(
        self,
        block_name: str,
        block_type: str,
        history_df: pd.DataFrame,
        block_code: str | None = None,
    ) -> str:
        """
        为单板块生成独立 RPS 走势图。

        ``block_code``：板块指数代码（如 880xxx / 881xxx），显示在标题与页面 title 中。
        """
        code_part = (str(block_code).strip() if block_code else "") or ""
        title_main = (
            f"{block_name} [{code_part}] ({block_type}) RPS走势"
            if code_part
            else f"{block_name} ({block_type}) RPS走势"
        )
        page_title = f"{block_name} [{code_part}] RPS走势" if code_part else f"{block_name} RPS走势"

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
            title=title_main,
            xaxis_title="日期",
            yaxis_title="RPS值",
            height=450,
            hovermode="x unified",
            template="plotly_white",
            margin=dict(l=40, r=40, t=50, b=40),
        )

        filename = self.build_chart_filename(block_name, block_type)
        path = os.path.join(self.cfg.charts_folder, filename)
        html = plot(fig, output_type="div", include_plotlyjs=True, show_link=False)
        with open(path, "w", encoding="utf-8") as f:
            f.write(
                f"<!DOCTYPE html><html><head><meta charset='UTF-8'><title>{page_title}</title></head>"
                f"<body style='margin:0;padding:20px;font-family:Arial'>{html}</body></html>"
            )
        return filename

    def render_all_visible_block_charts(self, analysis_df: pd.DataFrame):
        """
        为报告中所有出现过的板块批量生成图表文件。
        """
        if analysis_df is None or analysis_df.empty:
            return
        all_names = set(analysis_df["名称"].dropna().astype(str).tolist())
        for name in all_names:
            sub = analysis_df[analysis_df["名称"] == name].sort_values("日期")
            if len(sub) < 1:
                continue
            block_type = sub["类型"].iloc[0] if not sub.empty else ""
            code = ""
            if "代码" in sub.columns:
                raw = sub["代码"].iloc[0]
                code = str(raw).strip() if pd.notna(raw) else ""
            self.generate_block_chart_file(name, block_type, sub, block_code=code or None)
