# -*- coding: utf-8 -*-
"""
读取通达信板块数据

1、数据来源与含义：
- 配置目录: C:/tool/Tdx MPV V1.24++/T0002/hq_cache
- tdxzs3.cfg: 文本配置，每行格式为 板块名称|板块代码|板块类别|... ，第一列名称、第二列代码、第三列类别
- 板块类别: hy=行业(2), dq=地区(3), gn=概念(4), fg=风格(5), yjhy=一级行业(12), zs=指数(6)
- block_xx.dat: 二进制文件，存该类型下各板块名称及成分股代码列表
- tdxhy.cfg: 行业用，存每只股票与所属行业板块的对应关系

整体逻辑：
- 行业(hy)：用 tdxzs3.cfg 取板块列表 + tdxhy.cfg 按板块聚合出成分股
- 概念/风格/指数(gn/fg/zs)：用 tdxzs3.cfg 取板块列表 + block_xx.dat 取成分股，再按名称合并

注意：配置文件仅含板块 code、name，不含板块涨幅；涨幅需通过 TDX Python API（tqcenter）另行获取。

2、数据存入sqlite 数据库 'tdx_blocks.db'的 表 stock_industry，
   此表数据结构是：- block: code, name, id, date, type, change_pct, industry_code
   取时需要根据每天的9点后读完配置文件后才能取

"""
from struct import unpack
import os
import sqlite3
from datetime import datetime
import pandas as pd
from project_config import load_project_config, get_cfg

# ---------- 配置与常量 ----------
# 通达信 hq_cache 目录（可改为你的安装路径）
_CFG = load_project_config()
DATAPATH = get_cfg(
    _CFG, 'paths', 'tdx_hq_cache_dir',
    default=r'C:/tool/Tdx MPV V1.24++/T0002/hq_cache'
)

# 板块类型映射：调用方传入的拼音简写 -> tdxzs3.cfg 中第三列的数字
BLOCK_TYPE_MAPPING = {
    'hy': '2',   # 行业
    'dq': '3',   # 地区
    'gn': '4',   # 概念
    'fg': '5',   # 风格
    'yjhy': '12',  # 一级行业
    'zs': '6',   # 指数
}

# 板块类型中文名（仅用于日志或界面显示，与解析逻辑无关）
BLOCK_TYPE_NAMES = {
    'hy': '行业', 'dq': '地区', 'gn': '概念',
    'fg': '风格', 'yjhy': '一级行业', 'zs': '指数',
}

# 行业板块在 tdxzs3.cfg / tdxhy.cfg 中用于匹配的编码长度（通达信常见为 6 位，如 885001）
BLOCK_CODE_LEN = 6

# 行业编码：X/T 两套体系，取板块时把 cfg 第 6 列 industry_code 入库；type 用 2(hy)、12(yjhy) 区分
# 注意：实际数据中 type=12(一级行业) 约 400+ 条、type=2(行业) 约 100+ 条，一级行业划分更细
INDUSTRY_CODE_PREFIXES = ('X', 'T')   # 行业编码体系前缀（_code_to_api 用）


def _cfg_path(filename):
    """
    配置目录下某文件的完整路径。
    逻辑：DATAPATH 与 filename 用 os.path.join 拼接，避免手写路径和分隔符。
    """
    return os.path.join(DATAPATH, filename)


def read_cfg_lines(filepath, sep='|', encoding='gbk'):
    """
    读取 cfg 文本，按行、按 sep 分割，返回二维列表，跳过空行。
    逻辑：整文件读入 -> 去首尾空白 -> 按换行拆成行 -> 每行按 sep 拆成列，并过滤空行。
    """
    with open(filepath, 'r', encoding=encoding) as f:
        lines = f.read().strip().split('\n')
    return [line.strip().split(sep) for line in lines if line.strip()]


