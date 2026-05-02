// 自选股功能
var stockListToggle = document.getElementById('stock-list-toggle');
var stockListContainer = document.getElementById('stock-list-container');
var stockListContent = document.getElementById('stock-list-content');

// 拖拽相关变量
var draggedItem = null;
var insertLine = null;

// 创建插入线
function createInsertLine() {
    var line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.left = '0';
    line.style.right = '0';
    line.style.height = '3px';
    line.style.backgroundColor = '#4a90e2';
    line.style.zIndex = '1000';
    line.style.display = 'none';
    line.style.pointerEvents = 'none';
    return line;
}

// 初始化插入线
function initInsertLine() {
    if (!insertLine) {
        insertLine = createInsertLine();
        stockListContent.style.position = 'relative';
        stockListContent.appendChild(insertLine);
    }
}

// 切换自选股列表显示/隐藏
function toggleStockList() {
    if (stockListContainer.style.display === 'none' || stockListContainer.style.display === '') {
        stockListContainer.style.display = 'block';
        stockListToggle.innerHTML = '<span style="color: white; font-size: 16px; font-weight: bold;">◀</span>';
    } else {
        stockListContainer.style.display = 'none';
        stockListToggle.innerHTML = '<span style="color: white; font-size: 16px; font-weight: bold;">▶</span>';
    }
    // 重新渲染K线图，更新MA标签位置
    if (typeof klineChartInstance !== 'undefined' && klineChartInstance) {
        klineChartInstance.requestRender();
    }
}

// 加载自选股列表
function loadStockList() {
    // 初始化插入线
    initInsertLine();
    
    // 从localStorage加载自选股
    var stockList = JSON.parse(localStorage.getItem('stockList')) || [];
    
    // 清空列表
    stockListContent.innerHTML = '';
    
    // 重新添加插入线（因为清空了innerHTML）
    stockListContent.style.position = 'relative';
    stockListContent.appendChild(insertLine);
    
    // 获取当前股票代码
    var currentStockCode = typeof klineChartInstance !== 'undefined' && klineChartInstance ? klineChartInstance.currentStockCode : '';
    
    // 添加自选股
    for (var i = 0; i < stockList.length; i++) {
        var stock = stockList[i];
        var stockItem = document.createElement('div');
        stockItem.style.padding = '8px';
        stockItem.style.marginBottom = '4px';
        stockItem.style.borderRadius = '4px';
        stockItem.style.cursor = 'pointer';
        stockItem.style.color = 'white';
        stockItem.style.fontSize = '14px';
        stockItem.style.display = 'flex';
        stockItem.style.justifyContent = 'space-between';
        stockItem.style.alignItems = 'center';
        stockItem.draggable = true;
        stockItem.dataset.index = i;
        stockItem.style.position = 'relative';
        
        // 检查是否是当前股票
        var isCurrentStock = stock.code === currentStockCode;
        if (isCurrentStock) {
            stockItem.style.backgroundColor = '#4a90e2';
            stockItem.style.border = '2px solid #60a5fa';
        } else {
            stockItem.style.backgroundColor = '#374151';
            stockItem.style.border = '1px solid transparent';
        }
        
        stockItem.innerHTML = '<button style="padding: 2px 6px; background-color: #dc2626; color: white; border-radius: 4px; cursor: pointer; font-size: 12px; border: none;">删</button> <span style="font-weight: bold;">' + stock.code + '</span> - ' + stock.name;
        
        // 拖拽开始
        stockItem.addEventListener('dragstart', function(e) {
            var index = this.dataset.index;
            e.dataTransfer.setData('text/plain', index);
            e.dataTransfer.effectAllowed = 'move';
            this.style.opacity = '0.5';
            draggedItem = this;
        });
        
        // 拖拽结束
        stockItem.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
            draggedItem = null;
            // 隐藏插入线
            if (insertLine) {
                insertLine.style.display = 'none';
            }
        });
        
        // 拖拽进入
        stockItem.addEventListener('dragenter', function(e) {
            e.preventDefault();
            if (draggedItem && draggedItem !== this) {
                // 显示插入线
                var rect = this.getBoundingClientRect();
                var containerRect = stockListContent.getBoundingClientRect();
                var middleY = rect.top + rect.height / 2;
                var mouseY = e.clientY;
                
                // 判断插入线位置
                var insertTop = rect.top - containerRect.top;
                var insertBottom = rect.bottom - containerRect.top;
                
                if (mouseY < middleY) {
                    // 插入到上方
                    insertLine.style.top = (insertTop - 2) + 'px';
                } else {
                    // 插入到下方
                    insertLine.style.top = (insertBottom - 2) + 'px';
                }
                
                insertLine.style.display = 'block';
            }
        });
        
        // 拖拽经过
        stockItem.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (draggedItem && draggedItem !== this) {
                // 更新插入线位置
                var rect = this.getBoundingClientRect();
                var containerRect = stockListContent.getBoundingClientRect();
                var middleY = rect.top + rect.height / 2;
                var mouseY = e.clientY;
                
                var insertTop = rect.top - containerRect.top;
                var insertBottom = rect.bottom - containerRect.top;
                
                if (mouseY < middleY) {
                    insertLine.style.top = (insertTop - 2) + 'px';
                } else {
                    insertLine.style.top = (insertBottom - 2) + 'px';
                }
            }
        });
        
        // 拖拽离开
        stockItem.addEventListener('dragleave', function(e) {
            // 检查鼠标是否真的离开了容器
            var relatedTarget = e.relatedTarget;
            if (!stockListContent.contains(relatedTarget) && relatedTarget !== insertLine) {
                insertLine.style.display = 'none';
            }
        });
        
        // 放置
        stockItem.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            var toIndex = parseInt(this.dataset.index);
            
            // 计算实际插入位置
            var rect = this.getBoundingClientRect();
            var middleY = rect.top + rect.height / 2;
            var mouseY = e.clientY;
            var actualToIndex = toIndex;
            
            if (mouseY >= middleY && fromIndex < toIndex) {
                actualToIndex = toIndex;
            } else if (mouseY >= middleY && fromIndex > toIndex) {
                actualToIndex = toIndex + 1;
            } else if (mouseY < middleY && fromIndex < toIndex) {
                actualToIndex = toIndex - 1;
            } else {
                actualToIndex = toIndex;
            }
            
            if (fromIndex !== actualToIndex && actualToIndex >= 0) {
                // 从localStorage加载最新数据
                var stockList = JSON.parse(localStorage.getItem('stockList')) || [];
                
                // 移动位置
                var item = stockList.splice(fromIndex, 1)[0];
                
                // 确保索引不越界
                if (actualToIndex > stockList.length) {
                    actualToIndex = stockList.length;
                }
                if (actualToIndex < 0) {
                    actualToIndex = 0;
                }
                
                stockList.splice(actualToIndex, 0, item);
                
                // 保存到localStorage
                localStorage.setItem('stockList', JSON.stringify(stockList));
                
                // 重新加载列表
                loadStockList();
            }
            
            // 隐藏插入线
            if (insertLine) {
                insertLine.style.display = 'none';
            }
        });
        
        // 点击切换股票
        stockItem.addEventListener('click', function(e) {
            // 点击删除按钮时不切换股票
            if (e.target.tagName === 'BUTTON') {
                return;
            }
            
            // 加载该股票的K线数据
            if (typeof klineChartInstance !== 'undefined' && klineChartInstance) {
                var stockCode = this.querySelector('span').textContent;
                klineChartInstance.loadKlineData(stockCode, klineChartInstance.currentPeriod);
            }
            // 不隐藏自选股列表，保持显示
        });
        
        // 点击删除按钮
        var deleteBtn = stockItem.querySelector('button');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var index = parseInt(this.parentElement.dataset.index);
            // 从localStorage中删除该股票
            var stockList = JSON.parse(localStorage.getItem('stockList')) || [];
            stockList.splice(index, 1);
            localStorage.setItem('stockList', JSON.stringify(stockList));
            // 重新加载自选股列表
            loadStockList();
        });
        
        stockListContent.appendChild(stockItem);
    }
    
    // 如果没有自选股，显示提示
    if (stockList.length === 0) {
        stockListContent.innerHTML = '<div style="color: #9ca3af; text-align: center; padding: 20px; font-size: 14px;">暂无自选股</div>';
    }
}

