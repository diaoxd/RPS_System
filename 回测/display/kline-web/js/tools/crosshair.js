// 十字星虚线功能模块
function Crosshair(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.x = 0;
    this.y = 0;
    this.candleIndex = -1;
    this.price = 0;
}

// 切换十字星显示状态
Crosshair.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 设置十字星位置
Crosshair.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    
    // 计算对应的K线索引
    this.calculateCandleIndex();
    
    // 计算对应的价格
    this.calculatePrice();
};

// 计算K线索引
Crosshair.prototype.calculateCandleIndex = function() {
    var canvas = this.klineChart.canvas;
    var width = canvas.width;
    var rightPadding = 45;
    var availableWidth = width - rightPadding;
    var baseCandleWidth = availableWidth / this.klineChart.candles.length;
    var candleWidth = baseCandleWidth * this.klineChart.scale;
    
    this.candleIndex = Math.floor((this.x - this.klineChart.offsetX) / candleWidth);
    
    // 确保索引在有效范围内
    if (this.candleIndex < 0) {
        this.candleIndex = 0;
    } else if (this.candleIndex >= this.klineChart.candles.length) {
        this.candleIndex = this.klineChart.candles.length - 1;
    }
};

// 计算价格
Crosshair.prototype.calculatePrice = function() {
    if (this.candleIndex < 0 || this.candleIndex >= this.klineChart.candles.length) {
        this.price = 0;
        return;
    }

    var candles = this.klineChart.candles;
    var canvas = this.klineChart.canvas;
    var height = canvas.height;
    
    // 根据是否开启量能副图动态调整主图高度
    var mainChartHeight = this.klineChart.macdIndicator.enabled ? height * 0.85 : height;
    
    // 计算可见区域的价格范围
    var width = canvas.width;
    var rightPadding = 45;
    var availableWidth = width - rightPadding;
    var baseCandleWidth = availableWidth / this.klineChart.candles.length;
    var candleWidth = baseCandleWidth * this.klineChart.scale;
    
    var visibleStartIndex = Math.max(0, Math.floor((-this.klineChart.offsetX) / candleWidth));
    var visibleEndIndex = Math.min(this.klineChart.candles.length - 1, Math.ceil((width - this.klineChart.offsetX) / candleWidth));
    
    var visibleCandles = candles.slice(visibleStartIndex, visibleEndIndex + 1);
    var visiblePrices = [];
    for (var i = 0; i < visibleCandles.length; i++) {
        var c = visibleCandles[i];
        visiblePrices.push(c.open, c.close, c.high, c.low);
    }
    var minPrice = Math.min.apply(null, visiblePrices);
    var maxPrice = Math.max.apply(null, visiblePrices);
    
    if (!visibleCandles.length) {
        var allPrices = [];
        for (var i = 0; i < candles.length; i++) {
            var c = candles[i];
            allPrices.push(c.open, c.close, c.high, c.low);
        }
        minPrice = Math.min.apply(null, allPrices);
        maxPrice = Math.max.apply(null, allPrices);
    }
    
    var priceRange = maxPrice - minPrice || 1;
    
    // 根据Y坐标计算价格（基于主图高度）
    var padding = 15;
    var availableHeight = mainChartHeight - padding * 2;
    this.price = maxPrice - (this.y - padding) / availableHeight * priceRange;
};

// 绘制十字星虚线
Crosshair.prototype.render = function(ctx) {
    if (!this.enabled || this.candleIndex < 0) {
        return;
    }

    var canvas = this.klineChart.canvas;
    var width = canvas.width;
    var height = canvas.height;

    // 设置虚线样式
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // 绘制水平线
    ctx.beginPath();
    ctx.moveTo(0, this.y);
    ctx.lineTo(width, this.y);
    ctx.stroke();

    // 绘制垂直线
    ctx.beginPath();
    ctx.moveTo(this.x, 0);
    ctx.lineTo(this.x, height);
    ctx.stroke();

    // 重置虚线样式
    ctx.setLineDash([]);

    // 绘制价格标签（仅在主图区域显示）
    var mainChartHeight = this.klineChart.macdIndicator.enabled ? height * 0.85 : height;
    if (this.y < mainChartHeight) {
        this.drawPriceLabel(ctx);
    }

    // 绘制日期标签
    this.drawDateLabel(ctx);

    // 绘制K线信息窗口
    this.drawCandleInfo(ctx);
};

// 绘制价格标签
Crosshair.prototype.drawPriceLabel = function(ctx) {
    var price = this.price.toFixed(2);
    var padding = 5;
    var textWidth = ctx.measureText(price).width;
    
    // 绘制标签背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.x + 10, this.y - 10, textWidth + padding * 2, 20);
    
    // 绘制标签文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(price, this.x + 10 + padding, this.y);
};

