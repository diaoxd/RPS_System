// MA均线指标
function MAIndicator(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    
    // MA数据
    this.maData = {
        ma5: [],
        ma10: [],
        ma20: [],
        ma30: [],
        ma60: [],
        ma120: [],
        ma250: []
    };
    
    // MA颜色配置
    this.colors = {
        ma5: '#ffffff',
        ma10: '#fbbf24',
        ma20: '#a855f7',
        ma30: '#22c55e',
        ma60: '#3b82f6',
        ma120: '#f97316',
        ma250: '#ef4444'
    };
    
    // MA周期配置
    this.periods = {
        ma5: 5,
        ma10: 10,
        ma20: 20,
        ma30: 30,
        ma60: 60,
        ma120: 120,
        ma250: 250
    };
    
    // MA显示配置
    this.enabledList = {
        ma5: true,
        ma10: true,
        ma20: true,
        ma30: true,
        ma60: true,
        ma120: true,
        ma250: true
    };
    
    // 加载参数
    this.loadParams();
}

// 计算移动平均线
MAIndicator.prototype.calculateSingleMA = function(data, period) {
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

// 计算所有MA均线
MAIndicator.prototype.calculateMA = function(candles) {
    if (!candles || candles.length === 0) {
        return;
    }
    
    var self = this;
    for (var key in self.periods) {
        self.maData[key] = self.calculateSingleMA(candles, self.periods[key]);
    }
    
    console.log('MA均线计算完成');
};

// 渲染MA均线
MAIndicator.prototype.render = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight) {
    if (!this.enabled) {
        return;
    }
    
    var self = this;
    var padding = 15;
    var availableHeight = mainChartHeight - padding * 2;
    var priceRange = maxPrice - minPrice || 1;
    
    // 遍历所有MA周期
    for (var key in self.maData) {
        // 检查是否启用
        if (!self.enabledList[key]) {
            continue;
        }
        
        var maValues = self.maData[key];
        var color = self.colors[key];
        
        if (!maValues || maValues.length === 0) {
            continue;
        }
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        
        var firstPoint = true;
        for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
            if (maValues[i] === null || maValues[i] === undefined) {
                firstPoint = true;
                continue;
            }
            
            var x = i * candleWidth + candleWidth / 2 + offsetX;
            var y = padding + (maxPrice - maValues[i]) / priceRange * availableHeight;
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
    }
    
    // 在K线顶部显示MA数值标签
    self.renderLabels(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight);
};

// 渲染MA数值标签
MAIndicator.prototype.renderLabels = function(ctx, visibleStartIndex, visibleEndIndex, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight) {
    var self = this;
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
    
    // 绘制MA数值标签
    for (var key in self.maData) {
        // 检查是否启用
        if (!self.enabledList[key]) {
            continue;
        }
        
        var maValues = self.maData[key];
        var color = self.colors[key];
        var period = self.periods[key];
        
        if (!maValues || maValues.length === 0 || lastIndex < 0) {
            continue;
        }
        
        var maValue = maValues[lastIndex];
        if (maValue === null || maValue === undefined) {
            continue;
        }
        
        // 设置文字样式
        ctx.fillStyle = color;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // 绘制文字
        var labelText = 'MA' + period + ':' + maValue.toFixed(2);
        ctx.fillText(labelText, labelX, labelY);
        
        // 计算下一个标签的位置
        var textWidth = ctx.measureText(labelText).width;
        labelX += textWidth + 15;
    }
};

// 切换显示状态
MAIndicator.prototype.toggle = function() {
    this.enabled = !this.enabled;
    return this.enabled;
};

// 清除数据
MAIndicator.prototype.clear = function() {
    this.maData = {
        ma5: [],
        ma10: [],
        ma20: [],
        ma30: [],
        ma60: [],
        ma120: [],
        ma250: []
    };
};

// 检测鼠标位置附近的MA均线
MAIndicator.prototype.getNearbyMA = function(mouseX, mouseY, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight) {
    console.log('getNearbyMA called with params:', {
        mouseX: mouseX,
        mouseY: mouseY,
        candleWidth: candleWidth,
        offsetX: offsetX,
        minPrice: minPrice,
        maxPrice: maxPrice,
        mainChartHeight: mainChartHeight,
        enabled: this.enabled
    });
    
    if (!this.enabled) {
        console.log('MA not enabled');
        return null;
    }
    
    var self = this;
    var padding = 15;
    var availableHeight = mainChartHeight - padding * 2;
    var priceRange = maxPrice - minPrice || 1;
    
    console.log('priceRange:', priceRange, 'availableHeight:', availableHeight);
    
    // 计算鼠标对应的K线索引
    var candleIndex = Math.floor((mouseX - offsetX) / candleWidth);
    console.log('candleIndex:', candleIndex);
    if (candleIndex < 0 || candleIndex >= self.klineChart.candles.length) {
        console.log('candleIndex out of range');
        return null;
    }
    
    var nearbyMAs = [];
    var threshold = 15; // 检测阈值，像素
    
    // 检查当前K线及附近的K线
    var startIdx = Math.max(0, candleIndex - 3);
    var endIdx = Math.min(self.klineChart.candles.length - 1, candleIndex + 3);
    
    for (var key in self.maData) {
        // 检查是否启用
        if (!self.enabledList[key]) {
            continue;
        }
        
        var maValues = self.maData[key];
        var color = self.colors[key];
        var period = self.periods[key];
        
        if (!maValues || maValues.length === 0) {
            continue;
        }
        
        // 检查附近的K线
        for (var idx = startIdx; idx <= endIdx; idx++) {
            var maValue = maValues[idx];
            if (maValue === null || maValue === undefined) {
                continue;
            }
            
            // 计算MA在canvas上的Y坐标
            var maY = padding + (maxPrice - maValue) / priceRange * availableHeight;
            
            // 计算MA在canvas上的X坐标
            var maX = idx * candleWidth + candleWidth / 2 + offsetX;
            
            // 计算鼠标到MA点的距离
            var distance = Math.sqrt(Math.pow(mouseX - maX, 2) + Math.pow(mouseY - maY, 2));
            
            console.log('Checking MA', period, 'at', maX, maY, 'distance:', distance);
            
            if (distance <= threshold) {
                console.log('MA', period, 'hit! distance:', distance);
                nearbyMAs.push({
                    key: key,
                    period: period,
                    color: color,
                    value: maValue,
                    distance: distance
                });
                break;
            }
        }
    }
    
    if (nearbyMAs.length > 0) {
        // 按距离排序，返回最近的
        nearbyMAs.sort(function(a, b) {
            return a.distance - b.distance;
        });
        return nearbyMAs[0];
    }
    
    return null;
};

