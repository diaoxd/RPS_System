// 涨停箱体叠加层模块
// 在日线 K 线图上渲染涨停箱体区间（按 box_size 取前三大）：
//   - 最大箱体（蓝）：斐波那契色带 + 三角标记
//   - 第二大箱体（绿）：斐波那契色带 + 三角标记
//   - 第三大箱体（橙）：斐波那契色带 + 三角标记
//   三者去重：若 bottom_date|top_date 相同则只渲染一次，以后出现的标记为准

var LimitUpBoxOverlay = {
    enabled: true,
    chart: null,

    // 缓存 + 异步获取
    _cacheCode: null,
    _cacheResult: null,
    _dataCache: {},     // code → renderList (持久缓存)
    _fetching: {},      // code → bool (防重入)
    _apiBase: 'http://localhost:5001',

    init: function (chart) {
        this.chart = chart;
    },

    _resolveCode: function () {
        if (!this.chart || !this.chart.currentStockCode) return null;
        return this.chart.currentStockCode.replace(/^(sh|sz|bj)/i, '');
    },

    // ── 数据获取（异步 + 缓存） ──

    _getStockData: function () {
        var code = this._resolveCode();
        if (!code) return null;

        // 同一股票，直接返回缓存
        if (code === this._cacheCode) return this._cacheResult;

        // 切换股票：先展示旧数据（如果有），同时触发新获取
        var oldResult = this._cacheResult;
        this._cacheCode = code;

        // 检查内存缓存
        if (this._dataCache.hasOwnProperty(code)) {
            this._cacheResult = this._dataCache[code];
            return this._cacheResult;
        }

        // 没缓存：返回旧数据避免闪烁，触发异步获取
        this._cacheResult = null;
        this._fetchBoxData(code);
        return null;
    },

    _fetchBoxData: function (code) {
        var self = this;
        if (self._fetching[code]) return;
        self._fetching[code] = true;

        var url = self._apiBase + '/api/limit-up-box/' + code;
        fetch(url)
            .then(function (r) { return r.json(); })
            .then(function (result) {
                self._fetching[code] = false;
                if (result.ok && result.data) {
                    var renderList = self._buildRenderList(result.data);
                    self._dataCache[code] = renderList;
                    if (self._cacheCode === code) {
                        self._cacheResult = renderList;
                        if (self.chart && self.chart.requestRender) {
                            self.chart.requestRender();
                        }
                    }
                } else {
                    self._dataCache[code] = null;
                }
            })
            .catch(function () {
                self._fetching[code] = false;
            });
    },

    _buildRenderList: function (stockData) {
        if (!stockData || !stockData.boxes || stockData.boxes.length === 0) return null;

        var boxes = stockData.boxes;
        var idx1 = stockData.largest_idx;
        var idx2 = stockData.second_largest_idx;
        var idx3 = stockData.third_largest_idx;

        var renderList = [];
        var seen = {};

        var configs = [
            { role: 'largest',         color: '#3b82f6', fillColor: 'rgba(59, 130, 246, 0.06)', label: '第1大' },
            { role: 'second_largest',  color: '#22c55e', fillColor: 'rgba(34, 197, 94, 0.05)',  label: '第2大' },
            { role: 'third_largest',   color: '#f59e0b', fillColor: 'rgba(245, 158, 11, 0.05)', label: '第3大' },
        ];
        var indices = [idx1, idx2, idx3];

        for (var i = 0; i < indices.length; i++) {
            var b = boxes[indices[i]];
            var key = b.bottom_date + '|' + b.top_date;
            if (!seen[key]) {
                seen[key] = true;
                renderList.push({
                    box: b,
                    role: configs[i].role,
                    color: configs[i].color,
                    fillColor: configs[i].fillColor,
                    label: configs[i].label,
                });
            }
        }

        return renderList.length > 0 ? renderList : null;
    },

    _invalidateCache: function () {
        // no-op: 缓存由 _getStockData 管理，切换股票时自动刷新
    },

    // ── 坐标转换 ──

    _dateToIndex: function (dateStr) {
        if (!this.chart || !this.chart.candles) return undefined;
        var candles = this.chart.candles;
        for (var i = 0; i < candles.length; i++) {
            var d = candles[i].day || candles[i].date || '';
            var key = String(d).trim();
            if (key.indexOf('-') === -1 && key.length === 8) {
                key = key.substring(0, 4) + '-' + key.substring(4, 6) + '-' + key.substring(6, 8);
            }
            if (key === dateStr) return i;
        }
        return undefined;
    },

    _isVisible: function (index) {
        if (index === undefined || index === null) return false;
        var cw = this.chart.currentCandleWidth || 6;
        var w = this.chart.canvas.width;
        var x = index * cw + cw / 2 + this.chart.offsetX;
        return x >= -cw && x <= w + cw;
    },

    _getX: function (index) {
        var cw = this.chart.currentCandleWidth || 6;
        return index * cw + cw / 2 + this.chart.offsetX;
    },

    _firstVisibleIndex: function () {
        var cw = this.chart.currentCandleWidth || 6;
        var offsetX = this.chart.offsetX || 0;
        return Math.floor(-offsetX / cw);
    },

    _lastVisibleIndex: function () {
        var cw = this.chart.currentCandleWidth || 6;
        var offsetX = this.chart.offsetX || 0;
        var w = this.chart.canvas.width;
        return Math.ceil((w - offsetX) / cw);
    },

    _boxInView: function (bottomIdx, endIdx) {
        var firstVis = this._firstVisibleIndex();
        var lastVis = this._lastVisibleIndex();
        return bottomIdx <= lastVis && endIdx >= firstVis;
    },

    // ── 主渲染入口 ──

    render: function (ctx) {
        if (!this.enabled) return;
        if (!this.chart || !this.chart.candles || this.chart.candles.length === 0) return;
        if (this.chart.currentPeriod !== 'daily') return;

        this._invalidateCache();
        var renderList = this._getStockData();
        if (!renderList || renderList.length === 0) return;

        for (var i = 0; i < renderList.length; i++) {
            this._renderBox(ctx, renderList[i]);
        }
    },

    // ── 渲染单个箱体 ──

    _renderBox: function (ctx, entry) {
        var box = entry.box;
        var bottomIdx = this._dateToIndex(box.bottom_date);
        // 右边界用 break_date（箱体持续到被突破那天）
        var endIdx = this._dateToIndex(box.break_date || box.top_date);
        if (bottomIdx === undefined || endIdx === undefined) return;
        if (!this._boxInView(bottomIdx, endIdx)) return;

        var cw = this.chart.currentCandleWidth || 6;
        var offsetX = this.chart.offsetX || 0;
        var canvasW = this.chart.canvas.width;
        var canvasH = this.chart.canvas.height;

        var x1 = Math.max(0, bottomIdx * cw + offsetX);
        var x2 = Math.min(canvasW, (endIdx + 1) * cw + offsetX);
        var yBottom = this.chart.priceToCanvasY(box.bottom_price);
        var yTop = this.chart.priceToCanvasY(box.top_price);
        if (yBottom === null || yTop === null) return;

        // 标记是否已突破
        var isBroken = (box.break_date && box.break_date !== box.top_date);

        ctx.save();

        // ── 斐波那契色带（三大箱体全部渲染） ──
        this._renderFibBands(ctx, box, x1, x2, yTop, yBottom);

        // ── 箱体底色 ──
        ctx.fillStyle = entry.fillColor;
        ctx.fillRect(x1, yTop, x2 - x1, yBottom - yTop);

        // ── 边框虚线 ──
        ctx.strokeStyle = entry.color;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(x1, yTop, x2 - x1, yBottom - yTop);
        ctx.setLineDash([]);

        // ── 标签（右上角） ──
        var label = (entry.label || '') + ' ' + box.box_size.toFixed(1) + '%';
        ctx.fillStyle = entry.color;
        ctx.font = '9px monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(label, x2 - 3, yTop - 2);

        // ── 底部和顶部小三角标记 ──
        var topIdx = this._dateToIndex(box.top_date);
        var bx = this._getX(bottomIdx);
        var tx = this._getX(topIdx);

        if (this._isVisible(bottomIdx)) {
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.moveTo(bx, yBottom + 4);
            ctx.lineTo(bx - 4, yBottom + 10);
            ctx.lineTo(bx + 4, yBottom + 10);
            ctx.closePath();
            ctx.fill();
            ctx.fillText('底', bx, yBottom + 12);
        }
        if (this._isVisible(topIdx)) {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(tx, yTop - 4);
            ctx.lineTo(tx - 4, yTop - 10);
            ctx.lineTo(tx + 4, yTop - 10);
            ctx.closePath();
            ctx.fill();
            ctx.textBaseline = 'bottom';
            ctx.fillText('顶', tx, yTop - 11);
        }

        ctx.restore();
    },

    // ── 斐波那契色带 ──

    _renderFibBands: function (ctx, box, x1, x2, yTop, yBottom) {
        var boxHeight = box.top_price - box.bottom_price;
        if (boxHeight <= 0) return;

        // 0.618 和 0.382 价格水平
        var price618 = box.bottom_price + 0.618 * boxHeight;
        var price382 = box.bottom_price + 0.382 * boxHeight;

        var y618 = this.chart.priceToCanvasY(price618);
        var y382 = this.chart.priceToCanvasY(price382);
        if (y618 === null || y382 === null) return;

        // 黄带: top → 0.618（上方 38.2%）
        ctx.fillStyle = 'rgba(250, 204, 21, 0.12)';  // 浅黄色半透明
        ctx.fillRect(x1, yTop, x2 - x1, y618 - yTop);

        // 褐带: bottom → 0.382（下方 38.2%）
        ctx.fillStyle = 'rgba(180, 83, 9, 0.10)';   // 褐色半透明
        ctx.fillRect(x1, y382, x2 - x1, yBottom - y382);

        // 0.618 水平线（黄色虚线）
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x1, y618);
        ctx.lineTo(x2, y618);
        ctx.stroke();

        // 0.382 水平线（褐色虚线）
        ctx.strokeStyle = 'rgba(180, 83, 9, 0.4)';
        ctx.beginPath();
        ctx.moveTo(x1, y382);
        ctx.lineTo(x2, y382);
        ctx.stroke();
        ctx.setLineDash([]);

        // 左侧 Fibonacci 标签
        ctx.font = '8px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(250, 204, 21, 0.7)';
        ctx.fillText('0.618', x1 + 2, y618 - 1);
        ctx.fillStyle = 'rgba(180, 83, 9, 0.7)';
        ctx.fillText('0.382', x1 + 2, y382 - 1);
    },

    // ── 悬浮检测 ──

    hitTest: function (mouseX, mouseY) {
        if (!this.enabled || !this.chart || this.chart.currentPeriod !== 'daily') return null;

        var renderList = this._getStockData();
        if (!renderList) return null;

        var cw = this.chart.currentCandleWidth || 6;
        var offsetX = this.chart.offsetX || 0;

        for (var i = 0; i < renderList.length; i++) {
            var box = renderList[i].box;
            var bottomIdx = this._dateToIndex(box.bottom_date);
            var endIdx = this._dateToIndex(box.break_date || box.top_date);
            if (bottomIdx === undefined || endIdx === undefined) continue;

            var x1 = bottomIdx * cw + offsetX;
            var x2 = (endIdx + 1) * cw + offsetX;
            var yTop = this.chart.priceToCanvasY(box.top_price);
            var yBottom = this.chart.priceToCanvasY(box.bottom_price);
            if (yTop === null || yBottom === null) continue;

            if (mouseX >= x1 && mouseX <= x2 && mouseY >= yTop && mouseY <= yBottom) {
                return renderList[i];
            }
        }
        return null;
    },

    // ── 悬浮提示 ──

    renderTooltip: function (ctx) {
        if (!this.enabled || !this.chart || this.chart.currentPeriod !== 'daily') return;
        if (!this.chart.isMouseOverCanvas) return;

        var mouseX = this.chart.mouseX;
        var mouseY = this.chart.mouseY;
        if (mouseX == null || mouseY == null) return;

        var entry = this.hitTest(mouseX, mouseY);
        if (!entry) return;

        var box = entry.box;
        var roleLabel = (entry.label || '箱体') + '箱体';

        var boxHeight = box.top_price - box.bottom_price;
        var price618 = box.bottom_price + 0.618 * boxHeight;
        var price382 = box.bottom_price + 0.382 * boxHeight;

        var isBroken = (box.break_date && box.break_date !== box.top_date);
        var breakLabel = isBroken ? '突破日' : '持续中';

        var lines = [
            { text: roleLabel + '  ' + box.box_size.toFixed(1) + '%', color: entry.color },
            { text: '箱顶: ' + box.top_price.toFixed(2) + '  (' + box.top_date + ')', color: '#e5e7eb' },
            { text: '箱底: ' + box.bottom_price.toFixed(2) + '  (' + box.bottom_date + ')', color: '#e5e7eb' },
            { text: breakLabel + ': ' + (box.break_date || box.top_date), color: isBroken ? '#f87171' : '#4ade80' },
            { text: '── 斐波那契 ──', color: '#6b7280' },
            { text: '0.618: ' + price618.toFixed(2), color: 'rgba(250, 204, 21, 0.9)' },
            { text: '0.382: ' + price382.toFixed(2), color: 'rgba(180, 83, 9, 0.9)' },
        ];

        var fontSize = 11;
        var lineH = 15;
        var padX = 8, padY = 6;
        var maxW = 0;
        ctx.font = fontSize + 'px monospace';
        for (var i = 0; i < lines.length; i++) {
            var tw = ctx.measureText(lines[i].text).width;
            if (tw > maxW) maxW = tw;
        }
        var panelW = maxW + padX * 2;
        var panelH = lines.length * lineH + padY * 2;

        var px = mouseX + 16;
        var py = mouseY - panelH - 10;
        if (px + panelW > ctx.canvas.width) px = mouseX - panelW - 16;
        if (py < 0) py = mouseY + 16;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.88)';
        ctx.strokeStyle = entry.color;
        ctx.lineWidth = 1;
        ctx.fillRect(px, py, panelW, panelH);
        ctx.strokeRect(px, py, panelW, panelH);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = fontSize + 'px monospace';

        for (var i = 0; i < lines.length; i++) {
            ctx.fillStyle = lines[i].color;
            ctx.fillText(lines[i].text, px + padX, py + padY + i * lineH);
        }
        ctx.restore();
    },
};
