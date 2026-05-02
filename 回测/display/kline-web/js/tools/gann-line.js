// 江恩线工具 - 基于K线索引和价格
function GannLineDrawing(chart) {
    this.chart = chart;
    this.lines = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentLine = null;
    this.selectedLine = null;
    this.contextMenu = null;
    this.ratios = [1, 2, 3, 4, 8];
    this.init();
}

GannLineDrawing.prototype.init = function() {
    this.createContextMenu();
};

GannLineDrawing.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'gann-context-menu';
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
                var colorPicker = document.getElementById('gann-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

GannLineDrawing.prototype.showContextMenu = function(x, y, line) {
    this.selectedLine = line;
    var menuWidth = 150, menuHeight = 80, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    var menuX = x, menuY = y;
    if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
    if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

GannLineDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedLine = null;
};

GannLineDrawing.prototype.showColorPicker = function() {
    var self = this;
    var oldPicker = document.getElementById('gann-color-picker');
    if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
    var colorPicker = document.createElement('div');
    colorPicker.id = 'gann-color-picker';
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

GannLineDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('gann-color-picker');
    if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
};

GannLineDrawing.prototype.deleteSelected = function() {
    if (!this.selectedLine) return;
    var index = this.lines.indexOf(this.selectedLine);
    if (index !== -1) {
        this.lines.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

GannLineDrawing.prototype.findNearestCandleIndex = function(canvasX) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) return -1;
    var viewWidth = this.chart.canvas.width, rightPadding = 45, availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length, candleWidth = baseCandleWidth * this.chart.scale, offsetX = this.chart.offsetX;
    var minDistance = Infinity, nearestIndex = -1;
    for (var i = 0; i < candles.length; i++) {
        var candleX = i * candleWidth + offsetX + candleWidth / 2;
        var distance = Math.abs(canvasX - candleX);
        if (distance < minDistance) { minDistance = distance; nearestIndex = i; }
    }
    return nearestIndex;
};

GannLineDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    var candles = this.chart.candles, viewWidth = this.chart.canvas.width, rightPadding = 45, availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length, candleWidth = baseCandleWidth * this.chart.scale, offsetX = this.chart.offsetX;
    return candleIndex * candleWidth + offsetX + candleWidth / 2;
};

GannLineDrawing.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) return 0;
    var padding = 15, availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

GannLineDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) return -1;
    for (var i = 0; i < candles.length; i++) { if (candles[i].date === timestamp) return i; }
    return -1;
};

GannLineDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    var price = this.canvasYToPrice(canvasY);
    this.isDrawing = true;
    this.startData = { candleIndex: candleIndex, price: price, candleTimestamp: this.chart.candles[candleIndex].date };
    this.currentLine = { type: 'gann', centerCandleIndex: candleIndex, centerPrice: price, centerCandleTimestamp: this.chart.candles[candleIndex].date, refCandleIndex: candleIndex, refPrice: price, refCandleTimestamp: this.chart.candles[candleIndex].date, color: '#78909c', lineWidth: 1, opacity: 1 };
};

GannLineDrawing.prototype.updateDrawing = function(canvasX, canvasY) {
    if (!this.isDrawing || !this.currentLine) return;
    var refCandleIndex = this.findNearestCandleIndex(canvasX);
    var refPrice = this.canvasYToPrice(canvasY);
    this.currentLine.refCandleIndex = refCandleIndex;
    this.currentLine.refPrice = refPrice;
    this.currentLine.refCandleTimestamp = this.chart.candles[refCandleIndex].date;
};

GannLineDrawing.prototype.finishDrawing = function() {
    if (!this.isDrawing || !this.currentLine) return;
    if (this.currentLine.centerCandleIndex !== this.currentLine.refCandleIndex || Math.abs(this.currentLine.centerPrice - this.currentLine.refPrice) > 0.001) {
        this.lines.push(this.currentLine);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    }
    this.isDrawing = false;
    this.startData = null;
    this.currentLine = null;
};

GannLineDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 8;
    for (var i = this.lines.length - 1; i >= 0; i--) {
        var line = this.lines[i];
        var coords = this.getGannLineScreenCoords(line);
        if (!coords) continue;
        for (var j = 0; j < coords.lines.length; j++) {
            var gannLine = coords.lines[j];
            var dx = gannLine.endX - gannLine.startX;
            var dy = gannLine.endY - gannLine.startY;
            var lengthSq = dx * dx + dy * dy;
            if (lengthSq === 0) continue;
            var t = ((canvasX - gannLine.startX) * dx + (canvasY - gannLine.startY) * dy) / lengthSq;
            t = Math.max(0, Math.min(1, t));
            var nearestX = gannLine.startX + t * dx;
            var nearestY = gannLine.startY + t * dy;
            var dist = Math.sqrt(Math.pow(canvasX - nearestX, 2) + Math.pow(canvasY - nearestY, 2));
            if (dist <= tolerance) {
                return line;
            }
        }
    }
    return null;
};

GannLineDrawing.prototype.getGannLineScreenCoords = function(line) {
    var centerCandleIndex, refCandleIndex;
    if (line.centerCandleTimestamp) centerCandleIndex = this.findCandleIndexByTimestamp(line.centerCandleTimestamp);
    else centerCandleIndex = line.centerCandleIndex;
    if (line.refCandleTimestamp) refCandleIndex = this.findCandleIndexByTimestamp(line.refCandleTimestamp);
    else refCandleIndex = line.refCandleIndex;
    if (centerCandleIndex === -1 || refCandleIndex === -1) return null;
    var centerX = this.getCandleCanvasX(centerCandleIndex);
    var centerY = this.chart.priceToCanvasY(line.centerPrice);
    var refX = this.getCandleCanvasX(refCandleIndex);
    var refY = this.chart.priceToCanvasY(line.refPrice);
    var dx = refX - centerX;
    var dy = refY - centerY;
    var canvasWidth = this.chart.canvas.width;
    var canvasHeight = this.chart.currentMainChartHeight;
    var lines = [];
    for (var i = 0; i < this.ratios.length; i++) {
        var ratio = this.ratios[i];
        var slope = (dy / dx) / ratio;
        var startX1 = 0;
        var startY1 = centerY + slope * (startX1 - centerX);
        var endX1 = canvasWidth;
        var endY1 = centerY + slope * (endX1 - centerX);
        lines.push({ startX: startX1, startY: startY1, endX: endX1, endY: endY1, label: '1x' + ratio });
        var slope2 = (-dy / dx) / ratio;
        var startX2 = 0;
        var startY2 = centerY + slope2 * (startX2 - centerX);
        var endX2 = canvasWidth;
        var endY2 = centerY + slope2 * (endX2 - centerX);
        lines.push({ startX: startX2, startY: startY2, endX: endX2, endY: endY2, label: '1x-' + ratio });
    }
    return { centerX: centerX, centerY: centerY, lines: lines };
};

GannLineDrawing.prototype.render = function(ctx) {
    for (var i = 0; i < this.lines.length; i++) { this.drawGannLines(ctx, this.lines[i]); }
    if (this.currentLine) { this.drawGannLines(ctx, this.currentLine); }
};

GannLineDrawing.prototype.drawGannLines = function(ctx, line) {
    var coords = this.getGannLineScreenCoords(line);
    if (!coords) return;
    ctx.strokeStyle = this.hexToRgba(line.color, line.opacity);
    ctx.lineWidth = line.lineWidth;
    for (var i = 0; i < coords.lines.length; i++) {
        var gannLine = coords.lines[i];
        ctx.beginPath();
        ctx.moveTo(gannLine.startX, gannLine.startY);
        ctx.lineTo(gannLine.endX, gannLine.endY);
        ctx.stroke();
    }
};

GannLineDrawing.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

GannLineDrawing.prototype.save = function(stockCode, period) {
    var key = 'gannlines_' + stockCode + '_' + period;
    try { localStorage.setItem(key, JSON.stringify(this.lines)); } catch (e) { console.error('保存江恩线数据失败:', e); }
};

GannLineDrawing.prototype.load = function(stockCode, period) {
    var key = 'gannlines_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) { this.lines = JSON.parse(data); } else { this.lines = []; }
    } catch (e) { console.error('加载江恩线数据失败:', e); this.lines = []; }
};

GannLineDrawing.prototype.reset = function() {
    this.lines = []; this.isDrawing = false; this.startData = null; this.currentLine = null; this.selectedLine = null;
};

GannLineDrawing.prototype.clear = function(stockCode, period) {
    this.lines = []; this.save(stockCode, period);
};

GannLineDrawing.prototype.clearAll = function() {
    this.lines = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
