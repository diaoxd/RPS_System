// 三点买入功能模块
function ThreePointBuy(klineChart) {
    this.klineChart = klineChart;
    this.points = [];
    this.maxPoints = 3;
    this.keyPoints = null;
    this.allData = [];
    
    // 右键菜单相关
    this.contextMenu = null;
    this.selectedDataIndex = null;
    
    // 拖拽相关
    this.isDragging = false;
    this.draggingDataIndex = null;
    this.draggingPointIndex = null;
    
    this.init();
}

ThreePointBuy.prototype.init = function() {
    this.createContextMenu();
};

// 创建右键菜单
ThreePointBuy.prototype.createContextMenu = function() {
    var self = this;
    
    // 创建菜单容器
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'three-point-buy-context-menu';
    this.contextMenu.style.position = 'fixed';
    this.contextMenu.style.backgroundColor = '#1f2937';
    this.contextMenu.style.border = '1px solid #4B5563';
    this.contextMenu.style.borderRadius = '4px';
    this.contextMenu.style.padding = '4px 0';
    this.contextMenu.style.zIndex = '4000';
    this.contextMenu.style.display = 'none';
    this.contextMenu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
    this.contextMenu.style.minWidth = '100px';
    
    // 创建删除选项
    var deleteOption = document.createElement('div');
    deleteOption.style.padding = '8px 16px';
    deleteOption.style.cursor = 'pointer';
    deleteOption.style.color = '#ef5350';
    deleteOption.style.fontSize = '14px';
    deleteOption.style.userSelect = 'none';
    deleteOption.textContent = '删除三买画线';
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
    
    this.contextMenu.appendChild(deleteOption);
    document.body.appendChild(this.contextMenu);
    
    // 点击其他地方隐藏菜单
    document.addEventListener('click', function(e) {
        if (self.contextMenu.style.display === 'block') {
            if (!self.contextMenu.contains(e.target)) {
                self.hideContextMenu();
            }
        }
    });
};

// 显示右键菜单
ThreePointBuy.prototype.showContextMenu = function(x, y, dataIndex) {
    console.log('ThreePointBuy showContextMenu called, x:', x, 'y:', y, 'dataIndex:', dataIndex);
    this.selectedDataIndex = dataIndex;
    this.contextMenu.style.left = x + 'px';
    this.contextMenu.style.top = y + 'px';
    this.contextMenu.style.display = 'block';
    console.log('ThreePointBuy context menu displayed');
};

// 隐藏右键菜单
ThreePointBuy.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.selectedDataIndex = null;
};

// 删除选中的数据
ThreePointBuy.prototype.deleteSelected = function() {
    if (this.selectedDataIndex === null) {
        return;
    }
    
    this.deleteDataAt(this.selectedDataIndex);
    this.selectedDataIndex = null;
};

// 删除指定索引的数据
ThreePointBuy.prototype.deleteDataAt = function(index) {
    if (index < 0 || index >= this.allData.length) {
        return;
    }
    
    var data = this.allData[index];
    if (!data) {
        return;
    }
    
    var stockCode = data.stockCode;
    var period = data.period;
    
    // 从内存中删除
    this.allData.splice(index, 1);
    
    // 从localStorage中删除
    var storageKey = 'threePointBuy_' + stockCode + '_' + period;
    var existingDataStr = localStorage.getItem(storageKey);
    if (existingDataStr) {
        var allData = JSON.parse(existingDataStr);
        if (Array.isArray(allData)) {
            allData.splice(index, 1);
            if (allData.length === 0) {
                localStorage.removeItem(storageKey);
            } else {
                localStorage.setItem(storageKey, JSON.stringify(allData));
            }
        } else {
            localStorage.removeItem(storageKey);
        }
    }
    
    this.klineChart.renderAll();
    console.log('三点买入数据已删除');
};

