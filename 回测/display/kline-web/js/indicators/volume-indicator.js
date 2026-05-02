// 成交量指标功能模块
function VolumeIndicator(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.volumeData = [];
    this.maData = {};
    
    // 默认均线周期
    this.defaultPeriods = {
        ma5: 5,
        ma10: 10,
        ma20: 20,
        ma30: 30
    };
    
    // 默认均线颜色
    this.defaultColors = {
        ma5: '#fbbf24',
        ma10: '#60a5fa',
        ma20: '#22c55e',
        ma30: '#f97316'
    };
    
    // 均线周期
    this.periods = {
        ma5: 5,
        ma10: 10,
        ma20: 20,
        ma30: 30
    };
    
    // 均线颜色
    this.colors = {
        ma5: '#fbbf24',
        ma10: '#60a5fa',
        ma20: '#22c55e',
        ma30: '#f97316'
    };
    
    // 均线显示状态
    this.enabledList = {
        ma5: false,
        ma10: false,
        ma20: false,
        ma30: false
    };
    
    this.loadConfig();
}

// 加载配置
VolumeIndicator.prototype.loadConfig = function() {
    try {
        var savedPeriods = localStorage.getItem('volumePeriods');
        var savedColors = localStorage.getItem('volumeColors');
        var savedEnabled = localStorage.getItem('volumeEnabledList');
        
        if (savedPeriods) {
            this.periods = JSON.parse(savedPeriods);
        }
        if (savedColors) {
            this.colors = JSON.parse(savedColors);
        }
        if (savedEnabled) {
            this.enabledList = JSON.parse(savedEnabled);
        }
    } catch (e) {
        console.error('加载成交量均线配置失败:', e);
    }
};

// 保存配置
VolumeIndicator.prototype.saveConfig = function() {
    try {
        localStorage.setItem('volumePeriods', JSON.stringify(this.periods));
        localStorage.setItem('volumeColors', JSON.stringify(this.colors));
        localStorage.setItem('volumeEnabledList', JSON.stringify(this.enabledList));
    } catch (e) {
        console.error('保存成交量均线配置失败:', e);
    }
};

// 设置参数
VolumeIndicator.prototype.setParams = function(periods, colors, enabledList) {
    if (periods) {
        this.periods = periods;
    }
    if (colors) {
        this.colors = colors;
    }
    if (enabledList) {
        this.enabledList = enabledList;
    }
    this.saveConfig();
};

// 重置为默认值
VolumeIndicator.prototype.resetToDefault = function() {
    this.periods = JSON.parse(JSON.stringify(this.defaultPeriods));
    this.colors = JSON.parse(JSON.stringify(this.defaultColors));
    this.enabledList = {
        ma5: false,
        ma10: false,
        ma20: false,
        ma30: false
    };
    this.saveConfig();
};

// 切换成交量显示状态
VolumeIndicator.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 清除成交量数据
VolumeIndicator.prototype.clear = function() {
    this.volumeData = [];
    this.maData = {};
};

// 计算成交量指标
VolumeIndicator.prototype.calculateVolume = function(candles) {
    if (!candles || candles.length === 0) {
        return;
    }
    
    this.volumeData = [];
    this.maData = {
        ma5: [],
        ma10: [],
        ma20: [],
        ma30: []
    };
    
    for (var i = 0; i < candles.length; i++) {
        this.volumeData.push(candles[i].volume || 0);
        
        // 计算MA5
        if (i >= this.periods.ma5 - 1) {
            var sum5 = 0;
            for (var k5 = i - this.periods.ma5 + 1; k5 <= i; k5++) {
                sum5 += (candles[k5].volume || 0);
            }
            this.maData.ma5.push(sum5 / this.periods.ma5);
        } else {
            this.maData.ma5.push(null);
        }
        
        // 计算MA10
        if (i >= this.periods.ma10 - 1) {
            var sum10 = 0;
            for (var k10 = i - this.periods.ma10 + 1; k10 <= i; k10++) {
                sum10 += (candles[k10].volume || 0);
            }
            this.maData.ma10.push(sum10 / this.periods.ma10);
        } else {
            this.maData.ma10.push(null);
        }
        
        // 计算MA20
        if (i >= this.periods.ma20 - 1) {
            var sum20 = 0;
            for (var k20 = i - this.periods.ma20 + 1; k20 <= i; k20++) {
                sum20 += (candles[k20].volume || 0);
            }
            this.maData.ma20.push(sum20 / this.periods.ma20);
        } else {
            this.maData.ma20.push(null);
        }
        
        // 计算MA30
        if (i >= this.periods.ma30 - 1) {
            var sum30 = 0;
            for (var k30 = i - this.periods.ma30 + 1; k30 <= i; k30++) {
                sum30 += (candles[k30].volume || 0);
            }
            this.maData.ma30.push(sum30 / this.periods.ma30);
        } else {
            this.maData.ma30.push(null);
        }
    }
};

