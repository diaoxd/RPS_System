// MACD指标功能模块
function MACDIndicator(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.showLines = false;
    this.macdData = [];
    
    // MACD参数
    this.shortPeriod = 12;
    this.longPeriod = 26;
    this.signalPeriod = 9;
    
    // 从localStorage加载参数
    this.loadParams();
}

// 切换MACD显示状态
MACDIndicator.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 切换MACD线显示状态
MACDIndicator.prototype.toggleLines = function() {
    this.showLines = !this.showLines;
    return this.showLines;
};

// 设置MACD参数
MACDIndicator.prototype.setParams = function(shortPeriod, longPeriod, signalPeriod) {
    this.shortPeriod = shortPeriod;
    this.longPeriod = longPeriod;
    this.signalPeriod = signalPeriod;
    this.saveParams();
};

// 保存参数到localStorage
MACDIndicator.prototype.saveParams = function() {
    try {
        var params = {
            shortPeriod: this.shortPeriod,
            longPeriod: this.longPeriod,
            signalPeriod: this.signalPeriod
        };
        localStorage.setItem('macdParams', JSON.stringify(params));
    } catch (e) {
        console.error('保存MACD参数失败:', e);
    }
};

// 从localStorage加载参数
MACDIndicator.prototype.loadParams = function() {
    try {
        var paramsStr = localStorage.getItem('macdParams');
        if (paramsStr) {
            var params = JSON.parse(paramsStr);
            if (params.shortPeriod) this.shortPeriod = params.shortPeriod;
            if (params.longPeriod) this.longPeriod = params.longPeriod;
            if (params.signalPeriod) this.signalPeriod = params.signalPeriod;
        }
    } catch (e) {
        console.error('加载MACD参数失败:', e);
    }
};

// 计算MACD指标
MACDIndicator.prototype.calculateMACD = function(candles) {
    if (!candles || candles.length === 0) {
        return [];
    }

    var shortPeriod = this.shortPeriod;
    var longPeriod = this.longPeriod;
    var signalPeriod = this.signalPeriod;

    var macdData = [];
    var emaShort = null;
    var emaLong = null;
    var emaSignal = null;

    for (var i = 0; i < candles.length; i++) {
        var closePrice = candles[i].close;

        // 计算短期EMA(12)
        if (emaShort === null) {
            emaShort = closePrice;
        } else {
            emaShort = emaShort * (shortPeriod - 1) / (shortPeriod + 1) + closePrice * 2 / (shortPeriod + 1);
        }

        // 计算长期EMA(26)
        if (emaLong === null) {
            emaLong = closePrice;
        } else {
            emaLong = emaLong * (longPeriod - 1) / (longPeriod + 1) + closePrice * 2 / (longPeriod + 1);
        }

        // 计算DIF
        var dif = emaShort - emaLong;

        // 计算DEA（信号线）
        if (emaSignal === null) {
            emaSignal = dif;
        } else {
            emaSignal = emaSignal * (signalPeriod - 1) / (signalPeriod + 1) + dif * 2 / (signalPeriod + 1);
        }

        // 计算MACD柱
        var macd = (dif - emaSignal) * 2;

        macdData.push({
            dif: dif,
            dea: emaSignal,
            macd: macd
        });
    }

    this.macdData = macdData;
    return macdData;
};

