// BOLL布林通道指标
function BOLLIndicator(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    
    // BOLL数据：中轨(mid)、上轨(upper)、下轨(lower)
    this.bollData = {
        mid: [],
        upper: [],
        lower: []
    };
    
    // BOLL颜色配置
    this.colors = {
        mid: '#ffffff',
        upper: '#fbbf24',
        lower: '#22c55e'
    };
    
    // BOLL周期和倍数配置
    this.period = 20;
    this.stdDevTimes = 2;
    
    // 加载参数
    this.loadParams();
}

// 加载参数
BOLLIndicator.prototype.loadParams = function() {
    try {
        var params = localStorage.getItem('bollParams');
        if (params) {
            var parsedParams = JSON.parse(params);
            if (parsedParams.period !== undefined) this.period = parsedParams.period;
            if (parsedParams.stdDevTimes !== undefined) this.stdDevTimes = parsedParams.stdDevTimes;
            if (parsedParams.colors !== undefined) {
                for (var key in parsedParams.colors) {
                    if (this.colors[key] !== undefined) {
                        this.colors[key] = parsedParams.colors[key];
                    }
                }
            }
        }
    } catch (e) {
        console.error('加载BOLL参数失败:', e);
    }
};

// 保存参数
BOLLIndicator.prototype.saveParams = function() {
    try {
        var params = {
            period: this.period,
            stdDevTimes: this.stdDevTimes,
            colors: this.colors
        };
        localStorage.setItem('bollParams', JSON.stringify(params));
    } catch (e) {
        console.error('保存BOLL参数失败:', e);
    }
};

// 设置参数
BOLLIndicator.prototype.setParams = function(period, stdDevTimes, colors) {
    if (period !== undefined) this.period = period;
    if (stdDevTimes !== undefined) this.stdDevTimes = stdDevTimes;
    if (colors !== undefined) {
        for (var key in colors) {
            if (this.colors[key] !== undefined) {
                this.colors[key] = colors[key];
            }
        }
    }
    this.saveParams();
};

// 计算移动平均线
BOLLIndicator.prototype.calculateMA = function(data, period) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(null);
        } else {
            var sum = 0;
            for (var j = 0; j < period; j++) {
                sum += data[i - j].close;
            }
            result.push(sum / period);
        }
    }
    return result;
};

// 计算标准差
BOLLIndicator.prototype.calculateStdDev = function(data, period, maData) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        if (i < period - 1 || maData[i] === null) {
            result.push(null);
        } else {
            var sum = 0;
            for (var j = 0; j < period; j++) {
                var diff = data[i - j].close - maData[i];
                sum += diff * diff;
            }
            var variance = sum / period;
            result.push(Math.sqrt(variance));
        }
    }
    return result;
};

// 计算BOLL指标
BOLLIndicator.prototype.calculateBOLL = function(candles) {
    if (!candles || candles.length === 0) {
        this.bollData = {
            mid: [],
            upper: [],
            lower: []
        };
        return;
    }
    
    // 计算中轨（MA）
    var mid = this.calculateMA(candles, this.period);
    
    // 计算标准差
    var stdDev = this.calculateStdDev(candles, this.period, mid);
    
    // 计算上轨和下轨
    var upper = [];
    var lower = [];
    
    for (var i = 0; i < candles.length; i++) {
        if (mid[i] === null || stdDev[i] === null) {
            upper.push(null);
            lower.push(null);
        } else {
            upper.push(mid[i] + stdDev[i] * this.stdDevTimes);
            lower.push(mid[i] - stdDev[i] * this.stdDevTimes);
        }
    }
    
    this.bollData = {
        mid: mid,
        upper: upper,
        lower: lower
    };
    
    console.log('BOLL布林通道计算完成');
};

// 渲染BOLL指标
BOLLIndicator.prototype.render = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight) {
    if (!this.enabled) {
        return;
    }
    
    var padding = 15;
    var availableHeight = mainChartHeight - padding * 2;
    var priceRange = maxPrice - minPrice || 1;
    
    // 绘制上轨（黄色虚线）
    ctx.strokeStyle = this.colors.upper;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    var firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (this.bollData.upper[i] === null || this.bollData.upper[i] === undefined) {
            firstPoint = true;
            continue;
        }
        
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = padding + (maxPrice - this.bollData.upper[i]) / priceRange * availableHeight;
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 绘制中轨（白色实线）
    ctx.strokeStyle = this.colors.mid;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (this.bollData.mid[i] === null || this.bollData.mid[i] === undefined) {
            firstPoint = true;
            continue;
        }
        
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = padding + (maxPrice - this.bollData.mid[i]) / priceRange * availableHeight;
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // 绘制下轨（绿色虚线）
    ctx.strokeStyle = this.colors.lower;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    firstPoint = true;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (this.bollData.lower[i] === null || this.bollData.lower[i] === undefined) {
            firstPoint = true;
            continue;
        }
        
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = padding + (maxPrice - this.bollData.lower[i]) / priceRange * availableHeight;
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 填充上下轨之间的区域（半透明）
    ctx.beginPath();
    firstPoint = true;
    // 先绘制上轨从左到右
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (this.bollData.upper[i] === null || this.bollData.upper[i] === undefined) {
            continue;
        }
        
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = padding + (maxPrice - this.bollData.upper[i]) / priceRange * availableHeight;
        
        if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
        } else {
            ctx.lineTo(x, y);
        }
    }
    // 再绘制下轨从右到左
    for (var i = visibleEndIndex; i >= visibleStartIndex; i--) {
        if (this.bollData.lower[i] === null || this.bollData.lower[i] === undefined) {
            continue;
        }
        
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        var y = padding + (maxPrice - this.bollData.lower[i]) / priceRange * availableHeight;
        
        ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.05)';
    ctx.fill();
    
    // 在K线顶部显示BOLL数值标签
    this.renderLabels(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight);
};