def get_block_zs_tdx_loc(block='hy'):
    """
    从 tdxzs3.cfg 读取板块列表。
    参数 block: 'hy'|'dq'|'gn'|'fg'|'yjhy'|'zs'，表示要取哪一类板块。
    返回: DataFrame。非 zs 时列为 name, code, block；zs 时保留全部列(name, code, type, t1, t2, block)。
    逻辑：
      1. 读 tdxzs3.cfg，解析为 name/code/type/t1/t2/block。
      2. 根据 block 查 BLOCK_TYPE_MAPPING 得到 type 数字，校验合法性。
      3. 若为指数(zs)直接返回整表；否则按 type 筛选后去掉 type/t1/t2 列返回。
    """
    rows = read_cfg_lines(_cfg_path('tdxzs3.cfg'), '|')
    if not rows:
        return pd.DataFrame(columns=['name', 'code', 'type', 't1', 't2', 'block'])

    df = pd.DataFrame(rows, columns=['name', 'code', 'type', 't1', 't2', 'block'])
    type_val = BLOCK_TYPE_MAPPING.get(block)
    if type_val is None:
        raise ValueError(f"未知板块类型: {block}，可选: {list(BLOCK_TYPE_MAPPING.keys())}")

    # 指数类返回完整表，供调用方自行处理
    if block == 'zs':
        return df

    # 按第三列 type 筛选出当前类别，去掉无用列
    sub = df.loc[df['type'] == type_val].copy()
    sub = sub.drop(columns=['type', 't1', 't2']).reset_index(drop=True)
    return sub


def get_block_file(block='gn'):
    """
    读取 block_gn.dat / block_fg.dat / block_zs.dat 等二进制板块成分。
    参数 block: 类型简写，如 gn/fg/zs，对应文件 block_gn.dat 等。
    返回: DataFrame 列 name(板块名), tp(类型), num(成分股数量), stocks(成分股代码列表)。
    二进制格式（通达信约定）：
      文件头 384 字节 + 2 字节板块个数(小端 short)；
      随后每 2813 字节一块：板块名 9 字节(GBK) + 成分股个数 2 字节 + 类别 2 字节 + 成分股代码区(每只 7 字节，连续)。
    逻辑：读全文件 -> 解析头得板块数 -> 按 2813 切块 -> 逐块解析名称、个数、代码列表。
    """
    filepath = _cfg_path(f'block_{block}.dat')
    with open(filepath, 'rb') as f:
        buff = f.read()

    # 文件头 384 字节 + 2 字节板块个数(小端)
    head = unpack('<384sh', buff[:386])
    n_blocks = head[1]
    blk = buff[386:]
    block_size = 2813
    blocks = [blk[i * block_size:(i + 1) * block_size] for i in range(n_blocks)]

    rows = []
    for bk in blocks:
        name = bk[:9].decode('gbk').strip('\x00')
        num, _ = unpack('<2h', bk[9:13])  # 成分股个数、板块类别
        # 成分股代码区：从第 13 字节起，每只 7 字节，共 num 只
        codes_bin = bk[13:13 + 7 * num]
        stks = codes_bin.decode('gbk').replace('\x00', ' ').split()
        rows.append([name, block, num, stks])

    return pd.DataFrame(rows, columns=['name', 'tp', 'num', 'stocks'])


# 概念/风格/指数板块中需要从结果里排除的板块名称（与 cfg/dat 中名称一致）
DEL_ROWS = {
    'gn': ['GDR'],
    'fg': ['沪股通SH', '深股通SZ', '融资融券'],
    'zs': [],
}

# 板块名称替换：cfg/dat 中的名称 -> 希望展示的名称（用于与 tdxzs3 名称统一或美化）
NAME_REPLACE = {
    'gn': {
        '半导体': '半导体及元件',
        '元宇宙': '元宇宙概念',
        '新能源': '新能源汽车',
        '宁德时代': '宁德时代概念',
        '新冠药': '新冠药概念',
        '中芯国际': '中芯国际概念',
        '东数西算': '东数西算概念',
        '数字经济': '数字经济概念',
        '装配建筑': '装配式建筑',
    },
    'fg': {
        '北交所': '北交所概念',
        '新疆板块': '新疆指数概念',
    },
    'zs': {},
}


