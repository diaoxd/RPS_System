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

        var rawCode = this.chart.currentStockCode;
        if (!rawCode) return;

        var code = rawCode.replace(/^(sh|sz|bj)/i, '');
        this._ensureDateIndex();

        // ── PROT_ADJ 修正止盈线（独立于回测数据） ──
        this._renderProtAdj(ctx);

        // ── 回测买卖点标记（需要 BACKTEST_TRADES 数据） ──
        if (typeof BACKTEST_TRADES !== 'undefined') {
            this._renderTrades(ctx, code);
        }

        // ── 图例 ──
        this._drawLegend(ctx);
    },

    // 渲染回测买卖点标记
    _renderTrades: function (ctx, code) {
        var stockData = BACKTEST_TRADES[code];
        if (!stockData || !stockData.daily || stockData.daily.length === 0) return;

        var trades = stockData.daily;
        var chart = this.chart;
        var cw = chart.currentCandleWidth || 6;
        var offsetX = chart.offsetX || 0;

        // 获取买卖配对
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

            // ── 连接线 ──
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

            if (buyVisible) {
                this._drawBuyMarker(ctx, buyX, buyY, buy);
            }
            if (sellVisible) {
                this._drawSellMarker(ctx, sellX, sellY, sell);
            }
        }
    },

    _drawBuyMarker: function (ctx, x, y, buyInfo) {
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

        // 标签 "B" + 买入原因
        var buyReason = buyInfo.reason || '';
        ctx.fillStyle = '#22c55e';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('B', x, y + size + 2);
        if (buyReason) {
            ctx.fillStyle = '#86efac';
            ctx.font = '8px monospace';
            ctx.fillText(buyReason, x, y + size + 15);
        }
        ctx.restore();
    },

    _drawSellMarker: function (ctx, x, y, sellInfo) {
        var size = 7;
        var win = sellInfo.pnl_pct > 0;
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

        // 标签 "S" + 卖出原因 + 收益率
        var sellReason = sellInfo.reason || '';
        var pnlStr = (sellInfo.pnl_pct >= 0 ? '+' : '') + sellInfo.pnl_pct.toFixed(1) + '%';
        ctx.fillStyle = color;
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('S ' + pnlStr, x, y - size - 2);
        if (sellReason) {
            ctx.fillStyle = win ? '#86efac' : '#fca5a5';
            ctx.font = '8px monospace';
            ctx.fillText(sellReason, x, y - size - 15);
        }
        ctx.restore();
    },

    // 渲染 PROT_ADJ 修正止盈线
    _renderProtAdj: function (ctx) {
        if (!this.chart || !this.chart.candles || this.chart.candles.length === 0) return;
        if (this.chart.currentPeriod !== 'daily') return;
        if (typeof PROT_ADJ_DATA === 'undefined') return;

        var rawCode = this.chart.currentStockCode;
        if (!rawCode) return;
        var code = rawCode.replace(/^(sh|sz|bj)/i, '');
        var dateMap = PROT_ADJ_DATA[code];
        if (!dateMap) return;

        this._ensureDateIndex();
        var chart = this.chart;
        var cw = chart.currentCandleWidth || 6;
        var offsetX = chart.offsetX || 0;
        var candles = chart.candles;

        ctx.save();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';  // 紫色
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();

        var firstPoint = true;
        var count = 0;
        for (var i = 0; i < candles.length; i++) {
            var d = candles[i].day || candles[i].date || '';
            var key = String(d).trim();
            if (key.indexOf('-') === -1 && key.length === 8) {
                key = key.substring(0, 4) + '-' + key.substring(4, 6) + '-' + key.substring(6, 8);
            }
            var protVal = dateMap[key];
            if (protVal === undefined) continue;

            var cx = i * cw + cw / 2 + offsetX;
            var cy = chart.priceToCanvasY(protVal);
            if (cy === null || cy < 0 || cy > chart.canvas.height) continue;

            if (firstPoint) {
                ctx.moveTo(cx, cy);
                firstPoint = false;
            } else {
                ctx.lineTo(cx, cy);
            }
            count++;
        }
        if (count > 0) {
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.restore();

        // ── 图例提示 ──
        if (count > 0) {
            ctx.save();
            ctx.font = '10px monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
            ctx.fillText('PROT_ADJ', chart.canvas.width - 12, chart.canvas.height - 10);
            ctx.restore();
        }
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
    },

    // 获取股票在某日期所属板块的RPS数据
    _getBlockRpsForStock: function (stockCode, dateStr) {
        if (typeof BLOCK_STOCK_MAP === 'undefined' || typeof BLOCK_RPS_BY_DATE === 'undefined') return [];
        var blocks = BLOCK_STOCK_MAP[stockCode];
        if (!blocks || blocks.length === 0) return [];

        var result = [];
        for (var i = 0; i < blocks.length; i++) {
            var b = blocks[i];
            var rpsDateMap = BLOCK_RPS_BY_DATE[b.code];
            var rpsValues = rpsDateMap ? rpsDateMap[dateStr] : null;
            result.push({
                code: b.code,
                name: b.name,
                r20: rpsValues ? rpsValues.r20 : null,
                r60: rpsValues ? rpsValues.r60 : null,
                r120: rpsValues ? rpsValues.r120 : null,
            });
        }
        // 按 RPS20 降序排列
        result.sort(function (a, b) {
            var va = a.r20 != null ? a.r20 : -1;
            var vb = b.r20 != null ? b.r20 : -1;
            return vb - va;
        });
        return result;
    },

    // 渲染悬浮提示（交易详情 + 原因详解 + 板块RPS）
    renderTooltip: function (ctx) {
        if (!this.enabled || !this.chart || this.chart.currentPeriod !== 'daily') return;
        if (!this.chart.isMouseOverCanvas) return;
        if (typeof BACKTEST_TRADES === 'undefined') return;

        var mouseX = this.chart.mouseX;
        var mouseY = this.chart.mouseY;
        if (mouseX == null || mouseY == null) return;

        var trade = this.hitTest(mouseX, mouseY);
        if (!trade) return;

        var rawCode = this.chart.currentStockCode;
        var code = rawCode.replace(/^(sh|sz|bj)/i, '');

        // 获取板块RPS数据
        var blockRpsList = this._getBlockRpsForStock(code, trade.date);

        // 构建提示行
        var lines = [];
        var isBuy = trade.type === 'buy';

        // ── 标题行 ──
        lines.push({ text: (isBuy ? '▼ 买入' : '▲ 卖出') + '  ' + trade.date, color: isBuy ? '#22c55e' : '#ef4444' });

        // ── 基本信息 ──
        lines.push({ text: '价格: ' + trade.price.toFixed(2), color: '#ffffff' });

        if (isBuy) {
            if (trade.reason) {
                lines.push({ text: '策略: ' + trade.reason, color: '#86efac' });
            }
        } else {
            var pnlSign = trade.pnl_pct >= 0 ? '+' : '';
            var pnlColor = trade.pnl_pct >= 0 ? '#ef4444' : '#22c55e';
            lines.push({ text: '收益: ' + pnlSign + trade.pnl_pct.toFixed(2) + '%  持仓' + trade.hold_days + '天', color: pnlColor });
            if (trade.reason) {
                lines.push({ text: '方式: ' + trade.reason, color: '#fca5a5' });
            }
        }

        // ── 原因详解 ──
        var detail = trade.reason_detail;
        if (detail) {
            lines.push({ text: '── 原因详解 ──', color: '#f59e0b' });
            if (isBuy && typeof detail === 'object') {
                // 买入：F1/F2/F3 结构化展示
                var keys = Object.keys(detail);
                for (var k = 0; k < keys.length; k++) {
                    var key = keys[k];
                    lines.push({ text: key, color: '#86efac' });
                    lines.push({ text: '  ' + detail[key], color: '#9ca3af' });
                }
            } else if (!isBuy && typeof detail === 'string') {
                // 卖出：描述文本
                lines.push({ text: detail, color: '#fca5a5' });
            }
        }

        // ── 板块RPS ──
        if (blockRpsList.length > 0) {
            lines.push({ text: '── 板块RPS ──', color: '#6b7280' });
            for (var i = 0; i < blockRpsList.length; i++) {
                var br = blockRpsList[i];
                var r20Str = br.r20 != null ? br.r20.toFixed(1) : '--';
                var r60Str = br.r60 != null ? br.r60.toFixed(1) : '--';
                var r120Str = br.r120 != null ? br.r120.toFixed(1) : '--';

                // RPS 颜色：>=90 红色高亮, >=80 橙色, 其他灰色
                var r20Color = br.r20 >= 90 ? '#ef4444' : (br.r20 >= 80 ? '#f59e0b' : '#9ca3af');
                var r60Color = br.r60 >= 90 ? '#ef4444' : (br.r60 >= 80 ? '#f59e0b' : '#9ca3af');
                var r120Color = br.r120 >= 90 ? '#ef4444' : (br.r120 >= 80 ? '#f59e0b' : '#9ca3af');

                lines.push({ text: br.code + ' ' + br.name, color: '#e5e7eb' });
                lines.push({
                    text: '  R20:' + r20Str + '  R60:' + r60Str + '  R120:' + r120Str,
                    color: '#d1d5db',
                    _rpsColors: [r20Color, r60Color, r120Color],
                    _rpsValues: [r20Str, r60Str, r120Str],
                });
            }
        }

        // 计算面板尺寸
        var fontSize = 11;
        var lineH = 15;
        var padX = 8, padY = 6;
        var maxW = 0;
        ctx.font = fontSize + 'px monospace';
        for (var i = 0; i < lines.length; i++) {
            var tw = ctx.measureText(lines[i].text).width;
            if (tw > maxW) maxW = tw;
        }
        // 最小宽度
        if (maxW < 180) maxW = 180;
        var panelW = maxW + padX * 2;
        var panelH = lines.length * lineH + padY * 2;

        // 定位：跟随鼠标，避免超出画布
        var px = mouseX + 16;
        var py = mouseY - panelH - 10;
        if (px + panelW > ctx.canvas.width) px = mouseX - panelW - 16;
        if (py < 0) py = mouseY + 16;

        // 绘制面板
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        ctx.strokeStyle = '#4B5563';
        ctx.lineWidth = 1;
        ctx.fillRect(px, py, panelW, panelH);
        ctx.strokeRect(px, py, panelW, panelH);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = fontSize + 'px monospace';

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var ty = py + padY + i * lineH;

            if (line._rpsColors) {
                // RPS值行：分段渲染不同颜色
                var prefix = '  R20:';
                var mid = '  R60:';
                var suffix = '  R120:';
                var preW = ctx.measureText(prefix).width;
                var midW = ctx.measureText(prefix + line._rpsValues[0] + mid).width;

                ctx.fillStyle = '#d1d5db';
                ctx.fillText(prefix, px + padX, ty);
                ctx.fillStyle = line._rpsColors[0];
                ctx.fillText(line._rpsValues[0], px + padX + preW, ty);

                ctx.fillStyle = '#d1d5db';
                ctx.fillText(mid, px + padX + preW + ctx.measureText(line._rpsValues[0]).width, ty);
                ctx.fillStyle = line._rpsColors[1];
                ctx.fillText(line._rpsValues[1], px + padX + midW, ty);

                ctx.fillStyle = '#d1d5db';
                ctx.fillText(suffix, px + padX + midW + ctx.measureText(line._rpsValues[1]).width, ty);
                ctx.fillStyle = line._rpsColors[2];
                ctx.fillText(line._rpsValues[2], px + padX + midW + ctx.measureText(line._rpsValues[1]).width + ctx.measureText(suffix).width - ctx.measureText(' ').width, ty);
            } else {
                ctx.fillStyle = line.color;
                ctx.fillText(line.text, px + padX, ty);
            }
        }
        ctx.restore();
    },
};
