// 两点买入功能模块
function TwoPointBuy(klineChart) {
    this.klineChart = klineChart;
    this.points = [];
    this.maxPoints = 2;
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

// 初始化
TwoPointBuy.prototype.init = function() {
    this.createContextMenu();
};

// 创建右键菜单
TwoPointBuy.prototype.createContextMenu = function() {
    var self = this;
    
    // 创建菜单容器
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'two-point-buy-context-menu';
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
    deleteOption.textContent = '删除两买画线';
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
TwoPointBuy.prototype.showContextMenu = function(x, y, dataIndex) {
    console.log('TwoPointBuy showContextMenu called, x:', x, 'y:', y, 'dataIndex:', dataIndex);
    this.selectedDataIndex = dataIndex;
    
    // 确保菜单在视口内
    var menuWidth = 120;
    var menuHeight = 40;
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
    console.log('TwoPointBuy context menu displayed at', menuX, menuY);
};

// 隐藏右键菜单
TwoPointBuy.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.selectedDataIndex = null;
};

// 删除选中的画线
TwoPointBuy.prototype.deleteSelected = function() {
    if (this.selectedDataIndex === null) {
        return;
    }
    
    this.deleteDataAt(this.selectedDataIndex, this.klineChart.currentStockCode, this.klineChart.currentPeriod);
    this.klineChart.renderAll();
};

TwoPointBuy.prototype.reset = function() {
    this.points = [];
    this.keyPoints = null;
    this.allData = [];
};

TwoPointBuy.prototype.isComplete = function() {
    return this.points.length === this.maxPoints;
};

TwoPointBuy.prototype.addPoint = function(canvasX, canvasY) {
    if (this.points.length >= this.maxPoints) {
        throw new Error('已经取完两个点，请先清除');
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
            throw new Error('低点价格不能高于高点价格');
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

TwoPointBuy.prototype.findNearestCandleIndex = function(canvasX) {
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

TwoPointBuy.prototype.getCandleCanvasPosition = function(candleIndex) {
    var candles = this.klineChart.candles;
    var viewWidth = this.klineChart.canvas.width;
    var rightPadding = 45;
    var availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length;
    var candleWidth = baseCandleWidth * this.klineChart.scale;
    var offsetX = this.klineChart.offsetX;
    
    var centerX = candleIndex * candleWidth + offsetX + candleWidth / 2;
    
    var priceToY = function(price) {
        return this.klineChart.priceToCanvasY(price);
    }.bind(this);

    return {
        centerX: centerX,
        priceToY: priceToY
    };
};

TwoPointBuy.prototype.priceToCanvasY = function(price) {
    return this.klineChart.priceToCanvasY(price);
};

TwoPointBuy.prototype.calculateKeyPoints = function() {
    var lowPoint = this.points[0];
    var highPoint = this.points[1];
    
    var lowPrice = lowPoint.price;
    var highPrice = highPoint.price;
    
    var XS = Math.sqrt(highPrice / lowPrice);
    var sqrtXS = Math.sqrt(XS);
    
    var C1 = highPrice / sqrtXS;
    var C2 = highPrice / XS;
    var C3 = highPrice / (sqrtXS + XS - 1);
    
    var callbackPrice = highPrice - (highPrice - lowPrice) / 2;
    var supportPrice = (highPrice - lowPrice) / 3 + lowPrice;
    
    return {
        XS: XS,
        sqrtXS: sqrtXS,
        C1: { price: C1, description: 'C1' },
        C2: { price: C2, description: 'C2' },
        C3: { price: C3, description: 'C3' },
        callbackPrice: { price: callbackPrice, description: '回调位' },
        supportPrice: { price: supportPrice, description: '支撑位' }
    };
};

TwoPointBuy.prototype.render = function(ctx) {
    if (this.points.length === 0) {
        return;
    }

    this.drawPointMarkers(ctx);

    if (this.isComplete()) {
        this.drawConnectingLine(ctx);
        this.drawVerticalLine(ctx);
        this.drawSupportLines(ctx);
        this.drawCallbackAndSupportLines(ctx);
    }
};

TwoPointBuy.prototype.renderAll = function(ctx) {
    if (!this.allData || this.allData.length === 0) {
        return;
    }

    for (var i = 0; i < this.allData.length; i++) {
        this.renderSingleData(ctx, this.allData[i], i);
    }
};

TwoPointBuy.prototype.renderSingleData = function(ctx, data, index) {
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

    var keyPoints = data.keyPoints;

    this.drawPointMarkersForData(ctx, points, index);
    this.drawConnectingLineForData(ctx, points);
    this.drawVerticalLineForData(ctx, points, keyPoints);
    this.drawSupportLinesForData(ctx, points, keyPoints);
    this.drawCallbackAndSupportLinesForData(ctx, points, keyPoints);
};

TwoPointBuy.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var candles = this.klineChart.candles;
    if (!candles || candles.length === 0) {
        return -1;
    }

    for (var i = 0; i < candles.length; i++) {
        var candleDay = candles[i].day;
        
        // 尝试多种匹配方式，处理不同格式的时间戳
        if (candleDay === timestamp) {
            return i;
        }
        
        // 尝试字符串比较
        if (String(candleDay) === String(timestamp)) {
            return i;
        }
        
        // 尝试数字比较
        if (Number(candleDay) === Number(timestamp)) {
            return i;
        }
    }

    console.log('未找到匹配的K线，timestamp:', timestamp, '第一条K线day:', candles[0]?.day, '最后一条K线day:', candles[candles.length - 1]?.day);
    return -1;
};

TwoPointBuy.prototype.drawPointMarkersForData = function(ctx, points, index) {
    var colors = ['#66bb6a', '#ef5350'];
    var labels = ['低点', '高点'];

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

TwoPointBuy.prototype.drawConnectingLineForData = function(ctx, points) {
    if (points.length < 2) {
        return;
    }

    var lowPoint = points[0];
    var highPoint = points[1];
    
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
    ctx.strokeStyle = '#9c27b0';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.moveTo(lowX, lowY);
    ctx.lineTo(highX, highY);
    ctx.stroke();
};

TwoPointBuy.prototype.drawVerticalLineForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.C3 || points.length < 2) {
        return;
    }

    var highPoint = points[1];
    
    if (!highPoint.candle) {
        return;
    }
    
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    
    var highX = highCandlePos.centerX;
    var highY = highCandlePos.priceToY(highPoint.price);
    var c3Y = this.priceToCanvasY(keyPoints.C3.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.moveTo(highX, highY);
    ctx.lineTo(highX, c3Y);
    ctx.stroke();
    ctx.setLineDash([]);
};

TwoPointBuy.prototype.drawSupportLinesForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.C1 || !keyPoints.C2 || !keyPoints.C3 || points.length < 2) {
        return;
    }

    var highPoint = points[1];
    
    if (!highPoint.candle) {
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

    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    var highX = highCandlePos.centerX;
    var canvasWidth = this.klineChart.canvas.width;

    var lengthC1 = 300;
    var lengthC2 = 500;
    var lengthC3 = 700;

    var c1Y = this.priceToCanvasY(keyPoints.C1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C1;
    ctx.setLineDash(dashC1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, c1Y);
    ctx.lineTo(highX + lengthC1, c1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.C1.price, keyPoints.C1.description, highX - 10, c1Y, 'right');

    var c2Y = this.priceToCanvasY(keyPoints.C2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C2;
    ctx.setLineDash(dashC2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, c2Y);
    ctx.lineTo(highX + lengthC2, c2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    var c2Type = keyPoints.C2.price > keyPoints.callbackPrice.price ? 'C2-above' : 'C2-below';
    this.drawLabel(ctx, keyPoints.C2.price, keyPoints.C2.description, highX - 10, c2Y, 'right', c2Type);

    var c3Y = this.priceToCanvasY(keyPoints.C3.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C3;
    ctx.setLineDash(dashC3);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, c3Y);
    ctx.lineTo(highX + lengthC3, c3Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.C3.price, keyPoints.C3.description, highX - 10, c3Y, 'right');
};

TwoPointBuy.prototype.drawCallbackAndSupportLinesForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.callbackPrice || !keyPoints.supportPrice || !keyPoints.C2 || points.length < 2) {
        return;
    }

    var highPoint = points[1];
    
    if (!highPoint.candle) {
        return;
    }

    var dashCallback = [5, 10];
    var dashSupport = [10, 8];
    
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    var highX = highCandlePos.centerX;
    var canvasWidth = this.klineChart.canvas.width;

    var lengthCallback = 400;
    var lengthSupport = 600;

    var callbackColor = '#42a5f5';
    var callbackY = this.priceToCanvasY(keyPoints.callbackPrice.price);
    ctx.beginPath();
    ctx.strokeStyle = callbackColor;
    ctx.setLineDash(dashCallback);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, callbackY);
    ctx.lineTo(highX + lengthCallback, callbackY);
    ctx.stroke();
    ctx.setLineDash([]);
    var callbackType = keyPoints.callbackPrice.price > keyPoints.C2.price ? 'callback-above' : 'callback-below';
    this.drawLabel(ctx, keyPoints.callbackPrice.price, keyPoints.callbackPrice.description, highX - 10, callbackY, 'right', callbackType, callbackColor);

    var supportColor = '#2196f3';
    var supportY = this.priceToCanvasY(keyPoints.supportPrice.price);
    ctx.beginPath();
    ctx.strokeStyle = supportColor;
    ctx.setLineDash(dashSupport);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, supportY);
    ctx.lineTo(highX + lengthSupport, supportY);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.supportPrice.price, keyPoints.supportPrice.description, highX - 10, supportY, 'right', 'default', supportColor);
};

