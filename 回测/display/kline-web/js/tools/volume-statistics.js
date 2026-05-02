// 量能统计功能模块 - 统计MACD柱正值总和（兼容版）
function VolumeStatistics(klineChart) {
    this.klineChart = klineChart;
    this.enabled = false;
    this.points = [];
    this.maxPoints = 2;
    this.keyPoints = null;
    this.allData = [];
    this.rightPadding = 45;
}

VolumeStatistics.prototype.enable = function() {
    this.enabled = true;
    return this.enabled;
};

VolumeStatistics.prototype.disable = function() {
    this.enabled = false;
    return this.enabled;
};

VolumeStatistics.prototype.isEnabled = function() {
    return this.enabled;
};

VolumeStatistics.prototype.reset = function() {
    this.points = [];
    this.keyPoints = null;
};

VolumeStatistics.prototype.isComplete = function() {
    return this.points.length === this.maxPoints;
};

VolumeStatistics.prototype.addPoint = function(canvasX, canvasY) {
    var _this = this;
    
    if (_this.points.length >= _this.maxPoints) {
        throw new Error('已经取完两个点，请先清除');
    }

    // 检查点击是否在副图区域
    var mainChartHeight = _this.klineChart.canvas.height * 0.85;
    if (canvasY < mainChartHeight) {
        throw new Error('请在量能副图区域取点');
    }

    var candleIndex = _this.findNearestCandleIndex(canvasX);
    
    if (candleIndex === -1) {
        throw new Error('找不到K线数据');
    }

    var macdData = _this.klineChart.macdIndicator ? _this.klineChart.macdIndicator.macdData : null;
    if (!macdData || macdData.length === 0) {
        throw new Error('请先开启量能显示');
    }

    var macdValue = macdData[candleIndex] ? macdData[candleIndex].macd : 0;

    // 如果是第二个点，检查是否和第一个点在同一区域
    if (_this.points.length === 1) {
        var firstPoint = _this.points[0];
        var firstIsPositive = firstPoint.macdValue >= 0;
        var currentIsPositive = macdValue >= 0;
        
        if (firstIsPositive !== currentIsPositive) {
            throw new Error('第二个点必须和第一个点在同一区域（正值区或负值区）');
        }
    }

    _this.points.push({
        candleIndex: candleIndex,
        macdValue: macdValue,
        candle: _this.klineChart.candles[candleIndex]
    });

    if (_this.isComplete()) {
        _this.keyPoints = _this.calculateKeyPoints();
        _this.klineChart.renderAll();
    }
};

