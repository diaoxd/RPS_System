// 平行线绘制模块 - 拖拽画线方式
function ParallelLineDrawing(chart) {
    this.chart = chart;
    this.lines = [];
    this.isDrawing = false;
    this.isDragging = false;
    this.step = 0;
    this.point1 = null;
    this.point2 = null;
    this.currentLine = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.selectedLine = null;
    this.contextMenu = null;
    this.init();
}

ParallelLineDrawing.prototype.init = function() {
    try {
        this.createContextMenu();
    } catch (e) {
        console.error('平行线初始化失败:', e);
    }
};

ParallelLineDrawing.prototype.createContextMenu = function() {
    var self = this;
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'parallel-context-menu';
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
                var colorPicker = document.getElementById('parallel-color-picker');
                if (!colorPicker || !colorPicker.contains(e.target)) {
                    self.hideContextMenu();
                }
            }
        }
    });
};

ParallelLineDrawing.prototype.showContextMenu = function(x, y, line) {
    try {
        this.selectedLine = line;
        var menuWidth = 150, menuHeight = 80, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight;
        var menuX = x, menuY = y;
        if (x + menuWidth > viewportWidth) menuX = x - menuWidth;
        if (y + menuHeight > viewportHeight) menuY = y - menuHeight;
        this.contextMenu.style.left = menuX + 'px';
        this.contextMenu.style.top = menuY + 'px';
        this.contextMenu.style.display = 'block';
    } catch (e) {
        console.error('显示右键菜单失败:', e);
    }
};

ParallelLineDrawing.prototype.hideContextMenu = function() {
    try {
        this.contextMenu.style.display = 'none';
        this.hideColorPicker();
        this.selectedLine = null;
    } catch (e) {
        console.error('隐藏右键菜单失败:', e);
    }
};

