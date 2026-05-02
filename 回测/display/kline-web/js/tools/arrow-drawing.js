// 箭头绘制模块 - 基于K线索引和价格
function ArrowDrawing(chart) {
    this.chart = chart;
    this.arrows = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentArrow = null;
    this.selectedArrow = null;
    this.contextMenu = null;
    this.init();
}

ArrowDrawing.prototype.init = function() {
    this.createContextMenu();
};

ArrowDrawing.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'arrow-context-menu';
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
                var colorPicker = document.getElementById('arrow-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

ArrowDrawing.prototype.showContextMenu = function(x, y, arrow) {
    this.selectedArrow = arrow;
    var menuWidth = 150, menuHeight = 80, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    var menuX = x, menuY = y;
    if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
    if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

ArrowDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedArrow = null;
};

ArrowDrawing.prototype.showColorPicker = function() {
    var self = this;
    var oldPicker = document.getElementById('arrow-color-picker');
    if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
    var colorPicker = document.createElement('div');
    colorPicker.id = 'arrow-color-picker';
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
        if (colors[i] === this.selectedArrow.color) colorBtn.style.borderColor = '#ffffff';
        colorBtn.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
        colorBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };
        (function(color) {
            colorBtn.onclick = function() {
                self.selectedArrow.color = color;
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

ArrowDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('arrow-color-picker');
    if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
};

ArrowDrawing.prototype.deleteSelected = function() {
    if (!this.selectedArrow) return;
    var index = this.arrows.indexOf(this.selectedArrow);
    if (index !== -1) {
        this.arrows.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

ArrowDrawing.prototype.findNearestCandleIndex = function(canvasX) {
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

ArrowDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    var candles = this.chart.candles, viewWidth = this.chart.canvas.width, rightPadding = 45, availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length, candleWidth = baseCandleWidth * this.chart.scale, offsetX = this.chart.offsetX;
    return candleIndex * candleWidth + offsetX + candleWidth / 2;
};

ArrowDrawing.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) return 0;
    var padding = 15, availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

ArrowDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) return -1;
    for (var i = 0; i < candles.length; i++) { if (candles[i].date === timestamp) return i; }
    return -1;
};

ArrowDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    var price = this.canvasYToPrice(canvasY);
    this.isDrawing = true;
    this.startData = { candleIndex: candleIndex, price: price, candleTimestamp: this.chart.candles[candleIndex].date };
    this.currentArrow = { type: 'arrow', startCandleIndex: candleIndex, startPrice: price, startCandleTimestamp: this.chart.candles[candleIndex].date, endCandleIndex: candleIndex, endPrice: price, endCandleTimestamp: this.chart.candles[candleIndex].date, color: '#ec407a', lineWidth: 2, opacity: 1 };
};

ArrowDrawing.prototype.updateDrawing = function(canvasX, canvasY) {
    if (!this.isDrawing || !this.currentArrow) return;
    var endCandleIndex = this.findNearestCandleIndex(canvasX);
    var endPrice = this.canvasYToPrice(canvasY);
    this.currentArrow.endCandleIndex = endCandleIndex;
    this.currentArrow.endPrice = endPrice;
    this.currentArrow.endCandleTimestamp = this.chart.candles[endCandleIndex].date;
};

ArrowDrawing.prototype.finishDrawing = function() {
    if (!this.isDrawing || !this.currentArrow) return;
    if (this.currentArrow.startCandleIndex !== this.currentArrow.endCandleIndex || Math.abs(this.currentArrow.startPrice - this.currentArrow.endPrice) > 0.001) {
        this.arrows.push(this.currentArrow);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    }
    this.isDrawing = false;
    this.startData = null;
    this.currentArrow = null;
};

ArrowDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 8;
    for (var i = this.arrows.length - 1; i >= 0; i--) {
        var arrow = this.arrows[i];
        var coords = this.getArrowScreenCoords(arrow);
        if (!coords) continue;
        var dx = coords.endX - coords.startX;
        var dy = coords.endY - coords.startY;
        var lengthSq = dx * dx + dy * dy;
        if (lengthSq === 0) {
            var dist = Math.sqrt(Math.pow(canvasX - coords.startX, 2) + Math.pow(canvasY - coords.startY, 2));
            if (dist <= tolerance) return arrow;
            continue;
        }
        var t = ((canvasX - coords.startX) * dx + (canvasY - coords.startY) * dy) / lengthSq;
        t = Math.max(0, Math.min(1, t));
        var nearestX = coords.startX + t * dx;
        var nearestY = coords.startY + t * dy;
        var dist = Math.sqrt(Math.pow(canvasX - nearestX, 2) + Math.pow(canvasY - nearestY, 2));
        if (dist <= tolerance) {
            return arrow;
        }
    }
    return null;
};

