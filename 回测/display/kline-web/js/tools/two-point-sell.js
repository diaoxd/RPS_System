// 两点卖出功能模块
function TwoPointSell(klineChart) {
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
TwoPointSell.prototype.init = function() {
    this.createContextMenu();
};

// 创建右键菜单
TwoPointSell.prototype.createContextMenu = function() {
    var self = this;
    
    // 创建菜单容器
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'two-point-sell-context-menu';
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
    deleteOption.textContent = '删除两卖画线';
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
TwoPointSell.prototype.showContextMenu = function(x, y, dataIndex) {
    console.log('TwoPointSell showContextMenu called, x:', x, 'y:', y, 'dataIndex:', dataIndex);
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
    console.log('TwoPointSell context menu displayed at', menuX, menuY);
};

// 隐藏右键菜单
TwoPointSell.prototype.hideContextMenu = function() {
    this.contextMenu.style.display = 'none';
    this.selectedDataIndex = null;
};

// 删除选中的画线
TwoPointSell.prototype.deleteSelected = function() {
    if (this.selectedDataIndex === null) {
        return;
    }
    
    this.deleteDataAt(this.selectedDataIndex, this.klineChart.currentStockCode, this.klineChart.currentPeriod);
    this.klineChart.renderAll();
};

TwoPointSell.prototype.reset = function() {
    this.points = [];
    this.keyPoints = null;
    this.allData = [];
};

TwoPointSell.prototype.isComplete = function() {
    return this.points.length === this.maxPoints;
};

TwoPointSell.prototype.addPoint = function(canvasX, canvasY) {
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
            throw new Error('高点价格不能低于低点价格');
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

TwoPointSell.prototype.findNearestCandleIndex = function(canvasX) {
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

TwoPointSell.prototype.getCandleCanvasPosition = function(candleIndex) {
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

TwoPointSell.prototype.priceToCanvasY = function(price) {
    return this.klineChart.priceToCanvasY(price);
};

TwoPointSell.prototype.calculateKeyPoints = function() {
    var highPoint = this.points[0];
    var lowPoint = this.points[1];
    
    var highPrice = highPoint.price;
    var lowPrice = lowPoint.price;
    
    var XS = Math.sqrt(highPrice / lowPrice);
    var sqrtXS = Math.sqrt(XS);
    
    var D1 = lowPrice * sqrtXS;
    var D2 = lowPrice * XS;
    var D3 = lowPrice * (sqrtXS + XS - 1);
    
    var highPoint1 = (highPrice - lowPrice) * 1.382 + lowPrice;
    var highPoint2 = (highPrice - lowPrice) * 1.382 + highPrice;
    var strongPressure = highPrice - (highPrice - lowPrice) / 3;
    
    return {
        XS: XS,
        sqrtXS: sqrtXS,
        D1: { price: D1, description: 'D1' },
        D2: { price: D2, description: 'D2' },
        D3: { price: D3, description: 'D3' },
        highPoint1: { price: highPoint1, description: '高点位1' },
        highPoint2: { price: highPoint2, description: '高点位2' },
        strongPressure: { price: strongPressure, description: '强压力位' }
    };
};

TwoPointSell.prototype.render = function(ctx) {
    if (this.points.length === 0) {
        return;
    }

    this.drawPointMarkers(ctx);

    if (this.isComplete()) {
        this.drawConnectingLine(ctx);
        this.drawVerticalLine(ctx);
        this.drawPressureLines(ctx);
        this.drawHighPointLines(ctx);
    }
};

TwoPointSell.prototype.renderAll = function(ctx) {
    if (!this.allData || this.allData.length === 0) {
        return;
    }

    for (var i = 0; i < this.allData.length; i++) {
        this.renderSingleData(ctx, this.allData[i], i);
    }
};

TwoPointSell.prototype.renderSingleData = function(ctx, data, index) {
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
    this.drawPressureLinesForData(ctx, points, keyPoints);
    this.drawHighPointLinesForData(ctx, points, keyPoints);
};

TwoPointSell.prototype.findCandleIndexByTimestamp = function(timestamp) {
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

    return -1;
};

TwoPointSell.prototype.drawPointMarkersForData = function(ctx, points, index) {
    var colors = ['#ef5350', '#66bb6a'];
    var labels = ['高点', '低点'];

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

TwoPointSell.prototype.drawConnectingLineForData = function(ctx, points) {
    if (points.length < 2) {
        return;
    }

    var highPoint = points[0];
    var lowPoint = points[1];
    
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
    ctx.strokeStyle = '#4caf50';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.moveTo(highX, highY);
    ctx.lineTo(lowX, lowY);
    ctx.stroke();
};

TwoPointSell.prototype.drawVerticalLineForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.highPoint2 || points.length < 2) {
        return;
    }

    var lowPoint = points[1];
    
    if (!lowPoint.candle) {
        return;
    }
    
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    
    var lowX = lowCandlePos.centerX;
    var lowY = lowCandlePos.priceToY(lowPoint.price);
    var highPoint2Y = this.priceToCanvasY(keyPoints.highPoint2.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.moveTo(lowX, lowY);
    ctx.lineTo(lowX, highPoint2Y);
    ctx.stroke();
    ctx.setLineDash([]);
};

TwoPointSell.prototype.drawPressureLinesForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.D1 || !keyPoints.D2 || !keyPoints.D3 || !keyPoints.strongPressure || points.length < 2) {
        return;
    }

    var lowPoint = points[1];
    
    if (!lowPoint.candle) {
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

    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    var lowX = lowCandlePos.centerX;

    var lengthD1 = 300;
    var lengthD2 = 500;
    var lengthD3 = 700;

    var d1Y = this.priceToCanvasY(keyPoints.D1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D1;
    ctx.setLineDash(dashD1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, d1Y);
    ctx.lineTo(lowX + lengthD1, d1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.D1.price, keyPoints.D1.description, lowX - 10, d1Y, 'right', 'default', colors.D1);

    var d2Y = this.priceToCanvasY(keyPoints.D2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D2;
    ctx.setLineDash(dashD2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, d2Y);
    ctx.lineTo(lowX + lengthD2, d2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.D2.price, keyPoints.D2.description, lowX - 10, d2Y, 'right', 'default', colors.D2);

    var d3Y = this.priceToCanvasY(keyPoints.D3.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D3;
    ctx.setLineDash(dashD3);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, d3Y);
    ctx.lineTo(lowX + lengthD3, d3Y);
    ctx.stroke();
    ctx.setLineDash([]);
    var d3Type = keyPoints.D3.price > keyPoints.strongPressure.price ? 'D3-above' : 'D3-below';
    this.drawLabel(ctx, keyPoints.D3.price, keyPoints.D3.description, lowX - 10, d3Y, 'right', d3Type, colors.D3);
};

TwoPointSell.prototype.drawHighPointLinesForData = function(ctx, points, keyPoints) {
    if (!keyPoints || !keyPoints.highPoint1 || !keyPoints.highPoint2 || !keyPoints.strongPressure || points.length < 2) {
        return;
    }

    var lowPoint = points[1];
    
    if (!lowPoint.candle) {
        return;
    }

    var dashHighPoint1 = [5, 10];
    var dashHighPoint2 = [10, 8];
    var dashStrongPressure = [15, 5];
    
    var colors = {
        highPoint1: '#42a5f5',
        highPoint2: '#1e88e5',
        strongPressure: '#1565c0'
    };

    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    var lowX = lowCandlePos.centerX;

    var lengthHighPoint1 = 800;
    var lengthHighPoint2 = 900;
    var lengthStrongPressure = 700;

    var highPoint1Y = this.priceToCanvasY(keyPoints.highPoint1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.highPoint1;
    ctx.setLineDash(dashHighPoint1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, highPoint1Y);
    ctx.lineTo(lowX + lengthHighPoint1, highPoint1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.highPoint1.price, keyPoints.highPoint1.description, lowX - 10, highPoint1Y, 'right', 'default', colors.highPoint1);

    var highPoint2Y = this.priceToCanvasY(keyPoints.highPoint2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.highPoint2;
    ctx.setLineDash(dashHighPoint2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, highPoint2Y);
    ctx.lineTo(lowX + lengthHighPoint2, highPoint2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, keyPoints.highPoint2.price, keyPoints.highPoint2.description, lowX - 10, highPoint2Y, 'right', 'default', colors.highPoint2);

    var strongPressureY = this.priceToCanvasY(keyPoints.strongPressure.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.strongPressure;
    ctx.setLineDash(dashStrongPressure);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, strongPressureY);
    ctx.lineTo(lowX + lengthStrongPressure, strongPressureY);
    ctx.stroke();
    ctx.setLineDash([]);
    var strongPressureType = keyPoints.strongPressure.price > keyPoints.D3.price ? 'strongPressure-above' : 'strongPressure-below';
    this.drawLabel(ctx, keyPoints.strongPressure.price, keyPoints.strongPressure.description, lowX - 10, strongPressureY, 'right', strongPressureType, colors.strongPressure);
};

TwoPointSell.prototype.drawPointMarkers = function(ctx) {
    var colors = ['#ef5350', '#66bb6a'];
    var labels = ['高点', '低点'];

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

TwoPointSell.prototype.drawConnectingLine = function(ctx) {
    if (this.points.length < 2) {
        return;
    }

    var highPoint = this.points[0];
    var lowPoint = this.points[1];
    
    var highCandlePos = this.getCandleCanvasPosition(highPoint.candleIndex);
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    
    var highX = highCandlePos.centerX;
    var highY = highCandlePos.priceToY(highPoint.price);
    var lowX = lowCandlePos.centerX;
    var lowY = lowCandlePos.priceToY(lowPoint.price);

    ctx.beginPath();
    ctx.strokeStyle = '#4caf50';
    ctx.setLineDash([]);
    ctx.lineWidth = 3;
    ctx.moveTo(highX, highY);
    ctx.lineTo(lowX, lowY);
    ctx.stroke();
};

TwoPointSell.prototype.drawVerticalLine = function(ctx) {
    if (!this.keyPoints || this.points.length < 2) {
        return;
    }

    var lowPoint = this.points[1];
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    
    var lowX = lowCandlePos.centerX;
    var lowY = lowCandlePos.priceToY(lowPoint.price);
    var highPoint2Y = this.priceToCanvasY(this.keyPoints.highPoint2.price);
    
    ctx.beginPath();
    ctx.strokeStyle = '#9e9e9e';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.moveTo(lowX, lowY);
    ctx.lineTo(lowX, highPoint2Y);
    ctx.stroke();
    ctx.setLineDash([]);
};

TwoPointSell.prototype.drawPressureLines = function(ctx) {
    if (!this.keyPoints || this.points.length < 2) {
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

    var lowPoint = this.points[1];
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    var lowX = lowCandlePos.centerX;

    var lengthD1 = 300;
    var lengthD2 = 500;
    var lengthD3 = 700;

    var d1Y = this.priceToCanvasY(this.keyPoints.D1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D1;
    ctx.setLineDash(dashD1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, d1Y);
    ctx.lineTo(lowX + lengthD1, d1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.D1.price, this.keyPoints.D1.description, lowX - 10, d1Y, 'right', 'default', colors.D1);

    var d2Y = this.priceToCanvasY(this.keyPoints.D2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D2;
    ctx.setLineDash(dashD2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, d2Y);
    ctx.lineTo(lowX + lengthD2, d2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.D2.price, this.keyPoints.D2.description, lowX - 10, d2Y, 'right', 'default', colors.D2);

    var d3Y = this.priceToCanvasY(this.keyPoints.D3.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.D3;
    ctx.setLineDash(dashD3);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, d3Y);
    ctx.lineTo(lowX + lengthD3, d3Y);
    ctx.stroke();
    ctx.setLineDash([]);
    var d3Type = this.keyPoints.D3.price > this.keyPoints.strongPressure.price ? 'D3-above' : 'D3-below';
    this.drawLabel(ctx, this.keyPoints.D3.price, this.keyPoints.D3.description, lowX - 10, d3Y, 'right', d3Type, colors.D3);
};

TwoPointSell.prototype.drawHighPointLines = function(ctx) {
    if (!this.keyPoints || this.points.length < 2) {
        return;
    }

    var dashHighPoint1 = [5, 10];
    var dashHighPoint2 = [10, 8];
    var dashStrongPressure = [15, 5];
    
    var colors = {
        highPoint1: '#42a5f5',
        highPoint2: '#1e88e5',
        strongPressure: '#1565c0'
    };

    var lowPoint = this.points[1];
    var lowCandlePos = this.getCandleCanvasPosition(lowPoint.candleIndex);
    var lowX = lowCandlePos.centerX;

    var lengthHighPoint1 = 800;
    var lengthHighPoint2 = 900;
    var lengthStrongPressure = 700;

    var highPoint1Y = this.priceToCanvasY(this.keyPoints.highPoint1.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.highPoint1;
    ctx.setLineDash(dashHighPoint1);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, highPoint1Y);
    ctx.lineTo(lowX + lengthHighPoint1, highPoint1Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.highPoint1.price, this.keyPoints.highPoint1.description, lowX - 10, highPoint1Y, 'right', 'default', colors.highPoint1);

    var highPoint2Y = this.priceToCanvasY(this.keyPoints.highPoint2.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.highPoint2;
    ctx.setLineDash(dashHighPoint2);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, highPoint2Y);
    ctx.lineTo(lowX + lengthHighPoint2, highPoint2Y);
    ctx.stroke();
    ctx.setLineDash([]);
    this.drawLabel(ctx, this.keyPoints.highPoint2.price, this.keyPoints.highPoint2.description, lowX - 10, highPoint2Y, 'right', 'default', colors.highPoint2);

    var strongPressureY = this.priceToCanvasY(this.keyPoints.strongPressure.price);
    ctx.beginPath();
    ctx.strokeStyle = colors.strongPressure;
    ctx.setLineDash(dashStrongPressure);
    ctx.lineWidth = 1.5;
    ctx.moveTo(lowX, strongPressureY);
    ctx.lineTo(lowX + lengthStrongPressure, strongPressureY);
    ctx.stroke();
    ctx.setLineDash([]);
    var strongPressureType = this.keyPoints.strongPressure.price > this.keyPoints.D3.price ? 'strongPressure-above' : 'strongPressure-below';
    this.drawLabel(ctx, this.keyPoints.strongPressure.price, this.keyPoints.strongPressure.description, lowX - 10, strongPressureY, 'right', strongPressureType, colors.strongPressure);
};

TwoPointSell.prototype.drawLabel = function(ctx, price, description, x, y, align, type, color) {
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
    
    if (type === 'D3-above') {
        textY = y - 10;
    } else if (type === 'D3-below') {
        textY = y + 10;
    } else if (type === 'strongPressure-above') {
        textY = y - 10;
    } else if (type === 'strongPressure-below') {
        textY = y + 10;
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

TwoPointSell.prototype.displayResults = function() {
    if (!this.keyPoints) {
        return;
    }

    var results = '两点卖出计算结果：高点:' + this.points[0].price.toFixed(2) + ',低点:' + this.points[1].price.toFixed(2) + ',XS:' + this.keyPoints.XS.toFixed(4) + ',sqrtXS:' + this.keyPoints.sqrtXS.toFixed(4) + ',D1:' + this.keyPoints.D1.price.toFixed(2) + ',D2:' + this.keyPoints.D2.price.toFixed(2) + ',D3:' + this.keyPoints.D3.price.toFixed(2) + ',高点位1:' + this.keyPoints.highPoint1.price.toFixed(2) + ',高点位2:' + this.keyPoints.highPoint2.price.toFixed(2) + ',强压力位:' + this.keyPoints.strongPressure.price.toFixed(2);
        
    console.log(results);
};

TwoPointSell.prototype.save = function(stockCode, period) {
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
            D1: this.keyPoints.D1,
            D2: this.keyPoints.D2,
            D3: this.keyPoints.D3,
            highPoint1: this.keyPoints.highPoint1,
            highPoint2: this.keyPoints.highPoint2,
            strongPressure: this.keyPoints.strongPressure
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

    var storageKey = 'twoPointSell_' + stockCode + '_' + period;
    
    var existingDataStr = localStorage.getItem(storageKey);
    var allData = [];
    
    if (existingDataStr) {
        var parsedData = JSON.parse(existingDataStr);
        allData = Array.isArray(parsedData) ? parsedData : [parsedData];
    }
    
    allData.push(newData);
    localStorage.setItem(storageKey, JSON.stringify(allData));
    console.log('两点卖出数据已保存：', newData);
    
    this.reset();
};

TwoPointSell.prototype.load = function(stockCode, period) {
    var storageKey = 'twoPointSell_' + stockCode + '_' + period;
    
    var dataStr = localStorage.getItem(storageKey);
    
    if (!dataStr) {
        this.allData = [];
        return;
    }

    try {
        var parsedData = JSON.parse(dataStr);
        this.allData = Array.isArray(parsedData) ? parsedData : [parsedData];
        console.log('两点卖出数据已加载：', this.allData);
    } catch (error) {
        console.error('加载两点卖出数据失败：', error);
        this.allData = [];
    }
};

TwoPointSell.prototype.clear = function(stockCode, period) {
    var storageKey = 'twoPointSell_' + stockCode + '_' + period;
    localStorage.removeItem(storageKey);
    this.allData = [];
    this.reset();
    console.log('两点卖出数据已清除');
};

// 删除指定索引的画线数据
TwoPointSell.prototype.deleteDataAt = function(index, stockCode, period) {
    if (index < 0 || index >= this.allData.length) {
        console.error('删除失败，索引无效：', index);
        return false;
    }

    this.allData.splice(index, 1);

    var storageKey = 'twoPointSell_' + stockCode + '_' + period;
    if (this.allData.length === 0) {
        localStorage.removeItem(storageKey);
    } else {
        localStorage.setItem(storageKey, JSON.stringify(this.allData));
    }

    console.log('已删除两点卖出数据，索引：', index);
    return true;
};

// 碰撞检测：检测鼠标是否在指定数据的连接线上
TwoPointSell.prototype.hitTest = function(mouseX, mouseY) {
    console.log('TwoPointSell hitTest called, mouseX:', mouseX, 'mouseY:', mouseY);
    console.log('TwoPointSell allData length:', this.allData ? this.allData.length : 0);
    
    if (!this.allData || this.allData.length === 0) {
        console.log('TwoPointSell no data, returning null');
        return null;
    }

    for (var i = 0; i < this.allData.length; i++) {
        console.log('TwoPointSell checking data index:', i);
        if (this.isMouseOnLine(mouseX, mouseY, this.allData[i])) {
            console.log('TwoPointSell hit at index:', i);
            return i;
        }
    }

    console.log('TwoPointSell no hit');
    return null;
};

// 检测鼠标是否在指定数据的连接线上
TwoPointSell.prototype.isMouseOnLine = function(mouseX, mouseY, data) {
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

    // 计算点到线段的距离
    var distance = this.pointToSegmentDistance(mouseX, mouseY, x1, y1, x2, y2);
    var tolerance = 8; // 容差范围，像素

    return distance <= tolerance;
};

// 计算点到线段的距离
TwoPointSell.prototype.pointToSegmentDistance = function(px, py, x1, y1, x2, y2) {
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
TwoPointSell.prototype.hitTestPoint = function(mouseX, mouseY) {
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
TwoPointSell.prototype.startDrag = function(mouseX, mouseY) {
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
TwoPointSell.prototype.onDrag = function(mouseX, mouseY) {
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
TwoPointSell.prototype.endDrag = function() {
    if (!this.isDragging) {
        return;
    }

    if (this.draggingDataIndex !== null && this.allData[this.draggingDataIndex]) {
        var data = this.allData[this.draggingDataIndex];
        var stockCode = data.stockCode;
        var period = data.period;

        var storageKey = 'twoPointSell_' + stockCode + '_' + period;
        localStorage.setItem(storageKey, JSON.stringify(this.allData));
    }

    this.isDragging = false;
    this.draggingDataIndex = null;
    this.draggingPointIndex = null;
};

// 从点数据计算关键点
TwoPointSell.prototype.calculateKeyPointsFromPoints = function(points) {
    var highPrice = points[0].price;
    var lowPrice = points[1].price;
    
    var XS = Math.sqrt(highPrice / lowPrice);
    var sqrtXS = Math.sqrt(XS);
    
    var D1 = lowPrice * sqrtXS;
    var D2 = lowPrice * XS;
    var D3 = lowPrice * (sqrtXS + XS - 1);
    
    var highPoint1 = (highPrice - lowPrice) * 1.382 + lowPrice;
    var highPoint2 = (highPrice - lowPrice) * 1.382 + highPrice;
    var strongPressure = highPrice - (highPrice - lowPrice) / 3;
    
    return {
        XS: XS,
        sqrtXS: sqrtXS,
        D1: { price: D1, description: 'D1' },
        D2: { price: D2, description: 'D2' },
        D3: { price: D3, description: 'D3' },
        highPoint1: { price: highPoint1, description: '高点位1' },
        highPoint2: { price: highPoint2, description: '高点位2' },
        strongPressure: { price: strongPressure, description: '强压力位' }
    };
};