// 渲染BOLL数值标签
BOLLIndicator.prototype.renderLabels = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight) {
    var lastIndex = visibleEndIndex;
    var padding = 15;
    var availableHeight = mainChartHeight - padding * 2;
    var priceRange = maxPrice - minPrice || 1;
    
    // 根据自选股列表是否显示调整标签X位置
    var stockListContainer = document.getElementById('stock-list-container');
    var isStockListVisible = stockListContainer && stockListContainer.style.display !== 'none';
    var labelX = isStockListVisible ? 210 : 10;
    var labelY = 5;
    var lineHeight = 16;
    
    // 绘制上轨标签
    if (this.bollData.upper.length > 0 && lastIndex >= 0) {
        var upperValue = this.bollData.upper[lastIndex];
        if (upperValue !== null && upperValue !== undefined) {
            ctx.fillStyle = this.colors.upper;
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            var labelText = '上轨:' + upperValue.toFixed(2);
            ctx.fillText(labelText, labelX, labelY);
            var textWidth = ctx.measureText(labelText).width;
            labelX += textWidth + 15;
        }
    }
    
    // 绘制中轨标签
    if (this.bollData.mid.length > 0 && lastIndex >= 0) {
        var midValue = this.bollData.mid[lastIndex];
        if (midValue !== null && midValue !== undefined) {
            ctx.fillStyle = this.colors.mid;
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            var labelText = '中轨:' + midValue.toFixed(2);
            ctx.fillText(labelText, labelX, labelY);
            var textWidth = ctx.measureText(labelText).width;
            labelX += textWidth + 15;
        }
    }
    
    // 绘制下轨标签
    if (this.bollData.lower.length > 0 && lastIndex >= 0) {
        var lowerValue = this.bollData.lower[lastIndex];
        if (lowerValue !== null && lowerValue !== undefined) {
            ctx.fillStyle = this.colors.lower;
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            var labelText = '下轨:' + lowerValue.toFixed(2);
            ctx.fillText(labelText, labelX, labelY);
        }
    }
};

// 切换显示状态
BOLLIndicator.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 清除数据
BOLLIndicator.prototype.clear = function() {
    this.bollData = {
        mid: [],
        upper: [],
        lower: []
    };
};

// 重置为默认参数
BOLLIndicator.prototype.resetToDefault = function() {
    this.period = 20;
    this.stdDevTimes = 2;
    this.colors = {
        mid: '#ffffff',
        upper: '#fbbf24',
        lower: '#22c55e'
    };
    this.saveParams();
};

// 渲染BOLL tooltip
BOLLIndicator.prototype.renderTooltip = function(ctx, mouseX, mouseY, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight) {
    if (!this.enabled) {
        return;
    }
    
    // 计算鼠标所在K线索引
    var candleIndex = Math.floor((mouseX - offsetX) / candleWidth);
    if (candleIndex < 0 || candleIndex >= this.klineChart.candles.length) {
        return;
    }
    
    // 获取BOLL数据
    var midValue = this.bollData.mid[candleIndex];
    var upperValue = this.bollData.upper[candleIndex];
    var lowerValue = this.bollData.lower[candleIndex];
    
    if (midValue === null || midValue === undefined) {
        return;
    }
    
    // 计算tooltip位置
    var tooltipX = mouseX + 10;
    var tooltipY = mouseY + 10;
    var lineHeight = 18;
    var padding = 8;
    
    // 准备tooltip文本
    var tooltipLines = [];
    if (upperValue !== null && upperValue !== undefined) {
        tooltipLines.push({ text: '上轨: ' + upperValue.toFixed(2), color: this.colors.upper });
    }
    if (midValue !== null && midValue !== undefined) {
        tooltipLines.push({ text: '中轨: ' + midValue.toFixed(2), color: this.colors.mid });
    }
    if (lowerValue !== null && lowerValue !== undefined) {
        tooltipLines.push({ text: '下轨: ' + lowerValue.toFixed(2), color: this.colors.lower });
    }
    
    if (tooltipLines.length === 0) {
        return;
    }
    
    // 计算tooltip宽度
    var maxTextWidth = 0;
    ctx.font = '12px Arial';
    for (var i = 0; i < tooltipLines.length; i++) {
        var textWidth = ctx.measureText(tooltipLines[i].text).width;
        if (textWidth > maxTextWidth) {
            maxTextWidth = textWidth;
        }
    }
    
    var tooltipWidth = maxTextWidth + padding * 2;
    var tooltipHeight = lineHeight * tooltipLines.length + padding * 2;
    
    // 调整tooltip位置，避免超出canvas边界
    if (tooltipX + tooltipWidth > ctx.canvas.width) {
        tooltipX = mouseX - tooltipWidth - 10;
    }
    if (tooltipY + tooltipHeight > ctx.canvas.height) {
        tooltipY = mouseY - tooltipHeight - 10;
    }
    
    // 绘制tooltip背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    
    // 绘制tooltip边框
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 1;
    ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    
    // 绘制tooltip文本
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.font = '12px Arial';
    
    for (var i = 0; i < tooltipLines.length; i++) {
        ctx.fillStyle = tooltipLines[i].color;
        ctx.fillText(tooltipLines[i].text, tooltipX + padding, tooltipY + padding + i * lineHeight);
    }
};