// 绘制日期标签
Crosshair.prototype.drawDateLabel = function(ctx) {
    if (this.candleIndex < 0 || this.candleIndex >= this.klineChart.candles.length) {
        return;
    }

    var candle = this.klineChart.candles[this.candleIndex];
    var date = candle.date || '';
    var padding = 5;
    var textWidth = ctx.measureText(date).width;
    
    // 计算主图高度（根据是否开启副图指标动态调整）
    var height = this.klineChart.canvas.height;
    var mainChartHeight;
    if (this.klineChart.macdIndicator.enabled || 
        this.klineChart.kdjIndicator.enabled || 
        this.klineChart.wrIndicator.enabled ||
        this.klineChart.rsiIndicator.enabled) {
        mainChartHeight = height * 0.85;
    } else {
        mainChartHeight = height;
    }
    
    // 绘制标签背景（放在主图底部）
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(this.x - textWidth / 2 - padding, mainChartHeight - 30, textWidth + padding * 2, 20);
    
    // 绘制标签文字
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(date, this.x, mainChartHeight - 20);
};

// 清除十字星
Crosshair.prototype.clear = function() {
    this.enabled = false;
};

// 绘制K线信息窗口
Crosshair.prototype.drawCandleInfo = function(ctx) {
    if (this.candleIndex < 0 || this.candleIndex >= this.klineChart.candles.length) {
        return;
    }

    var candle = this.klineChart.candles[this.candleIndex];
    if (!candle) {
        return;
    }

    // 计算涨幅：使用前一日收盘价作为基准
    var prevClose = null;
    if (this.candleIndex > 0) {
        var prevCandle = this.klineChart.candles[this.candleIndex - 1];
        prevClose = prevCandle.close;
    }

    var changePercent;
    var changeValue;

    if (prevClose !== null && prevClose !== 0) {
        // 有前一日收盘价，使用前一日收盘价计算
        changePercent = ((candle.close - prevClose) / prevClose * 100).toFixed(2);
        changeValue = (candle.close - prevClose).toFixed(2);
    } else {
        // 没有前一日收盘价，使用当日开盘价计算（第一根K线）
        changePercent = ((candle.close - candle.open) / candle.open * 100).toFixed(2);
        changeValue = (candle.close - candle.open).toFixed(2);
    }

    // 格式化成交量
    function formatVolume(volume) {
        if (volume >= 100000000) {
            return (volume / 100000000).toFixed(2) + '亿';
        } else if (volume >= 10000) {
            return (volume / 10000).toFixed(2) + '万';
        } else {
            return volume.toFixed(0);
        }
    }

    // 格式化成交额
    function formatAmount(amount) {
        if (amount >= 100000000) {
            return (amount / 100000000).toFixed(2) + '亿';
        } else if (amount >= 10000) {
            return (amount / 10000).toFixed(2) + '万';
        } else {
            return amount.toFixed(0);
        }
    }

    // 准备信息文本
    var lines = [
        '日期: ' + (candle.date || ''),
        '开盘: ' + candle.open.toFixed(2),
        '最高: ' + candle.high.toFixed(2),
        '最低: ' + candle.low.toFixed(2),
        '收盘: ' + candle.close.toFixed(2),
        '涨跌: ' + changeValue + ' (' + changePercent + '%)',
        '成交量: ' + formatVolume(candle.volume || 0),
        '成交额: ' + formatAmount(candle.amount || 0),
        '换手: --'
    ];

    // 计算窗口尺寸
    var padding = 10;
    var lineHeight = 20;
    ctx.font = '12px Arial';
    
    var maxWidth = 0;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var width = ctx.measureText(line).width;
        if (width > maxWidth) {
            maxWidth = width;
        }
    }

    var windowWidth = maxWidth + padding * 2;
    var windowHeight = lines.length * lineHeight + padding * 2;

    // 计算窗口位置（避免超出画布边界）
    var windowX = this.x + 20;
    var windowY = this.y + 20;

    if (windowX + windowWidth > ctx.canvas.width) {
        windowX = this.x - windowWidth - 20;
    }

    if (windowY + windowHeight > ctx.canvas.height) {
        windowY = this.y - windowHeight - 20;
    }

    // 绘制窗口背景
    ctx.fillStyle = 'rgba(30, 30, 30, 0.95)';
    ctx.fillRect(windowX, windowY, windowWidth, windowHeight);

    // 绘制窗口边框
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(windowX, windowY, windowWidth, windowHeight);

    // 绘制信息文本
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var y = windowY + padding + i * lineHeight;
        
        // 根据涨跌设置颜色
        if (line.indexOf('涨跌') !== -1) {
            if (parseFloat(changePercent) >= 0) {
                ctx.fillStyle = '#ef5350'; // 红色（上涨）
            } else {
                ctx.fillStyle = '#26a69a'; // 绿色（下跌）
            }
        } else {
            ctx.fillStyle = '#ffffff';
        }
        
        ctx.fillText(line, windowX + padding, y);
    }
};