TwoPointBuy.prototype.drawPointMarkers = function(ctx) {
    var colors = ['#66bb6a', '#ef5350'];
    var labels = ['低点', '高点'];

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
        ctx.fillText(labels[i], x, y - 15);
        ctx.font = '15px Arial';
        ctx.fillText(price.toFixed(2), x, y + 22);
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }
};

TwoPointBuy.prototype.drawConnectingLine = function(ctx) {
    if (this.points.length < 2) {
        return;
    }

    var lowPoint = this.points[0];
    var highPoint = this.points[1];
    
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    
    var lowX = lowCandlePos.centerX;
    var lowY = lowCandlePos.priceToY(lowPoint.price);
    var highX = highCandlePos.centerX;
    var highY = highCandlePos.priceToY(highPoint.price);

    ctx.beginPath();
    ctx.strokeStyle = '#9c27b0';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.moveTo(lowX, lowY);
    ctx.lineTo(highX, highY);
    ctx.stroke();
};

TwoPointBuy.prototype.drawVerticalLine = function(ctx) {
    if (!this.keyPoints || this.points.length < 2) {
        return;
    }

    var highPoint = this.points[1];
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    
    var highX = highCandlePos.centerX;
    var highY = highCandlePos.priceToY(highPoint.price);
    var c3Y = this.priceToCanvasY(this.keyPoints.C3.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.moveTo(highX, highY);
    ctx.lineTo(highX, c3Y);
    ctx.stroke();
    ctx.setLineDash([]);
};

TwoPointBuy.prototype.drawSupportLines = function(ctx) {
    if (!this.keyPoints || this.points.length < 2) {
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

    var highPoint = this.points[1];
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    var highX = highCandlePos.centerX;
    var canvasWidth = this.klineChart.canvas.width;

    var lengthC1 = 300;
    var lengthC2 = 500;
    var lengthC3 = 700;

    var c1Y = this.priceToCanvasY(this.keyPoints.C1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C1;
    ctx.setLineDash(dashC1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, c1Y);
    ctx.lineTo(highX + lengthC1, c1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.C1.price, this.keyPoints.C1.description, highX - 10, c1Y, 'right', 'default', colors.C1);

    var c2Y = this.priceToCanvasY(this.keyPoints.C2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C2;
    ctx.setLineDash(dashC2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, c2Y);
    ctx.lineTo(highX + lengthC2, c2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    var c2Type = this.keyPoints.C2.price > this.keyPoints.callbackPrice.price ? 'C2-above' : 'C2-below';
    this.drawLabel(ctx, this.keyPoints.C2.price, this.keyPoints.C2.description, highX - 10, c2Y, 'right', c2Type, colors.C2);

    var c3Y = this.priceToCanvasY(this.keyPoints.C3.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.C3;
    ctx.setLineDash(dashC3);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, c3Y);
    ctx.lineTo(highX + lengthC3, c3Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.C3.price, this.keyPoints.C3.description, highX - 10, c3Y, 'right', 'default', colors.C3);
};

TwoPointBuy.prototype.drawCallbackAndSupportLines = function(ctx) {
    if (!this.keyPoints || this.points.length < 2) {
        return;
    }

    var dashCallback = [5, 10];
    var dashSupport = [10, 8];
    
    var highPoint = this.points[1];
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    var highX = highCandlePos.centerX;
    var canvasWidth = this.klineChart.canvas.width;

    var lengthCallback = 400;
    var lengthSupport = 600;

    var callbackColor = '#42a5f5';
    var callbackY = this.priceToCanvasY(this.keyPoints.callbackPrice.price);
    ctx.beginPath();
    ctx.strokeStyle = callbackColor;
    ctx.setLineDash(dashCallback);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, callbackY);
    ctx.lineTo(highX + lengthCallback, callbackY);
    ctx.stroke();
    ctx.setLineDash([]);
    var callbackType = this.keyPoints.callbackPrice.price > this.keyPoints.C2.price ? 'callback-above' : 'callback-below';
    this.drawLabel(ctx, this.keyPoints.callbackPrice.price, this.keyPoints.callbackPrice.description, highX - 10, callbackY, 'right', callbackType, callbackColor);

    var supportColor = '#2196f3';
    var supportY = this.priceToCanvasY(this.keyPoints.supportPrice.price);
    ctx.beginPath();
    ctx.strokeStyle = supportColor;
    ctx.setLineDash(dashSupport);
    ctx.lineWidth = 1.5;
    ctx.moveTo(highX, supportY);
    ctx.lineTo(highX + lengthSupport, supportY);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.supportPrice.price, this.keyPoints.supportPrice.description, highX - 10, supportY, 'right', 'default', supportColor);
};

TwoPointBuy.prototype.drawLabel = function(ctx, price, description, x, y, align, type, color) {
    if (!color) {
        color = '#ffffff';
    }
    ctx.fillStyle = color;
    ctx.font = 'bold 15px Arial';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    var textY = y - 5;
    
    if (type === 'C2-above') {
        textY = y - 20;
    } else if (type === 'C2-below') {
        textY = y + 10;
    } else if (type === 'callback-above') {
        textY = y - 10;
    } else if (type === 'callback-below') {
        textY = y + 20;
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

TwoPointBuy.prototype.displayResults = function() {
    if (!this.keyPoints) {
        return;
    }

    var results = '\n两点买入计算结果：\n━━━━━━━━━━━━━━━━━━━━\n低点价格：' + this.points[0].price.toFixed(2) + '元\n高点价格：' + this.points[1].price.toFixed(2) + '元\n━━━━━━━━━━━━━━━━━━━━\nXS = ' + this.keyPoints.XS.toFixed(4) + '\nsqrtXS = ' + this.keyPoints.sqrtXS.toFixed(4) + '\n━━━━━━━━━━━━━━━━━━━━\nC1（第一支撑位）= ' + this.keyPoints.C1.price.toFixed(2) + '元\nC2（第二支撑位）= ' + this.keyPoints.C2.price.toFixed(2) + '元\nC3（第三支撑位）= ' + this.keyPoints.C3.price.toFixed(2) + '元\n回调位 = ' + this.keyPoints.callbackPrice.price.toFixed(2) + '元\n支撑位 = ' + this.keyPoints.supportPrice.price.toFixed(2) + '元\n';
        
    console.log(results);
};

TwoPointBuy.prototype.save = function(stockCode, period) {
    if (!this.isComplete() || !this.keyPoints) {
        return;
    }

    var newData = {
        timestamp: new Date().getTime(),
        stockCode: stockCode,
        period: period,
        points: [],
        keyPoints: {
            XS: this.keyPoints.XS,
            sqrtXS: this.keyPoints.sqrtXS,
            C1: this.keyPoints.C1,
            C2: this.keyPoints.C2,
            C3: this.keyPoints.C3,
            callbackPrice: this.keyPoints.callbackPrice,
            supportPrice: this.keyPoints.supportPrice
        }
    };

    for (var i = 0; i < this.points.length; i++) {
        var p = this.points[i];
        newData.points.push({
            candleIndex: p.candleIndex,
            price: p.price,
            date: p.candle.date,
            candleTimestamp: p.candle.day
        });
    }

    var storageKey = 'twoPointBuy_' + stockCode + '_' + period;
    console.log('保存两买数据，storageKey：', storageKey);
    
    var existingDataStr = localStorage.getItem(storageKey);
    var allData = [];
    
    if (existingDataStr) {
        var parsedData = JSON.parse(existingDataStr);
        allData = Array.isArray(parsedData) ? parsedData : [parsedData];
    }
    
    allData.push(newData);
    localStorage.setItem(storageKey, JSON.stringify(allData));
    console.log('两点买入数据已保存：', newData);
    console.log('当前localStorage中所有两买数据：', this.getAllLocalStorageData());
    
    this.reset();
};

TwoPointBuy.prototype.getAllLocalStorageData = function() {
    var allData = {};
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.indexOf('twoPointBuy_') === 0) {
            allData[key] = localStorage.getItem(key);
        }
    }
    return allData;
};

TwoPointBuy.prototype.load = function(stockCode, period) {
    var storageKey = 'twoPointBuy_' + stockCode + '_' + period;
    console.log('加载两买数据，storageKey：', storageKey);
    
    var dataStr = localStorage.getItem(storageKey);
    
    if (!dataStr) {
        console.log('未找到保存的两点买入数据');
        this.allData = [];
        return;
    }

    try {
        var parsedData = JSON.parse(dataStr);
        this.allData = Array.isArray(parsedData) ? parsedData : [parsedData];
        console.log('两点买入数据已加载：', this.allData);
    } catch (error) {
        console.error('加载两点买入数据失败：', error);
        this.allData = [];
    }
};

TwoPointBuy.prototype.clear = function(stockCode, period) {
    var storageKey = 'twoPointBuy_' + stockCode + '_' + period;
    localStorage.removeItem(storageKey);
    this.allData = [];
    this.reset();
    console.log('已清除当前股票当前周期的两点买入数据');
};

// 删除指定索引的画线数据
TwoPointBuy.prototype.deleteDataAt = function(index, stockCode, period) {
    if (index < 0 || index >= this.allData.length) {
        console.error('删除失败，索引无效：', index);
        return false;
    }

    this.allData.splice(index, 1);

    var storageKey = 'twoPointBuy_' + stockCode + '_' + period;
    if (this.allData.length === 0) {
        localStorage.removeItem(storageKey);
    } else {
        localStorage.setItem(storageKey, JSON.stringify(this.allData));
    }

    console.log('已删除两点买入数据，索引：', index);
    return true;
};

// 碰撞检测：检测鼠标是否在指定数据的连接线上
TwoPointBuy.prototype.hitTest = function(mouseX, mouseY) {
    console.log('TwoPointBuy hitTest called, mouseX:', mouseX, 'mouseY:', mouseY);
    console.log('TwoPointBuy allData length:', this.allData ? this.allData.length : 0);
    
    if (!this.allData || this.allData.length === 0) {
        console.log('TwoPointBuy no data, returning null');
        return null;
    }

    for (var i = 0; i < this.allData.length; i++) {
        console.log('TwoPointBuy checking data index:', i);
        if (this.isMouseOnLine(mouseX, mouseY, this.allData[i])) {
            console.log('TwoPointBuy hit at index:', i);
            return i;
        }
    }

    console.log('TwoPointBuy no hit');
    return null;
};

// 检测鼠标是否在指定数据的连接线上
TwoPointBuy.prototype.isMouseOnLine = function(mouseX, mouseY, data) {
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

    // 计算点到线段的距离
    var distance = this.pointToSegmentDistance(mouseX, mouseY, x1, y1, x2, y2);
    var tolerance = 8; // 容差范围，像素

    return distance <= tolerance;
};

// 计算点到线段的距离
TwoPointBuy.prototype.pointToSegmentDistance = function(px, py, x1, y1, x2, y2) {
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

// 检测鼠标是否在小圆点上
TwoPointBuy.prototype.hitTestPoint = function(mouseX, mouseY) {
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
TwoPointBuy.prototype.startDrag = function(mouseX, mouseY) {
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
TwoPointBuy.prototype.onDrag = function(mouseX, mouseY) {
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
TwoPointBuy.prototype.endDrag = function() {
    if (!this.isDragging) {
        return;
    }

    if (this.draggingDataIndex !== null && this.allData[this.draggingDataIndex]) {
        var data = this.allData[this.draggingDataIndex];
        var stockCode = data.stockCode;
        var period = data.period;

        var storageKey = 'twoPointBuy_' + stockCode + '_' + period;
        localStorage.setItem(storageKey, JSON.stringify(this.allData));
    }

    this.isDragging = false;
    this.draggingDataIndex = null;
    this.draggingPointIndex = null;
};

// 从点数据计算关键点
TwoPointBuy.prototype.calculateKeyPointsFromPoints = function(points) {
    var lowPrice = points[0].price;
    var highPrice = points[1].price;
    
    var XS = Math.sqrt(highPrice / lowPrice);
    var sqrtXS = Math.sqrt(XS);
    
    var C1 = highPrice / sqrtXS;
    var C2 = highPrice / XS;
    var C3 = highPrice / (sqrtXS + XS - 1);
    
    var callbackPrice = highPrice - (highPrice - lowPrice) / 2;
    var supportPrice = (highPrice - lowPrice) / 3 + lowPrice;
    
    return {
        XS: XS,
        sqrtXS: sqrtXS,
        C1: { price: C1, description: 'C1' },
        C2: { price: C2, description: 'C2' },
        C3: { price: C3, description: 'C3' },
        callbackPrice: { price: callbackPrice, description: '回调位' },
        supportPrice: { price: supportPrice, description: '支撑位' }
    };
};
