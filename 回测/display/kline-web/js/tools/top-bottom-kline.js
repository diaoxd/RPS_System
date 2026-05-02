// 顶底K线功能模块（兼容版）
function TopBottomKline(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.kdjData = [];
}

// 切换顶底模式
TopBottomKline.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 计算KDJ指标
TopBottomKline.prototype.calculateKDJ = function(candles) {
    var _this = this;
    
    if (!candles || candles.length === 0) {
        return [];
    }

    var n = 9; // KDJ周期
    var m1 = 3; // K的平滑参数
    var m2 = 3; // D的平滑参数
    var kdjData = [];

    console.log('开始计算KDJ，K线数据条数：' + candles.length);

    // 计算最低价和最高价
    var lowestLows = [];
    var highestHighs = [];
    
    for (var i = 0; i < candles.length; i++) {
        var start = Math.max(0, i - n + 1);
        var window = candles.slice(start, i + 1);
        
        var lows = [];
        var highs = [];
        for (var w = 0; w < window.length; w++) {
            lows.push(window[w].low);
            highs.push(window[w].high);
        }
        
        // 使用apply调用Math.min和Math.max，避免扩展运算符
        lowestLows.push(Math.min.apply(null, lows));
        highestHighs.push(Math.max.apply(null, highs));
    }
    
    // 计算RSV
    var rsv = [];
    for (var j = 0; j < candles.length; j++) {
        var priceRange = highestHighs[j] - lowestLows[j];
        if (priceRange > 0) {
            rsv.push((candles[j].close - lowestLows[j]) / priceRange * 100);
        } else {
            rsv.push(50); // 避免除零错误
        }
    }
    
    // 计算K、D、J值
    var k = 50;
    var d = 50;
    
    for (var kIndex = 0; kIndex < candles.length; kIndex++) {
        if (kIndex === 0) {
            k = 50;
            d = 50;
        } else {
            var kPrev = kdjData[kIndex - 1].k;
            var dPrev = kdjData[kIndex - 1].d;
            k = (rsv[kIndex] + (m1 - 1) * kPrev) / m1;
            d = (k + (m2 - 1) * dPrev) / m2;
        }
        var jValue = 3 * k - 2 * d;
        
        kdjData.push({
            k: k,
            d: d,
            j: jValue
        });
    }

    _this.kdjData = kdjData;
    
    console.log('KDJ计算完成，共' + kdjData.length + '条数据');
    if (kdjData.length > 0) {
        var lastIndex = kdjData.length - 1;
        console.log('最新K线（索引' + lastIndex + '）的KDJ值：K=' + kdjData[lastIndex].k.toFixed(2) + 
                    ', D=' + kdjData[lastIndex].d.toFixed(2) + 
                    ', J=' + kdjData[lastIndex].j.toFixed(2));
    }
    
    return kdjData;
};

// 判断是否为顶底K线
TopBottomKline.prototype.isTopBottomKline = function(index) {
    var _this = this;
    
    if (!_this.enabled || !_this.kdjData || index >= _this.kdjData.length) {
        return false;
    }

    var j = _this.kdjData[index].j;
    var candles = _this.klineChart.candles;
    
    // 顶部信号：J值 > 85
    if (j > 85) {
        return true;
    }
    
    // 底部信号：J值 < 15
    if (j < 15) {
        return true;
    }
    
    return false;
};

// 获取顶底K线颜色
TopBottomKline.prototype.getTopBottomKlineColor = function(index) {
    var _this = this;
    
    if (!_this.kdjData || index >= _this.kdjData.length) {
        return null;
    }

    var j = _this.kdjData[index].j;
    
    if (j < 15) {
        return {
            body: '#1890ff', // 蓝色
            shadow: '#1890ff'
        };
    } else if (j > 85) {
        return {
            body: '#9e7e2cff', // 暗黄色
            shadow: '#d4a017'
        };
    }
    
    return null;
};

// 清除顶底K线数据
TopBottomKline.prototype.clear = function() {
    this.kdjData = [];
};
