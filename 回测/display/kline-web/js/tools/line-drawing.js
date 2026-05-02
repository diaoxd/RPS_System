// 线段绘制模块 - 基于K线索引和价格
function LineDrawing(chart) {
    this.chart = chart; // K线图表实例
    this.lines = []; // 存储所有线段
    this.isDrawing = false; // 是否正在绘制
    this.startData = null; // 绘制起点数据（candleIndex, price）
    this.currentLine = null; // 当前正在绘制的线段
    this.selectedLine = null; // 选中的线段（用于右键菜单）
    
    // 右键菜单相关
    this.contextMenu = null;
    
    this.init();
}

// 初始化
LineDrawing.prototype.init = function() {
    this.createContextMenu();
};

// 创建右键菜单
LineDrawing.prototype.createContextMenu = function() {
    var self = this;
    
    // 创建菜单容器
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'line-context-menu';
    this.contextMenu.style.position = 'fixed';
    this.contextMenu.style.backgroundColor = '#1f2937';
    this.contextMenu.style.border = '1px solid #4B5563';
    this.contextMenu.style.borderRadius = '4px';
    this.contextMenu.style.padding = '4px 0';
    this.contextMenu.style.zIndex = '1000';
    this.contextMenu.style.display = 'none';
    this.contextMenu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    this.contextMenu.style.minWidth = '100px';
    
    // 创建修改颜色选项
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
    
    // 创建删除选项
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
    
    // 点击其他地方隐藏菜单
    document.addEventListener('click', function(e) {
        if (self.contextMenu.style.display === 'block') {
            if (!self.contextMenu.contains(e.target)) {
                var colorPicker = document.getElementById('line-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

// 显示右键菜单
LineDrawing.prototype.showContextMenu = function(x, y, line) {
    this.selectedLine = line;
    
    // 确保菜单在视口内
    var menuWidth = 150;
    var menuHeight = 80;
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    
    var menuX = x;
    var menuY = y;
    
    // 如果菜单超出右边界，向左调整
    if (x + menuWidth > viewportWidth) {
        menuX = x - menuWidth;
    }
    
    // 如果菜单超出下边界，向上调整
    if (y + menuHeight > viewportHeight) {
        menuY = y - menuHeight;
    }
    
    this.contextMenu.style.left = menuX + 'px';
    this.contextMenu.style.top = menuY + 'px';
    this.contextMenu.style.display = 'block';
};

// 隐藏右键菜单
LineDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedLine = null;
};

// 显示颜色选择面板
LineDrawing.prototype.showColorPicker = function() {
    var self = this;
    
    // 如果已经存在颜色选择面板，先移除
    var oldPicker = document.getElementById('line-color-picker');
    if (oldPicker) {
        oldPicker.parentNode.removeChild(oldPicker);
    }
    
    // 创建颜色选择面板
    var colorPicker = document.createElement('div');
    colorPicker.id = 'line-color-picker';
    colorPicker.style.position = 'fixed';
    colorPicker.style.backgroundColor = '#1f2937';
    colorPicker.style.border = '1px solid #4B5563';
    colorPicker.style.borderRadius = '4px';
    colorPicker.style.padding = '6px';
    colorPicker.style.zIndex = '1001';
    colorPicker.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    
    // 设置面板位置（在右键菜单旁边）
    var menuRect = this.contextMenu.getBoundingClientRect();
    colorPicker.style.left = (menuRect.right + 10) + 'px';
    colorPicker.style.top = menuRect.top + 'px';
    
    // 颜色选项
    var colors = [
        '#4a90e2',
        '#ef5350',
        '#66bb6a',
        '#ffa726',
        '#ab47bc',
        '#26c6da',
        '#ffca28',
        '#ec407a',
        '#78909c',
        '#ffffff'
    ];
    
    // 创建颜色网格
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
        
        // 如果是当前颜色，高亮显示
        if (colors[i] === this.selectedLine.color) {
            colorBtn.style.borderColor = '#ffffff';
        }
        
        colorBtn.onmouseover = function() {
            this.style.transform = 'scale(1.1)';
        };
        colorBtn.onmouseout = function() {
            this.style.transform = 'scale(1)';
        };
        
        // 闭包保存颜色值
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
    
    // 点击其他地方隐藏颜色选择面板
    var closePicker = function(e) {
        if (!colorPicker.contains(e.target)) {
            self.hideColorPicker();
            document.removeEventListener('click', closePicker);
        }
    };
    
    // 延迟添加事件，避免立即触发
    setTimeout(function() {
        document.addEventListener('click', closePicker);
    }, 10);
};

// 隐藏颜色选择面板
LineDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('line-color-picker');
    if (colorPicker) {
        colorPicker.parentNode.removeChild(colorPicker);
    }
};

// 删除选中的线段
LineDrawing.prototype.deleteSelected = function() {
    if (!this.selectedLine) return;
    
    var index = this.lines.indexOf(this.selectedLine);
    if (index !== -1) {
        this.lines.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

// 找到最近的K线索引
LineDrawing.prototype.findNearestCandleIndex = function(canvasX) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) {
        return -1;
    }

    var viewWidth = this.chart.canvas.width;
    var rightPadding = 45;
    var availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length;
    var candleWidth = baseCandleWidth * this.chart.scale;
    var offsetX = this.chart.offsetX;

    var minDistance = Infinity;
    var nearestIndex = -1;

    for (var i = 0; i < candles.length; i++) {
        var candleX = i * candleWidth + offsetX + candleWidth / 2;
        var distance = Math.abs(canvasX - candleX);
        
        if (distance < minDistance) {
            minDistance = distance;
            nearestIndex = i;
        }
    }

    return nearestIndex;
};

// 获取K线的画布X坐标
LineDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    var candles = this.chart.candles;
    var viewWidth = this.chart.canvas.width;
    var rightPadding = 45;
    var availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length;
    var candleWidth = baseCandleWidth * this.chart.scale;
    var offsetX = this.chart.offsetX;
    
    return candleIndex * candleWidth + offsetX + candleWidth / 2;
};

// 开始绘制
LineDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    
    var price = this.canvasYToPrice(canvasY);
    
    this.isDrawing = true;
    this.startData = {
        candleIndex: candleIndex,
        price: price,
        candleTimestamp: this.chart.candles[candleIndex].date
    };
    this.currentLine = {
        type: 'line',
        startCandleIndex: candleIndex,
        startPrice: price,
        startCandleTimestamp: this.chart.candles[candleIndex].date,
        endCandleIndex: candleIndex,
        endPrice: price,
        endCandleTimestamp: this.chart.candles[candleIndex].date,
        color: '#4a90e2',
        lineWidth: 2,
        opacity: 1
    };
};

// 更新绘制
LineDrawing.prototype.updateDrawing = function(canvasX, canvasY) {
    if (!this.isDrawing || !this.currentLine) return;
    
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    
    var price = this.canvasYToPrice(canvasY);
    
    this.currentLine.endCandleIndex = candleIndex;
    this.currentLine.endPrice = price;
    this.currentLine.endCandleTimestamp = this.chart.candles[candleIndex].date;
};

// 完成绘制
LineDrawing.prototype.finishDrawing = function() {
    if (!this.isDrawing || !this.currentLine) return;
    
    // 确保线段有一定长度
    var candleRange = Math.abs(this.currentLine.endCandleIndex - this.currentLine.startCandleIndex);
    var priceRange = Math.abs(this.currentLine.endPrice - this.currentLine.startPrice);
    
    if (candleRange >= 1 || priceRange > 0) {
        this.lines.push(this.currentLine);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    }
    
    this.isDrawing = false;
    this.startData = null;
    this.currentLine = null;
};

// 画布Y坐标转价格
LineDrawing.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) {
        return 0;
    }
    
    var padding = 15;
    var availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

// 根据时间戳找到K线索引
LineDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.chart.candles;
    if (!candles || candles.length === 0) {
        return -1;
    }
    
    for (var i = 0; i < candles.length; i++) {
        if (candles[i].date === timestamp) {
            return i;
        }
    }
    return -1;
};

