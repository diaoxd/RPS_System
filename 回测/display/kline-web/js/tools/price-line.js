// 标价线绘制模块 - 基于价格
function PriceLineDrawing(chart) {
    this.chart = chart;
    this.lines = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentLine = null;
    this.selectedLine = null;
    this.contextMenu = null;
    this.init();
}

PriceLineDrawing.prototype.init = function() {
    this.createContextMenu();
};

PriceLineDrawing.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'priceline-context-menu';
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
                var colorPicker = document.getElementById('priceline-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

PriceLineDrawing.prototype.showContextMenu = function(x, y, line) {
    this.selectedLine = line;
    var menuWidth = 150, menuHeight = 80, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    var menuX = x, menuY = y;
    if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
    if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

PriceLineDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedLine = null;
};

PriceLineDrawing.prototype.showColorPicker = function() {
    var self = this;
    var oldPicker = document.getElementById('priceline-color-picker');
    if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
    var colorPicker = document.createElement('div');
    colorPicker.id = 'priceline-color-picker';
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

PriceLineDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('priceline-color-picker');
    if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
};

PriceLineDrawing.prototype.deleteSelected = function() {
    if (!this.selectedLine) return;
    var index = this.lines.indexOf(this.selectedLine);
    if (index !== -1) {
        this.lines.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

PriceLineDrawing.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) return 0;
    var padding = 15, availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

PriceLineDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    var width = this.chart.canvas.width, rightPadding = 45;
    var availableWidth = width - rightPadding;
    if (!this.chart.candles || this.chart.candles.length === 0) return 0;
    var candleWidth = availableWidth / this.chart.candles.length * this.chart.scale;
    var candleX = candleIndex * candleWidth + candleWidth / 2 + this.chart.offsetX;
    return candleX;
};

PriceLineDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    if (!this.chart.candles || this.chart.candles.length === 0) return -1;
    for (var i = 0; i < this.chart.candles.length; i++) {
        if (this.chart.candles[i].time === timestamp) return i;
    }
    return -1;
};

PriceLineDrawing.prototype.canvasXToCandleIndex = function(canvasX) {
    var width = this.chart.canvas.width, rightPadding = 45;
    var availableWidth = width - rightPadding;
    if (!this.chart.candles || this.chart.candles.length === 0) return -1;
    var candleWidth = availableWidth / this.chart.candles.length * this.chart.scale;
    var index = Math.floor((canvasX - this.chart.offsetX) / candleWidth);
    index = Math.max(0, Math.min(this.chart.candles.length - 1, index));
    return index;
};

PriceLineDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    var price = this.canvasYToPrice(canvasY);
    var candleIndex = this.canvasXToCandleIndex(canvasX);
    var candleTimestamp = null;
    if (candleIndex !== -1 && this.chart.candles && this.chart.candles[candleIndex]) {
        candleTimestamp = this.chart.candles[candleIndex].time;
    }
    this.lines.push({
        type: 'price',
        price: price,
        candleIndex: candleIndex,
        candleTimestamp: candleTimestamp,
        color: '#ffa726',
        lineWidth: 2,
        opacity: 1
    });
    this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    this.chart.requestRender();
};

PriceLineDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 8;
    for (var i = this.lines.length - 1; i >= 0; i--) {
        var line = this.lines[i];
        
        // 获取当前K线索引（优先用时间戳找）
        var candleIndex;
        if (line.candleTimestamp) candleIndex = this.findCandleIndexByTimestamp(line.candleTimestamp);
        else candleIndex = line.candleIndex;
        if (candleIndex === -1) continue;
        
        var lineY = this.chart.priceToCanvasY(line.price);
        var startX = this.getCandleCanvasX(candleIndex);
        var canvasWidth = this.chart.canvas.width;
        
        // 检测是否点击了线
        var hitLine = (canvasX >= startX && canvasX <= canvasWidth && Math.abs(canvasY - lineY) <= tolerance);
        
        // 检测是否点击了标签（在起点上方）
        var ctx = this.chart.ctx;
        ctx.font = '14px Arial, sans-serif';
        var priceLabel = line.price.toFixed(2);
        var textWidth = ctx.measureText(priceLabel).width;
        var hitLabel = (canvasX >= startX && canvasX <= startX + textWidth && 
                         canvasY >= lineY - 25 && canvasY <= lineY - 5);
        
        if (hitLine || hitLabel) {
            return line;
        }
    }
    return null;
};

PriceLineDrawing.prototype.render = function(ctx) {
    for (var i = 0; i < this.lines.length; i++) { 
        this.drawPriceLine(ctx, this.lines[i]); 
    }
};

PriceLineDrawing.prototype.drawPriceLine = function(ctx, line) {
    // 获取当前K线索引（优先用时间戳找）
    var candleIndex;
    if (line.candleTimestamp) candleIndex = this.findCandleIndexByTimestamp(line.candleTimestamp);
    else candleIndex = line.candleIndex;
    if (candleIndex === -1) return;
    
    var y = this.chart.priceToCanvasY(line.price);
    var canvasWidth = this.chart.canvas.width;
    var startX = this.getCandleCanvasX(candleIndex);
    
    // 绘制水平线：从起点向右延伸
    ctx.strokeStyle = this.hexToRgba(line.color, line.opacity);
    ctx.lineWidth = line.lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
    
    // 绘制价格标签：在起点上方显示
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = line.color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    var priceLabel = line.price.toFixed(2);
    ctx.fillText(priceLabel, startX, y - 5);
};

PriceLineDrawing.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

PriceLineDrawing.prototype.save = function(stockCode, period) {
    var key = 'pricelines_' + stockCode + '_' + period;
    try { localStorage.setItem(key, JSON.stringify(this.lines)); } catch (e) { console.error('保存标价线数据失败:', e); }
};

PriceLineDrawing.prototype.load = function(stockCode, period) {
    var key = 'pricelines_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) { this.lines = JSON.parse(data); } else { this.lines = []; }
    } catch (e) { console.error('加载标价线数据失败:', e); this.lines = []; }
};

PriceLineDrawing.prototype.reset = function() {
    this.lines = []; this.isDrawing = false; this.startData = null; this.currentLine = null; this.selectedLine = null;
};

PriceLineDrawing.prototype.clear = function(stockCode, period) {
    this.lines = []; this.save(stockCode, period);
};

PriceLineDrawing.prototype.clearAll = function() {
    this.lines = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
