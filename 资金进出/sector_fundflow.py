
import requests
import json
from datetime import datetime
import time
import os
from concurrent.futures import ThreadPoolExecutor, as_completed


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

EASTMONEY_BLOCK_FS = {
    "HY": "m:90+t:2+f:!50",
    "GN": "m:90+t:3+f:!50",
    "DY": "m:90+t:1+f:!50",
}


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
        em_data = em_resp.json()
        diff = em_data.get("data", {}).get("diff", [])

        items = []
        for row in diff:
            items.append({
                "name": _to_str(row.get("f14")),
                "mainNetIn": _to_str(row.get("f62")),
                "mainTotalIn": "",
                "mainTotalOut": "",
                "totalAmount": _to_str(row.get("f6")),
            })
        return items
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
    """
    获取板块资金流向排名（单页）

    Args:
        block_type: 板块类型 - HY(行业) / GN(概念) / DY(地域)
        page: 起始偏移量
        page_size: 每页条数（最大500）
        sort_key: 排序字段 (mainNetIn等)
        sort_type: 排序方式 (asc/desc)

    Returns:
        list[dict]: 板块资金流向数据列表
    """
    data_source = (data_source or "auto").lower()
    if data_source == "eastmoney":
        return _fetch_from_eastmoney(block_type=block_type, page=page, page_size=page_size, timeout_seconds=timeout_seconds)

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
                    print(f"[WARN] 百度接口403，切换东方财富回退源: block_type={block_type}")
                    return _fetch_from_eastmoney(
                        block_type=block_type,
                        page=page,
                        page_size=page_size,
                        timeout_seconds=timeout_seconds,
                    )
                print(f"[ERROR] 百度接口403: block_type={block_type}")
                return []

            resp.raise_for_status()
            data = resp.json()

            if data.get("ResultCode") != 0:
                print(f"[ERROR] API返回错误: {data}")
                return []

            return data.get("Result", {}).get("list", {}).get("body", [])

        except requests.RequestException as e:
            if i < attempts - 1:
                time.sleep(0.2)
                continue

            status = ""
            body = ""
            if hasattr(e, "response") and e.response is not None:
                status = f" status={e.response.status_code}"
                body = e.response.text[:200]
            print(f"[ERROR] 请求失败:{status} {e}")
            if body:
                print(f"[ERROR] 响应片段: {body}")

            if data_source == "auto":
                print(f"[WARN] 百度请求异常，切换东方财富回退源: block_type={block_type}")
                return _fetch_from_eastmoney(
                    block_type=block_type,
                    page=page,
                    page_size=page_size,
                    timeout_seconds=timeout_seconds,
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
    """自动分页获取全部数据"""
    all_items = []
    offset = 0
    while True:
        batch = fetch_sector_fundflow(
            block_type=block_type,
            page=offset,
            page_size=page_size,
            sort_key=sort_key,
            sort_type=sort_type,
            data_source=data_source,
            timeout_seconds=timeout_seconds,
            retry_count=retry_count,
        )
        if not batch:
            break
        all_items.extend(batch)
        if len(batch) < page_size:
            break  # 最后一页，不满页说明已全部获取
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
    """获取全部三类板块的资金流向数据（自动分页）"""
    result = {}
    total = len(BLOCK_TYPES)

    if concurrent_fetch:
        workers = max(1, min(int(max_workers), total))
        with ThreadPoolExecutor(max_workers=workers) as executor:
            futures = {
                executor.submit(
                    fetch_all_pages,
                    block_type=code,
                    page_size=page_size,
                    sort_key=sort_key,
                    sort_type=sort_type,
                    data_source=data_source,
                    timeout_seconds=timeout_seconds,
                    retry_count=retry_count,
                ): (name, code)
                for name, code in BLOCK_TYPES.items()
            }

            completed = 0
            for future in as_completed(futures):
                name, _ = futures[future]
                items = future.result()
                result[name] = items
                completed += 1
                print(f"  [OK] {name}板块: 获取 {len(items)} 条")
                if progress_callback:
                    progress_callback(completed, total, name, len(items))
    else:
        completed = 0
        for name, code in BLOCK_TYPES.items():
            items = fetch_all_pages(
                block_type=code,
                page_size=page_size,
                sort_key=sort_key,
                sort_type=sort_type,
                data_source=data_source,
                timeout_seconds=timeout_seconds,
                retry_count=retry_count,
            )
            result[name] = items
            completed += 1
            print(f"  [OK] {name}板块: 获取 {len(items)} 条")
            if progress_callback:
                progress_callback(completed, total, name, len(items))

    ordered = {}
    for name in BLOCK_TYPES:
        ordered[name] = result.get(name, [])
    return ordered


def display_top_n(items, title="", n=10):
    """格式化打印板块资金流向 Top N"""
    print(f"\n{'='*60}")
    print(f"  {title}  主力净流入 Top {n}")
    print(f"{'='*60}")
    print(f"{'排名':>4}  {'板块名称':<12} {'主力净流入':>12} {'主力流入':>12} {'主力流出':>12} {'总成交额':>12}")
    print(f"{'-'*4}  {'-'*12} {'-'*12} {'-'*12} {'-'*12} {'-'*12}")

    for i, item in enumerate(items[:n], 1):
        print(f"{i:>4}  {item['name']:<12} {item['mainNetIn']:>12} "
              f"{item['mainTotalIn']:>12} {item['mainTotalOut']:>12} {item['totalAmount']:>12}")


def save_to_json(data, filename=None):
    """保存数据到JSON文件"""
    if filename is None:
        today = datetime.now().strftime("%Y%m%d")
        filename = f"sector_fundflow_{today}.json"

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[SAVED] JSON -> {filename}")
    return filename


def save_to_markdown(data, filename=None, source_name="自动(百度优先，失败回退东方财富)"):
    """保存数据到Markdown文件"""
    if filename is None:
        today = datetime.now().strftime("%Y%m%d")
        filename = f"sector_fundflow_{today}.md"

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    label_map = {"行业": "行业板块", "概念": "概念板块", "地域": "地域板块"}

    lines = []
    lines.append(f"# 板块资金流向\n")
    lines.append(f"> 数据来源: {source_name} | 更新时间: {now}\n")

    # 数据总结
    lines.append("## 数据总结\n")
    lines.append("| 板块类型 | 数据条数 |")
    lines.append("|:---|---:|")
    total = 0
    for category, items in data.items():
        label = label_map.get(category, category)
        lines.append(f"| {label} | {len(items)} |")
        total += len(items)
    lines.append(f"| **合计** | **{total}** |")
    lines.append("")

    for category, items in data.items():
        label = label_map.get(category, category)
        lines.append(f"\n## {label}\n")
        lines.append(f"| 排名 | 板块名称 | 主力净流入 | 主力流入 | 主力流出 | 总成交额 |")
        lines.append(f"|:---:|:---|---:|---:|---:|---:|")

        for i, item in enumerate(items, 1):
            name = item.get("name", "")
            net_in = item.get("mainNetIn", "")
            total_in = item.get("mainTotalIn", "")
            total_out = item.get("mainTotalOut", "")
            amount = item.get("totalAmount", "")
            lines.append(f"| {i} | {name} | {net_in} | {total_in} | {total_out} | {amount} |")

        lines.append("")  # 空行分隔

    with open(filename, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"[SAVED] Markdown -> {filename}")
    return filename


def run_pipeline(
    run_mode="all_sectors",
    block_type="HY",
    page_size=500,
    sort_key="",
    sort_type="",
    data_source="auto",
    timeout_seconds=10,
    retry_count=1,
    concurrent_fetch=False,
    max_workers=3,
    save_json_enabled=True,
    save_markdown_enabled=True,
    output_prefix="sector_fundflow",
    output_dir=".",
    top_n_preview=10,
):
    if run_mode == "single_block_type":
        category = next((k for k, v in BLOCK_TYPES.items() if v == block_type), block_type)
        items = fetch_all_pages(
            block_type=block_type,
            page_size=page_size,
            sort_key=sort_key,
            sort_type=sort_type,
            data_source=data_source,
            timeout_seconds=timeout_seconds,
            retry_count=retry_count,
        )
        all_data = {category: items}
        print(f"  [OK] {category}板块: 获取 {len(items)} 条")
    else:
        all_data = fetch_all_sectors(
            page_size=page_size,
            sort_key=sort_key,
            sort_type=sort_type,
            data_source=data_source,
            timeout_seconds=timeout_seconds,
            retry_count=retry_count,
            concurrent_fetch=concurrent_fetch,
            max_workers=max_workers,
        )

    if top_n_preview > 0:
        for name, items in all_data.items():
            if items:
                display_top_n(items, title=f"【{name}板块】", n=top_n_preview)

    os.makedirs(output_dir, exist_ok=True)
    today = datetime.now().strftime("%Y%m%d")
    json_file = os.path.join(output_dir, f"{output_prefix}_{today}.json")
    md_file = os.path.join(output_dir, f"{output_prefix}_{today}.md")

    source_label_map = {
        "auto": "自动(百度优先，失败回退东方财富)",
        "baidu": "百度股市通",
        "eastmoney": "东方财富",
    }
    source_name = source_label_map.get((data_source or "auto").lower(), data_source)

    saved_json = ""
    saved_md = ""
    if save_json_enabled:
        saved_json = save_to_json(all_data, filename=json_file)
    if save_markdown_enabled:
        saved_md = save_to_markdown(all_data, filename=md_file, source_name=source_name)

    total_count = sum(len(v) for v in all_data.values())
    return {
        "data": all_data,
        "json_file": saved_json,
        "markdown_file": saved_md,
        "total_count": total_count,
        "source_name": source_name,
    }

if __name__ == "__main__":
    print(f"[板块资金流向]")
    print(f"[时间] {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

    result = run_pipeline()
    print()
    if result.get("json_file"):
        print(f"[FILE] {result['json_file']}")
    if result.get("markdown_file"):
        print(f"[FILE] {result['markdown_file']}")
