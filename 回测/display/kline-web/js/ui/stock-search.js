// 股票搜索功能
var stockCodeInput = document.getElementById('stock-code-input');
var searchStockBtn = document.getElementById('btn-search-stock');
var searchResults = document.getElementById('search-results');
var clearInputBtn = document.getElementById('btn-clear-input');

// 自动识别股票代码格式
function formatStockCode(code) {
    // 已经包含sh或sz前缀的直接返回
    if (code.indexOf('sh') === 0 || code.indexOf('sz') === 0) {
        return code;
    }
    // 6位数字的股票代码
    if (/^\d{6}$/.test(code)) {
        // 沪市股票：600开头、601开头、603开头、605开头、688开头（科创板）、000开头（指数）
        if (code.indexOf('600') === 0 || code.indexOf('601') === 0 || code.indexOf('603') === 0 || code.indexOf('605') === 0 || code.indexOf('688') === 0) {
            return 'sh' + code;
        }
        // 深市股票：000开头（深市主板）、001开头（深市主板）、002开头（中小板）、003开头（深市主板）、300开头（创业板）
        if (code.indexOf('000') === 0 || code.indexOf('001') === 0 || code.indexOf('002') === 0 || code.indexOf('003') === 0 || code.indexOf('300') === 0) {
            return 'sz' + code;
        }
        // 默认沪市
        return 'sh' + code;
    }
    // 其他格式直接返回
    return code;
}

// 搜索股票
function searchStock() {
    var code = stockCodeInput.value.trim();
    if (!code) {
        alert('请输入股票代码');
        return;
    }
    
    var formattedCode = formatStockCode(code);
    console.log('搜索股票：', formattedCode);
    
    // 加载K线数据
    if (typeof klineChartInstance !== 'undefined' && klineChartInstance) {
        klineChartInstance.loadKlineData(formattedCode, klineChartInstance.currentPeriod);
    } else {
        console.error('K线图表实例不存在');
    }
    
    // 隐藏搜索结果
    searchResults.style.display = 'none';
}

// 动态搜索股票（根据输入内容实时搜索）
function searchStocksDynamic() {
    var input = stockCodeInput.value.trim();
    
    // 如果输入为空，隐藏搜索结果
    if (!input) {
        searchResults.style.display = 'none';
        return;
    }
    
    // 在股票名称字典中搜索匹配的股票
    var matches = [];
    var maxResults = 10; // 最多显示10个结果
    
    for (var code in stockNameDictionary) {
        var name = stockNameDictionary[code];
        // 检查代码或名称是否匹配
        if (code.toLowerCase().indexOf(input.toLowerCase()) !== -1 || name.indexOf(input) !== -1) {
            matches.push({ code: code, name: name });
            if (matches.length >= maxResults) {
                break;
            }
        }
    }
    
    // 显示搜索结果
    if (matches.length > 0) {
        searchResults.innerHTML = '';
        for (var i = 0; i < matches.length; i++) {
            var stock = matches[i];
            var resultItem = document.createElement('div');
            resultItem.style.padding = '8px';
            resultItem.style.cursor = 'pointer';
            resultItem.style.color = 'white';
            resultItem.style.fontSize = '14px';
            resultItem.style.borderBottom = '1px solid #374151';
            resultItem.style.display = 'flex';
            resultItem.style.justifyContent = 'space-between';
            resultItem.style.alignItems = 'center';
            resultItem.innerHTML = '<span><span style="font-weight: bold; color: #60a5fa;">' + stock.code + '</span> - ' + stock.name + '</span><button data-code="' + stock.code + '" data-name="' + stock.name + '" style="padding: 2px 8px; background-color: #059669; color: white; border-radius: 4px; cursor: pointer; font-size: 12px; border: none;">加</button>';
            
            // 点击搜索结果
            resultItem.addEventListener('click', function(e) {
                // 如果点击的是加按钮，不切换股票
                if (e.target.tagName === 'BUTTON') {
                    return;
                }
                
                var stockCode = this.querySelector('span span').textContent;
                stockCodeInput.value = stockCode;
                searchResults.style.display = 'none';
                
                // 加载K线数据
                if (typeof klineChartInstance !== 'undefined' && klineChartInstance) {
                    klineChartInstance.loadKlineData(stockCode, klineChartInstance.currentPeriod);
                }
            });
            
            // 点击加按钮
            var addBtn = resultItem.querySelector('button');
            addBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                var code = this.getAttribute('data-code');
                var name = this.getAttribute('data-name');
                saveStock(code, name);
            });
            
            searchResults.appendChild(resultItem);
        }
        
        searchResults.style.display = 'block';
    } else {
        searchResults.style.display = 'none';
    }
}

// 绑定事件
function bindSearchEvents() {
    // 绑定搜索按钮点击事件
    if (searchStockBtn) {
        searchStockBtn.addEventListener('click', searchStock);
    } else {
        console.error('找不到搜索股票按钮');
    }
    
    // 绑定输入框输入事件（实时搜索）
    if (stockCodeInput) {
        stockCodeInput.addEventListener('input', searchStocksDynamic);
        
        // 绑定回车键事件
        stockCodeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchStock();
            }
        });
        
        // 监听输入框内容变化，显示/隐藏清除按钮
        stockCodeInput.addEventListener('input', function() {
            if (clearInputBtn) {
                clearInputBtn.style.display = this.value.length > 0 ? 'block' : 'none';
            }
        });
        
        // 监听输入框获得焦点事件，如果有内容则显示搜索结果
        stockCodeInput.addEventListener('focus', function() {
            if (searchResults && this.value.trim().length > 0) {
                searchStocksDynamic();
            }
        });
    } else {
        console.error('找不到股票代码输入框');
    }
    
    // 绑定清除按钮点击事件
    if (clearInputBtn) {
        clearInputBtn.addEventListener('click', function() {
            if (stockCodeInput) {
                stockCodeInput.value = '';
                stockCodeInput.focus();
                this.style.display = 'none';
                // 隐藏搜索结果
                var searchResults = document.getElementById('search-results');
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        });
    }
    
    // 监听页面点击事件，关闭搜索结果下拉列表
    document.addEventListener('click', function(e) {
        var searchResults = document.getElementById('search-results');
        var stockCodeInput = document.getElementById('stock-code-input');
        var searchBtn = document.getElementById('btn-search-stock');
        
        if (searchResults && searchResults.style.display === 'block') {
            // 检查点击目标是否在搜索相关元素内
            var clickedInsideSearch = e.target === searchResults || 
                                    searchResults.contains(e.target) ||
                                    e.target === stockCodeInput || 
                                    stockCodeInput.contains(e.target) ||
                                    e.target === searchBtn ||
                                    searchBtn.contains(e.target);
            
            if (!clickedInsideSearch) {
                searchResults.style.display = 'none';
            }
        }
    });
}

// 初始化股票搜索功能
function initStockSearch() {
    bindSearchEvents();
}

// 导出函数（供其他文件使用）
if (typeof window !== 'undefined') {
    window.initStockSearch = initStockSearch;
    window.searchStock = searchStock;
    window.searchStocksDynamic = searchStocksDynamic;
}