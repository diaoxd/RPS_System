// 画线数据管理模块
class DrawingDataManager {
    constructor() {
        this.drawings = new Map(); // 存储画线数据
        this.currentDrawing = null; // 当前正在绘制的线
    }

    // 保存画线数据
    saveDrawingData(stockCode, period, drawingData) {
        const key = `${stockCode}_${period}`;
        
        if (!this.drawings.has(key)) {
            this.drawings.set(key, []);
        }

        const drawings = this.drawings.get(key);
        drawings.push(drawingData);
        
        console.log(`保存画线数据：${key}，类型：${drawingData.type}`);
        return true;
    }

    // 获取画线数据
    getDrawingData(stockCode, period) {
        const key = `${stockCode}_${period}`;
        
        if (!this.drawings.has(key)) {
            return [];
        }

        return this.drawings.get(key);
    }

    // 清除画线数据
    clearDrawingData(stockCode, period) {
        const key = `${stockCode}_${period}`;
        this.drawings.delete(key);
        console.log(`清除画线数据：${key}`);
    }

    // 开始绘制
    startDrawing(type, startPoint) {
        this.currentDrawing = {
            color: this.getColorByType(type),
            width: 2.0,
            style: "-",
            type: type,
            start_x: startPoint.x,
            start_y: startPoint.y,
            end_x: startPoint.x,
            end_y: startPoint.y,
            levels: this.calculateLevels(type, startPoint.y, startPoint.y)
        };
    }

    // 更新绘制
    updateDrawing(endPoint) {
        if (!this.currentDrawing) return;

        this.currentDrawing.end_x = endPoint.x;
        this.currentDrawing.end_y = endPoint.y;
        this.currentDrawing.levels = this.calculateLevels(
            this.currentDrawing.type,
            this.currentDrawing.start_y,
            endPoint.y
        );
    }

    // 完成绘制
    finishDrawing(stockCode, period) {
        if (!this.currentDrawing) return false;

        const success = this.saveDrawingData(stockCode, period, this.currentDrawing);
        this.currentDrawing = null;
        return success;
    }

    // 根据类型获取颜色
    getColorByType(type) {
        const colorMap = {
            'two-buy': '#66bb6a',      // 绿色
            'two-sell': '#ef5350',     // 红色
            'three-buy': '#42a5f5',    // 蓝色
            'three-sell': '#ffa726'    // 橙色
        };
        return colorMap[type] || '#ffffff';
    }

    // 计算关键点位
    calculateLevels(type, startY, endY) {
        const levels = {};
        
        if (type === 'two-buy' || type === 'two-sell') {
            // 两点买入/卖出：计算C1点位
            const c1Price = (startY + endY) / 2;
            levels['C1'] = {
                price: c1Price,
                description: type === 'two-buy' ? '第一支撑位' : '第一压力位'
            };
        } else if (type === 'three-buy' || type === 'three-sell') {
            // 三点买入/卖出：计算C1、C2、C3点位
            const c1Price = startY + (endY - startY) * 0.382;
            const c2Price = startY + (endY - startY) * 0.618;
            const c3Price = startY + (endY - startY) * 0.786;
            
            const desc = type === 'three-buy' ? '支撑位' : '压力位';
            
            levels['C1'] = {price: c1Price, description: `第一${desc}`};
            levels['C2'] = {price: c2Price, description: `第二${desc}`};
            levels['C3'] = {price: c3Price, description: `第三${desc}`};
        }
        
        return levels;
    }

    // 获取当前绘制
    getCurrentDrawing() {
        return this.currentDrawing;
    }
}

// 导出模块
if (typeof module !== 'undefined') {
    module.exports = DrawingDataManager;
}