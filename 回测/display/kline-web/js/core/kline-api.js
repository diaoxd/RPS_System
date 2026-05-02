// KlineAPI类的Promise兼容实现
if (typeof Promise === 'undefined') {
    // 简单的Promise polyfill
    function Promise(executor) {
        var self = this;
        self.status = 'pending';
        self.value = undefined;
        self.reason = undefined;
        self.onResolvedCallbacks = [];
        self.onRejectedCallbacks = [];
        
        function resolve(value) {
            if (self.status === 'pending') {
                self.status = 'fulfilled';
                self.value = value;
                self.onResolvedCallbacks.forEach(function(callback) {
                    callback(value);
                });
            }
        }
        
        function reject(reason) {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.reason = reason;
                self.onRejectedCallbacks.forEach(function(callback) {
                    callback(reason);
                });
            }
        }
        
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    
    Promise.prototype.then = function(onFulfilled, onRejected) {
        var self = this;
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(value) { return value; };
        onRejected = typeof onRejected === 'function' ? onRejected : function(reason) { throw reason; };
        
        var promise2 = new Promise(function(resolve, reject) {
            if (self.status === 'fulfilled') {
                setTimeout(function() {
                    try {
                        var x = onFulfilled(self.value);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            
            if (self.status === 'rejected') {
                setTimeout(function() {
                    try {
                        var x = onRejected(self.reason);
                        resolve(x);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            }
            
            if (self.status === 'pending') {
                self.onResolvedCallbacks.push(function(value) {
                    setTimeout(function() {
                        try {
                            var x = onFulfilled(value);
                            resolve(x);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                
                self.onRejectedCallbacks.push(function(reason) {
                    setTimeout(function() {
                        try {
                            var x = onRejected(reason);
                            resolve(x);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
            }
        });
        
        return promise2;
    };
    
    Promise.prototype.catch = function(onRejected) {
        return this.then(null, onRejected);
    };
    
    Promise.resolve = function(value) {
        return new Promise(function(resolve) {
            resolve(value);
        });
    };
    
    Promise.reject = function(reason) {
        return new Promise(function(resolve, reject) {
            reject(reason);
        });
    };
    
    window.Promise = Promise;
}

// K线API数据获取模块（兼容版）
function KlineAPI() {
    this.sinaBaseURL = 'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData';
    this.cache = {}; // 智能缓存
    this.cacheTimeouts = { // 不同周期的缓存时间
        '5min': 60000,   // 5分钟缓存1分钟
        '15min': 300000,  // 15分钟缓存5分钟
        '30min': 600000,  // 30分钟缓存10分钟
        '60min': 1800000, // 60分钟缓存30分钟
        'daily': 3600000, // 日线缓存1小时
        'weekly': 7200000, // 周线缓存2小时
        'monthly': 86400000 // 月线缓存24小时
    };
    this.maxCacheSize = 50; // 最大缓存条目数
    this.retryCount = 3; // 最大重试次数
    this.retryDelay = 1000; // 初始重试延迟（毫秒）
}

// 获取新浪K线数据
KlineAPI.prototype.getSinaKlineData = function(stockCode, period) {
    var _this = this;
    var cacheKey = stockCode + '_' + period;
    
    // 检查缓存
    if (_this.cache[cacheKey]) {
        var cached = _this.cache[cacheKey];
        var cacheTimeout = _this.cacheTimeouts[period] || 300000;
        if (new Date().getTime() - cached.timestamp < cacheTimeout) {
            console.log('使用缓存数据：' + cacheKey);
            return Promise.resolve(cached.data);
        }
    }

    // 执行带重试机制的API请求
    return _this.fetchWithRetry(stockCode, period, 0).then(function(data) {
        var parsedData = _this.parseSinaData(data);
        
        // 如果是周线或月线，需要聚合数据
        if (period === 'weekly') {
            console.log('开始聚合周线数据...');
            parsedData = _this.aggregateWeeklyData(parsedData);
            console.log('周线数据聚合完成，共' + parsedData.length + '条');
        } else if (period === 'monthly') {
            console.log('开始聚合月线数据...');
            parsedData = _this.aggregateMonthlyData(parsedData);
            console.log('月线数据聚合完成，共' + parsedData.length + '条');
        }
        
        // 缓存数据（仅当有有效数据时）
        if (parsedData.length > 0) {
            _this.cacheData(cacheKey, parsedData);
        }
        
        return parsedData;
    }).catch(function(error) {
        console.error('K线数据获取失败：' + error.message);
        // 抛出错误，让上层处理
        throw error;
    });
};

// 带重试机制的API请求
KlineAPI.prototype.fetchWithRetry = function(stockCode, period, retryAttempt) {
    var _this = this;
    
    return _this.fetchSinaKlineData(stockCode, period).catch(function(error) {
        // 如果还有重试次数，进行重试
        if (retryAttempt < _this.retryCount) {
            var delay = _this.retryDelay * Math.pow(2, retryAttempt); // 指数退避
            console.log('请求失败，' + delay + 'ms后重试（' + (retryAttempt + 1) + '/' + _this.retryCount + '）：' + error.message);
            
            return new Promise(function(resolve) {
                setTimeout(function() {
                    resolve(_this.fetchWithRetry(stockCode, period, retryAttempt + 1));
                }, delay);
            });
        } else {
            // 重试次数用尽，抛出错误
            throw error;
        }
    });
};

// 直接调用新浪API获取K线数据
KlineAPI.prototype.fetchSinaKlineData = function(stockCode, period) {
    var _this = this;
    var scale = _this.getScaleFromPeriod(period);
    
    // 根据周期设置数据量
    var datalen;
    if (period === 'weekly' || period === 'monthly') {
        datalen = 3000; // 周线和月线需要更多日线数据来聚合
    } else if (period === 'daily') {
        datalen = 1500; // 日线获取1500条
    } else {
        datalen = 500; // 分钟线获取500条
    }
    
    // 构建新浪API请求URL
    var url = _this.sinaBaseURL + '?symbol=' + stockCode + '&scale=' + scale + '&ma=5&datalen=' + datalen;
    
    console.log('请求新浪API：' + url);
    
    return new Promise(function(resolve, reject) {
        // 使用script标签加载（支持通达信浏览器）
        var script = document.createElement('script');
        
        // 为每个请求生成唯一的回调函数名
        var callbackName = 'sina_callback_' + new Date().getTime();
        
        // 设置回调函数
        window[callbackName] = function(data) {
            console.log('K线数据回调成功');
            if (data && Array.isArray(data) && data.length > 0) {
                resolve(data);
            } else {
                reject(new Error('获取数据为空'));
            }
            // 清理回调函数
            window[callbackName] = undefined;
        };
        
        // 构建JSONP请求URL
        var jsonpUrl = url.replace('json_v2.php/', 'jsonp.php/' + callbackName + '/');
        script.src = jsonpUrl;
        
        script.onload = function() {
            console.log('K线数据加载完成');
            // 清理script标签
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
        
        script.onerror = function() {
            console.error('K线数据加载失败');
            reject(new Error('网络错误'));
            // 清理回调函数和script标签
            window[callbackName] = undefined;
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
        
        // 添加到页面
        document.getElementsByTagName('head')[0].appendChild(script);
        
        // 设置超时
        setTimeout(function() {
            console.log('请求超时');
            reject(new Error('请求超时'));
            // 清理回调函数和script标签
            window[callbackName] = undefined;
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        }, 10000);
    });
};

// 缓存数据并管理缓存大小
KlineAPI.prototype.cacheData = function(cacheKey, data) {
    var _this = this;
    
    // 添加新数据到缓存
    _this.cache[cacheKey] = {
        data: data,
        timestamp: new Date().getTime()
    };
    
    // 检查缓存大小，如果超过限制，清理最旧的缓存
    var cacheKeys = Object.keys(_this.cache);
    if (cacheKeys.length > _this.maxCacheSize) {
        // 按时间戳排序，删除最旧的缓存
        cacheKeys.sort(function(a, b) {
            return _this.cache[a].timestamp - _this.cache[b].timestamp;
        });
        
        // 删除多余的缓存
        var keysToDelete = cacheKeys.slice(0, cacheKeys.length - _this.maxCacheSize);
        keysToDelete.forEach(function(key) {
            console.log('清理旧缓存：' + key);
            delete _this.cache[key];
        });
    }
    
    console.log('缓存数据：' + cacheKey + '，当前缓存大小：' + Object.keys(_this.cache).length + '/' + _this.maxCacheSize);
};

// 解析新浪数据
KlineAPI.prototype.parseSinaData = function(data) {
    console.log('解析新浪数据：' + JSON.stringify(data));
    
    if (!data || !Array.isArray(data)) {
        console.log('数据格式错误，返回空数组');
        return [];
    }
    
    console.log('数据项数量：' + data.length);
    if (data.length > 0) {
        console.log('第一项数据：' + JSON.stringify(data[0]));
    }
    
    var parsed = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        // 新浪财经数据格式：日期,开盘价,最高价,最低价,收盘价,成交量
        var open = parseFloat(item.open);
        var high = parseFloat(item.high);
        var low = parseFloat(item.low);
        var close = parseFloat(item.close);
        var volume = parseFloat(item.volume);
        
        // 计算成交额：使用平均价 * 成交量
        // 平均价 = (开盘价 + 最高价 + 最低价 + 收盘价) / 4
        var avgPrice = (open + high + low + close) / 4;
        var amount = avgPrice * volume;
        
        parsed.push({
            day: item.day,
            date: item.day,
            open: open,
            high: high,
            low: low,
            close: close,
            volume: volume,
            amount: amount
        });
    }
    
    // 确保原始数据按日期排序（升序，从旧到新）
    parsed.sort(function(a, b) {
        return a.day.localeCompare(b.day);
    });
    
    console.log('解析完成，共' + parsed.length + '条数据');
    if (parsed.length > 0) {
        console.log('解析后的第一条数据：' + JSON.stringify(parsed[0]));
        console.log('解析后的最后一条数据：' + JSON.stringify(parsed[parsed.length - 1]));
    }
    
    return parsed;
};

// 周线数据聚合函数（简化版）
KlineAPI.prototype.aggregateWeeklyData = function(dailyData) {
    var _this = this;
    var weeklyData = [];
    
    console.log('开始聚合周线数据，原始日线数据条数：' + dailyData.length);
    
    if (dailyData.length === 0) {
        return [];
    }
    
    var currentWeek = null;
    var currentWeekData = null;
    
    for (var i = 0; i < dailyData.length; i++) {
        var item = dailyData[i];
        
        // 解析日期
        var dateStr = item.day;
        if (dateStr.indexOf(' ') !== -1) {
            dateStr = dateStr.split(' ')[0];
        }
        var date = new Date(dateStr);
        
        if (isNaN(date.getTime())) {
            continue;
        }
        
        // 计算周一的日期作为周标识
        var dayOfWeek = date.getDay(); // 0=周日, 1=周一, ..., 6=周六
        var monday = new Date(date);
        var diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        monday.setDate(diff);
        
        var weekKey = monday.getFullYear() + '-' + 
                      (monday.getMonth() + 1 < 10 ? '0' + (monday.getMonth() + 1) : (monday.getMonth() + 1)) + '-' + 
                      (monday.getDate() < 10 ? '0' + monday.getDate() : monday.getDate());
        
        // 如果是新的一周
        if (weekKey !== currentWeek) {
            // 保存上一周的数据
            if (currentWeekData !== null) {
                weeklyData.push(currentWeekData);
            }
            
            // 开始新的一周
            currentWeek = weekKey;
            currentWeekData = {
                day: item.day,
                date: item.day,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,
                amount: item.amount || 0
            };
        } else {
            // 更新当前周的数据
            currentWeekData.high = Math.max(currentWeekData.high, item.high);
            currentWeekData.low = Math.min(currentWeekData.low, item.low);
            currentWeekData.close = item.close;
            currentWeekData.volume += item.volume;
            currentWeekData.amount += item.amount || 0;
            currentWeekData.day = item.day;
            currentWeekData.date = item.day;
        }
    }
    
    // 保存最后一周的数据
    if (currentWeekData !== null) {
        weeklyData.push(currentWeekData);
    }
    
    console.log('周线数据聚合完成，共' + weeklyData.length + '条');
    for (var j = 0; j < Math.min(5, weeklyData.length); j++) {
        console.log('周线[' + j + ']：' + JSON.stringify(weeklyData[j]));
    }
    if (weeklyData.length > 5) {
        for (var k = Math.max(5, weeklyData.length - 5); k < weeklyData.length; k++) {
            console.log('周线[' + k + ']：' + JSON.stringify(weeklyData[k]));
        }
    }
    
    return weeklyData;
};

// 月线数据聚合函数（简化版）
KlineAPI.prototype.aggregateMonthlyData = function(dailyData) {
    var _this = this;
    var monthlyData = [];
    
    console.log('开始聚合月线数据，原始日线数据条数：' + dailyData.length);
    
    if (dailyData.length === 0) {
        return [];
    }
    
    var currentMonth = null;
    var currentMonthData = null;
    
    for (var i = 0; i < dailyData.length; i++) {
        var item = dailyData[i];
        
        // 解析日期
        var dateStr = item.day;
        if (dateStr.indexOf(' ') !== -1) {
            dateStr = dateStr.split(' ')[0];
        }
        var date = new Date(dateStr);
        
        if (isNaN(date.getTime())) {
            continue;
        }
        
        // 计算月份标识
        var monthKey = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1));
        
        // 如果是新的一月
        if (monthKey !== currentMonth) {
            // 保存上一月的数据
            if (currentMonthData !== null) {
                monthlyData.push(currentMonthData);
            }
            
            // 开始新的一月
            currentMonth = monthKey;
            currentMonthData = {
                day: item.day,
                date: item.day,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,
                amount: item.amount || 0
            };
        } else {
            // 更新当前月的数据
            currentMonthData.high = Math.max(currentMonthData.high, item.high);
            currentMonthData.low = Math.min(currentMonthData.low, item.low);
            currentMonthData.close = item.close;
            currentMonthData.volume += item.volume;
            currentMonthData.amount += item.amount || 0;
            currentMonthData.day = item.day;
            currentMonthData.date = item.day;
        }
    }
    
    // 保存最后一月的数据
    if (currentMonthData !== null) {
        monthlyData.push(currentMonthData);
    }
    
    console.log('月线数据聚合完成，共' + monthlyData.length + '条');
    for (var j = 0; j < Math.min(5, monthlyData.length); j++) {
        console.log('月线[' + j + ']：' + JSON.stringify(monthlyData[j]));
    }
    if (monthlyData.length > 5) {
        for (var k = Math.max(5, monthlyData.length - 5); k < monthlyData.length; k++) {
            console.log('月线[' + k + ']：' + JSON.stringify(monthlyData[k]));
        }
    }
    
    return monthlyData;
};

// 获取周期对应的scale参数
KlineAPI.prototype.getScaleFromPeriod = function(period) {
    var scaleMap = {
        '5min': '5',
        '15min': '15',
        '30min': '30',
        '60min': '60',
        'daily': '240',
        'weekly': '240', // 周线使用日线数据聚合
        'monthly': '240' // 月线使用日线数据聚合
    };
    return scaleMap[period] || '240';
};

// 导出KlineAPI类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KlineAPI;
}