// 绘制成交量副图
VolumeIndicator.prototype.render = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, mainChartHeight) {
    if (!this.enabled || !this.volumeData || this.volumeData.length === 0) {
        return;
    }
    
    var width = this.klineChart.canvas.width;
    var height = this.klineChart.canvas.height;
    var subChartTop = mainChartHeight;
    var subChartHeight = height - mainChartHeight;
    var rightPadding = 45;
    
    // 绘制K线主图区与成交量副图区之间的灰色分界线
    ctx.beginPath();
    ctx.moveTo(0, subChartTop);
    ctx.lineTo(width - rightPadding, subChartTop);
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 计算实体宽度
    var baseBodyWidth = 6;
    var maxBodyWidthRatio = 0.8;
    var maxBodyWidth = candleWidth * maxBodyWidthRatio;
    var bodyWidth = Math.min(baseBodyWidth * this.klineChart.scale, maxBodyWidth);
    
    // 找到最大成交量
    var maxVolume = 0;
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (this.volumeData[i] > maxVolume) {
            maxVolume = this.volumeData[i];
        }
        // 检查所有均线
        if (this.enabledList.ma5 && this.maData.ma5[i] && this.maData.ma5[i] > maxVolume) {
            maxVolume = this.maData.ma5[i];
        }
        if (this.enabledList.ma10 && this.maData.ma10[i] && this.maData.ma10[i] > maxVolume) {
            maxVolume = this.maData.ma10[i];
        }
        if (this.enabledList.ma20 && this.maData.ma20[i] && this.maData.ma20[i] > maxVolume) {
            maxVolume = this.maData.ma20[i];
        }
        if (this.enabledList.ma30 && this.maData.ma30[i] && this.maData.ma30[i] > maxVolume) {
            maxVolume = this.maData.ma30[i];
        }
    }
    if (maxVolume === 0) maxVolume = 1;
    
    var padding = 5;
    var subChartBottom = subChartTop + subChartHeight;
    var availableSubHeight = subChartHeight - padding * 2;
    
    // 绘制背景网格
    ctx.strokeStyle = 'rgba(55, 65, 81, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var g = 0; g <= 4; g++) {
        var gridY = subChartTop + padding + (availableSubHeight * g / 4);
        ctx.moveTo(0, gridY);
        ctx.lineTo(width - rightPadding, gridY);
    }
    ctx.stroke();
    
    // 绘制成交量柱
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        var candleX = i * candleWidth + candleWidth / 2 + offsetX;
        
        if (candleX >= -candleWidth && candleX <= width) {
            var volume = this.volumeData[i] || 0;
            var volumeHeight = (volume / maxVolume) * availableSubHeight;
            
            var rectX = candleX - bodyWidth / 2;
            var rectY = subChartBottom - padding - volumeHeight;
            var rectHeight = volumeHeight;
            
            // 根据涨跌确定颜色
            var color;
            if (i === 0) {
                color = '#60a5fa';
            } else {
                var prevClose = this.klineChart.candles[i - 1].close;
                var currentClose = this.klineChart.candles[i].close;
                if (currentClose >= prevClose) {
                    color = '#ef5350';
                } else {
                    color = '#66bb6a';
                }
            }
            
            ctx.fillStyle = color;
            ctx.fillRect(rectX, rectY, bodyWidth, rectHeight);
        }
    }
    
    // 绘制MA5
    if (this.enabledList.ma5 && this.maData.ma5) {
        ctx.strokeStyle = this.colors.ma5;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        var firstPoint = true;
        for (var m5 = visibleStartIndex; m5 <= visibleEndIndex; m5++) {
            if (this.maData.ma5[m5] !== null) {
                var maX5 = m5 * candleWidth + candleWidth / 2 + offsetX;
                var maY5 = subChartBottom - padding - (this.maData.ma5[m5] / maxVolume) * availableSubHeight;
                if (firstPoint) {
                    ctx.moveTo(maX5, maY5);
                    firstPoint = false;
                } else {
                    ctx.lineTo(maX5, maY5);
                }
            }
        }
        ctx.stroke();
    }
    
    // 绘制MA10
    if (this.enabledList.ma10 && this.maData.ma10) {
        ctx.strokeStyle = this.colors.ma10;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        var firstPoint = true;
        for (var m10 = visibleStartIndex; m10 <= visibleEndIndex; m10++) {
            if (this.maData.ma10[m10] !== null) {
                var maX10 = m10 * candleWidth + candleWidth / 2 + offsetX;
                var maY10 = subChartBottom - padding - (this.maData.ma10[m10] / maxVolume) * availableSubHeight;
                if (firstPoint) {
                    ctx.moveTo(maX10, maY10);
                    firstPoint = false;
                } else {
                    ctx.lineTo(maX10, maY10);
                }
            }
        }
        ctx.stroke();
    }
    
    // 绘制MA20
    if (this.enabledList.ma20 && this.maData.ma20) {
        ctx.strokeStyle = this.colors.ma20;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        var firstPoint = true;
        for (var m20 = visibleStartIndex; m20 <= visibleEndIndex; m20++) {
            if (this.maData.ma20[m20] !== null) {
                var maX20 = m20 * candleWidth + candleWidth / 2 + offsetX;
                var maY20 = subChartBottom - padding - (this.maData.ma20[m20] / maxVolume) * availableSubHeight;
                if (firstPoint) {
                    ctx.moveTo(maX20, maY20);
                    firstPoint = false;
                } else {
                    ctx.lineTo(maX20, maY20);
                }
            }
        }
        ctx.stroke();
    }
    
    // 绘制MA30
    if (this.enabledList.ma30 && this.maData.ma30) {
        ctx.strokeStyle = this.colors.ma30;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        var firstPoint = true;
        for (var m30 = visibleStartIndex; m30 <= visibleEndIndex; m30++) {
            if (this.maData.ma30[m30] !== null) {
                var maX30 = m30 * candleWidth + candleWidth / 2 + offsetX;
                var maY30 = subChartBottom - padding - (this.maData.ma30[m30] / maxVolume) * availableSubHeight;
                if (firstPoint) {
                    ctx.moveTo(maX30, maY30);
                    firstPoint = false;
                } else {
                    ctx.lineTo(maX30, maY30);
                }
            }
        }
        ctx.stroke();
    }
    
    // 绘制成交量标签
    ctx.font = '11px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText('成交量', 5, subChartTop + 2);
    
    // 绘制均线标签
    var labelX = 65;
    if (this.enabledList.ma5) {
        ctx.fillStyle = this.colors.ma5;
        ctx.fillText('MA' + this.periods.ma5, labelX, subChartTop + 2);
        labelX += 40 + (this.periods.ma5 > 9 ? 5 : 0);
    }
    if (this.enabledList.ma10) {
        ctx.fillStyle = this.colors.ma10;
        ctx.fillText('MA' + this.periods.ma10, labelX, subChartTop + 2);
        labelX += 40 + (this.periods.ma10 > 9 ? 5 : 0);
    }
    if (this.enabledList.ma20) {
        ctx.fillStyle = this.colors.ma20;
        ctx.fillText('MA' + this.periods.ma20, labelX, subChartTop + 2);
        labelX += 40 + (this.periods.ma20 > 9 ? 5 : 0);
    }
    if (this.enabledList.ma30) {
        ctx.fillStyle = this.colors.ma30;
        ctx.fillText('MA' + this.periods.ma30, labelX, subChartTop + 2);
        labelX += 40 + (this.periods.ma30 > 9 ? 5 : 0);
    }
    
    // 绘制最大成交量数值
    ctx.textAlign = 'right';
    ctx.fillStyle = '#9ca3af';
    ctx.fillText(this.formatVolume(maxVolume), width - rightPadding - 5, subChartTop + 2);
};

// 格式化成交量显示
VolumeIndicator.prototype.formatVolume = function(volume) {
    if (volume >= 100000000) {
        return (volume / 100000000).toFixed(2) + '亿';
    } else if (volume >= 10000) {
        return (volume / 10000).toFixed(2) + '万';
    } else {
        return volume.toFixed(0);
    }
};