// 碰撞检测：检测鼠标是否在指定数据的连接线上
ThreePointBuy.prototype.hitTest = function(mouseX, mouseY) {
    console.log('ThreePointBuy hitTest called, mouseX:', mouseX, 'mouseY:', mouseY);
    console.log('ThreePointBuy allData length:', this.allData ? this.allData.length : 0);
    
    if (!this.allData || this.allData.length === 0) {
        console.log('ThreePointBuy no data, returning null');
        return null;
    }
    
    for (var i = 0; i < this.allData.length; i++) {
        console.log('ThreePointBuy checking data index:', i);
        if (this.isMouseOnLine(mouseX, mouseY, this.allData[i])) {
            console.log('ThreePointBuy hit at index:', i);
            return i;
        }
    }
    
    console.log('ThreePointBuy no hit');
    return null;
};

// 检测鼠标是否在指定数据的连接线上
ThreePointBuy.prototype.isMouseOnLine = function(mouseX, mouseY, data) {
    var self = this;
    var points = [];
    
    for (var i = 0; i < data.points.length; i++) {
        var p = data.points[i];
        var candleIndex;
        
        if (p.candleTimestamp) {
            candleIndex = self.findCandleIndexByTimestamp(p.candleTimestamp);
        } else {
            candleIndex = p.candleIndex;
        }
        
        points.push({
            candleIndex: candleIndex,
            price: p.price,
            candle: candleIndex !== -1 && candleIndex !== undefined ? self.klineChart.candles[candleIndex] : null
        });
    }
    
    if (!points[0] || !points[1] || !points[0].candle || !points[1].candle) {
        return false;
    }
    
    var highCandlePos = this.getCandleCanvasPosition(points[0].candleIndex);
    var lowCandlePos = this.getCandleCanvasPosition(points[1].candleIndex);
    
    var x1 = highCandlePos.centerX;
    var y1 = highCandlePos.priceToY(points[0].price);
    var x2 = lowCandlePos.centerX;
    var y2 = lowCandlePos.priceToY(points[1].price);
    
    // 计算点到线段的距离（高点到低点）
    var distance1 = this.pointToSegmentDistance(mouseX, mouseY, x1, y1, x2, y2);
    
    // 检查低点到次高点的线段
    var distance2 = Infinity;
    if (points[2] && points[2].candle) {
        var subHighCandlePos = this.getCandleCanvasPosition(points[2].candleIndex);
        var x3 = subHighCandlePos.centerX;
        var y3 = subHighCandlePos.priceToY(points[2].price);
        distance2 = this.pointToSegmentDistance(mouseX, mouseY, x2, y2, x3, y3);
    }
    
    var tolerance = 8; // 容差范围，像素
    
    return distance1 <= tolerance || distance2 <= tolerance;
};

// 计算点到线段的距离
ThreePointBuy.prototype.pointToSegmentDistance = function(px, py, x1, y1, x2, y2) {
    var A = px - x1;
    var B = py - y1;
    var C = x2 - x1;
    var D = y2 - y1;
    
    var dot = A * C + B * D;
    var lenSq = C * C + D * D;
    var param = -1;
    
    if (lenSq !== 0) {
        param = dot / lenSq;
    }
    
    var xx, yy;
    
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    var dx = px - xx;
    var dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
};

ThreePointBuy.prototype.reset = function() {
    this.points = [];
    this.keyPoints = null;
    this.allData = [];
};

ThreePointBuy.prototype.isComplete = function() {
    return this.points.length === this.maxPoints;
};