ParallelLineDrawing.prototype.showColorPicker = function() {
    var self = this;
    try {
        var oldPicker = document.getElementById('parallel-color-picker');
        if (oldPicker) oldPicker.parentNode.removeChild(oldPicker);
        var colorPicker = document.createElement('div');
        colorPicker.id = 'parallel-color-picker';
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
            if (this.selectedLine && colors[i] === this.selectedLine.color) colorBtn.style.borderColor = '#ffffff';
            colorBtn.onmouseover = function() { this.style.transform = 'scale(1.1)'; };
            colorBtn.onmouseout = function() { this.style.transform = 'scale(1)'; };
            (function(color) {
                colorBtn.onclick = function() {
                    if (self.selectedLine) {
                        self.selectedLine.color = color;
                        self.save(self.chart.currentStockCode, self.chart.currentPeriod);
                        self.chart.requestRender();
                        self.hideColorPicker();
                    }
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
    } catch (e) {
        console.error('显示颜色选择器失败:', e);
    }
};

ParallelLineDrawing.prototype.hideColorPicker = function() {
    try {
        var colorPicker = document.getElementById('parallel-color-picker');
        if (colorPicker) colorPicker.parentNode.removeChild(colorPicker);
    } catch (e) {
        console.error('隐藏颜色选择器失败:', e);
    }
};

ParallelLineDrawing.prototype.deleteSelected = function() {
    try {
        if (!this.selectedLine) return;
        var index = this.lines.indexOf(this.selectedLine);
        if (index !== -1) {
            this.lines.splice(index, 1);
            this.save(this.chart.currentStockCode, this.chart.currentPeriod);
            this.chart.requestRender();
        }
    } catch (e) {
        console.error('删除失败:', e);
    }
};

ParallelLineDrawing.prototype.findNearestCandleIndex = function(canvasX) {
    try {
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
    } catch (e) {
        console.error('查找最近K线索引失败:', e);
        return -1;
    }
};

ParallelLineDrawing.prototype.getCandleCanvasX = function(candleIndex) {
    try {
        var candles = this.chart.candles, viewWidth = this.chart.canvas.width, rightPadding = 45, availableWidth = viewWidth - rightPadding;
        var baseCandleWidth = availableWidth / candles.length, candleWidth = baseCandleWidth * this.chart.scale, offsetX = this.chart.offsetX;
        return candleIndex * candleWidth + offsetX + candleWidth / 2;
    } catch (e) {
        console.error('获取K线X坐标失败:', e);
        return 0;
    }
};

ParallelLineDrawing.prototype.canvasYToPrice = function(canvasY) {
    try {
        if (this.chart.currentMainChartHeight === undefined || this.chart.currentMinPrice === undefined || this.chart.currentMaxPrice === undefined) return 0;
        var padding = 15, availableHeight = this.chart.currentMainChartHeight - padding * 2;
        var price = this.chart.currentMaxPrice - (canvasY - padding) / availableHeight * this.chart.currentPriceRange;
        return price;
    } catch (e) {
        console.error('Y坐标转价格失败:', e);
        return 0;
    }
};

ParallelLineDrawing.prototype.findCandleIndexByTimestamp = function(timestamp) {
    try {
        var candles = this.chart.candles;
        if (!candles || candles.length === 0) return -1;
        for (var i = 0; i < candles.length; i++) { if (candles[i].date === timestamp) return i; }
        return -1;
    } catch (e) {
        console.error('根据时间戳查找K线索引失败:', e);
        return -1;
    }
};

ParallelLineDrawing.prototype.startDrawing = function(canvasX, canvasY) {
    try {
        var candleIndex = this.findNearestCandleIndex(canvasX);
        if (candleIndex === -1) return;
        var price = this.canvasYToPrice(canvasY);
        
        if (this.step === 0) {
            this.point1 = { 
                candleIndex: candleIndex, 
                price: price, 
                candleTimestamp: this.chart.candles[candleIndex].date 
            };
            this.step = 1;
            this.isDrawing = true;
            this.isDragging = true;
            this.mouseX = canvasX;
            this.mouseY = canvasY;
            this.currentLine = {
                type: 'parallel',
                point1: { candleIndex: candleIndex, price: price, candleTimestamp: this.chart.candles[candleIndex].date },
                point2: null,
                offsetX: 0,
                offsetY: 0,
                color: '#26c6da',
                lineWidth: 2,
                opacity: 1
            };
        } else if (this.step === 2) {
            var x1 = this.getCandleCanvasX(this.point1.candleIndex);
            var y1 = this.chart.priceToCanvasY(this.point1.price);
            var x2 = this.getCandleCanvasX(this.point2.candleIndex);
            var y2 = this.chart.priceToCanvasY(this.point2.price);
            var midX = (x1 + x2) / 2;
            var midY = (y1 + y2) / 2;
            this.currentLine.offsetX = this.mouseX - midX;
            this.currentLine.offsetY = this.mouseY - midY;
            this.lines.push(this.currentLine);
            this.save(this.chart.currentStockCode, this.chart.currentPeriod);
            this.resetDrawing();
            if (this.chart && this.chart.setTool) {
                this.chart.setTool('candle');
            }
        }
    } catch (e) {
        console.error('开始绘制平行线失败:', e);
    }
};

ParallelLineDrawing.prototype.updateDrawing = function(canvasX, canvasY) {
    try {
        this.mouseX = canvasX;
        this.mouseY = canvasY;
        
        if (!this.currentLine) return;
        
        if (this.step === 1 && this.isDragging) {
            var candleIndex = this.findNearestCandleIndex(canvasX);
            if (candleIndex === -1) return;
            var price = this.canvasYToPrice(canvasY);
            this.currentLine.point2 = { 
                candleIndex: candleIndex, 
                price: price, 
                candleTimestamp: this.chart.candles[candleIndex].date 
            };
            this.point2 = { 
                candleIndex: candleIndex, 
                price: price, 
                candleTimestamp: this.chart.candles[candleIndex].date 
            };
        }
    } catch (e) {
        console.error('更新绘制平行线失败:', e);
    }
};

ParallelLineDrawing.prototype.finishDrawing = function() {
    try {
        if (this.step === 1 && this.isDragging) {
            this.isDragging = false;
            this.step = 2;
        }
    } catch (e) {
        console.error('完成绘制平行线失败:', e);
    }
};

ParallelLineDrawing.prototype.resetDrawing = function() {
    try {
        this.step = 0;
        this.point1 = null;
        this.point2 = null;
        this.isDrawing = false;
        this.isDragging = false;
        this.currentLine = null;
    } catch (e) {
        console.error('重置绘制状态失败:', e);
    }
};

ParallelLineDrawing.prototype.hitTest = function(canvasX, canvasY) {
    try {
        var tolerance = 8;
        for (var i = this.lines.length - 1; i >= 0; i--) {
            var line = this.lines[i];
            var coords = this.getParallelLineScreenCoords(line);
            if (!coords) continue;
            
            var hit1 = this.lineHitTest(canvasX, canvasY, coords.line1StartX, coords.line1StartY, coords.line1EndX, coords.line1EndY, tolerance);
            var hit2 = this.lineHitTest(canvasX, canvasY, coords.line2StartX, coords.line2StartY, coords.line2EndX, coords.line2EndY, tolerance);
            
            if (hit1 || hit2) {
                return line;
            }
        }
        return null;
    } catch (e) {
        console.error('点击检测失败:', e);
        return null;
    }
};

ParallelLineDrawing.prototype.lineHitTest = function(px, py, x1, y1, x2, y2, tolerance) {
    try {
        var dx = x2 - x1;
        var dy = y2 - y1;
        var lengthSq = dx * dx + dy * dy;
        if (lengthSq === 0) {
            var dist = Math.sqrt(Math.pow(px - x1, 2) + Math.pow(py - y1, 2));
            return dist <= tolerance;
        }
        var t = ((px - x1) * dx + (py - y1) * dy) / lengthSq;
        t = Math.max(0, Math.min(1, t));
        var nearestX = x1 + t * dx;
        var nearestY = y1 + t * dy;
        var dist = Math.sqrt(Math.pow(px - nearestX, 2) + Math.pow(py - nearestY, 2));
        return dist <= tolerance;
    } catch (e) {
        console.error('线段点击检测失败:', e);
        return false;
    }
};

ParallelLineDrawing.prototype.getParallelLineScreenCoords = function(line) {
    try {
        var p1Index, p2Index;
        
        // 检查 point1 是否存在
        if (!line.point1) return null;
        
        if (line.point1.candleTimestamp) p1Index = this.findCandleIndexByTimestamp(line.point1.candleTimestamp);
        else p1Index = line.point1.candleIndex;
        if (p1Index === -1) return null;
        
        // 检查 point2 是否存在
        if (!line.point2) return null;
        
        if (line.point2.candleTimestamp) p2Index = this.findCandleIndexByTimestamp(line.point2.candleTimestamp);
        else p2Index = line.point2.candleIndex;
        if (p2Index === -1) return null;
        
        var canvasWidth = this.chart.canvas.width;
        
        var x1 = this.getCandleCanvasX(p1Index);
        var y1 = this.chart.priceToCanvasY(line.point1.price);
        var x2 = this.getCandleCanvasX(p2Index);
        var y2 = this.chart.priceToCanvasY(line.point2.price);
        
        var dx = x2 - x1;
        var dy = y2 - y1;
        
        var line1 = this.extendLineToEdges(x1, y1, x2, y2, canvasWidth);
        
        var offsetX, offsetY;
        if (this.currentLine === line && this.step === 2) {
            var midX = (x1 + x2) / 2;
            var midY = (y1 + y2) / 2;
            offsetX = this.mouseX - midX;
            offsetY = this.mouseY - midY;
        } else {
            offsetX = line.offsetX || 0;
            offsetY = line.offsetY || 0;
        }
        
        var line2 = {
            startX: line1.startX + offsetX,
            startY: line1.startY + offsetY,
            endX: line1.endX + offsetX,
            endY: line1.endY + offsetY
        };
        
        return {
            line1StartX: line1.startX,
            line1StartY: line1.startY,
            line1EndX: line1.endX,
            line1EndY: line1.endY,
            line2StartX: line2.startX,
            line2StartY: line2.startY,
            line2EndX: line2.endX,
            line2EndY: line2.endY
        };
    } catch (e) {
        console.error('获取平行线屏幕坐标失败:', e);
        return null;
    }
};

ParallelLineDrawing.prototype.extendLineToEdges = function(x1, y1, x2, y2, canvasWidth) {
    try {
        var dx = x2 - x1;
        var dy = y2 - y1;
        
        if (Math.abs(dx) < 0.001) {
            return { startX: x1, startY: 0, endX: x1, endY: this.chart.canvas.height };
        }
        
        var slope = dy / dx;
        
        var yLeft = y1 + slope * (0 - x1);
        var yRight = y1 + slope * (canvasWidth - x1);
        
        return { startX: 0, startY: yLeft, endX: canvasWidth, endY: yRight };
    } catch (e) {
        console.error('延长线到边缘失败:', e);
        return { startX: 0, startY: 0, endX: 0, endY: 0 };
    }
};

ParallelLineDrawing.prototype.render = function(ctx) {
    try {
        for (var i = 0; i < this.lines.length; i++) { 
            this.drawParallelLine(ctx, this.lines[i]); 
        }
        if (this.currentLine) { 
            this.drawParallelLine(ctx, this.currentLine); 
        }
    } catch (e) {
        console.error('渲染平行线失败:', e);
    }
};

ParallelLineDrawing.prototype.drawParallelLine = function(ctx, line) {
    try {
        var coords = this.getParallelLineScreenCoords(line);
        if (!coords) return;
        
        ctx.lineWidth = line.lineWidth;
        ctx.lineCap = 'round';
        
        // 画第一条线（基准线）
        ctx.strokeStyle = this.hexToRgba(line.color, line.opacity);
        ctx.beginPath();
        ctx.moveTo(coords.line1StartX, coords.line1StartY);
        ctx.lineTo(coords.line1EndX, coords.line1EndY);
        ctx.stroke();
        
        // 如果有第二条线（即有point2），画第二条线
        if (line.point2) {
            var line2Color = line.color;
            if (this.currentLine === line && this.step === 2) {
                line2Color = '#ff9800';
            }
            ctx.strokeStyle = this.hexToRgba(line2Color, line.opacity);
            ctx.beginPath();
            ctx.moveTo(coords.line2StartX, coords.line2StartY);
            ctx.lineTo(coords.line2EndX, coords.line2EndY);
            ctx.stroke();
        }
    } catch (e) {
        console.error('绘制平行线失败:', e);
    }
};

ParallelLineDrawing.prototype.hexToRgba = function(hex, alpha) {
    try {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } catch (e) {
        console.error('颜色转换失败:', e);
        return 'rgba(38, 198, 218, 1)';
    }
};

ParallelLineDrawing.prototype.save = function(stockCode, period) {
    try {
        var key = 'parallellines_' + stockCode + '_' + period;
        localStorage.setItem(key, JSON.stringify(this.lines));
    } catch (e) {
        console.error('保存平行线数据失败:', e);
    }
};

ParallelLineDrawing.prototype.load = function(stockCode, period) {
    try {
        var key = 'parallellines_' + stockCode + '_' + period;
        var data = localStorage.getItem(key);
        if (data) { this.lines = JSON.parse(data); } else { this.lines = []; }
    } catch (e) {
        console.error('加载平行线数据失败:', e);
        this.lines = [];
    }
};

ParallelLineDrawing.prototype.reset = function() {
    try {
        this.lines = []; this.resetDrawing(); this.selectedLine = null;
    } catch (e) {
        console.error('重置平行线失败:', e);
    }
};

ParallelLineDrawing.prototype.clear = function(stockCode, period) {
    try {
        this.lines = []; this.save(stockCode, period);
    } catch (e) {
        console.error('清除平行线失败:', e);
    }
};

ParallelLineDrawing.prototype.clearAll = function() {
    try {
        this.lines = []; this.save(this.chart.currentStockCode, this.chart.currentPeriod);
    } catch (e) {
        console.error('清除所有平行线失败:', e);
    }
};
