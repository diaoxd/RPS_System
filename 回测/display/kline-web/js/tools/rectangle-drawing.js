// 矩形绘制模块 - 基于K线索引和价格
function RectangleDrawing(chart) {
    this.chart = chart; // K线图表实例
    this.rectangles = []; // 存储所有矩形
    this.isDrawing = false; // 是否正在绘制
    this.startData = null; // 绘制起点数据（candleIndex, price）
    this.currentRectangle = null; // 当前正在绘制的矩形
    this.selectedRectangle = null; // 选中的矩形（用于右键菜单）
    
    // 右键菜单相关
    this.contextMenu = null;
    
    this.init();
}

// 初始化
RectangleDrawing.prototype.init = function() {
    this.createContextMenu();
};

// 创建右键菜单
RectangleDrawing.prototype.createContextMenu = function() {
    var self = this;
    console.log('Creating context menu...');
    
    // 创建菜单容器
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'rectangle-context-menu';
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
    
    console.log('Context menu created and added to document.body');
    
    // 点击其他地方隐藏菜单
    document.addEventListener('click', function(e) {
        if (self.contextMenu.style.display === 'block') {
            if (!self.contextMenu.contains(e.target)) {
                var colorPicker = document.getElementById('rectangle-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

// 显示右键菜单
RectangleDrawing.prototype.showContextMenu = function(x, y, rectangle) {
    console.log('Showing context menu at:', x, y, 'for rectangle:', rectangle);
    this.selectedRectangle = rectangle;
    
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
    console.log('Context menu displayed');
};

// 隐藏右键菜单
RectangleDrawing.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.hideColorPicker();
    this.selectedRectangle = null;
};

// 修改颜色
RectangleDrawing.prototype.changeColor = function() {
    var self = this;
    if (!this.selectedRectangle) return;
    
    this.showColorPicker();
};

// 显示颜色选择面板
RectangleDrawing.prototype.showColorPicker = function() {
    var self = this;
    
    // 如果已经存在颜色选择面板，先移除
    var oldPicker = document.getElementById('rectangle-color-picker');
    if (oldPicker) {
        oldPicker.parentNode.removeChild(oldPicker);
    }
    
    // 创建颜色选择面板
    var colorPicker = document.createElement('div');
    colorPicker.id = 'rectangle-color-picker';
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
        '#4a90e2', // 蓝色
        '#ef5350', // 红色
        '#66bb6a', // 绿色
        '#ffa726', // 橙色
        '#ab47bc', // 紫色
        '#26c6da', // 青色
        '#ffca28', // 黄色
        '#ec407a', // 粉色
        '#78909c', // 灰色
        '#ffffff'  // 白色
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
        if (colors[i] === this.selectedRectangle.color) {
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
                self.selectedRectangle.color = color;
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
RectangleDrawing.prototype.hideColorPicker = function() {
    var colorPicker = document.getElementById('rectangle-color-picker');
    if (colorPicker) {
        colorPicker.parentNode.removeChild(colorPicker);
    }
};

// 删除选中的矩形
RectangleDrawing.prototype.deleteSelected = function() {
    if (!this.selectedRectangle) return;
    
    var index = this.rectangles.indexOf(this.selectedRectangle);
    if (index !== -1) {
        this.rectangles.splice(index, 1);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
        this.chart.requestRender();
    }
};

// 找到最近的K线索引
RectangleDrawing.prototype.findNearestCandleIndex = function(canvasX) {
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
RectangleDrawing.prototype.getCandleCanvasX = function(candleIndex) {
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
RectangleDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    
    var price = this.canvasYToPrice(canvasY);
    
    this.isDrawing = true;
    this.startData = {
        candleIndex: candleIndex,
        price: price,
        candleTimestamp: this.chart.candles[candleIndex].date
    };
    this.currentRectangle = {
        startCandleIndex: candleIndex,
        startPrice: price,
        startCandleTimestamp: this.chart.candles[candleIndex].date,
        endCandleIndex: candleIndex,
        endPrice: price,
        endCandleTimestamp: this.chart.candles[candleIndex].date,
        color: '#ef5350',
        opacity: 0.3
    };
};

// 更新绘制
RectangleDrawing.prototype.updateDrawing = function(canvasX, canvasY) {
    if (!this.isDrawing || !this.currentRectangle) return;
    
    var candleIndex = this.findNearestCandleIndex(canvasX);
    if (candleIndex === -1) return;
    
    var price = this.canvasYToPrice(canvasY);
    
    this.currentRectangle.endCandleIndex = candleIndex;
    this.currentRectangle.endPrice = price;
    this.currentRectangle.endCandleTimestamp = this.chart.candles[candleIndex].date;
};

// 完成绘制
RectangleDrawing.prototype.finishDrawing = function() {
    if (!this.isDrawing || !this.currentRectangle) return;
    
    // 确保矩形有一定大小
    var candleRange = Math.abs(this.currentRectangle.endCandleIndex - this.currentRectangle.startCandleIndex);
    var priceRange = Math.abs(this.currentRectangle.endPrice - this.currentRectangle.startPrice);
    
    if (candleRange >= 1 || priceRange > 0) {
        this.rectangles.push(this.currentRectangle);
        this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    }
    
    this.isDrawing = false;
    this.startData = null;
    this.currentRectangle = null;
};

// 画布Y坐标转价格
RectangleDrawing.prototype.canvasYToPrice = function(canvasY) {
    if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) {
        return 0;
    }
    
    var padding = 15;
    var availableHeight = this.chart.currentMainChartHeight - padding * 2;
    var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
    return price;
};

// 根据时间戳找到K线索引
RectangleDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
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

// 检测点击是否在矩形内（增加点击容差）
RectangleDrawing.prototype.hitTest = function(canvasX, canvasY) {
    var tolerance = 10; // 点击容差，扩大检测范围
    
    for (var i = this.rectangles.length - 1; i >= 0; i--) {
        var rect = this.rectangles[i];
        
        // 获取矩形的屏幕坐标
        var screenRect = this.getRectangleScreenCoords(rect);
        if (!screenRect) continue;
        
        // 扩大检测范围
        if (canvasX >= screenRect.minX - tolerance && canvasX <= screenRect.maxX + tolerance && 
            canvasY >= screenRect.minY - tolerance && canvasY <= screenRect.maxY + tolerance) {
            console.log('Hit rectangle:', rect);
            return rect;
        }
    }
    console.log('No rectangle hit at:', canvasX, canvasY);
    return null;
};

// 获取矩形的屏幕坐标
RectangleDrawing.prototype.getRectangleScreenCoords = function(rect) {
    var startCandleIndex;
    var endCandleIndex;
    
    // 使用时间戳查找K线索引
    if (rect.startCandleTimestamp) {
        startCandleIndex = this.findCandleIndexByTimestamp(rect.startCandleTimestamp);
    } else {
        startCandleIndex = rect.startCandleIndex;
    }
    
    if (rect.endCandleTimestamp) {
        endCandleIndex = this.findCandleIndexByTimestamp(rect.endCandleTimestamp);
    } else {
        endCandleIndex = rect.endCandleIndex;
    }
    
    if (startCandleIndex === -1 || endCandleIndex === -1) {
        return null;
    }
    
    var startX = this.getCandleCanvasX(startCandleIndex);
    var endX = this.getCandleCanvasX(endCandleIndex);
    var startY = this.chart.priceToCanvasY(rect.startPrice);
    var endY = this.chart.priceToCanvasY(rect.endPrice);
    
    return {
        minX: Math.min(startX, endX),
        maxX: Math.max(startX, endX),
        minY: Math.min(startY, endY),
        maxY: Math.max(startY, endY)
    };
};

// 渲染矩形
RectangleDrawing.prototype.render = function(ctx) {
    var self = this;
    
    // 渲染已保存的矩形
    for (var i = 0; i < this.rectangles.length; i++) {
        this.drawRectangle(ctx, this.rectangles[i]);
    }
    
    // 渲染当前正在绘制的矩形
    if (this.currentRectangle) {
        this.drawRectangle(ctx, this.currentRectangle);
    }
};

// 绘制单个矩形
RectangleDrawing.prototype.drawRectangle = function(ctx, rect) {
    var screenRect = this.getRectangleScreenCoords(rect);
    if (!screenRect) return;
    
    var width = screenRect.maxX - screenRect.minX;
    var height = screenRect.maxY - screenRect.minY;
    
    // 绘制半透明填充
    ctx.fillStyle = this.hexToRgba(rect.color, rect.opacity);
    ctx.fillRect(screenRect.minX, screenRect.minY, width, height);
};

// 十六进制颜色转RGBA
RectangleDrawing.prototype.hexToRgba = function(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
};

// 保存数据
RectangleDrawing.prototype.save = function(stockCode, period) {
    var key = 'rectangles_' + stockCode + '_' + period;
    try {
        localStorage.setItem(key, JSON.stringify(this.rectangles));
    } catch (e) {
        console.error('保存矩形数据失败:', e);
    }
};

// 加载数据
RectangleDrawing.prototype.load = function(stockCode, period) {
    var key = 'rectangles_' + stockCode + '_' + period;
    try {
        var data = localStorage.getItem(key);
        if (data) {
            this.rectangles = JSON.parse(data);
        } else {
            this.rectangles = [];
        }
    } catch (e) {
        console.error('加载矩形数据失败:', e);
        this.rectangles = [];
    }
};

// 重置
RectangleDrawing.prototype.reset = function() {
    this.rectangles = [];
    this.isDrawing = false;
    this.startData = null;
    this.currentRectangle = null;
    this.selectedRectangle = null;
};

// 清除矩形数据
RectangleDrawing.prototype.clear = function(stockCode, period) {
    this.rectangles = [];
    this.save(stockCode, period);
};

// 清除所有矩形
RectangleDrawing.prototype.clearAll = function() {
    this.rectangles = [];
    this.save(this.chart.currentStockCode, this.chart.currentPeriod);
};
