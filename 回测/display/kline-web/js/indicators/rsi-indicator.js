// RSI指标功能模块
function RSIIndicator(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.rsiData = [];
    this.rsiN = 14; // RSI周期
    this.oversoldLine = 70; // 超卖线
    this.overboughtLine = 30; // 超买线
    this.oversoldTop = 90; // 超卖区顶部
    this.overboughtBottom = 10; // 超买区底部
    
    this.loadParams();
}

// 加载参数
RSIIndicator.prototype.loadParams = function() {
    try {
        var params = localStorage.getItem('rsiParams');
        if (params) {
            var parsedParams = JSON.parse(params);
            this.rsiN = parsedParams.rsiN || 14;
            this.oversoldLine = parsedParams.oversoldLine || 70;
            this.overboughtLine = parsedParams.overboughtLine || 30;
            this.oversoldTop = parsedParams.oversoldTop || 90;
            this.overboughtBottom = parsedParams.overboughtBottom || 10;
        }
    } catch (e) {
        console.error('加载RSI参数失败:', e);
    }
};

// 保存参数
RSIIndicator.prototype.saveParams = function() {
    try {
        var params = {
            rsiN: this.rsiN,
            oversoldLine: this.oversoldLine,
            overboughtLine: this.overboughtLine,
            oversoldTop: this.oversoldTop,
            overboughtBottom: this.overboughtBottom
        };
        localStorage.setItem('rsiParams', JSON.stringify(params));
    } catch (e) {
        console.error('保存RSI参数失败:', e);
    }
};

// 设置参数
RSIIndicator.prototype.setParams = function(rsiN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom) {
    this.rsiN = rsiN;
    if (oversoldLine !== undefined) this.oversoldLine = oversoldLine;
    if (overboughtLine !== undefined) this.overboughtLine = overboughtLine;
    if (oversoldTop !== undefined) this.oversoldTop = oversoldTop;
    if (overboughtBottom !== undefined) this.overboughtBottom = overboughtBottom;
    this.saveParams();
};

// 切换RSI显示状态
RSIIndicator.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 计算RSI指标
RSIIndicator.prototype.calculateRSI = function(candles, n) {
    if (!candles || candles.length === 0) {
        this.rsiData = [];
        return [];
    }

    if (!n) n = this.rsiN;

    var rsiData = [];
    
    // 计算价格变化
    var gains = [];
    var losses = [];
    
    for (var i = 0; i < candles.length; i++) {
        if (i === 0) {
            gains.push(0);
            losses.push(0);
        } else {
            var change = candles[i].close - candles[i - 1].close;
            if (change > 0) {
                gains.push(change);
                losses.push(0);
            } else {
                gains.push(0);
                losses.push(-change);
            }
        }
    }
    
    // 计算平均涨跌和RSI
    var avgGain = 0;
    var avgLoss = 0;
    
    for (var rsiIndex = 0; rsiIndex < candles.length; rsiIndex++) {
        if (rsiIndex < n) {
            // 前n个周期，计算初始平均
            if (rsiIndex === n - 1) {
                var gainSum = 0;
                var lossSum = 0;
                for (var s = 0; s < n; s++) {
                    gainSum += gains[s];
                    lossSum += losses[s];
                }
                avgGain = gainSum / n;
                avgLoss = lossSum / n;
            }
            rsiData.push({ rsi: 50 }); // 前n个周期默认50
        } else {
            // 之后的周期，使用平滑移动平均
            avgGain = (avgGain * (n - 1) + gains[rsiIndex]) / n;
            avgLoss = (avgLoss * (n - 1) + losses[rsiIndex]) / n;
            
            var rs = 0;
            var rsi = 50;
            if (avgLoss > 0) {
                rs = avgGain / avgLoss;
                rsi = 100 - (100 / (1 + rs));
            } else if (avgGain > 0) {
                rsi = 100;
            }
            
            rsiData.push({ rsi: rsi });
        }
    }

    this.rsiData = rsiData;
    
    console.log('RSI计算完成，共' + rsiData.length + '条数据');
    if (rsiData.length > 0) {
        var lastIndex = rsiData.length - 1;
        console.log('最新RSI值：' + rsiData[lastIndex].rsi.toFixed(2));
    }
    
    return rsiData;
};

// 渲染RSI指标
RSIIndicator.prototype.render = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, mainChartHeight) {
    if (!this.enabled || !this.rsiData || this.rsiData.length === 0) {
        return;
    }

    ctx.save(); // 保存canvas状态

    var canvas = ctx.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var subChartHeight = height - mainChartHeight;
    var subChartTop = mainChartHeight;

    // 绘制副图背景
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, subChartTop, width, subChartHeight);

    // 绘制副图分隔线
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, subChartTop);
    ctx.lineTo(width, subChartTop);
    ctx.stroke();

    // RSI数值范围（使用参数值）
    var minValue = this.overboughtBottom;
    var maxValue = this.oversoldTop;
    var valueRange = maxValue - minValue || 1;
    var padding = 10;
    var availableHeight = subChartHeight - padding * 2;

    console.log('RSI渲染参数: subChartTop=' + subChartTop.toFixed(2) + ', subChartHeight=' + subChartHeight.toFixed(2) + 
                ', availableHeight=' + availableHeight.toFixed(2) + 
                ', visibleStartIndex=' + visibleStartIndex + ', visibleEndIndex=' + visibleEndIndex);

    // 绘制超卖区域（绿色，靠上，数值高的地方）
    var oversoldTopY = subChartTop + padding + (maxValue - this.oversoldTop) / valueRange * availableHeight;
    var oversoldBottomY = subChartTop + padding + (maxValue - this.oversoldLine) / valueRange * availableHeight;
    ctx.fillStyle = 'rgba(38, 166, 154, 0.3)'; // 绿色半透明（超卖区）
    ctx.fillRect(0, oversoldTopY, width, oversoldBottomY - oversoldTopY);

    // 绘制超买区域（红色，靠下，数值低的地方）
    var overboughtTopY = subChartTop + padding + (maxValue - this.overboughtLine) / valueRange * availableHeight;
    var overboughtBottomY = subChartTop + padding + (maxValue - this.overboughtBottom) / valueRange * availableHeight;
    ctx.fillStyle = 'rgba(239, 83, 80, 0.3)'; // 红色半透明（超买区）
    ctx.fillRect(0, overboughtTopY, width, overboughtBottomY - overboughtTopY);

    // 绘制超卖线、中轴线（50）、超买线（从上到下的顺序）
    var linePositions = [this.oversoldLine, 50, this.overboughtLine];
    var lineColors = ['#26a69a', '#666666', '#ef5350'];
    
    for (var l = 0; l < linePositions.length; l++) {
        var lineY = subChartTop + padding + (maxValue - linePositions[l]) / valueRange * availableHeight;
        ctx.strokeStyle = lineColors[l];
        ctx.lineWidth = 0.5;
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

    // 绘制RSI线（橙色）
    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 2;
    ctx.beginPath();
    var firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (i >= this.rsiData.length) {
            break;
        }
        var rsi = this.rsiData[i].rsi;
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = subChartTop + padding + (maxValue - rsi) / valueRange * availableHeight;
        
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

// 清除RSI数据
RSIIndicator.prototype.clear = function() {
    this.rsiData = [];
};
