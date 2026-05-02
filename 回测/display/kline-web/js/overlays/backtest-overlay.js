// 回测买卖点叠加层模块
// 在 K 线图上标注回测交易记录的买卖点

var BacktestOverlay = {
    enabled: true,
    chart: null,

    // 缓存：股票代码 → dateIndexMap
    _dateIndexCache: {},
    _cacheStockCode: null,

    init: function (chart) {
        this.chart = chart;
    },

    // 构建日期→K线索引映射（仅在切换股票时重建）
    _ensureDateIndex: function () {
        if (!this.chart || !this.chart.candles) return;
        var code = this.chart.currentStockCode;
        if (code === this._cacheStockCode) return;

        this._dateIndexCache = {};
        var candles = this.chart.candles;
        for (var i = 0; i < candles.length; i++) {
            var d = candles[i].day || candles[i].date || '';
            if (d) {
                // 统一格式为 YYYY-MM-DD
                var key = String(d).trim();
                if (key.indexOf('-') > -1) {
                    this._dateIndexCache[key] = i;
                } else if (key.length === 8) {
                    // YYYYMMDD → YYYY-MM-DD
                    key = key.substring(0, 4) + '-' + key.substring(4, 6) + '-' + key.substring(6, 8);
                    this._dateIndexCache[key] = i;
                }
            }
        }
        this._cacheStockCode = code;
    },

    // 获取日期对应的蜡烛图索引
    _getCandleIndex: function (dateStr) {
        this._ensureDateIndex();
        return this._dateIndexCache[dateStr];
    },

    // 判断索引是否在可见范围内
    _isVisible: function (index) {
        if (index === undefined || index === null) return false;
        var cw = this.chart.currentCandleWidth || 6;
        var w = this.chart.canvas.width;
        var x = index * cw + cw / 2 + this.chart.offsetX;
        return x >= -cw && x <= w + cw;
    },

    // 获取蜡烛图X坐标
    _getX: function (index) {
        var cw = this.chart.currentCandleWidth || 6;
        return index * cw + cw / 2 + this.chart.offsetX;
    },

    render: function (ctx) {
        if (!this.enabled) return;
        if (!this.chart || !this.chart.candles || this.chart.candles.length === 0) return;
        if (this.chart.currentPeriod !== 'daily') return;
        if (typeof BACKTEST_TRADES === 'undefined') return;

        var rawCode = this.chart.currentStockCode;
        if (!rawCode) return;

        // 去掉 sh/sz/bj 前缀匹配回测数据（回测数据是纯6位代码）
        var code = rawCode.replace(/^(sh|sz|bj)/i, '');
        var stockData = BACKTEST_TRADES[code];
        if (!stockData || !stockData.daily || stockData.daily.length === 0) return;

        var trades = stockData.daily;
        var chart = this.chart;
        var cw = chart.currentCandleWidth || 6;
        var offsetX = chart.offsetX || 0;

        // 确保日期索引就绪
        this._ensureDateIndex();

        // 获取买卖配对：遍历交易列表，将连续的buy和sell配对
        var pairs = [];
        var i = 0;
        while (i < trades.length) {
            if (trades[i].type === 'buy' && i + 1 < trades.length && trades[i + 1].type === 'sell') {
                pairs.push({ buy: trades[i], sell: trades[i + 1] });
                i += 2;
            } else {
                i++;
            }
        }

        // 绘制每笔交易
        for (var p = 0; p < pairs.length; p++) {
            var buy = pairs[p].buy;
            var sell = pairs[p].sell;

            var buyIdx = this._getCandleIndex(buy.date);
            var sellIdx = this._getCandleIndex(sell.date);

            if (buyIdx === undefined || sellIdx === undefined) continue;

            var buyVisible = this._isVisible(buyIdx);
            var sellVisible = this._isVisible(sellIdx);

            if (!buyVisible && !sellVisible) continue;

            var buyX = this._getX(buyIdx);
            var sellX = this._getX(sellIdx);
            var buyY = chart.priceToCanvasY(buy.price);
            var sellY = chart.priceToCanvasY(sell.price);

            var win = sell.pnl_pct > 0;

            // ── 连接线（虚线，仅在两者均可见或部分可见时绘制） ──
            if (buyVisible || sellVisible) {
                ctx.save();
                ctx.strokeStyle = win ? 'rgba(102, 187, 106, 0.5)' : 'rgba(239, 83, 80, 0.5)';
                ctx.lineWidth = 1;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(buyX, buyY);
                ctx.lineTo(sellX, sellY);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
            }

            // ── 买入标记（绿色上箭头 ▲） ──
            if (buyVisible) {
                this._drawBuyMarker(ctx, buyX, buyY, buy.price);
            }

            // ── 卖出标记（红/绿下箭头 ▼） ──
            if (sellVisible) {
                this._drawSellMarker(ctx, sellX, sellY, sell.price, win, sell);
            }
        }

        // ── 图例 ──
        this._drawLegend(ctx);
    },

    _drawBuyMarker: function (ctx, x, y, price) {
        var size = 7;
        ctx.save();
        // 绿色发光圆圈
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = '#166534';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 白色 "+" 号
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 3, y);
        ctx.lineTo(x + 3, y);
        ctx.moveTo(x, y - 3);
        ctx.lineTo(x, y + 3);
        ctx.stroke();

        // 标签 "B"
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('B', x, y + size + 2);
        ctx.restore();
    },

    _drawSellMarker: function (ctx, x, y, price, win, sellInfo) {
        var size = 7;
        ctx.save();
        var color = win ? '#22c55e' : '#ef4444';
        var darkColor = win ? '#166534' : '#991b1b';

        // 发光圆圈
        ctx.fillStyle = color;
        ctx.strokeStyle = darkColor;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = win ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 白色 "×" 号
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 3, y - 3);
        ctx.lineTo(x + 3, y + 3);
        ctx.moveTo(x + 3, y - 3);
        ctx.lineTo(x - 3, y + 3);
        ctx.stroke();

        // 标签 "S" + 收益率
        var label = 'S ' + (sellInfo.pnl_pct >= 0 ? '+' : '') + sellInfo.pnl_pct.toFixed(1) + '%';
        ctx.fillStyle = color;
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(label, x, y - size - 2);
        ctx.restore();
    },

    _drawLegend: function (ctx) {
        var x = this.chart.canvas.width - 135;
        var y = 40;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;
        ctx.fillRect(x - 6, y - 2, 124, 40);
        ctx.strokeRect(x - 6, y - 2, 124, 40);

        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';

        ctx.fillStyle = '#22c55e';
        ctx.fillText('● 买入', x + 2, y + 14);
        ctx.fillText('● 卖出(盈)', x + 60, y + 14);

        ctx.fillStyle = '#ef4444';
        ctx.fillText('● 卖出(亏)', x + 2, y + 32);

        ctx.restore();
    },

    // 鼠标悬浮检测：返回最近的买卖点信息
    hitTest: function (mouseX, mouseY) {
        if (!this.enabled || !this.chart || this.chart.currentPeriod !== 'daily') return null;
        if (typeof BACKTEST_TRADES === 'undefined') return null;

        var rawCode = this.chart.currentStockCode;
        var code = rawCode.replace(/^(sh|sz|bj)/i, '');
        var stockData = BACKTEST_TRADES[code];
        if (!stockData || !stockData.daily) return null;

        var threshold = 15;
        var closest = null;
        var closestDist = threshold;

        var trades = stockData.daily;
        for (var i = 0; i < trades.length; i++) {
            var t = trades[i];
            var idx = this._getCandleIndex(t.date);
            if (idx === undefined) continue;
            if (!this._isVisible(idx)) continue;

            var px = this._getX(idx);
            var py = this.chart.priceToCanvasY(t.price);
            var dist = Math.sqrt((mouseX - px) * (mouseX - px) + (mouseY - py) * (mouseY - py));

            if (dist < closestDist) {
                closestDist = dist;
                closest = t;
            }
        }
        return closest;
    }
};
