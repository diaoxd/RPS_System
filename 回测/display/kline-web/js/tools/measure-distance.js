// 测量距离工具
function MeasureDistance(chart) {
    this.chart = chart;
    this.lines = [];
    this.isMeasuring = false;
    this.currentMeasure = null;
    this.selectedLine = null;
    this.contextMenu = null;
    this.init();
}

MeasureDistance.prototype.init = function() {
    this.createContextMenu();
};

MeasureDistance.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'measure-context-menu';
    this.contextMenu.style.position = 'fixed';
    this.contextMenu.style.backgroundColor = '#1f2937';
    this.contextMenu.style.border = '1px solid #4B5563';
    this.contextMenu.style.borderRadius = '4px';
    this.contextMenu.style.padding = '4px 0';
    this.contextMenu.style.zIndex = '1000';
    this.contextMenu.style.display = 'none';
    this.contextMenu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    this.contextMenu.style.minWidth = '100px';
    
    var colorOption = document.createElement('div');
    colorOption.style.padding = '8px 16px';
    colorOption.style.cursor = 'pointer';
    colorOption.style.color = '#ffffff';
    colorOption.style.fontSize = '14px';
    colorOption.style.userSelect = 'none';
    colorOption.textContent = '修改颜色';
    colorOption.onmouseover = function() {
        this.style.backgroundColor = '#374151';
        self.showColorPicker();
    };
    colorOption.onmouseout = function() {
        this.style.backgroundColor = 'transparent';
    };
    
    var deleteOption = document.createElement('div');
    deleteOption.style.padding = '8px 16px';
    deleteOption.style.cursor = 'pointer';
    deleteOption.style.color = '#ef5350';
    deleteOption.style.fontSize = '14px';
    deleteOption.style.userSelect = 'none';
    deleteOption.textContent = '删除';
    deleteOption.onmouseover = function() {
        this.style.backgroundColor = '#374151';
    };
    deleteOption.onmouseout = function() {
        this.style.backgroundColor = 'transparent';
    };
    deleteOption.onclick = function(e) {
        e.stopPropagation();
        self.deleteSelected();
        self.hideContextMenu();
    };
    
    this.contextMenu.appendChild(colorOption);
    this.contextMenu.appendChild(deleteOption);
    document.body.appendChild(this.contextMenu);
    
    document.addEventListener('click', function(e) {
        if (self.contextMenu.style.display === 'block') {
            if (!self.contextMenu.contains(e.target)) {
                var colorPicker = document.getElementById('measure-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

MeasureDistance.prototype.showContextMenu = function(x, y, line) {
    this.selectedLine = line;
    var menuWidth = 150, menuHeight = 80, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    var menuX = x, menuY = y;
    if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
    if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

MeasureDistance.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedLine = null;
};

MeasureDistance.prototype.showColorPicker = function() {
    var self = this;
    var oldPicker = document.getElementById('measure-color-picker');
    if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
    var colorPicker = document.createElement('div');
    colorPicker.id = 'measure-color-picker';
    colorPicker.style.position = 'fixed';
    colorPicker.style.backgroundColor = '#1f2937';
    colorPicker.style.border = '1px solid #4B5563';
    colorPicker.style.borderRadius = '4px';
    colorPicker.style.padding = '6px';
    colorPicker.style.zIndex = '1001';
    colorPicker.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    var menuRect = this.contextMenu.getBoundingClientRect();
    colorPicker.style.left = (menuRect.right + 10) + 'px';
    colorPicker.style.top = menuRect.top + 'px';
    var colors = ['#4a90e2','#ef5350','#66bb6a','#ffa726','#ab47bc','#26c6da','#ffca28','#ec407a','#78909c','#ffffff'];
    var colorGrid = document.createElement('div');
    colorGrid.style.display = 'grid';
    colorGrid.style.gridTemplateColumns = 'repeat(5, 1fr)';
    colorGrid.style.gap = '5px';
    for (var i = 0; i < colors.length; i++) {
        var colorBtn = document.createElement('div');
        colorBtn.style.width = '20px';
        colorBtn.style.height = '20px';
        colorBtn.style.backgroundColor = colors[i];
        colorBtn.style.borderRadius = '3px';
        colorBtn.style.cursor = 'pointer';
        colorBtn.style.border = '2px solid transparent';
        if (colors[i] === this.selectedLine.color) colorBtn.style.borderColor = '#ffffff';
        colorBtn.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
        colorBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };
        (function(color) {
            colorBtn.onclick = function() {
                self.selectedLine.color = color;
                self.save(self.chart.currentStockCode, self.chart.currentPeriod);
                self.chart.requestRender();
                self.hideColorPicker();
            };
        })(colors[i]);
        colorGrid.appendChild(colorBtn);
    }
    colorPicker.appendChild(colorGrid);
    document.body.appendChild(colorPicker);
    var closePicker = function(e) {
        if (!colorPicker.contains(e.target)) {
            self.hideColorPicker();
            document.removeEventListener('click', closePicker);
        }
    };
    setTimeout(function() { document.addEventListener('click', closePicker); }, 10);
};

MeasureDistance.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('measure-color-picker');
    if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
};

MeasureDistance.prototype.deleteSelected = function() {
    if (!this.selectedLine) return;
    var index = this.lines.indexOf(this.selectedLine);
    if (index !== -1) {
        this.lines.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

MeasureDistance.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) return 0;
    var padding = 15, availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

MeasureDistance.prototype.canvasXToCandleIndex = function(canvasX) {
    var width = this.chart.canvas.width, rightPadding = 45;
    var availableWidth = width - rightPadding;
    if (!this.chart.candles || this.chart.candles.length === 0) return -1;
    var candleWidth = availableWidth / this.chart.candles.length * this.chart.scale;
    var index = Math.floor((canvasX - this.chart.offsetX) / candleWidth);
    index = Math.max(0, Math.min(this.chart.candles.length - 1, index));
    return index;
};

MeasureDistance.prototype.getCandleCanvasX = function(candleIndex) {
    var width = this.chart.canvas.width, rightPadding = 45;
    var availableWidth = width - rightPadding;
    if (!this.chart.candles || this.chart.candles.length === 0) return 0;
    var candleWidth = availableWidth / this.chart.candles.length * this.chart.scale;
    var candleX = candleIndex * candleWidth + candleWidth / 2 + this.chart.offsetX;
    return candleX;
};

MeasureDistance.prototype.findCandleIndexByTimestamp = function(timestamp) {
    if (!this.chart.candles || this.chart.candles.length === 0) return -1;
    for (var i = 0; i < this.chart.candles.length; i++) {
        if (this.chart.candles[i].time === timestamp) return i;
    }
    return -1;
};

MeasureDistance.prototype.startDrawing = function(canvasX, canvasY) {
    this.isMeasuring = true;
    var candleIndex = this.canvasXToCandleIndex(canvasX);
    var price = this.canvasYToPrice(canvasY);
    var candleTimestamp = null;
    if (candleIndex !== -1 && this.chart.candles && this.chart.candles[candleIndex]) {
        candleTimestamp = this.chart.candles[candleIndex].time;
    }
    this.currentMeasure = {
        type: 'measure',
        startCandleIndex: candleIndex,
        startCandleTimestamp: candleTimestamp,
        startPrice: price,
        endCandleIndex: candleIndex,
        endCandleTimestamp: candleTimestamp,
        endPrice: price,
        color: '#4a90e2',
        lineWidth: 2,
        opacity: 1
    };
};

MeasureDistance.prototype.updateDrawing = function(canvasX, canvasY) {
    if (!this.isMeasuring || !this.currentMeasure) return;
    var candleIndex = this.canvasXToCandleIndex(canvasX);
    var price = this.canvasYToPrice(canvasY);
    var candleTimestamp = null;
    if (candleIndex !== -1 && this.chart.candles && this.chart.candles[candleIndex]) {
        candleTimestamp = this.chart.candles[candleIndex].time;
    }
    this.currentMeasure.endCandleIndex = candleIndex;
    this.currentMeasure.endCandleTimestamp = candleTimestamp;
    this.currentMeasure.endPrice = price;
};

MeasureDistance.prototype.finishDrawing = function() {
    if (this.isMeasuring && this.currentMeasure) {
        var candleDistance = Math.abs(this.currentMeasure.endCandleIndex - this.currentMeasure.startCandleIndex);
        var priceRange = Math.abs(this.currentMeasure.endPrice - this.currentMeasure.startPrice);
        if (candleDistance >= 1 || priceRange > 0) {
            this.lines.push(this.currentMeasure);
            this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        }
    }
    this.isMeasuring = false;
    this.currentMeasure = null;
};

MeasureDistance.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 8;
    for (var i = this.lines.length - 1; i >= 0; i--) {
        var line = this.lines[i];
        
        // 获取当前K线索引
        var startCandleIndex, endCandleIndex;
        if (line.startCandleTimestamp) startCandleIndex = this.findCandleIndexByTimestamp(line.startCandleTimestamp);
        else startCandleIndex = line.startCandleIndex;
        if (startCandleIndex === -1) continue;
        
        if (line.endCandleTimestamp) endCandleIndex = this.findCandleIndexByTimestamp(line.endCandleTimestamp);
        else endCandleIndex = line.endCandleIndex;
        if (endCandleIndex === -1) continue;
        
        var startX = this.getCandleCanvasX(startCandleIndex);
        var startY = this.chart.priceToCanvasY(line.startPrice);
        var endX = this.getCandleCanvasX(endCandleIndex);
        var endY = this.chart.priceToCanvasY(line.endPrice);
        
        // 计算到线段的距离
        var dx = endX - startX;
        var dy = endY - startY;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len === 0) {
            var dist = Math.sqrt((canvasX - startX) * (canvasX - startX) + (canvasY - startY) * (canvasY - startY));
            if (dist <= tolerance) {
                return line;
            }
        } else {
            var t = ((canvasX - startX) * dx + (canvasY - startY) * dy) / (len * len);
            t = Math.max(0, Math.min(1, t));
            var closestX = startX + t * dx;
            var closestY = startY + t * dy;
            var dist = Math.sqrt((canvasX - closestX) * (canvasX - closestX) + (canvasY - closestY) * (canvasY - closestY));
            if (dist <= tolerance) {
                return line;
            }
        }
    }
    return null;
};

MeasureDistance.prototype.render = function(ctx) {
    // 绘制已保存的测量距离
    for (var i = 0; i < this.lines.length; i++) {
        this.drawMeasureLine(ctx, this.lines[i]);
    }
    
    // 绘制当前正在测量的
    if (this.isMeasuring && this.currentMeasure) {
        this.drawMeasureLine(ctx, this.currentMeasure);
    }
};

MeasureDistance.prototype.drawMeasureLine = function(ctx, line) {
    // 获取当前K线索引
    var startCandleIndex, endCandleIndex;
    if (line.startCandleTimestamp) startCandleIndex = this.findCandleIndexByTimestamp(line.startCandleTimestamp);
    else startCandleIndex = line.startCandleIndex;
    if (startCandleIndex === -1) return;
    
    if (line.endCandleTimestamp) endCandleIndex = this.findCandleIndexByTimestamp(line.endCandleTimestamp);
    else endCandleIndex = line.endCandleIndex;
    if (endCandleIndex === -1) return;
    
    var startX = this.getCandleCanvasX(startCandleIndex);
    var startY = this.chart.priceToCanvasY(line.startPrice);
    var endX = this.getCandleCanvasX(endCandleIndex);
    var endY = this.chart.priceToCanvasY(line.endPrice);
    
    // 绘制连接线
    ctx.strokeStyle = this.hexToRgba(line.color, line.opacity);
    ctx.lineWidth = line.lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // 计算测量信息
    var candleDistance = Math.abs(endCandleIndex - startCandleIndex);
    var priceChange = line.endPrice - line.startPrice;
    var priceChangePercent = (priceChange / line.startPrice) * 100;
    
    // 准备信息文本
    var infoLines = [];
    infoLines.push('K线距离: ' + candleDistance + ' 根');
    infoLines.push('涨跌: ' + (priceChange >= 0 ? '+' : '') + priceChange.toFixed(2));
    infoLines.push('幅度: ' + (priceChangePercent >= 0 ? '+' : '') + priceChangePercent.toFixed(2) + '%');
    
    // 绘制信息背景
    var textHeight = 18;
    var padding = 8;
    var lineSpacing = 4;
    
    // 计算文本宽度，找到最宽的一行
    ctx.font = '14px Arial, sans-serif';
    var maxTextWidth = 0;
    for (var i = 0; i < infoLines.length; i++) {
        var textWidth = ctx.measureText(infoLines[i]).width;
        if (textWidth > maxTextWidth) {
            maxTextWidth = textWidth;
        }
    }
    var bgWidth = maxTextWidth + padding * 2;
    var bgHeight = infoLines.length * (textHeight + lineSpacing) - lineSpacing + padding * 2;
    
    var bgX = startX + 10;
    var bgY;
    // 判断起点是否在顶部，如果是则显示在起点下方
    if (startY - bgHeight - 10 < 10) {
        bgY = startY + 10;
    } else {
        bgY = startY - bgHeight - 10;
    }
    // 判断是否在右侧边缘，如果是则显示在起点左边
    if (bgX + bgWidth > this.chart.canvas.width - 10) {
        bgX = startX - bgWidth - 10;
    }
    
    ctx.fillStyle = 'rgba(31, 41, 55, 0.7)';
    ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
    
    // 绘制边框
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 1;
    ctx.strokeRect(bgX, bgY, bgWidth, bgHeight);
    
    // 绘制文本
    ctx.font = '14px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    var textX = bgX + padding;
    var textY = bgY + padding;
    
    for (var i = 0; i < infoLines.length; i++) {
        if (i === 1 || i === 2) {
            ctx.fillStyle = priceChange >= 0 ? '#ef5350' : '#66bb6a';
        } else {
            ctx.fillStyle = '#ffffff';
        }
        ctx.fillText(infoLines[i], textX, textY);
        textY += textHeight + lineSpacing;
    }
};

MeasureDistance.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

MeasureDistance.prototype.save = function(stockCode, period) {
    var key = 'measures_' + stockCode + '_' + period;
    try { localStorage.setItem(key, JSON.stringify(this.lines)); } catch (e) { console.error('保存测量距离数据失败:', e); }
};

MeasureDistance.prototype.load = function(stockCode, period) {
    var key = 'measures_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) { this.lines = JSON.parse(data); } else { this.lines = []; }
    } catch (e) { console.error('加载测量距离数据失败:', e); this.lines = []; }
};

MeasureDistance.prototype.reset = function() {
    this.lines = []; this.isMeasuring = false; this.currentMeasure = null; this.selectedLine = null;
};

MeasureDistance.prototype.clear = function(stockCode, period) {
    this.lines = []; this.save(stockCode, period);
};

MeasureDistance.prototype.clearAll = function() {
    this.lines = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
