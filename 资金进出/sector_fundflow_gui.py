import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

import requests
from PySide6.QtCore import Qt, QThread, Signal
from PySide6.QtGui import QColor, QFont, QPainter, QPen
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QFileDialog,
    QFrame,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QProgressBar,
    QScrollArea,
    QSpinBox,
    QSplitter,
    QTabWidget,
    QTableWidget,
    QTableWidgetItem,
    QTextEdit,
    QVBoxLayout,
    QWidget,
    QHeaderView,
)

# ══════════════════════════════════════════════════════════════════
# 数据层
# ══════════════════════════════════════════════════════════════════

API_URL = "https://finance.pae.baidu.com/sapi/v1/ranks"
EASTMONEY_API_URL = "https://push2.eastmoney.com/api/qt/clist/get"

BLOCK_TYPES = {
    "行业": "HY",
    "概念": "GN",
    "地域": "DY",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://gushitong.baidu.com/",
    "Origin": "https://gushitong.baidu.com",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
}

EASTMONEY_BLOCK_FS = {
    "HY": "m:90+t:2+f:!50",
    "GN": "m:90+t:3+f:!50",
    "DY": "m:90+t:1+f:!50",
}


def _build_session():
    session = requests.Session()
    session.headers.update(HEADERS)
    return session


def _warmup_session(session):
    try:
        session.get("https://gushitong.baidu.com/", timeout=10)
    except requests.RequestException:
        pass


SESSION = _build_session()


def _to_str(v):
    if v is None or v == "-":
        return ""
    return str(v)


def _fetch_from_eastmoney(block_type="HY", page=0, page_size=500, timeout_seconds=10):
    fs = EASTMONEY_BLOCK_FS.get(block_type)
    if not fs:
        return []
    em_params = {
        "pn": page // page_size + 1,
        "pz": page_size,
        "po": 1,
        "np": 1,
        "fltt": 2,
        "invt": 2,
        "fid": "f62",
        "fs": fs,
        "fields": "f14,f62,f6",
        "ut": "b2884a393a59ad64002292a3e90d46a5",
    }
    try:
        em_resp = SESSION.get(EASTMONEY_API_URL, params=em_params, timeout=timeout_seconds)
        em_resp.raise_for_status()
        diff = em_resp.json().get("data", {}).get("diff", [])
        return [
            {
                "name": _to_str(row.get("f14")),
                "mainNetIn": _to_str(row.get("f62")),
                "mainTotalIn": "",
                "mainTotalOut": "",
                "totalAmount": _to_str(row.get("f6")),
            }
            for row in diff
        ]
    except requests.RequestException as e:
        print(f"[ERROR] 东方财富回退失败: {e}")
        return []


def fetch_sector_fundflow(
    block_type="HY",
    page=0,
    page_size=500,
    sort_key="",
    sort_type="",
    data_source="auto",
    timeout_seconds=10,
    retry_count=1,
):
    data_source = (data_source or "auto").lower()
    if data_source == "eastmoney":
        return _fetch_from_eastmoney(
            block_type=block_type, page=page,
            page_size=page_size, timeout_seconds=timeout_seconds,
        )

    params = {
        "bizType": "fundflow_rank",
        "style": "tablelist",
        "fundflowRankTarget": "block",
        "market": "ab",
        "blockType": block_type,
        "pn": page,
        "rn": page_size,
        "sortKey": sort_key,
        "sortType": sort_type,
        "finClientType": "pc",
        "_": int(time.time() * 1000),
    }

    attempts = max(1, int(retry_count) + 1)
    for i in range(attempts):
        try:
            resp = SESSION.get(API_URL, params=params, timeout=timeout_seconds)
            if resp.status_code == 403:
                _warmup_session(SESSION)
                if i < attempts - 1:
                    time.sleep(0.2)
                    continue
                if data_source == "auto":
                    print(f"[WARN] 百度403，切换东方财富: block_type={block_type}")
                    return _fetch_from_eastmoney(
                        block_type=block_type, page=page,
                        page_size=page_size, timeout_seconds=timeout_seconds,
                    )
                return []
            resp.raise_for_status()
            data = resp.json()
            if data.get("ResultCode") != 0:
                return []
            return data.get("Result", {}).get("list", {}).get("body", [])
        except requests.RequestException as e:
            if i < attempts - 1:
                time.sleep(0.2)
                continue
            if data_source == "auto":
                print(f"[WARN] 百度异常，切换东方财富: {e}")
                return _fetch_from_eastmoney(
                    block_type=block_type, page=page,
                    page_size=page_size, timeout_seconds=timeout_seconds,
                )
            return []
    return []


