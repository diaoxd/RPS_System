// KDJ指标功能模块
function KDJIndicator(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.kdjData = [];
    this.kdjN = 9; // KDJ周期
    this.kdjM1 = 3; // K线平滑周期
    this.kdjM2 = 3; // D线平滑周期
    this.wrN = 10; // WR周期
    this.oversoldLine = 80; // 超卖线
    this.overboughtLine = 20; // 超买线
    this.oversoldTop = 110; // 超卖区顶部
    this.overboughtBottom = -10; // 超买区底部
    
    this.loadParams();
}

// 加载参数
KDJIndicator.prototype.loadParams = function() {
    try {
        var params = localStorage.getItem('kdjParams');
        if (params) {
            var parsedParams = JSON.parse(params);
            this.kdjN = parsedParams.kdjN || 9;
            this.kdjM1 = parsedParams.kdjM1 || 3;
            this.kdjM2 = parsedParams.kdjM2 || 3;
            this.wrN = parsedParams.wrN || 10;
            this.oversoldLine = parsedParams.oversoldLine || 80;
            this.overboughtLine = parsedParams.overboughtLine || 20;
            this.oversoldTop = parsedParams.oversoldTop || 110;
            this.overboughtBottom = parsedParams.overboughtBottom || -10;
        }
    } catch (e) {
        console.error('加载KDJ参数失败:', e);
    }
};

// 保存参数
KDJIndicator.prototype.saveParams = function() {
    try {
        var params = {
            kdjN: this.kdjN,
            kdjM1: this.kdjM1,
            kdjM2: this.kdjM2,
            wrN: this.wrN,
            oversoldLine: this.oversoldLine,
            overboughtLine: this.overboughtLine,
            oversoldTop: this.oversoldTop,
            overboughtBottom: this.overboughtBottom
        };
        localStorage.setItem('kdjParams', JSON.stringify(params));
    } catch (e) {
        console.error('保存KDJ参数失败:', e);
    }
};

// 设置参数
KDJIndicator.prototype.setParams = function(kdjN, kdjM1, kdjM2, wrN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom) {
    this.kdjN = kdjN;
    this.kdjM1 = kdjM1;
    this.kdjM2 = kdjM2;
    this.wrN = wrN;
    if (oversoldLine !== undefined) this.oversoldLine = oversoldLine;
    if (overboughtLine !== undefined) this.overboughtLine = overboughtLine;
    if (oversoldTop !== undefined) this.oversoldTop = oversoldTop;
    if (overboughtBottom !== undefined) this.overboughtBottom = overboughtBottom;
    this.saveParams();
};

// 切换KDJ显示状态
KDJIndicator.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 计算KDJ指标（同时计算WR指标）
KDJIndicator.prototype.calculateKDJ = function(candles, n, m1, m2) {
    if (!candles || candles.length === 0) {
        this.kdjData = [];
        return [];
    }

    if (!n) n = this.kdjN;
    if (!m1) m1 = this.kdjM1;
    if (!m2) m2 = this.kdjM2;
    
    var wrN = this.wrN;

    var kdjData = [];

    // 计算最低价和最高价（用于KDJ）
    var lowestLows = [];
    var highestHighs = [];
    
    // 计算WR的最低价和最高价（WR周期10）
    var wrLowestLows = [];
    var wrHighestHighs = [];
    
    // 计算KDJ的最低价和最高价（周期9）
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
    
    // 计算WR的最低价和最高价
    for (var wrI = 0; wrI < candles.length; wrI++) {
        var wrStart = Math.max(0, wrI - wrN + 1);
        var wrWindow = candles.slice(wrStart, wrI + 1);
        
        var wrLows = [];
        var wrHighs = [];
        for (var wrW = 0; wrW < wrWindow.length; wrW++) {
            wrLows.push(wrWindow[wrW].low);
            wrHighs.push(wrWindow[wrW].high);
        }
        
        wrLowestLows.push(Math.min.apply(null, wrLows));
        wrHighestHighs.push(Math.max.apply(null, wrHighs));
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
        
        // 计算WR值（反方向）
        var wr = 50;
        var wrPriceRange = wrHighestHighs[kIndex] - wrLowestLows[kIndex];
        if (wrPriceRange > 0) {
            wr = (wrHighestHighs[kIndex] - candles[kIndex].close) / wrPriceRange * 100;
        }
        // 反方向显示：100 - WR
        wr = 100 - wr;
        
        kdjData.push({
            k: k,
            d: d,
            j: jValue,
            wr: wr
        });
    }

    this.kdjData = kdjData;
    
    console.log('KDJ计算完成，共' + kdjData.length + '条数据');
    if (kdjData.length > 0) {
        var lastIndex = kdjData.length - 1;
        console.log('最新KDJ值：K=' + kdjData[lastIndex].k.toFixed(2) + 
                    ', D=' + kdjData[lastIndex].d.toFixed(2) + 
                    ', J=' + kdjData[lastIndex].j.toFixed(2));
    }
    
    return kdjData;
};

