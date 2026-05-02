// WR指标功能模块
function WRIndicator(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.wrData = [];
    this.wrN = 10; // WR周期
    this.oversoldLine = 80; // 超卖线
    this.overboughtLine = 20; // 超买线
    this.oversoldTop = 100; // 超卖区顶部
    this.overboughtBottom = 0; // 超买区底部
    
    this.loadParams();
}

// 加载参数
WRIndicator.prototype.loadParams = function() {
    try {
        var params = localStorage.getItem('wrParams');
        if (params) {
            var parsedParams = JSON.parse(params);
            this.wrN = parsedParams.wrN || 10;
            this.oversoldLine = parsedParams.oversoldLine || 80;
            this.overboughtLine = parsedParams.overboughtLine || 20;
            this.oversoldTop = parsedParams.oversoldTop || 100;
            this.overboughtBottom = parsedParams.overboughtBottom || 0;
        }
    } catch (e) {
        console.error('加载WR参数失败:', e);
    }
};

// 保存参数
WRIndicator.prototype.saveParams = function() {
    try {
        var params = {
            wrN: this.wrN,
            oversoldLine: this.oversoldLine,
            overboughtLine: this.overboughtLine,
            oversoldTop: this.oversoldTop,
            overboughtBottom: this.overboughtBottom
        };
        localStorage.setItem('wrParams', JSON.stringify(params));
    } catch (e) {
        console.error('保存WR参数失败:', e);
    }
};

// 设置参数
WRIndicator.prototype.setParams = function(wrN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom) {
    this.wrN = wrN;
    if (oversoldLine !== undefined) this.oversoldLine = oversoldLine;
    if (overboughtLine !== undefined) this.overboughtLine = overboughtLine;
    if (oversoldTop !== undefined) this.oversoldTop = oversoldTop;
    if (overboughtBottom !== undefined) this.overboughtBottom = overboughtBottom;
    this.saveParams();
};

// 切换WR显示状态
WRIndicator.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 计算WR指标
WRIndicator.prototype.calculateWR = function(candles, n) {
    if (!candles || candles.length === 0) {
        this.wrData = [];
        return [];
    }

    if (!n) n = this.wrN;

    var wrData = [];

    // 计算最高价和最低价
    var highestHighs = [];
    var lowestLows = [];
    
    for (var i = 0; i < candles.length; i++) {
        var start = Math.max(0, i - n + 1);
        var window = candles.slice(start, i + 1);
        
        var highs = [];
        var lows = [];
        for (var w = 0; w < window.length; w++) {
            highs.push(window[w].high);
            lows.push(window[w].low);
        }
        
        // 使用apply调用Math.min和Math.max，避免扩展运算符
        highestHighs.push(Math.max.apply(null, highs));
        lowestLows.push(Math.min.apply(null, lows));
    }
    
    // 计算WR值（反方向显示）
    for (var j = 0; j < candles.length; j++) {
        var priceRange = highestHighs[j] - lowestLows[j];
        var wr = 50; // 默认值
        if (priceRange > 0) {
            wr = (highestHighs[j] - candles[j].close) / priceRange * 100;
        }
        
        // 反方向显示：100 - WR
        wr = 100 - wr;
        
        wrData.push({
            wr: wr
        });
    }

    this.wrData = wrData;
    
    console.log('WR计算完成，共' + wrData.length + '条数据');
    if (wrData.length > 0) {
        var lastIndex = wrData.length - 1;
        console.log('最新WR值：' + wrData[lastIndex].wr.toFixed(2));
    }
    
    return wrData;
};

// 绘制WR副图
WRIndicator.prototype.render = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, mainChartHeight) {
    if (!this.enabled || !this.wrData || this.wrData.length === 0) {
        return;
    }

    ctx.save(); // 保存canvas状态

    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    
    // 副图高度（主图占85%，副图占15%）
    var subChartHeight = height - mainChartHeight;
    var subChartTop = mainChartHeight;
    
    // 绘制副图背景
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, subChartTop, width, subChartHeight);
    
    // 绘制分隔线
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, subChartTop);
    ctx.lineTo(width, subChartTop);
    ctx.stroke();

    // 获取可见区域的WR数据
    var visibleWRData = this.wrData.slice(visibleStartIndex, visibleEndIndex + 1);
    
    if (visibleWRData.length === 0) {
        ctx.restore(); // 恢复canvas状态
        return;
    }

    // WR标准数值范围：0-100
    var minValue = 0;
    var maxValue = 100;
    
    var valueRange = maxValue - minValue || 1;
    var padding = 10;
    var availableHeight = subChartHeight - padding * 2;
    
    console.log('WR渲染参数: subChartTop=' + subChartTop.toFixed(2) + ', subChartHeight=' + subChartHeight.toFixed(2) + 
                ', availableHeight=' + availableHeight.toFixed(2) + 
                ', visibleStartIndex=' + visibleStartIndex + ', visibleEndIndex=' + visibleEndIndex);

    // 绘制超卖区域（绿色，靠上，数值高的地方）
    var oversoldTopY = subChartTop + padding + (maxValue - this.oversoldTop) / valueRange * availableHeight;
    var oversoldBottomY = subChartTop + padding + (maxValue - this.oversoldLine) / valueRange * availableHeight;
    ctx.fillStyle = 'rgba(38, 166, 154, 0.3)'; 
    ctx.fillRect(0, oversoldTopY, width, oversoldBottomY - oversoldTopY);

    // 绘制超买区域（红色，靠下，数值低的地方）
    var overboughtTopY = subChartTop + padding + (maxValue - this.overboughtLine) / valueRange * availableHeight;
    var overboughtBottomY = subChartTop + padding + (maxValue - this.overboughtBottom) / valueRange * availableHeight;
    ctx.fillStyle = 'rgba(239, 83, 80, 0.3)'; 
    ctx.fillRect(0, overboughtTopY, width, overboughtBottomY - overboughtTopY);

    // 绘制超卖线、中轴线（50）、超买线（从上到下的顺序）
    var linePositions = [this.oversoldLine, 50, this.overboughtLine];
    var lineColors = ['#26a69a', '#666666', '#ef5350'];
    
    for (var l = 0; l < linePositions.length; l++) {
        var lineY = subChartTop + padding + (maxValue - linePositions[l]) / valueRange * availableHeight;
        ctx.strokeStyle = lineColors[l];
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 绘制虚线数值标签（在最左边）
        ctx.fillStyle = lineColors[l];
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(linePositions[l].toString(), 2, lineY);
    }

    // 绘制WR线（白色）
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    var firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (i >= this.wrData.length) {
            break;
        }
        var wr = this.wrData[i].wr;
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = subChartTop + padding + (maxValue - wr) / valueRange * availableHeight;
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    ctx.restore(); // 恢复canvas状态
};

// 清除WR数据
WRIndicator.prototype.clear = function() {
    this.wrData = [];
};