def fetch_all_pages(
    block_type="HY",
    page_size=500,
    sort_key="",
    sort_type="",
    data_source="auto",
    timeout_seconds=10,
    retry_count=1,
):
    all_items = []
    offset = 0
    while True:
        batch = fetch_sector_fundflow(
            block_type=block_type, page=offset, page_size=page_size,
            sort_key=sort_key, sort_type=sort_type, data_source=data_source,
            timeout_seconds=timeout_seconds, retry_count=retry_count,
        )
        if not batch:
            break
        all_items.extend(batch)
        if len(batch) < page_size:
            break
        offset += page_size
    return all_items


def fetch_all_sectors(
    page_size=500,
    sort_key="",
    sort_type="",
    data_source="auto",
    timeout_seconds=10,
    retry_count=1,
    concurrent_fetch=False,
    max_workers=3,
    progress_callback=None,
):
    result = {}
    total = len(BLOCK_TYPES)

    def _fetch(name, code):
        return name, fetch_all_pages(
            block_type=code, page_size=page_size, sort_key=sort_key,
            sort_type=sort_type, data_source=data_source,
            timeout_seconds=timeout_seconds, retry_count=retry_count,
        )

    if concurrent_fetch:
        workers = max(1, min(int(max_workers), total))
        with ThreadPoolExecutor(max_workers=workers) as executor:
            futures = {
                executor.submit(_fetch, name, code): name
                for name, code in BLOCK_TYPES.items()
            }
            completed = 0
            for future in as_completed(futures):
                name, items = future.result()
                result[name] = items
                completed += 1
                if progress_callback:
                    progress_callback(completed, total, name, len(items))
    else:
        completed = 0
        for name, code in BLOCK_TYPES.items():
            _, items = _fetch(name, code)
            result[name] = items
            completed += 1
            if progress_callback:
                progress_callback(completed, total, name, len(items))

    return {name: result.get(name, []) for name in BLOCK_TYPES}


def save_to_json(data, filename=None):
    if filename is None:
        filename = f"sector_fundflow_{datetime.now().strftime('%Y%m%d')}.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return filename


