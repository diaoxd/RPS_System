# `rps_report_final_01.py` 详细说明

本文档用于解释 `rps_report_final_01.py` 的整体设计、数据流、每个方法的职责与实现思路，便于后续维护与调试。

---

## 1. 脚本目标与输出

该脚本用于生成“RPS 多周期板块分析报告”：

- 数据来源：
  - `Tdx_ext_data_reader.py` 提供板块 `code` 对应的 `RPS120/RPS60/RPS20/RPS5`
  - `read_tdx_blocks.py` 的 SQLite `block` 表提供 `code -> name/type`
- 输出：
  - 主报告：`reports/RPS_多周期分析报告_01.html`
  - 每个板块的独立走势图：`reports/charts/*.html`

---

## 2. 整体流程（主链路）

主函数 `main()` 的流程可概括为 5 步：

1. 读取扩展数据（RPS 宽表）
2. 按扩展数据中的 `code` 去 block 库取板块名称和类型（带缓存）
3. 合并成报告分析用的长表（按日期逐行）
4. 按规则划分核心/趋势/新生池，并构建历史展示结构
5. 生成独立图表 + 拼接主报告 HTML

---

## 3. 配置与路径初始化

### `_CFG`（模块级）
- **作用**：从 `project_config.json` 读取统一配置。
- **实现思路**：脚本启动时一次读取，后续所有路径、时间、输出参数都从这里取，减少硬编码。

### `TDX_ANALYSIS_DIR / PROJECT_ROOT / WORKFLOW_DIR`
- **作用**：定位外部模块和数据库路径。
- **实现思路**：
  - 优先环境变量
  - 其次配置文件
  - 最后默认值
  - 再加入 `sys.path`，确保能 `import` 成功。

### `WORKSPACE_ROOT / REPORTS_FOLDER / CHARTS_FOLDER / MAX_DAYS / DEFAULT_DAYS / OUTPUT_FILENAME`
- **作用**：控制报告输出目录和分析窗口长度。
- **实现思路**：统一从配置读取，缺失时有默认值。

### `READ_TDX_BLOCKS_TIME / READ_TDX_RPS_TIMES`
- **作用**：向外暴露调度时间配置（在日志中打印，供 web 层调度参考）。

### `CACHE_DIR`
- **作用**：存放 `block` 表元数据缓存文件（`code->name/type`）。

---

## 4. 方法级说明（Python 方法逐个解释）

以下按代码顺序说明。

---

### 4.1 `load_merged_rps_from_tdx(base_dir=None)`

- **做什么**：
  - 调 `Tdx_ext_data_reader.load_all_rps_merged`，读出宽表：
    - `code, date, RPS120, RPS60, RPS20, RPS5`
- **输入**：
  - `base_dir`：可选扩展数据目录
- **输出**：
  - `DataFrame`（宽表）
- **实现思路**：
  - 延迟 import，避免脚本一启动就因为路径问题崩掉
  - 目录未传时用 `DEFAULT_EXTDATA_DIR`
  - 开启 `scale_0_100=True`，统一 RPS 范围

---

### 4.2 `_normalize_code(c)`

- **做什么**：
  - 统一板块代码格式
- **输入**：任意类型 `c`
- **输出**：6 位字符串代码（空值返回空字符串）
- **实现思路**：
  - 去空白
  - 截断到前 6 位
  - `zfill(6)` 左侧补零
- **为什么要有它**：
  - extdata、sqlite、cfg 的代码格式可能不一致，先归一再匹配可提高命中率。

---

### 4.3 `_tdx_blocks_db_path()`

- **做什么**：解析 `tdx_blocks.db` 的真实路径。
- **输入**：无
- **输出**：数据库文件路径字符串
- **实现思路（优先级）**：
  1. 环境变量 `TDX_BLOCKS_DB`
  2. 配置 `paths.tdx_blocks_db`
  3. `WORKFLOW_DIR/tdx_blocks.db`
  4. 当前脚本同目录 `tdx_blocks.db`
  5. 最后兜底返回 `WORKFLOW_DIR/tdx_blocks.db`

---