// 绘制MACD副图
MACDIndicator.prototype.render = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, mainChartHeight) {
    if (!this.enabled || !this.macdData || this.macdData.length === 0) {
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

    // 获取可见区域的MACD数据
    var visibleMACDData = this.macdData.slice(visibleStartIndex, visibleEndIndex + 1);
    
    if (visibleMACDData.length === 0) {
        ctx.restore(); // 恢复canvas状态
        return;
    }

    // 计算MACD的数值范围
    var macdValues = [];
    var difValues = [];
    var deaValues = [];
    for (var v = 0; v < visibleMACDData.length; v++) {
        var d = visibleMACDData[v];
        macdValues.push(d.macd);
        difValues.push(d.dif);
        deaValues.push(d.dea);
    }
    
    var allValues = macdValues.concat(difValues).concat(deaValues);
    var minValue = Math.min.apply(null, allValues);
    var maxValue = Math.max.apply(null, allValues);
    
    // 确保零轴在显示范围内
    minValue = Math.min(minValue, 0);
    maxValue = Math.max(maxValue, 0);
    
    // 优化：让正负值区域对称分布，避免负值区域被压缩
    var maxAbsValue = Math.max(Math.abs(maxValue), Math.abs(minValue));
    minValue = -maxAbsValue;
    maxValue = maxAbsValue;
    
    var valueRange = maxValue - minValue || 1;
    var padding = 10;
    var availableHeight = subChartHeight - padding * 2;

    // 绘制零轴（现在在副图正中间）
    var zeroY = subChartTop + padding + (maxValue / valueRange) * availableHeight;
    
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, zeroY);
    ctx.lineTo(width, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 找出每个连续正值区间的最高柱子和每个连续负值区间的最低柱子，并计算区间总和
    var extremeBars = {}; // 使用对象存储极值柱子索引和对应的区间总和
    
    var currentZoneStart = -1;
    var currentZoneType = null; // 'positive' 或 'negative'
    var extremeValue = null;
    var extremeIndex = -1;
    var zoneSum = 0; // 区间数值总和
    
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (i >= this.macdData.length) {
            break;
        }
        var macd = this.macdData[i].macd;
        var isPositive = macd >= 0;
        
        // 判断当前区间类型
        var currentType = isPositive ? 'positive' : 'negative';
        
        // 如果是新区间开始
        if (currentZoneType === null || currentType !== currentZoneType) {
            // 保存上一个区间的极值柱子和总和
            if (extremeIndex !== -1) {
                extremeBars[extremeIndex] = zoneSum;
            }
            
            // 开始新区间
            currentZoneType = currentType;
            currentZoneStart = i;
            extremeValue = macd;
            extremeIndex = i;
            zoneSum = macd;
        } else {
            // 同一区间内，更新极值和总和
            zoneSum += macd;
            if (currentZoneType === 'positive' && macd > extremeValue) {
                extremeValue = macd;
                extremeIndex = i;
            } else if (currentZoneType === 'negative' && macd < extremeValue) {
                extremeValue = macd;
                extremeIndex = i;
            }
        }
    }
    
    // 保存最后一个区间的极值柱子和总和
    if (extremeIndex !== -1) {
        extremeBars[extremeIndex] = zoneSum;
    }

    // 绘制DIF线（白色）- 在柱状图之前绘制，避免挡住数值
    if (this.showLines) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        var firstPoint = true;
        for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
            if (i >= this.macdData.length) {
                break;
            }

            var dif = this.macdData[i].dif;
            var x = i * candleWidth + candleWidth / 2 + offsetX;
            var y = subChartTop + padding + (maxValue - dif) / valueRange * availableHeight;
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    // 绘制DEA线（黄色）- 在柱状图之前绘制，避免挡住数值
    if (this.showLines) {
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        var firstPoint = true;
        for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
            if (i >= this.macdData.length) {
                break;
            }

            var dea = this.macdData[i].dea;
            var x = i * candleWidth + candleWidth / 2 + offsetX;
            var y = subChartTop + padding + (maxValue - dea) / valueRange * availableHeight;
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    }

    // 绘制MACD柱状图
    for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
        if (i >= this.macdData.length) {
            break;
        }

        var macd = this.macdData[i].macd;
        var x = i * candleWidth + candleWidth / 2 + offsetX;
        
        // 计算柱子高度
        var barHeight = Math.abs(macd / valueRange) * availableHeight;
        
        // 确定柱子颜色和位置
        var barY;
        var barColor;
        var actualBarHeight;
        var topBoundary = subChartTop + padding;
        var bottomBoundary = subChartTop + subChartHeight - padding;
        
        if (macd >= 0) {
            barColor = '#ef5350'; // 红色（正值）
            barY = zeroY - barHeight;
            // 确保柱子不超出顶部边界
            if (barY < topBoundary) {
                actualBarHeight = barHeight - (topBoundary - barY);
                barY = topBoundary;
            } else {
                actualBarHeight = barHeight;
            }
        } else {
            barColor = '#26a69a'; // 绿色（负值）
            barY = zeroY;
            // 确保柱子不超出底部边界
            actualBarHeight = Math.min(barHeight, bottomBoundary - barY);
        }
        
        // 判断是否是区间的极值柱子，使用特殊颜色
        var isExtremeBar = extremeBars.hasOwnProperty(i);
        if (isExtremeBar) {
            if (macd >= 0) {
                barColor = '#ffd700'; // 正值区间最高柱子：金黄色
            } else {
                barColor = '#4fc3f7'; // 负值区间最低柱子：高亮蓝色
            }
        }
        
        // 绘制柱子
        ctx.fillStyle = barColor;
        var barWidth = Math.max(1, candleWidth * 0.6);
        
        // 极值柱子加宽显示
        if (isExtremeBar) {
            barWidth = Math.max(2, candleWidth * 0.9);
        }
        
        ctx.fillRect(x - barWidth / 2, barY, barWidth, actualBarHeight);
        
        // 在极值柱子上方显示区间总和
        if (isExtremeBar) {
            var zoneSum = extremeBars[i];
            var sumText = zoneSum.toFixed(2);
            ctx.font = '12px Arial';
            var textWidth = ctx.measureText(sumText).width;
            var textHeight = 12;
            var textPadding = 2;
            
            // 计算文本位置
            var textY;
            var textBackgroundY;
            
            if (macd >= 0) {
                // 正值柱子：始终显示在柱子顶部上方
                textY = barY - textHeight / 2 - 2;
            } else {
                // 负值柱子：始终显示在柱子底部下方
                textY = barY + actualBarHeight + textHeight / 2 + 2;
                
                // 确保文本不超出副图底部边界
                if (textY > subChartTop + subChartHeight - padding - textHeight / 2) {
                    textY = subChartTop + subChartHeight - padding - textHeight / 2;
                }
            }
            
            // 确保正值柱子的文本不超出副图顶部边界
            if (macd >= 0) {
                textY = Math.max(subChartTop + padding + textHeight / 2 + 2, textY);
            }
            
            textBackgroundY = textY - textHeight / 2;
            
            // 绘制文本背景（更紧凑，避免挡住柱子）
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(x - textWidth / 2 - textPadding, textBackgroundY, textWidth + textPadding * 2, textHeight);
            
            // 绘制文本（根据柱子类型使用不同颜色）
            if (macd >= 0) {
                ctx.fillStyle = '#ffd700'; // 正值最高柱子：黄色文字
            } else {
                ctx.fillStyle = '#4fc3f7'; // 负值最低柱子：高亮蓝色文字
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(sumText, x, textY);
        }
    }
    
    ctx.restore(); // 恢复canvas状态
};

// 清除MACD数据
MACDIndicator.prototype.clear = function() {
    this.macdData = [];
};
