// 垂直线绘制模块 - 基于K线索引和价格
function VerticalLineDrawing(chart) {
    this.chart = chart;
    this.lines = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentLine = null;
    this.selectedLine = null;
    this.contextMenu = null;
    this.init();
}

VerticalLineDrawing.prototype.init = function() {
    this.createContextMenu();
};

VerticalLineDrawing.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'vline-context-menu';
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
                var colorPicker = document.getElementById('vline-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

VerticalLineDrawing.prototype.showContextMenu = function(x, y, line) {
    this.selectedLine = line;
    var menuWidth = 150, menuHeight = 80, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    var menuX = x, menuY = y;
    if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
    if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

VerticalLineDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedLine = null;
};

VerticalLineDrawing.prototype.showColorPicker = function() {
    var self = this;
    var oldPicker = document.getElementById('vline-color-picker');
    if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
    var colorPicker = document.createElement('div');
    colorPicker.id = 'vline-color-picker';
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

VerticalLineDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('vline-color-picker');
    if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
};

VerticalLineDrawing.prototype.deleteSelected = function() {
    if (!this.selectedLine) return;
    var index = this.lines.indexOf(this.selectedLine);
    if (index !== -1) {
        this.lines.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

VerticalLineDrawing.prototype.findNearestCandleIndex = function(canvasX) {
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

VerticalLineDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    var candles = this.chart.candles, viewWidth = this.chart.canvas.width, rightPadding = 45, availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length, candleWidth = baseCandleWidth * this.chart.scale, offsetX = this.chart.offsetX;
    return candleIndex * candleWidth + offsetX + candleWidth / 2;
};

VerticalLineDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) return -1;
    for (var i = 0; i < candles.length; i++) { if (candles[i].date === timestamp) return i; }
    return -1;
};

VerticalLineDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    this.isDrawing = true;
    this.startData = { candleIndex: candleIndex, candleTimestamp: this.chart.candles[candleIndex].date };
    this.currentLine = { type: 'vertical', candleIndex: candleIndex, candleTimestamp: this.chart.candles[candleIndex].date, color: '#ab47bc', lineWidth: 2, opacity: 1 };
};

VerticalLineDrawing.prototype.updateDrawing = function(canvasX, canvasY) {
    if (!this.isDrawing || !this.currentLine) return;
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    this.currentLine.candleIndex = candleIndex;
    this.currentLine.candleTimestamp = this.chart.candles[candleIndex].date;
};

VerticalLineDrawing.prototype.finishDrawing = function() {
    if (!this.isDrawing || !this.currentLine) return;
    this.lines.push(this.currentLine);
    this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    this.isDrawing = false;
    this.startData = null;
    this.currentLine = null;
};

VerticalLineDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 8;
    for (var i = this.lines.length - 1; i >= 0; i--) {
        var line = this.lines[i];
        var candleIndex;
        if (line.candleTimestamp) candleIndex = this.findCandleIndexByTimestamp(line.candleTimestamp);
        else candleIndex = line.candleIndex;
        if (candleIndex === -1) continue;
        var x = this.getCandleCanvasX(candleIndex);
        if (Math.abs(canvasX - x) <= tolerance) {
            return line;
        }
    }
    return null;
};

VerticalLineDrawing.prototype.render = function(ctx) {
    for (var i = 0; i < this.lines.length; i++) { this.drawLine(ctx, this.lines[i]); }
    if (this.currentLine) { this.drawLine(ctx, this.currentLine); }
};

VerticalLineDrawing.prototype.drawLine = function(ctx, line) {
    var candleIndex;
    if (line.candleTimestamp) candleIndex = this.findCandleIndexByTimestamp(line.candleTimestamp);
    else candleIndex = line.candleIndex;
    if (candleIndex === -1) return;
    var x = this.getCandleCanvasX(candleIndex);
    var canvasHeight = this.chart.currentMainChartHeight;
    ctx.strokeStyle = this.hexToRgba(line.color, line.opacity);
    ctx.lineWidth = line.lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
};

VerticalLineDrawing.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

VerticalLineDrawing.prototype.save = function(stockCode, period) {
    var key = 'vlines_' + stockCode + '_' + period;
    try { localStorage.setItem(key, JSON.stringify(this.lines)); } catch (e) { console.error('保存垂直线数据失败:', e); }
};

VerticalLineDrawing.prototype.load = function(stockCode, period) {
    var key = 'vlines_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) { this.lines = JSON.parse(data); } else { this.lines = []; }
    } catch (e) { console.error('加载垂直线数据失败:', e); this.lines = []; }
};

VerticalLineDrawing.prototype.reset = function() {
    this.lines = []; this.isDrawing = false; this.startData = null; this.currentLine = null; this.selectedLine = null;
};

VerticalLineDrawing.prototype.clear = function(stockCode, period) {
    this.lines = []; this.save(stockCode, period);
};

VerticalLineDrawing.prototype.clearAll = function() {
    this.lines = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