// 渲染MA均线提示
MAIndicator.prototype.renderTooltip = function(ctx, mouseX, mouseY, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight) {
    if (!this.enabled) {
        return null;
    }
    
    var nearbyMA = this.getNearbyMA(mouseX, mouseY, candleWidth, offsetX, minPrice, maxPrice, mainChartHeight);
    
    if (nearbyMA) {
        // 保存canvas状态
        ctx.save();
        
        // 绘制提示框
        var padding = 6;
        var labelText = 'MA' + nearbyMA.period + ': ' + nearbyMA.value.toFixed(2);
        
        ctx.font = '12px Arial';
        var textWidth = ctx.measureText(labelText).width;
        var boxWidth = textWidth + padding * 2;
        var boxHeight = 24;
        
        // 计算提示框位置（避免超出画布）
        var boxX = mouseX + 15;
        var boxY = mouseY - boxHeight / 2;
        
        if (boxX + boxWidth > ctx.canvas.width) {
            boxX = mouseX - boxWidth - 15;
        }
        if (boxY < 0) {
            boxY = 5;
        }
        if (boxY + boxHeight > ctx.canvas.height) {
            boxY = ctx.canvas.height - boxHeight - 5;
        }
        
        // 绘制背景
        ctx.fillStyle = 'rgba(30, 30, 30, 0.95)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        
        // 绘制边框
        ctx.strokeStyle = nearbyMA.color;
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        // 绘制文字
        ctx.fillStyle = nearbyMA.color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(labelText, boxX + padding, boxY + boxHeight / 2);
        
        // 恢复canvas状态
        ctx.restore();
        
        return nearbyMA;
    }
    
    return null;
};

// 加载参数
MAIndicator.prototype.loadParams = function() {
    try {
        var params = localStorage.getItem('maParams');
        if (params) {
            var parsedParams = JSON.parse(params);
            if (parsedParams.ma5 !== undefined) this.periods.ma5 = parsedParams.ma5;
            if (parsedParams.ma10 !== undefined) this.periods.ma10 = parsedParams.ma10;
            if (parsedParams.ma20 !== undefined) this.periods.ma20 = parsedParams.ma20;
            if (parsedParams.ma30 !== undefined) this.periods.ma30 = parsedParams.ma30;
            if (parsedParams.ma60 !== undefined) this.periods.ma60 = parsedParams.ma60;
            if (parsedParams.ma120 !== undefined) this.periods.ma120 = parsedParams.ma120;
            if (parsedParams.ma250 !== undefined) this.periods.ma250 = parsedParams.ma250;
            // 加载启用状态
            if (parsedParams.enabledList !== undefined) {
                for (var key in parsedParams.enabledList) {
                    if (this.enabledList[key] !== undefined) {
                        this.enabledList[key] = parsedParams.enabledList[key];
                    }
                }
            }
            // 加载颜色
            if (parsedParams.colors !== undefined) {
                for (var key in parsedParams.colors) {
                    if (this.colors[key] !== undefined) {
                        this.colors[key] = parsedParams.colors[key];
                    }
                }
            }
        }
    } catch (e) {
        console.error('加载MA参数失败:', e);
    }
};

// 保存参数
MAIndicator.prototype.saveParams = function() {
    try {
        var params = {
            ma5: this.periods.ma5,
            ma10: this.periods.ma10,
            ma20: this.periods.ma20,
            ma30: this.periods.ma30,
            ma60: this.periods.ma60,
            ma120: this.periods.ma120,
            ma250: this.periods.ma250,
            enabledList: this.enabledList,
            colors: this.colors
        };
        localStorage.setItem('maParams', JSON.stringify(params));
    } catch (e) {
        console.error('保存MA参数失败:', e);
    }
};

// 设置参数
MAIndicator.prototype.setParams = function(ma5, ma10, ma20, ma30, ma60, ma120, ma250, enabledList, colors) {
    if (ma5 !== undefined) this.periods.ma5 = ma5;
    if (ma10 !== undefined) this.periods.ma10 = ma10;
    if (ma20 !== undefined) this.periods.ma20 = ma20;
    if (ma30 !== undefined) this.periods.ma30 = ma30;
    if (ma60 !== undefined) this.periods.ma60 = ma60;
    if (ma120 !== undefined) this.periods.ma120 = ma120;
    if (ma250 !== undefined) this.periods.ma250 = ma250;
    if (enabledList !== undefined) {
        for (var key in enabledList) {
            if (this.enabledList[key] !== undefined) {
                this.enabledList[key] = enabledList[key];
            }
        }
    }
    if (colors !== undefined) {
        for (var key in colors) {
            if (this.colors[key] !== undefined) {
                this.colors[key] = colors[key];
            }
        }
    }
    this.saveParams();
};