def save_to_markdown(data, filename=None, source_name="自动(百度优先，失败回退东方财富)"):
    if filename is None:
        filename = f"sector_fundflow_{datetime.now().strftime('%Y%m%d')}.md"
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    label_map = {"行业": "行业板块", "概念": "概念板块", "地域": "地域板块"}
    lines = [
        f"# 板块资金流向\n",
        f"> 数据来源: {source_name} | 更新时间: {now}\n",
        "## 数据总结\n",
        "| 板块类型 | 数据条数 |",
        "|:---|---:|",
    ]
    total = 0
    for cat, items in data.items():
        lines.append(f"| {label_map.get(cat, cat)} | {len(items)} |")
        total += len(items)
    lines.append(f"| **合计** | **{total}** |\n")
    for cat, items in data.items():
        lines.append(f"\n## {label_map.get(cat, cat)}\n")
        lines.append("| 排名 | 板块名称 | 主力净流入 | 主力流入 | 主力流出 | 总成交额 |")
        lines.append("|:---:|:---|---:|---:|---:|---:|")
        for i, item in enumerate(items, 1):
            lines.append(
                f"| {i} | {item.get('name','')} | {item.get('mainNetIn','')} | "
                f"{item.get('mainTotalIn','')} | {item.get('mainTotalOut','')} | {item.get('totalAmount','')} |"
            )
        lines.append("")
    with open(filename, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return filename


# ══════════════════════════════════════════════════════════════════
# GUI 层
# ══════════════════════════════════════════════════════════════════

_CONFIG_FILENAME = "fundflow_gui_config.json"

_DEFAULT_CONFIG = {
    "run_mode": {
        "default": "all_sectors",
        "options": [
            {"label": "抓取全部板块", "value": "all_sectors"},
            {"label": "仅抓取单一板块类型", "value": "single_block_type"},
        ],
    },
    "fields": [
        {
            "key": "block_type", "label": "板块类型", "type": "select", "default": "HY",
            "options": [
                {"label": "行业", "value": "HY"},
                {"label": "概念", "value": "GN"},
                {"label": "地域", "value": "DY"},
            ],
            "visible_when": {"run_mode": "single_block_type"},
        },
        {"key": "page_size",        "label": "每页条数",      "type": "int",  "default": 500, "min": 1,   "max": 500},
        {"key": "timeout_seconds",  "label": "请求超时(秒)",  "type": "int",  "default": 10,  "min": 3,   "max": 60},
        {"key": "retry_count",      "label": "重试次数",      "type": "int",  "default": 1,   "min": 0,   "max": 5},
        {"key": "concurrent_fetch", "label": "启用并发抓取",  "type": "bool", "default": True,
         "visible_when": {"run_mode": "all_sectors"}},
        {"key": "max_workers",      "label": "并发线程数",    "type": "int",  "default": 3,   "min": 1,   "max": 8,
         "visible_when": {"run_mode": "all_sectors"}},
        {"key": "save_json",        "label": "输出 JSON",     "type": "bool", "default": True},
        {"key": "save_markdown",    "label": "输出 Markdown", "type": "bool", "default": True},
        {"key": "output_prefix",    "label": "输出文件前缀",  "type": "text", "default": "date"},
        {"key": "output_dir",       "label": "输出目录",      "type": "text", "default": "."},
    ],
}


def _find_config_path():
    start = os.path.dirname(os.path.abspath(__file__))
    current = start
    for _ in range(6):
        candidate = os.path.join(current, _CONFIG_FILENAME)
        if os.path.exists(candidate):
            return candidate
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    return os.path.join(start, _CONFIG_FILENAME)


def _fmt_yuan(value):
    try:
        v = float(value)
    except (TypeError, ValueError):
        return str(value) if value else ""
    sign = "-" if v < 0 else "+"
    abs_v = abs(v)
    if abs_v >= 1e8:
        return f"{sign}{abs_v / 1e8:.2f}亿"
    if abs_v >= 1e4:
        return f"{sign}{abs_v / 1e4:.0f}万"
    return f"{sign}{abs_v:.0f}"


class BarChartWidget(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.rows = []
        self.mode = "top_in"
        self.setMinimumHeight(240)

    def set_rows(self, rows):
        self.rows = rows or []
        self.update()

    def set_mode(self, mode):
        self.mode = mode
        self.update()

    @staticmethod
    def _to_float(value):
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0.0

    def paintEvent(self, _event):
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        painter.fillRect(self.rect(), QColor("#f8fafc"))

        if not self.rows:
            painter.setPen(QPen(QColor("#94a3b8")))
            painter.setFont(QFont("", 12))
            painter.drawText(self.rect(), Qt.AlignCenter, "暂无可视化数据")
            return

        if self.mode == "top_out":
            top_rows = sorted(self.rows, key=lambda x: self._to_float(x.get("mainNetIn")))[:15]
        else:
            top_rows = sorted(self.rows, key=lambda x: self._to_float(x.get("mainNetIn")), reverse=True)[:15]

        values = [self._to_float(x.get("mainNetIn")) for x in top_rows]
        max_abs = max([abs(v) for v in values] + [1.0])

        left = 108
        right = 88
        top_pad = 10
        bottom_pad = 10
        plot_w = max(80, self.width() - left - right)
        plot_h = max(100, self.height() - top_pad - bottom_pad)
        row_h = max(15, plot_h // max(1, len(top_rows)))

        painter.setPen(QPen(QColor("#e2e8f0"), 1))
        painter.drawLine(left, top_pad, left, top_pad + len(top_rows) * row_h)

        name_font = QFont("", 11)
        val_font = QFont("", 10)

        for i, row in enumerate(top_rows):
            y = top_pad + i * row_h
            bg = QColor("#f1f5f9") if i % 2 == 0 else QColor("#f8fafc")
            painter.fillRect(0, y, self.width(), row_h, bg)

            name = str(row.get("name", ""))
            value = self._to_float(row.get("mainNetIn"))
            ratio = abs(value) / max_abs
            bar_w = max(2, int(plot_w * ratio * 0.88))

            color = QColor("#16a34a") if value >= 0 else QColor("#dc2626")
            painter.fillRect(left + 3, y + 3, bar_w, row_h - 6, color)

            painter.setFont(name_font)
            painter.setPen(QPen(QColor("#374151")))
            painter.drawText(4, y, left - 8, row_h, Qt.AlignVCenter | Qt.AlignRight, name)

            painter.setFont(val_font)
            painter.setPen(QPen(QColor("#111827") if value >= 0 else QColor("#991b1b")))
            painter.drawText(left + bar_w + 6, y, right - 6, row_h,
                             Qt.AlignVCenter | Qt.AlignLeft, _fmt_yuan(value))


class FetchWorker(QThread):
    log_signal = Signal(str)
    progress_signal = Signal(int, str)
    result_signal = Signal(dict)
    error_signal = Signal(str)

    def __init__(self, params):
        super().__init__()
        self.params = params

    @staticmethod
    def _source_label(data_source):
        mapping = {
            "auto": "自动(百度优先，失败回退东方财富)",
            "baidu": "百度股市通",
            "eastmoney": "东方财富",
        }
        return mapping.get((data_source or "auto").lower(), str(data_source))

    def run(self):
        try:
            run_mode = self.params.get("run_mode", "all_sectors")
            self.log_signal.emit(f"[INFO] 启动任务: run_mode={run_mode}")

            if run_mode == "single_block_type":
                block_type = self.params.get("block_type", "HY")
                category = next((k for k, v in BLOCK_TYPES.items() if v == block_type), block_type)
                rows = fetch_all_pages(
                    block_type=block_type,
                    page_size=self.params.get("page_size", 500),
                    sort_key=self.params.get("sort_key", ""),
                    sort_type=self.params.get("sort_type", ""),
                    data_source=self.params.get("data_source", "auto"),
                    timeout_seconds=self.params.get("timeout_seconds", 10),
                    retry_count=self.params.get("retry_count", 1),
                )
                all_data = {category: rows}
                self.progress_signal.emit(100, f"{category}: {len(rows)} 条")
            else:
                def on_progress(done, total, name, count):
                    percent = int(done * 100 / max(1, total))
                    self.progress_signal.emit(percent, f"{name}: {count} 条")

                all_data = fetch_all_sectors(
                    page_size=self.params.get("page_size", 500),
                    sort_key=self.params.get("sort_key", ""),
                    sort_type=self.params.get("sort_type", ""),
                    data_source=self.params.get("data_source", "auto"),
                    timeout_seconds=self.params.get("timeout_seconds", 10),
                    retry_count=self.params.get("retry_count", 1),
                    concurrent_fetch=self.params.get("concurrent_fetch", True),
                    max_workers=self.params.get("max_workers", 3),
                    progress_callback=on_progress,
                )

            output_dir = self.params.get("output_dir", ".")
            output_prefix = self.params.get("output_prefix", "date")
            os.makedirs(output_dir, exist_ok=True)
            today = datetime.now().strftime("%Y%m%d")
            json_file = os.path.join(output_dir, f"{output_prefix}_{today}.json")
            md_file = os.path.join(output_dir, f"{output_prefix}_{today}.md")

            saved_json = ""
            saved_md = ""
            if self.params.get("save_json", True):
                saved_json = save_to_json(all_data, filename=json_file)
            if self.params.get("save_markdown", True):
                saved_md = save_to_markdown(
                    all_data,
                    filename=md_file,
                    source_name=self._source_label(self.params.get("data_source", "auto")),
                )

            rows = []
            for category, items in all_data.items():
                for item in items:
                    merged = dict(item)
                    merged["category"] = category
                    rows.append(merged)

            rows.sort(key=lambda x: self._to_float(x.get("mainNetIn")), reverse=True)
            total_count = len(rows)
            self.log_signal.emit(f"[DONE] 抓取完成，总计 {total_count} 条")
            if saved_json:
                self.log_signal.emit(f"[FILE] JSON: {saved_json}")
            if saved_md:
                self.log_signal.emit(f"[FILE] Markdown: {saved_md}")

            self.result_signal.emit(
                {
                    "rows": rows,
                    "summary": all_data,
                    "json_file": saved_json,
                    "markdown_file": saved_md,
                    "total_count": total_count,
                }
            )
        except Exception as exc:
            self.error_signal.emit(str(exc))

    @staticmethod
    def _to_float(value):
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0.0


class FundflowMainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("板块资金流向监控")
        self.resize(1300, 820)

        self.config_path = _find_config_path()
        self.config = self._load_config(self.config_path)
        self.field_widgets = {}
        self.field_metas = {}
        self.row_widgets = {}
        self.worker = None
        self.all_rows = []

        self._build_ui()
        self._apply_styles()
        self._refresh_field_visibility()

    def _apply_styles(self):
        self.setStyleSheet("""
            QWidget { font-size: 12px; color: #1f2937; }
            QMainWindow, #leftPanel { background: #f1f5f9; }
            QScrollArea, QTabWidget::pane, QTextEdit, QTableWidget {
                background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px;
            }
            QLineEdit, QComboBox, QSpinBox {
                background: #ffffff; border: 1px solid #cbd5e1;
                border-radius: 4px; padding: 3px 6px; min-height: 22px;
            }
            QPushButton#runBtn {
                background: #0f172a; color: #fff; border: none;
                border-radius: 5px; padding: 6px 14px; font-weight: 600;
            }
            QPushButton#runBtn:hover { background: #1e293b; }
            QPushButton#runBtn:disabled { background: #94a3b8; }
            QPushButton#secBtn {
                background: #e2e8f0; color: #374151; border: none;
                border-radius: 5px; padding: 5px 8px;
            }
            QPushButton#secBtn:hover { background: #cbd5e1; }
            QPushButton#toggleBtn {
                background: #e2e8f0; color: #374151; border: none;
                border-radius: 4px; padding: 3px 10px;
            }
            QPushButton#toggleBtn:checked { background: #0f172a; color: #fff; }
            QPushButton#toggleBtn:hover { background: #cbd5e1; }
            QProgressBar {
                border: 1px solid #e2e8f0; border-radius: 4px;
                background: #fff; text-align: center; max-height: 14px;
            }
            QProgressBar::chunk { background: #0ea5e9; border-radius: 4px; }
            QHeaderView::section {
                background: #f8fafc; border: none;
                border-bottom: 1px solid #e2e8f0; padding: 4px 8px; font-weight: 600;
            }
            QTabBar::tab { padding: 4px 14px; border: none; border-bottom: 2px solid transparent; color: #64748b; }
            QTabBar::tab:selected { color: #0f172a; border-bottom: 2px solid #0f172a; }
            QSplitter::handle { background: #e2e8f0; width: 1px; }
        """)

    def _load_config(self, path):
        if path and os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return _DEFAULT_CONFIG

    def _build_ui(self):
        root = QWidget()
        root_layout = QVBoxLayout(root)
        root_layout.setContentsMargins(0, 0, 0, 0)
        root_layout.setSpacing(0)

        # ── header bar ──────────────────────────────
        header = QWidget()
        header.setFixedHeight(40)
        header.setStyleSheet("background:#0f172a;")
        h_layout = QHBoxLayout(header)
        h_layout.setContentsMargins(14, 0, 14, 0)
        h_layout.setSpacing(10)
        h_title = QLabel("板块资金流向监控面板")
        h_title.setStyleSheet("color:#f8fafc; font-size:14px; font-weight:600;")
        h_sub = QLabel("参数化抓取 · 分类筛选 · 可视化分析")
        h_sub.setStyleSheet("color:#94a3b8; font-size:11px;")
        h_layout.addWidget(h_title)
        h_layout.addWidget(h_sub)
        h_layout.addStretch()
        root_layout.addWidget(header)

        # ── body ─────────────────────────────────────
        splitter = QSplitter(Qt.Horizontal)
        root_layout.addWidget(splitter, 1)

        # ── LEFT panel ───────────────────────────────
        left_panel = QWidget()
        left_panel.setObjectName("leftPanel")
        left_panel.setFixedWidth(295)
        left_layout = QVBoxLayout(left_panel)
        left_layout.setContentsMargins(10, 10, 10, 10)
        left_layout.setSpacing(5)

        mode_row = QHBoxLayout()
        mode_lbl = QLabel("运行模式")
        mode_lbl.setFixedWidth(64)
        self.run_mode_combo = QComboBox()
        run_mode_cfg = self.config.get("run_mode", {})
        for item in run_mode_cfg.get("options", []):
            self.run_mode_combo.addItem(item.get("label", ""), item.get("value", ""))
        idx = self.run_mode_combo.findData(run_mode_cfg.get("default", "all_sectors"))
        self.run_mode_combo.setCurrentIndex(max(0, idx))
        self.run_mode_combo.currentIndexChanged.connect(self._refresh_field_visibility)
        mode_row.addWidget(mode_lbl)
        mode_row.addWidget(self.run_mode_combo)
        left_layout.addLayout(mode_row)

        sep = QFrame()
        sep.setFrameShape(QFrame.HLine)
        sep.setStyleSheet("color:#e2e8f0;")
        left_layout.addWidget(sep)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setFrameShape(QFrame.NoFrame)
        form_container = QWidget()
        self.form_layout = QVBoxLayout(form_container)
        self.form_layout.setSpacing(4)
        self.form_layout.setContentsMargins(0, 2, 0, 2)
        scroll.setWidget(form_container)
        left_layout.addWidget(scroll, 1)
        self._build_dynamic_fields()

        sep2 = QFrame()
        sep2.setFrameShape(QFrame.HLine)
        sep2.setStyleSheet("color:#e2e8f0;")
        left_layout.addWidget(sep2)

        btn_row = QHBoxLayout()
        self.run_button = QPushButton("▶  开始抓取")
        self.run_button.setObjectName("runBtn")
        self.run_button.setCursor(Qt.PointingHandCursor)
        self.run_button.clicked.connect(self._on_run)
        self.open_output_button = QPushButton("打开目录")
        self.open_output_button.setObjectName("secBtn")
        self.open_output_button.setCursor(Qt.PointingHandCursor)
        self.open_output_button.clicked.connect(self._open_output_dir)
        btn_row.addWidget(self.run_button, 2)
        btn_row.addWidget(self.open_output_button, 1)
        left_layout.addLayout(btn_row)

        self.progress_bar = QProgressBar()
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        left_layout.addWidget(self.progress_bar)

        self.status_label = QLabel("就绪")
        self.status_label.setStyleSheet("color:#64748b; font-size:11px;")
        left_layout.addWidget(self.status_label)

        # ── RIGHT panel ──────────────────────────────
        right_panel = QWidget()
        right_layout = QVBoxLayout(right_panel)
        right_layout.setContentsMargins(8, 8, 8, 8)
        right_layout.setSpacing(5)

        result_toolbar = QHBoxLayout()
        result_toolbar.setSpacing(6)
        result_toolbar.addWidget(QLabel("分类:"))
        self.category_filter_combo = QComboBox()
        self.category_filter_combo.setFixedWidth(90)
        self.category_filter_combo.addItem("全部", "全部")
        self.category_filter_combo.currentIndexChanged.connect(self._apply_category_filter)
        result_toolbar.addWidget(self.category_filter_combo)
        result_toolbar.addStretch()
        self.result_count_label = QLabel("共 0 条")
        self.result_count_label.setStyleSheet("color:#64748b;")
        result_toolbar.addWidget(self.result_count_label)
        right_layout.addLayout(result_toolbar)

        self.tabs = QTabWidget()
        self.tabs.setDocumentMode(True)

        # table tab
        self.table = QTableWidget()
        self.table.setColumnCount(4)
        self.table.setHorizontalHeaderLabels(["分类", "板块名称", "主力净流入", "总成交额"])
        self.table.setAlternatingRowColors(True)
        self.table.setSortingEnabled(True)
        self.table.setShowGrid(False)
        self.table.verticalHeader().setVisible(False)
        self.table.verticalHeader().setDefaultSectionSize(22)
        self.table.horizontalHeader().setSectionResizeMode(0, QHeaderView.ResizeToContents)
        self.table.horizontalHeader().setSectionResizeMode(1, QHeaderView.Stretch)
        self.table.horizontalHeader().setSectionResizeMode(2, QHeaderView.ResizeToContents)
        self.table.horizontalHeader().setSectionResizeMode(3, QHeaderView.ResizeToContents)
        self.tabs.addTab(self.table, "结果表格")

        # chart tab
        chart_tab = QWidget()
        chart_tab_layout = QVBoxLayout(chart_tab)
        chart_tab_layout.setContentsMargins(6, 6, 6, 6)
        chart_tab_layout.setSpacing(4)
        chart_toolbar = QHBoxLayout()
        chart_toolbar.addWidget(QLabel("图表:"))
        self.btn_top_in = QPushButton("净流入 Top")
        self.btn_top_in.setObjectName("toggleBtn")
        self.btn_top_in.setCheckable(True)
        self.btn_top_in.setChecked(True)
        self.btn_top_in.clicked.connect(lambda: self._set_chart_mode("top_in"))
        self.btn_top_out = QPushButton("净流出 Top")
        self.btn_top_out.setObjectName("toggleBtn")
        self.btn_top_out.setCheckable(True)
        self.btn_top_out.setChecked(False)
        self.btn_top_out.clicked.connect(lambda: self._set_chart_mode("top_out"))
        chart_toolbar.addWidget(self.btn_top_in)
        chart_toolbar.addWidget(self.btn_top_out)
        chart_toolbar.addStretch()
        chart_tab_layout.addLayout(chart_toolbar)
        self.chart = BarChartWidget()
        chart_tab_layout.addWidget(self.chart, 1)
        self.tabs.addTab(chart_tab, "可视化")

        # log tab
        self.log_edit = QTextEdit()
        self.log_edit.setReadOnly(True)
        self.log_edit.setStyleSheet("font-family:Consolas,monospace; font-size:11px;")
        self.tabs.addTab(self.log_edit, "运行日志")

        right_layout.addWidget(self.tabs, 1)

        splitter.addWidget(left_panel)
        splitter.addWidget(right_panel)
        splitter.setStretchFactor(0, 0)
        splitter.setStretchFactor(1, 1)

        self.setCentralWidget(root)

    def _build_dynamic_fields(self):
        for field in self.config.get("fields", []):
            key = field.get("key")
            if not key:
                continue

            row_wrap = QWidget()
            row_layout = QHBoxLayout(row_wrap)
            row_layout.setContentsMargins(0, 0, 0, 0)
            row_layout.setSpacing(6)
            lbl = QLabel(field.get("label", key))
            lbl.setFixedWidth(76)
            lbl.setWordWrap(True)
            widget = self._create_widget_for_field(field)
            row_layout.addWidget(lbl)
            row_layout.addWidget(widget, 1)

            if key == "output_dir":
                browse_btn = QPushButton("…")
                browse_btn.setObjectName("secBtn")
                browse_btn.setFixedWidth(26)
                browse_btn.clicked.connect(self._select_output_dir)
                row_layout.addWidget(browse_btn)

            self.form_layout.addWidget(row_wrap)
            self.field_widgets[key] = widget
            self.field_metas[key] = field
            self.row_widgets[key] = row_wrap

        self.form_layout.addStretch()

    def _create_widget_for_field(self, field):
        ftype = field.get("type", "text")
        default = field.get("default")

        if ftype == "select":
            combo = QComboBox()
            for option in field.get("options", []):
                combo.addItem(option.get("label", option.get("value", "")), option.get("value", ""))
            idx = combo.findData(default)
            combo.setCurrentIndex(max(0, idx))
            return combo

        if ftype == "int":
            spin = QSpinBox()
            spin.setMinimum(int(field.get("min", -999999)))
            spin.setMaximum(int(field.get("max", 999999)))
            spin.setValue(int(default if default is not None else 0))
            return spin

        if ftype == "bool":
            check = QCheckBox()
            check.setChecked(bool(default))
            return check

        edit = QLineEdit()
        edit.setText("" if default is None else str(default))
        placeholder = field.get("placeholder", "")
        if placeholder:
            edit.setPlaceholderText(placeholder)
        return edit

    def _refresh_field_visibility(self):
        run_mode = self.run_mode_combo.currentData()
        for key, meta in self.field_metas.items():
            cond = meta.get("visible_when")
            visible = True
            if cond and "run_mode" in cond:
                visible = run_mode == cond.get("run_mode")
            self.row_widgets[key].setVisible(visible)

    def _get_widget_value(self, key, widget):
        meta = self.field_metas[key]
        ftype = meta.get("type", "text")

        if ftype == "select":
            return widget.currentData()
        if ftype == "int":
            return int(widget.value())
        if ftype == "bool":
            return bool(widget.isChecked())
        return widget.text().strip()

    def _collect_params(self):
        params = {
            "run_mode": self.run_mode_combo.currentData(),
        }
        for key, widget in self.field_widgets.items():
            if not self.row_widgets[key].isVisible():
                continue
            params[key] = self._get_widget_value(key, widget)
        return params

    def _select_output_dir(self):
        current = self.field_widgets["output_dir"].text().strip() or "."
        selected = QFileDialog.getExistingDirectory(self, "选择输出目录", current)
        if selected:
            self.field_widgets["output_dir"].setText(selected)

    def _open_output_dir(self):
        output_dir = self.field_widgets.get("output_dir")
        if output_dir is None:
            return
        path = output_dir.text().strip() or "."
        try:
            os.startfile(path)
        except OSError as exc:
            QMessageBox.warning(self, "提示", f"无法打开目录: {exc}")

    def _on_run(self):
        params = self._collect_params()

        if not params.get("save_json") and not params.get("save_markdown"):
            ret = QMessageBox.question(
                self,
                "确认",
                "JSON 和 Markdown 都未勾选，将不会保存文件。继续吗？",
            )
            if ret != QMessageBox.StandardButton.Yes:
                return

        self.run_button.setEnabled(False)
        self.progress_bar.setValue(0)
        self.status_label.setText("运行中...")
        self.log_edit.clear()

        self.worker = FetchWorker(params)
        self.worker.log_signal.connect(self._append_log)
        self.worker.progress_signal.connect(self._on_progress)
        self.worker.result_signal.connect(self._on_result)
        self.worker.error_signal.connect(self._on_error)
        self.worker.finished.connect(self._on_finished)
        self.worker.start()

    def _append_log(self, text):
        self.log_edit.append(text)

    def _on_progress(self, value, text):
        self.progress_bar.setValue(value)
        self.status_label.setText(text)
        self._append_log(f"[{value}%] {text}")

    @staticmethod
    def _to_float(value):
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0.0

    def _set_chart_mode(self, mode):
        self.chart.set_mode(mode)
        self.btn_top_in.setChecked(mode == "top_in")
        self.btn_top_out.setChecked(mode == "top_out")

    def _on_result(self, payload):
        self.all_rows = payload.get("rows", [])
        self._refresh_category_filter_options(self.all_rows)
        self._apply_category_filter()
        self.status_label.setText(f"完成 · 共 {payload.get('total_count', 0)} 条")
        self.tabs.setCurrentIndex(0)

    def _refresh_category_filter_options(self, rows):
        cats = sorted({str(r.get("category", "")) for r in rows if r.get("category")})
        self.category_filter_combo.blockSignals(True)
        self.category_filter_combo.clear()
        self.category_filter_combo.addItem("全部", "全部")
        for c in cats:
            self.category_filter_combo.addItem(c, c)
        self.category_filter_combo.blockSignals(False)

    def _apply_category_filter(self):
        selected = self.category_filter_combo.currentData()
        filtered = self.all_rows if selected in (None, "全部") else [
            x for x in self.all_rows if x.get("category") == selected
        ]
        self._fill_table(filtered)
        self.chart.set_rows(filtered)
        self.result_count_label.setText(f"共 {len(filtered)} 条")

    def _fill_table(self, rows):
        self.table.setSortingEnabled(False)
        self.table.setRowCount(len(rows))
        for r, row in enumerate(rows):
            net_in_raw = row.get("mainNetIn", "")
            total_raw = row.get("totalAmount", "")
            values = [
                row.get("category", ""),
                row.get("name", ""),
                _fmt_yuan(net_in_raw),
                _fmt_yuan(total_raw),
            ]
            for c, value in enumerate(values):
                item = QTableWidgetItem(str(value))
                if c in (2, 3):
                    item.setTextAlignment(Qt.AlignRight | Qt.AlignVCenter)
                if c == 2:
                    try:
                        fg = QColor("#16a34a") if float(net_in_raw) >= 0 else QColor("#dc2626")
                        item.setForeground(fg)
                    except (TypeError, ValueError):
                        pass
                self.table.setItem(r, c, item)
        self.table.setSortingEnabled(True)

    def _on_error(self, message):
        self._append_log(f"[ERROR] {message}")
        QMessageBox.critical(self, "运行失败", message)

    def _on_finished(self):
        self.run_button.setEnabled(True)
        if self.progress_bar.value() < 100:
            self.progress_bar.setValue(100)


def main():
    app = QApplication(sys.argv)
    window = FundflowMainWindow()
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