// 检测点击是否在线段上（带容差）
LineDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 8;
    
    for (var i = this.lines.length - 1; i >= 0; i--) {
        var line = this.lines[i];
        var screenCoords = this.getLineScreenCoords(line);
        if (!screenCoords) continue;
        
        // 点到线段的距离公式
        var dx = screenCoords.endX - screenCoords.startX;
        var dy = screenCoords.endY - screenCoords.startY;
        var lengthSq = dx * dx + dy * dy;
        
        if (lengthSq === 0) {
            var dist = Math.sqrt(Math.pow(canvasX - screenCoords.startX, 2) + Math.pow(canvasY - screenCoords.startY, 2));
            if (dist <= tolerance) return line;
            continue;
        }
        
        var t = ((canvasX - screenCoords.startX) * dx + (canvasY - screenCoords.startY) * dy) / lengthSq;
        t = Math.max(0, Math.min(1, t));
        
        var nearestX = screenCoords.startX + t * dx;
        var nearestY = screenCoords.startY + t * dy;
        
        var dist = Math.sqrt(Math.pow(canvasX - nearestX, 2) + Math.pow(canvasY - nearestY, 2));
        
        if (dist <= tolerance) {
            return line;
        }
    }
    return null;
};

// 获取线段的屏幕坐标
LineDrawing.prototype.getLineScreenCoords = function(line) {
    var startCandleIndex;
    var endCandleIndex;
    
    // 使用时间戳查找K线索引
    if (line.startCandleTimestamp) {
        startCandleIndex = this.findCandleIndexByTimestamp(line.startCandleTimestamp);
    } else {
        startCandleIndex = line.startCandleIndex;
    }
    
    if (line.endCandleTimestamp) {
        endCandleIndex = this.findCandleIndexByTimestamp(line.endCandleTimestamp);
    } else {
        endCandleIndex = line.endCandleIndex;
    }
    
    if (startCandleIndex === -1 || endCandleIndex === -1) {
        return null;
    }
    
    var startX = this.getCandleCanvasX(startCandleIndex);
    var endX = this.getCandleCanvasX(endCandleIndex);
    var startY = this.chart.priceToCanvasY(line.startPrice);
    var endY = this.chart.priceToCanvasY(line.endPrice);
    
    return {
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY
    };
};