### 4.4 `_block_meta_cache_path(db_path)`

- **做什么**：
  - 根据数据库文件 `mtime` 生成缓存文件名
- **输入**：`db_path`
- **输出**：缓存文件路径，例如 `cache/block_meta_cache_1773xxxx.json`
- **实现思路**：
  - 缓存 key 绑定 `db` 修改时间
  - 当库更新时文件名自然变化，旧缓存自动“失效”

---

### 4.5 `_load_all_block_meta_from_db(db_path)`

- **做什么**：
  - 一次性读取 `block` 表，构建全量 `code->name/type` 映射
- **输入**：`db_path`
- **输出**：`dict`，结构 `norm_code -> {'name', 'type'}`
- **实现思路**：
  1. `TdxBlockDb.get_blocks(None)` 读全量
  2. 代码归一化 `_normalize_code`
  3. 按 `date` 降序 + `drop_duplicates('_c')` 保留最新记录
  4. `type` 从 `hy/gn/yjhy` 映射到中文
- **价值**：
  - 后续按 code 查询时不用反复扫库，提高性能。

---

### 4.6 `preload_block_meta_cache()`

- **做什么**：
  - 主动预热 `block` 元数据缓存文件
- **输入**：无
- **输出**：状态字典（包含缓存路径和条数）
- **实现思路**：
  - 先找库文件
  - 如果对应缓存已存在直接复用
  - 否则全量读取并写 json 缓存
- **典型场景**：
  - web 端在固定时间点（如 09:01）提前预热，减少首次访问延迟。

---

### 4.7 `load_block_meta_from_db_for_codes(codes)`

- **做什么**：
  - 给定一批代码，只返回这些代码的名称/类型映射
- **输入**：
  - `codes`：来自 extdata 的 code 集合
- **输出**：
  - `(code_to_meta, n_hit_db)`
    - `code_to_meta`：每个 code 的 `name/type`（查不到时用 code 占位）
    - `n_hit_db`：在库中命中的数量
- **实现思路**：
  1. 先归一化 code
  2. 先读缓存文件；缓存损坏则重建
  3. 从全量 `all_meta` 里子集化成目标字典
  4. 统计命中数并返回

---

### 4.8 `build_block_rps_from_merged_extdata(merged_df, code_to_meta, max_days=MAX_DAYS)`

- **做什么**：
  - 把 ext 宽表 + 名称映射，转换为报告分析用“长表”
- **输入**：
  - `merged_df`：`code,date,RPS*`
  - `code_to_meta`：`code->name/type`
  - `max_days`：最多保留最近多少交易日
- **输出**：
  - `DataFrame` 列：
    - `代码, 名称, 类型, 日期, RPS120, RPS60, RPS20, RPS5`
- **实现思路**：
  1. 仅保留 `code_to_meta` 中存在的代码
  2. 日期只取最近 `max_days`
  3. 逐行生成输出记录，RPS 值保留 1 位小数
  4. 4 个 RPS 全为空的行丢弃

---

### 4.9 `identify_pools(df)`

- **做什么**：
  - 对“某一天”的板块集合进行分池：核心/趋势/新生
- **输入**：单日 DataFrame
- **输出**：`dict`，`名称 -> 池标签`
- **实现思路（规则）**：
  - 核心：
    - `RPS120 > 90`
    - `RPS60 > 90`
    - `RPS20 > 85`
    - `RPS5 > 85`
  - 新生：
    - `RPS20 > 90` 且 `RPS5 > 95` 且 `RPS120 < 80`
  - 趋势：
    - `RPS60 > 90` 且 `RPS20 > 85`
    - 且不属于核心、不属于新生

---

### 4.10 `prepare_historical_data(multi_df)`

- **做什么**：
  - 把长表整理成前端可直接渲染的历史结构
- **输入**：全时段长表 `multi_df`
- **输出**：
  - `blocks_by_tag`：按池分组的板块历史序列
  - `all_dates_str`：日期字符串数组
  - `latest_pool_map`：最新一天板块所属池
  - `transitions`：相邻两日池子变动明细