// 保存自选股
function saveStock(code, name) {
    // 从localStorage加载自选股
    var stockList = JSON.parse(localStorage.getItem('stockList')) || [];
    
    // 检查是否已存在
    var exists = false;
    for (var i = 0; i < stockList.length; i++) {
        if (stockList[i].code === code) {
            exists = true;
            break;
        }
    }
    
    if (!exists) {
        stockList.push({ code: code, name: name });
        localStorage.setItem('stockList', JSON.stringify(stockList));
        loadStockList();
    }
}

// 绑定自选股事件
function bindStockListEvents() {
    // 绑定切换按钮事件
    if (stockListToggle) {
        stockListToggle.addEventListener('click', toggleStockList);
    } else {
        console.error('找不到自选股切换按钮');
    }
    
    // 绑定容器的拖拽事件
    if (stockListContent) {
        stockListContent.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        stockListContent.addEventListener('drop', function(e) {
            e.preventDefault();
        });
        
        stockListContent.addEventListener('dragleave', function(e) {
            if (insertLine && !stockListContent.contains(e.relatedTarget)) {
                insertLine.style.display = 'none';
            }
        });
    }
}

// 初始化自选股功能
function initStockList() {
    bindStockListEvents();
    loadStockList();
}

// 导出函数（供其他文件使用）
if (typeof window !== 'undefined') {
    window.initStockList = initStockList;
    window.loadStockList = loadStockList;
    window.saveStock = saveStock;
    window.toggleStockList = toggleStockList;
}
