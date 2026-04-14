#coding=utf-8
import configparser
import re

import pymssql
import pyodbc
from sqlalchemy import create_engine
import pandas as pd
from sqlalchemy.sql import text as sql_text
from datetime import datetime, timedelta


class DBHelper():

    def __init__(self,db_host,db_name,db_user,db_password):



        self.db_host= db_host
        self.db_name = db_name
        self.db_user = db_user
        self.db_password = db_password
        
        # 自动检测可用的ODBC驱动
        self.driver = self._detect_odbc_driver()
        
        self.conn_str = (
            f"DRIVER={{{self.driver}}};" + 
            f"SERVER={db_host};" + 
            f"DATABASE={db_name};" + 
            f"UID={db_user};" + 
            f"PWD={db_password};" + 
            f"Encrypt=No"
        )
    
    def _detect_odbc_driver(self):
        """
        自动检测可用的SQL Server ODBC驱动
        
        Returns:
            str: 可用的驱动名称
        """
        try:
            import pyodbc
            # 按优先级顺序检查驱动
            preferred_drivers = [
                "ODBC Driver 17 for SQL Server",
                "ODBC Driver 18 for SQL Server",
                "ODBC Driver 13 for SQL Server",
                "SQL Server Native Client 11.0",
                "SQL Server Native Client 10.0",
                "SQL Server"
            ]
            
            available_drivers = [x for x in pyodbc.drivers()]
            
            # 查找第一个可用的驱动
            for driver in preferred_drivers:
                if driver in available_drivers:
                    print(f"使用ODBC驱动: {driver}")
                    return driver
            
            # 如果没有找到首选驱动，查找任何包含"SQL Server"的驱动
            sql_server_drivers = [x for x in available_drivers if 'SQL Server' in x]
            if sql_server_drivers:
                print(f"使用ODBC驱动: {sql_server_drivers[0]}")
                return sql_server_drivers[0]
            
            # 如果都没有，返回默认驱动（可能会失败，但至少会给出明确的错误）
            print("警告: 未找到SQL Server ODBC驱动，使用默认驱动")
            return "ODBC Driver 17 for SQL Server"
            
        except Exception as e:
            print(f"检测ODBC驱动时出错: {e}")
            # 返回默认驱动
            return "ODBC Driver 17 for SQL Server"
######################################################
##                   data connection                ##
######################################################
    def get_connection(self):
        return pyodbc.connect(self.conn_str)

    def get_engine(self):
        # 将驱动名称中的空格替换为+号，用于URL编码
        driver_url = self.driver.replace(' ', '+')
        str_format = "mssql+pyodbc://{0}:{1}@{2}/{3}?driver={4}&TrustServerCertificate=yes&Encrypt=No"
        connection_str = str_format.format(self.db_user, self.db_password, self.db_host, self.db_name, driver_url)
        engine = create_engine(connection_str, echo=False)
        return engine