VolumeStatistics.prototype.findNearestCandleIndex = function(canvasX) {
    var _this = this;
    var candles = _this.klineChart.candles;
    if (!candles || candles.length === 0) {
        return -1;
    }

    var viewWidth = _this.klineChart.canvas.width;
    var rightPadding = _this.rightPadding;
    var availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / candles.length;
    var candleWidth = baseCandleWidth * _this.klineChart.scale;
    var offsetX = _this.klineChart.offsetX;

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

VolumeStatistics.prototype.calculateKeyPoints = function() {
    var _this = this;
    var startPoint = _this.points[0];
    var endPoint = _this.points[1];
    var macdData = _this.klineChart.macdIndicator ? _this.klineChart.macdIndicator.macdData : [];
    
    var startIndex = Math.min(startPoint.candleIndex, endPoint.candleIndex);
    var endIndex = Math.max(startPoint.candleIndex, endPoint.candleIndex);
    
    var startIsPositive = startPoint.macdValue >= 0;
    var endIsPositive = endPoint.macdValue >= 0;
    var isPositiveZone = startIsPositive || endIsPositive;
    
    var totalMacd = 0;
    
    var currentZoneStart = -1;
    var currentZoneType = null;
    var zoneSum = 0;
    
    for (var i = 0; i < macdData.length; i++) {
        if (!macdData[i]) continue;
        
        var macd = macdData[i].macd;
        var isPositive = macd >= 0;
        var currentType = isPositive ? 'positive' : 'negative';
        
        if (currentZoneType === null || currentType !== currentZoneType) {
            var matchType = isPositiveZone ? 'positive' : 'negative';
            if (currentZoneType === matchType && currentZoneStart !== -1) {
                var zoneEnd = i - 1;
                if (zoneEnd >= startIndex && currentZoneStart <= endIndex) {
                    totalMacd += zoneSum;
                }
            }
            
            currentZoneType = currentType;
            currentZoneStart = i;
            zoneSum = macd;
        } else {
            zoneSum += macd;
        }
    }
    
    var matchType = isPositiveZone ? 'positive' : 'negative';
    if (currentZoneType === matchType && currentZoneStart !== -1) {
        var zoneEnd = macdData.length - 1;
        if (zoneEnd >= startIndex && currentZoneStart <= endIndex) {
            totalMacd += zoneSum;
        }
    }

    var startMacd = startPoint.macdValue;
    var endMacd = endPoint.macdValue;

    return {
        startPoint: startPoint,
        endPoint: endPoint,
        startIndex: startIndex,
        endIndex: endIndex,
        startMacd: startMacd,
        endMacd: endMacd,
        totalMacd: totalMacd,
        isPositiveZone: isPositiveZone
    };
};

VolumeStatistics.prototype.getCandleCanvasPosition = function(candleIndex) {
    var _this = this;
    var viewWidth = _this.klineChart.canvas.width;
    var rightPadding = _this.rightPadding;
    var availableWidth = viewWidth - rightPadding;
    var baseCandleWidth = availableWidth / _this.klineChart.candles.length;
    var candleWidth = baseCandleWidth * _this.klineChart.scale;
    var offsetX = _this.klineChart.offsetX;

    var centerX = candleIndex * candleWidth + offsetX + candleWidth / 2;
    var mainChartHeight = _this.klineChart.canvas.height * 0.85;
    var subChartTop = mainChartHeight;
    var subChartHeight = _this.klineChart.canvas.height - mainChartHeight;

    return {
        centerX: centerX,
        subChartTop: subChartTop,
        subChartHeight: subChartHeight
    };
};

VolumeStatistics.prototype.macdToCanvasY = function(macdValue) {
    var _this = this;
    var macdData = _this.klineChart.macdIndicator ? _this.klineChart.macdIndicator.macdData : [];
    if (!macdData || macdData.length === 0) {
        return 0;
    }

    var minValue = Infinity;
    var maxValue = -Infinity;
    
    for (var i = 0; i < macdData.length; i++) {
        var macd = macdData[i].macd;
        if (macd < minValue) minValue = macd;
        if (macd > maxValue) maxValue = macd;
    }

    minValue = Math.min(minValue, 0);
    maxValue = Math.max(maxValue, 0);
    
    var maxAbsValue = Math.max(Math.abs(maxValue), Math.abs(minValue));
    minValue = -maxAbsValue;
    maxValue = maxAbsValue;
    
    var valueRange = maxValue - minValue || 1;
    var padding = 10;
    var mainChartHeight = _this.klineChart.canvas.height * 0.85;
    var subChartTop = mainChartHeight;
    var subChartHeight = _this.klineChart.canvas.height - mainChartHeight;
    var availableHeight = subChartHeight - padding * 2;

    var zeroY = subChartTop + padding + (maxValue / valueRange) * availableHeight;
    var y = subChartTop + padding + ((maxValue - macdValue) / valueRange) * availableHeight;
    
    return y;
};

VolumeStatistics.prototype.drawPointMarkers = function(ctx) {
    var _this = this;
    var colors = ['#ef5350', '#66bb6a'];

    for (var i = 0; i < _this.points.length; i++) {
        var point = _this.points[i];
        if (!point || point.macdValue === undefined) {
            continue;
        }
        var candlePos = _this.getCandleCanvasPosition(point.candleIndex);
        
        var macdValue = point.macdValue;
        var x = candlePos.centerX;
        var y = _this.macdToCanvasY(macdValue);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors[i];
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
};

VolumeStatistics.prototype.drawStatisticsLine = function(ctx) {
    var _this = this;
    if (_this.points.length < 2) {
        return;
    }

    var startPoint = _this.points[0];
    var endPoint = _this.points[1];
    
    if (!startPoint || !endPoint || startPoint.macdValue === undefined || endPoint.macdValue === undefined) {
        return;
    }

    var startPos = _this.getCandleCanvasPosition(startPoint.candleIndex);
    var endPos = _this.getCandleCanvasPosition(endPoint.candleIndex);

    var startY = _this.macdToCanvasY(startPoint.macdValue);
    var endY = _this.macdToCanvasY(endPoint.macdValue);

    var isPositive = true;
    if (_this.keyPoints && _this.keyPoints.isPositiveZone !== undefined) {
        isPositive = _this.keyPoints.isPositiveZone;
    } else {
        isPositive = startPoint.macdValue >= 0 || endPoint.macdValue >= 0;
    }

    ctx.beginPath();
    ctx.strokeStyle = isPositive ? '#ef5350' : '#26a69a';
    ctx.lineWidth = 2;
    ctx.moveTo(startPos.centerX, startY);
    ctx.lineTo(endPos.centerX, endY);
    ctx.stroke();
};

VolumeStatistics.prototype.drawLabel = function(ctx) {
    var _this = this;
    if (_this.points.length < 2 || !_this.keyPoints) {
        return;
    }

    var startPoint = _this.points[0];
    var endPoint = _this.points[1];
    
    if (!startPoint || !endPoint || startPoint.macdValue === undefined || endPoint.macdValue === undefined) {
        return;
    }

    var startPos = _this.getCandleCanvasPosition(startPoint.candleIndex);
    var endPos = _this.getCandleCanvasPosition(endPoint.candleIndex);

    var startY = _this.macdToCanvasY(startPoint.macdValue);
    var endY = _this.macdToCanvasY(endPoint.macdValue);

    var centerX = (startPos.centerX + endPos.centerX) / 2;
    var minY = Math.min(startY, endY);
    var maxY = Math.max(startY, endY);

    var totalMacdValue = _this.keyPoints.totalMacd;
    if (totalMacdValue === undefined && _this.keyPoints.totalPositiveMacd !== undefined) {
        totalMacdValue = _this.keyPoints.totalPositiveMacd;
    }
    
    var isPositive = _this.keyPoints.isPositiveZone;
    if (isPositive === undefined) {
        isPositive = true;
    }

    var totalText = isPositive 
        ? '正值总和: ' + (totalMacdValue !== undefined ? totalMacdValue.toFixed(2) : '0.00')
        : '负值总和: ' + (totalMacdValue !== undefined ? totalMacdValue.toFixed(2) : '0.00');

    var deltaX = endPos.centerX - startPos.centerX;
    var deltaY = endY - startY;
    var angle = Math.atan2(deltaY, deltaX);
    
    if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
        angle += Math.PI;
    }

    var labelY = isPositive ? minY - 8 : maxY + 12;

    ctx.save();
    ctx.translate(centerX, labelY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -labelY);

    ctx.fillStyle = isPositive ? '#ef5350' : '#26a69a';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(totalText, centerX, labelY);
    
    ctx.restore();
};

VolumeStatistics.prototype.render = function(ctx) {
    var _this = this;
    if (_this.points.length === 0) {
        return;
    }

    _this.drawPointMarkers(ctx);

    if (_this.isComplete()) {
        _this.drawStatisticsLine(ctx);
        _this.drawLabel(ctx);
    }
};

VolumeStatistics.prototype.renderAll = function(ctx) {
    var _this = this;
    if (!_this.allData || _this.allData.length === 0) {
        return;
    }

    for (var index = 0; index < _this.allData.length; index++) {
        _this.renderSingleData(ctx, _this.allData[index], index);
    }
};

VolumeStatistics.prototype.renderSingleData = function(ctx, data, index) {
    var _this = this;
    var points = [];
    for (var i = 0; i < data.points.length; i++) {
        var p = data.points[i];
        var candleIndex;
        
        if (p.candleTimestamp) {
            candleIndex = _this.findCandleIndexByTimestamp(p.candleTimestamp);
        } else {
            candleIndex = p.candleIndex;
        }
        
        points.push({
            candleIndex: candleIndex,
            macdValue: p.macdValue,
            candle: candleIndex !== -1 && candleIndex !== undefined ? _this.klineChart.candles[candleIndex] : null
        });
    }
    
    var filteredPoints = [];
    for (var j = 0; j < points.length; j++) {
        if (points[j].candleIndex !== -1) {
            filteredPoints.push(points[j]);
        }
    }

    if (filteredPoints.length < 2) {
        return;
    }

    var originalPoints = _this.points;
    var originalKeyPoints = _this.keyPoints;
    
    _this.points = filteredPoints;
    
    if (data.keyPoints && data.keyPoints.totalPositiveMacd !== undefined && data.keyPoints.totalMacd === undefined) {
        data.keyPoints.totalMacd = data.keyPoints.totalPositiveMacd;
        data.keyPoints.isPositiveZone = true;
    }
    
    if (data.keyPoints && data.keyPoints.startTimestamp !== undefined && data.keyPoints.endTimestamp !== undefined) {
        var startIndex = _this.findCandleIndexByTimestamp(data.keyPoints.startTimestamp);
        var endIndex = _this.findCandleIndexByTimestamp(data.keyPoints.endTimestamp);
        if (startIndex !== -1 && endIndex !== -1) {
            data.keyPoints.startIndex = Math.min(startIndex, endIndex);
            data.keyPoints.endIndex = Math.max(startIndex, endIndex);
        }
    }
    _this.keyPoints = data.keyPoints;
    
    _this.render(ctx);
    
    _this.points = originalPoints;
    _this.keyPoints = originalKeyPoints;
};

VolumeStatistics.prototype.findCandleIndexByTimestamp = function(timestamp) {
    var _this = this;
    var candles = _this.klineChart.candles;
    if (!candles || candles.length === 0) {
        return -1;
    }

    for (var i = 0; i < candles.length; i++) {
        if (candles[i].day === timestamp) {
            return i;
        }
    }
    return -1;
};

VolumeStatistics.prototype.save = function(stockCode, period) {
    var _this = this;
    if (!_this.isComplete() || !_this.keyPoints) {
        return;
    }

    var newData = {
        timestamp: new Date().getTime(),
        stockCode: stockCode,
        period: period,
        points: [],
        keyPoints: {
            startTimestamp: _this.keyPoints.startPoint.candle.day,
            endTimestamp: _this.keyPoints.endPoint.candle.day,
            startMacd: _this.keyPoints.startMacd,
            endMacd: _this.keyPoints.endMacd,
            totalMacd: _this.keyPoints.totalMacd,
            isPositiveZone: _this.keyPoints.isPositiveZone
        }
    };
    
    for (var i = 0; i < _this.points.length; i++) {
        var p = _this.points[i];
        newData.points.push({
            candleIndex: p.candleIndex,
            macdValue: p.macdValue,
            date: p.candle.date,
            candleTimestamp: p.candle.day
        });
    }

    var storageKey = 'volumeStatistics_' + stockCode + '_' + period;
    console.log('保存量能统计数据，storageKey：', storageKey);
    
    var existingDataStr = localStorage.getItem(storageKey);
    var allData = [];
    
    if (existingDataStr) {
        var parsedData = JSON.parse(existingDataStr);
        allData = Array.isArray(parsedData) ? parsedData : [parsedData];
    }
    
    allData.push(newData);
    localStorage.setItem(storageKey, JSON.stringify(allData));
    console.log('量能统计数据已保存：', newData);
    
    _this.reset();
};

VolumeStatistics.prototype.load = function(stockCode, period) {
    var _this = this;
    var storageKey = 'volumeStatistics_' + stockCode + '_' + period;
    console.log('加载量能统计数据，storageKey：', storageKey);
    
    var dataStr = localStorage.getItem(storageKey);
    
    if (!dataStr) {
        _this.allData = [];
        return;
    }

    var parsedData = JSON.parse(dataStr);
    _this.allData = Array.isArray(parsedData) ? parsedData : [parsedData];
    console.log('量能统计数据已加载：', _this.allData);
};

VolumeStatistics.prototype.clear = function(stockCode, period) {
    var _this = this;
    var storageKey = 'volumeStatistics_' + stockCode + '_' + period;
    localStorage.removeItem(storageKey);
    _this.allData = [];
    _this.reset();
    console.log('量能统计数据已清除，storageKey：', storageKey);
};