ThreePointBuy.prototype.addPoint = function(canvasX, canvasY) {
    if (this.points.length >= this.maxPoints) {
        throw new Error('已经取完三个点，请先清除');
    }
    
    var candleIndex = this.findNearestCandleIndex(canvasX);
    
    if (candleIndex === -1) {
        throw new Error('找不到K线数据');
    }
    
    var candles = this.klineChart.candles;
    var pointIndex = this.points.length;
    var targetCandleIndex;
    var price;
    
    if (pointIndex === 0) {
        var maxPrice = -Infinity;
        var maxIndex = candleIndex;
        
        for (var i = Math.max(0, candleIndex - 1); i <= Math.min(candles.length - 1, candleIndex + 1); i++) {
            if (candles[i].high > maxPrice) {
                maxPrice = candles[i].high;
                maxIndex = i;
            }
        }
        
        targetCandleIndex = maxIndex;
        price = maxPrice;
    } else if (pointIndex === 1) {
        var minPrice = Infinity;
        var minIndex = candleIndex;
        
        for (var i = Math.max(0, candleIndex - 1); i <= Math.min(candles.length - 1, candleIndex + 1); i++) {
            if (candles[i].low < minPrice) {
                minPrice = candles[i].low;
                minIndex = i;
            }
        }
        
        targetCandleIndex = minIndex;
        price = minPrice;
        
        if (this.points[0].price <= price) {
            throw new Error('高点价格必须高于低点价格');
        }
    } else if (pointIndex === 2) {
        var maxPrice = -Infinity;
        var maxIndex = candleIndex;
        
        for (var i = Math.max(0, candleIndex - 1); i <= Math.min(candles.length - 1, candleIndex + 1); i++) {
            if (candles[i].high > maxPrice) {
                maxPrice = candles[i].high;
                maxIndex = i;
            }
        }
        
        targetCandleIndex = maxIndex;
        price = maxPrice;
        
        if (this.points[1].price >= price) {
            throw new Error('低点价格必须低于次高点价格');
        }
    }
    
    this.points.push({
        candleIndex: targetCandleIndex,
        price: price,
        candle: candles[targetCandleIndex]
    });
    
    if (this.isComplete()) {
        this.keyPoints = this.calculateKeyPoints();
        this.klineChart.renderAll();
    }
};

ThreePointBuy.prototype.findNearestCandleIndex = function(canvasX) {
    var candles = this.klineChart.candles;
    if (!candles || candles.length === 0) {
        return -1;
    }
    
    var viewWidth = this.klineChart.canvas.width;
    var rightPadding = 45;
    var availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length;
    var candleWidth = baseCandleWidth * this.klineChart.scale;
    var offsetX = this.klineChart.offsetX;
    
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

ThreePointBuy.prototype.getCandleCanvasPosition = function(candleIndex) {
    var candles = this.klineChart.candles;
    var viewWidth = this.klineChart.canvas.width;
    var rightPadding = 45;
    var availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length;
    var candleWidth = baseCandleWidth * this.klineChart.scale;
    var offsetX = this.klineChart.offsetX;
    
    var centerX = candleIndex * candleWidth + offsetX + candleWidth / 2;
    
    var self = this;
    var priceToY = function(price) {
        return self.klineChart.priceToCanvasY(price);
    };
    
    return {
        centerX: centerX,
        priceToY: priceToY
    };
};

ThreePointBuy.prototype.priceToCanvasY = function(price) {
    return this.klineChart.priceToCanvasY(price);
};

ThreePointBuy.prototype.calculateKeyPoints = function() {
    var highPoint = this.points[0];
    var lowPoint = this.points[1];
    
    var highPrice = highPoint.price;
    var lowPrice = lowPoint.price;
    
    var XS = Math.sqrt(highPrice / lowPrice);
    var sqrtXS = Math.sqrt(XS);
    
    var C1 = lowPrice / sqrtXS;
    var C2 = lowPrice / XS;
    var C3 = lowPrice / (sqrtXS + XS - 1);
    
    return {
        XS: XS,
        sqrtXS: sqrtXS,
        C1: { price: C1, description: 'C1' },
        C2: { price: C2, description: 'C2' },
        C3: { price: C3, description: 'C3' }
    };
};

ThreePointBuy.prototype.render = function(ctx) {
    if (this.points.length === 0) {
        return;
    }
    
    this.drawPointMarkers(ctx);
    
    if (this.isComplete()) {
        this.drawConnectingLines(ctx);
        this.drawVerticalLine(ctx);
        this.drawSupportLines(ctx);
    }
};

ThreePointBuy.prototype.renderAll = function(ctx) {
    if (!this.allData || this.allData.length === 0) {
        return;
    }
    
    for (var i = 0; i < this.allData.length; i++) {
        this.renderSingleData(ctx, this.allData[i], i);
    }
};

ThreePointBuy.prototype.renderSingleData = function(ctx, data, index) {
    var points = [];
    for (var i = 0; i < data.points.length; i++) {
        var p = data.points[i];
        var candleIndex;
        
        if (p.candleTimestamp) {
            candleIndex = this.findCandleIndexByTimestamp(p.candleTimestamp);
        } else {
            candleIndex = p.candleIndex;
        }
        
        points.push({
            candleIndex: candleIndex,
            price: p.price,
            candle: candleIndex !== -1 && candleIndex !== undefined ? this.klineChart.candles[candleIndex] : null
        });
    }
    
    var keyPoints = data.keyPoints;
    
    this.drawPointMarkersForData(ctx, points, index);
    this.drawConnectingLinesForData(ctx, points);
    this.drawVerticalLineForData(ctx, points, keyPoints);
    this.drawSupportLinesForData(ctx, points, keyPoints);
};

ThreePointBuy.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.klineChart.candles;
    if (!candles || candles.length === 0) {
        return -1;
    }
    
    for (var i = 0; i < candles.length; i++) {
        var candleDay = candles[i].day;
        
        if (candleDay === timestamp) {
            return i;
        }
        
        if (String(candleDay) === String(timestamp)) {
            return i;
        }
        
        if (Number(candleDay) === Number(timestamp)) {
            return i;
        }
    }
    
    return -1;
};

