import os
import re
from typing import Dict, List, Tuple

import pandas as pd


SOURCE_DIR = r"C:\tool\Tdx MPV V1.24++\T0002\export\1day"
FILENAME_PATTERN = re.compile(r"^(BJ|SH|SZ)#(\d{6})", re.IGNORECASE)


def parse_single_file(file_path: str) -> Tuple[str, pd.DataFrame]:
    """
    解析单个通达信导出的日线文本文件，返回标准字段 DataFrame:
    date, Open, High, Low, Close, volume, amount, pct_change
    """
    with open(file_path, "r", encoding="gbk", errors="ignore") as f:
        raw_lines = [line.strip() for line in f if line.strip()]

    if len(raw_lines) < 3:
        raise ValueError(f"文件内容不足3行，无法解析: {file_path}")

    first_line = raw_lines[0]
    first_parts = first_line.split()
    stock_name = first_parts[1] if len(first_parts) >= 2 else ""

    data_lines = raw_lines[2:]
    records: List[Dict] = []

    for row in data_lines:
        parts = [x.strip() for x in row.split(",")]
        if len(parts) < 7:
            continue

        records.append(
            {
                "date": parts[0],
                "Open": float(parts[1]),
                "High": float(parts[2]),
                "Low": float(parts[3]),
                "Close": float(parts[4]),
                "volume": float(parts[5]),
                "amount": float(parts[6]),
            }
        )

    if not records:
        raise ValueError(f"没有有效K线数据行: {file_path}")

    df = pd.DataFrame(records)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"]).sort_values("date").reset_index(drop=True)

    # 涨幅 = (今天收盘价 - 昨天收盘价) / 昨天收盘价 * 100
    df["pct_change"] = ((df["Close"] - df["Close"].shift(1)) / df["Close"].shift(1) * 100).round(2)

    # 第一行无前一日收盘，按常见做法填 0.00；如需保留空值可去掉这一行
    df["pct_change"] = df["pct_change"].fillna(0.00)

    # 输出时统一两位小数（volume/amount 也保留两位便于一致性）
    for col in ["Open", "High", "Low", "Close", "volume", "amount", "pct_change"]:
        df[col] = df[col].astype(float).round(2)

    df["date"] = df["date"].dt.strftime("%Y-%m-%d")
    return stock_name, df


def load_all_stocks(source_dir: str = SOURCE_DIR) -> Dict[str, pd.DataFrame]:
    """
    批量读取目录下的股票文件，key 为如 SH600519/BJ430047，value 为该股票日线 DataFrame。
    """
    if not os.path.isdir(source_dir):
        raise FileNotFoundError(f"目录不存在: {source_dir}")

    result: Dict[str, pd.DataFrame] = {}
    for filename in os.listdir(source_dir):
        match = FILENAME_PATTERN.match(filename)
        if not match:
            continue

        market = match.group(1).upper()
        code = match.group(2)
        stock_id = f"{market}{code}"
        full_path = os.path.join(source_dir, filename)

        try:
            _, df = parse_single_file(full_path)
            result[stock_id] = df
        except Exception as e:
            print(f"[跳过] {filename}: {e}")

    return result


def build_master_table(source_dir: str = SOURCE_DIR, output_csv: str = "all_stocks_daily.csv") -> pd.DataFrame:
    """
    生成汇总总表，字段包含：
    stock_code, stock_name, o, c, h, l, pct_chg, volume, amount
    （附带 date 便于后续与RPS按日期合并）
    """
    if not os.path.isdir(source_dir):
        raise FileNotFoundError(f"目录不存在: {source_dir}")

    all_frames: List[pd.DataFrame] = []

    for filename in os.listdir(source_dir):
        match = FILENAME_PATTERN.match(filename)
        if not match:
            continue

        market = match.group(1).upper()
        code = match.group(2)
        stock_code = f"{market}{code}"
        full_path = os.path.join(source_dir, filename)

        try:
            stock_name, df = parse_single_file(full_path)
            df = df.rename(
                columns={
                    "Open": "o",
                    "Close": "c",
                    "High": "h",
                    "Low": "l",
                    "pct_change": "pct_chg",
                }
            )
            df.insert(0, "stock_code", stock_code)
            df.insert(1, "stock_name", stock_name)

            df = df[["date", "stock_code", "stock_name", "o", "c", "h", "l", "pct_chg", "volume", "amount"]]
            all_frames.append(df)
        except Exception as e:
            print(f"[跳过] {filename}: {e}")

    if not all_frames:
        raise ValueError("没有可用数据，未生成总表。")

    master_df = pd.concat(all_frames, ignore_index=True)
    master_df = master_df.sort_values(["date", "stock_code"]).reset_index(drop=True)
    master_df.to_csv(output_csv, index=False, encoding="utf-8-sig")
    return master_df


def merge_with_rps(
    daily_df: pd.DataFrame,
    rps_df: pd.DataFrame,
    on: Tuple[str, str] = ("date", "stock_code"),
    how: str = "left",
    output_csv: str = "",
) -> pd.DataFrame:
    """
    与 RPS 数据合并的框架函数（预留）：
    1) 校验并标准化关键列；
    2) 预留实际 merge 逻辑位置；
    3) 可选输出合并结果 CSV。

    参数:
        daily_df: 日线总表（建议来自 build_master_table）
        rps_df: RPS 数据表
        on: 连接键，默认 ("date", "stock_code")
        how: 合并方式，默认 left
        output_csv: 非空时将结果写出到该路径
    """
    if daily_df is None or daily_df.empty:
        raise ValueError("daily_df 为空，无法合并。")
    if rps_df is None or rps_df.empty:
        raise ValueError("rps_df 为空，无法合并。")

    left_key_1, left_key_2 = on
    required_daily_cols = {left_key_1, left_key_2}
    required_rps_cols = {left_key_1, left_key_2}

    missing_daily = required_daily_cols - set(daily_df.columns)
    missing_rps = required_rps_cols - set(rps_df.columns)
    if missing_daily:
        raise KeyError(f"daily_df 缺少关键列: {sorted(missing_daily)}")
    if missing_rps:
        raise KeyError(f"rps_df 缺少关键列: {sorted(missing_rps)}")

    left = daily_df.copy()
    right = rps_df.copy()

    # 标准化日期与代码格式，降低后续合并出错概率
    left[left_key_1] = pd.to_datetime(left[left_key_1], errors="coerce").dt.strftime("%Y-%m-%d")
    right[left_key_1] = pd.to_datetime(right[left_key_1], errors="coerce").dt.strftime("%Y-%m-%d")

    left[left_key_2] = left[left_key_2].astype(str).str.upper().str.strip()
    right[left_key_2] = right[left_key_2].astype(str).str.upper().str.strip()

    # TODO: 后续在这里补充冲突列处理、去重策略、合并后质量校验
    merged = pd.merge(left, right, on=[left_key_1, left_key_2], how=how)

    if output_csv:
        merged.to_csv(output_csv, index=False, encoding="utf-8-sig")

    return merged


if __name__ == "__main__":
    master = build_master_table()
    print(f"总表生成完成：{len(master)} 行")
    print("输出文件: all_stocks_daily.csv")
    print(master.head(3))