def gn_block(blk='gn'):
    """
    获取概念(gn)/风格(fg)/指数(zs)板块及成分股。
    参数 blk: 'gn'|'fg'|'zs'。
    返回: DataFrame，含板块名、代码、成分股数量、成分股列表等；zs 时仅来自 dat，无 cfg 合并。
    逻辑：
      1. 从 block_xx.dat 读板块及成分股(bf)。
      2. 按 DEL_ROWS 去掉不需要的板块行；按 NAME_REPLACE 统一板块名称，便于与 cfg 对齐。
      3. 从 tdxzs3.cfg 读该类型板块列表(t)。
      4. 若为指数(zs)不合并 cfg，直接返回 bf；否则用 name 把 t 与 bf 合并后返回。
    """
    bf = get_block_file(blk)
    if blk in DEL_ROWS and DEL_ROWS[blk]:
        bf = bf[~bf['name'].isin(DEL_ROWS[blk])]
    if blk in NAME_REPLACE and NAME_REPLACE[blk]:
        bf['name'] = bf['name'].replace(NAME_REPLACE[blk])

    t = get_block_zs_tdx_loc(blk)
    if blk == 'zs':
        return bf
    if 'block' in t.columns:
        t = t.drop(columns=['block'])
    return pd.merge(t, bf, on='name')


def get_stock_hyblock_tdx_loc():
    """
    从 tdxhy.cfg 读取个股与行业板块对应关系（仅行业用此文件）。
    返回: DataFrame 列 code(股票代码), block(板块名), block_prefix(板块编码前 BLOCK_CODE_LEN 位，用于与 tdxzs3 匹配)。
    逻辑：读 cfg 按 | 分割 -> 取 code 与 block 列 -> 过滤 block 为空 -> 增加 block_prefix 便于与 tdxzs3 的板块编码匹配。
    """
    rows = read_cfg_lines(_cfg_path('tdxhy.cfg'), '|')
    if not rows:
        return pd.DataFrame(columns=['code', 'block', 'block_prefix'])

    df = pd.DataFrame(rows, columns=['c0', 'code', 'block', 'c1', 'c2', 'c3'])
    df = df[['code', 'block']].copy()
    df = df[df['block'].str.len() > 0]
    df['block_prefix'] = df['block'].str[:BLOCK_CODE_LEN]
    return df


def hy_block(blk='hy'):
    """
    获取行业板块及成分股列表（行业没有 block_hy.dat，需用 tdxhy.cfg 反推）。
    参数 blk: 一般为 'hy'。
    返回: DataFrame，每行一板块，含 name/code/block/block_prefix/num/stocks，其中 num 为成分股数，stocks 为代码列表字符串。
    逻辑：
      1. 从 tdxhy.cfg 得到每只股票所属板块(stocklist)；从 tdxzs3.cfg 得到行业板块列表(blocklist)。
      2. 为 blocklist 增加 block_prefix(板块编码前 BLOCK_CODE_LEN 位)、num、stocks 列并初始化为 0 和空。
      3. 遍历每个板块：若 block 长度为 BLOCK_CODE_LEN（如 6 位）则用 block_prefix 与 stocklist 匹配，否则用完整 block 匹配，筛出成分股后填 num 和 stocks。
      4. 去掉成分股数为 0 的板块后返回。
    """
    stocklist = get_stock_hyblock_tdx_loc()
    blocklist = get_block_zs_tdx_loc(blk).copy()
    blocklist['block_prefix'] = blocklist['block'].str[:BLOCK_CODE_LEN]
    blocklist['num'] = 0
    blocklist['stocks'] = ''

    for i in range(len(blocklist)):
        blockkey = blocklist.iat[i, 2]  # 'block' 列（板块编码，常见为 6 位如 885001）
        if len(blockkey) == BLOCK_CODE_LEN:
            datai = stocklist[stocklist['block_prefix'] == blockkey]
        else:
            datai = stocklist[stocklist['block'] == blockkey]
        datai = datai.sort_values(by='code', ascending=True)
        codelist = datai['code'].tolist()
        blocklist.iat[i, 4] = len(codelist)
        blocklist.iat[i, 5] = str(codelist)

    blocklist = blocklist[blocklist['num'] > 0].reset_index(drop=True)
    return blocklist


