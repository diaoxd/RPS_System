// 圆形绘制模块 - 基于K线索引和价格
function CircleDrawing(chart) {
    this.chart = chart;
    this.circles = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentCircle = null;
    this.selectedCircle = null;
    this.contextMenu = null;
    this.init();
}

CircleDrawing.prototype.init = function() {
    this.createContextMenu();
};

CircleDrawing.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'circle-context-menu';
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
                var colorPicker = document.getElementById('circle-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

CircleDrawing.prototype.showContextMenu = function(x, y, circle) {
    this.selectedCircle = circle;
    var menuWidth = 150, menuHeight = 80, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    var menuX = x, menuY = y;
    if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
    if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

CircleDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedCircle = null;
};

CircleDrawing.prototype.showColorPicker = function() {
    var self = this;
    var oldPicker = document.getElementById('circle-color-picker');
    if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
    var colorPicker = document.createElement('div');
    colorPicker.id = 'circle-color-picker';
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
        if (colors[i] === this.selectedCircle.color) colorBtn.style.borderColor = '#ffffff';
        colorBtn.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
        colorBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };
        (function(color) {
            colorBtn.onclick = function() {
                self.selectedCircle.color = color;
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

CircleDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('circle-color-picker');
    if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
};

CircleDrawing.prototype.deleteSelected = function() {
    if (!this.selectedCircle) return;
    var index = this.circles.indexOf(this.selectedCircle);
    if (index !== -1) {
        this.circles.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

CircleDrawing.prototype.findNearestCandleIndex = function(canvasX) {
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

CircleDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    var candles = this.chart.candles, viewWidth = this.chart.canvas.width, rightPadding = 45, availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length, candleWidth = baseCandleWidth * this.chart.scale, offsetX = this.chart.offsetX;
    return candleIndex * candleWidth + offsetX + candleWidth / 2;
};

CircleDrawing.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) return 0;
    var padding = 15, availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

CircleDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) return -1;
    for (var i = 0; i < candles.length; i++) { if (candles[i].date === timestamp) return i; }
    return -1;
};

CircleDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    var price = this.canvasYToPrice(canvasY);
    this.isDrawing = true;
    this.startData = { candleIndex: candleIndex, price: price, candleTimestamp: this.chart.candles[candleIndex].date };
    this.currentCircle = { type: 'circle', centerCandleIndex: candleIndex, centerPrice: price, centerCandleTimestamp: this.chart.candles[candleIndex].date, radius: 0, color: '#ffca28', lineWidth: 2, opacity: 1 };
};

CircleDrawing.prototype.updateDrawing = function(canvasX, canvasY) {
    if (!this.isDrawing || !this.currentCircle) return;
    var centerX = this.getCandleCanvasX(this.currentCircle.centerCandleIndex);
    var centerY = this.chart.priceToCanvasY(this.currentCircle.centerPrice);
    var dx = canvasX - centerX;
    var dy = canvasY - centerY;
    this.currentCircle.radius = Math.sqrt(dx * dx + dy * dy);
};

CircleDrawing.prototype.finishDrawing = function() {
    if (!this.isDrawing || !this.currentCircle) return;
    if (this.currentCircle.radius > 5) {
        this.circles.push(this.currentCircle);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    }
    this.isDrawing = false;
    this.startData = null;
    this.currentCircle = null;
};

CircleDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 8;
    for (var i = this.circles.length - 1; i >= 0; i--) {
        var circle = this.circles[i];
        var coords = this.getCircleScreenCoords(circle);
        if (!coords) continue;
        var dx = canvasX - coords.centerX;
        var dy = canvasY - coords.centerY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (Math.abs(dist - coords.radius) <= tolerance) {
            return circle;
        }
    }
    return null;
};

CircleDrawing.prototype.getCircleScreenCoords = function(circle) {
    var centerCandleIndex;
    if (circle.centerCandleTimestamp) centerCandleIndex = this.findCandleIndexByTimestamp(circle.centerCandleTimestamp);
    else centerCandleIndex = circle.centerCandleIndex;
    if (centerCandleIndex === -1) return null;
    var centerX = this.getCandleCanvasX(centerCandleIndex);
    var centerY = this.chart.priceToCanvasY(circle.centerPrice);
    return { centerX: centerX, centerY: centerY, radius: circle.radius };
};

CircleDrawing.prototype.render = function(ctx) {
    for (var i = 0; i < this.circles.length; i++) { this.drawCircle(ctx, this.circles[i]); }
    if (this.currentCircle) { this.drawCircle(ctx, this.currentCircle); }
};

CircleDrawing.prototype.drawCircle = function(ctx, circle) {
    var coords = this.getCircleScreenCoords(circle);
    if (!coords) return;
    ctx.strokeStyle = this.hexToRgba(circle.color, circle.opacity);
    ctx.lineWidth = circle.lineWidth;
    ctx.beginPath();
    ctx.arc(coords.centerX, coords.centerY, coords.radius, 0, Math.PI * 2);
    ctx.stroke();
};

CircleDrawing.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

CircleDrawing.prototype.save = function(stockCode, period) {
    var key = 'circles_' + stockCode + '_' + period;
    try { localStorage.setItem(key, JSON.stringify(this.circles)); } catch (e) { console.error('保存圆形数据失败:', e); }
};

CircleDrawing.prototype.load = function(stockCode, period) {
    var key = 'circles_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) { this.circles = JSON.parse(data); } else { this.circles = []; }
    } catch (e) { console.error('加载圆形数据失败:', e); this.circles = []; }
};

CircleDrawing.prototype.reset = function() {
    this.circles = []; this.isDrawing = false; this.startData = null; this.currentCircle = null; this.selectedCircle = null;
};

CircleDrawing.prototype.clear = function(stockCode, period) {
    this.circles = []; this.save(stockCode, period);
};

CircleDrawing.prototype.clearAll = function() {
    this.circles = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