- **实现思路**：
  1. 逐日调用 `identify_pools` 得出每日池成员
  2. 合并得到每个池“历史出现过”的板块全集
  3. 对每个板块每个日期算 4 周期平均值（用于排序展示）
  4. 只在“该日期属于该池”时保留值，否则置空

---

### 4.11 `get_detailed_transitions(multi_df)`

- **做什么**：
  - 生成“相对前一交易日”的新增/退出说明
- **输入**：全时段长表
- **输出**：
  - `dict`：按池标签分组，包含 `新增`/`退出` 列表
- **实现思路**：
  1. 只比较最后两天
  2. 对每个板块拿到 `(前日池, 当日池)`
  3. 当日有、前日无 => 新晋
  4. 当日有、前日有且不同 => 来自某池
  5. 前日有、当日无 => 退出
  6. 前日有、当日有且不同 => 去向某池

---

### 4.12 `generate_block_chart_file(block_name, block_type, history_df, output_folder)`

- **做什么**：
  - 为单个板块生成独立 Plotly 走势图 HTML
- **输入**：
  - 板块名、类型、历史 DataFrame、输出目录
- **输出**：
  - 生成后的文件名
- **实现思路**：
  - 画四条线（RPS120/60/20/5）
  - 配置日期 range selector + range slider
  - 名称中非法路径字符替换为 `_`
  - 落盘到 `reports/charts/`

---

### 4.13 `main()`

- **做什么**：
  - 执行整个报告生成流程
- **输入**：无（依赖配置和文件系统）
- **输出**：主报告 HTML + 独立图表 + 控制台日志
- **实现思路**：
  1. 打印配置时间（板块读取时间、RPS读取时间）
  2. 读取 ext 宽表
  3. 根据 ext 代码加载板块映射（缓存优先）
  4. 构建分析长表
  5. 计算分池历史数据与变动
  6. 给最新池子生成独立图表
  7. 组装前端 HTML 模板并写入报告文件

---

## 5. 数据结构约定

### 5.1 `merged_rps`（宽表）
- 列：`code,date,RPS120,RPS60,RPS20,RPS5`
- 每行是某代码某日期的一组 RPS

### 5.2 `code_to_meta`
- 结构：`{code: {'name': '板块名', 'type': '行业/概念/一级行业'}}`

### 5.3 `multi_df`（分析长表）
- 列：`代码, 名称, 类型, 日期, RPS120, RPS60, RPS20, RPS5`

### 5.4 `blocks_by_tag`
- 前端消费结构，按池标签组织板块历史数据

---

## 6. HTML/前端模板逻辑（嵌入在 `main`）

`main` 里用 f-string 拼接了完整 HTML/JS，核心行为：

- 三个标签页（核心/趋势/新生）
- 日期范围筛选
- 每日按平均 RPS 排序并显示排名
- 显示相对前一日的新增/退出
- 单击高亮同名板块，双击打开独立走势图

这是“脚本一体化”实现，优点是部署简单；缺点是模板较长、后续维护建议拆分成独立模板文件。

---

## 7. 常见问题与排查建议

### 7.1 `multi_df` 为空
- 先检查 extdata 是否有数据
- 再检查 extdata 的 `code` 是否能与 block 表 code 匹配（归一化后）

### 7.2 板块名称显示成代码
- 说明 `load_block_meta_from_db_for_codes` 未命中
- 检查 `tdx_blocks.db` 路径是否正确、`block` 表是否已更新

### 7.3 缓存不生效
- 缓存文件在 `cache/block_meta_cache_*.json`
- 数据库更新时间变化会生成新缓存文件（这是设计行为）

### 7.4 独立走势图打不开
- 看 `reports/charts` 是否有对应文件
- 注意板块名中非法字符会被替换为 `_`

---

## 8. 可维护性建议（后续可选）

1. 将 HTML 模板拆到单独文件（Jinja2 或静态模板）
2. 将“分池规则”抽成配置项，便于策略迭代
3. 将日志改成标准 `logging`，便于 web 场景采集
4. 为关键方法补最小单元测试（尤其是 code 匹配、缓存命中、池子规则）

