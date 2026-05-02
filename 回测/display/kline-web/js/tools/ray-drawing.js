// 射线绘制模块 - 基于K线索引和价格
function RayDrawing(chart) {
    this.chart = chart;
    this.rays = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentRay = null;
    this.selectedRay = null;
    this.contextMenu = null;
    this.init();
}

RayDrawing.prototype.init = function() {
    this.createContextMenu();
};

RayDrawing.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'ray-context-menu';
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
                var colorPicker = document.getElementById('ray-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

RayDrawing.prototype.showContextMenu = function(x, y, ray) {
    this.selectedRay = ray;
    var menuWidth = 150, menuHeight = 80, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    var menuX = x, menuY = y;
    if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
    if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

RayDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedRay = null;
};

RayDrawing.prototype.showColorPicker = function() {
    var self = this;
    var oldPicker = document.getElementById('ray-color-picker');
    if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
    var colorPicker = document.createElement('div');
    colorPicker.id = 'ray-color-picker';
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
        if (colors[i] === this.selectedRay.color) colorBtn.style.borderColor = '#ffffff';
        colorBtn.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
        colorBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };
        (function(color) {
            colorBtn.onclick = function() {
                self.selectedRay.color = color;
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

RayDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('ray-color-picker');
    if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
};

RayDrawing.prototype.deleteSelected = function() {
    if (!this.selectedRay) return;
    var index = this.rays.indexOf(this.selectedRay);
    if (index !== -1) {
        this.rays.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

RayDrawing.prototype.findNearestCandleIndex = function(canvasX) {
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

RayDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    var candles = this.chart.candles, viewWidth = this.chart.canvas.width, rightPadding = 45, availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length, candleWidth = baseCandleWidth * this.chart.scale, offsetX = this.chart.offsetX;
    return candleIndex * candleWidth + offsetX + candleWidth / 2;
};

RayDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    var price = this.canvasYToPrice(canvasY);
    this.isDrawing = true;
    this.startData = { candleIndex: candleIndex, price: price, candleTimestamp: this.chart.candles[candleIndex].date };
    this.currentRay = { type: 'ray', startCandleIndex: candleIndex, startPrice: price, startCandleTimestamp: this.chart.candles[candleIndex].date, endCandleIndex: candleIndex, endPrice: price, endCandleTimestamp: this.chart.candles[candleIndex].date, color: '#66bb6a', lineWidth: 2, opacity: 1 };
};

RayDrawing.prototype.updateDrawing = function(canvasX, canvasY) {
    if (!this.isDrawing || !this.currentRay) return;
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    var price = this.canvasYToPrice(canvasY);
    this.currentRay.endCandleIndex = candleIndex;
    this.currentRay.endPrice = price;
    this.currentRay.endCandleTimestamp = this.chart.candles[candleIndex].date;
};

RayDrawing.prototype.finishDrawing = function() {
    if (!this.isDrawing || !this.currentRay) return;
    var candleRange = Math.abs(this.currentRay.endCandleIndex - this.currentRay.startCandleIndex);
    var priceRange = Math.abs(this.currentRay.endPrice - this.currentRay.startPrice);
    if (candleRange >= 1 || priceRange > 0) {
        this.rays.push(this.currentRay);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    }
    this.isDrawing = false;
    this.startData = null;
    this.currentRay = null;
};

RayDrawing.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) return 0;
    var padding = 15, availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

RayDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) return -1;
    for (var i = 0; i < candles.length; i++) { if (candles[i].date === timestamp) return i; }
    return -1;
};

RayDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 8;
    for (var i = this.rays.length - 1; i >= 0; i--) {
        var ray = this.rays[i];
        var screenCoords = this.getRayScreenCoords(ray);
        if (!screenCoords) continue;
        var dx = screenCoords.dirX, dy = screenCoords.dirY;
        var lengthSq = dx * dx + dy * dy;
        if (lengthSq === 0) {
            var dist = Math.sqrt(Math.pow(canvasX - screenCoords.startX, 2) + Math.pow(canvasY - screenCoords.startY, 2));
            if (dist <= tolerance) return ray;
            continue;
        }
        var t = ((canvasX - screenCoords.startX) * dx + (canvasY - screenCoords.startY) * dy) / lengthSq;
        if (t < 0) t = 0;
        var nearestX = screenCoords.startX + t * dx;
        var nearestY = screenCoords.startY + t * dy;
        var dist = Math.sqrt(Math.pow(canvasX - nearestX, 2) + Math.pow(canvasY - nearestY, 2));
        if (dist <= tolerance) return ray;
    }
    return null;
};

RayDrawing.prototype.getRayScreenCoords = function(ray) {
    var startCandleIndex, endCandleIndex;
    if (ray.startCandleTimestamp) startCandleIndex = this.findCandleIndexByTimestamp(ray.startCandleTimestamp);
    else startCandleIndex = ray.startCandleIndex;
    if (ray.endCandleTimestamp) endCandleIndex = this.findCandleIndexByTimestamp(ray.endCandleTimestamp);
    else endCandleIndex = ray.endCandleIndex;
    if (startCandleIndex === -1 || endCandleIndex === -1) return null;
    var startX = this.getCandleCanvasX(startCandleIndex);
    var endX = this.getCandleCanvasX(endCandleIndex);
    var startY = this.chart.priceToCanvasY(ray.startPrice);
    var endY = this.chart.priceToCanvasY(ray.endPrice);
    var canvasWidth = this.chart.canvas.width;
    var canvasHeight = this.chart.currentMainChartHeight;
    var dirX = endX - startX;
    var dirY = endY - startY;
    var maxDist = Math.sqrt(canvasWidth * canvasWidth + canvasHeight * canvasHeight) * 2;
    if (dirX === 0 && dirY === 0) dirX = 1;
    var norm = Math.sqrt(dirX * dirX + dirY * dirY);
    var extEndX = startX + (dirX / norm) * maxDist;
    var extEndY = startY + (dirY / norm) * maxDist;
    return { startX: startX, startY: startY, endX: extEndX, endY: extEndY, dirX: dirX, dirY: dirY };
};

RayDrawing.prototype.render = function(ctx) {
    for (var i = 0; i < this.rays.length; i++) { this.drawRay(ctx, this.rays[i]); }
    if (this.currentRay) { this.drawRay(ctx, this.currentRay); }
};

RayDrawing.prototype.drawRay = function(ctx, ray) {
    var screenCoords = this.getRayScreenCoords(ray);
    if (!screenCoords) return;
    ctx.strokeStyle = this.hexToRgba(ray.color, ray.opacity);
    ctx.lineWidth = ray.lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(screenCoords.startX, screenCoords.startY);
    ctx.lineTo(screenCoords.endX, screenCoords.endY);
    ctx.stroke();
};

RayDrawing.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

RayDrawing.prototype.save = function(stockCode, period) {
    var key = 'rays_' + stockCode + '_' + period;
    try { localStorage.setItem(key, JSON.stringify(this.rays)); } catch (e) { console.error('保存射线数据失败:', e); }
};

RayDrawing.prototype.load = function(stockCode, period) {
    var key = 'rays_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) { this.rays = JSON.parse(data); } else { this.rays = []; }
    } catch (e) { console.error('加载射线数据失败:', e); this.rays = []; }
};

RayDrawing.prototype.reset = function() {
    this.rays = []; this.isDrawing = false; this.startData = null; this.currentRay = null; this.selectedRay = null;
};

RayDrawing.prototype.clear = function(stockCode, period) {
    this.rays = []; this.save(stockCode, period);
};

RayDrawing.prototype.clearAll = function() {
    this.rays = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