ThreePointBuy.prototype.drawPointMarkersForData = function(ctx, points, index) {
    var colors = ['#ef5350', '#66bb6a', '#ef5350'];
    var labels = ['高点', '低点', '次高点'];
    
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        
        if (!point.candle) {
            continue;
        }
        
        var candlePos = this.getCandleCanvasPosition(point.candleIndex);
        
        var price = point.price;
        var x = candlePos.centerX;
        var y = candlePos.priceToY(price);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        var labelY = Math.max(y - 15, 20);
        ctx.fillText(labels[i], x, labelY);
        ctx.font = '15px Arial';
        var priceY = Math.min(y + 22, this.klineChart.currentMainChartHeight - 10);
        ctx.fillText(price.toFixed(2), x, priceY);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
};

ThreePointBuy.prototype.drawConnectingLinesForData = function(ctx, points) {
    if (points.length < 2) {
        return;
    }
    
    var highPoint = points[0];
    var lowPoint = points[1];
    var subHighPoint = points[2];
    
    if (!highPoint.candle || !lowPoint.candle) {
        return;
    }
    
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    
    var highX = highCandlePos.centerX;
    var highY = highCandlePos.priceToY(highPoint.price);
    var lowX = lowCandlePos.centerX;
    var lowY = lowCandlePos.priceToY(lowPoint.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9c27b0';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.moveTo(highX, highY);
    ctx.lineTo(lowX, lowY);
    ctx.stroke();
    
    if (subHighPoint && subHighPoint.candle) {
        var subHighCandlePos = this.getCandleCanvasPosition(subHighPoint.candleIndex);
        var subHighX = subHighCandlePos.centerX;
        var subHighY = subHighCandlePos.priceToY(subHighPoint.price);
        
        ctx.beginPath();
        ctx.strokeStyle = '#9c27b0';
        ctx.setLineDash([]);
        ctx.lineWidth = 3;
        ctx.moveTo(lowX, lowY);
        ctx.lineTo(subHighX, subHighY);
        ctx.stroke();
    }
};

ThreePointBuy.prototype.drawVerticalLineForData = function(ctx, points, keyPoints) {
    if (!keyPoints || points.length < 3) {
        return;
    }
    
    var subHighPoint = points[2];
    
    if (!subHighPoint.candle) {
        return;
    }
    
    var subHighCandlePos = this.getCandleCanvasPosition(subHighPoint.candleIndex);
    
    var subHighX = subHighCandlePos.centerX;
    var subHighY = subHighCandlePos.priceToY(subHighPoint.price);
    var c3Y = this.priceToCanvasY(keyPoints.C3.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.moveTo(subHighX, subHighY);
    ctx.lineTo(subHighX, c3Y);
    ctx.stroke();
    ctx.setLineDash([]);
};

ThreePointBuy.prototype.drawSupportLinesForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.C1 || !keyPoints.C2 || !keyPoints.C3 || points.length < 3) {
        return;
    }
    
    var subHighPoint = points[2];
    
    if (!subHighPoint.candle) {
        return;
    }
    
    var dashC1 = [5, 10];
    var dashC2 = [10, 8];
    var dashC3 = [15, 5];
    
    var colors = {
        C1: '#66bb6a',
        C2: '#4caf50',
        C3: '#2e7d32'
    };
    
    var subHighCandlePos = this.getCandleCanvasPosition(subHighPoint.candleIndex);
    var subHighX = subHighCandlePos.centerX;
    var canvasWidth = this.klineChart.canvas.width;
    
    var lengthC1 = 300;
    var lengthC2 = 500;
    var lengthC3 = 700;
    
    var c1Y = this.priceToCanvasY(keyPoints.C1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C1;
    ctx.setLineDash(dashC1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subHighX, c1Y);
    ctx.lineTo(subHighX + lengthC1, c1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.C1.price, keyPoints.C1.description, subHighX - 10, c1Y, 'right', 'default', colors.C1);
    
    var c2Y = this.priceToCanvasY(keyPoints.C2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C2;
    ctx.setLineDash(dashC2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subHighX, c2Y);
    ctx.lineTo(subHighX + lengthC2, c2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.C2.price, keyPoints.C2.description, subHighX - 10, c2Y, 'right', 'default', colors.C2);
    
    var c3Y = this.priceToCanvasY(keyPoints.C3.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C3;
    ctx.setLineDash(dashC3);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subHighX, c3Y);
    ctx.lineTo(subHighX + lengthC3, c3Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.C3.price, keyPoints.C3.description, subHighX - 10, c3Y, 'right', 'default', colors.C3);
};

ThreePointBuy.prototype.drawPointMarkers = function(ctx) {
    var colors = ['#ef5350', '#66bb6a', '#ef5350'];
    var labels = ['高点', '低点', '次高点'];
    
    for (var i = 0; i < this.points.length; i++) {
        var point = this.points[i];
        var candlePos = this.getCandleCanvasPosition(point.candleIndex);
        
        var price = point.price;
        var x = candlePos.centerX;
        var y = candlePos.priceToY(price);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        var labelY = Math.max(y - 15, 20);
        ctx.fillText(labels[i], x, labelY);
        ctx.font = '15px Arial';
        var priceY = Math.min(y + 22, this.klineChart.currentMainChartHeight - 10);
        ctx.fillText(price.toFixed(2), x, priceY);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
};

ThreePointBuy.prototype.drawConnectingLines = function(ctx) {
    if (this.points.length < 2) {
        return;
    }
    
    var highPoint = this.points[0];
    var lowPoint = this.points[1];
    var subHighPoint = this.points[2];
    
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    
    var highX = highCandlePos.centerX;
    var highY = highCandlePos.priceToY(highPoint.price);
    var lowX = lowCandlePos.centerX;
    var lowY = lowCandlePos.priceToY(lowPoint.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9c27b0';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.moveTo(highX, highY);
    ctx.lineTo(lowX, lowY);
    ctx.stroke();
    
    if (subHighPoint) {
        var subHighCandlePos = this.getCandleCanvasPosition(subHighPoint.candleIndex);
        var subHighX = subHighCandlePos.centerX;
        var subHighY = subHighCandlePos.priceToY(subHighPoint.price);
        
        ctx.beginPath();
        ctx.strokeStyle = '#9c27b0';
        ctx.setLineDash([]);
        ctx.lineWidth = 3;
        ctx.moveTo(lowX, lowY);
        ctx.lineTo(subHighX, subHighY);
        ctx.stroke();
    }
};

ThreePointBuy.prototype.drawVerticalLine = function(ctx) {
    if (!this.keyPoints || this.points.length < 3) {
        return;
    }
    
    var subHighPoint = this.points[2];
    var subHighCandlePos = this.getCandleCanvasPosition(subHighPoint.candleIndex);
    
    var subHighX = subHighCandlePos.centerX;
    var subHighY = subHighCandlePos.priceToY(subHighPoint.price);
    var c3Y = this.priceToCanvasY(this.keyPoints.C3.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.moveTo(subHighX, subHighY);
    ctx.lineTo(subHighX, c3Y);
    ctx.stroke();
    ctx.setLineDash([]);
};

ThreePointBuy.prototype.drawSupportLines = function(ctx) {
    if (!this.keyPoints || this.points.length < 3) {
        return;
    }
    
    var dashC1 = [5, 10];
    var dashC2 = [10, 8];
    var dashC3 = [15, 5];
    
    var colors = {
        C1: '#66bb6a',
        C2: '#4caf50',
        C3: '#2e7d32'
    };
    
    var subHighPoint = this.points[2];
    var subHighCandlePos = this.getCandleCanvasPosition(subHighPoint.candleIndex);
    var subHighX = subHighCandlePos.centerX;
    var canvasWidth = this.klineChart.canvas.width;
    
    var lengthC1 = 300;
    var lengthC2 = 500;
    var lengthC3 = 700;
    
    var c1Y = this.priceToCanvasY(this.keyPoints.C1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C1;
    ctx.setLineDash(dashC1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subHighX, c1Y);
    ctx.lineTo(subHighX + lengthC1, c1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.C1.price, this.keyPoints.C1.description, subHighX - 10, c1Y, 'right', 'default', colors.C1);
    
    var c2Y = this.priceToCanvasY(this.keyPoints.C2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C2;
    ctx.setLineDash(dashC2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subHighX, c2Y);
    ctx.lineTo(subHighX + lengthC2, c2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.C2.price, this.keyPoints.C2.description, subHighX - 10, c2Y, 'right', 'default', colors.C2);
    
    var c3Y = this.priceToCanvasY(this.keyPoints.C3.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C3;
    ctx.setLineDash(dashC3);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subHighX, c3Y);
    ctx.lineTo(subHighX + lengthC3, c3Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.C3.price, this.keyPoints.C3.description, subHighX - 10, c3Y, 'right', 'default', colors.C3);
};

ThreePointBuy.prototype.drawLabel = function(ctx, price, description, x, y, align, type, color) {
    if (type === undefined) {
        type = 'default';
    }
    if (color === undefined) {
        color = '#ffffff';
    }
    
    ctx.fillStyle = color;
    ctx.font = 'bold 15px Arial';
    ctx.textAlign = align;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    var textY = y;
    
    if (type === 'C2-above') {
        textY = Math.max(y - 20, 20);
    } else if (type === 'C2-below') {
        textY = Math.min(y + 10, this.klineChart.currentMainChartHeight - 10);
    } else if (type === 'callback-above') {
        textY = Math.max(y - 10, 20);
    } else if (type === 'callback-below') {
        textY = Math.min(y + 20, this.klineChart.currentMainChartHeight - 10);
    }
    
    if (align === 'right') {
        ctx.textAlign = 'right';
        ctx.fillText(description + ': ' + price.toFixed(2), x, textY);
    } else {
        ctx.textAlign = 'left';
        ctx.fillText(description + ': ' + price.toFixed(2), x, textY);
    }
    
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
};

ThreePointBuy.prototype.displayResults = function() {
    if (!this.keyPoints) {
        return;
    }
    
    var results = '三点买入计算结果：高点:' + this.points[0].price.toFixed(2) + ',低点:' + this.points[1].price.toFixed(2) + ',次高点:' + this.points[2].price.toFixed(2) + ',XS:' + this.keyPoints.XS.toFixed(4) + ',sqrtXS:' + this.keyPoints.sqrtXS.toFixed(4) + ',C1:' + this.keyPoints.C1.price.toFixed(2) + ',C2:' + this.keyPoints.C2.price.toFixed(2) + ',C3:' + this.keyPoints.C3.price.toFixed(2);
    
    console.log(results);
};

ThreePointBuy.prototype.save = function(stockCode, period) {
    if (!this.isComplete() || !this.keyPoints) {
        return;
    }
    
    var pointsData = [];
    for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        pointsData.push({
            candleIndex: p.candleIndex,
            price: p.price,
            date: p.candle.date,
            candleTimestamp: p.candle.day
        });
    }
    
    var newData = {
        timestamp: new Date().getTime(),
        stockCode: stockCode,
        period: period,
        points: pointsData,
        keyPoints: {
            XS: this.keyPoints.XS,
            sqrtXS: this.keyPoints.sqrtXS,
            C1: this.keyPoints.C1,
            C2: this.keyPoints.C2,
            C3: this.keyPoints.C3
        }
    };
    
    var storageKey = 'threePointBuy_' + stockCode + '_' + period;
    var existingDataStr = localStorage.getItem(storageKey);
    var allData = [];
    
    if (existingDataStr) {
        var parsedData = JSON.parse(existingDataStr);
        allData = Array.isArray(parsedData) ? parsedData : [parsedData];
    }
    
    allData.push(newData);
    localStorage.setItem(storageKey, JSON.stringify(allData));
    console.log('三点买入数据已保存：', newData);
    
    this.reset();
};

ThreePointBuy.prototype.load = function(stockCode, period) {
    var storageKey = 'threePointBuy_' + stockCode + '_' + period;
    var dataStr = localStorage.getItem(storageKey);
    
    if (!dataStr) {
        this.allData = [];
        return;
    }
    
    var parsedData = JSON.parse(dataStr);
    this.allData = Array.isArray(parsedData) ? parsedData : [parsedData];
    console.log('三点买入数据已加载：', this.allData);
};

ThreePointBuy.prototype.clear = function(stockCode, period) {
    var storageKey = 'threePointBuy_' + stockCode + '_' + period;
    localStorage.removeItem(storageKey);
    this.allData = [];
    this.reset();
    console.log('三点买入数据已清除');
};

// 检测鼠标是否在小圆点上
ThreePointBuy.prototype.hitTestPoint = function(mouseX, mouseY) {
    if (!this.allData || this.allData.length === 0) {
        return null;
    }

    for (var i = 0; i < this.allData.length; i++) {
        var data = this.allData[i];
        if (!data || !data.points) {
            continue;
        }

        for (var j = 0; j < data.points.length; j++) {
            var p = data.points[j];
            var candleIndex;

            if (p.candleTimestamp) {
                candleIndex = this.findCandleIndexByTimestamp(p.candleTimestamp);
            } else {
                candleIndex = p.candleIndex;
            }

            if (candleIndex === -1 || !this.klineChart.candles[candleIndex]) {
                continue;
            }

            var candlePos = this.getCandleCanvasPosition(candleIndex);
            var px = candlePos.centerX;
            var py = candlePos.priceToY(p.price);

            var dx = mouseX - px;
            var dy = mouseY - py;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= 10) {
                return {
                    dataIndex: i,
                    pointIndex: j
                };
            }
        }
    }

    return null;
};

// 开始拖拽
ThreePointBuy.prototype.startDrag = function(mouseX, mouseY) {
    var hit = this.hitTestPoint(mouseX, mouseY);
    if (hit) {
        this.isDragging = true;
        this.draggingDataIndex = hit.dataIndex;
        this.draggingPointIndex = hit.pointIndex;
        return true;
    }
    return false;
};

// 拖拽中
ThreePointBuy.prototype.onDrag = function(mouseX, mouseY) {
    if (!this.isDragging || this.draggingDataIndex === null || this.draggingPointIndex === null) {
        return;
    }

    var candleIndex = this.findNearestCandleIndex(mouseX);
    if (candleIndex === -1) {
        return;
    }

    var data = this.allData[this.draggingDataIndex];
    if (!data) {
        return;
    }

    var candles = this.klineChart.candles;
    var targetCandleIndex;
    var price;

    if (this.draggingPointIndex === 0) {
        var maxPrice = -Infinity;
        var maxIndex = candleIndex;
        
        for (var i = Math.max(0, candleIndex - 1); i <= Math.min(candles.length - 1, candleIndex + 1); i++) {
            if (candles[i].high > maxPrice) {
                maxPrice = candles[i].high;
                maxIndex = i;
            }
        }
        
        targetCandleIndex = maxIndex;
        price = maxPrice;
    } else if (this.draggingPointIndex === 1) {
        var minPrice = Infinity;
        var minIndex = candleIndex;
        
        for (var i = Math.max(0, candleIndex - 1); i <= Math.min(candles.length - 1, candleIndex + 1); i++) {
            if (candles[i].low < minPrice) {
                minPrice = candles[i].low;
                minIndex = i;
            }
        }
        
        targetCandleIndex = minIndex;
        price = minPrice;
    } else if (this.draggingPointIndex === 2) {
        var maxPrice = -Infinity;
        var maxIndex = candleIndex;
        
        for (var i = Math.max(0, candleIndex - 1); i <= Math.min(candles.length - 1, candleIndex + 1); i++) {
            if (candles[i].high > maxPrice) {
                maxPrice = candles[i].high;
                maxIndex = i;
            }
        }
        
        targetCandleIndex = maxIndex;
        price = maxPrice;
    }

    var targetCandle = candles[targetCandleIndex];

    data.points[this.draggingPointIndex] = {
        candleIndex: targetCandleIndex,
        candleTimestamp: targetCandle.day,
        price: price,
        date: targetCandle.date
    };

    var points = [];
    for (var k = 0; k < data.points.length; k++) {
        var p = data.points[k];
        var ci;
        if (p.candleTimestamp) {
            ci = this.findCandleIndexByTimestamp(p.candleTimestamp);
        } else {
            ci = p.candleIndex;
        }
        points.push({
            candleIndex: ci,
            price: p.price,
            candle: ci !== -1 && ci !== undefined ? this.klineChart.candles[ci] : null
        });
    }

    if (points[0] && points[1] && points[0].candle && points[1].candle) {
        data.keyPoints = this.calculateKeyPointsFromPoints(points);
    }

    this.klineChart.renderAll();
};

// 结束拖拽
ThreePointBuy.prototype.endDrag = function() {
    if (!this.isDragging) {
        return;
    }

    if (this.draggingDataIndex !== null && this.allData[this.draggingDataIndex]) {
        var data = this.allData[this.draggingDataIndex];
        var stockCode = data.stockCode;
        var period = data.period;

        var storageKey = 'threePointBuy_' + stockCode + '_' + period;
        localStorage.setItem(storageKey, JSON.stringify(this.allData));
    }

    this.isDragging = false;
    this.draggingDataIndex = null;
    this.draggingPointIndex = null;
};

// 从点数据计算关键点
ThreePointBuy.prototype.calculateKeyPointsFromPoints = function(points) {
    var highPoint = points[0];
    var lowPoint = points[1];
    
    var highPrice = highPoint.price;
    var lowPrice = lowPoint.price;
    
    var XS = Math.sqrt(highPrice / lowPrice);
    var sqrtXS = Math.sqrt(XS);
    
    var C1 = lowPrice / sqrtXS;
    var C2 = lowPrice / XS;
    var C3 = lowPrice / (sqrtXS + XS - 1);
    
    return {
        XS: XS,
        sqrtXS: sqrtXS,
        C1: { price: C1, description: 'C1' },
        C2: { price: C2, description: 'C2' },
        C3: { price: C3, description: 'C3' }
    };
};
