// K线绘图工具核心逻辑
function KlineChart() {
    this.canvas = document.getElementById('klineCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.tool = 'candle'; // 默认工具
    this.isDrawing = false;
    this.startPoint = null;
    this.lines = [];
    this.candles = [];
    this.currentStockCode = 'sh000001';
    this.currentPeriod = 'daily';
    this.dailyPrevClose = null; // 日线前收盘价，用于计算涨跌停
    this.currentPriceLabelRect = null; // 现价标签位置，用于点击检测
    this.confirmDialogCallback = null; // 确认对话框回调
    
    // 加载状态
    this.isLoading = false;
    
    // 缩放相关属性
    this.scale = 1.0;
    this.offsetX = 0;
    this.minScale = 0.1;
    this.maxScale = 33.0;
    
    // 拖拽相关属性
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartOffsetX = 0;
    this.dragStartY = 0;
    this.dragStartScale = 1.0;
    
    // 性能优化相关属性
    this.isAnimating = false;
    this.renderQueue = [];
    
    // 鼠标位置（用于MA提示）
    this.mouseX = 0;
    this.mouseY = 0;
    this.isMouseOverCanvas = false;
    this.isContextMenuShowing = false; // 用于控制是否显示均线信息
    
    // 画线工具窗口相关
    this.drawToolsWindow = null;
    this.drawToolsHeader = null;
    this.isDrawToolsDragging = false;
    this.drawToolsDragStartX = 0;
    this.drawToolsDragStartY = 0;
    this.drawToolsPositionStorageKey = 'draw-tools-window-position';

    this.init();
}

// 初始化方法
KlineChart.prototype.init = function() {
    console.log('开始初始化K线图表...');
    
    // 检查canvas元素是否存在
    if (!this.canvas) {
        console.error('Canvas元素不存在！');
        return;
    }
    
    console.log('Canvas元素已找到，开始设置尺寸...');
    
    // 设置canvas尺寸
    this.resizeCanvas();

    // 绑定事件
    this.bindEvents();

    // 初始化API
    this.api = new KlineAPI();
    
    // 初始化画线数据管理器
    this.drawingManager = new DrawingDataManager();
    
    // 初始化两点买入功能
    this.twoPointBuy = new TwoPointBuy(this);
    
    // 初始化两点卖出功能
    this.twoPointSell = new TwoPointSell(this);
    
    // 初始化三点买入功能
    this.threePointBuy = new ThreePointBuy(this);
    
    // 初始化三点卖出功能
    this.threePointSell = new ThreePointSell(this);
    
    // 初始化顶底K线功能
    this.topBottomKline = new TopBottomKline(this);
    
    // 初始化跳空缺口功能
    this.gapDetection = new GapDetection(this);
    this.gapDetection.enabled = true; // 默认开启缺口显示
    
    // 初始化MACD指标功能
    this.macdIndicator = new MACDIndicator(this);
    
    // 初始化MA均线指标功能
    this.maIndicator = new MAIndicator(this);
    
    // 初始化BOLL布林通道指标功能
    this.bollIndicator = new BOLLIndicator(this);
    
    // 初始化KDJ指标功能
    this.kdjIndicator = new KDJIndicator(this);
    
    // 初始化WR指标功能
    this.wrIndicator = new WRIndicator(this);
    
    // 初始化RSI指标功能
    this.rsiIndicator = new RSIIndicator(this);
    
    // 初始化成交量指标功能
    this.volumeIndicator = new VolumeIndicator(this);
    
    // 初始化量能统计功能
    this.volumeStatistics = new VolumeStatistics(this);
    
    // 初始化十字星功能
    this.crosshair = new Crosshair(this);
    
    // 初始化矩形绘制功能
    this.rectangleDrawing = new RectangleDrawing(this);
    
    // 初始化线段绘制功能
    this.lineDrawing = new LineDrawing(this);
    
    // 初始化射线绘制功能
    this.rayDrawing = new RayDrawing(this);
    
    // 初始化水平线绘制功能
    this.horizontalLineDrawing = new HorizontalLineDrawing(this);
    
    // 初始化垂直线绘制功能
    this.verticalLineDrawing = new VerticalLineDrawing(this);

    // 初始化标价线绘制功能
    this.priceLineDrawing = new PriceLineDrawing(this);

    // 初始化平行线绘制功能
    this.parallelLineDrawing = new ParallelLineDrawing(this);

    // 初始化圆形绘制功能
    this.circleDrawing = new CircleDrawing(this);

    // 初始化文字绘制功能
    this.textDrawing = new TextDrawing(this);

    // 初始化箭头绘制功能
    this.arrowDrawing = new ArrowDrawing(this);

    // 初始化黄金分割绘制功能
    this.goldenSectionDrawing = new GoldenSectionDrawing(this);

    // 初始化江恩线绘制功能
    this.gannLineDrawing = new GannLineDrawing(this);

    // 初始化测量距离工具
    this.measureDistance = new MeasureDistance(this);



    // 初始化周期按钮状态
    this.updatePeriodButtonState('daily');
    
    // 初始化确认对话框
    this.initConfirmDialog();
    
    // 初始化MACD参数设置对话框
    this.initMACDSettingsDialog();
    
    // 初始化KDJ参数设置对话框
    this.initKDJSettingsDialog();
    
    // 初始化WR参数设置对话框
    this.initWRSettingsDialog();
    
    // 初始化RSI参数设置对话框
    this.initRSISettingsDialog();
    
    // 初始化MA均线参数设置对话框
    this.initMASettingsDialog();
    
    // 初始化BOLL参数设置对话框
    this.initBOLLSettingsDialog();
    
    // 初始化成交量均线设置对话框
    this.initVolumeSettingsDialog();
};

// 初始化确认对话框
KlineChart.prototype.initConfirmDialog = function() {
    var self = this;
    
    // 获取对话框元素
    this.confirmDialogOverlay = document.getElementById('confirm-dialog-overlay');
    this.confirmDialogTitle = document.getElementById('confirm-dialog-title');
    this.confirmDialogMessage = document.getElementById('confirm-dialog-message');
    this.confirmDialogBtnCancel = document.getElementById('confirm-dialog-btn-cancel');
    this.confirmDialogBtnConfirm = document.getElementById('confirm-dialog-btn-confirm');
    
    // 绑定取消按钮事件
    if (this.confirmDialogBtnCancel) {
        this.confirmDialogBtnCancel.onclick = function() {
            self.hideConfirmDialog();
            if (self.confirmDialogCallback) {
                self.confirmDialogCallback(false);
                self.confirmDialogCallback = null;
            }
        };
    }
    
    // 绑定确认按钮事件
    if (this.confirmDialogBtnConfirm) {
        this.confirmDialogBtnConfirm.onclick = function() {
            self.hideConfirmDialog();
            if (self.confirmDialogCallback) {
                self.confirmDialogCallback(true);
                self.confirmDialogCallback = null;
            }
        };
    }
    
    // 点击遮罩层关闭
    if (this.confirmDialogOverlay) {
        this.confirmDialogOverlay.onclick = function(e) {
            if (e.target === self.confirmDialogOverlay) {
                self.hideConfirmDialog();
                if (self.confirmDialogCallback) {
                    self.confirmDialogCallback(false);
                    self.confirmDialogCallback = null;
                }
            }
        };
    }
};

// 显示确认对话框
KlineChart.prototype.showConfirmDialog = function(title, message, callback) {
    if (this.confirmDialogTitle) {
        this.confirmDialogTitle.textContent = title || '确认操作';
    }
    if (this.confirmDialogMessage) {
        this.confirmDialogMessage.innerHTML = message || '';
    }
    if (callback) {
        this.confirmDialogCallback = callback;
    }
    if (this.confirmDialogOverlay) {
        this.confirmDialogOverlay.style.display = 'flex';
    }
};

// 隐藏确认对话框
KlineChart.prototype.hideConfirmDialog = function() {
    if (this.confirmDialogOverlay) {
        this.confirmDialogOverlay.style.display = 'none';
    }
};

// 初始化MACD参数设置对话框
KlineChart.prototype.initMACDSettingsDialog = function() {
    var self = this;
    
    // 获取对话框元素
    this.contextMenu = document.getElementById('context-menu');
    this.contextMenuMacdSettings = document.getElementById('context-menu-macd-settings');
    this.macdSettingsOverlay = document.getElementById('macd-settings-overlay');
    this.macdShortPeriodInput = document.getElementById('macd-short-period');
    this.macdLongPeriodInput = document.getElementById('macd-long-period');
    this.macdSignalPeriodInput = document.getElementById('macd-signal-period');
    this.macdSettingsBtnCancel = document.getElementById('macd-settings-btn-cancel');
    this.macdSettingsBtnDefault = document.getElementById('macd-settings-btn-default');
    this.macdSettingsBtnConfirm = document.getElementById('macd-settings-btn-confirm');
    
    // 绑定右键菜单项事件
    if (this.contextMenuMacdSettings) {
        this.contextMenuMacdSettings.onclick = function() {
            self.hideContextMenu();
            self.showMACDSettingsDialog();
        };
    }
    
    // 绑定取消按钮事件
    if (this.macdSettingsBtnCancel) {
        this.macdSettingsBtnCancel.onclick = function() {
            self.hideMACDSettingsDialog();
        };
    }
    
    // 绑定默认按钮事件
    if (this.macdSettingsBtnDefault) {
        this.macdSettingsBtnDefault.onclick = function() {
            self.resetMACDSettingsToDefault();
        };
    }
    
    // 绑定确认按钮事件
    if (this.macdSettingsBtnConfirm) {
        this.macdSettingsBtnConfirm.onclick = function() {
            self.applyMACDSettings();
        };
    }
    
    // 绑定输入框实时更新事件
    if (this.macdShortPeriodInput) {
        this.macdShortPeriodInput.addEventListener('input', function() {
            self.updateMACDSettingsRealtime();
        });
    }
    if (this.macdLongPeriodInput) {
        this.macdLongPeriodInput.addEventListener('input', function() {
            self.updateMACDSettingsRealtime();
        });
    }
    if (this.macdSignalPeriodInput) {
        this.macdSignalPeriodInput.addEventListener('input', function() {
            self.updateMACDSettingsRealtime();
        });
    }
    
    // 点击遮罩层关闭
    if (this.macdSettingsOverlay) {
        this.macdSettingsOverlay.onclick = function(e) {
            if (e.target === self.macdSettingsOverlay) {
                self.hideMACDSettingsDialog();
            }
        };
    }
    
    // 点击其他地方关闭右键菜单
    document.addEventListener('click', function() {
        self.hideContextMenu();
    });
};

// 显示右键菜单
KlineChart.prototype.showContextMenu = function(x, y) {
    if (this.contextMenu) {
        this.contextMenu.style.left = x + 'px';
        this.contextMenu.style.top = y + 'px';
        this.contextMenu.style.display = 'block';
    }
};

// 隐藏右键菜单
KlineChart.prototype.hideContextMenu = function() {
    if (this.contextMenu) {
        this.contextMenu.style.display = 'none';
    }
    // 重置标志，允许显示均线信息
    this.isContextMenuShowing = false;
};

// 隐藏所有工具的右键菜单
KlineChart.prototype.hideAllContextMenus = function() {
    // 隐藏主图表右键菜单
    this.hideContextMenu();
    
    // 隐藏所有画线工具的右键菜单
    if (this.rectangleDrawing && this.rectangleDrawing.hideContextMenu) {
        this.rectangleDrawing.hideContextMenu();
    }
    if (this.lineDrawing && this.lineDrawing.hideContextMenu) {
        this.lineDrawing.hideContextMenu();
    }
    if (this.rayDrawing && this.rayDrawing.hideContextMenu) {
        this.rayDrawing.hideContextMenu();
    }
    if (this.horizontalLineDrawing && this.horizontalLineDrawing.hideContextMenu) {
        this.horizontalLineDrawing.hideContextMenu();
    }
    if (this.verticalLineDrawing && this.verticalLineDrawing.hideContextMenu) {
        this.verticalLineDrawing.hideContextMenu();
    }
    if (this.priceLineDrawing && this.priceLineDrawing.hideContextMenu) {
        this.priceLineDrawing.hideContextMenu();
    }
    if (this.parallelLineDrawing && this.parallelLineDrawing.hideContextMenu) {
        this.parallelLineDrawing.hideContextMenu();
    }
    if (this.circleDrawing && this.circleDrawing.hideContextMenu) {
        this.circleDrawing.hideContextMenu();
    }
    if (this.textDrawing && this.textDrawing.hideContextMenu) {
        this.textDrawing.hideContextMenu();
    }
    if (this.arrowDrawing && this.arrowDrawing.hideContextMenu) {
        this.arrowDrawing.hideContextMenu();
    }
    if (this.goldenSectionDrawing && this.goldenSectionDrawing.hideContextMenu) {
        this.goldenSectionDrawing.hideContextMenu();
    }
    if (this.gannLineDrawing && this.gannLineDrawing.hideContextMenu) {
        this.gannLineDrawing.hideContextMenu();
    }
    if (this.measureDistance && this.measureDistance.hideContextMenu) {
        this.measureDistance.hideContextMenu();
    }
    
    // 隐藏两买两卖三买三卖的右键菜单
    if (this.twoPointBuy && this.twoPointBuy.hideContextMenu) {
        this.twoPointBuy.hideContextMenu();
    }
    if (this.twoPointSell && this.twoPointSell.hideContextMenu) {
        this.twoPointSell.hideContextMenu();
    }
    if (this.threePointBuy && this.threePointBuy.hideContextMenu) {
        this.threePointBuy.hideContextMenu();
    }
    if (this.threePointSell && this.threePointSell.hideContextMenu) {
        this.threePointSell.hideContextMenu();
    }
};

// 显示MACD参数设置对话框
KlineChart.prototype.showMACDSettingsDialog = function() {
    console.log('Showing MACD settings dialog, current params:', 
        this.macdIndicator.shortPeriod, 
        this.macdIndicator.longPeriod, 
        this.macdIndicator.signalPeriod);
    
    if (this.macdShortPeriodInput) {
        this.macdShortPeriodInput.value = this.macdIndicator.shortPeriod;
    }
    if (this.macdLongPeriodInput) {
        this.macdLongPeriodInput.value = this.macdIndicator.longPeriod;
    }
    if (this.macdSignalPeriodInput) {
        this.macdSignalPeriodInput.value = this.macdIndicator.signalPeriod;
    }
    if (this.macdSettingsOverlay) {
        this.macdSettingsOverlay.style.display = 'flex';
    }
};

// 重置MACD参数为默认值
KlineChart.prototype.resetMACDSettingsToDefault = function() {
    if (this.macdShortPeriodInput) {
        this.macdShortPeriodInput.value = 12;
    }
    if (this.macdLongPeriodInput) {
        this.macdLongPeriodInput.value = 26;
    }
    if (this.macdSignalPeriodInput) {
        this.macdSignalPeriodInput.value = 9;
    }
    // 实时更新显示
    this.updateMACDSettingsRealtime();
};

// 实时更新MACD参数
KlineChart.prototype.updateMACDSettingsRealtime = function() {
    var shortPeriod = parseInt(this.macdShortPeriodInput.value) || 12;
    var longPeriod = parseInt(this.macdLongPeriodInput.value) || 26;
    var signalPeriod = parseInt(this.macdSignalPeriodInput.value) || 9;
    
    // 设置参数
    this.macdIndicator.setParams(shortPeriod, longPeriod, signalPeriod);
    
    // 重新计算MACD
    if (this.candles && this.candles.length > 0) {
        this.macdIndicator.calculateMACD(this.candles);
    }
    
    // 重绘
    this.requestRender();
};

// 初始化KDJ参数设置对话框
KlineChart.prototype.initKDJSettingsDialog = function() {
    var self = this;
    
    // 获取对话框元素
    this.contextMenuKdjSettings = document.getElementById('context-menu-kdj-settings');
    this.kdjSettingsOverlay = document.getElementById('kdj-settings-overlay');
    this.kdjNInput = document.getElementById('kdj-n');
    this.kdjM1Input = document.getElementById('kdj-m1');
    this.kdjM2Input = document.getElementById('kdj-m2');
    this.kdjWrNInput = document.getElementById('kdj-wr-n');
    this.kdjOversoldLineInput = document.getElementById('kdj-oversold-line');
    this.kdjOverboughtLineInput = document.getElementById('kdj-overbought-line');
    this.kdjOversoldTopInput = document.getElementById('kdj-oversold-top');
    this.kdjOverboughtBottomInput = document.getElementById('kdj-overbought-bottom');
    this.kdjSettingsBtnCancel = document.getElementById('kdj-settings-btn-cancel');
    this.kdjSettingsBtnDefault = document.getElementById('kdj-settings-btn-default');
    this.kdjSettingsBtnConfirm = document.getElementById('kdj-settings-btn-confirm');
    
    // 绑定右键菜单项事件
    if (this.contextMenuKdjSettings) {
        this.contextMenuKdjSettings.onclick = function() {
            self.hideContextMenu();
            self.showKDJSettingsDialog();
        };
    }
    
    // 绑定取消按钮事件
    if (this.kdjSettingsBtnCancel) {
        this.kdjSettingsBtnCancel.onclick = function() {
            self.hideKDJSettingsDialog();
        };
    }
    
    // 绑定默认按钮事件
    if (this.kdjSettingsBtnDefault) {
        this.kdjSettingsBtnDefault.onclick = function() {
            self.resetKDJSettingsToDefault();
        };
    }
    
    // 绑定确认按钮事件
    if (this.kdjSettingsBtnConfirm) {
        this.kdjSettingsBtnConfirm.onclick = function() {
            self.applyKDJSettings();
        };
    }
    
    // 点击遮罩层关闭
    if (this.kdjSettingsOverlay) {
        this.kdjSettingsOverlay.onclick = function(e) {
            if (e.target === self.kdjSettingsOverlay) {
                self.hideKDJSettingsDialog();
            }
        };
    }
    
    // 绑定输入框实时更新事件
    if (this.kdjNInput) {
        this.kdjNInput.addEventListener('input', function() {
            self.updateKDJSettingsRealtime();
        });
    }
    if (this.kdjM1Input) {
        this.kdjM1Input.addEventListener('input', function() {
            self.updateKDJSettingsRealtime();
        });
    }
    if (this.kdjM2Input) {
        this.kdjM2Input.addEventListener('input', function() {
            self.updateKDJSettingsRealtime();
        });
    }
    if (this.kdjWrNInput) {
        this.kdjWrNInput.addEventListener('input', function() {
            self.updateKDJSettingsRealtime();
        });
    }
    if (this.kdjOversoldLineInput) {
        this.kdjOversoldLineInput.addEventListener('input', function() {
            self.updateKDJSettingsRealtime();
        });
    }
    if (this.kdjOverboughtLineInput) {
        this.kdjOverboughtLineInput.addEventListener('input', function() {
            self.updateKDJSettingsRealtime();
        });
    }
    if (this.kdjOversoldTopInput) {
        this.kdjOversoldTopInput.addEventListener('input', function() {
            self.updateKDJSettingsRealtime();
        });
    }
    if (this.kdjOverboughtBottomInput) {
        this.kdjOverboughtBottomInput.addEventListener('input', function() {
            self.updateKDJSettingsRealtime();
        });
    }
};

// 显示KDJ参数设置对话框
KlineChart.prototype.showKDJSettingsDialog = function() {
    console.log('Showing KDJ settings dialog, current params:', 
        this.kdjIndicator.kdjN, 
        this.kdjIndicator.kdjM1, 
        this.kdjIndicator.kdjM2,
        this.kdjIndicator.wrN,
        this.kdjIndicator.oversoldLine,
        this.kdjIndicator.overboughtLine,
        this.kdjIndicator.oversoldTop,
        this.kdjIndicator.overboughtBottom);
    
    if (this.kdjNInput) {
        this.kdjNInput.value = this.kdjIndicator.kdjN;
    }
    if (this.kdjM1Input) {
        this.kdjM1Input.value = this.kdjIndicator.kdjM1;
    }
    if (this.kdjM2Input) {
        this.kdjM2Input.value = this.kdjIndicator.kdjM2;
    }
    if (this.kdjWrNInput) {
        this.kdjWrNInput.value = this.kdjIndicator.wrN;
    }
    if (this.kdjOversoldTopInput) {
        this.kdjOversoldTopInput.value = this.kdjIndicator.oversoldTop;
    }
    if (this.kdjOversoldLineInput) {
        this.kdjOversoldLineInput.value = this.kdjIndicator.oversoldLine;
    }
    if (this.kdjOverboughtLineInput) {
        this.kdjOverboughtLineInput.value = this.kdjIndicator.overboughtLine;
    }
    if (this.kdjOverboughtBottomInput) {
        this.kdjOverboughtBottomInput.value = this.kdjIndicator.overboughtBottom;
    }
    if (this.kdjSettingsOverlay) {
        this.kdjSettingsOverlay.style.display = 'flex';
    }
};

// 隐藏KDJ参数设置对话框
KlineChart.prototype.hideKDJSettingsDialog = function() {
    if (this.kdjSettingsOverlay) {
        this.kdjSettingsOverlay.style.display = 'none';
    }
};

// 重置KDJ参数为默认值
KlineChart.prototype.resetKDJSettingsToDefault = function() {
    if (this.kdjNInput) {
        this.kdjNInput.value = 9;
    }
    if (this.kdjM1Input) {
        this.kdjM1Input.value = 3;
    }
    if (this.kdjM2Input) {
        this.kdjM2Input.value = 3;
    }
    if (this.kdjWrNInput) {
        this.kdjWrNInput.value = 10;
    }
    if (this.kdjOversoldTopInput) {
        this.kdjOversoldTopInput.value = 110;
    }
    if (this.kdjOversoldLineInput) {
        this.kdjOversoldLineInput.value = 80;
    }
    if (this.kdjOverboughtLineInput) {
        this.kdjOverboughtLineInput.value = 20;
    }
    if (this.kdjOverboughtBottomInput) {
        this.kdjOverboughtBottomInput.value = -10;
    }
    // 实时更新显示
    this.updateKDJSettingsRealtime();
};

// 应用KDJ参数设置
KlineChart.prototype.applyKDJSettings = function() {
    var kdjN = parseInt(this.kdjNInput.value) || 9;
    var kdjM1 = parseInt(this.kdjM1Input.value) || 3;
    var kdjM2 = parseInt(this.kdjM2Input.value) || 3;
    var wrN = parseInt(this.kdjWrNInput.value) || 10;
    var oversoldTop = parseFloat(this.kdjOversoldTopInput.value) || 110;
    var oversoldLine = parseFloat(this.kdjOversoldLineInput.value) || 80;
    var overboughtLine = parseFloat(this.kdjOverboughtLineInput.value) || 20;
    var overboughtBottom = parseFloat(this.kdjOverboughtBottomInput.value) || -10;
    
    // 设置参数
    this.kdjIndicator.setParams(kdjN, kdjM1, kdjM2, wrN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom);
    
    // 重新计算KDJ
    if (this.candles && this.candles.length > 0) {
        this.kdjIndicator.calculateKDJ(this.candles);
    }
    
    // 隐藏对话框
    this.hideKDJSettingsDialog();
    
    // 重绘
    this.requestRender();
};

// 实时更新KDJ参数
KlineChart.prototype.updateKDJSettingsRealtime = function() {
    var kdjN = parseInt(this.kdjNInput.value) || 9;
    var kdjM1 = parseInt(this.kdjM1Input.value) || 3;
    var kdjM2 = parseInt(this.kdjM2Input.value) || 3;
    var wrN = parseInt(this.kdjWrNInput.value) || 10;
    var oversoldTop = parseFloat(this.kdjOversoldTopInput.value) || 110;
    var oversoldLine = parseFloat(this.kdjOversoldLineInput.value) || 80;
    var overboughtLine = parseFloat(this.kdjOverboughtLineInput.value) || 20;
    var overboughtBottom = parseFloat(this.kdjOverboughtBottomInput.value) || -10;
    
    // 设置参数
    this.kdjIndicator.setParams(kdjN, kdjM1, kdjM2, wrN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom);
    
    // 重新计算KDJ
    if (this.candles && this.candles.length > 0) {
        this.kdjIndicator.calculateKDJ(this.candles);
    }
    
    // 重绘
    this.requestRender();
};

// 初始化WR参数设置对话框
KlineChart.prototype.initWRSettingsDialog = function() {
    var self = this;
    
    // 获取对话框元素
    this.contextMenuWrSettings = document.getElementById('context-menu-wr-settings');
    this.wrSettingsOverlay = document.getElementById('wr-settings-overlay');
    this.wrNInput = document.getElementById('wr-n');
    this.wrOversoldLineInput = document.getElementById('wr-oversold-line');
    this.wrOverboughtLineInput = document.getElementById('wr-overbought-line');
    this.wrOversoldTopInput = document.getElementById('wr-oversold-top');
    this.wrOverboughtBottomInput = document.getElementById('wr-overbought-bottom');
    this.wrSettingsBtnCancel = document.getElementById('wr-settings-btn-cancel');
    this.wrSettingsBtnDefault = document.getElementById('wr-settings-btn-default');
    this.wrSettingsBtnConfirm = document.getElementById('wr-settings-btn-confirm');
    
    // 绑定右键菜单项事件
    if (this.contextMenuWrSettings) {
        this.contextMenuWrSettings.onclick = function() {
            self.hideContextMenu();
            self.showWRSettingsDialog();
        };
    }
    
    // 绑定取消按钮事件
    if (this.wrSettingsBtnCancel) {
        this.wrSettingsBtnCancel.onclick = function() {
            self.hideWRSettingsDialog();
        };
    }
    
    // 绑定默认按钮事件
    if (this.wrSettingsBtnDefault) {
        this.wrSettingsBtnDefault.onclick = function() {
            self.resetWRSettingsToDefault();
        };
    }
    
    // 绑定确认按钮事件
    if (this.wrSettingsBtnConfirm) {
        this.wrSettingsBtnConfirm.onclick = function() {
            self.applyWRSettings();
        };
    }
    
    // 点击遮罩层关闭
    if (this.wrSettingsOverlay) {
        this.wrSettingsOverlay.onclick = function(e) {
            if (e.target === self.wrSettingsOverlay) {
                self.hideWRSettingsDialog();
            }
        };
    }
    
    // 绑定输入框实时更新事件
    if (this.wrNInput) {
        this.wrNInput.addEventListener('input', function() {
            self.updateWRSettingsRealtime();
        });
    }
    if (this.wrOversoldLineInput) {
        this.wrOversoldLineInput.addEventListener('input', function() {
            self.updateWRSettingsRealtime();
        });
    }
    if (this.wrOverboughtLineInput) {
        this.wrOverboughtLineInput.addEventListener('input', function() {
            self.updateWRSettingsRealtime();
        });
    }
    if (this.wrOversoldTopInput) {
        this.wrOversoldTopInput.addEventListener('input', function() {
            self.updateWRSettingsRealtime();
        });
    }
    if (this.wrOverboughtBottomInput) {
        this.wrOverboughtBottomInput.addEventListener('input', function() {
            self.updateWRSettingsRealtime();
        });
    }
};

// 显示WR参数设置对话框
KlineChart.prototype.showWRSettingsDialog = function() {
    console.log('Showing WR settings dialog, current params:', 
        this.wrIndicator.wrN,
        this.wrIndicator.oversoldLine,
        this.wrIndicator.overboughtLine,
        this.wrIndicator.oversoldTop,
        this.wrIndicator.overboughtBottom);
    
    if (this.wrNInput) {
        this.wrNInput.value = this.wrIndicator.wrN;
    }
    if (this.wrOversoldTopInput) {
        this.wrOversoldTopInput.value = this.wrIndicator.oversoldTop;
    }
    if (this.wrOversoldLineInput) {
        this.wrOversoldLineInput.value = this.wrIndicator.oversoldLine;
    }
    if (this.wrOverboughtLineInput) {
        this.wrOverboughtLineInput.value = this.wrIndicator.overboughtLine;
    }
    if (this.wrOverboughtBottomInput) {
        this.wrOverboughtBottomInput.value = this.wrIndicator.overboughtBottom;
    }
    if (this.wrSettingsOverlay) {
        this.wrSettingsOverlay.style.display = 'flex';
    }
};

// 隐藏WR参数设置对话框
KlineChart.prototype.hideWRSettingsDialog = function() {
    if (this.wrSettingsOverlay) {
        this.wrSettingsOverlay.style.display = 'none';
    }
};

// 重置WR参数为默认值
KlineChart.prototype.resetWRSettingsToDefault = function() {
    if (this.wrNInput) {
        this.wrNInput.value = 10;
    }
    if (this.wrOversoldTopInput) {
        this.wrOversoldTopInput.value = 100;
    }
    if (this.wrOversoldLineInput) {
        this.wrOversoldLineInput.value = 80;
    }
    if (this.wrOverboughtLineInput) {
        this.wrOverboughtLineInput.value = 20;
    }
    if (this.wrOverboughtBottomInput) {
        this.wrOverboughtBottomInput.value = 0;
    }
    // 实时更新显示
    this.updateWRSettingsRealtime();
};

// 应用WR参数设置
KlineChart.prototype.applyWRSettings = function() {
    var wrN = parseInt(this.wrNInput.value) || 10;
    var oversoldTop = parseFloat(this.wrOversoldTopInput.value) || 100;
    var oversoldLine = parseFloat(this.wrOversoldLineInput.value) || 80;
    var overboughtLine = parseFloat(this.wrOverboughtLineInput.value) || 20;
    var overboughtBottom = parseFloat(this.wrOverboughtBottomInput.value) || 0;
    
    // 设置参数
    this.wrIndicator.setParams(wrN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom);
    
    // 重新计算WR
    if (this.candles && this.candles.length > 0) {
        this.wrIndicator.calculateWR(this.candles);
    }
    
    // 隐藏对话框
    this.hideWRSettingsDialog();
    
    // 重绘
    this.requestRender();
};

// 实时更新WR参数
KlineChart.prototype.updateWRSettingsRealtime = function() {
    var wrN = parseInt(this.wrNInput.value) || 10;
    var oversoldTop = parseFloat(this.wrOversoldTopInput.value) || 100;
    var oversoldLine = parseFloat(this.wrOversoldLineInput.value) || 80;
    var overboughtLine = parseFloat(this.wrOverboughtLineInput.value) || 20;
    var overboughtBottom = parseFloat(this.wrOverboughtBottomInput.value) || 0;
    
    // 设置参数
    this.wrIndicator.setParams(wrN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom);
    
    // 重新计算WR
    if (this.candles && this.candles.length > 0) {
        this.wrIndicator.calculateWR(this.candles);
    }
    
    // 重绘
    this.requestRender();
};

// 初始化RSI参数设置对话框
KlineChart.prototype.initRSISettingsDialog = function() {
    var self = this;
    
    // 获取对话框元素
    this.contextMenuRsiSettings = document.getElementById('context-menu-rsi-settings');
    this.rsiSettingsOverlay = document.getElementById('rsi-settings-overlay');
    this.rsiNInput = document.getElementById('rsi-n');
    this.rsiOversoldLineInput = document.getElementById('rsi-oversold-line');
    this.rsiOverboughtLineInput = document.getElementById('rsi-overbought-line');
    this.rsiOversoldTopInput = document.getElementById('rsi-oversold-top');
    this.rsiOverboughtBottomInput = document.getElementById('rsi-overbought-bottom');
    this.rsiSettingsBtnCancel = document.getElementById('rsi-settings-btn-cancel');
    this.rsiSettingsBtnDefault = document.getElementById('rsi-settings-btn-default');
    this.rsiSettingsBtnConfirm = document.getElementById('rsi-settings-btn-confirm');
    
    // 绑定右键菜单项事件
    if (this.contextMenuRsiSettings) {
        this.contextMenuRsiSettings.onclick = function() {
            self.hideContextMenu();
            self.showRSISettingsDialog();
        };
    }
    
    // 绑定取消按钮事件
    if (this.rsiSettingsBtnCancel) {
        this.rsiSettingsBtnCancel.onclick = function() {
            self.hideRSISettingsDialog();
        };
    }
    
    // 绑定默认按钮事件
    if (this.rsiSettingsBtnDefault) {
        this.rsiSettingsBtnDefault.onclick = function() {
            self.resetRSISettingsToDefault();
        };
    }
    
    // 绑定确认按钮事件
    if (this.rsiSettingsBtnConfirm) {
        this.rsiSettingsBtnConfirm.onclick = function() {
            self.applyRSISettings();
        };
    }
    
    // 点击遮罩层关闭
    if (this.rsiSettingsOverlay) {
        this.rsiSettingsOverlay.onclick = function(e) {
            if (e.target === self.rsiSettingsOverlay) {
                self.hideRSISettingsDialog();
            }
        };
    }
    
    // 绑定输入框实时更新事件
    if (this.rsiNInput) {
        this.rsiNInput.addEventListener('input', function() {
            self.updateRSISettingsRealtime();
        });
    }
    if (this.rsiOversoldLineInput) {
        this.rsiOversoldLineInput.addEventListener('input', function() {
            self.updateRSISettingsRealtime();
        });
    }
    if (this.rsiOverboughtLineInput) {
        this.rsiOverboughtLineInput.addEventListener('input', function() {
            self.updateRSISettingsRealtime();
        });
    }
    if (this.rsiOversoldTopInput) {
        this.rsiOversoldTopInput.addEventListener('input', function() {
            self.updateRSISettingsRealtime();
        });
    }
    if (this.rsiOverboughtBottomInput) {
        this.rsiOverboughtBottomInput.addEventListener('input', function() {
            self.updateRSISettingsRealtime();
        });
    }
};

// 显示RSI参数设置对话框
KlineChart.prototype.showRSISettingsDialog = function() {
    console.log('Showing RSI settings dialog, current params:', 
        this.rsiIndicator.rsiN,
        this.rsiIndicator.oversoldLine,
        this.rsiIndicator.overboughtLine,
        this.rsiIndicator.oversoldTop,
        this.rsiIndicator.overboughtBottom);
    
    if (this.rsiNInput) {
        this.rsiNInput.value = this.rsiIndicator.rsiN;
    }
    if (this.rsiOversoldTopInput) {
        this.rsiOversoldTopInput.value = this.rsiIndicator.oversoldTop;
    }
    if (this.rsiOversoldLineInput) {
        this.rsiOversoldLineInput.value = this.rsiIndicator.oversoldLine;
    }
    if (this.rsiOverboughtLineInput) {
        this.rsiOverboughtLineInput.value = this.rsiIndicator.overboughtLine;
    }
    if (this.rsiOverboughtBottomInput) {
        this.rsiOverboughtBottomInput.value = this.rsiIndicator.overboughtBottom;
    }
    if (this.rsiSettingsOverlay) {
        this.rsiSettingsOverlay.style.display = 'flex';
    }
};

// 隐藏RSI参数设置对话框
KlineChart.prototype.hideRSISettingsDialog = function() {
    if (this.rsiSettingsOverlay) {
        this.rsiSettingsOverlay.style.display = 'none';
    }
};

// 重置RSI参数为默认值
KlineChart.prototype.resetRSISettingsToDefault = function() {
    if (this.rsiNInput) {
        this.rsiNInput.value = 14;
    }
    if (this.rsiOversoldTopInput) {
        this.rsiOversoldTopInput.value = 90;
    }
    if (this.rsiOversoldLineInput) {
        this.rsiOversoldLineInput.value = 70;
    }
    if (this.rsiOverboughtLineInput) {
        this.rsiOverboughtLineInput.value = 30;
    }
    if (this.rsiOverboughtBottomInput) {
        this.rsiOverboughtBottomInput.value = 10;
    }
    // 实时更新显示
    this.updateRSISettingsRealtime();
};

// 应用RSI参数设置
KlineChart.prototype.applyRSISettings = function() {
    var rsiN = parseInt(this.rsiNInput.value) || 14;
    var oversoldTop = parseFloat(this.rsiOversoldTopInput.value) || 90;
    var oversoldLine = parseFloat(this.rsiOversoldLineInput.value) || 70;
    var overboughtLine = parseFloat(this.rsiOverboughtLineInput.value) || 30;
    var overboughtBottom = parseFloat(this.rsiOverboughtBottomInput.value) || 10;
    
    // 设置参数
    this.rsiIndicator.setParams(rsiN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom);
    
    // 重新计算RSI
    if (this.candles && this.candles.length > 0) {
        this.rsiIndicator.calculateRSI(this.candles);
    }
    
    // 隐藏对话框
    this.hideRSISettingsDialog();
    
    // 重绘
    this.requestRender();
};

// 实时更新RSI参数
KlineChart.prototype.updateRSISettingsRealtime = function() {
    var rsiN = parseInt(this.rsiNInput.value) || 14;
    var oversoldTop = parseFloat(this.rsiOversoldTopInput.value) || 90;
    var oversoldLine = parseFloat(this.rsiOversoldLineInput.value) || 70;
    var overboughtLine = parseFloat(this.rsiOverboughtLineInput.value) || 30;
    var overboughtBottom = parseFloat(this.rsiOverboughtBottomInput.value) || 10;
    
    // 设置参数
    this.rsiIndicator.setParams(rsiN, oversoldLine, overboughtLine, oversoldTop, overboughtBottom);
    
    // 重新计算RSI
    if (this.candles && this.candles.length > 0) {
        this.rsiIndicator.calculateRSI(this.candles);
    }
    
    // 重绘
    this.requestRender();
};

// 初始化MA均线参数设置对话框
KlineChart.prototype.initMASettingsDialog = function() {
    var self = this;
    
    // 获取对话框元素
    this.contextMenuMaSettings = document.getElementById('context-menu-ma-settings');
    this.maSettingsOverlay = document.getElementById('ma-settings-overlay');
    this.ma5Input = document.getElementById('ma-5');
    this.ma10Input = document.getElementById('ma-10');
    this.ma20Input = document.getElementById('ma-20');
    this.ma30Input = document.getElementById('ma-30');
    this.ma60Input = document.getElementById('ma-60');
    this.ma120Input = document.getElementById('ma-120');
    this.ma250Input = document.getElementById('ma-250');
    // 获取颜色选择器元素
    this.maColor5Input = document.getElementById('ma-color-5');
    this.maColor10Input = document.getElementById('ma-color-10');
    this.maColor20Input = document.getElementById('ma-color-20');
    this.maColor30Input = document.getElementById('ma-color-30');
    this.maColor60Input = document.getElementById('ma-color-60');
    this.maColor120Input = document.getElementById('ma-color-120');
    this.maColor250Input = document.getElementById('ma-color-250');
    // 获取复选框元素
    this.maEnabled5Input = document.getElementById('ma-enabled-5');
    this.maEnabled10Input = document.getElementById('ma-enabled-10');
    this.maEnabled20Input = document.getElementById('ma-enabled-20');
    this.maEnabled30Input = document.getElementById('ma-enabled-30');
    this.maEnabled60Input = document.getElementById('ma-enabled-60');
    this.maEnabled120Input = document.getElementById('ma-enabled-120');
    this.maEnabled250Input = document.getElementById('ma-enabled-250');
    this.maSettingsBtnCancel = document.getElementById('ma-settings-btn-cancel');
    this.maSettingsBtnDefault = document.getElementById('ma-settings-btn-default');
    this.maSettingsBtnConfirm = document.getElementById('ma-settings-btn-confirm');
    
    // 绑定右键菜单项事件
    if (this.contextMenuMaSettings) {
        this.contextMenuMaSettings.onclick = function() {
            self.hideContextMenu();
            self.showMASettingsDialog();
        };
    }
    
    // 绑定取消按钮事件
    if (this.maSettingsBtnCancel) {
        this.maSettingsBtnCancel.onclick = function() {
            self.hideMASettingsDialog();
        };
    }
    
    // 绑定默认按钮事件
    if (this.maSettingsBtnDefault) {
        this.maSettingsBtnDefault.onclick = function() {
            self.resetMASettingsToDefault();
        };
    }
    
    // 绑定确认按钮事件
    if (this.maSettingsBtnConfirm) {
        this.maSettingsBtnConfirm.onclick = function() {
            self.applyMASettings();
        };
    }
    
    // 绑定输入框实时更新事件
    if (this.ma5Input) {
        this.ma5Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.ma10Input) {
        this.ma10Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.ma20Input) {
        this.ma20Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.ma30Input) {
        this.ma30Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.ma60Input) {
        this.ma60Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.ma120Input) {
        this.ma120Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.ma250Input) {
        this.ma250Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    
    // 绑定颜色选择器实时更新事件
    if (this.maColor5Input) {
        this.maColor5Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maColor10Input) {
        this.maColor10Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maColor20Input) {
        this.maColor20Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maColor30Input) {
        this.maColor30Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maColor60Input) {
        this.maColor60Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maColor120Input) {
        this.maColor120Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maColor250Input) {
        this.maColor250Input.addEventListener('input', function() {
            self.updateMASettingsRealtime();
        });
    }
    
    // 绑定复选框实时更新事件
    if (this.maEnabled5Input) {
        this.maEnabled5Input.addEventListener('change', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maEnabled10Input) {
        this.maEnabled10Input.addEventListener('change', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maEnabled20Input) {
        this.maEnabled20Input.addEventListener('change', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maEnabled30Input) {
        this.maEnabled30Input.addEventListener('change', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maEnabled60Input) {
        this.maEnabled60Input.addEventListener('change', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maEnabled120Input) {
        this.maEnabled120Input.addEventListener('change', function() {
            self.updateMASettingsRealtime();
        });
    }
    if (this.maEnabled250Input) {
        this.maEnabled250Input.addEventListener('change', function() {
            self.updateMASettingsRealtime();
        });
    }
    
    // 点击遮罩层关闭
    if (this.maSettingsOverlay) {
        this.maSettingsOverlay.onclick = function(e) {
            if (e.target === self.maSettingsOverlay) {
                self.hideMASettingsDialog();
            }
        };
    }
};

// 显示MA均线参数设置对话框
KlineChart.prototype.showMASettingsDialog = function() {
    console.log('Showing MA settings dialog, current params:', 
        this.maIndicator.periods.ma5,
        this.maIndicator.periods.ma10,
        this.maIndicator.periods.ma20,
        this.maIndicator.periods.ma30,
        this.maIndicator.periods.ma60,
        this.maIndicator.periods.ma120,
        this.maIndicator.periods.ma250,
        this.maIndicator.enabledList,
        this.maIndicator.colors);
    
    if (this.ma5Input) {
        this.ma5Input.value = this.maIndicator.periods.ma5;
    }
    if (this.ma10Input) {
        this.ma10Input.value = this.maIndicator.periods.ma10;
    }
    if (this.ma20Input) {
        this.ma20Input.value = this.maIndicator.periods.ma20;
    }
    if (this.ma30Input) {
        this.ma30Input.value = this.maIndicator.periods.ma30;
    }
    if (this.ma60Input) {
        this.ma60Input.value = this.maIndicator.periods.ma60;
    }
    if (this.ma120Input) {
        this.ma120Input.value = this.maIndicator.periods.ma120;
    }
    if (this.ma250Input) {
        this.ma250Input.value = this.maIndicator.periods.ma250;
    }
    // 设置颜色选择器
    if (this.maColor5Input) {
        this.maColor5Input.value = this.maIndicator.colors.ma5;
    }
    if (this.maColor10Input) {
        this.maColor10Input.value = this.maIndicator.colors.ma10;
    }
    if (this.maColor20Input) {
        this.maColor20Input.value = this.maIndicator.colors.ma20;
    }
    if (this.maColor30Input) {
        this.maColor30Input.value = this.maIndicator.colors.ma30;
    }
    if (this.maColor60Input) {
        this.maColor60Input.value = this.maIndicator.colors.ma60;
    }
    if (this.maColor120Input) {
        this.maColor120Input.value = this.maIndicator.colors.ma120;
    }
    if (this.maColor250Input) {
        this.maColor250Input.value = this.maIndicator.colors.ma250;
    }
    // 设置复选框状态
    if (this.maEnabled5Input) {
        this.maEnabled5Input.checked = this.maIndicator.enabledList.ma5;
    }
    if (this.maEnabled10Input) {
        this.maEnabled10Input.checked = this.maIndicator.enabledList.ma10;
    }
    if (this.maEnabled20Input) {
        this.maEnabled20Input.checked = this.maIndicator.enabledList.ma20;
    }
    if (this.maEnabled30Input) {
        this.maEnabled30Input.checked = this.maIndicator.enabledList.ma30;
    }
    if (this.maEnabled60Input) {
        this.maEnabled60Input.checked = this.maIndicator.enabledList.ma60;
    }
    if (this.maEnabled120Input) {
        this.maEnabled120Input.checked = this.maIndicator.enabledList.ma120;
    }
    if (this.maEnabled250Input) {
        this.maEnabled250Input.checked = this.maIndicator.enabledList.ma250;
    }
    if (this.maSettingsOverlay) {
        this.maSettingsOverlay.style.display = 'flex';
    }
};

// 隐藏MA均线参数设置对话框
KlineChart.prototype.hideMASettingsDialog = function() {
    if (this.maSettingsOverlay) {
        this.maSettingsOverlay.style.display = 'none';
    }
};

// 重置MA均线参数为默认值
KlineChart.prototype.resetMASettingsToDefault = function() {
    if (this.ma5Input) {
        this.ma5Input.value = 5;
    }
    if (this.ma10Input) {
        this.ma10Input.value = 10;
    }
    if (this.ma20Input) {
        this.ma20Input.value = 20;
    }
    if (this.ma30Input) {
        this.ma30Input.value = 30;
    }
    if (this.ma60Input) {
        this.ma60Input.value = 60;
    }
    if (this.ma120Input) {
        this.ma120Input.value = 120;
    }
    if (this.ma250Input) {
        this.ma250Input.value = 250;
    }
    // 重置颜色选择器为默认值
    if (this.maColor5Input) {
        this.maColor5Input.value = '#ffffff';
    }
    if (this.maColor10Input) {
        this.maColor10Input.value = '#fbbf24';
    }
    if (this.maColor20Input) {
        this.maColor20Input.value = '#a855f7';
    }
    if (this.maColor30Input) {
        this.maColor30Input.value = '#22c55e';
    }
    if (this.maColor60Input) {
        this.maColor60Input.value = '#3b82f6';
    }
    if (this.maColor120Input) {
        this.maColor120Input.value = '#f97316';
    }
    if (this.maColor250Input) {
        this.maColor250Input.value = '#ef4444';
    }
    // 重置复选框为默认选中状态
    if (this.maEnabled5Input) {
        this.maEnabled5Input.checked = true;
    }
    if (this.maEnabled10Input) {
        this.maEnabled10Input.checked = true;
    }
    if (this.maEnabled20Input) {
        this.maEnabled20Input.checked = true;
    }
    if (this.maEnabled30Input) {
        this.maEnabled30Input.checked = true;
    }
    if (this.maEnabled60Input) {
        this.maEnabled60Input.checked = true;
    }
    if (this.maEnabled120Input) {
        this.maEnabled120Input.checked = true;
    }
    if (this.maEnabled250Input) {
        this.maEnabled250Input.checked = true;
    }
    // 实时更新显示
    this.updateMASettingsRealtime();
};

// 应用MA均线参数设置
KlineChart.prototype.applyMASettings = function() {
    var ma5 = parseInt(this.ma5Input.value) || 5;
    var ma10 = parseInt(this.ma10Input.value) || 10;
    var ma20 = parseInt(this.ma20Input.value) || 20;
    var ma30 = parseInt(this.ma30Input.value) || 30;
    var ma60 = parseInt(this.ma60Input.value) || 60;
    var ma120 = parseInt(this.ma120Input.value) || 120;
    var ma250 = parseInt(this.ma250Input.value) || 250;
    
    // 获取颜色
    var colors = {
        ma5: this.maColor5Input ? this.maColor5Input.value : '#ffffff',
        ma10: this.maColor10Input ? this.maColor10Input.value : '#fbbf24',
        ma20: this.maColor20Input ? this.maColor20Input.value : '#a855f7',
        ma30: this.maColor30Input ? this.maColor30Input.value : '#22c55e',
        ma60: this.maColor60Input ? this.maColor60Input.value : '#3b82f6',
        ma120: this.maColor120Input ? this.maColor120Input.value : '#f97316',
        ma250: this.maColor250Input ? this.maColor250Input.value : '#ef4444'
    };
    
    // 获取复选框状态
    var enabledList = {
        ma5: this.maEnabled5Input ? this.maEnabled5Input.checked : true,
        ma10: this.maEnabled10Input ? this.maEnabled10Input.checked : true,
        ma20: this.maEnabled20Input ? this.maEnabled20Input.checked : true,
        ma30: this.maEnabled30Input ? this.maEnabled30Input.checked : true,
        ma60: this.maEnabled60Input ? this.maEnabled60Input.checked : true,
        ma120: this.maEnabled120Input ? this.maEnabled120Input.checked : true,
        ma250: this.maEnabled250Input ? this.maEnabled250Input.checked : true
    };
    
    // 设置参数
    this.maIndicator.setParams(ma5, ma10, ma20, ma30, ma60, ma120, ma250, enabledList, colors);
    
    // 重新计算MA
    if (this.candles && this.candles.length > 0) {
        this.maIndicator.calculateMA(this.candles);
    }
    
    // 隐藏对话框
    this.hideMASettingsDialog();
    
    // 重绘
    this.requestRender();
};

// 实时更新MA均线参数
KlineChart.prototype.updateMASettingsRealtime = function() {
    var ma5 = parseInt(this.ma5Input.value) || 5;
    var ma10 = parseInt(this.ma10Input.value) || 10;
    var ma20 = parseInt(this.ma20Input.value) || 20;
    var ma30 = parseInt(this.ma30Input.value) || 30;
    var ma60 = parseInt(this.ma60Input.value) || 60;
    var ma120 = parseInt(this.ma120Input.value) || 120;
    var ma250 = parseInt(this.ma250Input.value) || 250;
    
    // 获取颜色
    var colors = {
        ma5: this.maColor5Input ? this.maColor5Input.value : '#ffffff',
        ma10: this.maColor10Input ? this.maColor10Input.value : '#fbbf24',
        ma20: this.maColor20Input ? this.maColor20Input.value : '#a855f7',
        ma30: this.maColor30Input ? this.maColor30Input.value : '#22c55e',
        ma60: this.maColor60Input ? this.maColor60Input.value : '#3b82f6',
        ma120: this.maColor120Input ? this.maColor120Input.value : '#f97316',
        ma250: this.maColor250Input ? this.maColor250Input.value : '#ef4444'
    };
    
    // 获取复选框状态
    var enabledList = {
        ma5: this.maEnabled5Input ? this.maEnabled5Input.checked : true,
        ma10: this.maEnabled10Input ? this.maEnabled10Input.checked : true,
        ma20: this.maEnabled20Input ? this.maEnabled20Input.checked : true,
        ma30: this.maEnabled30Input ? this.maEnabled30Input.checked : true,
        ma60: this.maEnabled60Input ? this.maEnabled60Input.checked : true,
        ma120: this.maEnabled120Input ? this.maEnabled120Input.checked : true,
        ma250: this.maEnabled250Input ? this.maEnabled250Input.checked : true
    };
    
    // 设置参数
    this.maIndicator.setParams(ma5, ma10, ma20, ma30, ma60, ma120, ma250, enabledList, colors);
    
    // 重新计算MA
    if (this.candles && this.candles.length > 0) {
        this.maIndicator.calculateMA(this.candles);
    }
    
    // 重绘
    this.requestRender();
};

// 隐藏MACD参数设置对话框
KlineChart.prototype.hideMACDSettingsDialog = function() {
    if (this.macdSettingsOverlay) {
        this.macdSettingsOverlay.style.display = 'none';
    }
};

// 应用MACD参数设置
KlineChart.prototype.applyMACDSettings = function() {
    var shortPeriod = parseInt(this.macdShortPeriodInput.value) || 12;
    var longPeriod = parseInt(this.macdLongPeriodInput.value) || 26;
    var signalPeriod = parseInt(this.macdSignalPeriodInput.value) || 9;
    
    // 设置参数
    this.macdIndicator.setParams(shortPeriod, longPeriod, signalPeriod);
    
    // 重新计算MACD
    if (this.candles && this.candles.length > 0) {
        this.macdIndicator.calculateMACD(this.candles);
    }
    
    // 隐藏对话框
    this.hideMACDSettingsDialog();
    
    // 重绘
    this.requestRender();
};

// 调整canvas尺寸
KlineChart.prototype.resizeCanvas = function() {
    // 获取canvas的父容器尺寸
    var parent = this.canvas.parentElement;
    console.log('Canvas父容器：', parent);
    
    if (parent) {
        var parentWidth = parent.offsetWidth;
        var parentHeight = parent.offsetHeight;
        console.log('父容器尺寸：' + parentWidth + ' x ' + parentHeight);
        
        // 确保父容器有有效的尺寸，减去指标行高度40px
        if (parentWidth > 0 && parentHeight > 0) {
            this.canvas.width = parentWidth;
            this.canvas.height = parentHeight;
        } else {
            console.warn('父容器尺寸无效，使用默认尺寸');
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight - 100;
        }
    } else {
        // 如果没有父容器，使用document.body
        this.canvas.width = document.body.offsetWidth;
        this.canvas.height = document.body.offsetHeight - 100;
    }
    
    console.log('Canvas尺寸设置：' + this.canvas.width + ' x ' + this.canvas.height);
};

// 计算移动平均线（MA）
KlineChart.prototype.calculateMA = function(candles, period) {
    var result = [];
    for (var i = 0; i < candles.length; i++) {
        if (i < period - 1) {
            result.push(null);
        } else {
            var sum = 0;
            for (var j = 0; j < period; j++) {
                sum += candles[i - j].close;
            }
            result.push(sum / period);
        }
    }
    return result;
};

// 计算KDJ指标
KlineChart.prototype.calculateKDJ = function(candles, n, m1, m2) {
    if (!candles || candles.length === 0) {
        return { k: [], d: [], j: [] };
    }
    
    var rsv = [];
    var k = [];
    var d = [];
    var j = [];
    
    for (var i = 0; i < candles.length; i++) {
        if (i < n - 1) {
            rsv.push(null);
            k.push(null);
            d.push(null);
            j.push(null);
        } else {
            // 计算n日内的最高价和最低价
            var highN = candles[i].high;
            var lowN = candles[i].low;
            for (var jIdx = 1; jIdx < n; jIdx++) {
                highN = Math.max(highN, candles[i - jIdx].high);
                lowN = Math.min(lowN, candles[i - jIdx].low);
            }
            
            // 计算RSV
            var rsvValue = 0;
            if (highN !== lowN) {
                rsvValue = (candles[i].close - lowN) / (highN - lowN) * 100;
            }
            rsv.push(rsvValue);
            
            // 计算K值
            if (i === n - 1) {
                k.push(50);
            } else {
                k.push((2 * k[i - 1] + rsvValue) / 3);
            }
            
            // 计算D值
            if (i === n - 1) {
                d.push(50);
            } else {
                d.push((2 * d[i - 1] + k[i]) / 3);
            }
            
            // 计算J值
            j.push(3 * k[i] - 2 * d[i]);
        }
    }
    
    return { k: k, d: d, j: j };
};

// 计算CR指标
KlineChart.prototype.calculateCR = function(candles, n) {
    if (!candles || candles.length === 0) {
        return { cr: [], ma1: [], ma2: [], ma3: [], ma4: [] };
    }
    
    var cr = [];
    var ma1 = [];
    var ma2 = [];
    var ma3 = [];
    var ma4 = [];
    
    for (var i = 0; i < candles.length; i++) {
        if (i < n) {
            cr.push(null);
            ma1.push(null);
            ma2.push(null);
            ma3.push(null);
            ma4.push(null);
        } else {
            // 计算中间价
            var ym = (candles[i - 1].high + candles[i - 1].low) / 2;
            
            // 计算多方强度和空方强度
            var p1 = Math.max(0, candles[i].high - ym);
            var p2 = Math.max(0, ym - candles[i].low);
            
            // 计算n日的多方强度总和和空方强度总和
            var sumP1 = 0;
            var sumP2 = 0;
            for (var j = 0; j < n; j++) {
                var ym2 = (candles[i - j - 1].high + candles[i - j - 1].low) / 2;
                sumP1 += Math.max(0, candles[i - j].high - ym2);
                sumP2 += Math.max(0, ym2 - candles[i - j].low);
            }
            
            // 计算CR值
            var crValue = 0;
            if (sumP2 !== 0) {
                crValue = sumP1 / sumP2 * 100;
            }
            cr.push(crValue);
            
            // 计算MA1（CR的5日平均）
            if (i >= n + 4) {
                var sumCR = 0;
                for (var k = 0; k < 5; k++) {
                    sumCR += cr[i - k];
                }
                ma1.push(sumCR / 5);
            } else {
                ma1.push(null);
            }
            
            // 计算MA2（CR的10日平均）
            if (i >= n + 9) {
                var sumCR2 = 0;
                for (var k2 = 0; k2 < 10; k2++) {
                    sumCR2 += cr[i - k2];
                }
                ma2.push(sumCR2 / 10);
            } else {
                ma2.push(null);
            }
            
            // 计算MA3（CR的20日平均）
            if (i >= n + 19) {
                var sumCR3 = 0;
                for (var k3 = 0; k3 < 20; k3++) {
                    sumCR3 += cr[i - k3];
                }
                ma3.push(sumCR3 / 20);
            } else {
                ma3.push(null);
            }
            
            // 计算MA4（CR的30日平均）
            if (i >= n + 29) {
                var sumCR4 = 0;
                for (var k4 = 0; k4 < 30; k4++) {
                    sumCR4 += cr[i - k4];
                }
                ma4.push(sumCR4 / 30);
            } else {
                ma4.push(null);
            }
        }
    }
    
    return { cr: cr, ma1: ma1, ma2: ma2, ma3: ma3, ma4: ma4 };
};

// 更新指标行显示
KlineChart.prototype.updateIndicatorBar = function() {
    var indicatorContent = document.getElementById('indicator-content');
    if (!indicatorContent) {
        return;
    }
    // 不显示指标信息，只保留按钮区
    indicatorContent.innerHTML = '';
};

// 处理窗口大小改变
KlineChart.prototype.handleResize = function() {
    // 保存当前可见的K线范围
    var visibleStartIndex = 0;
    var visibleEndIndex = 0;
    
    if (this.candles && this.candles.length > 0) {
        var viewWidth = this.canvas.width;
        var rightPadding = 45;
        var availableWidth = viewWidth - rightPadding;
        var baseCandleWidth = availableWidth / this.candles.length;
        var candleWidth = baseCandleWidth * this.scale;
        
        visibleStartIndex = Math.max(0, Math.floor((-this.offsetX) / candleWidth));
        visibleEndIndex = Math.min(this.candles.length - 1, Math.ceil((viewWidth - this.offsetX) / candleWidth));
        
        console.log('调整窗口前可见K线：' + visibleStartIndex + ' - ' + visibleEndIndex);
    }
    
    this.resizeCanvas();
    
    // 恢复可见的K线范围
    if (this.candles && this.candles.length > 0) {
        var viewWidth = this.canvas.width;
        var rightPadding = 45;
        var availableWidth = viewWidth - rightPadding;
        var baseCandleWidth = availableWidth / this.candles.length;
        var candleWidth = baseCandleWidth * this.scale;
        
        // 计算K线实体宽度
        var baseBodyWidth = 6;
        var maxBodyWidthRatio = 0.8;
        var maxBodyWidth = candleWidth * maxBodyWidthRatio;
        var bodyWidth = Math.min(baseBodyWidth * this.scale, maxBodyWidth);
        
        // 计算新的offsetX，使可见的K线保持在相同位置
        var newOffsetX = -visibleStartIndex * candleWidth;
        this.offsetX = newOffsetX;
        
        // 确保offsetX在有效边界内
        this.clampOffsetX();
        
        console.log('调整窗口后offsetX：' + this.offsetX.toFixed(2));
    }
    
    // 使用requestAnimationFrame优化重绘
    this.requestRender();
};

// 请求渲染
KlineChart.prototype.requestRender = function() {
    if (!this.isAnimating) {
        this.isAnimating = true;
        var self = this;
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(function() {
                self.renderAll();
                self.isAnimating = false;
            });
        } else {
            // 兼容旧浏览器
            setTimeout(function() {
                self.renderAll();
                self.isAnimating = false;
            }, 16);
        }
    }
};

// 渲染所有内容
KlineChart.prototype.renderAll = function() {
    try {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // ── 右上角：股票代码 + 名称 ──
        var stockCode = this.currentStockCode;
        if (stockCode) {
            var pureCode = stockCode.replace(/^(sh|sz|bj)/i, '');
            var stockName = '';
            if (typeof stockNameDictionary !== 'undefined') {
                // 字典 key 带前缀如 sh000001
                stockName = stockNameDictionary[stockCode] || stockNameDictionary[pureCode] || '';
            }
            this.ctx.save();
            this.ctx.font = 'bold 13px sans-serif';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'top';
            var displayText = pureCode + (stockName ? ' ' + stockName : '');
            var textW = this.ctx.measureText(displayText).width;
            var bx = this.canvas.width - 12;
            var by = 10;
            // 半透明背景
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
            this.ctx.fillRect(bx - textW - 12, by - 2, textW + 24, 24);
            // 代码（蓝色）
            this.ctx.fillStyle = '#60a5fa';
            this.ctx.fillText(pureCode, bx, by + 2);
            // 名称（白色）
            if (stockName) {
                var codeW = this.ctx.measureText(pureCode + ' ').width;
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText(stockName, bx - textW + codeW, by + 2);
            }
            this.ctx.restore();
        }

        this.drawCandles();
        if (this.twoPointBuy && this.twoPointBuy.allData && this.twoPointBuy.allData.length > 0) {
            this.twoPointBuy.renderAll(this.ctx);
        }
        if (this.twoPointBuy) {
            this.twoPointBuy.render(this.ctx);
        }
        if (this.twoPointSell && this.twoPointSell.allData && this.twoPointSell.allData.length > 0) {
            this.twoPointSell.renderAll(this.ctx);
        }
        if (this.twoPointSell) {
            this.twoPointSell.render(this.ctx);
        }
        if (this.threePointBuy && this.threePointBuy.allData && this.threePointBuy.allData.length > 0) {
            this.threePointBuy.renderAll(this.ctx);
        }
        if (this.threePointBuy) {
            this.threePointBuy.render(this.ctx);
        }
        if (this.threePointSell && this.threePointSell.allData && this.threePointSell.allData.length > 0) {
            this.threePointSell.renderAll(this.ctx);
        }
        if (this.threePointSell) {
            this.threePointSell.render(this.ctx);
        }
        // 只有在量能开启时才渲染统计结果
        if (this.macdIndicator && this.macdIndicator.enabled) {
            if (this.volumeStatistics && this.volumeStatistics.allData && this.volumeStatistics.allData.length > 0) {
                this.volumeStatistics.renderAll(this.ctx);
            }
            if (this.volumeStatistics) {
                this.volumeStatistics.render(this.ctx);
            }
        }
        this.drawSavedLines();
        // 渲染涨停箱体叠加层（在买卖点之下）
        if (typeof LimitUpBoxOverlay !== 'undefined' && LimitUpBoxOverlay.chart) {
            LimitUpBoxOverlay.render(this.ctx);
        }
        // 渲染回测买卖点叠加层
        if (typeof BacktestOverlay !== 'undefined' && BacktestOverlay.chart) {
            BacktestOverlay.render(this.ctx);
            // 渲染回测悬浮提示（板块RPS信息）
            if (BacktestOverlay.renderTooltip) {
                BacktestOverlay.renderTooltip(this.ctx);
            }
        }
        // 渲染箱体悬浮提示
        if (typeof LimitUpBoxOverlay !== 'undefined' && LimitUpBoxOverlay.chart) {
            if (LimitUpBoxOverlay.renderTooltip) {
                LimitUpBoxOverlay.renderTooltip(this.ctx);
            }
        }
        // 渲染矩形
        if (this.rectangleDrawing) {
            this.rectangleDrawing.render(this.ctx);
        }
        // 渲染线段
        if (this.lineDrawing) {
            this.lineDrawing.render(this.ctx);
        }
        // 渲染射线
        if (this.rayDrawing) {
            this.rayDrawing.render(this.ctx);
        }
        // 渲染水平线
        if (this.horizontalLineDrawing) {
            this.horizontalLineDrawing.render(this.ctx);
        }
        // 渲染垂直线
        if (this.verticalLineDrawing) {
            this.verticalLineDrawing.render(this.ctx);
        }
        // 渲染标价线
        if (this.priceLineDrawing) {
            this.priceLineDrawing.render(this.ctx);
        }
        // 渲染平行线
        if (this.parallelLineDrawing) {
            this.parallelLineDrawing.render(this.ctx);
        }

        // 渲染圆形
        if (this.circleDrawing) {
            this.circleDrawing.render(this.ctx);
        }

        // 渲染文字
        if (this.textDrawing) {
            this.textDrawing.render(this.ctx);
        }

        // 渲染箭头
        if (this.arrowDrawing) {
            this.arrowDrawing.render(this.ctx);
        }

        // 渲染黄金分割
        if (this.goldenSectionDrawing) {
            this.goldenSectionDrawing.render(this.ctx);
        }

        // 渲染江恩线
        if (this.gannLineDrawing) {
            this.gannLineDrawing.render(this.ctx);
        }
        // 渲染测量距离
        if (this.measureDistance) {
            this.measureDistance.render(this.ctx);
        }


    } catch (error) {
        console.error('渲染错误:', error);
        this.showError('渲染失败，请刷新页面重试');
    }
};

// 将价格转换为画布Y坐标
KlineChart.prototype.priceToCanvasY = function(price) {
    if (this.currentMainChartHeight === undefined || this.currentMinPrice === undefined || this.currentMaxPrice === undefined) {
        console.warn('价格转换参数未初始化，使用默认值');
        return this.canvas.height / 2;
    }
    
    var padding = 15;
    var availableHeight = this.currentMainChartHeight - padding * 2;
    var y = padding + (this.currentMaxPrice - price) / this.currentPriceRange * availableHeight;
    return y;
};

// 限制offsetX在有效边界内
KlineChart.prototype.clampOffsetX = function() {
    if (!this.candles || this.candles.length === 0) {
        return;
    }

    var viewWidth = this.canvas.width;
    var rightPadding = 45;
    var availableWidth = viewWidth - rightPadding;
    
    var baseCandleWidth = availableWidth / this.candles.length;
    var candleWidth = baseCandleWidth * this.scale;
    var totalKlineWidth = this.candles.length * candleWidth;

    // 计算K线实体宽度
    var baseBodyWidth = 6;
    var minGap = 2;
    var maxBodyWidthRatio = 0.8;
    var maxBodyWidth = candleWidth * maxBodyWidthRatio;
    var bodyWidth = Math.min(baseBodyWidth * this.scale, maxBodyWidth);

    // 计算边界
    // 最左侧K线不能超出画布左边缘：offsetX <= 0
    // 最右侧K线不能超过现价框：最后一根K线实体的右边缘不能超过现价框左边缘，留出2px间距
    // 现价框左边缘位置 = this.canvas.width - 45（labelWidth=40, 右边距5px）
    // 最后一根K线的中心线位置 = (this.candles.length - 1) * candleWidth + candleWidth / 2 + offsetX
    // 最后一根K线实体的右边缘位置 = 中心线位置 + bodyWidth / 2
    // 需要满足：(this.candles.length - 1) * candleWidth + candleWidth / 2 + offsetX + bodyWidth / 2 + 2 <= this.canvas.width - 45
    // 因此：offsetX <= this.canvas.width - 45 - 2 - (this.candles.length - 1) * candleWidth - candleWidth / 2 - bodyWidth / 2
    
    var minOffsetX = this.canvas.width - 45 - 2 - (this.candles.length - 1) * candleWidth - candleWidth / 2 - bodyWidth / 2;
    var maxOffsetX = 0;

    // 确保minOffsetX不超过0（当K线总宽度小于画布宽度时）
    if (minOffsetX > 0) {
        minOffsetX = 0;
    }

    // 限制offsetX在边界内
    var oldOffsetX = this.offsetX;
    this.offsetX = Math.max(minOffsetX, Math.min(maxOffsetX, this.offsetX));
    
    if (oldOffsetX !== this.offsetX) {
        console.log('offsetX被限制：' + oldOffsetX.toFixed(2) + ' → ' + this.offsetX.toFixed(2) + '，边界：' + minOffsetX.toFixed(2) + ' ~ ' + maxOffsetX);
    }
};

// 设置时间周期
KlineChart.prototype.setTimeframe = function(timeframe) {
    // 时间周期切换逻辑
    console.log('切换到' + timeframe + '周期');
    
    // 保存当前周期
    this.currentPeriod = timeframe;
    
    // 更新周期按钮激活状态
    this.updatePeriodButtonState(timeframe);
    
    // 加载对应周期的K线数据
    this.loadKlineData(this.currentStockCode, timeframe);
    
    // 启动自动刷新
    var self = this;
    setTimeout(function() {
        startAutoRefresh();
    }, 1000);
};

// 更新周期按钮激活状态
KlineChart.prototype.updatePeriodButtonState = function(period) {
    // 周期按钮ID映射
    var periodButtonMap = {
        '5min': 'btn-5min',
        '15min': 'btn-15min',
        '30min': 'btn-30min',
        '60min': 'btn-60min',
        'daily': 'btn-daily',
        'weekly': 'btn-week',
        'monthly': 'btn-month'
    };
    
    // 移除所有周期按钮的激活状态
    for (var key in periodButtonMap) {
        var buttonId = periodButtonMap[key];
        var button = document.getElementById(buttonId);
        if (button) {
            button.classList.remove('active');
        }
    }
    
    // 为当前周期按钮添加激活状态
    var activeButtonId = periodButtonMap[period];
    if (activeButtonId) {
        var activeButton = document.getElementById(activeButtonId);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
};

// 跳回今日K线（显示最后120根）
KlineChart.prototype.jumpToToday = function() {
    if (!this.candles || this.candles.length === 0) {
        return;
    }

    // 计算缩放比例，让最后120根K线填满窗口
    var displayCount = 120;
    this.scale = this.candles.length / displayCount;

    // 计算偏移量，显示最后120根K线
    var width = this.canvas.width;
    var rightPadding = 45;
    var availableWidth = width - rightPadding;
    var baseCandleWidth = availableWidth / this.candles.length;
    var candleWidth = baseCandleWidth * this.scale;

    // 计算K线实体宽度
    var baseBodyWidth = 6;
    var maxBodyWidthRatio = 0.8;
    var maxBodyWidth = candleWidth * maxBodyWidthRatio;
    var bodyWidth = Math.min(baseBodyWidth * this.scale, maxBodyWidth);

    // 向左偏移，让最后120根K线显示在窗口中，最后一根K线实体右边缘与现价框左边缘之间留出2px间距
    this.offsetX = -(this.candles.length - displayCount) * candleWidth - bodyWidth / 2 - 2;

    console.log('跳回今日K线：缩放=' + this.scale.toFixed(2) + '，偏移=' + this.offsetX.toFixed(2));

    // 重绘
    this.requestRender();
};

// 跳转到首个买卖点（如果有回测数据），否则跳回今日
KlineChart.prototype.jumpToFirstTrade = function() {
    if (!this.candles || this.candles.length === 0) return false;
    if (this.currentPeriod !== 'daily') return false;
    if (typeof BACKTEST_TRADES === 'undefined') return false;

    var stockCode = this.currentStockCode;
    if (!stockCode) return false;

    // 去掉 sh/sz/bj 前缀
    var pureCode = stockCode.replace(/^(sh|sz|bj)/i, '');
    var stockData = BACKTEST_TRADES[pureCode];
    if (!stockData || !stockData.daily || stockData.daily.length === 0) return false;

    // 找到第一个买入点的日期
    var trades = stockData.daily;
    var firstTradeDate = null;
    for (var i = 0; i < trades.length; i++) {
        if (trades[i].type === 'buy') {
            firstTradeDate = trades[i].date;
            break;
        }
    }
    if (!firstTradeDate) return false;

    // 找到该日期对应的K线索引
    var targetIdx = -1;
    for (var i = 0; i < this.candles.length; i++) {
        var d = this.candles[i].day || this.candles[i].date || '';
        var key = String(d).trim();
        if (key.indexOf('-') === -1 && key.length === 8) {
            key = key.substring(0, 4) + '-' + key.substring(4, 6) + '-' + key.substring(6, 8);
        }
        if (key === firstTradeDate) {
            targetIdx = i;
            break;
        }
    }
    if (targetIdx < 0) return false;

    // 设置缩放（同 jumpToToday：显示约120根）
    var displayCount = 120;
    this.scale = this.candles.length / displayCount;

    var width = this.canvas.width;
    var rightPadding = 45;
    var availableWidth = width - rightPadding;
    var baseCandleWidth = availableWidth / this.candles.length;
    var candleWidth = baseCandleWidth * this.scale;

    // 让目标K线居中显示
    this.offsetX = this.canvas.width / 2 - targetIdx * candleWidth - candleWidth / 2;
    // 调用边界限制
    this.clampOffsetX();

    console.log('定位首个买卖点：' + pureCode + ' ' + firstTradeDate + ' (索引' + targetIdx + ')，缩放=' + this.scale.toFixed(2) + '，偏移=' + this.offsetX.toFixed(2));

    this.requestRender();
    return true;
};

// 数据加载后的处理逻辑
KlineChart.prototype.processKlineData = function(stockCode, period, klineData, dailyPrevClose) {
    var self = this;
    
    self.isLoading = false;
    self.hideLoading();
    
    console.log('获取到' + klineData.length + '条' + period + 'K线数据');
    
    // 保存完整的K线数据
    self.candles = klineData;
    
    // 保存日线前收盘价
    self.dailyPrevClose = dailyPrevClose;
    if (dailyPrevClose) {
        console.log('日线前收盘价：' + dailyPrevClose);
    }
    
    // 有回测买卖点则定位到首个买卖点，否则跳回今日K线
    if (!self.jumpToFirstTrade()) {
        self.jumpToToday();
    }
    
    // 加载两点买入数据
    if (self.twoPointBuy) {
        self.twoPointBuy.load(stockCode, period);
    }
    
    // 加载两点卖出数据
    if (self.twoPointSell) {
        self.twoPointSell.load(stockCode, period);
    }
    
    // 加载三点买入数据
    if (self.threePointBuy) {
        self.threePointBuy.load(stockCode, period);
    }
    
    // 加载三点卖出数据
    if (self.threePointSell) {
        self.threePointSell.load(stockCode, period);
    }
    
    // 加载量能统计数据
    if (self.volumeStatistics) {
        self.volumeStatistics.load(stockCode, period);
    }
    
    // 加载矩形数据
    if (self.rectangleDrawing) {
        self.rectangleDrawing.load(stockCode, period);
    }
    // 加载线段数据
    if (self.lineDrawing) {
        self.lineDrawing.load(stockCode, period);
    }
    // 加载射线数据
    if (self.rayDrawing) {
        self.rayDrawing.load(stockCode, period);
    }
    // 加载水平线数据
    if (self.horizontalLineDrawing) {
        self.horizontalLineDrawing.load(stockCode, period);
    }
    // 加载垂直线数据
    if (self.verticalLineDrawing) {
        self.verticalLineDrawing.load(stockCode, period);
    }
    // 加载标价线数据
    if (self.priceLineDrawing) {
        self.priceLineDrawing.load(stockCode, period);
    }
    // 加载平行线数据
    if (self.parallelLineDrawing) {
        self.parallelLineDrawing.load(stockCode, period);
    }
    // 加载圆形数据
    if (self.circleDrawing) {
        self.circleDrawing.load(stockCode, period);
    }
    // 加载文字数据
    if (self.textDrawing) {
        self.textDrawing.load(stockCode, period);
    }
    // 加载箭头数据
    if (self.arrowDrawing) {
        self.arrowDrawing.load(stockCode, period);
    }
    // 加载黄金分割数据
    if (self.goldenSectionDrawing) {
        self.goldenSectionDrawing.load(stockCode, period);
    }
    // 加载江恩线数据
    if (self.gannLineDrawing) {
        self.gannLineDrawing.load(stockCode, period);
    }
    // 加载测量距离数据
    if (self.measureDistance) {
        self.measureDistance.load(stockCode, period);
    }

    
    // 恢复顶底K线的开启状态并重新计算
    if (self.topBottomKline) {
        var topBottomKlineEnabled = localStorage.getItem('topBottomKlineEnabled') === 'true';
        if (topBottomKlineEnabled) {
            self.topBottomKline.enabled = true;
            // 重新计算KDJ指标，使用当前股票的数据
            self.topBottomKline.calculateKDJ(self.candles);
            var btn = document.getElementById('btn-top-bottom');
            if (btn) {
                var isQuickBtn = btn.classList.contains('draw-tool-quick-btn');
                if (isQuickBtn) {
                    btn.classList.add('active');
                    btn.style.backgroundColor = '#4a90e2';
                } else {
                    btn.style.backgroundColor = '#4a90e2';
                }
            }
            console.log('恢复顶底K线开启状态并重新计算KDJ指标');
            self.requestRender();
        }
    }
    
    // 检测缺口（默认开启）
    if (self.gapDetection) {
        self.gapDetection.detectGaps(self.candles);
        console.log('检测缺口');
        self.requestRender();
    }
    
    // 恢复MACD的开启状态并重新计算
    if (self.macdIndicator) {
        var macdEnabled = localStorage.getItem('macdEnabled') === 'true';
        var stockListContainer = document.getElementById('stock-list-container');
        var statsBtn = document.getElementById('btn-volume-stats');
        if (macdEnabled) {
            // 关闭KDJ指标
            var kdjBtn = document.getElementById('btn-indicator-kdj');
            if (self.kdjIndicator && self.kdjIndicator.enabled) {
                self.kdjIndicator.enabled = false;
                self.kdjIndicator.clear();
                if (kdjBtn) {
                    kdjBtn.style.backgroundColor = '#1a365d';
                }
                localStorage.setItem('kdjEnabled', 'false');
            }
            // 关闭WR指标
            var wrBtn = document.getElementById('btn-indicator-wr');
            if (self.wrIndicator && self.wrIndicator.enabled) {
                self.wrIndicator.enabled = false;
                self.wrIndicator.clear();
                if (wrBtn) {
                    wrBtn.style.backgroundColor = '#1a365d';
                    wrBtn.classList.remove('kline-btn-active');
                }
                localStorage.setItem('wrEnabled', 'false');
            }
            // 关闭RSI指标
            var rsiBtn = document.getElementById('btn-indicator-rsi');
            if (self.rsiIndicator && self.rsiIndicator.enabled) {
                self.rsiIndicator.enabled = false;
                self.rsiIndicator.clear();
                if (rsiBtn) {
                    rsiBtn.style.backgroundColor = '#1a365d';
                    rsiBtn.classList.remove('kline-btn-active');
                }
                localStorage.setItem('rsiEnabled', 'false');
            }
            self.macdIndicator.enabled = true;
            // 重新计算MACD指标，使用当前股票的数据
            self.macdIndicator.calculateMACD(self.candles);
            var btn = document.getElementById('btn-macd');
            if (btn) {
                var isQuickBtn = btn.classList.contains('draw-tool-quick-btn');
                if (isQuickBtn) {
                    btn.classList.add('active');
                    btn.style.backgroundColor = '#4a90e2';
                } else {
                    btn.style.backgroundColor = '#4a90e2';
                }
            }
            var indicatorBtn = document.getElementById('btn-indicator-macd');
            if (indicatorBtn) {
                indicatorBtn.style.backgroundColor = '#4a90e2';
            }
            // 显示统计按钮
            if (statsBtn) {
                statsBtn.style.display = 'block';
            }
            // 调整自选股列表高度到主图底部（85%）
            if (stockListContainer) {
                stockListContainer.style.height = '85%';
            }
            console.log('恢复MACD开启状态并重新计算MACD指标');
            self.requestRender();
            
            // 恢复MACD线的显示状态
            var macdLinesEnabled = localStorage.getItem('macdLinesEnabled') === 'true';
            var linesBtn = document.getElementById('btn-macd-lines');
            if (linesBtn) {
                linesBtn.style.display = 'block';
                linesBtn.style.top = '85%';
                if (macdLinesEnabled) {
                    self.macdIndicator.showLines = true;
                    linesBtn.style.backgroundColor = '#4a90e2';
                    console.log('恢复MACD线开启状态');
                } else {
                    self.macdIndicator.showLines = false;
                    linesBtn.style.backgroundColor = '#1a365d';
                }
            }
        } else {
            var linesBtn = document.getElementById('btn-macd-lines');
            if (linesBtn) {
                linesBtn.style.display = 'none';
            }
            // 隐藏统计按钮
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            // 调整自选股列表高度到画布底部（100%）
            if (stockListContainer) {
                stockListContainer.style.height = '100%';
            }
        }
    }
    
    // 计算MA均线
    self.maIndicator.calculateMA(self.candles);
    
    // 恢复BOLL的开启状态并重新计算
    if (self.bollIndicator) {
        var bollEnabled = localStorage.getItem('bollEnabled') === 'true';
        if (bollEnabled) {
            self.bollIndicator.enabled = true;
            // 重新计算BOLL指标
            self.bollIndicator.calculateBOLL(self.candles);
            var btn = document.getElementById('btn-indicator-boll');
            if (btn) {
                btn.style.backgroundColor = '#4a90e2';
            }
            console.log('恢复BOLL开启状态');
        }
    }
    
    // 恢复成交量的开启状态
    var volumeEnabled = localStorage.getItem('volumeEnabled') === 'true';
    if (volumeEnabled) {
        // 关闭MACD指标
        var macdBtn = document.getElementById('btn-macd');
        var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
        var macdLinesBtn = document.getElementById('btn-macd-lines');
        var statsBtn = document.getElementById('btn-volume-stats');
        if (self.macdIndicator && self.macdIndicator.enabled) {
            self.macdIndicator.enabled = false;
            self.macdIndicator.clear();
            if (macdBtn) {
                macdBtn.style.backgroundColor = '#1a365d';
            }
            if (macdIndicatorBtn) {
                macdIndicatorBtn.style.backgroundColor = '#1a365d';
            }
            if (macdLinesBtn) {
                macdLinesBtn.style.display = 'none';
            }
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            localStorage.setItem('macdEnabled', 'false');
        }
        // 关闭KDJ指标
        var kdjBtn = document.getElementById('btn-indicator-kdj');
        if (self.kdjIndicator && self.kdjIndicator.enabled) {
            self.kdjIndicator.enabled = false;
            self.kdjIndicator.clear();
            if (kdjBtn) {
                kdjBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('kdjEnabled', 'false');
        }
        // 关闭WR指标
        var wrBtn = document.getElementById('btn-indicator-wr');
        if (self.wrIndicator && self.wrIndicator.enabled) {
            self.wrIndicator.enabled = false;
            self.wrIndicator.clear();
            if (wrBtn) {
                wrBtn.style.backgroundColor = '#1a365d';
                wrBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('wrEnabled', 'false');
        }
        // 关闭RSI指标
        var rsiBtn = document.getElementById('btn-indicator-rsi');
        if (self.rsiIndicator && self.rsiIndicator.enabled) {
            self.rsiIndicator.enabled = false;
            self.rsiIndicator.clear();
            if (rsiBtn) {
                rsiBtn.style.backgroundColor = '#1a365d';
                rsiBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('rsiEnabled', 'false');
        }
        self.volumeIndicator.enabled = true;
        self.volumeIndicator.calculateVolume(self.candles);
        var volumeBtn = document.getElementById('btn-indicator-volume');
        if (volumeBtn) {
            volumeBtn.style.backgroundColor = '#4a90e2';
        }
        var stockListContainer = document.getElementById('stock-list-container');
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        console.log('恢复成交量开启状态');
    }
    
    // 恢复MA的开启状态
    var maEnabled = localStorage.getItem('maEnabled') === 'true';
    if (maEnabled) {
        self.maIndicator.enabled = true;
        var maBtn = document.getElementById('btn-indicator-ma');
        if (maBtn) {
            maBtn.style.backgroundColor = '#4a90e2';
        }
        console.log('恢复MA均线开启状态');
    }
    
    // 恢复KDJ的开启状态
    var kdjEnabled = localStorage.getItem('kdjEnabled') === 'true';
    if (kdjEnabled) {
        // 关闭MACD指标
        var macdBtn = document.getElementById('btn-macd');
        var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
        var macdLinesBtn = document.getElementById('btn-macd-lines');
        var statsBtn = document.getElementById('btn-volume-stats');
        if (self.macdIndicator && self.macdIndicator.enabled) {
            self.macdIndicator.enabled = false;
            self.macdIndicator.clear();
            if (macdBtn) {
                macdBtn.style.backgroundColor = '#1a365d';
            }
            if (macdIndicatorBtn) {
                macdIndicatorBtn.style.backgroundColor = '#1a365d';
            }
            if (macdLinesBtn) {
                macdLinesBtn.style.display = 'none';
            }
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            localStorage.setItem('macdEnabled', 'false');
        }
        // 关闭WR指标
        var wrBtn = document.getElementById('btn-indicator-wr');
        if (self.wrIndicator && self.wrIndicator.enabled) {
            self.wrIndicator.enabled = false;
            self.wrIndicator.clear();
            if (wrBtn) {
                wrBtn.style.backgroundColor = '#1a365d';
                wrBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('wrEnabled', 'false');
        }
        // 关闭RSI指标
        var rsiBtn = document.getElementById('btn-indicator-rsi');
        if (self.rsiIndicator && self.rsiIndicator.enabled) {
            self.rsiIndicator.enabled = false;
            self.rsiIndicator.clear();
            if (rsiBtn) {
                rsiBtn.style.backgroundColor = '#1a365d';
                rsiBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('rsiEnabled', 'false');
        }
        self.kdjIndicator.enabled = true;
        self.kdjIndicator.calculateKDJ(self.candles);
        var kdjBtn = document.getElementById('btn-indicator-kdj');
        if (kdjBtn) {
            kdjBtn.style.backgroundColor = '#4a90e2';
        }
        // 调整自选股列表高度到主图底部（85%）
        var stockListContainer = document.getElementById('stock-list-container');
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        console.log('恢复KDJ指标开启状态');
    }
    
    // 恢复WR的开启状态
    var wrEnabled = localStorage.getItem('wrEnabled') === 'true';
    if (wrEnabled) {
        // 关闭MACD指标
        var macdBtn = document.getElementById('btn-macd');
        var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
        var macdLinesBtn = document.getElementById('btn-macd-lines');
        var statsBtn = document.getElementById('btn-volume-stats');
        if (self.macdIndicator && self.macdIndicator.enabled) {
            self.macdIndicator.enabled = false;
            self.macdIndicator.clear();
            if (macdBtn) {
                macdBtn.style.backgroundColor = '#1a365d';
            }
            if (macdIndicatorBtn) {
                macdIndicatorBtn.style.backgroundColor = '#1a365d';
            }
            if (macdLinesBtn) {
                macdLinesBtn.style.display = 'none';
            }
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            localStorage.setItem('macdEnabled', 'false');
        }
        // 关闭KDJ指标
        var kdjBtn = document.getElementById('btn-indicator-kdj');
        if (self.kdjIndicator && self.kdjIndicator.enabled) {
            self.kdjIndicator.enabled = false;
            self.kdjIndicator.clear();
            if (kdjBtn) {
                kdjBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('kdjEnabled', 'false');
        }
        self.wrIndicator.enabled = true;
        self.wrIndicator.calculateWR(self.candles);
        var wrBtn = document.getElementById('btn-indicator-wr');
        if (wrBtn) {
            wrBtn.style.backgroundColor = '#4a90e2';
            wrBtn.classList.add('kline-btn-active');
        }
        // 调整自选股列表高度到主图底部（85%）
        var stockListContainer = document.getElementById('stock-list-container');
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        console.log('恢复WR指标开启状态');
    }
    
    // 恢复RSI的开启状态
    var rsiEnabled = localStorage.getItem('rsiEnabled') === 'true';
    if (rsiEnabled) {
        // 关闭MACD指标
        var macdBtn = document.getElementById('btn-macd');
        var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
        var macdLinesBtn = document.getElementById('btn-macd-lines');
        var statsBtn = document.getElementById('btn-volume-stats');
        if (self.macdIndicator && self.macdIndicator.enabled) {
            self.macdIndicator.enabled = false;
            self.macdIndicator.clear();
            if (macdBtn) {
                macdBtn.style.backgroundColor = '#1a365d';
            }
            if (macdIndicatorBtn) {
                macdIndicatorBtn.style.backgroundColor = '#1a365d';
            }
            if (macdLinesBtn) {
                macdLinesBtn.style.display = 'none';
            }
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            localStorage.setItem('macdEnabled', 'false');
        }
        // 关闭KDJ指标
        var kdjBtn = document.getElementById('btn-indicator-kdj');
        if (self.kdjIndicator && self.kdjIndicator.enabled) {
            self.kdjIndicator.enabled = false;
            self.kdjIndicator.clear();
            if (kdjBtn) {
                kdjBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('kdjEnabled', 'false');
        }
        // 关闭WR指标
        var wrBtn = document.getElementById('btn-indicator-wr');
        if (self.wrIndicator && self.wrIndicator.enabled) {
            self.wrIndicator.enabled = false;
            self.wrIndicator.clear();
            if (wrBtn) {
                wrBtn.style.backgroundColor = '#1a365d';
                wrBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('wrEnabled', 'false');
        }
        self.rsiIndicator.enabled = true;
        self.rsiIndicator.calculateRSI(self.candles);
        var rsiBtn = document.getElementById('btn-indicator-rsi');
        if (rsiBtn) {
            rsiBtn.style.backgroundColor = '#4a90e2';
            rsiBtn.classList.add('kline-btn-active');
        }
        // 调整自选股列表高度到主图底部（85%）
        var stockListContainer = document.getElementById('stock-list-container');
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        console.log('恢复RSI指标开启状态');
    }
    
    // 更新自选股列表的高亮状态
    self.updateStockListHighlight();
    
    // 更新指标行显示
    setTimeout(function() {
        self.updateIndicatorBar();
    }, 100);
};

// 加载K线数据
KlineChart.prototype.loadKlineData = function(stockCode, period) {
    console.log('开始加载K线数据：' + stockCode + '，周期：' + period);
    
    var self = this;
    
    // 设置加载状态
    self.isLoading = true;
    self.showLoading();
    
    try {
        // 重置两点买入数据
        if (self.twoPointBuy) {
            self.twoPointBuy.reset();
        }
        
        // 重置两点卖出数据
        if (self.twoPointSell) {
            self.twoPointSell.reset();
        }
        
        // 重置三点买入数据
        if (self.threePointBuy) {
            self.threePointBuy.reset();
        }
        
        // 重置三点卖出数据
        if (self.threePointSell) {
            self.threePointSell.reset();
        }
        
        // 保存当前股票代码
        self.currentStockCode = stockCode;
        self.currentPeriod = period;
        
        // 更新周期按钮激活状态
        self.updatePeriodButtonState(period);
        
        // 确保canvas尺寸正确
        self.resizeCanvas();
        
        // 检查canvas尺寸
        if (self.canvas.width === 0 || self.canvas.height === 0) {
            console.warn('Canvas尺寸为0，尝试使用默认尺寸...');
            // 使用默认尺寸
            self.canvas.width = 1200;
            self.canvas.height = 600;
        }
        
        // 判断是否是小周期
        var isSmallPeriod = period === '5min' || period === '15min' || period === '30min' || period === '60min';
        
        if (isSmallPeriod) {
            // 小周期：同时加载日线数据和小周期数据
            Promise.all([
                self.api.getSinaKlineData(stockCode, period),
                self.api.getSinaKlineData(stockCode, 'daily')
            ]).then(function(results) {
                var klineData = results[0];
                var dailyData = results[1];
                
                // 从日线数据中获取前收盘价
                var dailyPrevClose = null;
                if (dailyData && dailyData.length >= 2) {
                    dailyPrevClose = dailyData[dailyData.length - 2].close;
                }
                
                // 处理数据
                self.processKlineData(stockCode, period, klineData, dailyPrevClose);
            }).catch(function(error) {
                self.isLoading = false;
                self.hideLoading();
                console.error('加载K线数据失败:', error);
                
                // 显示错误提示
                self.showError(error.message);
            });
        } else {
            // 日线、周线、月线：只加载对应周期数据
            self.api.getSinaKlineData(stockCode, period).then(function(klineData) {
                // 从当前周期数据中获取前收盘价
                var dailyPrevClose = null;
                if (klineData && klineData.length >= 2) {
                    dailyPrevClose = klineData[klineData.length - 2].close;
                }
                
                // 处理数据
                self.processKlineData(stockCode, period, klineData, dailyPrevClose);
            }).catch(function(error) {
                self.isLoading = false;
                self.hideLoading();
                console.error('加载K线数据失败:', error);
                
                // 显示错误提示
                self.showError(error.message);
            });
        }
    } catch (error) {
        self.isLoading = false;
        self.hideLoading();
        console.error('加载K线数据失败:', error);
        
        // 显示错误提示
        self.showError(error.message);
    }
};

// 显示错误提示
KlineChart.prototype.showError = function(message) {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 设置文字样式
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // 绘制错误提示
    var centerX = this.canvas.width / 2;
    var centerY = this.canvas.height / 2;
    
    // 绘制背景阴影效果
    this.ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    
    // 绘制错误标题
    this.ctx.fillText('K线数据加载失败', centerX, centerY - 30);
    
    // 重置阴影
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    
    // 绘制错误消息
    this.ctx.font = '14px Arial';
    this.ctx.fillStyle = '#ffcc00';
    this.ctx.fillText(message, centerX, centerY + 10);
    
    // 绘制重试提示
    this.ctx.fillStyle = '#aaaaaa';
    this.ctx.font = '12px Arial';
    this.ctx.fillText('请检查网络连接或点击刷新按钮重试', centerX, centerY + 40);
    this.ctx.fillText('如果问题持续，请联系技术支持', centerX, centerY + 60);
    
    // 绘制重试按钮提示
    this.ctx.fillStyle = '#4a90e2';
    this.ctx.font = '11px Arial';
    this.ctx.fillText('按F5键快速刷新', centerX, centerY + 90);
};

// 显示加载指示器
KlineChart.prototype.showLoading = function() {
    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 设置文字样式
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // 绘制加载指示器
    var centerX = this.canvas.width / 2;
    var centerY = this.canvas.height / 2;
    
    // 绘制加载文字
    this.ctx.fillText('加载中...', centerX, centerY);
    
    // 绘制加载动画（改进的圆形旋转效果）
    var radius = 25;
    var lineWidth = 4;
    var startAngle = (new Date().getTime() % 360) * Math.PI / 180;
    var endAngle = startAngle + Math.PI * 1.5;
    
    // 绘制外圆
    this.ctx.strokeStyle = 'rgba(74, 144, 226, 0.3)';
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY - 40, radius, 0, Math.PI * 2);
    this.ctx.stroke();
    
    // 绘制旋转的内圆
    this.ctx.strokeStyle = '#4a90e2';
    this.ctx.lineWidth = lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY - 40, radius, startAngle, endAngle);
    this.ctx.stroke();
    
    // 绘制中心点
    this.ctx.fillStyle = '#4a90e2';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY - 40, 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    // 绘制加载提示文字
    this.ctx.fillStyle = '#aaaaaa';
    this.ctx.font = '12px Arial';
    this.ctx.fillText('正在获取K线数据，请稍候...', centerX, centerY + 30);
    
    // 如果正在动画中，继续绘制
    if (this.isLoading) {
        var self = this;
        requestAnimationFrame(function() {
            self.showLoading();
        });
    }
};

// 隐藏加载指示器
KlineChart.prototype.hideLoading = function() {
    // 清空画布，准备绘制实际内容
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // 停止加载动画
    this.isLoading = false;
};

// 绑定事件
KlineChart.prototype.bindEvents = function() {
    var self = this;
    
    // 保存事件处理函数的引用，以便后续移除
    self.handleMouseDown = function(e) {
        self.onMouseDown(e);
    };
    self.handleMouseMove = function(e) {
        self.onMouseMove(e);
    };
    self.handleMouseUp = function() {
        self.onMouseUp();
    };
    self.handleWheel = function(e) {
        self.onWheel(e);
    };
    self.handleTouchStart = function(e) {
        self.onTouchStart(e);
    };
    self.handleTouchMove = function(e) {
        self.onTouchMove(e);
    };
    self.handleTouchEnd = function() {
        self.onTouchEnd();
    };
    self.handleDoubleClick = function(e) {
        self.onDoubleClick(e);
    };

    // 保存事件处理函数的引用，以便后续移除
    self.handleContextMenu = function(e) {
        self.onContextMenu(e);
    };
    
    // 鼠标事件
    self.canvas.addEventListener('mousedown', self.handleMouseDown);
    window.addEventListener('mousemove', self.handleMouseMove);
    window.addEventListener('mouseup', self.handleMouseUp);
    self.canvas.addEventListener('wheel', self.handleWheel);
    self.canvas.addEventListener('dblclick', self.handleDoubleClick);
    self.canvas.addEventListener('contextmenu', self.handleContextMenu);
    
    // 鼠标进入/离开canvas事件（用于MA提示）
    self.canvas.addEventListener('mouseenter', function() {
        self.isMouseOverCanvas = true;
    });
    self.canvas.addEventListener('mouseleave', function() {
        self.isMouseOverCanvas = false;
        self.requestRender();
    });
    
    // 触摸事件（支持手机屏幕）
    self.canvas.addEventListener('touchstart', self.handleTouchStart);
    self.canvas.addEventListener('touchmove', self.handleTouchMove);
    self.canvas.addEventListener('touchend', self.handleTouchEnd);

    // 工具栏按钮事件
    var backBtn = document.getElementById('btn-back');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // 时间周期按钮
    document.getElementById('btn-5min').addEventListener('click', function() {
        self.setTimeframe('5min');
    });
    document.getElementById('btn-15min').addEventListener('click', function() {
        self.setTimeframe('15min');
    });
    document.getElementById('btn-30min').addEventListener('click', function() {
        self.setTimeframe('30min');
    });
    document.getElementById('btn-60min').addEventListener('click', function() {
        self.setTimeframe('60min');
    });
    document.getElementById('btn-daily').addEventListener('click', function() {
        self.setTimeframe('daily');
    });
    document.getElementById('btn-week').addEventListener('click', function() {
        self.setTimeframe('weekly');
    });
    document.getElementById('btn-month').addEventListener('click', function() {
        self.setTimeframe('monthly');
    });
    
    document.getElementById('btn-two-buy').addEventListener('click', function() {
        self.setTool('two-buy');
    });
    document.getElementById('btn-two-sell').addEventListener('click', function() {
        self.setTool('two-sell');
    });
    // 画线工具按钮
    document.getElementById('btn-draw-tools').addEventListener('click', function() {
        self.toggleDrawToolsWindow();
    });
    
    document.getElementById('btn-three-buy').addEventListener('click', function() {
        self.setTool('three-buy');
    });
    document.getElementById('btn-three-sell').addEventListener('click', function() {
        self.setTool('three-sell');
    });
    document.getElementById('btn-top-bottom').addEventListener('click', function() {
        self.toggleTopBottom();
    });
    document.getElementById('btn-macd').addEventListener('click', function() {
        self.toggleMACD();
    });
    document.getElementById('btn-macd-lines').addEventListener('click', function() {
        self.toggleMACDLines();
    });
    document.getElementById('btn-volume-stats').addEventListener('click', function() {
        self.setTool('volume-stats');
    });
    
    // MA按钮事件
    var maBtn = document.getElementById('btn-indicator-ma');
    if (maBtn) {
        maBtn.addEventListener('click', function() {
            self.toggleMA();
        });
    }
    
    // BOLL按钮事件
    var bollBtn = document.getElementById('btn-indicator-boll');
    if (bollBtn) {
        bollBtn.addEventListener('click', function() {
            self.toggleBOLL();
        });
    }
    
    // MACD指标按钮事件
    var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
    if (macdIndicatorBtn) {
        macdIndicatorBtn.addEventListener('click', function() {
            self.toggleMACD();
        });
    }
    
    // KDJ指标按钮事件
    var kdjIndicatorBtn = document.getElementById('btn-indicator-kdj');
    if (kdjIndicatorBtn) {
        kdjIndicatorBtn.addEventListener('click', function() {
            self.toggleKDJ();
        });
    }
    
    // WR指标按钮事件
    var wrIndicatorBtn = document.getElementById('btn-indicator-wr');
    if (wrIndicatorBtn) {
        wrIndicatorBtn.addEventListener('click', function() {
            self.toggleWR();
        });
    }
    
    // RSI指标按钮事件
    var rsiIndicatorBtn = document.getElementById('btn-indicator-rsi');
    if (rsiIndicatorBtn) {
        rsiIndicatorBtn.addEventListener('click', function() {
            self.toggleRSI();
        });
    }
    // 成交量指标按钮事件
    var volumeIndicatorBtn = document.getElementById('btn-indicator-volume');
    if (volumeIndicatorBtn) {
        volumeIndicatorBtn.addEventListener('click', function() {
            self.toggleVolume();
        });
    }
    // 矩形按钮现在在画线窗口里，由initDrawToolsEvents处理
    document.getElementById('btn-clear').addEventListener('click', function() {
        var periodName = self.currentPeriod;
        if (periodName === 'daily') {
            periodName = '日线';
        } else if (periodName === 'weekly') {
            periodName = '周线';
        } else if (periodName === 'monthly') {
            periodName = '月线';
        } else if (periodName === '5min') {
            periodName = '5分钟';
        } else if (periodName === '15min') {
            periodName = '15分钟';
        } else if (periodName === '30min') {
            periodName = '30分钟';
        } else if (periodName === '60min') {
            periodName = '60分钟';
        }
        self.showConfirmDialog('确认清除', '确定要清除当前股票当前周期的全部画线数据吗？<br><br><span style="color: #ef5350;">包括：画线、两点买卖、三点买卖等全部数据。</span>', function(confirmed) {
            if (confirmed) {
                self.clearCanvas();
            }
        });
    });
    
    // 窗口大小改变事件
    window.addEventListener('resize', function() {
        self.handleResize();
        // 窗口大小改变时，确保画线窗口仍在可视区域内
        if (self.drawToolsWindow && self.drawToolsWindow.style.display !== 'none') {
            self.ensureWindowInBounds();
        }
    });
};

// 设置工具
KlineChart.prototype.setTool = function(tool) {
    // 如果点击的是当前工具，则切换回K线工具（关闭）
    if (this.tool === tool) {
        this.tool = 'candle';
        // 关闭工具时，只清除未完成的取点，不清除已保存的allData
        if (tool === 'two-buy') {
            // 只重置临时取点，不清除已保存数据
            this.twoPointBuy.points = [];
            this.twoPointBuy.keyPoints = null;
        }
        if (tool === 'two-sell') {
            // 只重置临时取点，不清除已保存数据
            this.twoPointSell.points = [];
            this.twoPointSell.keyPoints = null;
        }
        if (tool === 'three-buy') {
            // 只重置临时取点，不清除已保存数据
            this.threePointBuy.points = [];
            this.threePointBuy.keyPoints = null;
        }
        if (tool === 'three-sell') {
            // 只重置临时取点，不清除已保存数据
            this.threePointSell.points = [];
            this.threePointSell.keyPoints = null;
        }
        if (tool === 'volume-stats') {
            // 只重置临时取点，不清除已保存数据
            this.volumeStatistics.points = [];
            this.volumeStatistics.keyPoints = null;
        }
        // 重绘所有内容
        this.requestRender();
    } else {
        this.tool = tool;
    }
    
    // 切换到两点买入工具时，重置取点（不清除已保存数据）
    if (this.tool === 'two-buy') {
        this.twoPointBuy.points = [];
        this.twoPointBuy.keyPoints = null;
    }
    
    // 切换到两点卖出工具时，重置取点（不清除已保存数据）
    if (this.tool === 'two-sell') {
        this.twoPointSell.points = [];
        this.twoPointSell.keyPoints = null;
    }
    
    // 切换到三点买入工具时，重置取点（不清除已保存数据）
    if (this.tool === 'three-buy') {
        this.threePointBuy.points = [];
        this.threePointBuy.keyPoints = null;
    }
    
    // 切换到三点卖出工具时，重置取点（不清除已保存数据）
    if (this.tool === 'three-sell') {
        this.threePointSell.points = [];
        this.threePointSell.keyPoints = null;
    }
    
    // 切换到量能统计工具时，重置取点（不清除已保存数据）
    if (this.tool === 'volume-stats') {
        this.volumeStatistics.points = [];
        this.volumeStatistics.keyPoints = null;
    }
    
    // 定义周期按钮ID列表
    var periodButtons = ['btn-5min', 'btn-15min', 'btn-30min', 'btn-60min', 'btn-daily', 'btn-week', 'btn-month'];
    
    // 定义工具按钮ID列表
    var toolButtons = ['btn-two-buy', 'btn-two-sell', 'btn-three-buy', 'btn-three-sell', 'btn-volume-stats', 'btn-rectangle', 'btn-line', 'btn-ray', 'btn-horizontal', 'btn-vertical', 'btn-price', 'btn-parallel', 'btn-circle', 'btn-text', 'btn-arrow', 'btn-golden', 'btn-gann', 'btn-measure'];
    
    // 重置所有工具按钮颜色为暗蓝色（未开启状态）
    for (var i = 0; i < toolButtons.length; i++) {
        var btnId = toolButtons[i];
        var btn = document.getElementById(btnId);
        if (btn) {
            btn.classList.remove('active');
            // 检查是否是画线窗口中的快速按钮或工具按钮
            if (btn.classList.contains('draw-tool-quick-btn')) {
                btn.style.backgroundColor = 'rgba(26, 54, 93, 0.9)';
            } else if (btn.classList.contains('draw-tool-btn')) {
                btn.style.backgroundColor = 'rgba(55, 65, 81, 0.8)';
            } else {
                btn.style.backgroundColor = '#1a365d';
            }
        }
    }
    
    // 重置画线工具列表里的所有按钮激活状态
    if (this.drawToolsWindow) {
        var drawToolBtns = this.drawToolsWindow.querySelectorAll('.draw-tool-btn');
        for (var k = 0; k < drawToolBtns.length; k++) {
            drawToolBtns[k].classList.remove('active');
        }
    }
    
    // 设置当前工具按钮的颜色
    var toolBtn = document.getElementById('btn-' + this.tool);
    if (toolBtn) {
        toolBtn.classList.add('active');
        // 检查是否是画线窗口中的快速按钮或工具按钮
        var isQuickBtn = toolBtn.classList.contains('draw-tool-quick-btn');
        var isDrawToolBtn = toolBtn.classList.contains('draw-tool-btn');
        
        // 两买和三买开启时显示红色
        if (this.tool === 'two-buy' || this.tool === 'three-buy') {
            toolBtn.style.backgroundColor = isQuickBtn ? 'rgba(220, 38, 38, 0.95)' : 'red';
        }
        // 两卖和三卖开启时显示绿色
        else if (this.tool === 'two-sell' || this.tool === 'three-sell') {
            toolBtn.style.backgroundColor = isQuickBtn ? 'rgba(22, 163, 74, 0.95)' : 'green';
        }
        // 统计工具开启时显示橙色
        else if (this.tool === 'volume-stats') {
            toolBtn.style.backgroundColor = '#ff9800';
        }
        // 矩形工具开启时显示蓝色
        else if (this.tool === 'rectangle') {
            toolBtn.style.backgroundColor = '#4a90e2';
            // 同时确保在画线工具列表里的矩形按钮也有active类
            if (this.drawToolsWindow) {
                var rectBtnInWindow = this.drawToolsWindow.querySelector('#btn-rectangle');
                if (rectBtnInWindow) {
                    rectBtnInWindow.classList.add('active');
                }
            }
        }
    }
};

// 切换顶底模式
KlineChart.prototype.toggleTopBottom = function() {
    var isEnabled = this.topBottomKline.toggle();
    var btn = document.getElementById('btn-top-bottom');
    
    // 检查是否是画线窗口中的快速按钮
    var isQuickBtn = btn && btn.classList.contains('draw-tool-quick-btn');
    
    if (isEnabled) {
        // 计算KDJ指标
        this.topBottomKline.calculateKDJ(this.candles);
        // 设置按钮为激活状态
        if (isQuickBtn) {
            btn.classList.add('active');
            btn.style.backgroundColor = '#4a90e2';
        } else {
            btn.style.backgroundColor = '#4a90e2';
        }
        // 保存顶底K线开启状态到localStorage
        localStorage.setItem('topBottomKlineEnabled', 'true');
        console.log('顶底模式已开启');
    } else {
        // 清除顶底K线数据
        this.topBottomKline.clear();
        // 设置按钮为未激活状态
        if (isQuickBtn) {
            btn.classList.remove('active');
            btn.style.backgroundColor = 'rgba(26, 54, 93, 0.9)';
        } else {
            btn.style.backgroundColor = '#1a365d';
        }
        // 保存顶底K线关闭状态到localStorage
        localStorage.setItem('topBottomKlineEnabled', 'false');
        console.log('顶底模式已关闭');
    }
    
    // 重绘K线
    this.requestRender();
};

// 切换MACD线显示
KlineChart.prototype.toggleMACDLines = function() {
    var isEnabled = this.macdIndicator.toggleLines();
    var btn = document.getElementById('btn-macd-lines');
    
    if (isEnabled) {
        btn.style.backgroundColor = '#4a90e2';
        localStorage.setItem('macdLinesEnabled', 'true');
        console.log('MACD线已开启');
    } else {
        btn.style.backgroundColor = '#1a365d';
        localStorage.setItem('macdLinesEnabled', 'false');
        console.log('MACD线已关闭');
    }
    
    this.requestRender();
};

// 切换MA均线显示
KlineChart.prototype.toggleMA = function() {
    var isEnabled = this.maIndicator.toggle();
    var btn = document.getElementById('btn-indicator-ma');
    
    if (isEnabled) {
        // 计算MA均线
        this.maIndicator.calculateMA(this.candles);
        // 设置按钮为激活状态
        btn.style.backgroundColor = '#4a90e2';
        // 保存MA开启状态到localStorage
        localStorage.setItem('maEnabled', 'true');
        console.log('MA均线已开启');
    } else {
        // 清除MA数据
        this.maIndicator.clear();
        // 设置按钮为未激活状态
        btn.style.backgroundColor = '#1a365d';
        // 保存MA关闭状态到localStorage
        localStorage.setItem('maEnabled', 'false');
        console.log('MA均线已关闭');
    }
    
    // 重绘K线
    this.requestRender();
};

// 切换BOLL指标显示
KlineChart.prototype.toggleBOLL = function() {
    var isEnabled = this.bollIndicator.toggle();
    var btn = document.getElementById('btn-indicator-boll');
    
    if (isEnabled) {
        // 计算BOLL布林通道
        this.bollIndicator.calculateBOLL(this.candles);
        // 设置按钮为激活状态
        btn.style.backgroundColor = '#4a90e2';
        // 保存BOLL开启状态到localStorage
        localStorage.setItem('bollEnabled', 'true');
        console.log('BOLL布林通道已开启');
    } else {
        // 清除BOLL数据
        this.bollIndicator.clear();
        // 设置按钮为未激活状态
        btn.style.backgroundColor = '#1f2937';
        // 保存BOLL关闭状态到localStorage
        localStorage.setItem('bollEnabled', 'false');
        console.log('BOLL布林通道已关闭');
    }
    
    // 重绘K线
    this.requestRender();
};

// 切换KDJ指标显示
KlineChart.prototype.toggleKDJ = function() {
    var isEnabled = this.kdjIndicator.toggle();
    var btn = document.getElementById('btn-indicator-kdj');
    var stockListContainer = document.getElementById('stock-list-container');
    var macdBtn = document.getElementById('btn-macd');
    var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
    var macdLinesBtn = document.getElementById('btn-macd-lines');
    var statsBtn = document.getElementById('btn-volume-stats');
    var wrBtn = document.getElementById('btn-indicator-wr');
    
    if (isEnabled) {
        // 关闭MACD指标
        if (this.macdIndicator && this.macdIndicator.enabled) {
            this.macdIndicator.enabled = false;
            this.macdIndicator.clear();
            if (macdBtn) {
                macdBtn.style.backgroundColor = '#1a365d';
            }
            if (macdIndicatorBtn) {
                macdIndicatorBtn.style.backgroundColor = '#1a365d';
            }
            if (macdLinesBtn) {
                macdLinesBtn.style.display = 'none';
            }
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            localStorage.setItem('macdEnabled', 'false');
        }
        // 关闭WR指标
        if (this.wrIndicator && this.wrIndicator.enabled) {
            this.wrIndicator.enabled = false;
            this.wrIndicator.clear();
            if (wrBtn) {
                wrBtn.style.backgroundColor = '#1a365d';
                wrBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('wrEnabled', 'false');
        }
        // 关闭RSI指标
        var rsiBtn = document.getElementById('btn-indicator-rsi');
        if (this.rsiIndicator && this.rsiIndicator.enabled) {
            this.rsiIndicator.enabled = false;
            this.rsiIndicator.clear();
            if (rsiBtn) {
                rsiBtn.style.backgroundColor = '#1a365d';
                rsiBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('rsiEnabled', 'false');
        }
        // 关闭成交量指标
        var volumeBtn = document.getElementById('btn-indicator-volume');
        if (this.volumeIndicator && this.volumeIndicator.enabled) {
            this.volumeIndicator.enabled = false;
            this.volumeIndicator.clear();
            if (volumeBtn) {
                volumeBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('volumeEnabled', 'false');
        }
        // 计算KDJ指标
        this.kdjIndicator.calculateKDJ(this.candles);
        // 设置按钮为激活状态
        btn.style.backgroundColor = '#4a90e2';
        // 调整自选股列表高度到主图底部（85%）
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        // 保存KDJ开启状态到localStorage
        localStorage.setItem('kdjEnabled', 'true');
        console.log('KDJ指标已开启');
    } else {
        // 清除KDJ数据
        this.kdjIndicator.clear();
        // 设置按钮为未激活状态
        btn.style.backgroundColor = '#1a365d';
        // 调整自选股列表高度到画布底部（100%）
        if (stockListContainer) {
            stockListContainer.style.height = '100%';
        }
        // 保存KDJ关闭状态到localStorage
        localStorage.setItem('kdjEnabled', 'false');
        console.log('KDJ指标已关闭');
    }
    
    // 重绘K线
    this.requestRender();
};

// 切换WR指标显示
KlineChart.prototype.toggleWR = function() {
    var isEnabled = this.wrIndicator.toggle();
    var btn = document.getElementById('btn-indicator-wr');
    var stockListContainer = document.getElementById('stock-list-container');
    var macdBtn = document.getElementById('btn-macd');
    var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
    var macdLinesBtn = document.getElementById('btn-macd-lines');
    var statsBtn = document.getElementById('btn-volume-stats');
    var kdjBtn = document.getElementById('btn-indicator-kdj');
    
    if (isEnabled) {
        // 关闭MACD指标
        if (this.macdIndicator && this.macdIndicator.enabled) {
            this.macdIndicator.enabled = false;
            this.macdIndicator.clear();
            if (macdBtn) {
                macdBtn.style.backgroundColor = '#1a365d';
            }
            if (macdIndicatorBtn) {
                macdIndicatorBtn.style.backgroundColor = '#1a365d';
            }
            if (macdLinesBtn) {
                macdLinesBtn.style.display = 'none';
            }
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            localStorage.setItem('macdEnabled', 'false');
        }
        // 关闭KDJ指标
        if (this.kdjIndicator && this.kdjIndicator.enabled) {
            this.kdjIndicator.enabled = false;
            this.kdjIndicator.clear();
            if (kdjBtn) {
                kdjBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('kdjEnabled', 'false');
        }
        // 关闭RSI指标
        var rsiBtn = document.getElementById('btn-indicator-rsi');
        if (this.rsiIndicator && this.rsiIndicator.enabled) {
            this.rsiIndicator.enabled = false;
            this.rsiIndicator.clear();
            if (rsiBtn) {
                rsiBtn.style.backgroundColor = '#1a365d';
                rsiBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('rsiEnabled', 'false');
        }
        // 关闭成交量指标
        var volumeBtn = document.getElementById('btn-indicator-volume');
        if (this.volumeIndicator && this.volumeIndicator.enabled) {
            this.volumeIndicator.enabled = false;
            this.volumeIndicator.clear();
            if (volumeBtn) {
                volumeBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('volumeEnabled', 'false');
        }
        // 计算WR指标
        this.wrIndicator.calculateWR(this.candles);
        // 设置按钮为激活状态
        btn.style.backgroundColor = '#4a90e2';
        btn.classList.add('kline-btn-active');
        // 调整自选股列表高度到主图底部（85%）
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        // 保存WR开启状态到localStorage
        localStorage.setItem('wrEnabled', 'true');
        console.log('WR指标已开启');
    } else {
        // 清除WR数据
        this.wrIndicator.clear();
        // 设置按钮为未激活状态
        btn.style.backgroundColor = '#1a365d';
        btn.classList.remove('kline-btn-active');
        // 调整自选股列表高度到画布底部（100%）
        if (stockListContainer) {
            stockListContainer.style.height = '100%';
        }
        // 保存WR关闭状态到localStorage
        localStorage.setItem('wrEnabled', 'false');
        console.log('WR指标已关闭');
    }
    
    // 重绘K线
    this.requestRender();
};

// 切换RSI指标显示
KlineChart.prototype.toggleRSI = function() {
    var isEnabled = this.rsiIndicator.toggle();
    var btn = document.getElementById('btn-indicator-rsi');
    var stockListContainer = document.getElementById('stock-list-container');
    var macdBtn = document.getElementById('btn-macd');
    var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
    var macdLinesBtn = document.getElementById('btn-macd-lines');
    var statsBtn = document.getElementById('btn-volume-stats');
    var kdjBtn = document.getElementById('btn-indicator-kdj');
    var wrBtn = document.getElementById('btn-indicator-wr');
    
    if (isEnabled) {
        // 关闭MACD指标
        if (this.macdIndicator && this.macdIndicator.enabled) {
            this.macdIndicator.enabled = false;
            this.macdIndicator.clear();
            if (macdBtn) {
                macdBtn.style.backgroundColor = '#1a365d';
            }
            if (macdIndicatorBtn) {
                macdIndicatorBtn.style.backgroundColor = '#1a365d';
            }
            if (macdLinesBtn) {
                macdLinesBtn.style.display = 'none';
            }
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            localStorage.setItem('macdEnabled', 'false');
        }
        // 关闭KDJ指标
        if (this.kdjIndicator && this.kdjIndicator.enabled) {
            this.kdjIndicator.enabled = false;
            this.kdjIndicator.clear();
            if (kdjBtn) {
                kdjBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('kdjEnabled', 'false');
        }
        // 关闭WR指标
        if (this.wrIndicator && this.wrIndicator.enabled) {
            this.wrIndicator.enabled = false;
            this.wrIndicator.clear();
            if (wrBtn) {
                wrBtn.style.backgroundColor = '#1a365d';
                wrBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('wrEnabled', 'false');
        }
        // 关闭成交量指标
        var volumeBtn = document.getElementById('btn-indicator-volume');
        if (this.volumeIndicator && this.volumeIndicator.enabled) {
            this.volumeIndicator.enabled = false;
            this.volumeIndicator.clear();
            if (volumeBtn) {
                volumeBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('volumeEnabled', 'false');
        }
        // 计算RSI指标
        this.rsiIndicator.calculateRSI(this.candles);
        // 设置按钮为激活状态
        btn.style.backgroundColor = '#4a90e2';
        btn.classList.add('kline-btn-active');
        // 调整自选股列表高度到主图底部（85%）
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        // 保存RSI开启状态到localStorage
        localStorage.setItem('rsiEnabled', 'true');
        console.log('RSI指标已开启');
    } else {
        // 清除RSI数据
        this.rsiIndicator.clear();
        // 设置按钮为未激活状态
        btn.style.backgroundColor = '#1a365d';
        btn.classList.remove('kline-btn-active');
        // 调整自选股列表高度到画布底部（100%）
        if (stockListContainer) {
            stockListContainer.style.height = '100%';
        }
        // 保存RSI关闭状态到localStorage
        localStorage.setItem('rsiEnabled', 'false');
        console.log('RSI指标已关闭');
    }
    
    // 重绘K线
    this.requestRender();
};

// 切换MACD模式
KlineChart.prototype.toggleMACD = function() {
    var isEnabled = this.macdIndicator.toggle();
    var btn = document.getElementById('btn-macd');
    var indicatorBtn = document.getElementById('btn-indicator-macd');
    var linesBtn = document.getElementById('btn-macd-lines');
    var statsBtn = document.getElementById('btn-volume-stats');
    var stockListContainer = document.getElementById('stock-list-container');
    
    // 检查是否是画线窗口中的快速按钮
    var isQuickBtn = btn && btn.classList.contains('draw-tool-quick-btn');
    
    if (isEnabled) {
        // 关闭KDJ指标
        var kdjBtn = document.getElementById('btn-indicator-kdj');
        if (this.kdjIndicator && this.kdjIndicator.enabled) {
            this.kdjIndicator.enabled = false;
            this.kdjIndicator.clear();
            if (kdjBtn) {
                kdjBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('kdjEnabled', 'false');
        }
        // 关闭WR指标
        var wrBtn = document.getElementById('btn-indicator-wr');
        if (this.wrIndicator && this.wrIndicator.enabled) {
            this.wrIndicator.enabled = false;
            this.wrIndicator.clear();
            if (wrBtn) {
                wrBtn.style.backgroundColor = '#1a365d';
                wrBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('wrEnabled', 'false');
        }
        // 关闭RSI指标
        var rsiBtn = document.getElementById('btn-indicator-rsi');
        if (this.rsiIndicator && this.rsiIndicator.enabled) {
            this.rsiIndicator.enabled = false;
            this.rsiIndicator.clear();
            if (rsiBtn) {
                rsiBtn.style.backgroundColor = '#1a365d';
                rsiBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('rsiEnabled', 'false');
        }
        // 关闭成交量指标
        var volumeBtn = document.getElementById('btn-indicator-volume');
        if (this.volumeIndicator && this.volumeIndicator.enabled) {
            this.volumeIndicator.enabled = false;
            this.volumeIndicator.clear();
            if (volumeBtn) {
                volumeBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('volumeEnabled', 'false');
        }
        // 计算MACD指标
        this.macdIndicator.calculateMACD(this.candles);
        // 设置按钮为激活状态
        if (isQuickBtn) {
            btn.classList.add('active');
            btn.style.backgroundColor = '#4a90e2';
        } else {
            btn.style.backgroundColor = '#4a90e2';
        }
        if (indicatorBtn) {
            indicatorBtn.style.backgroundColor = '#4a90e2';
        }
        // 显示线按钮，并根据macdLinesEnabled设置状态
        if (linesBtn) {
            linesBtn.style.display = 'block';
            linesBtn.style.top = '85%';
            var macdLinesEnabled = localStorage.getItem('macdLinesEnabled') === 'true';
            if (macdLinesEnabled) {
                linesBtn.style.backgroundColor = '#4a90e2';
            } else {
                linesBtn.style.backgroundColor = '#1a365d';
            }
        }
        // 显示统计按钮
        if (statsBtn) {
            statsBtn.style.display = 'block';
        }
        // 调整自选股列表高度到主图底部（85%）
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        // 保存MACD开启状态到localStorage
        localStorage.setItem('macdEnabled', 'true');
        console.log('MACD模式已开启');
    } else {
        // 清除MACD数据
        this.macdIndicator.clear();
        // 设置按钮为未激活状态
        if (isQuickBtn) {
            btn.classList.remove('active');
            btn.style.backgroundColor = 'rgba(26, 54, 93, 0.9)';
        } else {
            btn.style.backgroundColor = '#1a365d';
        }
        if (indicatorBtn) {
            indicatorBtn.style.backgroundColor = '#1a365d';
        }
        // 隐藏线按钮
        if (linesBtn) {
            linesBtn.style.display = 'none';
        }
        // 隐藏统计按钮
        if (statsBtn) {
            statsBtn.style.display = 'none';
        }
        // 调整自选股列表高度到画布底部（100%）
        if (stockListContainer) {
            stockListContainer.style.height = '100%';
        }
        // 保存MACD关闭状态到localStorage
        localStorage.setItem('macdEnabled', 'false');
        console.log('MACD模式已关闭');
    }
    
    // 重绘K线
    this.requestRender();
    
    // 更新指标行显示
    var self = this;
    setTimeout(function() {
        self.updateIndicatorBar();
    }, 100);
};

// 切换成交量模式
KlineChart.prototype.toggleVolume = function() {
    var isEnabled = this.volumeIndicator.toggle();
    var volumeBtn = document.getElementById('btn-indicator-volume');
    var stockListContainer = document.getElementById('stock-list-container');
    
    if (isEnabled) {
        // 关闭MACD指标
        var macdBtn = document.getElementById('btn-macd');
        var macdIndicatorBtn = document.getElementById('btn-indicator-macd');
        var macdLinesBtn = document.getElementById('btn-macd-lines');
        var statsBtn = document.getElementById('btn-volume-stats');
        if (this.macdIndicator && this.macdIndicator.enabled) {
            this.macdIndicator.enabled = false;
            this.macdIndicator.clear();
            if (macdBtn) {
                macdBtn.style.backgroundColor = '#1a365d';
            }
            if (macdIndicatorBtn) {
                macdIndicatorBtn.style.backgroundColor = '#1a365d';
            }
            if (macdLinesBtn) {
                macdLinesBtn.style.display = 'none';
            }
            if (statsBtn) {
                statsBtn.style.display = 'none';
            }
            localStorage.setItem('macdEnabled', 'false');
        }
        // 关闭KDJ指标
        var kdjBtn = document.getElementById('btn-indicator-kdj');
        if (this.kdjIndicator && this.kdjIndicator.enabled) {
            this.kdjIndicator.enabled = false;
            this.kdjIndicator.clear();
            if (kdjBtn) {
                kdjBtn.style.backgroundColor = '#1a365d';
            }
            localStorage.setItem('kdjEnabled', 'false');
        }
        // 关闭WR指标
        var wrBtn = document.getElementById('btn-indicator-wr');
        if (this.wrIndicator && this.wrIndicator.enabled) {
            this.wrIndicator.enabled = false;
            this.wrIndicator.clear();
            if (wrBtn) {
                wrBtn.style.backgroundColor = '#1a365d';
                wrBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('wrEnabled', 'false');
        }
        // 关闭RSI指标
        var rsiBtn = document.getElementById('btn-indicator-rsi');
        if (this.rsiIndicator && this.rsiIndicator.enabled) {
            this.rsiIndicator.enabled = false;
            this.rsiIndicator.clear();
            if (rsiBtn) {
                rsiBtn.style.backgroundColor = '#1a365d';
                rsiBtn.classList.remove('kline-btn-active');
            }
            localStorage.setItem('rsiEnabled', 'false');
        }
        // 计算成交量指标
        this.volumeIndicator.calculateVolume(this.candles);
        // 设置按钮为激活状态
        if (volumeBtn) {
            volumeBtn.style.backgroundColor = '#4a90e2';
        }
        // 调整自选股列表高度到主图底部（85%）
        if (stockListContainer) {
            stockListContainer.style.height = '85%';
        }
        // 保存成交量开启状态到localStorage
        localStorage.setItem('volumeEnabled', 'true');
        console.log('成交量模式已开启');
    } else {
        // 设置按钮为未激活状态
        if (volumeBtn) {
            volumeBtn.style.backgroundColor = '#1a365d';
        }
        // 调整自选股列表高度到画布底部（100%）
        if (stockListContainer) {
            stockListContainer.style.height = '100%';
        }
        // 保存成交量关闭状态到localStorage
        localStorage.setItem('volumeEnabled', 'false');
        console.log('成交量模式已关闭');
    }
    
    // 重绘K线
    this.requestRender();
    
    // 更新指标行显示
    var self = this;
    setTimeout(function() {
        self.updateIndicatorBar();
    }, 100);
};

// 鼠标按下事件
KlineChart.prototype.onMouseDown = function(e) {
    // 只处理左键点击（button === 0）
    if (e.button !== 0) {
        return;
    }
    
    // SHIFT + 左键：直接调用测量距离
    if (e.shiftKey) {
        this.setTool('measure');
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.measureDistance.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    
    var rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    // 只有当当前不是两买/两卖/三买/三卖取点模式时，才检测小圆点拖拽
    if (this.tool !== 'two-buy' && this.tool !== 'two-sell' && this.tool !== 'three-buy' && this.tool !== 'three-sell') {
        if (this.twoPointBuy.startDrag(x, y)) {
            return;
        }
        if (this.twoPointSell.startDrag(x, y)) {
            return;
        }
        if (this.threePointBuy.startDrag(x, y)) {
            return;
        }
        if (this.threePointSell.startDrag(x, y)) {
            return;
        }
    }
    
    // 检查是否点击了现价标签
    if (this.currentPriceLabelRect) {
        var rectLabel = this.currentPriceLabelRect;
        if (x >= rectLabel.x && x <= rectLabel.x + rectLabel.width &&
            y >= rectLabel.y && y <= rectLabel.y + rectLabel.height) {
            // 点击了现价标签，跳回今日K线
            this.jumpToToday();
            return;
        }
    }
    
    // 两点买入取点逻辑
    if (this.tool === 'two-buy') {
        try {
            this.twoPointBuy.addPoint(x, y);
            // 重绘所有内容
            this.requestRender();
            
            // 如果取点完成，显示结果并自动关闭两买按钮
            if (this.twoPointBuy.isComplete()) {
                this.twoPointBuy.displayResults();
                this.twoPointBuy.save(this.currentStockCode, this.currentPeriod);
                this.twoPointBuy.load(this.currentStockCode, this.currentPeriod);
                this.setTool('candle');
            }
        } catch (error) {
            alert(error.message);
        }
        return;
    }
    
    // 两点卖出取点逻辑
    if (this.tool === 'two-sell') {
        try {
            this.twoPointSell.addPoint(x, y);
            // 重绘所有内容
            this.requestRender();
            
            // 如果取点完成，显示结果并自动关闭两卖按钮
            if (this.twoPointSell.isComplete()) {
                this.twoPointSell.displayResults();
                this.twoPointSell.save(this.currentStockCode, this.currentPeriod);
                this.twoPointSell.load(this.currentStockCode, this.currentPeriod);
                this.setTool('candle');
            }
        } catch (error) {
            alert(error.message);
        }
        return;
    }
    
    // 三点买入取点逻辑
    if (this.tool === 'three-buy') {
        try {
            this.threePointBuy.addPoint(x, y);
            // 重绘所有内容
            this.requestRender();
            
            // 如果取点完成，显示结果并自动关闭三买按钮
            if (this.threePointBuy.isComplete()) {
                this.threePointBuy.displayResults();
                this.threePointBuy.save(this.currentStockCode, this.currentPeriod);
                this.threePointBuy.load(this.currentStockCode, this.currentPeriod);
                this.setTool('candle');
            }
        } catch (error) {
            alert(error.message);
        }
        return;
    }
    
    // 三点卖出取点逻辑
    if (this.tool === 'three-sell') {
        try {
            this.threePointSell.addPoint(x, y);
            // 重绘所有内容
            this.requestRender();
            
            // 如果取点完成，显示结果并自动关闭三卖按钮
            if (this.threePointSell.isComplete()) {
                this.threePointSell.displayResults();
                this.threePointSell.save(this.currentStockCode, this.currentPeriod);
                this.threePointSell.load(this.currentStockCode, this.currentPeriod);
                this.setTool('candle');
            }
        } catch (error) {
            alert(error.message);
        }
        return;
    }
    
    // 量能统计取点逻辑
    if (this.tool === 'volume-stats') {
        try {
            this.volumeStatistics.addPoint(x, y);
            // 重绘所有内容
            this.requestRender();
            
            // 如果取点完成，显示结果并自动关闭统计按钮
            if (this.volumeStatistics.isComplete()) {
                this.volumeStatistics.save(this.currentStockCode, this.currentPeriod);
                this.volumeStatistics.load(this.currentStockCode, this.currentPeriod);
                this.setTool('candle');
            }
        } catch (error) {
            alert(error.message);
        }
        return;
    }
    
    // 矩形绘制逻辑
    if (this.tool === 'rectangle') {
        this.rectangleDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 线段绘制逻辑
    if (this.tool === 'line') {
        this.lineDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 射线绘制逻辑
    if (this.tool === 'ray') {
        this.rayDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 水平线绘制逻辑
    if (this.tool === 'horizontal') {
        this.horizontalLineDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 垂直线绘制逻辑
    if (this.tool === 'vertical') {
        this.verticalLineDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 标价线绘制逻辑
    if (this.tool === 'price') {
        this.priceLineDrawing.startDrawing(x, y);
        this.setTool('candle');
        this.requestRender();
        return;
    }
    // 平行线绘制逻辑
    if (this.tool === 'parallel') {
        this.parallelLineDrawing.startDrawing(x, y);
        // 只有在 step===0 或 step===1 时才设置 isDrawing=true
        if (this.parallelLineDrawing.step === 0 || this.parallelLineDrawing.step === 1) {
            this.isDrawing = true;
        }
        return;
    }
    // 圆形绘制逻辑
    if (this.tool === 'circle') {
        this.circleDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 文字绘制逻辑
    if (this.tool === 'text') {
        this.textDrawing.startDrawing(x, y);
        return;
    }
    // 箭头绘制逻辑
    if (this.tool === 'arrow') {
        this.arrowDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 黄金分割绘制逻辑
    if (this.tool === 'golden') {
        this.goldenSectionDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 江恩线绘制逻辑
    if (this.tool === 'gann') {
        this.gannLineDrawing.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    // 测量距离逻辑
    if (this.tool === 'measure') {
        this.measureDistance.startDrawing(x, y);
        this.isDrawing = true;
        return;
    }
    
    this.isDrawing = true;
    this.startPoint = this.getMousePos(e);

    // 如果是画线工具，开始绘制
    if (this.tool !== 'candle') {
        this.drawingManager.startDrawing(this.tool, this.startPoint);
    } else {
        // K线工具，开始拖拽
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartOffsetX = this.offsetX;
    }
};

// 鼠标移动事件
KlineChart.prototype.onMouseMove = function(e) {
    var rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
    this.isMouseOverCanvas = true;
    
    // 检查是否正在拖拽两买/两卖/三买/三卖的点
    if (this.twoPointBuy.isDragging) {
        this.twoPointBuy.onDrag(this.mouseX, this.mouseY);
        return;
    }
    if (this.twoPointSell.isDragging) {
        this.twoPointSell.onDrag(this.mouseX, this.mouseY);
        return;
    }
    if (this.threePointBuy.isDragging) {
        this.threePointBuy.onDrag(this.mouseX, this.mouseY);
        return;
    }
    if (this.threePointSell.isDragging) {
        this.threePointSell.onDrag(this.mouseX, this.mouseY);
        return;
    }
    
    // 特殊处理：平行线工具在step===2时也需要更新
    if (this.tool === 'parallel' && this.parallelLineDrawing && this.parallelLineDrawing.step === 2) {
        this.parallelLineDrawing.updateDrawing(this.mouseX, this.mouseY);
        this.requestRender();
    }
    
    if (!this.isDrawing) {
        // 如果十字星开启，更新十字星位置
        if (this.crosshair.enabled) {
            this.crosshair.setPosition(this.mouseX, this.mouseY);
        }
        this.requestRender();
        return;
    }

    // 矩形绘制更新
    if (this.tool === 'rectangle') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.rectangleDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 线段绘制更新
    if (this.tool === 'line') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.lineDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 射线绘制更新
    if (this.tool === 'ray') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.rayDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 水平线绘制更新
    if (this.tool === 'horizontal') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.horizontalLineDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 垂直线绘制更新
    if (this.tool === 'vertical') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.verticalLineDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 平行线绘制更新
    if (this.tool === 'parallel') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.parallelLineDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 圆形绘制更新
    if (this.tool === 'circle') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.circleDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 箭头绘制更新
    if (this.tool === 'arrow') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.arrowDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 黄金分割绘制更新
    if (this.tool === 'golden') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.goldenSectionDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 江恩线绘制更新
    if (this.tool === 'gann') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.gannLineDrawing.updateDrawing(x, y);
        this.requestRender();
        return;
    }
    // 测量距离更新
    if (this.tool === 'measure') {
        var rect = this.canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        this.measureDistance.updateDrawing(x, y);
        this.requestRender();
        return;
    }

    var currentPoint = this.getMousePos(e);

    // 绘制临时线
    if (this.tool !== 'candle') {
        this.drawingManager.updateDrawing(currentPoint);
        this.requestRender();
    } else if (this.isDragging) {
        // 拖拽K线图
        var deltaX = e.clientX - this.dragStartX;
        this.offsetX = this.dragStartOffsetX + deltaX;
        
        // 限制offsetX在有效边界内
        this.clampOffsetX();
        
        // 如果十字星开启，更新十字星位置
        if (this.crosshair.enabled) {
            var rect = this.canvas.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            this.crosshair.setPosition(x, y);
        }
        
        // 重绘K线
        this.requestRender();
    }
};

// 鼠标释放事件
KlineChart.prototype.onMouseUp = function() {
    // 结束两买/两卖/三买/三卖的拖拽
    if (this.twoPointBuy.isDragging) {
        this.twoPointBuy.endDrag();
        return;
    }
    if (this.twoPointSell.isDragging) {
        this.twoPointSell.endDrag();
        return;
    }
    if (this.threePointBuy.isDragging) {
        this.threePointBuy.endDrag();
        return;
    }
    if (this.threePointSell.isDragging) {
        this.threePointSell.endDrag();
        return;
    }
    
    if (!this.isDrawing) return;

    // 矩形绘制完成
    if (this.tool === 'rectangle') {
        this.rectangleDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 线段绘制完成
    else if (this.tool === 'line') {
        this.lineDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 射线绘制完成
    else if (this.tool === 'ray') {
        this.rayDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 水平线绘制完成
    else if (this.tool === 'horizontal') {
        this.horizontalLineDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 垂直线绘制完成
    else if (this.tool === 'vertical') {
        this.verticalLineDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 平行线绘制完成 - 调用finishDrawing处理拖拽结束
    else if (this.tool === 'parallel') {
        this.parallelLineDrawing.finishDrawing();
        this.requestRender();
    }
    // 圆形绘制完成
    else if (this.tool === 'circle') {
        this.circleDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 箭头绘制完成
    else if (this.tool === 'arrow') {
        this.arrowDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 黄金分割绘制完成
    else if (this.tool === 'golden') {
        this.goldenSectionDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 江恩线绘制完成
    else if (this.tool === 'gann') {
        this.gannLineDrawing.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 测量距离完成
    else if (this.tool === 'measure') {
        this.measureDistance.finishDrawing();
        this.setTool('candle');
        this.requestRender();
    }
    // 如果是画线工具，完成绘制
    else if (this.tool !== 'candle') {
        this.drawingManager.finishDrawing(this.currentStockCode, this.currentPeriod);
        this.requestRender();
    }

    this.isDrawing = false;
    this.isDragging = false;
    this.startPoint = null;
};

// 右键菜单事件
KlineChart.prototype.onContextMenu = function(e) {
    e.preventDefault();
    console.log('Context menu event triggered');
    
    // 隐藏所有工具的右键菜单
    this.hideAllContextMenus();
    
    // 设置标志，不显示均线信息
    this.isContextMenuShowing = true;
    
    // 立即重绘来清除均线信息（直接调用，不使用requestAnimationFrame）
    this.renderAll();
    
    var rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    console.log('Right click at canvas coords:', x, y);
    
    // 检测是否点击了矩形
    var hitRectangle = this.rectangleDrawing.hitTest(x, y);
    if (hitRectangle) {
        console.log('Rectangle hit, showing menu');
        this.rectangleDrawing.showContextMenu(e.clientX, e.clientY, hitRectangle);
        return;
    }
    // 检测是否点击了线段
    var hitLine = this.lineDrawing.hitTest(x, y);
    if (hitLine) {
        this.lineDrawing.showContextMenu(e.clientX, e.clientY, hitLine);
        return;
    }
    // 检测是否点击了射线
    var hitRay = this.rayDrawing.hitTest(x, y);
    if (hitRay) {
        this.rayDrawing.showContextMenu(e.clientX, e.clientY, hitRay);
        return;
    }
    // 检测是否点击了水平线
    var hitHorizontal = this.horizontalLineDrawing.hitTest(x, y);
    if (hitHorizontal) {
        this.horizontalLineDrawing.showContextMenu(e.clientX, e.clientY, hitHorizontal);
        return;
    }
    // 检测是否点击了垂直线
    var hitVertical = this.verticalLineDrawing.hitTest(x, y);
    if (hitVertical) {
        this.verticalLineDrawing.showContextMenu(e.clientX, e.clientY, hitVertical);
        return;
    }
    // 检测是否点击了标价线
    var hitPrice = this.priceLineDrawing.hitTest(x, y);
    if (hitPrice) {
        this.priceLineDrawing.showContextMenu(e.clientX, e.clientY, hitPrice);
        return;
    }
    // 检测是否点击了平行线
    var hitParallel = this.parallelLineDrawing.hitTest(x, y);
    if (hitParallel) {
        this.parallelLineDrawing.showContextMenu(e.clientX, e.clientY, hitParallel);
        return;
    }
    // 检测是否点击了圆形
    var hitCircle = this.circleDrawing.hitTest(x, y);
    if (hitCircle) {
        this.circleDrawing.showContextMenu(e.clientX, e.clientY, hitCircle);
        return;
    }
    // 检测是否点击了文字
    var hitText = this.textDrawing.hitTest(x, y);
    if (hitText) {
        this.textDrawing.showContextMenu(e.clientX, e.clientY, hitText);
        return;
    }
    // 检测是否点击了箭头
    var hitArrow = this.arrowDrawing.hitTest(x, y);
    if (hitArrow) {
        this.arrowDrawing.showContextMenu(e.clientX, e.clientY, hitArrow);
        return;
    }
    // 检测是否点击了黄金分割
    var hitGolden = this.goldenSectionDrawing.hitTest(x, y);
    if (hitGolden) {
        this.goldenSectionDrawing.showContextMenu(e.clientX, e.clientY, hitGolden);
        return;
    }
    // 检测是否点击了江恩线
    var hitGann = this.gannLineDrawing.hitTest(x, y);
    if (hitGann) {
        this.gannLineDrawing.showContextMenu(e.clientX, e.clientY, hitGann);
        return;
    }
    // 检测是否点击了测量距离
    var hitMeasure = this.measureDistance.hitTest(x, y);
    if (hitMeasure) {
        this.measureDistance.showContextMenu(e.clientX, e.clientY, hitMeasure);
        return;
    }
    // 检测是否点击了两买画线
    console.log('Checking twoPointBuy hit test...');
    var hitTwoPointBuy = this.twoPointBuy.hitTest(x, y);
    console.log('hitTwoPointBuy:', hitTwoPointBuy);
    if (hitTwoPointBuy !== null) {
        this.twoPointBuy.showContextMenu(e.clientX, e.clientY, hitTwoPointBuy);
        return;
    }
    // 检测是否点击了两卖画线
    console.log('Checking twoPointSell hit test...');
    var hitTwoPointSell = this.twoPointSell.hitTest(x, y);
    console.log('hitTwoPointSell:', hitTwoPointSell);
    if (hitTwoPointSell !== null) {
        this.twoPointSell.showContextMenu(e.clientX, e.clientY, hitTwoPointSell);
        return;
    }
    // 检测是否点击了三买画线
    console.log('Checking threePointBuy hit test...');
    var hitThreePointBuy = this.threePointBuy.hitTest(x, y);
    console.log('hitThreePointBuy:', hitThreePointBuy);
    if (hitThreePointBuy !== null) {
        this.threePointBuy.showContextMenu(e.clientX, e.clientY, hitThreePointBuy);
        return;
    }
    // 检测是否点击了三卖画线
    console.log('Checking threePointSell hit test...');
    var hitThreePointSell = this.threePointSell.hitTest(x, y);
    console.log('hitThreePointSell:', hitThreePointSell);
    if (hitThreePointSell !== null) {
        this.threePointSell.showContextMenu(e.clientX, e.clientY, hitThreePointSell);
        return;
    }
    
    var width = this.canvas.width;
    var height = this.canvas.height;
    
    // 根据是否开启副图指标动态调整主图高度
    var mainChartHeight, subChartHeight;
    if (this.macdIndicator.enabled || this.kdjIndicator.enabled || this.wrIndicator.enabled || this.rsiIndicator.enabled || this.volumeIndicator.enabled || this.bollIndicator.enabled) {
        mainChartHeight = height * 0.85;
        subChartHeight = height * 0.15;
    } else {
        mainChartHeight = height;
        subChartHeight = 0;
    }
    
    // 检测是否在主图区域
    var inMainChart = y < mainChartHeight;
    
    // 检测是否在副图区域
    var inSubChart = false;
    if (this.macdIndicator.enabled || this.kdjIndicator.enabled || this.wrIndicator.enabled || this.rsiIndicator.enabled || this.volumeIndicator.enabled || this.bollIndicator.enabled) {
        var subChartTop = mainChartHeight;
        
        if (y >= subChartTop) {
            inSubChart = true;
        }
    }
    
    // 如果在主图区域且MA均线已开启，检测鼠标是否在MA均线上
    if (inMainChart && this.maIndicator.enabled && this.candles && this.candles.length > 0) {
        // 使用保存的当前参数（这些是在drawCandles中计算并保存的）
        var candleWidth = this.currentCandleWidth || 0;
        var minPrice = this.currentMinPrice || 0;
        var maxPrice = this.currentMaxPrice || 0;
        var mainChartHeightSaved = this.currentMainChartHeight || 0;
        
        console.log('Using saved params:', {
            candleWidth: candleWidth,
            minPrice: minPrice,
            maxPrice: maxPrice,
            mainChartHeight: mainChartHeightSaved,
            offsetX: this.offsetX
        });
        
        // 检测鼠标是否在MA均线上
        var nearbyMA = this.maIndicator.getNearbyMA(
            x, y, candleWidth, this.offsetX, minPrice, maxPrice, mainChartHeightSaved
        );
        console.log('getNearbyMA returned:', nearbyMA);
        
        if (nearbyMA) {
            console.log('MA line hit, showing MA settings menu');
            
            // 先隐藏所有菜单项
            if (this.contextMenuMacdSettings) {
                this.contextMenuMacdSettings.style.display = 'none';
            }
            if (this.contextMenuKdjSettings) {
                this.contextMenuKdjSettings.style.display = 'none';
            }
            if (this.contextMenuWrSettings) {
                this.contextMenuWrSettings.style.display = 'none';
            }
            if (this.contextMenuRsiSettings) {
                this.contextMenuRsiSettings.style.display = 'none';
            }
            if (this.contextMenuMaSettings) {
                this.contextMenuMaSettings.style.display = 'none';
            }
            if (this.contextMenuBollSettings) {
                this.contextMenuBollSettings.style.display = 'none';
            }
            if (this.contextMenuVolumeSettings) {
                this.contextMenuVolumeSettings.style.display = 'none';
            }
            
            // 显示MA均线设置菜单项
            if (this.contextMenuMaSettings) {
                this.contextMenuMaSettings.style.display = 'block';
            }
            
            this.showContextMenu(e.clientX, e.clientY);
            return;
        }
    }
    
    // 如果在副图区域，根据开启的指标显示对应的菜单项
    if (inSubChart) {
        console.log('Subchart right click, showing menu');
        
        // 先隐藏所有菜单项
        if (this.contextMenuMacdSettings) {
            this.contextMenuMacdSettings.style.display = 'none';
        }
        if (this.contextMenuKdjSettings) {
            this.contextMenuKdjSettings.style.display = 'none';
        }
        if (this.contextMenuWrSettings) {
            this.contextMenuWrSettings.style.display = 'none';
        }
        if (this.contextMenuRsiSettings) {
            this.contextMenuRsiSettings.style.display = 'none';
        }
        if (this.contextMenuMaSettings) {
            this.contextMenuMaSettings.style.display = 'none';
        }
        if (this.contextMenuBollSettings) {
            this.contextMenuBollSettings.style.display = 'none';
        }
        if (this.contextMenuVolumeSettings) {
            this.contextMenuVolumeSettings.style.display = 'none';
        }
        
        // 根据开启的指标显示对应的菜单项
        if (this.macdIndicator.enabled && this.contextMenuMacdSettings) {
            this.contextMenuMacdSettings.style.display = 'block';
        }
        if (this.kdjIndicator.enabled && this.contextMenuKdjSettings) {
            this.contextMenuKdjSettings.style.display = 'block';
        }
        if (this.wrIndicator.enabled && this.contextMenuWrSettings) {
            this.contextMenuWrSettings.style.display = 'block';
        }
        if (this.rsiIndicator.enabled && this.contextMenuRsiSettings) {
            this.contextMenuRsiSettings.style.display = 'block';
        }
        if (this.bollIndicator.enabled && this.contextMenuBollSettings) {
            this.contextMenuBollSettings.style.display = 'block';
        }
        if (this.volumeIndicator.enabled && this.contextMenuVolumeSettings) {
            this.contextMenuVolumeSettings.style.display = 'block';
        }
        
        this.showContextMenu(e.clientX, e.clientY);
        return;
    }
    
    // 如果在主图区域，显示相应的设置菜单项
    console.log('Main chart right click, showing menu');
    
    // 先隐藏所有菜单项
    if (this.contextMenuMacdSettings) {
        this.contextMenuMacdSettings.style.display = 'none';
    }
    if (this.contextMenuKdjSettings) {
        this.contextMenuKdjSettings.style.display = 'none';
    }
    if (this.contextMenuWrSettings) {
        this.contextMenuWrSettings.style.display = 'none';
    }
    if (this.contextMenuRsiSettings) {
        this.contextMenuRsiSettings.style.display = 'none';
    }
    if (this.contextMenuMaSettings) {
        this.contextMenuMaSettings.style.display = 'none';
    }
    if (this.contextMenuBollSettings) {
        this.contextMenuBollSettings.style.display = 'none';
    }
    if (this.contextMenuVolumeSettings) {
        this.contextMenuVolumeSettings.style.display = 'none';
    }
    
    // 主图区域显示MA和BOLL设置菜单项
    if (this.maIndicator.enabled && this.contextMenuMaSettings) {
        this.contextMenuMaSettings.style.display = 'block';
    }
    if (this.bollIndicator.enabled && this.contextMenuBollSettings) {
        this.contextMenuBollSettings.style.display = 'block';
    }
    
    this.showContextMenu(e.clientX, e.clientY);
};

// 双击事件
KlineChart.prototype.onDoubleClick = function(e) {
    var rect = this.canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    
    // 切换十字星显示状态
    var isEnabled = this.crosshair.toggle();
    
    if (isEnabled) {
        // 设置十字星位置
        this.crosshair.setPosition(x, y);
        console.log('十字星已开启');
    } else {
        console.log('十字星已关闭');
    }
    
    // 重绘K线
    this.requestRender();
};

// 触摸开始事件
KlineChart.prototype.onTouchStart = function(e) {
    e.preventDefault();
    
    var touch = e.touches[0];
    this.isDrawing = true;
    this.startPoint = this.getTouchPos(touch);
    
    // 如果是画线工具，开始绘制
    if (this.tool !== 'candle') {
        this.drawingManager.startDrawing(this.tool, this.startPoint);
    } else {
        // K线工具，开始拖拽
        this.isDragging = true;
        this.dragStartX = touch.clientX;
        this.dragStartOffsetX = this.offsetX;
        this.dragStartY = touch.clientY;
        this.dragStartScale = this.scale;
    }
};

// 触摸移动事件
KlineChart.prototype.onTouchMove = function(e) {
    e.preventDefault();
    
    if (!this.isDrawing) return;

    var touch = e.touches[0];
    var currentPoint = this.getTouchPos(touch);

    // 绘制临时线
    if (this.tool !== 'candle') {
        this.drawingManager.updateDrawing(currentPoint);
        this.requestRender();
    } else if (this.isDragging) {
        // 检测是水平移动还是垂直移动
        var absDeltaX = Math.abs(touch.clientX - this.dragStartX);
        var absDeltaY = Math.abs(touch.clientY - this.dragStartY);
        
        if (absDeltaX > absDeltaY) {
            // 水平移动，拖拽K线图
            var deltaX = touch.clientX - this.dragStartX;
            this.offsetX = this.dragStartOffsetX + deltaX;
            
            // 限制offsetX在有效边界内
            this.clampOffsetX();
            
            // 重绘K线
            this.requestRender();
        } else {
            // 垂直移动，缩放K线图
            var deltaY = this.dragStartY - touch.clientY;
            var scaleChange = 1 + deltaY / 200;
            var newScale = this.dragStartScale * scaleChange;
            
            if (newScale >= this.minScale && newScale <= this.maxScale) {
                var width = this.canvas.width;
                var rightPadding = 45;
                var availableWidth = width - rightPadding;
                
                // 计算缩放前的K线实体宽度
                var oldBaseBodyWidth = 6;
                var oldMaxBodyWidthRatio = 0.8;
                var oldCandleWidth = availableWidth / this.candles.length * this.dragStartScale;
                var oldMaxBodyWidth = oldCandleWidth * oldMaxBodyWidthRatio;
                var oldBodyWidth = Math.min(oldBaseBodyWidth * this.dragStartScale, oldMaxBodyWidth);
                
                // 计算缩放前的右边位置（K线实体右边缘相对于画布右边缘，包含2px间距）
                var oldRightX = (this.candles.length - 1) * oldCandleWidth + oldCandleWidth / 2 + this.dragStartOffsetX + oldBodyWidth / 2 + 2;
                var oldRightMargin = width - oldRightX;
                
                // 应用缩放
                this.scale = newScale;
                console.log('缩放比例：' + this.scale.toFixed(2));
                
                // 计算缩放后的K线宽度和实体宽度
                var newCandleWidth = availableWidth / this.candles.length * this.scale;
                var newBaseBodyWidth = 6;
                var newMaxBodyWidthRatio = 0.8;
                var newMaxBodyWidth = newCandleWidth * newMaxBodyWidthRatio;
                var newBodyWidth = Math.min(newBaseBodyWidth * this.scale, newMaxBodyWidth);
                
                // 计算新的offsetX，保持相同的右边距（包含2px间距）
                this.offsetX = width - oldRightMargin - (this.candles.length - 1) * newCandleWidth - newCandleWidth / 2 - newBodyWidth / 2 - 2;
                
                // 确保offsetX在有效边界内
                this.clampOffsetX();
                
                // 重绘K线
                this.requestRender();
            }
        }
    }
};

// 触摸结束事件
KlineChart.prototype.onTouchEnd = function() {
    if (!this.isDrawing) return;

    // 如果是画线工具，完成绘制
    if (this.tool !== 'candle') {
        this.drawingManager.finishDrawing(this.currentStockCode, this.currentPeriod);
    }

    this.isDrawing = false;
    this.isDragging = false;
    this.startPoint = null;
};

// 获取触摸位置
KlineChart.prototype.getTouchPos = function(touch) {
    var rect = this.canvas.getBoundingClientRect();
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
};

// 鼠标滚轮事件
KlineChart.prototype.onWheel = function(e) {
    e.preventDefault();
    
    if (!this.candles || this.candles.length === 0) {
        return;
    }
    
    var delta = e.deltaY > 0 ? 0.9 : 1.1;
    var newScale = this.scale * delta;
    
    if (newScale >= this.minScale && newScale <= this.maxScale) {
        var width = this.canvas.width;
        var rightPadding = 45;
        var availableWidth = width - rightPadding;
        
        // 获取鼠标在画布上的X坐标
        var rect = this.canvas.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;
        
        // 计算缩放前的K线宽度
        var oldCandleWidth = availableWidth / this.candles.length * this.scale;
        
        // 计算鼠标指向的K线索引
        var targetKlineIndex = Math.floor((mouseX - this.offsetX) / oldCandleWidth);
        targetKlineIndex = Math.max(0, Math.min(this.candles.length - 1, targetKlineIndex));
        
        // 计算缩放前，鼠标指向的K线中心相对于画布左边缘的位置
        var oldTargetCenterX = targetKlineIndex * oldCandleWidth + oldCandleWidth / 2 + this.offsetX;
        
        // 应用缩放
        this.scale = newScale;
        console.log('缩放比例：' + this.scale.toFixed(2));
        
        // 计算缩放后的K线宽度
        var newCandleWidth = availableWidth / this.candles.length * this.scale;
        
        // 计算新的offsetX，保持鼠标指向的K线中心位置不变
        this.offsetX = oldTargetCenterX - targetKlineIndex * newCandleWidth - newCandleWidth / 2;
        
        // 确保offsetX在有效边界内
        this.clampOffsetX();
        
        // 重绘K线
        this.requestRender();
    }
};

// 获取鼠标位置
KlineChart.prototype.getMousePos = function(e) {
    var rect = this.canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
};

// 生成示例数据
KlineChart.prototype.generateSampleData = function() {
    console.log('生成示例K线数据');
    // 生成100个示例K线数据
    this.candles = [];
    var basePrice = 3000;
    
    for (var i = 0; i < 100; i++) {
        var open = basePrice + Math.random() * 100 - 50;
        var close = open + Math.random() * 20 - 10;
        var high = Math.max(open, close) + Math.random() * 10;
        var low = Math.min(open, close) - Math.random() * 10;

        this.candles.push({ 
            date: new Date(new Date().getTime() - (100 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            open: open, 
            close: close, 
            high: high, 
            low: low,
            volume: Math.random() * 1000000
        });
    }
    
    console.log('示例数据生成完成，共' + this.candles.length + '条');
};

// 绘制K线
KlineChart.prototype.drawCandles = function() {
    // 检查是否有K线数据
    if (!this.candles || this.candles.length === 0) {
        console.log('没有K线数据');
        return;
    }

    var width = this.canvas.width;
    var height = this.canvas.height;
    
    // 根据是否开启副图指标（MACD或KDJ或WR或RSI或成交量）动态调整主图高度
    var mainChartHeight, subChartHeight;
    if (this.macdIndicator.enabled || this.kdjIndicator.enabled || this.wrIndicator.enabled || this.rsiIndicator.enabled || this.volumeIndicator.enabled) {
        // 开启副图指标：主图占85%，副图占15%
        mainChartHeight = height * 0.85;
        subChartHeight = height * 0.15;
    } else {
        // 未开启副图指标：主图占满整个画布
        mainChartHeight = height;
        subChartHeight = 0;
    }
    
    // 保存主图高度供画线功能使用
    this.currentMainChartHeight = mainChartHeight;
    
    // 右边留出45px空间
    var rightPadding = 45;
    var availableWidth = width - rightPadding;
    
    // 基础实体宽度
    var baseBodyWidth = 6;
    
    // 根据缩放比例计算K线宽度和实体宽度
    var baseCandleWidth = availableWidth / this.candles.length;
    var candleWidth = baseCandleWidth * this.scale;
    
    // 保存K线宽度供画线功能使用
    this.currentCandleWidth = candleWidth;
    
    // 确保最小间距为2px，最大实体宽度不超过K线宽度的80%
    var minGap = 2;
    var maxBodyWidthRatio = 0.8;
    var maxBodyWidth = candleWidth * maxBodyWidthRatio;
    var bodyWidth = Math.min(baseBodyWidth * this.scale, maxBodyWidth);
    var gap = candleWidth - bodyWidth;

    // 计算可见区域的K线范围
    var visibleStartIndex = Math.max(0, Math.floor((-this.offsetX) / candleWidth));
    var visibleEndIndex = Math.min(this.candles.length - 1, Math.ceil((width - this.offsetX) / candleWidth));
    
    // 获取可见区域的K线
    var visibleCandles = this.candles.slice(visibleStartIndex, visibleEndIndex + 1);
    
    // 收集所有支撑线和压力线的价格
    var linePrices = [];
    
    // 收集两点买入的线价格
    if (this.twoPointBuy && this.twoPointBuy.isComplete() && this.twoPointBuy.keyPoints) {
        if (this.twoPointBuy.keyPoints.C1) linePrices.push(this.twoPointBuy.keyPoints.C1.price);
        if (this.twoPointBuy.keyPoints.C2) linePrices.push(this.twoPointBuy.keyPoints.C2.price);
        if (this.twoPointBuy.keyPoints.callback) linePrices.push(this.twoPointBuy.keyPoints.callback.price);
        if (this.twoPointBuy.keyPoints.support) linePrices.push(this.twoPointBuy.keyPoints.support.price);
    }
    // 收集两点买入已保存数据的线价格
    if (this.twoPointBuy && this.twoPointBuy.allData) {
        for (var i = 0; i < this.twoPointBuy.allData.length; i++) {
            var data = this.twoPointBuy.allData[i];
            if (data.keyPoints) {
                if (data.keyPoints.C1) linePrices.push(data.keyPoints.C1.price);
                if (data.keyPoints.C2) linePrices.push(data.keyPoints.C2.price);
                if (data.keyPoints.callback) linePrices.push(data.keyPoints.callback.price);
                if (data.keyPoints.support) linePrices.push(data.keyPoints.support.price);
            }
        }
    }
    
    // 收集两点卖出的线价格
    if (this.twoPointSell && this.twoPointSell.isComplete() && this.twoPointSell.keyPoints) {
        if (this.twoPointSell.keyPoints.D1) linePrices.push(this.twoPointSell.keyPoints.D1.price);
        if (this.twoPointSell.keyPoints.D2) linePrices.push(this.twoPointSell.keyPoints.D2.price);
        if (this.twoPointSell.keyPoints.D3) linePrices.push(this.twoPointSell.keyPoints.D3.price);
        if (this.twoPointSell.keyPoints.strongPressure) linePrices.push(this.twoPointSell.keyPoints.strongPressure.price);
        if (this.twoPointSell.keyPoints.highPoint1) linePrices.push(this.twoPointSell.keyPoints.highPoint1.price);
        if (this.twoPointSell.keyPoints.highPoint2) linePrices.push(this.twoPointSell.keyPoints.highPoint2.price);
    }
    // 收集两点卖出已保存数据的线价格
    if (this.twoPointSell && this.twoPointSell.allData) {
        for (var i = 0; i < this.twoPointSell.allData.length; i++) {
            var data = this.twoPointSell.allData[i];
            if (data.keyPoints) {
                if (data.keyPoints.D1) linePrices.push(data.keyPoints.D1.price);
                if (data.keyPoints.D2) linePrices.push(data.keyPoints.D2.price);
                if (data.keyPoints.D3) linePrices.push(data.keyPoints.D3.price);
                if (data.keyPoints.strongPressure) linePrices.push(data.keyPoints.strongPressure.price);
                if (data.keyPoints.highPoint1) linePrices.push(data.keyPoints.highPoint1.price);
                if (data.keyPoints.highPoint2) linePrices.push(data.keyPoints.highPoint2.price);
            }
        }
    }
    
    // 收集三点买入的线价格
    if (this.threePointBuy && this.threePointBuy.isComplete() && this.threePointBuy.keyPoints) {
        if (this.threePointBuy.keyPoints.C1) linePrices.push(this.threePointBuy.keyPoints.C1.price);
        if (this.threePointBuy.keyPoints.C2) linePrices.push(this.threePointBuy.keyPoints.C2.price);
        if (this.threePointBuy.keyPoints.C3) linePrices.push(this.threePointBuy.keyPoints.C3.price);
    }
    // 收集三点买入已保存数据的线价格
    if (this.threePointBuy && this.threePointBuy.allData) {
        for (var i = 0; i < this.threePointBuy.allData.length; i++) {
            var data = this.threePointBuy.allData[i];
            if (data.keyPoints) {
                if (data.keyPoints.C1) linePrices.push(data.keyPoints.C1.price);
                if (data.keyPoints.C2) linePrices.push(data.keyPoints.C2.price);
                if (data.keyPoints.C3) linePrices.push(data.keyPoints.C3.price);
            }
        }
    }
    
    // 收集三点卖出的线价格
    if (this.threePointSell && this.threePointSell.isComplete() && this.threePointSell.keyPoints) {
        if (this.threePointSell.keyPoints.D1) linePrices.push(this.threePointSell.keyPoints.D1.price);
        if (this.threePointSell.keyPoints.D2) linePrices.push(this.threePointSell.keyPoints.D2.price);
        if (this.threePointSell.keyPoints.D3) linePrices.push(this.threePointSell.keyPoints.D3.price);
    }
    // 收集三点卖出已保存数据的线价格
    if (this.threePointSell && this.threePointSell.allData) {
        for (var i = 0; i < this.threePointSell.allData.length; i++) {
            var data = this.threePointSell.allData[i];
            if (data.keyPoints) {
                if (data.keyPoints.D1) linePrices.push(data.keyPoints.D1.price);
                if (data.keyPoints.D2) linePrices.push(data.keyPoints.D2.price);
                if (data.keyPoints.D3) linePrices.push(data.keyPoints.D3.price);
            }
        }
    }
    
    // 计算可见区域的K线价格范围
    var visiblePrices = [];
    for (var i = 0; i < visibleCandles.length; i++) {
        var c = visibleCandles[i];
        visiblePrices.push(c.open, c.close, c.high, c.low);
    }
    var minPrice = Math.min.apply(null, visiblePrices);
    var maxPrice = Math.max.apply(null, visiblePrices);
    
    // 如果没有可见K线，使用所有K线
    if (!visibleCandles.length) {
        var allPrices = [];
        for (var i = 0; i < this.candles.length; i++) {
            var c = this.candles[i];
            allPrices.push(c.open, c.close, c.high, c.low);
        }
        minPrice = Math.min.apply(null, allPrices);
        maxPrice = Math.max.apply(null, allPrices);
    }
    
    // 保存原始的K线最高价和最低价（用于显示价格标签）
    var originalMinPrice = minPrice;
    var originalMaxPrice = maxPrice;
    
    // 调整价格范围，确保所有线都能显示
    if (linePrices.length > 0) {
        var lineMin = Math.min.apply(null, linePrices);
        var lineMax = Math.max.apply(null, linePrices);
        minPrice = Math.min(minPrice, lineMin);
        maxPrice = Math.max(maxPrice, lineMax);
        
        // 增加一些边距，避免线紧贴边缘
        var lineRange = lineMax - lineMin;
        if (lineRange === 0) lineRange = 1;
        var margin = lineRange * 0.05; // 5%的边距
        minPrice = minPrice - margin;
        maxPrice = maxPrice + margin;
    }
    
    // 如果MA均线开启，在顶部额外留出空间显示MA标签
    var priceRange = maxPrice - minPrice || 1;
    if (this.maIndicator && this.maIndicator.enabled) {
        // 增加顶部价格范围约8%，为MA标签留出空间
        maxPrice = maxPrice + priceRange * 0.08;
    }
        
        var priceRange = maxPrice - minPrice || 1;

        // 保存价格范围供画线功能使用
        this.currentMinPrice = minPrice;
        this.currentMaxPrice = maxPrice;
        this.currentPriceRange = priceRange;

        console.log('绘制' + this.candles.length + '根K线，可见' + visibleCandles.length + '根，价格范围：' + minPrice + '-' + maxPrice + '，缩放：' + this.scale.toFixed(2));

        // 绘制缺口（在K线下面）
        this.gapDetection.render(this.ctx, visibleStartIndex, visibleEndIndex, candleWidth, this.offsetX, minPrice, maxPrice, mainChartHeight);

        // 找到最高价和最低价对应的K线索引（使用原始K线价格）
        var maxPriceIndex = -1;
        var minPriceIndex = -1;
        
        // 先遍历一次，记录最高价和最低价的K线索引
        for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
            var candle = this.candles[i];
            if (candle.high === originalMaxPrice && maxPriceIndex === -1) {
                maxPriceIndex = i;
            }
            if (candle.low === originalMinPrice && minPriceIndex === -1) {
                minPriceIndex = i;
            }
        }
        
        // 第一步：绘制所有K线实体（普通K线和顶底K线）
        for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
            var candle = this.candles[i];
            var x = i * candleWidth + candleWidth / 2 + this.offsetX;
            
            // 计算K线Y坐标（基于主图高度）
            var padding = 15;
            // 如果MA或BOLL开启，增加顶部padding
            if ((this.maIndicator && this.maIndicator.enabled) || (this.bollIndicator && this.bollIndicator.enabled)) {
                padding = 30;
            }
            var availableHeight = mainChartHeight - padding * 2;
            var openY = padding + (maxPrice - candle.open) / priceRange * availableHeight;
            var closeY = padding + (maxPrice - candle.close) / priceRange * availableHeight;

            // 判断是否为顶底K线
            var isTopBottom = this.topBottomKline.enabled && this.topBottomKline.isTopBottomKline(i);
            var isYangXian = candle.close >= candle.open; // 判断是否为阳线
            
            // 判断是否为涨停K线、跌停K线或炸板K线
            var isLimitUp = false;
            var isLimitDown = false;
            var isFriedBoard = false;
            var isFriedBoardYang = false;
            var isFriedBoardYin = false;
            if (i >= 1 && this.currentPeriod !== 'weekly' && this.currentPeriod !== 'monthly') {
                var prevClose = this.candles[i - 1].close;
                var limitUpPrice = prevClose * 1.099;
                isLimitUp = candle.close >= limitUpPrice && candle.close === candle.high;
                isLimitDown = candle.close <= prevClose * 0.901 && candle.close === candle.low;
                // 炸板K线：最高价达到涨停价，但收盘价低于涨停价
                isFriedBoard = candle.high >= limitUpPrice && candle.close < limitUpPrice;
                if (isFriedBoard) {
                    isFriedBoardYang = candle.close >= candle.open; // 炸板阳线
                    isFriedBoardYin = candle.close < candle.open; // 炸板阴线
                }
            }
            
            if (isTopBottom) {
                // 绘制顶底K线实体
                var color = this.topBottomKline.getTopBottomKlineColor(i);
                if (color) {
                    if (candle.close === candle.open) {
                        // 开盘价等于收盘价：使用顶底K线颜色
                        this.ctx.strokeStyle = color.body;
                        this.ctx.lineWidth = 2;
                        this.ctx.beginPath();
                        this.ctx.moveTo(x - bodyWidth / 2, openY);
                        this.ctx.lineTo(x + bodyWidth / 2, openY);
                        this.ctx.stroke();
                    } else if (isYangXian) {
                        // 阳线：空心，只画边框
                        this.ctx.strokeStyle = color.body;
                        this.ctx.lineWidth = 2;
                        this.ctx.strokeRect(x - bodyWidth / 2, Math.min(openY, closeY), bodyWidth, Math.abs(closeY - openY));
                    } else {
                        // 阴线：实心填充
                        this.ctx.fillStyle = color.body;
                        this.ctx.fillRect(x - bodyWidth / 2, Math.min(openY, closeY), bodyWidth, Math.abs(closeY - openY));
                    }
                }
            } else if (isLimitUp) {
                // 涨停K线：实心黄色高亮
                if (candle.close === candle.open) {
                    // 开盘价等于收盘价：黄色横线
                    this.ctx.strokeStyle = '#ffff00';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x - bodyWidth / 2, openY);
                    this.ctx.lineTo(x + bodyWidth / 2, openY);
                    this.ctx.stroke();
                } else {
                    // 正常涨停K线
                    this.ctx.fillStyle = '#ffff00';
                    this.ctx.fillRect(x - bodyWidth / 2, Math.min(openY, closeY), bodyWidth, Math.abs(closeY - openY));
                }
            } else if (isLimitDown) {
                // 跌停K线：实心翠绿色高亮
                if (candle.close === candle.open) {
                    // 开盘价等于收盘价：翠绿色横线
                    this.ctx.strokeStyle = '#00e676';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x - bodyWidth / 2, openY);
                    this.ctx.lineTo(x + bodyWidth / 2, openY);
                    this.ctx.stroke();
                } else {
                    // 正常跌停K线
                    this.ctx.fillStyle = '#00e676';
                    this.ctx.fillRect(x - bodyWidth / 2, Math.min(openY, closeY), bodyWidth, Math.abs(closeY - openY));
                }
            } else if (isFriedBoardYang) {
                // 炸板阳线：紫色空心
                this.ctx.strokeStyle = '#9c27b0';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x - bodyWidth / 2, Math.min(openY, closeY), bodyWidth, Math.abs(closeY - openY));
            } else if (isFriedBoardYin) {
                // 炸板阴线：紫色实心
                this.ctx.fillStyle = '#9c27b0';
                this.ctx.fillRect(x - bodyWidth / 2, Math.min(openY, closeY), bodyWidth, Math.abs(closeY - openY));
            } else {
                // 绘制普通K线实体
                if (candle.close === candle.open) {
                    // 开盘价等于收盘价：白色
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x - bodyWidth / 2, openY);
                    this.ctx.lineTo(x + bodyWidth / 2, openY);
                    this.ctx.stroke();
                } else if (isYangXian) {
                    // 阳线：空心，只画红色边框
                    this.ctx.strokeStyle = '#ef5350';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(x - bodyWidth / 2, Math.min(openY, closeY), bodyWidth, Math.abs(closeY - openY));
                } else {
                    // 阴线：实心绿色填充
                    this.ctx.fillStyle = '#26a69a';
                    this.ctx.fillRect(x - bodyWidth / 2, Math.min(openY, closeY), bodyWidth, Math.abs(closeY - openY));
                }
            }
        }

        // 第二步：绘制所有K线影线（普通K线和顶底K线）
        for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
            var candle = this.candles[i];
            var x = i * candleWidth + candleWidth / 2 + this.offsetX;
            
            // 计算K线Y坐标（基于主图高度）
            var padding = 15;
            // 如果MA或BOLL开启，增加顶部padding
            if ((this.maIndicator && this.maIndicator.enabled) || (this.bollIndicator && this.bollIndicator.enabled)) {
                padding = 30;
            }
            var availableHeight = mainChartHeight - padding * 2;
            var openY = padding + (maxPrice - candle.open) / priceRange * availableHeight;
            var closeY = padding + (maxPrice - candle.close) / priceRange * availableHeight;
            var highY = padding + (maxPrice - candle.high) / priceRange * availableHeight;
            var lowY = padding + (maxPrice - candle.low) / priceRange * availableHeight;
            
            var bodyTopY = Math.min(openY, closeY);
            var bodyBottomY = Math.max(openY, closeY);

            // 判断是否为顶底K线
            var isTopBottom = this.topBottomKline.enabled && this.topBottomKline.isTopBottomKline(i);
            var isEqual = candle.close === candle.open; // 判断开盘价等于收盘价
            
            // 判断是否为涨停K线、跌停K线或炸板K线
            var isLimitUp = false;
            var isLimitDown = false;
            var isFriedBoard = false;
            var isFriedBoardYang = false;
            var isFriedBoardYin = false;
            if (i >= 1 && this.currentPeriod !== 'weekly' && this.currentPeriod !== 'monthly') {
                var prevClose = this.candles[i - 1].close;
                var limitUpPrice = prevClose * 1.099;
                isLimitUp = candle.close >= limitUpPrice && candle.close === candle.high;
                isLimitDown = candle.close <= prevClose * 0.901 && candle.close === candle.low;
                // 炸板K线：最高价达到涨停价，但收盘价低于涨停价
                isFriedBoard = candle.high >= limitUpPrice && candle.close < limitUpPrice;
                if (isFriedBoard) {
                    isFriedBoardYang = candle.close >= candle.open; // 炸板阳线
                    isFriedBoardYin = candle.close < candle.open; // 炸板阴线
                }
            }
            
            if (isTopBottom) {
                // 绘制顶底K线影线
                var color = this.topBottomKline.getTopBottomKlineColor(i);
                if (color) {
                    this.ctx.strokeStyle = color.shadow;
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    // 只画实体上方的影线
                    this.ctx.moveTo(x, highY);
                    this.ctx.lineTo(x, bodyTopY);
                    // 只画实体下方的影线
                    this.ctx.moveTo(x, bodyBottomY);
                    this.ctx.lineTo(x, lowY);
                    this.ctx.stroke();
                }
            } else if (isLimitUp) {
                // 涨停K线影线：黄色
                this.ctx.strokeStyle = '#ffff00';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                // 只画实体上方的影线
                this.ctx.moveTo(x, highY);
                this.ctx.lineTo(x, bodyTopY);
                // 只画实体下方的影线
                this.ctx.moveTo(x, bodyBottomY);
                this.ctx.lineTo(x, lowY);
                this.ctx.stroke();
            } else if (isLimitDown) {
                // 跌停K线影线：翠绿色
                this.ctx.strokeStyle = '#00e676';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                // 只画实体上方的影线
                this.ctx.moveTo(x, highY);
                this.ctx.lineTo(x, bodyTopY);
                // 只画实体下方的影线
                this.ctx.moveTo(x, bodyBottomY);
                this.ctx.lineTo(x, lowY);
                this.ctx.stroke();
            } else if (isFriedBoardYang) {
                // 炸板阳线影线：紫色
                this.ctx.strokeStyle = '#9c27b0';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                // 只画实体上方的影线
                this.ctx.moveTo(x, highY);
                this.ctx.lineTo(x, bodyTopY);
                // 只画实体下方的影线
                this.ctx.moveTo(x, bodyBottomY);
                this.ctx.lineTo(x, lowY);
                this.ctx.stroke();
            } else if (isFriedBoardYin) {
                // 炸板阴线影线：紫色
                this.ctx.strokeStyle = '#9c27b0';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                // 只画实体上方的影线
                this.ctx.moveTo(x, highY);
                this.ctx.lineTo(x, bodyTopY);
                // 只画实体下方的影线
                this.ctx.moveTo(x, bodyBottomY);
                this.ctx.lineTo(x, lowY);
                this.ctx.stroke();
            } else {
                // 绘制普通K线影线
                var color = candle.close >= candle.open ? '#ef5350' : '#26a69a';
                this.ctx.strokeStyle = isEqual ? '#ffffff' : color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                // 只画实体上方的影线
                this.ctx.moveTo(x, highY);
                this.ctx.lineTo(x, bodyTopY);
                // 只画实体下方的影线
                this.ctx.moveTo(x, bodyBottomY);
                this.ctx.lineTo(x, lowY);
                this.ctx.stroke();
            }
        }
        
        // 第三步：在涨跌停K线和炸板K线中间显示文字
        for (var i = visibleStartIndex; i <= visibleEndIndex; i++) {
            var candle = this.candles[i];
            var x = i * candleWidth + candleWidth / 2 + this.offsetX;
            
            // 计算K线Y坐标（基于主图高度）
            var padding = 15;
            // 如果MA或BOLL开启，增加顶部padding
            if ((this.maIndicator && this.maIndicator.enabled) || (this.bollIndicator && this.bollIndicator.enabled)) {
                padding = 30;
            }
            var availableHeight = mainChartHeight - padding * 2;
            var openY = padding + (maxPrice - candle.open) / priceRange * availableHeight;
            var closeY = padding + (maxPrice - candle.close) / priceRange * availableHeight;
            
            // 判断是否为涨停K线、跌停K线或炸板K线
            var isLimitUp = false;
            var isLimitDown = false;
            var isFriedBoard = false;
            if (i >= 1 && this.currentPeriod !== 'weekly' && this.currentPeriod !== 'monthly') {
                var prevClose = this.candles[i - 1].close;
                var limitUpPrice = prevClose * 1.099;
                isLimitUp = candle.close >= limitUpPrice && candle.close === candle.high;
                isLimitDown = candle.close <= prevClose * 0.901 && candle.close === candle.low;
                isFriedBoard = candle.high >= limitUpPrice && candle.close < limitUpPrice;
            }
            
            var text = '';
            var textColor = '#ffffff';
            if (isLimitUp) {
                text = '涨';
                textColor = '#ff0000';
            } else if (isLimitDown) {
                text = '跌';
                textColor = '#ffffff';
            } else if (isFriedBoard) {
                text = '炸';
                textColor = '#ffffff';
            }
            
            if (text !== '' && bodyWidth >= 8) {
                // 计算文字位置（K线中间）
                var bodyCenterY = (openY + closeY) / 2;
                
                // 设置文字样式
                this.ctx.fillStyle = textColor;
                this.ctx.font = 'bold ' + Math.max(10, Math.min(bodyWidth, 14)) + 'px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                // 绘制文字
                this.ctx.fillText(text, x, bodyCenterY);
            }
        }
        
        // 绘制价格标签（最高价和最低价）
        this.drawPriceLabels(maxPrice, minPrice, originalMaxPrice, originalMinPrice, maxPriceIndex, minPriceIndex, candleWidth, this.offsetX, mainChartHeight);
        
        // 绘制现价水平虚线
        this.drawCurrentPriceLine(maxPrice, minPrice, candleWidth, mainChartHeight);
        
        // 绘制涨停价和跌停价
        this.drawLimitPrices(maxPrice, minPrice, candleWidth, mainChartHeight);
        
        // 绘制MA均线
        this.maIndicator.render(this.ctx, visibleStartIndex, visibleEndIndex, candleWidth, this.offsetX, minPrice, maxPrice, mainChartHeight);
        
        // 绘制BOLL布林通道
        this.bollIndicator.render(this.ctx, visibleStartIndex, visibleEndIndex, candleWidth, this.offsetX, minPrice, maxPrice, mainChartHeight);
        
        // 绘制MACD副图
        if (this.macdIndicator.enabled) {
            this.macdIndicator.render(this.ctx, visibleStartIndex, visibleEndIndex, candleWidth, this.offsetX, mainChartHeight);
        }
        
        // 绘制KDJ副图
        if (this.kdjIndicator.enabled) {
            this.kdjIndicator.render(this.ctx, visibleStartIndex, visibleEndIndex, candleWidth, this.offsetX, mainChartHeight);
        }
        
        // 绘制WR副图
        if (this.wrIndicator.enabled) {
            this.wrIndicator.render(this.ctx, visibleStartIndex, visibleEndIndex, candleWidth, this.offsetX, mainChartHeight);
        }
        
        // 绘制RSI副图
        if (this.rsiIndicator.enabled) {
            this.rsiIndicator.render(this.ctx, visibleStartIndex, visibleEndIndex, candleWidth, this.offsetX, mainChartHeight);
        }
        
        // 绘制成交量副图
        if (this.volumeIndicator.enabled) {
            this.volumeIndicator.render(this.ctx, visibleStartIndex, visibleEndIndex, candleWidth, this.offsetX, mainChartHeight);
        }
        
        // 绘制十字星虚线（最顶层，包括副图区域）
        if (this.crosshair.enabled) {
            this.crosshair.render(this.ctx);
        }
        
        // 绘制MA均线提示（在鼠标旁边）
        if (this.isMouseOverCanvas && this.maIndicator && this.maIndicator.enabled && !this.isContextMenuShowing) {
            this.maIndicator.renderTooltip(
                this.ctx,
                this.mouseX,
                this.mouseY,
                candleWidth,
                this.offsetX,
                minPrice,
                maxPrice,
                mainChartHeight
            );
        }
        
        // 绘制BOLL布林通道提示（在鼠标旁边）
        if (this.isMouseOverCanvas && this.bollIndicator && this.bollIndicator.enabled && !this.isContextMenuShowing) {
            this.bollIndicator.renderTooltip(
                this.ctx,
                this.mouseX,
                this.mouseY,
                candleWidth,
                this.offsetX,
                minPrice,
                maxPrice,
                mainChartHeight
            );
        }

        // （左上角静态 OHLC 面板已移除，改用十字光标信息框显示）

    }

    // 绘制光标所在K线的OHLC信息面板（始终显示，无需双击激活）
    KlineChart.prototype.drawCandleHoverInfo = function(ctx, candleWidth, offsetX, mainChartHeight) {
        if (!this.candles || this.candles.length === 0) return;

        var idx = Math.floor((this.mouseX - offsetX) / candleWidth);
        if (idx < 0 || idx >= this.candles.length) return;

        var candle = this.candles[idx];
        if (!candle) return;

        // 计算涨跌幅
        var prevClose = idx > 0 ? this.candles[idx - 1].close : candle.open;
        var changePct = prevClose > 0 ? ((candle.close - prevClose) / prevClose * 100) : 0;
        var changeSign = changePct >= 0 ? '+' : '';

        // 格式化成交量
        function fmtVol(v) {
            if (!v || v <= 0) return '--';
            if (v >= 1e8) return (v / 1e8).toFixed(2) + '亿';
            if (v >= 1e4) return (v / 1e4).toFixed(2) + '万';
            return Math.round(v).toString();
        }

        // 格式化成交额
        function fmtAmt(a) {
            if (!a || a <= 0) return '--';
            if (a >= 1e8) return (a / 1e8).toFixed(2) + '亿';
            if (a >= 1e4) return (a / 1e4).toFixed(2) + '万';
            return Math.round(a).toString();
        }

        var dateStr = candle.date || candle.day || '';

        var lines = [
            dateStr,
            'O ' + (candle.open != null ? candle.open.toFixed(2) : '--'),
            'H ' + (candle.high != null ? candle.high.toFixed(2) : '--'),
            'L ' + (candle.low != null ? candle.low.toFixed(2) : '--'),
            'C ' + (candle.close != null ? candle.close.toFixed(2) : '--'),
            '涨 ' + changeSign + changePct.toFixed(2) + '%',
            '量 ' + fmtVol(candle.volume),
            '额 ' + fmtAmt(candle.amount),
        ];

        var fontSize = 11;
        var lineH = 16;
        var padX = 8, padY = 6;
        var panelW = 0;
        ctx.font = fontSize + 'px monospace';
        for (var i = 0; i < lines.length; i++) {
            var tw = ctx.measureText(lines[i]).width;
            if (tw > panelW) panelW = tw;
        }
        panelW += padX * 2;
        var panelH = lines.length * lineH + padY * 2;

        // 固定在主图左上角显示
        var px = 8, py = 8;

        // 如果十字星已开启，则下移避免重叠
        if (this.crosshair && this.crosshair.enabled) {
            py = 38;
        }

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.strokeStyle = '#4a90e2';
        ctx.lineWidth = 1;
        ctx.fillRect(px, py, panelW, panelH);
        ctx.strokeRect(px, py, panelW, panelH);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        for (var i = 0; i < lines.length; i++) {
            var ty = py + padY + i * lineH;
            var line = lines[i];

            if (i === 5) {
                // 涨跌行：红色涨，绿色跌
                ctx.fillStyle = changePct >= 0 ? '#ef4444' : '#22c55e';
            } else if (i === 0) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = '#d1d5db';
            }

            ctx.fillText(line, px + padX, ty);
        }
        ctx.restore();
    };

    // 绘制价格标签
    KlineChart.prototype.drawPriceLabels = function(adjustedMaxPrice, adjustedMinPrice, originalMaxPrice, originalMinPrice, maxPriceIndex, minPriceIndex, candleWidth, offsetX, mainChartHeight) {
        var pricePadding = 10;
        var centerX = this.canvas.width / 2;
        var padding = 15;
        // 如果MA或BOLL开启，增加顶部padding
        if ((this.maIndicator && this.maIndicator.enabled) || (this.bollIndicator && this.bollIndicator.enabled)) {
            padding = 30;
        }
        var availableHeight = mainChartHeight - padding * 2;
        
        // 绘制最高价标签
        if (maxPriceIndex !== -1) {
            var maxPriceX = maxPriceIndex * candleWidth + candleWidth / 2 + offsetX;
            var highY = padding + (adjustedMaxPrice - originalMaxPrice) / (adjustedMaxPrice - adjustedMinPrice || 1) * availableHeight;
            
            // 判断最高价K线在左边还是右边
            if (maxPriceX < centerX) {
                // 在左边，文字显示在右边
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.textBaseline = 'middle';
                var lineX = Math.min(maxPriceX + 5, this.canvas.width - 50);
                var textX = Math.min(maxPriceX + 15, this.canvas.width - 40);
                this.ctx.fillText('一', lineX, highY);
                this.ctx.fillText(originalMaxPrice.toFixed(2), textX, highY);
            } else {
                // 在右边，文字显示在左边
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'right';
                this.ctx.textBaseline = 'middle';
                var lineX = Math.max(maxPriceX - 5, 40);
                var textX = Math.max(maxPriceX - 15, 30);
                this.ctx.fillText('一', lineX, highY);
                this.ctx.fillText(originalMaxPrice.toFixed(2), textX, highY);
            }
        }
        
        // 绘制最低价标签
        if (minPriceIndex !== -1) {
            var minPriceX = minPriceIndex * candleWidth + candleWidth / 2 + offsetX;
            var lowY = padding + (adjustedMaxPrice - originalMinPrice) / (adjustedMaxPrice - adjustedMinPrice || 1) * availableHeight;
            
            // 判断最低价K线在左边还是右边
            if (minPriceX < centerX) {
                // 在左边，文字显示在右边
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.textBaseline = 'middle';
                var lineX = Math.min(minPriceX + 5, this.canvas.width - 50);
                var textX = Math.min(minPriceX + 15, this.canvas.width - 40);
                this.ctx.fillText('一', lineX, lowY);
                this.ctx.fillText(originalMinPrice.toFixed(2), textX, lowY);
            } else {
                // 在右边，文字显示在左边
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'right';
                this.ctx.textBaseline = 'middle';
                var lineX = Math.max(minPriceX - 5, 40);
                var textX = Math.max(minPriceX - 15, 30);
                this.ctx.fillText('一', lineX, lowY);
                this.ctx.fillText(originalMinPrice.toFixed(2), textX, lowY);
            }
        }
    }
    
    // 绘制现价水平虚线
    KlineChart.prototype.drawCurrentPriceLine = function(maxPrice, minPrice, candleWidth, mainChartHeight) {
        // 检查是否有K线数据
        if (!this.candles || this.candles.length === 0) {
            this.currentPriceLabelRect = null;
            return;
        }
        
        // 获取最新K线的收盘价（现价）
        var lastCandle = this.candles[this.candles.length - 1];
        var currentPrice = lastCandle.close;
        
        // 计算现价的Y坐标
        var padding = 15;
        var availableHeight = mainChartHeight - padding * 2;
        var priceRange = maxPrice - minPrice || 1;
        var currentPriceY = padding + (maxPrice - currentPrice) / priceRange * availableHeight;
        
        // 绘制现价标签背景
        var labelWidth = 40;
        var labelHeight = 20;
        var labelX = this.canvas.width - labelWidth - 5;
        var labelY = currentPriceY - labelHeight / 2;
        
        // 保存现价标签位置，用于点击检测
        this.currentPriceLabelRect = {
            x: labelX,
            y: labelY,
            width: labelWidth,
            height: labelHeight
        };
        
        // 绘制水平虚线（从画布左边到现价框左边）
        this.ctx.strokeStyle = '#ffcc00';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, currentPriceY);
        this.ctx.lineTo(labelX, currentPriceY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        this.ctx.fillStyle = 'rgba(255, 204, 0, 0.2)';
        this.ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
        
        // 绘制现价标签边框
        this.ctx.strokeStyle = '#ffcc00';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([]);
        this.ctx.strokeRect(labelX, labelY, labelWidth, labelHeight);
        
        // 绘制现价文字
        this.ctx.fillStyle = '#ffcc00';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(currentPrice.toFixed(2), labelX + labelWidth / 2, labelY + labelHeight / 2);
    };

    // 绘制涨停价和跌停价
    KlineChart.prototype.drawLimitPrices = function(maxPrice, minPrice, candleWidth, mainChartHeight) {
        // 周线和月线不显示涨停跌停价
        if (this.currentPeriod === 'weekly' || this.currentPeriod === 'monthly') {
            return;
        }
        
        // 检查是否有日线前收盘价
        if (!this.dailyPrevClose) {
            return;
        }
        
        // 使用日线前收盘价
        var prevClose = this.dailyPrevClose;
        
        // 根据股票代码判断板块，确定涨跌幅
        var limitRatio = 0.1; // 默认10%涨跌幅
        var stockCode = this.currentStockCode;
        
        if (stockCode) {
            // 判断是否是ST股票（代码中包含ST）
            if (stockCode.indexOf('ST') !== -1 || stockCode.indexOf('st') !== -1) {
                limitRatio = 0.05; // ST股票5%涨跌幅
            }
            // 判断是否是创业板（30开头）、科创板（688开头）、北交所（8开头）
            else if (stockCode.indexOf('sz30') === 0 || stockCode.indexOf('30') === 0 || 
                     stockCode.indexOf('sh688') === 0 || stockCode.indexOf('688') === 0 ||
                     stockCode.indexOf('bj8') === 0 || stockCode.indexOf('8') === 0) {
                limitRatio = 0.2; // 创业板、科创板、北交所20%涨跌幅
            }
            // 其他主板股票（60、00开头）默认10%
        }
        
        // 计算涨停价和跌停价
        var limitUpPrice = prevClose * (1 + limitRatio);
        var limitDownPrice = prevClose * (1 - limitRatio);
        
        // 计算Y坐标
        var padding = 15;
        var availableHeight = mainChartHeight - padding * 2;
        var priceRange = maxPrice - minPrice || 1;
        
        var limitUpY = padding + (maxPrice - limitUpPrice) / priceRange * availableHeight;
        var limitDownY = padding + (maxPrice - limitDownPrice) / priceRange * availableHeight;
        
        // 标签参数
        var labelWidth = 40;
        var labelHeight = 20;
        var labelX = this.canvas.width - labelWidth - 5;
        
        // 绘制涨停价（红色）
        if (limitUpY >= padding && limitUpY <= mainChartHeight - padding) {
            // 绘制涨停价标签（在线的上方）
            var limitUpLabelY = limitUpY - labelHeight - 2;
            if (limitUpLabelY < padding) {
                limitUpLabelY = limitUpY + 2;
            }
            
            this.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
            this.ctx.fillRect(labelX, limitUpLabelY, labelWidth, labelHeight);
            
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(labelX, limitUpLabelY, labelWidth, labelHeight);
            
            this.ctx.fillStyle = '#ff0000';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(limitUpPrice.toFixed(2), labelX + labelWidth / 2, limitUpLabelY + labelHeight / 2);
        }
        
        // 绘制跌停价（绿色）
        if (limitDownY >= padding && limitDownY <= mainChartHeight - padding) {
            // 绘制跌停价标签（在线的下方）
            var limitDownLabelY = limitDownY + 2;
            if (limitDownLabelY + labelHeight > mainChartHeight - padding) {
                limitDownLabelY = limitDownY - labelHeight - 2;
            }
            
            this.ctx.fillStyle = 'rgba(38, 166, 154, 0.2)';
            this.ctx.fillRect(labelX, limitDownLabelY, labelWidth, labelHeight);
            
            this.ctx.strokeStyle = '#26a69a';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(labelX, limitDownLabelY, labelWidth, labelHeight);
            
            this.ctx.fillStyle = '#26a69a';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(limitDownPrice.toFixed(2), labelX + labelWidth / 2, limitDownLabelY + labelHeight / 2);
        }
    };

    // 绘制线条
    KlineChart.prototype.drawLine = function(start, end, type) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);

        // 根据类型设置颜色
        switch (type) {
            case 'two-buy':
                this.ctx.strokeStyle = '#66bb6a'; // 绿色
                break;
            case 'two-sell':
                this.ctx.strokeStyle = '#ef5350'; // 红色
                break;
            case 'three-buy':
                this.ctx.strokeStyle = '#42a5f5'; // 蓝色
                break;
            case 'three-sell':
                this.ctx.strokeStyle = '#ffa726'; // 橙色
                break;
        }

        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    };

    // 绘制已保存的线条
    KlineChart.prototype.drawSavedLines = function() {
        var drawings = this.drawingManager.getDrawingData(this.currentStockCode, this.currentPeriod);
        
        for (var i = 0; i < drawings.length; i++) {
            var drawing = drawings[i];
            this.drawDrawingLine(drawing);
        }
        
        // 绘制两点买入的内容（始终显示，不管当前工具是什么）
        if (this.twoPointBuy && this.twoPointBuy.points.length > 0) {
            this.twoPointBuy.render(this.ctx);
        }
        
        // 绘制两点卖出的内容（始终显示，不管当前工具是什么）
        if (this.twoPointSell && this.twoPointSell.points.length > 0) {
            this.twoPointSell.render(this.ctx);
        }
    };

    // 绘制单条线
    KlineChart.prototype.drawDrawingLine = function(drawing) {
        this.ctx.beginPath();
        this.ctx.moveTo(drawing.start_x, drawing.start_y);
        this.ctx.lineTo(drawing.end_x, drawing.end_y);
        this.ctx.strokeStyle = drawing.color;
        this.ctx.lineWidth = drawing.width;
        this.ctx.stroke();

        // 绘制关键点位
        if (drawing.levels) {
            for (var key in drawing.levels) {
                if (drawing.levels.hasOwnProperty(key)) {
                    var level = drawing.levels[key];
                    this.drawLevelPoint(drawing.end_x, level.price, key, level.description);
                }
            }
        }
    }

    // 绘制关键点位
    KlineChart.prototype.drawLevelPoint = function(x, price, label, description) {
        // 计算Y坐标
        var height = this.canvas.height;
        var allPrices = [];
        for (var i = 0; i < this.candles.length; i++) {
            var c = this.candles[i];
            allPrices.push(c.open, c.close, c.high, c.low);
        }
        var minPrice = Math.min.apply(null, allPrices);
        var maxPrice = Math.max.apply(null, allPrices);
        var priceRange = maxPrice - minPrice;
        
        var y = height - ((price - minPrice) / priceRange) * (height - 50) - 25;

        // 绘制点位
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 绘制标签
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(label + ': ' + price.toFixed(2), x + 8, y + 4);
    };

    // 清除画布
    KlineChart.prototype.clearCanvas = function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 清除两点买入的数据
        if (this.twoPointBuy) {
            this.twoPointBuy.clear(this.currentStockCode, this.currentPeriod);
        }
        
        // 清除两点卖出的数据
        if (this.twoPointSell) {
            this.twoPointSell.clear(this.currentStockCode, this.currentPeriod);
        }
        
        // 清除三点买入的数据
        if (this.threePointBuy) {
            this.threePointBuy.clear(this.currentStockCode, this.currentPeriod);
        }
        
        // 清除三点卖出的数据
        if (this.threePointSell) {
            this.threePointSell.clear(this.currentStockCode, this.currentPeriod);
        }
        
        // 清除量能统计的数据
        if (this.volumeStatistics) {
            this.volumeStatistics.clear(this.currentStockCode, this.currentPeriod);
        }
        
        // 清除矩形数据
        if (this.rectangleDrawing) {
            this.rectangleDrawing.clear(this.currentStockCode, this.currentPeriod);
        }
        // 清除线段数据
        if (this.lineDrawing) {
            this.lineDrawing.clear(this.currentStockCode, this.currentPeriod);
        }
        // 清除射线数据
        if (this.rayDrawing) {
            this.rayDrawing.clear(this.currentStockCode, this.currentPeriod);
        }
        // 清除水平线数据
        if (this.horizontalLineDrawing) {
            this.horizontalLineDrawing.clear(this.currentStockCode, this.currentPeriod);
        }
        // 清除垂直线数据
    if (this.verticalLineDrawing) {
        this.verticalLineDrawing.clear(this.currentStockCode, this.currentPeriod);
    }
    // 清除标价线数据
    if (this.priceLineDrawing) {
        this.priceLineDrawing.clear(this.currentStockCode, this.currentPeriod);
    }
    // 清除平行线数据
    if (this.parallelLineDrawing) {
        this.parallelLineDrawing.clear(this.currentStockCode, this.currentPeriod);
    }
    // 清除圆形数据
    if (this.circleDrawing) {
        this.circleDrawing.clear(this.currentStockCode, this.currentPeriod);
    }
    // 清除文字数据
    if (this.textDrawing) {
        this.textDrawing.clear(this.currentStockCode, this.currentPeriod);
    }
    // 清除箭头数据
    if (this.arrowDrawing) {
        this.arrowDrawing.clear(this.currentStockCode, this.currentPeriod);
    }
    // 清除黄金分割数据
    if (this.goldenSectionDrawing) {
        this.goldenSectionDrawing.clear(this.currentStockCode, this.currentPeriod);
    }
    // 清除江恩线数据
    if (this.gannLineDrawing) {
        this.gannLineDrawing.clear(this.currentStockCode, this.currentPeriod);
    }
    // 清除测量距离数据
    if (this.measureDistance) {
        this.measureDistance.clear(this.currentStockCode, this.currentPeriod);
    }
        
        // 重绘K线
        this.requestRender();
    };
    
    // 更新自选股列表的高亮状态
    KlineChart.prototype.updateStockListHighlight = function() {
        var stockListContent = document.getElementById('stock-list-content');
        if (!stockListContent) {
            return;
        }
        
        var stockItems = stockListContent.querySelectorAll('[data-index]');
        for (var i = 0; i < stockItems.length; i++) {
            var stockItem = stockItems[i];
            var stockCodeSpan = stockItem.querySelector('span[style*="font-weight: bold"]');
            if (stockCodeSpan) {
                var stockCode = stockCodeSpan.textContent.trim();
                if (stockCode === this.currentStockCode) {
                    stockItem.style.backgroundColor = '#4a90e2';
                    stockItem.style.border = '2px solid #60a5fa';
                } else {
                    stockItem.style.backgroundColor = '#374151';
                    stockItem.style.border = '1px solid transparent';
                }
            }
        }
    };
    
    // 合并实时K线数据
    KlineChart.prototype.mergeRealtimeData = function(newData) {
        if (!newData || newData.length === 0) {
            return;
        }
        
        // 获取现有数据的最后一根K线的时间戳
        var lastTimestamp = this.candles.length > 0 ? this.candles[this.candles.length - 1].day : null;
        
        // 如果没有现有数据，直接使用新数据
        if (!lastTimestamp) {
            this.candles = newData;
            return;
        }
        
        // 找到新数据中需要更新的部分
        var updateIndex = -1;
        for (var i = 0; i < newData.length; i++) {
            if (newData[i].day === lastTimestamp) {
                updateIndex = i;
                break;
            }
        }
        
        // 如果找到了匹配的时间戳，更新从该位置开始的数据
        if (updateIndex >= 0) {
            // 更新现有数据
            for (var i = updateIndex; i < newData.length; i++) {
                var existingIndex = this.candles.length - (newData.length - i);
                if (existingIndex >= 0 && existingIndex < this.candles.length) {
                    this.candles[existingIndex] = newData[i];
                }
            }
        } else {
            // 没有找到匹配的时间戳，说明是新的K线，添加到末尾
            for (var i = 0; i < newData.length; i++) {
                if (newData[i].day > lastTimestamp) {
                    this.candles.push(newData[i]);
                }
            }
        }
    };

// 初始化成交量均线设置对话框
KlineChart.prototype.initVolumeSettingsDialog = function() {
    var self = this;
    
    // 获取对话框元素
    this.contextMenuVolumeSettings = document.getElementById('context-menu-volume-settings');
    this.volumeSettingsOverlay = document.getElementById('volume-settings-overlay');
    this.volumeEnabled5Input = document.getElementById('volume-enabled-5');
    this.volumeEnabled10Input = document.getElementById('volume-enabled-10');
    this.volumeEnabled20Input = document.getElementById('volume-enabled-20');
    this.volumeEnabled30Input = document.getElementById('volume-enabled-30');
    this.volume5Input = document.getElementById('volume-5');
    this.volume10Input = document.getElementById('volume-10');
    this.volume20Input = document.getElementById('volume-20');
    this.volume30Input = document.getElementById('volume-30');
    this.volumeColor5Input = document.getElementById('volume-color-5');
    this.volumeColor10Input = document.getElementById('volume-color-10');
    this.volumeColor20Input = document.getElementById('volume-color-20');
    this.volumeColor30Input = document.getElementById('volume-color-30');
    this.volumeSettingsBtnCancel = document.getElementById('volume-settings-btn-cancel');
    this.volumeSettingsBtnDefault = document.getElementById('volume-settings-btn-default');
    this.volumeSettingsBtnConfirm = document.getElementById('volume-settings-btn-confirm');
    
    // 绑定右键菜单项事件
    if (this.contextMenuVolumeSettings) {
        this.contextMenuVolumeSettings.onclick = function() {
            self.hideContextMenu();
            self.showVolumeSettingsDialog();
        };
    }
    
    // 绑定取消按钮事件
    if (this.volumeSettingsBtnCancel) {
        this.volumeSettingsBtnCancel.onclick = function() {
            self.hideVolumeSettingsDialog();
        };
    }
    
    // 绑定默认按钮事件
    if (this.volumeSettingsBtnDefault) {
        this.volumeSettingsBtnDefault.onclick = function() {
            self.resetVolumeSettingsToDefault();
        };
    }
    
    // 绑定确认按钮事件
    if (this.volumeSettingsBtnConfirm) {
        this.volumeSettingsBtnConfirm.onclick = function() {
            self.applyVolumeSettings();
        };
    }
    
    // 绑定所有输入框的实时更新事件
    var bindInputs = function(inputs) {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i]) {
                inputs[i].addEventListener('change', function() {
                    self.updateVolumeSettingsRealtime();
                });
                inputs[i].addEventListener('input', function() {
                    self.updateVolumeSettingsRealtime();
                });
            }
        }
    };
    
    bindInputs([
        this.volumeEnabled5Input, this.volumeEnabled10Input, 
        this.volumeEnabled20Input, this.volumeEnabled30Input,
        this.volume5Input, this.volume10Input, 
        this.volume20Input, this.volume30Input,
        this.volumeColor5Input, this.volumeColor10Input, 
        this.volumeColor20Input, this.volumeColor30Input
    ]);
    
    // 点击遮罩层关闭
    if (this.volumeSettingsOverlay) {
        this.volumeSettingsOverlay.onclick = function(e) {
            if (e.target === self.volumeSettingsOverlay) {
                self.hideVolumeSettingsDialog();
            }
        };
    }
};

// 显示成交量均线设置对话框
KlineChart.prototype.showVolumeSettingsDialog = function() {
    console.log('Showing Volume settings dialog, current params:', 
        this.volumeIndicator.periods, this.volumeIndicator.colors, this.volumeIndicator.enabledList);
    
    if (this.volumeEnabled5Input) {
        this.volumeEnabled5Input.checked = this.volumeIndicator.enabledList.ma5;
    }
    if (this.volumeEnabled10Input) {
        this.volumeEnabled10Input.checked = this.volumeIndicator.enabledList.ma10;
    }
    if (this.volumeEnabled20Input) {
        this.volumeEnabled20Input.checked = this.volumeIndicator.enabledList.ma20;
    }
    if (this.volumeEnabled30Input) {
        this.volumeEnabled30Input.checked = this.volumeIndicator.enabledList.ma30;
    }
    
    if (this.volume5Input) {
        this.volume5Input.value = this.volumeIndicator.periods.ma5;
    }
    if (this.volume10Input) {
        this.volume10Input.value = this.volumeIndicator.periods.ma10;
    }
    if (this.volume20Input) {
        this.volume20Input.value = this.volumeIndicator.periods.ma20;
    }
    if (this.volume30Input) {
        this.volume30Input.value = this.volumeIndicator.periods.ma30;
    }
    
    if (this.volumeColor5Input) {
        this.volumeColor5Input.value = this.volumeIndicator.colors.ma5;
    }
    if (this.volumeColor10Input) {
        this.volumeColor10Input.value = this.volumeIndicator.colors.ma10;
    }
    if (this.volumeColor20Input) {
        this.volumeColor20Input.value = this.volumeIndicator.colors.ma20;
    }
    if (this.volumeColor30Input) {
        this.volumeColor30Input.value = this.volumeIndicator.colors.ma30;
    }
    
    if (this.volumeSettingsOverlay) {
        this.volumeSettingsOverlay.style.display = 'flex';
    }
};

// 隐藏成交量均线设置对话框
KlineChart.prototype.hideVolumeSettingsDialog = function() {
    if (this.volumeSettingsOverlay) {
        this.volumeSettingsOverlay.style.display = 'none';
    }
};

// 重置成交量均线为默认值
KlineChart.prototype.resetVolumeSettingsToDefault = function() {
    this.volumeIndicator.resetToDefault();
    
    if (this.volumeEnabled5Input) {
        this.volumeEnabled5Input.checked = false;
    }
    if (this.volumeEnabled10Input) {
        this.volumeEnabled10Input.checked = false;
    }
    if (this.volumeEnabled20Input) {
        this.volumeEnabled20Input.checked = false;
    }
    if (this.volumeEnabled30Input) {
        this.volumeEnabled30Input.checked = false;
    }
    
    if (this.volume5Input) {
        this.volume5Input.value = 5;
    }
    if (this.volume10Input) {
        this.volume10Input.value = 10;
    }
    if (this.volume20Input) {
        this.volume20Input.value = 20;
    }
    if (this.volume30Input) {
        this.volume30Input.value = 30;
    }
    
    if (this.volumeColor5Input) {
        this.volumeColor5Input.value = '#fbbf24';
    }
    if (this.volumeColor10Input) {
        this.volumeColor10Input.value = '#60a5fa';
    }
    if (this.volumeColor20Input) {
        this.volumeColor20Input.value = '#22c55e';
    }
    if (this.volumeColor30Input) {
        this.volumeColor30Input.value = '#f97316';
    }
    
    // 实时更新显示
    this.updateVolumeSettingsRealtime();
};

// 获取当前输入框的参数
KlineChart.prototype.getVolumeSettingsFromInputs = function() {
    var periods = {
        ma5: this.volume5Input ? parseInt(this.volume5Input.value) || 5 : 5,
        ma10: this.volume10Input ? parseInt(this.volume10Input.value) || 10 : 10,
        ma20: this.volume20Input ? parseInt(this.volume20Input.value) || 20 : 20,
        ma30: this.volume30Input ? parseInt(this.volume30Input.value) || 30 : 30
    };
    
    var colors = {
        ma5: this.volumeColor5Input ? this.volumeColor5Input.value : '#fbbf24',
        ma10: this.volumeColor10Input ? this.volumeColor10Input.value : '#60a5fa',
        ma20: this.volumeColor20Input ? this.volumeColor20Input.value : '#22c55e',
        ma30: this.volumeColor30Input ? this.volumeColor30Input.value : '#f97316'
    };
    
    var enabledList = {
        ma5: this.volumeEnabled5Input ? this.volumeEnabled5Input.checked : true,
        ma10: this.volumeEnabled10Input ? this.volumeEnabled10Input.checked : true,
        ma20: this.volumeEnabled20Input ? this.volumeEnabled20Input.checked : true,
        ma30: this.volumeEnabled30Input ? this.volumeEnabled30Input.checked : true
    };
    
    return { periods: periods, colors: colors, enabledList: enabledList };
};

// 实时更新成交量均线参数
KlineChart.prototype.updateVolumeSettingsRealtime = function() {
    var settings = this.getVolumeSettingsFromInputs();
    
    // 设置参数
    this.volumeIndicator.setParams(settings.periods, settings.colors, settings.enabledList);
    
    // 重新计算成交量均线
    if (this.candles && this.candles.length > 0) {
        this.volumeIndicator.calculateVolume(this.candles);
    }
    
    // 重绘
    this.requestRender();
};

// 应用成交量均线设置
KlineChart.prototype.applyVolumeSettings = function() {
    var settings = this.getVolumeSettingsFromInputs();
    
    // 设置参数
    this.volumeIndicator.setParams(settings.periods, settings.colors, settings.enabledList);
    
    // 重新计算成交量均线
    if (this.candles && this.candles.length > 0) {
        this.volumeIndicator.calculateVolume(this.candles);
    }
    
    // 隐藏对话框
    this.hideVolumeSettingsDialog();
    
    // 重绘
    this.requestRender();
};

// 初始化BOLL参数设置对话框
KlineChart.prototype.initBOLLSettingsDialog = function() {
    var self = this;
    
    // 获取对话框元素
    this.contextMenuBollSettings = document.getElementById('context-menu-boll-settings');
    this.bollSettingsOverlay = document.getElementById('boll-settings-overlay');
    this.bollPeriodInput = document.getElementById('boll-period');
    this.bollStdDevInput = document.getElementById('boll-std-dev');
    this.bollColorUpperInput = document.getElementById('boll-color-upper');
    this.bollColorMidInput = document.getElementById('boll-color-mid');
    this.bollColorLowerInput = document.getElementById('boll-color-lower');
    this.bollSettingsBtnCancel = document.getElementById('boll-settings-btn-cancel');
    this.bollSettingsBtnDefault = document.getElementById('boll-settings-btn-default');
    this.bollSettingsBtnConfirm = document.getElementById('boll-settings-btn-confirm');
    
    // 绑定右键菜单项事件
    if (this.contextMenuBollSettings) {
        this.contextMenuBollSettings.onclick = function() {
            self.hideContextMenu();
            self.showBOLLSettingsDialog();
        };
    }
    
    // 绑定取消按钮事件
    if (this.bollSettingsBtnCancel) {
        this.bollSettingsBtnCancel.onclick = function() {
            self.hideBOLLSettingsDialog();
        };
    }
    
    // 绑定默认按钮事件
    if (this.bollSettingsBtnDefault) {
        this.bollSettingsBtnDefault.onclick = function() {
            self.resetBOLLSettingsToDefault();
        };
    }
    
    // 绑定确认按钮事件
    if (this.bollSettingsBtnConfirm) {
        this.bollSettingsBtnConfirm.onclick = function() {
            self.applyBOLLSettings();
        };
    }
    
    // 绑定输入框的实时更新事件
    var updateBOLLSettingsRealtime = function() {
        self.updateBOLLSettingsRealtime();
    };
    
    if (this.bollPeriodInput) {
        this.bollPeriodInput.addEventListener('input', updateBOLLSettingsRealtime);
    }
    if (this.bollStdDevInput) {
        this.bollStdDevInput.addEventListener('input', updateBOLLSettingsRealtime);
    }
    if (this.bollColorUpperInput) {
        this.bollColorUpperInput.addEventListener('input', updateBOLLSettingsRealtime);
    }
    if (this.bollColorMidInput) {
        this.bollColorMidInput.addEventListener('input', updateBOLLSettingsRealtime);
    }
    if (this.bollColorLowerInput) {
        this.bollColorLowerInput.addEventListener('input', updateBOLLSettingsRealtime);
    }
    
    // 点击遮罩层关闭对话框
    if (this.bollSettingsOverlay) {
        this.bollSettingsOverlay.addEventListener('click', function(e) {
            if (e.target === self.bollSettingsOverlay) {
                self.hideBOLLSettingsDialog();
            }
        });
    }
};

// 显示BOLL设置对话框
KlineChart.prototype.showBOLLSettingsDialog = function() {
    console.log('Showing BOLL settings dialog, current params:', 
        this.bollIndicator.period, this.bollIndicator.stdDevTimes, this.bollIndicator.colors);
    
    if (this.bollPeriodInput) {
        this.bollPeriodInput.value = this.bollIndicator.period;
    }
    if (this.bollStdDevInput) {
        this.bollStdDevInput.value = this.bollIndicator.stdDevTimes;
    }
    if (this.bollColorUpperInput) {
        this.bollColorUpperInput.value = this.bollIndicator.colors.upper;
    }
    if (this.bollColorMidInput) {
        this.bollColorMidInput.value = this.bollIndicator.colors.mid;
    }
    if (this.bollColorLowerInput) {
        this.bollColorLowerInput.value = this.bollIndicator.colors.lower;
    }
    
    if (this.bollSettingsOverlay) {
        this.bollSettingsOverlay.style.display = 'flex';
    }
};

// 隐藏BOLL设置对话框
KlineChart.prototype.hideBOLLSettingsDialog = function() {
    if (this.bollSettingsOverlay) {
        this.bollSettingsOverlay.style.display = 'none';
    }
};

// 重置BOLL为默认值
KlineChart.prototype.resetBOLLSettingsToDefault = function() {
    this.bollIndicator.resetToDefault();
    
    if (this.bollPeriodInput) {
        this.bollPeriodInput.value = 20;
    }
    if (this.bollStdDevInput) {
        this.bollStdDevInput.value = 2;
    }
    if (this.bollColorUpperInput) {
        this.bollColorUpperInput.value = '#fbbf24';
    }
    if (this.bollColorMidInput) {
        this.bollColorMidInput.value = '#ffffff';
    }
    if (this.bollColorLowerInput) {
        this.bollColorLowerInput.value = '#22c55e';
    }
    
    // 实时更新显示
    this.updateBOLLSettingsRealtime();
};

// 实时更新BOLL参数
KlineChart.prototype.updateBOLLSettingsRealtime = function() {
    var period = this.bollPeriodInput ? parseInt(this.bollPeriodInput.value) || 20 : 20;
    var stdDevTimes = this.bollStdDevInput ? parseFloat(this.bollStdDevInput.value) || 2 : 2;
    var colors = {
        upper: this.bollColorUpperInput ? this.bollColorUpperInput.value : '#fbbf24',
        mid: this.bollColorMidInput ? this.bollColorMidInput.value : '#ffffff',
        lower: this.bollColorLowerInput ? this.bollColorLowerInput.value : '#22c55e'
    };
    
    // 设置参数
    this.bollIndicator.setParams(period, stdDevTimes, colors);
    
    // 重新计算BOLL
    if (this.candles && this.candles.length > 0) {
        this.bollIndicator.calculateBOLL(this.candles);
    }
    
    // 重绘
    this.requestRender();
};

// 应用BOLL设置
KlineChart.prototype.applyBOLLSettings = function() {
    var period = this.bollPeriodInput ? parseInt(this.bollPeriodInput.value) || 20 : 20;
    var stdDevTimes = this.bollStdDevInput ? parseFloat(this.bollStdDevInput.value) || 2 : 2;
    var colors = {
        upper: this.bollColorUpperInput ? this.bollColorUpperInput.value : '#fbbf24',
        mid: this.bollColorMidInput ? this.bollColorMidInput.value : '#ffffff',
        lower: this.bollColorLowerInput ? this.bollColorLowerInput.value : '#22c55e'
    };
    
    // 设置参数
    this.bollIndicator.setParams(period, stdDevTimes, colors);
    
    // 重新计算BOLL
    if (this.candles && this.candles.length > 0) {
        this.bollIndicator.calculateBOLL(this.candles);
    }
    
    // 隐藏对话框
    this.hideBOLLSettingsDialog();
    
    // 重绘
    this.requestRender();
};

// 全局K线图表实例
var klineChartInstance = null;

// 初始化K线图表（供模态对话框调用）
function initKlineChart() {
    if (!klineChartInstance) {
        klineChartInstance = new KlineChart();

        // 初始化回测叠加层
        if (typeof BacktestOverlay !== 'undefined' && BacktestOverlay.init) {
            BacktestOverlay.init(klineChartInstance);
        }
        // 初始化涨停箱体叠加层
        if (typeof LimitUpBoxOverlay !== 'undefined' && LimitUpBoxOverlay.init) {
            LimitUpBoxOverlay.init(klineChartInstance);
        }

        // 检查自选股列表，加载第一个股票或上证指数
        var stockList = JSON.parse(localStorage.getItem('stockList')) || [];
        if (stockList.length > 0) {
            // 有自选股，加载第一个股票
            var firstStock = stockList[0];
            klineChartInstance.loadKlineData(firstStock.code, 'daily');
        } else {
            // 没有自选股，加载上证指数
            klineChartInstance.loadKlineData('sh000001', 'daily');
        }
    }
}

// 清理K线图表资源（供模态对话框调用）
function cleanupKlineChart() {
    if (klineChartInstance) {
        // 移除事件监听器
        klineChartInstance.canvas.removeEventListener('mousedown', klineChartInstance.handleMouseDown);
        klineChartInstance.canvas.removeEventListener('mousemove', klineChartInstance.handleMouseMove);
        klineChartInstance.canvas.removeEventListener('mouseup', klineChartInstance.handleMouseUp);
        klineChartInstance.canvas.removeEventListener('wheel', klineChartInstance.handleWheel);
        klineChartInstance.canvas.removeEventListener('touchstart', klineChartInstance.handleTouchStart);
        klineChartInstance.canvas.removeEventListener('touchmove', klineChartInstance.handleTouchMove);
        klineChartInstance.canvas.removeEventListener('touchend', klineChartInstance.handleTouchEnd);
        
        klineChartInstance = null;
    }
}

// 判断是否在交易时间
function isTradingTime() {
    var now = new Date();
    var day = now.getDay();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    
    // 周末不交易
    if (day === 0 || day === 6) {
        return false;
    }
    
    // 上午交易时间：9:30-11:30
    if ((hours === 9 && minutes >= 30) || (hours === 10) || (hours === 11 && minutes < 30)) {
        return true;
    }
    
    // 下午交易时间：13:00-15:00
    if ((hours === 13) || (hours === 14) || (hours === 15 && minutes === 0)) {
        return true;
    }
    
    return false;
}

// 启动自动刷新
function startAutoRefresh() {
    if (!klineChartInstance) {
        return;
    }
    
    // 清除之前的定时器
    if (klineChartInstance.autoRefreshTimer) {
        clearInterval(klineChartInstance.autoRefreshTimer);
        klineChartInstance.autoRefreshTimer = null;
    }
    
    // 只有小周期（5min、15min、30min、60min）才自动刷新
    var smallPeriods = ['5min', '15min', '30min', '60min'];
    var isSmallPeriod = false;
    for (var i = 0; i < smallPeriods.length; i++) {
        if (smallPeriods[i] === klineChartInstance.currentPeriod) {
            isSmallPeriod = true;
            break;
        }
    }
    if (!isSmallPeriod) {
        console.log('当前周期不是小周期，不启动自动刷新');
        return;
    }
    
    console.log('启动自动刷新，周期：' + klineChartInstance.currentPeriod);
    
    // 启动定时器，每5分钟刷新一次
    klineChartInstance.autoRefreshTimer = setInterval(function() {
        if (isTradingTime()) {
            console.log('自动刷新K线数据...');
            
            // 使用请求防抖避免频繁请求
            klineChartInstance.api.requestDebounce().then(function() {
                // 获取实时数据并合并到现有K线中
                klineChartInstance.api.getTencentRealtimeData(klineChartInstance.currentStockCode).then(function(realtimeData) {
                    klineChartInstance.mergeRealtimeData(realtimeData);
                    // 重新绘制K线
                    klineChartInstance.drawCandles();
                    // 重新渲染所有画线
                    klineChartInstance.drawSavedLines();
                    // 重新渲染所有工具的已保存数据和未完成取点
                    if (klineChartInstance.twoPointBuy.allData && klineChartInstance.twoPointBuy.allData.length > 0) {
                        klineChartInstance.twoPointBuy.renderAll(klineChartInstance.ctx);
                    }
                    if (klineChartInstance.twoPointBuy.isComplete()) {
                        klineChartInstance.twoPointBuy.render(klineChartInstance.ctx);
                    }
                    if (klineChartInstance.twoPointSell.allData && klineChartInstance.twoPointSell.allData.length > 0) {
                        klineChartInstance.twoPointSell.renderAll(klineChartInstance.ctx);
                    }
                    if (klineChartInstance.twoPointSell.isComplete()) {
                        klineChartInstance.twoPointSell.render(klineChartInstance.ctx);
                    }
                    if (klineChartInstance.threePointBuy.allData && klineChartInstance.threePointBuy.allData.length > 0) {
                        klineChartInstance.threePointBuy.renderAll(klineChartInstance.ctx);
                    }
                    if (klineChartInstance.threePointBuy.isComplete()) {
                        klineChartInstance.threePointBuy.render(klineChartInstance.ctx);
                    }
                    if (klineChartInstance.threePointSell.allData && klineChartInstance.threePointSell.allData.length > 0) {
                        klineChartInstance.threePointSell.renderAll(klineChartInstance.ctx);
                    }
                    if (klineChartInstance.threePointSell.isComplete()) {
                        klineChartInstance.threePointSell.render(klineChartInstance.ctx);
                    }
                    // 只有在量能开启时才渲染统计结果
                    if (klineChartInstance.macdIndicator && klineChartInstance.macdIndicator.enabled) {
                        if (klineChartInstance.volumeStatistics.allData && klineChartInstance.volumeStatistics.allData.length > 0) {
                            klineChartInstance.volumeStatistics.renderAll(klineChartInstance.ctx);
                        }
                        if (klineChartInstance.volumeStatistics.isComplete()) {
                            klineChartInstance.volumeStatistics.render(klineChartInstance.ctx);
                        }
                    }
                });
            });
        }
    }, 300000); // 每5分钟刷新一次
}

// 停止自动刷新
function stopAutoRefresh() {
    if (klineChartInstance && klineChartInstance.autoRefreshTimer) {
        clearInterval(klineChartInstance.autoRefreshTimer);
        klineChartInstance.autoRefreshTimer = null;
        console.log('停止自动刷新');
    }
}

// 切换画线工具窗口显示/隐藏
KlineChart.prototype.toggleDrawToolsWindow = function() {
    var self = this;
    
    if (!this.drawToolsWindow) {
        this.drawToolsWindow = document.getElementById('draw-tools-window');
        this.drawToolsHeader = this.drawToolsWindow.querySelector('.draw-tools-header');
        this.initDrawToolsEvents();
    }
    
    if (this.drawToolsWindow.style.display === 'none' || !this.drawToolsWindow.style.display) {
        this.showDrawToolsWindow();
    } else {
        this.hideDrawToolsWindow();
    }
};

// 显示画线工具窗口
KlineChart.prototype.showDrawToolsWindow = function() {
    if (!this.drawToolsWindow) {
        return;
    }
    
    this.drawToolsWindow.style.display = 'block';
    
    // 重置所有工具按钮的颜色为默认状态
    var toolBtns = this.drawToolsWindow.querySelectorAll('.draw-tool-btn');
    for (var i = 0; i < toolBtns.length; i++) {
        toolBtns[i].classList.remove('active');
        toolBtns[i].style.backgroundColor = 'rgba(55, 65, 81, 0.8)';
    }
    
    // 如果当前工具是画线工具，设置对应的active状态
    var activeTools = ['rectangle', 'line', 'ray', 'horizontal', 'vertical', 'price', 'parallel', 'circle', 'text', 'arrow', 'golden', 'gann', 'measure'];
    for (var t = 0; t < activeTools.length; t++) {
        var toolName = activeTools[t];
        if (this.tool === toolName) {
            var btn = this.drawToolsWindow.querySelector('#btn-' + toolName);
            if (btn) {
                btn.classList.add('active');
                btn.style.backgroundColor = '#4a90e2';
            }
        }
    }
    
    // 尝试从本地存储加载上次的位置
    var savedPosition = this.loadDrawToolsPosition();
    if (savedPosition) {
        this.drawToolsWindow.style.left = savedPosition.left + 'px';
        this.drawToolsWindow.style.top = savedPosition.top + 'px';
    } else {
        // 如果没有保存的位置，设置默认位置（在画布右边）
        var rect = this.canvas.getBoundingClientRect();
        var windowRect = this.drawToolsWindow.getBoundingClientRect();
        var defaultLeft = rect.right - windowRect.width - 20;
        var defaultTop = rect.top + 100;
        this.drawToolsWindow.style.left = defaultLeft + 'px';
        this.drawToolsWindow.style.top = defaultTop + 'px';
    }
    
    // 确保窗口在可视区域内
    this.ensureWindowInBounds();
};

// 确保窗口在可视区域内
KlineChart.prototype.ensureWindowInBounds = function() {
    if (!this.drawToolsWindow) {
        return;
    }
    
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var rect = this.drawToolsWindow.getBoundingClientRect();
    
    var left = parseInt(this.drawToolsWindow.style.left, 10) || 0;
    var top = parseInt(this.drawToolsWindow.style.top, 10) || 0;
    
    // 限制左边界
    if (left < 0) {
        left = 0;
    }
    
    // 限制右边界
    if (left + rect.width > windowWidth) {
        left = windowWidth - rect.width;
    }
    
    // 限制上边界
    if (top < 0) {
        top = 0;
    }
    
    // 限制下边界
    if (top + rect.height > windowHeight) {
        top = windowHeight - rect.height;
    }
    
    this.drawToolsWindow.style.left = left + 'px';
    this.drawToolsWindow.style.top = top + 'px';
};

// 保存窗口位置到本地存储
KlineChart.prototype.saveDrawToolsPosition = function() {
    if (!this.drawToolsWindow) {
        return;
    }
    
    var position = {
        left: parseInt(this.drawToolsWindow.style.left, 10) || 0,
        top: parseInt(this.drawToolsWindow.style.top, 10) || 0
    };
    
    try {
        localStorage.setItem(this.drawToolsPositionStorageKey, JSON.stringify(position));
    } catch (e) {
        console.error('保存画线窗口位置失败:', e);
    }
};

// 从本地存储加载窗口位置
KlineChart.prototype.loadDrawToolsPosition = function() {
    try {
        var saved = localStorage.getItem(this.drawToolsPositionStorageKey);
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {
        console.error('加载画线窗口位置失败:', e);
    }
    return null;
};

// 隐藏画线工具窗口
KlineChart.prototype.hideDrawToolsWindow = function() {
    if (!this.drawToolsWindow) {
        return;
    }
    
    this.saveDrawToolsPosition();
    this.drawToolsWindow.style.display = 'none';
};

// 初始化画线工具窗口事件
KlineChart.prototype.initDrawToolsEvents = function() {
    var self = this;
    
    // 关闭按钮
    var closeBtn = document.getElementById('draw-tools-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            self.hideDrawToolsWindow();
        });
    }
    
    // 工具按钮点击
    var toolBtns = this.drawToolsWindow.querySelectorAll('.draw-tool-btn');
    for (var i = 0; i < toolBtns.length; i++) {
        var btn = toolBtns[i];
        var tool = btn.getAttribute('data-tool');
        
        btn.addEventListener('click', function() {
            var clickedTool = this.getAttribute('data-tool');
            var clickedBtn = this;
            
            // 重置所有按钮的激活状态
            for (var j = 0; j < toolBtns.length; j++) {
                toolBtns[j].classList.remove('active');
                toolBtns[j].style.backgroundColor = 'rgba(55, 65, 81, 0.8)';
            }
            
            // 根据工具类型设置对应功能
            if (clickedTool === 'rectangle') {
                self.setTool('rectangle');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'line') {
                self.setTool('line');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'ray') {
                self.setTool('ray');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'horizontal') {
                self.setTool('horizontal');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'vertical') {
                self.setTool('vertical');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'price') {
                self.setTool('price');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'parallel') {
                self.setTool('parallel');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'circle') {
                self.setTool('circle');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'text') {
                self.setTool('text');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'arrow') {
                self.setTool('arrow');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'golden') {
                self.setTool('golden');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'gann') {
                self.setTool('gann');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            if (clickedTool === 'measure') {
                self.setTool('measure');
                clickedBtn.classList.add('active');
                clickedBtn.style.backgroundColor = '#4a90e2';
                return;
            }
            
            // 其他工具（暂未实现）
            clickedBtn.classList.add('active');
            clickedBtn.style.backgroundColor = '#4a90e2';
            console.log('选择画线工具:', clickedTool);
        });
    }
    
    // 窗口拖拽 - 鼠标按下
    this.drawToolsHeader.addEventListener('mousedown', function(e) {
        self.isDrawToolsDragging = true;
        self.drawToolsDragStartX = e.clientX - self.drawToolsWindow.offsetLeft;
        self.drawToolsDragStartY = e.clientY - self.drawToolsWindow.offsetTop;
        e.preventDefault();
    });
    
    // 窗口拖拽 - 鼠标移动
    window.addEventListener('mousemove', function(e) {
        if (self.isDrawToolsDragging) {
            var newLeft = e.clientX - self.drawToolsDragStartX;
            var newTop = e.clientY - self.drawToolsDragStartY;
            
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;
            var rect = self.drawToolsWindow.getBoundingClientRect();
            
            // 限制左边界
            if (newLeft < 0) {
                newLeft = 0;
            }
            
            // 限制右边界
            if (newLeft + rect.width > windowWidth) {
                newLeft = windowWidth - rect.width;
            }
            
            // 限制上边界
            if (newTop < 0) {
                newTop = 0;
            }
            
            // 限制下边界
            if (newTop + rect.height > windowHeight) {
                newTop = windowHeight - rect.height;
            }
            
            self.drawToolsWindow.style.left = newLeft + 'px';
            self.drawToolsWindow.style.top = newTop + 'px';
        }
    });
    
    // 窗口拖拽 - 鼠标抬起
    window.addEventListener('mouseup', function() {
        if (self.isDrawToolsDragging) {
            self.isDrawToolsDragging = false;
            self.saveDrawToolsPosition();
        }
    });
};

// 如果不在模态对话框中，则自动初始化
if (!document.getElementById('kline-modal')) {
    window.addEventListener('load', function() {
        initKlineChart();
        
        // 延迟启动自动刷新
        setTimeout(function() {
            startAutoRefresh();
        }, 2000);
    });
}