# ---------------------------------------------------------------------------
# TdxBlockDb：行业/概念板块入库（SQLite）
# ---------------------------------------------------------------------------

class TdxBlockDb:
    """
    从 tdxzs3.cfg / tdxhy.cfg 读取行业、概念、一级行业板块及个股行业，存入 SQLite。

    数据来源说明：
    - 配置文件（tdxzs3.cfg 等）：仅提供 code、name，不含板块涨幅
    - 板块当日涨幅（change_pct）：需后续调用 TDX Python API 获取
    - tdxhy.cfg：每只股票对应的行业（市场|代码|通达信新行业|申万行业）

    表结构：
    - block: code, name, id, date, type, change_pct, industry_code
    - stock_industry: id, code, name, date, T_industry_code, X_industry_code, chg_pct（涨幅后续 API 更新）
    """

    TABLE_NAME = 'block'
    STOCK_INDUSTRY_TABLE = 'stock_industry'
    VALID_TYPES = ('hy', 'gn', 'yjhy')

    def __init__(self, db_path, datapath=None, check_same_thread=True):
        """
        :param db_path: SQLite 数据库文件路径
        :param datapath: 通达信 hq_cache 目录，默认使用模块级 DATAPATH
        :param check_same_thread: 是否允许多线程共享连接，默认 False
        """
        self.db_path = db_path
        self.datapath = datapath or DATAPATH
        self.check_same_thread = check_same_thread  # True 可避免 Python 3.13 退出时线程清理异常
        self.conn = None
        self.cursor = None

    def connect(self):
        """建立数据库连接"""
        if self.conn is None:
            self.conn = sqlite3.connect(
                self.db_path,
                check_same_thread=self.check_same_thread
            )
            self.cursor = self.conn.cursor()
        return self.conn

    def close(self):
        """关闭数据库连接"""
        if self.conn:
            self.conn.close()
            self.conn = None
            self.cursor = None

    def init_db(self):
        """
        初始化 block 表，若已存在则跳过。
        表结构：id, code, name, date, type, change_pct
        """
        self.connect()
        self.cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS {self.TABLE_NAME} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL,
                name TEXT NOT NULL,
                date TEXT NOT NULL,
                type TEXT NOT NULL,
                change_pct REAL,
                industry_code TEXT
            )
        """)
        self.cursor.execute(
            f"CREATE INDEX IF NOT EXISTS idx_block_type ON {self.TABLE_NAME}(type)"
        )
        self.cursor.execute(
            f"CREATE INDEX IF NOT EXISTS idx_block_date ON {self.TABLE_NAME}(date)"
        )
        # 兼容旧表：无 change_pct、industry_code 列时自动添加
        for col, ctype in [('change_pct', 'REAL'), ('industry_code', 'TEXT')]:
            try:
                self.cursor.execute(f"ALTER TABLE {self.TABLE_NAME} ADD COLUMN {col} {ctype}")
                self.conn.commit()
            except sqlite3.OperationalError:
                pass  # 列已存在
        self._init_stock_industry_table()
        self.conn.commit()

    def _init_stock_industry_table(self):
        """初始化 stock_industry 表：id, code, name, date, T_industry_code, X_industry_code, chg_pct"""
        self.cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS {self.STOCK_INDUSTRY_TABLE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL,
                name TEXT,
                date TEXT NOT NULL,
                T_industry_code TEXT,
                X_industry_code TEXT,
                chg_pct REAL
            )
        """)
        self.cursor.execute(
            f"CREATE INDEX IF NOT EXISTS idx_stock_industry_code ON {self.STOCK_INDUSTRY_TABLE}(code)"
        )
        self.cursor.execute(
            f"CREATE INDEX IF NOT EXISTS idx_stock_industry_date ON {self.STOCK_INDUSTRY_TABLE}(date)"
        )
        for col, ctype in [('T_industry_code', 'TEXT'), ('X_industry_code', 'TEXT'), ('chg_pct', 'REAL')]:
            try:
                self.cursor.execute(f"ALTER TABLE {self.STOCK_INDUSTRY_TABLE} ADD COLUMN {col} {ctype}")
                self.conn.commit()
            except sqlite3.OperationalError:
                pass

    def _cfg_path(self, filename):
        """配置目录下某文件的完整路径"""
        return os.path.join(self.datapath, filename)

    def _read_cfg_lines(self, filepath, sep='|', encoding='gbk'):
        """读取 cfg 文本，按行、按 sep 分割，返回二维列表"""
        with open(filepath, 'r', encoding=encoding) as f:
            lines = f.read().strip().split('\n')
        return [line.strip().split(sep) for line in lines if line.strip()]

    @staticmethod
    def _code_to_api(code):
        """将 cfg 中的板块代码转为 tqcenter API 格式。88xxxx -> 880301.SH；X/T 打头的行业编码不转。"""
        code = str(code).strip()
        if not code:
            return ''
        if '.' in code:
            return code
        c0 = code.upper()[0] if code else ''
        if c0 in INDUSTRY_CODE_PREFIXES:
            return code  # X01、T0101 等行业编码不追加后缀
        if code.startswith('88'):
            return code + '.SH'
        return code + '.SH'  # 默认 .SH

    def _get_blocks_from_cfg(self, block_type):
        """
        从 tdxzs3.cfg 读取指定类型的板块列表。
        type=2(hy)、type=12(yjhy)；第 6 列 block 存为 industry_code（X15、T0101 等）。
        :param block_type: 'hy'、'gn' 或 'yjhy'
        :return: DataFrame 列 name, code；hy、yjhy 时多一列 industry_code
        """
        type_val = BLOCK_TYPE_MAPPING.get(block_type)
        if type_val is None or block_type not in self.VALID_TYPES:
            raise ValueError(f"block_type 必须为 hy、gn 或 yjhy，当前: {block_type}")

        filepath = self._cfg_path('tdxzs3.cfg')
        rows = self._read_cfg_lines(filepath, '|')
        if not rows:
            cols = ['name', 'code', 'industry_code'] if block_type in ('hy', 'yjhy') else ['name', 'code']
            return pd.DataFrame(columns=cols)

        # 确保每行至少有 6 列，不足则补空
        def _pad_row(r):
            r = list(r)
            while len(r) < 6:
                r.append('')
            return r[:6]

        rows = [_pad_row(r) for r in rows]
        df = pd.DataFrame(rows, columns=['name', 'code', 'type', 't1', 't2', 'block'])
        sub = df.loc[df['type'] == type_val].copy()
        if block_type in ('hy', 'yjhy'):
            sub['industry_code'] = sub['block'].str.strip()
            sub = sub[['name', 'code', 'industry_code']].reset_index(drop=True)
        else:
            sub = sub[['name', 'code']].reset_index(drop=True)
        return sub

    def _fetch_block_change_pct(self, code):
        """通过 tqcenter 获取板块当日涨幅(%)，失败返回 None"""
        try:
            api_code = self._code_to_api(code)
            snapshot = tq.get_market_snapshot(api_code)
            if not snapshot or 'Now' not in snapshot or 'LastClose' not in snapshot:
                return None
            now_p = float(snapshot['Now'])
            last = float(snapshot['LastClose'])
            if last <= 0:
                return None
            return round((now_p - last) / last * 100, 2)
        except Exception:
            return None

    def update_blocks(self, fetch_change_pct=False, sleep_per_block=0.03):
        """
        从 tdxzs3.cfg 读取行业、概念、一级行业板块，全量刷新 block 表。
        配置文件只提供 code、name；若需板块涨幅，需 fetch_change_pct=True 并调用 TDX Python API。
        :param fetch_change_pct: 是否通过 tqcenter.get_market_snapshot 获取板块当日涨幅（需通达信运行）
        :param sleep_per_block: 获取涨幅时每块间隔秒数，避免请求过快
        """
        import time
        self.connect()
        today = datetime.now().strftime('%Y-%m-%d')

        try:
            self.cursor.execute(f"DELETE FROM {self.TABLE_NAME}")
            rows_to_insert = []

            for block_type in self.VALID_TYPES:
                df = self._get_blocks_from_cfg(block_type)
                for _, row in df.iterrows():
                    code = str(row['code']).strip()
                    name = str(row['name']).strip()
                    if not code or not name:
                        continue
                    industry_code = None
                    if block_type in ('hy', 'yjhy') and 'industry_code' in row and pd.notna(row.get('industry_code')):
                        ic = str(row['industry_code']).strip()
                        industry_code = ic if ic else None
                    change_pct = None
                    if fetch_change_pct:
                        change_pct = self._fetch_block_change_pct(code)
                        time.sleep(sleep_per_block)
                    rows_to_insert.append((code, name, today, block_type, change_pct, industry_code))

            if rows_to_insert:
                self.cursor.executemany(
                    f"INSERT INTO {self.TABLE_NAME} (code, name, date, type, change_pct, industry_code) VALUES (?, ?, ?, ?, ?, ?)",
                    rows_to_insert
                )
            self.conn.commit()
            return len(rows_to_insert)
        except Exception as e:
            self.conn.rollback()
            raise RuntimeError(f"更新板块数据失败: {e}") from e

    def _read_tdxhy_stocks(self):
        """
        从 tdxhy.cfg 读取每只股票对应的行业。
        格式：市场|股票代码|通达信新行业|申万行业|...（至少 4 列，部分版本 6 列）
        T 系列：T01、T0101；X 系列：X15、X1501；申万：6 位数字。从各列中识别并入库。
        返回: list of (code, T_industry_code, X_industry_code)，code 无后缀
        """
        filepath = self._cfg_path('tdxhy.cfg')
        rows = self._read_cfg_lines(filepath, '|')
        if not rows:
            return []
        result = []
        for r in rows:
            r = list(r)
            while len(r) < 4:
                r.append('')
            code = str(r[1]).strip()
            if not code:
                continue
            # 股票代码不加 .SZ/.SH 后缀
            t_ind, x_ind = None, None
            for i in range(2, len(r)):
                v = str(r[i]).strip()
                if not v:
                    continue
                if v.upper().startswith('T'):
                    t_ind = v  # 已含 T 前缀，原样存储
                elif v.upper().startswith('X'):
                    x_ind = v  # 已含 X 前缀，原样存储
                elif len(v) == 6 and v.isdigit() and not v.startswith('88'):
                    x_ind = v  # 申万 6 位数字（非 88 开头），存入 X_industry_code
                elif (len(v) == 2 or len(v) == 4) and v.isdigit():
                    # 2/4 位数字无前缀：按出现顺序补上 T/X 前缀
                    if t_ind is None:
                        t_ind = 'T' + v
                    elif x_ind is None:
                        x_ind = 'X' + v
            result.append((code, t_ind, x_ind))
        return result

    def update_stock_industry(self):
        """
        从 tdxhy.cfg 读取每只股票对应的行业，全量刷新 stock_industry 表。
        早上 9 点读 cfg 时无涨幅，chg_pct 留空；后续用 TDX Python API 更新。
        """
        self.connect()
        today = datetime.now().strftime('%Y-%m-%d')
        rows_data = self._read_tdxhy_stocks()
        try:
            self.cursor.execute(f"DELETE FROM {self.STOCK_INDUSTRY_TABLE}")
            if rows_data:
                self.cursor.executemany(
                    f"INSERT INTO {self.STOCK_INDUSTRY_TABLE} (code, name, date, T_industry_code, X_industry_code, chg_pct) "
                    f"VALUES (?, ?, ?, ?, ?, ?)",
                    [(code, '', today, t_ind, x_ind, None) for code, t_ind, x_ind in rows_data]
                )
            self.conn.commit()
            return len(rows_data)
        except Exception as e:
            self.conn.rollback()
            raise RuntimeError(f"更新股票行业数据失败: {e}") from e

    def get_stock_industry(self, as_dataframe=True):
        """从 stock_industry 表获取股票行业列表"""
        self.connect()
        self.cursor.execute(
            f"SELECT id, code, name, date, T_industry_code, X_industry_code, chg_pct FROM {self.STOCK_INDUSTRY_TABLE} ORDER BY code"
        )
        rows = self.cursor.fetchall()
        cols = ['id', 'code', 'name', 'date', 'T_industry_code', 'X_industry_code', 'chg_pct']
        if as_dataframe:
            return pd.DataFrame(rows, columns=cols)
        return [dict(zip(cols, r)) for r in rows]

    def get_blocks(self, block_type=None, as_dataframe=True):
        """
        从数据库获取板块列表。
        :param block_type: None 表示全部，'hy' 仅行业，'gn' 仅概念，'yjhy' 仅一级行业
        :param as_dataframe: True 返回 DataFrame，False 返回 list of dict
        :return: DataFrame 或 list[dict]，含 change_pct 列
        """
        self.connect()
        if block_type is not None and block_type not in self.VALID_TYPES:
            raise ValueError(f"block_type 必须为 None、hy、gn 或 yjhy，当前: {block_type}")

        sql = f"SELECT id, code, name, date, type, change_pct, industry_code FROM {self.TABLE_NAME}"
        params = []
        if block_type:
            sql += " WHERE type = ?"
            params.append(block_type)
        sql += " ORDER BY type, id"

        self.cursor.execute(sql, params)
        rows = self.cursor.fetchall()
        cols = ['id', 'code', 'name', 'date', 'type', 'change_pct', 'industry_code']

        if as_dataframe:
            return pd.DataFrame(rows, columns=cols)
        return [dict(zip(cols, r)) for r in rows]

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
        return False


