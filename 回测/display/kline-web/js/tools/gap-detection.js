// 跳空缺口功能模块
function GapDetection(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.gaps = []; // 存储所有缺口
}

// 切换缺口显示
GapDetection.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 检测缺口
GapDetection.prototype.detectGaps = function(candles) {
    var _this = this;
    
    if (!candles || candles.length < 2) {
        _this.gaps = [];
        return;
    }

    var gaps = [];
    
    for (var i = 1; i < candles.length; i++) {
        var prevCandle = candles[i - 1];
        var currCandle = candles[i];
        
        // 向上跳空：今日最低价 > 昨日最高价
        if (currCandle.low > prevCandle.high) {
            gaps.push({
                type: 'up',
                startIndex: i - 1, // 前一根K线索引
                gapStartIndex: i, // 缺口开始的K线索引
                lowPrice: prevCandle.high,
                highPrice: currCandle.low,
                filled: false, // 是否已回补
                filledIndex: null // 回补的K线索引
            });
        }
        
        // 向下跳空：今日最高价 < 昨日最低价
        if (currCandle.high < prevCandle.low) {
            gaps.push({
                type: 'down',
                startIndex: i - 1,
                gapStartIndex: i,
                lowPrice: currCandle.high,
                highPrice: prevCandle.low,
                filled: false,
                filledIndex: null
            });
        }
    }
    
    // 检查缺口是否已回补
    for (var g = 0; g < gaps.length; g++) {
        var gap = gaps[g];
        for (var i = gap.gapStartIndex + 1; i < candles.length; i++) {
            var candle = candles[i];
            
            if (gap.type === 'up') {
                // 向上跳空回补：最低价 <= 缺口的下沿
                if (candle.low <= gap.lowPrice) {
                    gap.filled = true;
                    gap.filledIndex = i;
                    break;
                }
            } else {
                // 向下跳空回补：最高价 >= 缺口的上沿
                if (candle.high >= gap.highPrice) {
                    gap.filled = true;
                    gap.filledIndex = i;
                    break;
                }
            }
        }
    }
    
    // 只保留未回补的缺口
    var unfiledGaps = [];
    for (var j = 0; j < gaps.length; j++) {
        if (!gaps[j].filled) {
            unfiledGaps.push(gaps[j]);
        }
    }
    
    _this.gaps = unfiledGaps;
    
    console.log('检测到未回补缺口数量：' + _this.gaps.length);
    
    return _this.gaps;
};

// 绘制缺口
GapDetection.prototype.render = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight) {
    var _this = this;
    
    if (!_this.enabled || !_this.gaps || _this.gaps.length === 0) {
        return;
    }

    var priceRange = maxPrice - minPrice || 1;
    var rightPadding = 20;
    var availableWidth = ctx.canvas.width - rightPadding;
    
    var padding = 15; // 主图上下边距
    var availableHeight = mainChartHeight - padding * 2;
    
    // 保存canvas状态
    ctx.save();
    
    // 裁剪区域：只在主图区域绘制
    ctx.beginPath();
    ctx.rect(0, 0, ctx.canvas.width, mainChartHeight);
    ctx.clip();
    
    ctx.globalAlpha = 0.4; // 半透明
    
    for (var g = 0; g < _this.gaps.length; g++) {
        var gap = _this.gaps[g];
        
        // 确定缺口显示的结束位置
        var endIndex = visibleEndIndex;
        if (gap.filledIndex !== null) {
            endIndex = Math.min(gap.filledIndex, visibleEndIndex);
        }
        
        var startX = gap.gapStartIndex * candleWidth + candleWidth / 2 + offsetX;
        var endX = endIndex * candleWidth + candleWidth / 2 + offsetX;
        
        // 计算缺口的Y坐标（与K线坐标计算方式一致）
        var lowY = padding + (maxPrice - gap.lowPrice) / priceRange * availableHeight;
        var highY = padding + (maxPrice - gap.highPrice) / priceRange * availableHeight;
        
        // 限制Y坐标在主图范围内
        lowY = Math.max(0, Math.min(lowY, mainChartHeight));
        highY = Math.max(0, Math.min(highY, mainChartHeight));
        
        // 绘制缺口（灰色矩形）
        ctx.fillStyle = '#888888';
        ctx.fillRect(startX, Math.min(lowY, highY), endX - startX, Math.abs(lowY - highY));
    }
    
    ctx.globalAlpha = 1; // 恢复不透明
    
    // 恢复canvas状态
    ctx.restore();
};

// 清除缺口数据
GapDetection.prototype.clear = function() {
    this.gaps = [];
};