// 渲染线段
LineDrawing.prototype.render = function(ctx) {
    // 渲染已保存的线段
    for (var i = 0; i < this.lines.length; i++) {
        this.drawLine(ctx, this.lines[i]);
    }
    
    // 渲染当前正在绘制的线段
    if (this.currentLine) {
        this.drawLine(ctx, this.currentLine);
    }
};

// 绘制单条线段
LineDrawing.prototype.drawLine = function(ctx, line) {
    var screenCoords = this.getLineScreenCoords(line);
    if (!screenCoords) return;
    
    ctx.strokeStyle = this.hexToRgba(line.color, line.opacity);
    ctx.lineWidth = line.lineWidth;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(screenCoords.startX, screenCoords.startY);
    ctx.lineTo(screenCoords.endX, screenCoords.endY);
    ctx.stroke();
};

// 十六进制颜色转RGBA
LineDrawing.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

// 保存数据
LineDrawing.prototype.save = function(stockCode, period) {
    var key = 'lines_' + stockCode + '_' + period;
    try {
        localStorage.setItem(key, JSON.stringify(this.lines));
    } catch (e) {
        console.error('保存线段数据失败:', e);
    }
};

// 加载数据
LineDrawing.prototype.load = function(stockCode, period) {
    var key = 'lines_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) {
            this.lines = JSON.parse(data);
        } else {
            this.lines = [];
        }
    } catch (e) {
        console.error('加载线段数据失败:', e);
        this.lines = [];
    }
};

// 重置
LineDrawing.prototype.reset = function() {
    this.lines = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentLine = null;
    this.selectedLine = null;
};

// 清除线段数据
LineDrawing.prototype.clear = function(stockCode, period) {
    this.lines = [];
    this.save(stockCode, period);
};

// 清除所有线段
LineDrawing.prototype.clearAll = function() {
    this.lines = [];
    this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