ArrowDrawing.prototype.getArrowScreenCoords = function(arrow) {
    var startCandleIndex, endCandleIndex;
    if (arrow.startCandleTimestamp) startCandleIndex = this.findCandleIndexByTimestamp(arrow.startCandleTimestamp);
    else startCandleIndex = arrow.startCandleIndex;
    if (arrow.endCandleTimestamp) endCandleIndex = this.findCandleIndexByTimestamp(arrow.endCandleTimestamp);
    else endCandleIndex = arrow.endCandleIndex;
    if (startCandleIndex === -1 || endCandleIndex === -1) return null;
    return {
        startX: this.getCandleCanvasX(startCandleIndex),
        startY: this.chart.priceToCanvasY(arrow.startPrice),
        endX: this.getCandleCanvasX(endCandleIndex),
        endY: this.chart.priceToCanvasY(arrow.endPrice)
    };
};

ArrowDrawing.prototype.render = function(ctx) {
    for (var i = 0; i < this.arrows.length; i++) { this.drawArrow(ctx, this.arrows[i]); }
    if (this.currentArrow) { this.drawArrow(ctx, this.currentArrow); }
};

ArrowDrawing.prototype.drawArrow = function(ctx, arrow) {
    var coords = this.getArrowScreenCoords(arrow);
    if (!coords) return;
    ctx.strokeStyle = this.hexToRgba(arrow.color, arrow.opacity);
    ctx.fillStyle = this.hexToRgba(arrow.color, arrow.opacity);
    ctx.lineWidth = arrow.lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(coords.startX, coords.startY);
    ctx.lineTo(coords.endX, coords.endY);
    ctx.stroke();
    var dx = coords.endX - coords.startX;
    var dy = coords.endY - coords.startY;
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;
    var angle = Math.atan2(dy, dx);
    var headLength = 15;
    var headAngle = Math.PI / 6;
    ctx.beginPath();
    ctx.moveTo(coords.endX, coords.endY);
    ctx.lineTo(coords.endX - headLength * Math.cos(angle - headAngle), coords.endY - headLength * Math.sin(angle - headAngle));
    ctx.moveTo(coords.endX, coords.endY);
    ctx.lineTo(coords.endX - headLength * Math.cos(angle + headAngle), coords.endY - headLength * Math.sin(angle + headAngle));
    ctx.stroke();
};

ArrowDrawing.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

ArrowDrawing.prototype.save = function(stockCode, period) {
    var key = 'arrows_' + stockCode + '_' + period;
    try { localStorage.setItem(key, JSON.stringify(this.arrows)); } catch (e) { console.error('保存箭头数据失败:', e); }
};

ArrowDrawing.prototype.load = function(stockCode, period) {
    var key = 'arrows_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) { this.arrows = JSON.parse(data); } else { this.arrows = []; }
    } catch (e) { console.error('加载箭头数据失败:', e); this.arrows = []; }
};

ArrowDrawing.prototype.reset = function() {
    this.arrows = []; this.isDrawing = false; this.startData = null; this.currentArrow = null; this.selectedArrow = null;
};

ArrowDrawing.prototype.clear = function(stockCode, period) {
    this.arrows = []; this.save(stockCode, period);
};

ArrowDrawing.prototype.clearAll = function() {
    this.arrows = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