######################################################
##                common SQL APIs                   ##
######################################################
    # def write_data(self, df, table_name):
    #     with self.get_connection() as conn:
    #         cursor = conn.cursor()
    #         # 快速批量插入
    #         cursor.fast_executemany = True
    #         placeholders = ",".join(["?"] * len(df.columns))
    #         sql = f"INSERT INTO {table_name} VALUES ({placeholders})"
    #         # print(df.values.dtypes)
    #         cursor.executemany(sql, df.values.tolist())
    #         conn.commit()



    def write_data(self, df, table_name):

        with self.get_connection() as conn:
            cursor = conn.cursor()
            # 获取列名（可选，如果表结构需要指定列名）
            # 股票代码, 股票名称,  涨幅, 涨速, 主力净额, 领涨次数, 领涨, 主力, 连板,  主题,  板块编码,  板块名称, 板块强度, 板块涨幅, 选出来的时间
            if(table_name=='stocks_kpl'):
                columns = "code, name,theme,change,speed,zt_times,leader_position,main,blk_code,blk_name,blk_strength,blk_level,choose_time"

                # columns = ",".join(df.columns)
                placeholders = ",".join(["?"] * len(df.columns))
                sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"

            elif(table_name=='block'):
                columns = "blk_code,blk_name,strength,change,zt_numbers,time"
                placeholders = ",".join(["?"] * len(df.columns))
                sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
            elif(table_name=='sub_block'):
                columns = "blk_code,sub_blk_code,sub_blk_name,strength,time"
                placeholders = ",".join(["?"] * len(df.columns))
                sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
            # 逐行插入
            for row in df.values.tolist():
                try:
                    cursor.execute(sql, row)
                    conn.commit()  # 每插入一行就提交一次（可选，可以放在循环外批量提交）
                except Exception as e:
                    print(f"插入失败: {e}, 数据: {row}")
                    conn.rollback()  # 回滚当前错误行
                    continue  # 继续下一行

            # 如果不想逐行提交，可以在这里统一提交
            # conn.commit()



    def read_data(self,sql):
        engine = self.get_engine()
        df = pd.read_sql(sql, con=engine)
        return df

    def exec_sql(self,sql):
        engine = self.get_engine()
        with engine.connect() as con:
            with con.begin():
                con.execute(sql_text(sql).execution_options(autocommit=True))


    def get_stock_codes_from_complex_query(self):
        # 1. 建立数据库连接
        with self.get_connection() as conn:
            cursor = conn.cursor()

        # 2. 定义SQL查询
        sql_query = """
        WITH 
        recent_trading_days AS (
            SELECT DISTINCT TOP 5 [date] AS trade_date
            FROM block
            ORDER BY [date] DESC
        ),
        block_stats AS (
            SELECT 
                t1.blk_code, 
                MIN(t1.blk_name) AS blk_name,
                COUNT(DISTINCT t1.[date]) AS occurrence_days
            FROM block t1
            JOIN recent_trading_days t2 ON t2.trade_date = t1.[date]
            GROUP BY t1.blk_code
            HAVING COUNT(DISTINCT t1.[date]) >= 2
        )
    
        SELECT DISTINCT sk.code AS stock_code,bs.blk_code,bs.occurrence_days
        FROM stocks_kpl sk
        JOIN block_stats bs ON sk.blk_code = bs.blk_code
        WHERE 
            sk.choose_time >= ? 
            AND sk.choose_time < ?
        ORDER BY bs.occurrence_days DESC,
                 bs.blk_code,
                 sk.code;
        """

        today = datetime.now()
        today_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        last_five_day = today - timedelta(days=5)  # 5天前
        last_five_day_str = last_five_day.strftime("%Y-%m-%d %H:%M:%S")
        try:
            # 3. 创建游标并执行查询
            cursor = conn.cursor()

            cursor.execute(sql_query, (last_five_day_str, today_str))
            # 4. 获取所有股票代码
            stock_codes = [row.stock_code for row in cursor.fetchall()]

            return stock_codes

        except Exception as e:
            print(f"执行查询时出错: {e}")
            return []

        finally:
            # 5. 确保连接关闭
            conn.close()

    def save_above_b2_stocks(self, group_above_b2_level1, group_above_b2_level2,
                              group_above_b2_level3, group_above_b2_level4):
        """
        将高于B2的4个分组股票保存到SQL Server数据库表gyb2
        
        Args:
            group_above_b2_level1: 分组2-1档股票列表
            group_above_b2_level2: 分组2-2档股票列表
            group_above_b2_level3: 分组2-3档股票列表
            group_above_b2_level4: 分组2-4档股票列表
        """
        try:
            # 准备数据
            data_rows = []
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            strategy_name = "N字形上升"
            
            # 定义分组映射：分组 -> 档位值
            groups = [
                (group_above_b2_level1, 'b2-1'),
                (group_above_b2_level2, 'b2-2'),
                (group_above_b2_level3, 'b2-3'),
                (group_above_b2_level4, 'b2-4')
            ]
            
            for stock_list, level in groups:
                for stock in stock_list:
                    stock_code = stock.get('stock_code', '')
                    if not stock_code:
                        continue
                    
                    # 去掉sh/sz/bj前缀，只保留纯数字代码
                    stock_code = re.sub(r'^(sh|sz|bj)', '', stock_code, flags=re.IGNORECASE)
                    
                    # 提取股票名称（如果有的话，否则使用代码）
                    stock_name = stock.get('stock_name', stock_code)

                    data_rows.append({
                        'level_type': level,
                        'stock_code': stock_code,
                        'date_time': current_time,
                        'strategy_name': strategy_name
                    })
            
            if not data_rows:
                print("没有需要保存到数据库的股票数据")
                return
            
            # 创建DataFrame
            df = pd.DataFrame(data_rows)
            
            # 确保表存在（如果不存在则创建）
            try:
                # 检查表是否存在
                check_sql = """
                IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[gyb2]') AND type in (N'U'))
                CREATE TABLE [dbo].[gyb2] (
                    [id] INT IDENTITY(1,1) PRIMARY KEY,
                    [level_type] NVARCHAR(10) NOT NULL,
                    [stock_code] NVARCHAR(20) NOT NULL,
                    [date_time] DATETIME NOT NULL,
                    [strategy_name] NVARCHAR(50) NOT NULL
                )
                """
                self.exec_sql(check_sql)
                print("数据库表gyb2已确认存在或已创建")
            except Exception as e:
                print(f"检查/创建表时出错: {e}")
                # 继续尝试插入数据
            
            # 使用SQLAlchemy的to_sql方法写入数据
            engine = None
            try:
                engine = self.get_engine()
                # 确保列顺序正确
                df = df[['level_type', 'stock_code', 'date_time', 'strategy_name']]
                # 使用to_sql写入
                df.to_sql('gyb2', engine, if_exists='append', index=False, chunksize=1000)
                print(f"\n=== 数据库保存成功 ===")
                print(f"成功保存 {len(data_rows)} 条记录到数据库表gyb2")
                print(f"  - b2-1档: {len([r for r in data_rows if r['level_type'] == 'b2-1'])} 条")
                print(f"  - b2-2档: {len([r for r in data_rows if r['level_type'] == 'b2-2'])} 条")
                print(f"  - b2-3档: {len([r for r in data_rows if r['level_type'] == 'b2-3'])} 条")
                print(f"  - b2-4档: {len([r for r in data_rows if r['level_type'] == 'b2-4'])} 条")
            except Exception as e:
                print(f"保存数据到数据库时出错: {e}")
                import traceback
                traceback.print_exc()
                # 如果to_sql失败，尝试使用原始SQL插入
                conn = None
                cursor = None
                try:
                    print("尝试使用原始SQL插入...")
                    conn = self.get_connection()
                    cursor = conn.cursor()
                    insert_sql = """
                    INSERT INTO gyb2 (level_type, stock_code, date_time, strategy_name)
                    VALUES (?, ?, ?, ?)
                    """
                    for _, row in df.iterrows():
                        cursor.execute(insert_sql, (
                            row['level_type'],
                            row['stock_code'],
                            row['date_time'],
                            row['strategy_name']
                        ))
                    conn.commit()
                    print(f"使用原始SQL成功保存 {len(data_rows)} 条记录")
                except Exception as e2:
                    print(f"原始SQL插入也失败: {e2}")
                    import traceback
                    traceback.print_exc()
                finally:
                    # 确保资源正确关闭
                    if cursor:
                        try:
                            cursor.close()
                        except:
                            pass
                    if conn:
                        try:
                            conn.close()
                        except:
                            pass
            finally:
                # 确保engine正确关闭
                if engine:
                    try:
                        engine.dispose()
                    except:
                        pass
                    
        except Exception as e:
            print(f"保存到数据库过程中出错: {e}")
            import traceback
            traceback.print_exc()

    def get_stock_code_number(self, stock_code):
        """
        从股票代码中提取纯数字部分
        
        思路：
        - 去掉sh、sz、bj等前缀，只保留数字部分
        """
        return re.sub(r'^(sh|sz|bj)', '', str(stock_code), flags=re.IGNORECASE)

    def init_observation_pool_tables(self, debug_mode=False):
        """
        初始化观察池数据库表（如果不存在则创建）
        
        思路：
        - 创建4张表：1级观察池、2级观察池、3级观察池、4级观察池
        - 每张表包含：股票编码、观察日期、观察当天收盘价、成立状态
        
        Args:
            debug_mode: 是否输出调试信息
        """
        if not self:
            return
        
        try:
            # 创建1级观察池表
            create_table_sql_1 = """
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[observation_pool_level1]') AND type in (N'U'))
            BEGIN
                CREATE TABLE [dbo].[observation_pool_level1] (
                    [id] INT IDENTITY(1,1) PRIMARY KEY,
                    [股票编码] NVARCHAR(20) NOT NULL,
                    [观察日期] DATE NOT NULL,
                    [观察当天收盘价] DECIMAL(10,2) NOT NULL,
                    [成立状态] NVARCHAR(10) NOT NULL DEFAULT '有效',
                    [创建时间] DATETIME NOT NULL DEFAULT GETDATE(),
                    [更新时间] DATETIME NOT NULL DEFAULT GETDATE(),
                    UNIQUE([股票编码], [观察日期])
                )
                CREATE INDEX idx_stock_code_date_1 ON [dbo].[observation_pool_level1]([股票编码], [观察日期])
            END
            """
            
            # 创建2级观察池表
            create_table_sql_2 = """
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[observation_pool_level2]') AND type in (N'U'))
            BEGIN
                CREATE TABLE [dbo].[observation_pool_level2] (
                    [id] INT IDENTITY(1,1) PRIMARY KEY,
                    [股票编码] NVARCHAR(20) NOT NULL,
                    [观察日期] DATE NOT NULL,
                    [观察当天收盘价] DECIMAL(10,2) NOT NULL,
                    [成立状态] NVARCHAR(10) NOT NULL DEFAULT '有效',
                    [创建时间] DATETIME NOT NULL DEFAULT GETDATE(),
                    [更新时间] DATETIME NOT NULL DEFAULT GETDATE(),
                    UNIQUE([股票编码], [观察日期])
                )
                CREATE INDEX idx_stock_code_date_2 ON [dbo].[observation_pool_level2]([股票编码], [观察日期])
            END
            """
            
            # 创建3级观察池表
            create_table_sql_3 = """
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[observation_pool_level3]') AND type in (N'U'))
            BEGIN
                CREATE TABLE [dbo].[observation_pool_level3] (
                    [id] INT IDENTITY(1,1) PRIMARY KEY,
                    [股票编码] NVARCHAR(20) NOT NULL,
                    [观察日期] DATE NOT NULL,
                    [观察当天收盘价] DECIMAL(10,2) NOT NULL,
                    [成立状态] NVARCHAR(10) NOT NULL DEFAULT '有效',
                    [创建时间] DATETIME NOT NULL DEFAULT GETDATE(),
                    [更新时间] DATETIME NOT NULL DEFAULT GETDATE(),
                    UNIQUE([股票编码], [观察日期])
                )
                CREATE INDEX idx_stock_code_date_3 ON [dbo].[observation_pool_level3]([股票编码], [观察日期])
            END
            """
            
            # 创建4级观察池表
            create_table_sql_4 = """
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[observation_pool_level4]') AND type in (N'U'))
            BEGIN
                CREATE TABLE [dbo].[observation_pool_level4] (
                    [id] INT IDENTITY(1,1) PRIMARY KEY,
                    [股票编码] NVARCHAR(20) NOT NULL,
                    [观察日期] DATE NOT NULL,
                    [观察当天收盘价] DECIMAL(10,2) NOT NULL,
                    [成立状态] NVARCHAR(10) NOT NULL DEFAULT '有效',
                    [创建时间] DATETIME NOT NULL DEFAULT GETDATE(),
                    [更新时间] DATETIME NOT NULL DEFAULT GETDATE(),
                    UNIQUE([股票编码], [观察日期])
                )
                CREATE INDEX idx_stock_code_date_4 ON [dbo].[observation_pool_level4]([股票编码], [观察日期])
            END
            """
            
            self.exec_sql(create_table_sql_1)
            self.exec_sql(create_table_sql_2)
            self.exec_sql(create_table_sql_3)
            self.exec_sql(create_table_sql_4)
            if debug_mode:
                print("数据库表初始化完成")
        except Exception as e:
            print(f"初始化数据库表时出错: {e}")
            import traceback
            traceback.print_exc()

    def save_observation_pool_to_db(self, level_stocks, level, default_observation_date=None, debug_mode=False):
        """
        保存观察池数据到数据库
        
        思路：
        - 将观察池数据保存到对应的数据库表
        - 如果记录已存在，不重复插入（因为有UNIQUE约束）
        - 字段：股票编码、观察日期、观察当天收盘价、成立状态
        
        Args:
            level_stocks: 观察池股票列表
            level: 观察池级别（1、2、3、4）
            default_observation_date: 默认观察日期（如果stock_info中没有signal_date，则使用此日期）
            debug_mode: 是否输出调试信息
        """
        if not self or not level_stocks:
            return
        
        try:
            # 根据级别选择表名
            table_map = {
                1: 'observation_pool_level1',
                2: 'observation_pool_level2',
                3: 'observation_pool_level3',
                4: 'observation_pool_level4'
            }
            table_name = table_map.get(level)
            if not table_name:
                return
            
            # 准备数据
            data_rows = []
            for stock in level_stocks:
                stock_code = stock.get('stock_code', '')
                if not stock_code:
                    continue
                
                # 提取纯数字股票代码
                stock_code_num = self.get_stock_code_number(stock_code)
                
                # 优先使用A2、A2_expma3或A3_ma5的信息（信号触发当天的信息）
                # 如果没有，则使用today_date和today_close
                if 'A2' in stock and stock.get('A2'):
                    # 1级信号：使用A2的信息
                    a2 = stock['A2']
                    observation_date = a2['date']
                    observation_price = a2['close']
                elif 'A2_expma3' in stock and stock.get('A2_expma3'):
                    # 2级信号：使用A2_expma3的信息
                    a2_expma3 = stock['A2_expma3']
                    observation_date = a2_expma3['date']
                    observation_price = a2_expma3['close']
                elif 'A3_ma5' in stock and stock.get('A3_ma5'):
                    # 3级信号：使用A3_ma5的信息
                    a3_ma5 = stock['A3_ma5']
                    observation_date = a3_ma5['date']
                    observation_price = a3_ma5['close']
                elif 'signal_date' in stock and stock.get('signal_date'):
                    # 向后兼容：使用signal_date
                    observation_date = stock['signal_date']
                    observation_price = stock.get('signal_close', stock.get('today_close', 0))
                else:
                    observation_date = stock.get('today_date', default_observation_date or datetime.now().strftime('%Y-%m-%d'))
                    observation_price = stock.get('today_close', 0)
                
                data_rows.append({
                    '股票编码': stock_code_num,
                    '观察日期': observation_date,
                    '观察当天收盘价': observation_price,
                    '成立状态': '有效'
                })
            
            if not data_rows:
                return
            
            # 创建DataFrame
            df = pd.DataFrame(data_rows)
            
            # 使用MERGE语句插入或更新（SQL Server语法）
            with self.get_connection() as conn:
                cursor = conn.cursor()
                insert_count = 0
                update_count = 0
                
                for _, row in df.iterrows():
                    # 使用MERGE语句，如果存在则更新，不存在则插入
                    merge_sql = f"""
                    MERGE [dbo].[{table_name}] AS target
                    USING (SELECT ? AS [股票编码], ? AS [观察日期], ? AS [观察当天收盘价], ? AS [成立状态]) AS source
                    ON target.[股票编码] = source.[股票编码] AND target.[观察日期] = source.[观察日期]
                    WHEN MATCHED THEN
                        UPDATE SET [观察当天收盘价] = source.[观察当天收盘价], 
                                   [成立状态] = source.[成立状态],
                                   [更新时间] = GETDATE()
                    WHEN NOT MATCHED THEN
                        INSERT ([股票编码], [观察日期], [观察当天收盘价], [成立状态], [创建时间], [更新时间])
                        VALUES (source.[股票编码], source.[观察日期], source.[观察当天收盘价], source.[成立状态], GETDATE(), GETDATE());
                    """
                    
                    try:
                        cursor.execute(merge_sql, (
                            row['股票编码'],
                            row['观察日期'],
                            float(row['观察当天收盘价']),
                            row['成立状态']
                        ))
                        # 检查是插入还是更新（通过检查受影响的行数）
                        if cursor.rowcount > 0:
                            insert_count += 1
                    except Exception as e:
                        # 如果MERGE不支持，使用INSERT IGNORE的方式
                        try:
                            insert_sql = f"""
                            INSERT INTO [dbo].[{table_name}] ([股票编码], [观察日期], [观察当天收盘价], [成立状态], [创建时间], [更新时间])
                            VALUES (?, ?, ?, ?, GETDATE(), GETDATE())
                            """
                            cursor.execute(insert_sql, (
                                row['股票编码'],
                                row['观察日期'],
                                float(row['观察当天收盘价']),
                                row['成立状态']
                            ))
                            insert_count += 1
                        except Exception as insert_error:
                            # 如果是因为唯一约束冲突，说明记录已存在，尝试更新
                            if 'UNIQUE' in str(insert_error) or 'PRIMARY KEY' in str(insert_error):
                                update_sql = f"""
                                UPDATE [dbo].[{table_name}]
                                SET [观察当天收盘价] = ?, [成立状态] = ?, [更新时间] = GETDATE()
                                WHERE [股票编码] = ? AND [观察日期] = ?
                                """
                                cursor.execute(update_sql, (
                                    float(row['观察当天收盘价']),
                                    row['成立状态'],
                                    row['股票编码'],
                                    row['观察日期']
                                ))
                                update_count += 1
                            else:
                                print(f"插入/更新失败: {insert_error}, 股票: {row['股票编码']}")
                
                conn.commit()
                if debug_mode or insert_count > 0 or update_count > 0:
                    print(f"  {level}级观察池保存到数据库: 新增{insert_count}条, 更新{update_count}条")
        except Exception as e:
            print(f"保存{level}级观察池到数据库时出错: {e}")
            import traceback
            traceback.print_exc()

    def check_previous_day_conditions(self, stock_code, level, load_stock_data_func, file_map, debug_mode=False):
        """
        检查前一天的观察条件是否还成立
        
        思路：
        - 从数据库查询前一天该股票的记录
        - 重新加载最新数据，检查条件是否还成立
        - 如果不成立，更新成立状态为"失效"
        - 如果成立，不修改记录
        
        Args:
            stock_code: 股票代码
            level: 观察池级别（1、2、3、4）
            load_stock_data_func: 加载股票数据的函数
            file_map: 文件路径映射字典
            debug_mode: 是否输出调试信息
        
        返回：True表示条件还成立，False表示条件不成立
        """
        if not self:
            return True
        
        try:
            # 获取股票代码的数字部分
            stock_code_num = self.get_stock_code_number(stock_code)
            
            # 获取昨天的日期
            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            
            # 根据级别选择表名
            table_map = {
                1: 'observation_pool_level1',
                2: 'observation_pool_level2',
                3: 'observation_pool_level3',
                4: 'observation_pool_level4'
            }
            table_name = table_map.get(level)
            if not table_name:
                return True
            
            # 查询前一天该股票的记录
            query_sql = f"""
            SELECT [股票编码], [观察日期], [观察当天收盘价], [成立状态]
            FROM [dbo].[{table_name}]
            WHERE [股票编码] = '{stock_code_num}' AND [观察日期] = '{yesterday}' AND [成立状态] = '有效'
            """
            
            df = self.read_data(query_sql)
            
            if df.empty:
                return True  # 没有前一天的记录，不需要检查
            
            # 重新加载最新数据，检查条件是否还成立
            if stock_code not in file_map:
                return False  # 找不到数据文件，认为条件不成立
            
            csv_path = file_map[stock_code]
            data = load_stock_data_func(csv_path)
            
            if data is None or len(data) < 21:
                return False  # 数据不足，认为条件不成立
            
            # 根据级别检查不同的条件
            # 这里简化处理，暂时返回True（表示条件还成立）
            # TODO: 需要改进，从数据库记录中恢复A1位置信息，然后重新检查条件
            return True
        except Exception as e:
            print(f"检查前一天条件时出错 {stock_code}: {e}")
            return True  # 出错时默认认为条件还成立

    def update_previous_day_status(self, level, load_stock_data_func, file_map, debug_mode=False):
        """
        更新前一天观察池的成立状态
        
        思路：
        - 查询前一天所有有效的记录
        - 检查每只股票的条件是否还成立
        - 如果不成立，更新为"失效"
        
        Args:
            level: 观察池级别（1、2、3、4）
            load_stock_data_func: 加载股票数据的函数
            file_map: 文件路径映射字典
            debug_mode: 是否输出调试信息
        """
        if not self:
            return
        
        try:
            # 获取昨天的日期
            yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
            
            # 根据级别选择表名
            table_map = {
                1: 'observation_pool_level1',
                2: 'observation_pool_level2',
                3: 'observation_pool_level3',
                4: 'observation_pool_level4'
            }
            table_name = table_map.get(level)
            if not table_name:
                return
            
            # 查询前一天所有有效的记录
            query_sql = f"""
            SELECT [股票编码], [观察日期], [观察当天收盘价]
            FROM [dbo].[{table_name}]
            WHERE [观察日期] = '{yesterday}' AND [成立状态] = '有效'
            """
            
            # 使用read_data查询
            df = self.read_data(query_sql)
            
            if df.empty:
                return
            
            updated_count = 0
            with self.get_connection() as conn:
                cursor = conn.cursor()
                
                for _, row in df.iterrows():
                    stock_code_num = str(row['股票编码'])
                    # 尝试找到完整的股票代码（可能需要从file_map中查找）
                    full_stock_code = None
                    for code in file_map.keys():
                        if self.get_stock_code_number(code) == stock_code_num:
                            full_stock_code = code
                            break
                    
                    if not full_stock_code:
                        continue
                    
                    # 检查条件是否还成立
                    is_valid = self.check_previous_day_conditions(full_stock_code, level, load_stock_data_func, file_map, debug_mode)
                    
                    if not is_valid:
                        # 更新为失效
                        update_sql = f"""
                        UPDATE [dbo].[{table_name}]
                        SET [成立状态] = '失效', [更新时间] = GETDATE()
                        WHERE [股票编码] = ? AND [观察日期] = ?
                        """
                        cursor.execute(update_sql, (stock_code_num, yesterday))
                        updated_count += 1
                
                conn.commit()
                
                if updated_count > 0 and debug_mode:
                    print(f"  更新{level}级观察池前一天记录: {updated_count}条标记为失效")
        except Exception as e:
            print(f"更新前一天状态时出错: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
#     # 1. 创建DBHelper实例
#     db = DBHelper()
#
#     # 2. 准备测试数据
#     test_data = {
#         'ID': [9, 10, 11, 12],
#         'Name': ['Alice01', 'Bob01', 'Charlie01', 'David01'],
#         'Age': [25, 30, 35, 40],
#         'JoinDate': [datetime(2020, 1, 1), datetime(2020, 2, 1),
#                      datetime(2020, 3, 1), datetime(2020, 4, 1)],
#         'Salary': [50000.0, 60000.0, 70000.0, 80000.0]
#     }
#     df = pd.DataFrame(test_data)
#
#     # 3. 写入数据到数据库表（如果表已存在则替换）
#     table_name = "Stocks"  # 表名
#
#     db.write_data(df, table_name)
#
#     # 4. 查询刚写入的数据
#     query = f"SELECT * FROM {table_name}"
#     result_df = db.read_data(query)
#
#     # 5. 打印查询结果
#     print("\n查询结果:")
#     print(result_df)
#
#     # 6. 也可以使用原始SQL查询方式
#     # print("\n原始SQL查询结果:")
#     # engine = db.get_engine()
#     # with engine.connect() as connection:
#     #     result = connection.execute(f"SELECT Name, Age FROM {table_name}")
#     #     for row in result:
#     #         print(f"姓名: {row['Name']}, 年龄: {row['Age']}")



    config = configparser.ConfigParser()
    # 读取配置文件
    config.read('config.ini', encoding='utf-8')
    host = config.get('Common', 'db_host')
    host = host.strip()
    db_host = host

    db_name = config.get('Common', 'db_name').strip()

    db_user = config.get('Common', 'db_user').strip()

    db_password = config.get('Common', 'db_password').strip()


    db = DBHelper(db_host,db_name,db_user,db_password)

    db.get_stock_codes_from_complex_query()