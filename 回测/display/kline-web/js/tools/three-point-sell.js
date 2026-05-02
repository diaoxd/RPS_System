// 三点卖出功能模块
function ThreePointSell(klineChart) {
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

ThreePointSell.prototype.init = function() {
    this.createContextMenu();
};

// 创建右键菜单
ThreePointSell.prototype.createContextMenu = function() {
    var self = this;
    
    // 创建菜单容器
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'three-point-sell-context-menu';
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
    deleteOption.style.color = '#22c55e';
    deleteOption.style.fontSize = '14px';
    deleteOption.style.userSelect = 'none';
    deleteOption.textContent = '删除三卖画线';
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
ThreePointSell.prototype.showContextMenu = function(x, y, dataIndex) {
    console.log('ThreePointSell showContextMenu called, x:', x, 'y:', y, 'dataIndex:', dataIndex);
    this.selectedDataIndex = dataIndex;
    this.contextMenu.style.left = x + 'px';
    this.contextMenu.style.top = y + 'px';
    this.contextMenu.style.display = 'block';
    console.log('ThreePointSell context menu displayed');
};

// 隐藏右键菜单
ThreePointSell.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.selectedDataIndex = null;
};

// 删除选中的数据
ThreePointSell.prototype.deleteSelected = function() {
    if (this.selectedDataIndex === null) {
        return;
    }
    
    this.deleteDataAt(this.selectedDataIndex);
    this.selectedDataIndex = null;
};

// 删除指定索引的数据
ThreePointSell.prototype.deleteDataAt = function(index) {
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
    var storageKey = 'threePointSell_' + stockCode + '_' + period;
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
    console.log('三点卖出数据已删除');
};

// 碰撞检测：检测鼠标是否在指定数据的连接线上
ThreePointSell.prototype.hitTest = function(mouseX, mouseY) {
    console.log('ThreePointSell hitTest called, mouseX:', mouseX, 'mouseY:', mouseY);
    console.log('ThreePointSell allData length:', this.allData ? this.allData.length : 0);
    
    if (!this.allData || this.allData.length === 0) {
        console.log('ThreePointSell no data, returning null');
        return null;
    }
    
    for (var i = 0; i < this.allData.length; i++) {
        console.log('ThreePointSell checking data index:', i);
        if (this.isMouseOnLine(mouseX, mouseY, this.allData[i])) {
            console.log('ThreePointSell hit at index:', i);
            return i;
        }
    }
    
    console.log('ThreePointSell no hit');
    return null;
};

// 检测鼠标是否在指定数据的连接线上
ThreePointSell.prototype.isMouseOnLine = function(mouseX, mouseY, data) {
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
    
    var lowCandlePos = this.getCandleCanvasPosition(points[0].candleIndex);
    var highCandlePos = this.getCandleCanvasPosition(points[1].candleIndex);
    
    var x1 = lowCandlePos.centerX;
    var y1 = lowCandlePos.priceToY(points[0].price);
    var x2 = highCandlePos.centerX;
    var y2 = highCandlePos.priceToY(points[1].price);
    
    // 计算点到线段的距离（低点到高点）
    var distance1 = this.pointToSegmentDistance(mouseX, mouseY, x1, y1, x2, y2);
    
    // 检查高点到次低点的线段
    var distance2 = Infinity;
    if (points[2] && points[2].candle) {
        var subLowCandlePos = this.getCandleCanvasPosition(points[2].candleIndex);
        var x3 = subLowCandlePos.centerX;
        var y3 = subLowCandlePos.priceToY(points[2].price);
        distance2 = this.pointToSegmentDistance(mouseX, mouseY, x2, y2, x3, y3);
    }
    
    var tolerance = 8; // 容差范围，像素
    
    return distance1 <= tolerance || distance2 <= tolerance;
};

// 计算点到线段的距离
ThreePointSell.prototype.pointToSegmentDistance = function(px, py, x1, y1, x2, y2) {
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

ThreePointSell.prototype.reset = function() {
    this.points = [];
    this.keyPoints = null;
    this.allData = [];
};

ThreePointSell.prototype.isComplete = function() {
    return this.points.length === this.maxPoints;
};

ThreePointSell.prototype.addPoint = function(canvasX, canvasY) {
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
    } else if (pointIndex === 1) {
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
        
        if (this.points[0].price >= price) {
            throw new Error('低点价格必须低于高点价格');
        }
    } else if (pointIndex === 2) {
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
        
        if (this.points[1].price <= price) {
            throw new Error('高点价格必须高于次低点价格');
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

ThreePointSell.prototype.findNearestCandleIndex = function(canvasX) {
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

ThreePointSell.prototype.getCandleCanvasPosition = function(candleIndex) {
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

ThreePointSell.prototype.priceToCanvasY = function(price) {
    return this.klineChart.priceToCanvasY(price);
};

ThreePointSell.prototype.calculateKeyPoints = function() {
    var lowPoint = this.points[0];
    var highPoint = this.points[1];
    var subLowPoint = this.points[2];
    
    var highPrice = highPoint.price;
    var lowPrice = lowPoint.price;
    var subLowPrice = subLowPoint.price;
    
    var BA_ratio = highPrice / lowPrice;
    var sqrt_BA = Math.sqrt(BA_ratio);
    var sqrt_sqrt_BA = Math.sqrt(sqrt_BA);
    
    var S1 = highPrice / sqrt_sqrt_BA;
    var S2 = highPrice / sqrt_BA;
    var S3 = highPrice / (sqrt_sqrt_BA + sqrt_BA - 1);
    
    var AM = highPrice + (highPrice - lowPrice);
    var BM = Math.round((AM - subLowPrice) / 7.3 * 1000) / 1000;
    
    var D1 = 2 * highPrice - lowPrice - (S2 - S3);
    var D2 = AM;
    var D3 = 2 * highPrice - lowPrice + (S1 - S2);
    
    return {
        BA_ratio: BA_ratio,
        sqrt_BA: sqrt_BA,
        sqrt_sqrt_BA: sqrt_sqrt_BA,
        S1: S1,
        S2: S2,
        S3: S3,
        AM: AM,
        BM: BM,
        D1: { price: D1, description: 'D1' },
        D2: { price: D2, description: 'D2' },
        D3: { price: D3, description: 'D3' }
    };
};

ThreePointSell.prototype.render = function(ctx) {
    if (this.points.length === 0) {
        return;
    }
    
    this.drawPointMarkers(ctx);
    
    if (this.isComplete()) {
        this.drawConnectingLines(ctx);
        this.drawVerticalLine(ctx);
        this.drawPressureLines(ctx);
    }
};

ThreePointSell.prototype.renderAll = function(ctx) {
    if (!this.allData || this.allData.length === 0) {
        return;
    }
    
    for (var i = 0; i < this.allData.length; i++) {
        this.renderSingleData(ctx, this.allData[i], i);
    }
};

ThreePointSell.prototype.renderSingleData = function(ctx, data, index) {
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
    this.drawPressureLinesForData(ctx, points, keyPoints);
};

ThreePointSell.prototype.findCandleIndexByTimestamp = function(timestamp) {
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
    
    console.log('未找到匹配的K线，timestamp:', timestamp, '第一条K线day:', candles[0] ? candles[0].day : undefined, '最后一条K线day:', candles[candles.length - 1] ? candles[candles.length - 1].day : undefined);
    return -1;
};

ThreePointSell.prototype.drawPointMarkersForData = function(ctx, points, index) {
    var colors = ['#66bb6a', '#ef5350', '#66bb6a'];
    var labels = ['低点', '高点', '次低点'];
    
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

ThreePointSell.prototype.drawConnectingLinesForData = function(ctx, points) {
    if (points.length < 2) {
        return;
    }
    
    var lowPoint = points[0];
    var highPoint = points[1];
    var subLowPoint = points[2];
    
    if (!lowPoint.candle || !highPoint.candle) {
        return;
    }
    
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    
    var lowX = lowCandlePos.centerX;
    var lowY = lowCandlePos.priceToY(lowPoint.price);
    var highX = highCandlePos.centerX;
    var highY = highCandlePos.priceToY(highPoint.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#4caf50';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.moveTo(lowX, lowY);
    ctx.lineTo(highX, highY);
    ctx.stroke();
    
    if (subLowPoint && subLowPoint.candle) {
        var subLowCandlePos = this.getCandleCanvasPosition(subLowPoint.candleIndex);
        var subLowX = subLowCandlePos.centerX;
        var subLowY = subLowCandlePos.priceToY(subLowPoint.price);
        
        ctx.beginPath();
        ctx.strokeStyle = '#4caf50';
        ctx.setLineDash([]);
        ctx.lineWidth = 3;
        ctx.moveTo(highX, highY);
        ctx.lineTo(subLowX, subLowY);
        ctx.stroke();
    }
};

ThreePointSell.prototype.drawVerticalLineForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.D1 || !keyPoints.D2 || !keyPoints.D3 || points.length < 3) {
        return;
    }
    
    var subLowPoint = points[2];
    
    if (!subLowPoint.candle) {
        return;
    }
    
    var subLowCandlePos = this.getCandleCanvasPosition(subLowPoint.candleIndex);
    
    var subLowX = subLowCandlePos.centerX;
    var subLowY = subLowCandlePos.priceToY(subLowPoint.price);
    
    var maxDPrice = Math.max.apply(Math, [keyPoints.D1.price, keyPoints.D2.price, keyPoints.D3.price]);
    var maxDY = this.priceToCanvasY(maxDPrice);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.moveTo(subLowX, subLowY);
    ctx.lineTo(subLowX, maxDY);
    ctx.stroke();
    ctx.setLineDash([]);
};

ThreePointSell.prototype.drawPressureLinesForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.D1 || !keyPoints.D2 || !keyPoints.D3 || points.length < 3) {
        return;
    }
    
    var subLowPoint = points[2];
    
    if (!subLowPoint.candle) {
        return;
    }
    
    var dashD1 = [5, 10];
    var dashD2 = [10, 8];
    var dashD3 = [15, 5];
    
    var colors = {
        D1: '#ef5350',
        D2: '#e53935',
        D3: '#c62828'
    };
    
    var subLowCandlePos = this.getCandleCanvasPosition(subLowPoint.candleIndex);
    var subLowX = subLowCandlePos.centerX;
    var canvasWidth = this.klineChart.canvas.width;
    
    var lengthD1 = 300;
    var lengthD2 = 500;
    var lengthD3 = 700;
    
    var d1Y = this.priceToCanvasY(keyPoints.D1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D1;
    ctx.setLineDash(dashD1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subLowX, d1Y);
    ctx.lineTo(subLowX + lengthD1, d1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.D1.price, keyPoints.D1.description, subLowX - 10, d1Y, 'right', 'default', colors.D1);
    
    var d2Y = this.priceToCanvasY(keyPoints.D2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D2;
    ctx.setLineDash(dashD2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subLowX, d2Y);
    ctx.lineTo(subLowX + lengthD2, d2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.D2.price, keyPoints.D2.description, subLowX - 10, d2Y, 'right', 'default', colors.D2);
    
    var d3Y = this.priceToCanvasY(keyPoints.D3.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D3;
    ctx.setLineDash(dashD3);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subLowX, d3Y);
    ctx.lineTo(subLowX + lengthD3, d3Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.D3.price, keyPoints.D3.description, subLowX - 10, d3Y, 'right', 'default', colors.D3);
};

ThreePointSell.prototype.drawPointMarkers = function(ctx) {
    var colors = ['#66bb6a', '#ef5350', '#66bb6a'];
    var labels = ['低点', '高点', '次低点'];
    
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

ThreePointSell.prototype.drawConnectingLines = function(ctx) {
    if (this.points.length < 2) {
        return;
    }
    
    var lowPoint = this.points[0];
    var highPoint = this.points[1];
    var subLowPoint = this.points[2];
    
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    
    var lowX = lowCandlePos.centerX;
    var lowY = lowCandlePos.priceToY(lowPoint.price);
    var highX = highCandlePos.centerX;
    var highY = highCandlePos.priceToY(highPoint.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#4caf50';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.moveTo(lowX, lowY);
    ctx.lineTo(highX, highY);
    ctx.stroke();
    
    if (subLowPoint) {
        var subLowCandlePos = this.getCandleCanvasPosition(subLowPoint.candleIndex);
        var subLowX = subLowCandlePos.centerX;
        var subLowY = subLowCandlePos.priceToY(subLowPoint.price);
        
        ctx.beginPath();
        ctx.strokeStyle = '#4caf50';
        ctx.setLineDash([]);
        ctx.lineWidth = 3;
        ctx.moveTo(highX, highY);
        ctx.lineTo(subLowX, subLowY);
        ctx.stroke();
    }
};

ThreePointSell.prototype.drawVerticalLine = function(ctx) {
    if (!this.keyPoints || !this.keyPoints.D1 || !this.keyPoints.D2 || !this.keyPoints.D3 || this.points.length < 3) {
        return;
    }
    
    var subLowPoint = this.points[2];
    var subLowCandlePos = this.getCandleCanvasPosition(subLowPoint.candleIndex);
    
    var subLowX = subLowCandlePos.centerX;
    var subLowY = subLowCandlePos.priceToY(subLowPoint.price);
    
    var maxDPrice = Math.max.apply(Math, [this.keyPoints.D1.price, this.keyPoints.D2.price, this.keyPoints.D3.price]);
    var maxDY = this.priceToCanvasY(maxDPrice);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.moveTo(subLowX, subLowY);
    ctx.lineTo(subLowX, maxDY);
    ctx.stroke();
    ctx.setLineDash([]);
};

ThreePointSell.prototype.drawPressureLines = function(ctx) {
    if (!this.keyPoints || !this.keyPoints.D1 || !this.keyPoints.D2 || !this.keyPoints.D3 || this.points.length < 3) {
        return;
    }
    
    var dashD1 = [5, 10];
    var dashD2 = [10, 8];
    var dashD3 = [15, 5];
    
    var colors = {
        D1: '#ef5350',
        D2: '#e53935',
        D3: '#c62828'
    };
    
    var subLowPoint = this.points[2];
    var subLowCandlePos = this.getCandleCanvasPosition(subLowPoint.candleIndex);
    var subLowX = subLowCandlePos.centerX;
    var canvasWidth = this.klineChart.canvas.width;
    
    var lengthD1 = 300;
    var lengthD2 = 500;
    var lengthD3 = 700;
    
    var d1Y = this.priceToCanvasY(this.keyPoints.D1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D1;
    ctx.setLineDash(dashD1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subLowX, d1Y);
    ctx.lineTo(subLowX + lengthD1, d1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.D1.price, this.keyPoints.D1.description, subLowX - 10, d1Y, 'right', 'default', colors.D1);
    
    var d2Y = this.priceToCanvasY(this.keyPoints.D2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D2;
    ctx.setLineDash(dashD2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subLowX, d2Y);
    ctx.lineTo(subLowX + lengthD2, d2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.D2.price, this.keyPoints.D2.description, subLowX - 10, d2Y, 'right', 'default', colors.D2);
    
    var d3Y = this.priceToCanvasY(this.keyPoints.D3.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D3;
    ctx.setLineDash(dashD3);
    ctx.lineWidth = 1.5;
    ctx.moveTo(subLowX, d3Y);
    ctx.lineTo(subLowX + lengthD3, d3Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.D3.price, this.keyPoints.D3.description, subLowX - 10, d3Y, 'right', 'default', colors.D3);
};

ThreePointSell.prototype.drawLabel = function(ctx, price, description, x, y, align, type, color) {
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
    
    if (type === 'D2-above') {
        textY = Math.max(y - 20, 20);
    } else if (type === 'D2-below') {
        textY = Math.min(y + 10, this.klineChart.currentMainChartHeight - 10);
    } else if (type === 'D1-above') {
        textY = Math.max(y - 10, 20);
    } else if (type === 'D1-below') {
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

ThreePointSell.prototype.displayResults = function() {
    if (!this.keyPoints) {
        return;
    }
    
    var results = '三点卖出计算结果：低点:' + this.points[0].price.toFixed(2) + ',高点:' + this.points[1].price.toFixed(2) + ',次低点:' + this.points[2].price.toFixed(2) + ',BA_ratio:' + this.keyPoints.BA_ratio.toFixed(4) + ',sqrt_BA:' + this.keyPoints.sqrt_BA.toFixed(4) + ',sqrt_sqrt_BA:' + this.keyPoints.sqrt_sqrt_BA.toFixed(4) + ',S1:' + this.keyPoints.S1.toFixed(2) + ',S2:' + this.keyPoints.S2.toFixed(2) + ',S3:' + this.keyPoints.S3.toFixed(2) + ',AM:' + this.keyPoints.AM.toFixed(2) + ',BM:' + this.keyPoints.BM.toFixed(3) + ',D1:' + this.keyPoints.D1.price.toFixed(2) + ',D2:' + this.keyPoints.D2.price.toFixed(2) + ',D3:' + this.keyPoints.D3.price.toFixed(2);
    
    console.log(results);
};

ThreePointSell.prototype.save = function(stockCode, period) {
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
            BA_ratio: this.keyPoints.BA_ratio,
            sqrt_BA: this.keyPoints.sqrt_BA,
            sqrt_sqrt_BA: this.keyPoints.sqrt_sqrt_BA,
            S1: this.keyPoints.S1,
            S2: this.keyPoints.S2,
            S3: this.keyPoints.S3,
            AM: this.keyPoints.AM,
            BM: this.keyPoints.BM,
            D1: this.keyPoints.D1,
            D2: this.keyPoints.D2,
            D3: this.keyPoints.D3
        }
    };
    
    var storageKey = 'threePointSell_' + stockCode + '_' + period;
    var existingDataStr = localStorage.getItem(storageKey);
    var allData = [];
    
    if (existingDataStr) {
        var parsedData = JSON.parse(existingDataStr);
        allData = Array.isArray(parsedData) ? parsedData : [parsedData];
    }
    
    allData.push(newData);
    localStorage.setItem(storageKey, JSON.stringify(allData));
    console.log('三点卖出数据已保存：', newData);
    
    this.reset();
};

ThreePointSell.prototype.load = function(stockCode, period) {
    var storageKey = 'threePointSell_' + stockCode + '_' + period;
    var dataStr = localStorage.getItem(storageKey);
    
    if (!dataStr) {
        this.allData = [];
        return;
    }
    
    var parsedData = JSON.parse(dataStr);
    this.allData = Array.isArray(parsedData) ? parsedData : [parsedData];
    console.log('三点卖出数据已加载：', this.allData);
};

ThreePointSell.prototype.clear = function(stockCode, period) {
    var storageKey = 'threePointSell_' + stockCode + '_' + period;
    localStorage.removeItem(storageKey);
    this.allData = [];
    this.reset();
    console.log('三点卖出数据已清除');
};

// 检测鼠标是否在小圆点上
ThreePointSell.prototype.hitTestPoint = function(mouseX, mouseY) {
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
ThreePointSell.prototype.startDrag = function(mouseX, mouseY) {
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
ThreePointSell.prototype.onDrag = function(mouseX, mouseY) {
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
    } else if (this.draggingPointIndex === 1) {
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
    } else if (this.draggingPointIndex === 2) {
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
ThreePointSell.prototype.endDrag = function() {
    if (!this.isDragging) {
        return;
    }

    if (this.draggingDataIndex !== null && this.allData[this.draggingDataIndex]) {
        var data = this.allData[this.draggingDataIndex];
        var stockCode = data.stockCode;
        var period = data.period;

        var storageKey = 'threePointSell_' + stockCode + '_' + period;
        localStorage.setItem(storageKey, JSON.stringify(this.allData));
    }

    this.isDragging = false;
    this.draggingDataIndex = null;
    this.draggingPointIndex = null;
};

// 从点数据计算关键点
ThreePointSell.prototype.calculateKeyPointsFromPoints = function(points) {
    var lowPoint = points[0];
    var highPoint = points[1];
    var subLowPoint = points[2];
    
    var highPrice = highPoint.price;
    var lowPrice = lowPoint.price;
    var subLowPrice = subLowPoint.price;
    
    var BA_ratio = highPrice / lowPrice;
    var sqrt_BA = Math.sqrt(BA_ratio);
    var sqrt_sqrt_BA = Math.sqrt(sqrt_BA);
    
    var S1 = highPrice / sqrt_sqrt_BA;
    var S2 = highPrice / sqrt_BA;
    var S3 = highPrice / (sqrt_sqrt_BA + sqrt_BA - 1);
    
    var AM = highPrice + (highPrice - lowPrice);
    var BM = Math.round((AM - subLowPrice) / 7.3 * 1000) / 1000;
    
    var D1 = 2 * highPrice - lowPrice - (S2 - S3);
    var D2 = AM;
    var D3 = 2 * highPrice - lowPrice + (S1 - S2);
    
    return {
        BA_ratio: BA_ratio,
        sqrt_BA: sqrt_BA,
        sqrt_sqrt_BA: sqrt_sqrt_BA,
        S1: S1,
        S2: S2,
        S3: S3,
        AM: AM,
        BM: BM,
        D1: { price: D1, description: 'D1' },
        D2: { price: D2, description: 'D2' },
        D3: { price: D3, description: 'D3' }
    };
};