if __name__ == '__main__':
    import sys

    # 1. 板块入库到 SQLite（行业 + 概念 + 一级行业）
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'tdx_blocks.db')
    db = TdxBlockDb(db_path, datapath=DATAPATH)
    fetch_change = '--fetch-change' in sys.argv
    if fetch_change:
        try:
            import tqcenter as tq
            tq.initialize(__file__)
        except Exception as e:
            print(f'警告: 无法初始化 tqcenter，将不获取板块涨幅: {e}')
            fetch_change = False

    try:
        db.connect()
        db.init_db()
        n = db.update_blocks(fetch_change_pct=fetch_change)
        print(f'已更新板块数据: {n} 条 (行业+概念+一级行业)')
        n_stock = db.update_stock_industry()
        print(f'已更新股票行业数据: {n_stock} 条 (chg_pct 待 API 更新)')
        df_all = db.get_blocks(block_type=None)
        print(df_all.head(10))
        df_hy = db.get_blocks(block_type='hy')
        df_gn = db.get_blocks(block_type='gn')
        df_yjhy = db.get_blocks(block_type='yjhy')
        print(f'行业板块: {len(df_hy)} 个, 概念板块: {len(df_gn)} 个, 一级行业: {len(df_yjhy)} 个')
        df_stock = db.get_stock_industry()
        if len(df_stock) > 0:
            print(df_stock.head(5))
        if fetch_change and 'change_pct' in df_all.columns:
            valid = df_all['change_pct'].notna().sum()
            print(f'已获取涨幅: {valid}/{n} 个板块')
    finally:
        db.close()

    # 2. 可选：导出带成分股的 Excel（原有逻辑）
    if '--export-excel' in sys.argv:
        blocks = ['hy', 'gn']
        for block in blocks:
            if block == 'hy':
                result = hy_block(block)
            else:
                result = gn_block(block)
            out_file = f'{block}block.xlsx'
            result.to_excel(out_file, index=False)
            print(f'已导出: {out_file}')

    # 规避 Python 3.13 解释器退出时 threading 清理顺序导致的 TypeError
    sys.exit(0)