// 绘制KDJ副图
KDJIndicator.prototype.render = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, mainChartHeight) {
    if (!this.enabled || !this.kdjData || this.kdjData.length === 0) {
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

    // 获取可见区域的KDJ数据
    var visibleKDJData = this.kdjData.slice(visibleStartIndex, visibleEndIndex + 1);
    
    if (visibleKDJData.length === 0) {
        ctx.restore(); // 恢复canvas状态
        return;
    }

    // 计算KDJ和WR的数值范围（根据实际可见数据计算）
    var minValue = 100;
    var maxValue = 0;
    for (var v = 0; v < visibleKDJData.length; v++) {
        var data = visibleKDJData[v];
        minValue = Math.min(minValue, data.k, data.d, data.j, data.wr);
        maxValue = Math.max(maxValue, data.k, data.d, data.j, data.wr);
    }
    
    // 确保0和100在显示范围内
    minValue = Math.min(minValue, 0);
    maxValue = Math.max(maxValue, 100);
    
    // 给上下留一些padding（减小padding，避免空间太大）
    var valuePadding = (maxValue - minValue) * 0.03;
    minValue -= valuePadding;
    maxValue += valuePadding;
    
    var valueRange = maxValue - minValue || 1;
    var padding = 10;
    var availableHeight = subChartHeight - padding * 2;
    
    console.log('KDJ渲染参数: subChartTop=' + subChartTop.toFixed(2) + ', subChartHeight=' + subChartHeight.toFixed(2) + 
                ', availableHeight=' + availableHeight.toFixed(2) + 
                ', visibleStartIndex=' + visibleStartIndex + ', visibleEndIndex=' + visibleEndIndex);

    // 绘制超卖区域（绿色，靠上，数值高的地方）
    if (this.oversoldTop >= minValue && this.oversoldLine <= maxValue) {
        var oversoldTopY = subChartTop + padding + (maxValue - this.oversoldTop) / valueRange * availableHeight;
        var oversoldBottomY = subChartTop + padding + (maxValue - this.oversoldLine) / valueRange * availableHeight;
        ctx.fillStyle = 'rgba(38, 166, 154, 0.3)'; 
        ctx.fillRect(0, oversoldTopY, width, oversoldBottomY - oversoldTopY);
    }

    // 绘制超买区域（红色，靠下，数值低的地方）
    if (this.overboughtLine >= minValue && this.overboughtBottom <= maxValue) {
        var overboughtTopY = subChartTop + padding + (maxValue - this.overboughtLine) / valueRange * availableHeight;
        var overboughtBottomY = subChartTop + padding + (maxValue - this.overboughtBottom) / valueRange * availableHeight;
        ctx.fillStyle = 'rgba(239, 83, 80, 0.3)'; 
        ctx.fillRect(0, overboughtTopY, width, overboughtBottomY - overboughtTopY);
    }

    // 绘制超卖线、中轴线（50）、超买线（从上到下的顺序）
    var linePositions = [this.oversoldLine, 50, this.overboughtLine];
    var lineColors = ['#26a69a', '#666666', '#ef5350'];
    
    for (var l = 0; l < linePositions.length; l++) {
        // 检查位置是否在可见范围内
        if (linePositions[l] >= minValue && linePositions[l] <= maxValue) {
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
    }

    // 绘制K线（白色，虚线）
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    var firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (i >= this.kdjData.length) {
            break;
        }
        var k = this.kdjData[i].k;
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = subChartTop + padding + (maxValue - k) / valueRange * availableHeight;
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 绘制D线（黄色，虚线）
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 0.8;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (i >= this.kdjData.length) {
            break;
        }
        var d = this.kdjData[i].d;
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = subChartTop + padding + (maxValue - d) / valueRange * availableHeight;
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 绘制J线（紫色）
    ctx.strokeStyle = '#9c27b0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (i >= this.kdjData.length) {
            break;
        }
        var j = this.kdjData[i].j;
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = subChartTop + padding + (maxValue - j) / valueRange * availableHeight;
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // 绘制WR线（蓝色）
    ctx.strokeStyle = '#2196f3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (i >= this.kdjData.length) {
            break;
        }
        var wr = this.kdjData[i].wr;
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
    
    // 绘制J线和WR线的最新数值标签（在右边）
    if (this.kdjData.length > 0) {
        var lastIndex = this.kdjData.length - 1;
        var lastData = this.kdjData[lastIndex];
        var labelPadding = 5;
        var labelHeight = 20;
        
        // 计算原始Y坐标
        var jY = subChartTop + padding + (maxValue - lastData.j) / valueRange * availableHeight;
        var wrY = subChartTop + padding + (maxValue - lastData.wr) / valueRange * availableHeight;
        
        // 检查是否重叠，如果重叠则调整位置
        var distance = Math.abs(jY - wrY);
        if (distance < labelHeight) {
            // 如果J线在上方，WR线在下方
            if (jY < wrY) {
                jY = jY - labelHeight / 2;
                wrY = wrY + labelHeight / 2;
            } else {
                // 如果WR线在上方，J线在下方
                wrY = wrY - labelHeight / 2;
                jY = jY + labelHeight / 2;
            }
        }
        
        // J线最新数值（紫色）
        var jValue = lastData.j.toFixed(2);
        var jTextWidth = ctx.measureText(jValue).width;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(width - jTextWidth - labelPadding * 2, jY - 10, jTextWidth + labelPadding * 2, 20);
        
        ctx.fillStyle = '#9c27b0';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(jValue, width - labelPadding, jY);
        
        // WR线最新数值（蓝色）
        var wrValue = lastData.wr.toFixed(2);
        var wrTextWidth = ctx.measureText(wrValue).width;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(width - wrTextWidth - labelPadding * 2, wrY - 10, wrTextWidth + labelPadding * 2, 20);
        
        ctx.fillStyle = '#2196f3';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(wrValue, width - labelPadding, wrY);
    }
    
    ctx.restore(); // 恢复canvas状态
};

// 清除KDJ数据
KDJIndicator.prototype.clear = function() {
    this.kdjData = [];
};
