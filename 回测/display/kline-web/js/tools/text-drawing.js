// 文字绘制模块 - 基于K线索引和价格
function TextDrawing(chart) {
    this.chart = chart;
    this.texts = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentText = null;
    this.selectedText = null;
    this.contextMenu = null;
    this.inputDialog = null;
    this.init();
}

TextDrawing.prototype.init = function() {
    this.createContextMenu();
    this.createInputDialog();
};

TextDrawing.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'text-context-menu';
    this.contextMenu.style.position = 'fixed';
    this.contextMenu.style.backgroundColor = '#1f2937';
    this.contextMenu.style.border = '1px solid #4B5563';
    this.contextMenu.style.borderRadius = '4px';
    this.contextMenu.style.padding = '4px 0';
    this.contextMenu.style.zIndex = '1000';
    this.contextMenu.style.display = 'none';
    this.contextMenu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    this.contextMenu.style.minWidth = '100px';
    
    var editOption = document.createElement('div');
    editOption.style.padding = '8px 16px';
    editOption.style.cursor = 'pointer';
    editOption.style.color = '#ffffff';
    editOption.style.fontSize = '14px';
    editOption.style.userSelect = 'none';
    editOption.textContent = '编辑文字';
    editOption.onmouseover = function() { this.style.backgroundColor = '#374151'; };
    editOption.onmouseout = function() { this.style.backgroundColor = 'transparent'; };
    editOption.onclick = function(e) {
        e.stopPropagation();
        self.editSelected();
        self.hideContextMenu();
    };
    
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
    colorOption.onmouseout = function() { this.style.backgroundColor = 'transparent'; };
    
    var deleteOption = document.createElement('div');
    deleteOption.style.padding = '8px 16px';
    deleteOption.style.cursor = 'pointer';
    deleteOption.style.color = '#ef5350';
    deleteOption.style.fontSize = '14px';
    deleteOption.style.userSelect = 'none';
    deleteOption.textContent = '删除';
    deleteOption.onmouseover = function() { this.style.backgroundColor = '#374151'; };
    deleteOption.onmouseout = function() { this.style.backgroundColor = 'transparent'; };
    deleteOption.onclick = function(e) {
        e.stopPropagation();
        self.deleteSelected();
        self.hideContextMenu();
    };
    
    this.contextMenu.appendChild(editOption);
    this.contextMenu.appendChild(colorOption);
    this.contextMenu.appendChild(deleteOption);
    document.body.appendChild(this.contextMenu);
    
    document.addEventListener('click', function(e) {
        if (self.contextMenu.style.display === 'block') {
            if (!self.contextMenu.contains(e.target)) {
                var colorPicker = document.getElementById('text-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

TextDrawing.prototype.createInputDialog = function() {
    var self = this;
    this.inputDialog = document.createElement('div');
    this.inputDialog.id = 'text-input-dialog';
    this.inputDialog.style.position = 'fixed';
    this.inputDialog.style.backgroundColor = '#1f2937';
    this.inputDialog.style.border = '1px solid #4B5563';
    this.inputDialog.style.borderRadius = '6px';
    this.inputDialog.style.padding = '16px';
    this.inputDialog.style.zIndex = '1001';
    this.inputDialog.style.display = 'none';
    this.inputDialog.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
    this.inputDialog.style.minWidth = '250px';
    
    var title = document.createElement('div');
    title.style.color = '#ffffff';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '12px';
    title.textContent = '输入文字';
    
    var input = document.createElement('input');
    input.type = 'text';
    input.id = 'text-input-field';
    input.style.width = '100%';
    input.style.padding = '8px 12px';
    input.style.boxSizing = 'border-box';
    input.style.backgroundColor = '#374151';
    input.style.color = '#ffffff';
    input.style.border = '1px solid #4B5563';
    input.style.borderRadius = '4px';
    input.style.fontSize = '14px';
    input.style.marginBottom = '12px';
    input.placeholder = '请输入文字...';
    
    var btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '8px';
    btnContainer.style.justifyContent = 'flex-end';
    
    var btnCancel = document.createElement('button');
    btnCancel.textContent = '取消';
    btnCancel.style.padding = '8px 16px';
    btnCancel.style.backgroundColor = '#374151';
    btnCancel.style.color = '#ffffff';
    btnCancel.style.border = '1px solid #4B5563';
    btnCancel.style.borderRadius = '4px';
    btnCancel.style.cursor = 'pointer';
    btnCancel.onclick = function() { self.hideInputDialog(); };
    
    var btnConfirm = document.createElement('button');
    btnConfirm.textContent = '确定';
    btnConfirm.style.padding = '8px 16px';
    btnConfirm.style.backgroundColor = '#3b82f6';
    btnConfirm.style.color = '#ffffff';
    btnConfirm.style.border = 'none';
    btnConfirm.style.borderRadius = '4px';
    btnConfirm.style.cursor = 'pointer';
    btnConfirm.onclick = function() { self.confirmText(); };
    
    btnContainer.appendChild(btnCancel);
    btnContainer.appendChild(btnConfirm);
    this.inputDialog.appendChild(title);
    this.inputDialog.appendChild(input);
    this.inputDialog.appendChild(btnContainer);
    document.body.appendChild(this.inputDialog);
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { self.confirmText(); }
        else if (e.key === 'Escape') { self.hideInputDialog(); }
    });
};

TextDrawing.prototype.showInputDialog = function(x, y, existingText) {
    var self = this;
    this.tempX = x;
    this.tempY = y;
    this.tempExistingText = existingText;
    var inputField = document.getElementById('text-input-field');
    if (existingText) {
        inputField.value = existingText.content;
    } else {
        inputField.value = '';
    }
    this.inputDialog.style.left = (x + 10) + 'px';
    this.inputDialog.style.top = (y - 50) + 'px';
    this.inputDialog.style.display = 'block';
    inputField.focus();
    inputField.select();
};

TextDrawing.prototype.hideInputDialog = function() {
    this.inputDialog.style.display = 'none';
    this.tempX = null;
    this.tempY = null;
    this.tempExistingText = null;
};

TextDrawing.prototype.confirmText = function() {
    var inputField = document.getElementById('text-input-field');
    var content = inputField.value.trim();
    if (!content) return;
    
    if (this.tempExistingText) {
        this.tempExistingText.content = content;
    } else {
        var candleIndex = this.findNearestCandleIndex(this.tempX);
        var price = this.canvasYToPrice(this.tempY);
        this.texts.push({
            type: 'text',
            candleIndex: candleIndex,
            price: price,
            candleTimestamp: this.chart.candles[candleIndex].date,
            content: content,
            color: '#ffffff',
            fontSize: 14
        });
    }
    this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    this.chart.requestRender();
    this.hideInputDialog();
    
    // 只有在新建文字时才关闭工具
    if (!this.tempExistingText) {
        this.chart.setTool('candle');
    }
};

TextDrawing.prototype.editSelected = function() {
    if (!this.selectedText) return;
    var coords = this.getTextScreenCoords(this.selectedText);
    if (coords) {
        this.showInputDialog(coords.x, coords.y, this.selectedText);
    }
};

TextDrawing.prototype.showContextMenu = function(x, y, text) {
    this.selectedText = text;
    var menuWidth = 150, menuHeight = 120, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
    var menuX = x, menuY = y;
    if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
    if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

TextDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedText = null;
};

TextDrawing.prototype.showColorPicker = function() {
    var self = this;
    var oldPicker = document.getElementById('text-color-picker');
    if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
    var colorPicker = document.createElement('div');
    colorPicker.id = 'text-color-picker';
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
        if (colors[i] === this.selectedText.color) colorBtn.style.borderColor = '#ffffff';
        colorBtn.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
        colorBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };
        (function(color) {
            colorBtn.onclick = function() {
                self.selectedText.color = color;
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

TextDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('text-color-picker');
    if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
};

TextDrawing.prototype.deleteSelected = function() {
    if (!this.selectedText) return;
    var index = this.texts.indexOf(this.selectedText);
    if (index !== -1) {
        this.texts.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

TextDrawing.prototype.findNearestCandleIndex = function(canvasX) {
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

TextDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    var candles = this.chart.candles, viewWidth = this.chart.canvas.width, rightPadding = 45, availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length, candleWidth = baseCandleWidth * this.chart.scale, offsetX = this.chart.offsetX;
    return candleIndex * candleWidth + offsetX + candleWidth / 2;
};

TextDrawing.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) return 0;
    var padding = 15, availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

TextDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) return -1;
    for (var i = 0; i < candles.length; i++) { if (candles[i].date === timestamp) return i; }
    return -1;
};

TextDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    this.showInputDialog(canvasX, canvasY, null);
};

TextDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 20;
    for (var i = this.texts.length - 1; i >= 0; i--) {
        var text = this.texts[i];
        var coords = this.getTextScreenCoords(text);
        if (!coords) continue;
        if (Math.abs(canvasX - coords.x) <= tolerance && Math.abs(canvasY - coords.y) <= tolerance) {
            return text;
        }
    }
    return null;
};

TextDrawing.prototype.getTextScreenCoords = function(text) {
    var candleIndex;
    if (text.candleTimestamp) candleIndex = this.findCandleIndexByTimestamp(text.candleTimestamp);
    else candleIndex = text.candleIndex;
    if (candleIndex === -1) return null;
    var x = this.getCandleCanvasX(candleIndex);
    var y = this.chart.priceToCanvasY(text.price);
    return { x: x, y: y };
};

TextDrawing.prototype.render = function(ctx) {
    for (var i = 0; i < this.texts.length; i++) { this.drawText(ctx, this.texts[i]); }
};

TextDrawing.prototype.drawText = function(ctx, text) {
    var coords = this.getTextScreenCoords(text);
    if (!coords) return;
    ctx.font = text.fontSize + 'px Microsoft YaHei, Arial, sans-serif';
    ctx.fillStyle = text.color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.content, coords.x, coords.y);
};

TextDrawing.prototype.save = function(stockCode, period) {
    var key = 'texts_' + stockCode + '_' + period;
    try { localStorage.setItem(key, JSON.stringify(this.texts)); } catch (e) { console.error('保存文字数据失败:', e); }
};

TextDrawing.prototype.load = function(stockCode, period) {
    var key = 'texts_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) { this.texts = JSON.parse(data); } else { this.texts = []; }
    } catch (e) { console.error('加载文字数据失败:', e); this.texts = []; }
};

TextDrawing.prototype.reset = function() {
    this.texts = []; this.isDrawing = false; this.startData = null; this.currentText = null; this.selectedText = null;
};

TextDrawing.prototype.clear = function(stockCode, period) {
    this.texts = []; this.save(stockCode, period);
};

TextDrawing.prototype.clearAll = function() {
    this.texts = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
