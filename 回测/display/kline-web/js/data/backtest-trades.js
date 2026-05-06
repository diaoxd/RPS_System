// 自动生成，请勿手动编辑
// 来源: 引擎回测_prot_adj_2025-01-02_2026-04-30.xlsx
// 策略: F1(MA60↑+MA20/30↑+MA5≥0)+F2(涨停20日)+F3(CROSS(C,MA5)+次日补买)+PROT_ADJ止盈+分层利润保护
// 交易: 1183 笔, 股票: 782 只
// 原因映射: 买入=['均线趋势+涨停基因+CROSS(C,MA5)', '均线趋势+涨停基因+CROSS(C,MA5)', '回调上穿MA5+涨停箱体支撑'], 卖出=['PROT_ADJ移动止盈', '-10%固定止损', 'PROT_ADJ移动止盈', '保10%利润', '保3%利润', 'PROT_ADJ止盈(>10%)', '四天急跌5%止盈']
var BACKTEST_TRADES = {
  "603777": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 16.96,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-03",
        "price": 15.26,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.02,
        "hold_days": 1
      },
      {
        "date": "2026-01-12",
        "price": 14.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-13",
        "price": 13.72,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.63,
        "hold_days": 1
      }
    ]
  },
  "000882": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 2.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-03",
        "price": 2.52,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 10.04,
        "hold_days": 1
      }
    ]
  },
  "601933": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 6.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-03",
        "price": 6.12,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.0,
        "hold_days": 1
      },
      {
        "date": "2025-12-16",
        "price": 5.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-18",
        "price": 5.49,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.26,
        "hold_days": 2
      }
    ]
  },
  "688365": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 12.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-03",
        "price": 11.42,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.78,
        "hold_days": 1
      }
    ]
  },
  "603068": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 30.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-06",
        "price": 26.78,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.97,
        "hold_days": 4
      },
      {
        "date": "2025-01-10",
        "price": 33.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-16",
        "price": 38.23,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.32,
        "hold_days": 6
      }
    ]
  },
  "002582": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 8.11,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-06",
        "price": 6.97,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -14.06,
        "hold_days": 4
      }
    ]
  },
  "002364": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 11.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-07",
        "price": 13.86,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 17.76,
        "hold_days": 5
      },
      {
        "date": "2025-03-10",
        "price": 17.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-13",
        "price": 17.4,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.52,
        "hold_days": 3
      },
      {
        "date": "2025-08-11",
        "price": 18.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-14",
        "price": 18.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.51,
        "hold_days": 3
      },
      {
        "date": "2025-08-25",
        "price": 23.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-26",
        "price": 25.8,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.02,
        "hold_days": 1
      },
      {
        "date": "2025-09-08",
        "price": 26.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-11",
        "price": 29.8,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.49,
        "hold_days": 3
      },
      {
        "date": "2025-09-19",
        "price": 30.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 30.31,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.88,
        "hold_days": 4
      },
      {
        "date": "2025-09-25",
        "price": 32.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-29",
        "price": 29.11,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.39,
        "hold_days": 4
      },
      {
        "date": "2026-02-09",
        "price": 31.43,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-12",
        "price": 34.97,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.26,
        "hold_days": 3
      },
      {
        "date": "2026-03-02",
        "price": 35.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 32.09,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.01,
        "hold_days": 1
      },
      {
        "date": "2026-03-06",
        "price": 35.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-13",
        "price": 32.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.85,
        "hold_days": 7
      },
      {
        "date": "2026-04-20",
        "price": 43.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-28",
        "price": 40.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.47,
        "hold_days": 8
      }
    ]
  },
  "002193": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 6.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-07",
        "price": 6.06,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": -2.73,
        "hold_days": 5
      }
    ]
  },
  "300938": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 18.32,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-09",
        "price": 19.98,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.06,
        "hold_days": 7
      }
    ]
  },
  "603518": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 9.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-09",
        "price": 9.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.41,
        "hold_days": 7
      }
    ]
  },
  "002418": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 2.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-10",
        "price": 3.4,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 26.87,
        "hold_days": 8
      },
      {
        "date": "2025-02-10",
        "price": 3.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-12",
        "price": 3.43,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 11.36,
        "hold_days": 2
      },
      {
        "date": "2025-02-21",
        "price": 3.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-07",
        "price": 3.76,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.45,
        "hold_days": 14
      },
      {
        "date": "2025-11-17",
        "price": 5.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-18",
        "price": 5.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.44,
        "hold_days": 1
      }
    ]
  },
  "600881": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 1.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-21",
        "price": 1.77,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.06,
        "hold_days": 19
      },
      {
        "date": "2025-06-09",
        "price": 1.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-11",
        "price": 1.89,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.07,
        "hold_days": 2
      },
      {
        "date": "2025-09-01",
        "price": 2.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-03",
        "price": 2.15,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.42,
        "hold_days": 2
      },
      {
        "date": "2025-09-05",
        "price": 2.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-18",
        "price": 2.23,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.36,
        "hold_days": 13
      }
    ]
  },
  "603216": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 10.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-13",
        "price": 11.21,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.19,
        "hold_days": 42
      }
    ]
  },
  "920190": {
    "daily": [
      {
        "date": "2025-01-03",
        "price": 29.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-06",
        "price": 24.99,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -14.8,
        "hold_days": 3
      },
      {
        "date": "2025-01-07",
        "price": 30.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-09",
        "price": 30.3,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.66,
        "hold_days": 2
      }
    ]
  },
  "605199": {
    "daily": [
      {
        "date": "2025-01-03",
        "price": 17.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-06",
        "price": 19.24,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.01,
        "hold_days": 3
      }
    ]
  },
  "605208": {
    "daily": [
      {
        "date": "2025-01-03",
        "price": 8.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-06",
        "price": 8.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.01,
        "hold_days": 3
      }
    ]
  },
  "300795": {
    "daily": [
      {
        "date": "2025-01-03",
        "price": 16.14,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-08",
        "price": 14.37,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.97,
        "hold_days": 5
      }
    ]
  },
  "688800": {
    "daily": [
      {
        "date": "2025-01-06",
        "price": 43.35,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-07",
        "price": 49.73,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.72,
        "hold_days": 1
      },
      {
        "date": "2025-01-16",
        "price": 51.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-21",
        "price": 56.12,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.65,
        "hold_days": 5
      }
    ]
  },
  "002317": {
    "daily": [
      {
        "date": "2025-01-06",
        "price": 12.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-10",
        "price": 11.42,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.4,
        "hold_days": 4
      },
      {
        "date": "2025-06-06",
        "price": 13.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-13",
        "price": 15.68,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 12.64,
        "hold_days": 7
      }
    ]
  },
  "300697": {
    "daily": [
      {
        "date": "2025-01-06",
        "price": 9.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-13",
        "price": 9.65,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.03,
        "hold_days": 7
      },
      {
        "date": "2025-03-24",
        "price": 13.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-25",
        "price": 15.58,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 18.03,
        "hold_days": 1
      }
    ]
  },
  "603629": {
    "daily": [
      {
        "date": "2025-01-06",
        "price": 21.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-13",
        "price": 20.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.67,
        "hold_days": 7
      }
    ]
  },
  "600255": {
    "daily": [
      {
        "date": "2025-01-07",
        "price": 3.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-09",
        "price": 3.82,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.0,
        "hold_days": 2
      }
    ]
  },
  "603825": {
    "daily": [
      {
        "date": "2025-01-07",
        "price": 14.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-10",
        "price": 13.16,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.32,
        "hold_days": 3
      },
      {
        "date": "2025-03-06",
        "price": 14.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 13.58,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.56,
        "hold_days": 15
      }
    ]
  },
  "002630": {
    "daily": [
      {
        "date": "2025-01-07",
        "price": 3.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-10",
        "price": 3.55,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.14,
        "hold_days": 3
      },
      {
        "date": "2025-01-17",
        "price": 3.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-22",
        "price": 3.79,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.71,
        "hold_days": 5
      },
      {
        "date": "2025-03-24",
        "price": 5.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-25",
        "price": 5.6,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.02,
        "hold_days": 1
      }
    ]
  },
  "600983": {
    "daily": [
      {
        "date": "2025-01-07",
        "price": 10.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-10",
        "price": 9.3,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -7.37,
        "hold_days": 3
      }
    ]
  },
  "001267": {
    "daily": [
      {
        "date": "2025-01-08",
        "price": 7.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-15",
        "price": 8.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.3,
        "hold_days": 7
      },
      {
        "date": "2025-07-30",
        "price": 13.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-31",
        "price": 14.39,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.02,
        "hold_days": 1
      },
      {
        "date": "2026-02-26",
        "price": 30.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-04",
        "price": 33.6,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.37,
        "hold_days": 6
      },
      {
        "date": "2026-04-02",
        "price": 39.74,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-08",
        "price": 44.3,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.47,
        "hold_days": 6
      }
    ]
  },
  "920821": {
    "daily": [
      {
        "date": "2025-01-09",
        "price": 27.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-10",
        "price": 24.44,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.05,
        "hold_days": 1
      }
    ]
  },
  "688018": {
    "daily": [
      {
        "date": "2025-01-09",
        "price": 157.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-10",
        "price": 155.79,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.2,
        "hold_days": 1
      }
    ]
  },
  "300145": {
    "daily": [
      {
        "date": "2025-01-09",
        "price": 3.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-21",
        "price": 3.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.41,
        "hold_days": 12
      },
      {
        "date": "2025-08-26",
        "price": 5.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 5.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.21,
        "hold_days": 1
      }
    ]
  },
  "000823": {
    "daily": [
      {
        "date": "2025-01-09",
        "price": 9.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-27",
        "price": 10.07,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.86,
        "hold_days": 18
      }
    ]
  },
  "002062": {
    "daily": [
      {
        "date": "2025-01-10",
        "price": 5.14,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-13",
        "price": 5.06,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.56,
        "hold_days": 3
      },
      {
        "date": "2025-01-16",
        "price": 5.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 5.25,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.35,
        "hold_days": 33
      }
    ]
  },
  "600967": {
    "daily": [
      {
        "date": "2025-01-10",
        "price": 8.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-15",
        "price": 9.12,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.92,
        "hold_days": 5
      },
      {
        "date": "2025-02-18",
        "price": 10.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-24",
        "price": 10.37,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.37,
        "hold_days": 6
      }
    ]
  },
  "688691": {
    "daily": [
      {
        "date": "2025-01-10",
        "price": 72.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-16",
        "price": 79.13,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 8.92,
        "hold_days": 6
      },
      {
        "date": "2025-10-24",
        "price": 145.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-29",
        "price": 131.18,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.14,
        "hold_days": 5
      }
    ]
  },
  "300809": {
    "daily": [
      {
        "date": "2025-01-10",
        "price": 30.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-16",
        "price": 31.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.56,
        "hold_days": 6
      }
    ]
  },
  "688603": {
    "daily": [
      {
        "date": "2025-01-10",
        "price": 54.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-24",
        "price": 49.13,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.0,
        "hold_days": 14
      }
    ]
  },
  "000737": {
    "daily": [
      {
        "date": "2025-01-13",
        "price": 9.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-15",
        "price": 9.29,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.96,
        "hold_days": 2
      },
      {
        "date": "2026-02-12",
        "price": 16.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-02",
        "price": 18.65,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.81,
        "hold_days": 18
      }
    ]
  },
  "002119": {
    "daily": [
      {
        "date": "2025-01-13",
        "price": 17.37,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-16",
        "price": 17.66,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.67,
        "hold_days": 3
      },
      {
        "date": "2026-01-27",
        "price": 24.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-28",
        "price": 27.23,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.02,
        "hold_days": 1
      }
    ]
  },
  "300249": {
    "daily": [
      {
        "date": "2025-01-13",
        "price": 13.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-17",
        "price": 13.57,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.18,
        "hold_days": 4
      }
    ]
  },
  "300472": {
    "daily": [
      {
        "date": "2025-01-15",
        "price": 8.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-22",
        "price": 7.52,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -15.51,
        "hold_days": 7
      },
      {
        "date": "2025-07-15",
        "price": 5.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-17",
        "price": 4.63,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.5,
        "hold_days": 2
      }
    ]
  },
  "601869": {
    "daily": [
      {
        "date": "2025-01-15",
        "price": 29.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-23",
        "price": 34.59,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 17.29,
        "hold_days": 8
      }
    ]
  },
  "300727": {
    "daily": [
      {
        "date": "2025-01-15",
        "price": 23.43,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-23",
        "price": 23.89,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.96,
        "hold_days": 8
      }
    ]
  },
  "002543": {
    "daily": [
      {
        "date": "2025-01-16",
        "price": 10.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-17",
        "price": 11.68,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.29,
        "hold_days": 1
      }
    ]
  },
  "000981": {
    "daily": [
      {
        "date": "2025-01-16",
        "price": 2.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-22",
        "price": 2.23,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.08,
        "hold_days": 6
      },
      {
        "date": "2025-02-26",
        "price": 2.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 2.22,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -7.5,
        "hold_days": 2
      },
      {
        "date": "2025-10-14",
        "price": 4.74,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-16",
        "price": 4.42,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.75,
        "hold_days": 2
      },
      {
        "date": "2026-02-02",
        "price": 4.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-05",
        "price": 4.82,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.05,
        "hold_days": 3
      }
    ]
  },
  "603920": {
    "daily": [
      {
        "date": "2025-01-17",
        "price": 32.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-23",
        "price": 32.63,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.43,
        "hold_days": 6
      },
      {
        "date": "2026-02-26",
        "price": 66.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 57.42,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.26,
        "hold_days": 5
      }
    ]
  },
  "603320": {
    "daily": [
      {
        "date": "2025-01-17",
        "price": 15.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-27",
        "price": 15.38,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.39,
        "hold_days": 10
      }
    ]
  },
  "688010": {
    "daily": [
      {
        "date": "2025-01-21",
        "price": 35.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-27",
        "price": 37.16,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.85,
        "hold_days": 6
      },
      {
        "date": "2025-02-06",
        "price": 39.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 34.84,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.69,
        "hold_days": 12
      },
      {
        "date": "2025-03-06",
        "price": 40.64,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-07",
        "price": 39.82,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.02,
        "hold_days": 1
      }
    ]
  },
  "603809": {
    "daily": [
      {
        "date": "2025-01-21",
        "price": 10.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-06",
        "price": 12.29,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.65,
        "hold_days": 16
      },
      {
        "date": "2025-03-06",
        "price": 13.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-10",
        "price": 14.12,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.24,
        "hold_days": 4
      },
      {
        "date": "2025-05-16",
        "price": 15.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-27",
        "price": 14.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.44,
        "hold_days": 11
      },
      {
        "date": "2025-07-23",
        "price": 16.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-30",
        "price": 14.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.16,
        "hold_days": 7
      },
      {
        "date": "2026-01-08",
        "price": 14.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-13",
        "price": 14.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.97,
        "hold_days": 5
      },
      {
        "date": "2026-01-23",
        "price": 14.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-02",
        "price": 12.73,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.35,
        "hold_days": 10
      }
    ]
  },
  "605398": {
    "daily": [
      {
        "date": "2025-01-22",
        "price": 20.96,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-23",
        "price": 23.06,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.02,
        "hold_days": 1
      },
      {
        "date": "2025-02-28",
        "price": 40.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-03",
        "price": 36.62,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.0,
        "hold_days": 3
      }
    ]
  },
  "603045": {
    "daily": [
      {
        "date": "2025-01-22",
        "price": 15.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-24",
        "price": 15.27,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.86,
        "hold_days": 2
      },
      {
        "date": "2025-02-20",
        "price": 14.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-21",
        "price": 14.64,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.41,
        "hold_days": 1
      },
      {
        "date": "2025-09-24",
        "price": 20.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-30",
        "price": 20.29,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.44,
        "hold_days": 6
      }
    ]
  },
  "688017": {
    "daily": [
      {
        "date": "2025-01-22",
        "price": 145.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-27",
        "price": 144.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -0.68,
        "hold_days": 5
      },
      {
        "date": "2025-02-05",
        "price": 163.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-07",
        "price": 170.3,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.47,
        "hold_days": 2
      },
      {
        "date": "2025-02-26",
        "price": 178.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-27",
        "price": 174.4,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.19,
        "hold_days": 1
      },
      {
        "date": "2025-09-29",
        "price": 178.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-13",
        "price": 164.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.73,
        "hold_days": 14
      }
    ]
  },
  "300693": {
    "daily": [
      {
        "date": "2025-01-22",
        "price": 28.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-27",
        "price": 28.78,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.98,
        "hold_days": 5
      }
    ]
  },
  "603269": {
    "daily": [
      {
        "date": "2025-01-22",
        "price": 8.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-05",
        "price": 7.49,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.94,
        "hold_days": 14
      }
    ]
  },
  "301186": {
    "daily": [
      {
        "date": "2025-01-22",
        "price": 42.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-07",
        "price": 47.29,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.09,
        "hold_days": 16
      }
    ]
  },
  "300248": {
    "daily": [
      {
        "date": "2025-01-23",
        "price": 10.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-27",
        "price": 11.19,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.6,
        "hold_days": 4
      }
    ]
  },
  "603082": {
    "daily": [
      {
        "date": "2025-01-23",
        "price": 39.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-27",
        "price": 37.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.54,
        "hold_days": 4
      },
      {
        "date": "2025-02-18",
        "price": 42.46,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-20",
        "price": 43.4,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.21,
        "hold_days": 2
      }
    ]
  },
  "002480": {
    "daily": [
      {
        "date": "2025-01-23",
        "price": 5.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-13",
        "price": 5.18,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.9,
        "hold_days": 21
      }
    ]
  },
  "603135": {
    "daily": [
      {
        "date": "2025-01-23",
        "price": 9.63,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 9.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.15,
        "hold_days": 36
      }
    ]
  },
  "002666": {
    "daily": [
      {
        "date": "2025-01-23",
        "price": 4.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-31",
        "price": 4.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.36,
        "hold_days": 67
      }
    ]
  },
  "688502": {
    "daily": [
      {
        "date": "2025-01-24",
        "price": 260.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-01-27",
        "price": 235.64,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.4,
        "hold_days": 3
      },
      {
        "date": "2025-08-28",
        "price": 475.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 418.89,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.85,
        "hold_days": 5
      }
    ]
  },
  "002497": {
    "daily": [
      {
        "date": "2025-01-24",
        "price": 13.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-05",
        "price": 12.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.1,
        "hold_days": 12
      },
      {
        "date": "2025-02-07",
        "price": 13.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-17",
        "price": 12.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.59,
        "hold_days": 10
      }
    ]
  },
  "688306": {
    "daily": [
      {
        "date": "2025-01-27",
        "price": 8.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-05",
        "price": 10.33,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.33,
        "hold_days": 9
      }
    ]
  },
  "920508": {
    "daily": [
      {
        "date": "2025-01-27",
        "price": 23.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-06",
        "price": 26.43,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.68,
        "hold_days": 10
      }
    ]
  },
  "603236": {
    "daily": [
      {
        "date": "2025-01-27",
        "price": 88.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-07",
        "price": 89.11,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.47,
        "hold_days": 11
      }
    ]
  },
  "605080": {
    "daily": [
      {
        "date": "2025-01-27",
        "price": 30.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-07",
        "price": 28.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.97,
        "hold_days": 11
      }
    ]
  },
  "002899": {
    "daily": [
      {
        "date": "2025-01-27",
        "price": 23.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-10",
        "price": 27.32,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.55,
        "hold_days": 14
      }
    ]
  },
  "688343": {
    "daily": [
      {
        "date": "2025-02-05",
        "price": 53.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-06",
        "price": 64.69,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.0,
        "hold_days": 1
      },
      {
        "date": "2025-02-21",
        "price": 69.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-26",
        "price": 79.19,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.45,
        "hold_days": 5
      },
      {
        "date": "2025-08-19",
        "price": 65.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-21",
        "price": 65.91,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.63,
        "hold_days": 2
      },
      {
        "date": "2025-09-18",
        "price": 89.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-22",
        "price": 90.52,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.5,
        "hold_days": 4
      },
      {
        "date": "2025-09-22",
        "price": 90.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 87.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.31,
        "hold_days": 1
      }
    ]
  },
  "000607": {
    "daily": [
      {
        "date": "2025-02-05",
        "price": 3.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-12",
        "price": 4.49,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.93,
        "hold_days": 7
      },
      {
        "date": "2026-01-29",
        "price": 5.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-11",
        "price": 5.19,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.7,
        "hold_days": 13
      }
    ]
  },
  "603890": {
    "daily": [
      {
        "date": "2025-02-05",
        "price": 13.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-13",
        "price": 13.08,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.62,
        "hold_days": 8
      }
    ]
  },
  "600556": {
    "daily": [
      {
        "date": "2025-02-06",
        "price": 5.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-13",
        "price": 6.09,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.53,
        "hold_days": 7
      },
      {
        "date": "2026-01-23",
        "price": 7.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-30",
        "price": 7.61,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.69,
        "hold_days": 7
      },
      {
        "date": "2026-02-02",
        "price": 7.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-03",
        "price": 8.04,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.81,
        "hold_days": 1
      }
    ]
  },
  "002526": {
    "daily": [
      {
        "date": "2025-02-06",
        "price": 4.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-14",
        "price": 4.09,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.73,
        "hold_days": 8
      }
    ]
  },
  "002906": {
    "daily": [
      {
        "date": "2025-02-06",
        "price": 33.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 35.49,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.58,
        "hold_days": 12
      }
    ]
  },
  "920171": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 23.55,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-10",
        "price": 26.23,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.38,
        "hold_days": 3
      },
      {
        "date": "2025-02-21",
        "price": 28.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-24",
        "price": 27.54,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.55,
        "hold_days": 3
      },
      {
        "date": "2025-03-11",
        "price": 30.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-13",
        "price": 29.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -1.9,
        "hold_days": 2
      }
    ]
  },
  "002426": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 3.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-11",
        "price": 3.39,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.25,
        "hold_days": 4
      },
      {
        "date": "2025-09-04",
        "price": 3.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 3.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.33,
        "hold_days": 19
      }
    ]
  },
  "920699": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 45.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-12",
        "price": 48.95,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.99,
        "hold_days": 5
      }
    ]
  },
  "002931": {
    "daily": [
      {
        "date": "2025-02-10",
        "price": 16.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-12",
        "price": 16.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.82,
        "hold_days": 2
      },
      {
        "date": "2025-03-05",
        "price": 18.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-10",
        "price": 17.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.38,
        "hold_days": 5
      }
    ]
  },
  "000856": {
    "daily": [
      {
        "date": "2025-02-10",
        "price": 11.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-14",
        "price": 11.52,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -2.95,
        "hold_days": 4
      }
    ]
  },
  "603090": {
    "daily": [
      {
        "date": "2025-02-10",
        "price": 20.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-27",
        "price": 18.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.59,
        "hold_days": 17
      }
    ]
  },
  "688577": {
    "daily": [
      {
        "date": "2025-02-12",
        "price": 32.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-14",
        "price": 32.47,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.59,
        "hold_days": 2
      },
      {
        "date": "2025-02-25",
        "price": 41.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-26",
        "price": 41.35,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.1,
        "hold_days": 1
      },
      {
        "date": "2025-03-12",
        "price": 40.86,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-19",
        "price": 41.85,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.42,
        "hold_days": 7
      },
      {
        "date": "2025-09-26",
        "price": 107.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-30",
        "price": 119.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.33,
        "hold_days": 4
      }
    ]
  },
  "300258": {
    "daily": [
      {
        "date": "2025-02-12",
        "price": 11.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-14",
        "price": 10.9,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.3,
        "hold_days": 2
      },
      {
        "date": "2025-02-26",
        "price": 14.17,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-27",
        "price": 13.73,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.11,
        "hold_days": 1
      },
      {
        "date": "2025-05-15",
        "price": 14.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-16",
        "price": 16.75,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.34,
        "hold_days": 1
      },
      {
        "date": "2025-09-22",
        "price": 16.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-26",
        "price": 15.61,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.91,
        "hold_days": 4
      }
    ]
  },
  "600734": {
    "daily": [
      {
        "date": "2025-02-12",
        "price": 4.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 4.28,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.66,
        "hold_days": 6
      },
      {
        "date": "2025-02-28",
        "price": 4.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-07",
        "price": 4.97,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.54,
        "hold_days": 7
      }
    ]
  },
  "300287": {
    "daily": [
      {
        "date": "2025-02-13",
        "price": 5.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-14",
        "price": 7.19,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.03,
        "hold_days": 1
      }
    ]
  },
  "002730": {
    "daily": [
      {
        "date": "2025-02-13",
        "price": 22.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-17",
        "price": 20.07,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.48,
        "hold_days": 4
      }
    ]
  },
  "300612": {
    "daily": [
      {
        "date": "2025-02-13",
        "price": 17.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 16.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.15,
        "hold_days": 5
      },
      {
        "date": "2026-02-05",
        "price": 21.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-06",
        "price": 19.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.57,
        "hold_days": 1
      }
    ]
  },
  "688095": {
    "daily": [
      {
        "date": "2025-02-13",
        "price": 81.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 74.43,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.55,
        "hold_days": 5
      },
      {
        "date": "2025-11-24",
        "price": 99.86,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-28",
        "price": 96.41,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.45,
        "hold_days": 4
      }
    ]
  },
  "002122": {
    "daily": [
      {
        "date": "2025-02-13",
        "price": 5.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 4.5,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.79,
        "hold_days": 15
      }
    ]
  },
  "603280": {
    "daily": [
      {
        "date": "2025-02-14",
        "price": 23.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-17",
        "price": 23.52,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.47,
        "hold_days": 3
      },
      {
        "date": "2025-05-27",
        "price": 25.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-13",
        "price": 24.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.14,
        "hold_days": 17
      },
      {
        "date": "2026-01-14",
        "price": 41.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-16",
        "price": 42.35,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.24,
        "hold_days": 2
      }
    ]
  },
  "300017": {
    "daily": [
      {
        "date": "2025-02-14",
        "price": 13.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 12.92,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.14,
        "hold_days": 4
      },
      {
        "date": "2026-02-05",
        "price": 17.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-11",
        "price": 20.45,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.8,
        "hold_days": 6
      }
    ]
  },
  "000810": {
    "daily": [
      {
        "date": "2025-02-14",
        "price": 14.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 14.24,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.49,
        "hold_days": 4
      }
    ]
  },
  "300412": {
    "daily": [
      {
        "date": "2025-02-14",
        "price": 5.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 5.35,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.55,
        "hold_days": 4
      }
    ]
  },
  "300830": {
    "daily": [
      {
        "date": "2025-02-14",
        "price": 9.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 8.7,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.47,
        "hold_days": 14
      }
    ]
  },
  "300292": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 5.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-18",
        "price": 5.25,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.91,
        "hold_days": 1
      }
    ]
  },
  "300476": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 53.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-20",
        "price": 51.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.32,
        "hold_days": 3
      },
      {
        "date": "2025-07-15",
        "price": 162.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-21",
        "price": 155.85,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.84,
        "hold_days": 6
      },
      {
        "date": "2025-07-28",
        "price": 180.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-07",
        "price": 189.71,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.94,
        "hold_days": 10
      },
      {
        "date": "2025-08-08",
        "price": 190.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-12",
        "price": 214.89,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.87,
        "hold_days": 4
      },
      {
        "date": "2025-09-10",
        "price": 288.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-11",
        "price": 336.01,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.4,
        "hold_days": 1
      }
    ]
  },
  "920403": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 19.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-24",
        "price": 19.93,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.45,
        "hold_days": 7
      },
      {
        "date": "2025-05-07",
        "price": 24.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-13",
        "price": 22.01,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.85,
        "hold_days": 6
      }
    ]
  },
  "002350": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 6.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 6.62,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.53,
        "hold_days": 35
      }
    ]
  },
  "002328": {
    "daily": [
      {
        "date": "2025-02-18",
        "price": 6.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-20",
        "price": 6.62,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.45,
        "hold_days": 2
      },
      {
        "date": "2025-09-05",
        "price": 6.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-22",
        "price": 6.6,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.96,
        "hold_days": 17
      }
    ]
  },
  "603300": {
    "daily": [
      {
        "date": "2025-02-18",
        "price": 8.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-21",
        "price": 9.95,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.45,
        "hold_days": 3
      },
      {
        "date": "2026-01-14",
        "price": 8.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-16",
        "price": 7.58,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.84,
        "hold_days": 2
      }
    ]
  },
  "605555": {
    "daily": [
      {
        "date": "2025-02-18",
        "price": 20.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-21",
        "price": 22.73,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.88,
        "hold_days": 3
      }
    ]
  },
  "600481": {
    "daily": [
      {
        "date": "2025-02-18",
        "price": 6.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-27",
        "price": 6.17,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.15,
        "hold_days": 9
      }
    ]
  },
  "002960": {
    "daily": [
      {
        "date": "2025-02-18",
        "price": 9.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 9.85,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.44,
        "hold_days": 10
      }
    ]
  },
  "002733": {
    "daily": [
      {
        "date": "2025-02-20",
        "price": 17.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-26",
        "price": 19.53,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 8.8,
        "hold_days": 6
      },
      {
        "date": "2025-03-12",
        "price": 18.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-19",
        "price": 18.93,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.1,
        "hold_days": 7
      },
      {
        "date": "2025-09-01",
        "price": 21.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-12",
        "price": 21.02,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.71,
        "hold_days": 11
      },
      {
        "date": "2025-11-11",
        "price": 25.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-14",
        "price": 22.71,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.45,
        "hold_days": 3
      },
      {
        "date": "2026-03-24",
        "price": 27.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-31",
        "price": 24.52,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.48,
        "hold_days": 7
      },
      {
        "date": "2026-04-28",
        "price": 32.15,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-29",
        "price": 29.64,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.81,
        "hold_days": 1
      }
    ]
  },
  "603220": {
    "daily": [
      {
        "date": "2025-02-20",
        "price": 24.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-26",
        "price": 28.16,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.73,
        "hold_days": 6
      },
      {
        "date": "2026-02-11",
        "price": 25.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-24",
        "price": 25.73,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.31,
        "hold_days": 13
      },
      {
        "date": "2026-03-30",
        "price": 25.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-09",
        "price": 27.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.09,
        "hold_days": 10
      },
      {
        "date": "2026-04-13",
        "price": 26.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-16",
        "price": 31.93,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 18.35,
        "hold_days": 3
      },
      {
        "date": "2026-04-23",
        "price": 34.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-28",
        "price": 29.23,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -14.61,
        "hold_days": 5
      }
    ]
  },
  "002639": {
    "daily": [
      {
        "date": "2025-02-20",
        "price": 7.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 7.4,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.37,
        "hold_days": 8
      },
      {
        "date": "2025-03-04",
        "price": 7.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 7.83,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.76,
        "hold_days": 20
      },
      {
        "date": "2025-04-15",
        "price": 8.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-16",
        "price": 7.87,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.02,
        "hold_days": 1
      },
      {
        "date": "2025-05-23",
        "price": 9.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-27",
        "price": 10.32,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.05,
        "hold_days": 4
      },
      {
        "date": "2025-07-23",
        "price": 11.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-25",
        "price": 11.43,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.09,
        "hold_days": 2
      },
      {
        "date": "2025-08-13",
        "price": 11.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 11.28,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.97,
        "hold_days": 14
      },
      {
        "date": "2025-12-11",
        "price": 16.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-31",
        "price": 18.6,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 12.66,
        "hold_days": 20
      }
    ]
  },
  "002195": {
    "daily": [
      {
        "date": "2025-02-21",
        "price": 5.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-25",
        "price": 4.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.87,
        "hold_days": 4
      },
      {
        "date": "2025-03-03",
        "price": 5.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-13",
        "price": 6.31,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 20.65,
        "hold_days": 10
      },
      {
        "date": "2025-03-19",
        "price": 6.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 6.25,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.76,
        "hold_days": 2
      },
      {
        "date": "2026-01-29",
        "price": 10.15,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-09",
        "price": 10.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.1,
        "hold_days": 11
      }
    ]
  },
  "300509": {
    "daily": [
      {
        "date": "2025-02-21",
        "price": 9.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 8.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.96,
        "hold_days": 7
      },
      {
        "date": "2025-03-05",
        "price": 9.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-10",
        "price": 9.1,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.21,
        "hold_days": 5
      }
    ]
  },
  "002115": {
    "daily": [
      {
        "date": "2025-02-21",
        "price": 8.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 7.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.75,
        "hold_days": 7
      },
      {
        "date": "2025-08-28",
        "price": 9.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-01",
        "price": 11.52,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 21.01,
        "hold_days": 4
      },
      {
        "date": "2026-01-27",
        "price": 15.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-09",
        "price": 15.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.73,
        "hold_days": 13
      }
    ]
  },
  "688327": {
    "daily": [
      {
        "date": "2025-02-24",
        "price": 19.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-25",
        "price": 19.02,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.21,
        "hold_days": 1
      },
      {
        "date": "2025-03-10",
        "price": 19.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-13",
        "price": 18.08,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -7.42,
        "hold_days": 3
      },
      {
        "date": "2025-08-19",
        "price": 17.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-26",
        "price": 18.1,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.43,
        "hold_days": 7
      }
    ]
  },
  "300148": {
    "daily": [
      {
        "date": "2025-02-24",
        "price": 5.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-26",
        "price": 5.02,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.57,
        "hold_days": 2
      }
    ]
  },
  "605018": {
    "daily": [
      {
        "date": "2025-02-24",
        "price": 12.37,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-27",
        "price": 12.72,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.83,
        "hold_days": 3
      },
      {
        "date": "2025-03-20",
        "price": 13.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 12.51,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.48,
        "hold_days": 4
      }
    ]
  },
  "000528": {
    "daily": [
      {
        "date": "2025-02-25",
        "price": 11.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-10",
        "price": 13.11,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.82,
        "hold_days": 13
      },
      {
        "date": "2025-03-20",
        "price": 12.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-31",
        "price": 10.91,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.23,
        "hold_days": 11
      }
    ]
  },
  "003033": {
    "daily": [
      {
        "date": "2025-02-26",
        "price": 31.74,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 35.48,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.78,
        "hold_days": 2
      }
    ]
  },
  "300687": {
    "daily": [
      {
        "date": "2025-02-26",
        "price": 24.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 29.23,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.89,
        "hold_days": 2
      }
    ]
  },
  "600081": {
    "daily": [
      {
        "date": "2025-02-26",
        "price": 12.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-11",
        "price": 12.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.76,
        "hold_days": 13
      },
      {
        "date": "2025-03-12",
        "price": 12.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-20",
        "price": 13.93,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.37,
        "hold_days": 8
      }
    ]
  },
  "301361": {
    "daily": [
      {
        "date": "2025-02-27",
        "price": 36.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 32.65,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.65,
        "hold_days": 1
      },
      {
        "date": "2025-03-07",
        "price": 33.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-12",
        "price": 39.82,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 18.79,
        "hold_days": 5
      }
    ]
  },
  "300571": {
    "daily": [
      {
        "date": "2025-02-27",
        "price": 38.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-02-28",
        "price": 33.6,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.02,
        "hold_days": 1
      }
    ]
  },
  "920299": {
    "daily": [
      {
        "date": "2025-02-27",
        "price": 13.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-03",
        "price": 15.39,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 17.57,
        "hold_days": 4
      },
      {
        "date": "2025-03-13",
        "price": 19.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-19",
        "price": 17.24,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.44,
        "hold_days": 6
      },
      {
        "date": "2026-03-09",
        "price": 30.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-16",
        "price": 27.64,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.41,
        "hold_days": 7
      }
    ]
  },
  "000785": {
    "daily": [
      {
        "date": "2025-02-27",
        "price": 4.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-03",
        "price": 4.55,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.21,
        "hold_days": 4
      }
    ]
  },
  "688598": {
    "daily": [
      {
        "date": "2025-02-28",
        "price": 29.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-03",
        "price": 27.7,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.14,
        "hold_days": 3
      }
    ]
  },
  "601789": {
    "daily": [
      {
        "date": "2025-02-28",
        "price": 6.03,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-03",
        "price": 6.64,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.12,
        "hold_days": 3
      }
    ]
  },
  "600405": {
    "daily": [
      {
        "date": "2025-02-28",
        "price": 5.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-04",
        "price": 5.82,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.65,
        "hold_days": 4
      }
    ]
  },
  "688573": {
    "daily": [
      {
        "date": "2025-02-28",
        "price": 22.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-04",
        "price": 21.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -2.58,
        "hold_days": 4
      }
    ]
  },
  "002227": {
    "daily": [
      {
        "date": "2025-02-28",
        "price": 12.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-05",
        "price": 13.88,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 10.86,
        "hold_days": 5
      }
    ]
  },
  "002178": {
    "daily": [
      {
        "date": "2025-02-28",
        "price": 7.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-05",
        "price": 7.77,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.51,
        "hold_days": 5
      }
    ]
  },
  "003010": {
    "daily": [
      {
        "date": "2025-03-03",
        "price": 16.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-05",
        "price": 18.42,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.43,
        "hold_days": 2
      },
      {
        "date": "2025-04-08",
        "price": 22.31,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 23.66,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.05,
        "hold_days": 3
      },
      {
        "date": "2025-05-26",
        "price": 32.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-28",
        "price": 33.01,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.39,
        "hold_days": 2
      },
      {
        "date": "2025-05-30",
        "price": 32.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-03",
        "price": 36.27,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.14,
        "hold_days": 4
      },
      {
        "date": "2025-06-10",
        "price": 37.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-12",
        "price": 42.21,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.04,
        "hold_days": 2
      }
    ]
  },
  "300438": {
    "daily": [
      {
        "date": "2025-03-03",
        "price": 32.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-05",
        "price": 30.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.8,
        "hold_days": 2
      },
      {
        "date": "2025-11-11",
        "price": 55.22,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-14",
        "price": 53.91,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.37,
        "hold_days": 3
      },
      {
        "date": "2026-03-20",
        "price": 60.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-23",
        "price": 59.81,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.32,
        "hold_days": 3
      }
    ]
  },
  "920932": {
    "daily": [
      {
        "date": "2025-03-03",
        "price": 23.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-06",
        "price": 24.82,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.35,
        "hold_days": 3
      }
    ]
  },
  "603985": {
    "daily": [
      {
        "date": "2025-03-03",
        "price": 13.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-07",
        "price": 14.5,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 8.05,
        "hold_days": 4
      },
      {
        "date": "2025-03-21",
        "price": 15.31,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 13.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.86,
        "hold_days": 3
      },
      {
        "date": "2025-03-31",
        "price": 14.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 14.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.11,
        "hold_days": 7
      },
      {
        "date": "2025-10-10",
        "price": 17.96,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-16",
        "price": 17.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.73,
        "hold_days": 6
      }
    ]
  },
  "300777": {
    "daily": [
      {
        "date": "2025-03-04",
        "price": 33.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-06",
        "price": 34.13,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.94,
        "hold_days": 2
      },
      {
        "date": "2026-01-16",
        "price": 45.55,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-19",
        "price": 45.29,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.57,
        "hold_days": 3
      },
      {
        "date": "2026-01-22",
        "price": 46.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-02",
        "price": 43.35,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.37,
        "hold_days": 11
      }
    ]
  },
  "002010": {
    "daily": [
      {
        "date": "2025-03-04",
        "price": 4.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-10",
        "price": 5.29,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.44,
        "hold_days": 6
      }
    ]
  },
  "301280": {
    "daily": [
      {
        "date": "2025-03-05",
        "price": 43.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-06",
        "price": 52.24,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.4,
        "hold_days": 1
      },
      {
        "date": "2025-03-18",
        "price": 48.14,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 42.43,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.86,
        "hold_days": 3
      }
    ]
  },
  "920510": {
    "daily": [
      {
        "date": "2025-03-05",
        "price": 26.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-06",
        "price": 25.35,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -2.69,
        "hold_days": 1
      },
      {
        "date": "2025-04-30",
        "price": 23.11,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-08",
        "price": 25.1,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 8.61,
        "hold_days": 8
      }
    ]
  },
  "600186": {
    "daily": [
      {
        "date": "2025-03-05",
        "price": 7.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-06",
        "price": 7.23,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.12,
        "hold_days": 1
      },
      {
        "date": "2026-04-01",
        "price": 7.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-10",
        "price": 7.43,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.36,
        "hold_days": 9
      }
    ]
  },
  "600678": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 8.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 7.56,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.95,
        "hold_days": 15
      },
      {
        "date": "2025-05-09",
        "price": 8.27,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-15",
        "price": 7.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.29,
        "hold_days": 6
      },
      {
        "date": "2025-07-21",
        "price": 10.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-23",
        "price": 11.15,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.39,
        "hold_days": 2
      },
      {
        "date": "2025-08-06",
        "price": 9.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-13",
        "price": 9.6,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.72,
        "hold_days": 7
      },
      {
        "date": "2025-12-25",
        "price": 13.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-08",
        "price": 14.48,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.1,
        "hold_days": 14
      }
    ]
  },
  "002117": {
    "daily": [
      {
        "date": "2025-03-07",
        "price": 13.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-11",
        "price": 13.69,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.74,
        "hold_days": 4
      }
    ]
  },
  "688219": {
    "daily": [
      {
        "date": "2025-03-07",
        "price": 13.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-13",
        "price": 13.54,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.94,
        "hold_days": 6
      }
    ]
  },
  "603506": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 10.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-12",
        "price": 10.46,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.38,
        "hold_days": 2
      },
      {
        "date": "2025-04-17",
        "price": 10.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-21",
        "price": 10.74,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.99,
        "hold_days": 4
      }
    ]
  },
  "300853": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 31.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-13",
        "price": 29.44,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.19,
        "hold_days": 3
      }
    ]
  },
  "600353": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 8.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-17",
        "price": 8.17,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.2,
        "hold_days": 7
      },
      {
        "date": "2025-10-28",
        "price": 17.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-11",
        "price": 15.47,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.37,
        "hold_days": 14
      }
    ]
  },
  "603316": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 6.17,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-19",
        "price": 6.72,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 8.91,
        "hold_days": 9
      },
      {
        "date": "2025-10-20",
        "price": 12.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-27",
        "price": 14.23,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.55,
        "hold_days": 7
      }
    ]
  },
  "300296": {
    "daily": [
      {
        "date": "2025-03-11",
        "price": 7.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-12",
        "price": 7.84,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.38,
        "hold_days": 1
      }
    ]
  },
  "000791": {
    "daily": [
      {
        "date": "2025-03-12",
        "price": 6.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-17",
        "price": 6.24,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.65,
        "hold_days": 5
      }
    ]
  },
  "600498": {
    "daily": [
      {
        "date": "2025-03-12",
        "price": 24.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 22.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.93,
        "hold_days": 9
      },
      {
        "date": "2026-02-06",
        "price": 41.25,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-11",
        "price": 41.62,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.9,
        "hold_days": 5
      },
      {
        "date": "2026-04-03",
        "price": 49.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-09",
        "price": 54.95,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.78,
        "hold_days": 6
      }
    ]
  },
  "000158": {
    "daily": [
      {
        "date": "2025-03-13",
        "price": 26.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-18",
        "price": 27.68,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.59,
        "hold_days": 5
      }
    ]
  },
  "920578": {
    "daily": [
      {
        "date": "2025-03-13",
        "price": 38.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-19",
        "price": 37.68,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.14,
        "hold_days": 6
      },
      {
        "date": "2025-09-02",
        "price": 31.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-10",
        "price": 32.31,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.03,
        "hold_days": 8
      }
    ]
  },
  "688629": {
    "daily": [
      {
        "date": "2025-03-13",
        "price": 64.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-20",
        "price": 55.05,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.98,
        "hold_days": 7
      }
    ]
  },
  "002272": {
    "daily": [
      {
        "date": "2025-03-13",
        "price": 11.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-20",
        "price": 10.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.89,
        "hold_days": 7
      }
    ]
  },
  "002110": {
    "daily": [
      {
        "date": "2025-03-13",
        "price": 4.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 4.34,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.88,
        "hold_days": 11
      }
    ]
  },
  "300881": {
    "daily": [
      {
        "date": "2025-03-13",
        "price": 33.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-25",
        "price": 35.75,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.11,
        "hold_days": 12
      }
    ]
  },
  "000967": {
    "daily": [
      {
        "date": "2025-03-17",
        "price": 6.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-19",
        "price": 6.44,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.15,
        "hold_days": 2
      }
    ]
  },
  "920779": {
    "daily": [
      {
        "date": "2025-03-18",
        "price": 45.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-20",
        "price": 40.38,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.37,
        "hold_days": 2
      }
    ]
  },
  "002345": {
    "daily": [
      {
        "date": "2025-03-18",
        "price": 8.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 7.82,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.91,
        "hold_days": 3
      },
      {
        "date": "2025-04-21",
        "price": 9.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-23",
        "price": 8.69,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.65,
        "hold_days": 2
      },
      {
        "date": "2025-06-12",
        "price": 15.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-16",
        "price": 15.08,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.62,
        "hold_days": 4
      }
    ]
  },
  "603270": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 30.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 29.05,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.77,
        "hold_days": 2
      }
    ]
  },
  "000410": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 7.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 7.93,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.06,
        "hold_days": 2
      }
    ]
  },
  "600735": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 5.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 5.91,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.01,
        "hold_days": 2
      }
    ]
  },
  "688626": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 42.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-21",
        "price": 39.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.97,
        "hold_days": 2
      }
    ]
  },
  "300402": {
    "daily": [
      {
        "date": "2025-03-20",
        "price": 20.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 22.95,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.44,
        "hold_days": 4
      }
    ]
  },
  "301232": {
    "daily": [
      {
        "date": "2025-03-20",
        "price": 28.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 27.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.58,
        "hold_days": 4
      },
      {
        "date": "2025-10-20",
        "price": 45.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-23",
        "price": 41.03,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.38,
        "hold_days": 3
      },
      {
        "date": "2025-10-30",
        "price": 43.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-06",
        "price": 53.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 23.0,
        "hold_days": 7
      }
    ]
  },
  "002097": {
    "daily": [
      {
        "date": "2025-03-20",
        "price": 8.27,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 6.72,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -18.74,
        "hold_days": 18
      }
    ]
  },
  "920689": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 48.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 61.5,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 25.79,
        "hold_days": 3
      },
      {
        "date": "2025-07-22",
        "price": 45.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-28",
        "price": 42.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.12,
        "hold_days": 6
      }
    ]
  },
  "300441": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 11.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-24",
        "price": 10.26,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -8.39,
        "hold_days": 3
      }
    ]
  },
  "301261": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 120.15,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-25",
        "price": 122.02,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.56,
        "hold_days": 4
      }
    ]
  },
  "600105": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 6.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-25",
        "price": 7.18,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 17.7,
        "hold_days": 4
      },
      {
        "date": "2025-05-14",
        "price": 7.22,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-21",
        "price": 7.33,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.52,
        "hold_days": 7
      },
      {
        "date": "2025-06-16",
        "price": 8.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-19",
        "price": 7.68,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.03,
        "hold_days": 3
      }
    ]
  },
  "000932": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 5.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-28",
        "price": 5.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.91,
        "hold_days": 7
      }
    ]
  },
  "002080": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 15.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 13.07,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.92,
        "hold_days": 17
      }
    ]
  },
  "920682": {
    "daily": [
      {
        "date": "2025-03-24",
        "price": 10.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-25",
        "price": 10.23,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.31,
        "hold_days": 1
      },
      {
        "date": "2025-07-21",
        "price": 10.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-22",
        "price": 12.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 21.01,
        "hold_days": 1
      },
      {
        "date": "2025-08-18",
        "price": 10.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 10.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.06,
        "hold_days": 9
      }
    ]
  },
  "002681": {
    "daily": [
      {
        "date": "2025-03-24",
        "price": 9.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-25",
        "price": 8.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.34,
        "hold_days": 1
      },
      {
        "date": "2025-09-19",
        "price": 7.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 7.9,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.67,
        "hold_days": 4
      }
    ]
  },
  "000422": {
    "daily": [
      {
        "date": "2025-03-24",
        "price": 14.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-26",
        "price": 15.16,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.26,
        "hold_days": 2
      }
    ]
  },
  "920694": {
    "daily": [
      {
        "date": "2025-03-25",
        "price": 18.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-26",
        "price": 17.6,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.46,
        "hold_days": 1
      }
    ]
  },
  "300963": {
    "daily": [
      {
        "date": "2025-03-25",
        "price": 8.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-27",
        "price": 7.66,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.2,
        "hold_days": 2
      },
      {
        "date": "2025-03-28",
        "price": 8.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-01",
        "price": 10.84,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 32.84,
        "hold_days": 4
      },
      {
        "date": "2025-04-14",
        "price": 11.31,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-16",
        "price": 11.69,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.36,
        "hold_days": 2
      },
      {
        "date": "2025-05-23",
        "price": 24.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-27",
        "price": 24.91,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.1,
        "hold_days": 4
      }
    ]
  },
  "920396": {
    "daily": [
      {
        "date": "2025-03-25",
        "price": 24.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-27",
        "price": 23.78,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -2.1,
        "hold_days": 2
      },
      {
        "date": "2025-04-14",
        "price": 30.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-15",
        "price": 31.45,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.28,
        "hold_days": 1
      },
      {
        "date": "2025-05-23",
        "price": 38.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-26",
        "price": 44.38,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.67,
        "hold_days": 3
      },
      {
        "date": "2025-06-12",
        "price": 42.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-13",
        "price": 41.26,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.17,
        "hold_days": 1
      }
    ]
  },
  "002366": {
    "daily": [
      {
        "date": "2025-03-25",
        "price": 5.63,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-27",
        "price": 5.32,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.51,
        "hold_days": 2
      },
      {
        "date": "2025-05-23",
        "price": 5.63,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-03",
        "price": 6.69,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 18.83,
        "hold_days": 11
      }
    ]
  },
  "000533": {
    "daily": [
      {
        "date": "2025-03-25",
        "price": 7.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-27",
        "price": 6.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.02,
        "hold_days": 2
      },
      {
        "date": "2025-12-23",
        "price": 9.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-31",
        "price": 8.33,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.26,
        "hold_days": 8
      },
      {
        "date": "2026-03-04",
        "price": 12.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 16.75,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 36.18,
        "hold_days": 16
      }
    ]
  },
  "600399": {
    "daily": [
      {
        "date": "2025-03-25",
        "price": 6.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-27",
        "price": 6.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.6,
        "hold_days": 2
      },
      {
        "date": "2025-12-15",
        "price": 5.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-23",
        "price": 5.36,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.29,
        "hold_days": 8
      }
    ]
  },
  "600367": {
    "daily": [
      {
        "date": "2025-03-25",
        "price": 15.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-28",
        "price": 15.25,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.55,
        "hold_days": 3
      },
      {
        "date": "2026-01-06",
        "price": 18.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-14",
        "price": 19.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.25,
        "hold_days": 8
      }
    ]
  },
  "002598": {
    "daily": [
      {
        "date": "2025-03-26",
        "price": 11.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-27",
        "price": 10.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.84,
        "hold_days": 1
      },
      {
        "date": "2025-04-01",
        "price": 10.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 9.6,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.09,
        "hold_days": 6
      }
    ]
  },
  "300198": {
    "daily": [
      {
        "date": "2025-03-26",
        "price": 2.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-31",
        "price": 2.92,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.0,
        "hold_days": 5
      },
      {
        "date": "2025-12-09",
        "price": 2.64,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-15",
        "price": 2.48,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.06,
        "hold_days": 6
      }
    ]
  },
  "002982": {
    "daily": [
      {
        "date": "2025-03-26",
        "price": 14.37,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 16.69,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.14,
        "hold_days": 12
      },
      {
        "date": "2025-06-11",
        "price": 16.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-17",
        "price": 15.57,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.93,
        "hold_days": 6
      }
    ]
  },
  "688096": {
    "daily": [
      {
        "date": "2025-03-27",
        "price": 10.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-31",
        "price": 12.25,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 19.05,
        "hold_days": 4
      }
    ]
  },
  "600319": {
    "daily": [
      {
        "date": "2025-03-27",
        "price": 6.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-31",
        "price": 5.38,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.33,
        "hold_days": 4
      }
    ]
  },
  "600844": {
    "daily": [
      {
        "date": "2025-03-27",
        "price": 2.96,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-03-31",
        "price": 2.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.12,
        "hold_days": 4
      }
    ]
  },
  "301118": {
    "daily": [
      {
        "date": "2025-03-27",
        "price": 23.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 22.01,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.51,
        "hold_days": 15
      }
    ]
  },
  "002584": {
    "daily": [
      {
        "date": "2025-03-27",
        "price": 8.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 8.46,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.44,
        "hold_days": 15
      }
    ]
  },
  "603086": {
    "daily": [
      {
        "date": "2025-03-27",
        "price": 5.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-15",
        "price": 8.82,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 59.78,
        "hold_days": 49
      }
    ]
  },
  "688136": {
    "daily": [
      {
        "date": "2025-03-28",
        "price": 25.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-01",
        "price": 28.05,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.05,
        "hold_days": 4
      },
      {
        "date": "2025-04-21",
        "price": 40.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-07",
        "price": 36.09,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.8,
        "hold_days": 16
      },
      {
        "date": "2025-07-31",
        "price": 53.25,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-04",
        "price": 50.2,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.73,
        "hold_days": 4
      }
    ]
  },
  "300723": {
    "daily": [
      {
        "date": "2025-03-28",
        "price": 25.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-01",
        "price": 28.75,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.78,
        "hold_days": 4
      },
      {
        "date": "2025-04-29",
        "price": 39.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-08",
        "price": 36.51,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.81,
        "hold_days": 9
      },
      {
        "date": "2025-05-29",
        "price": 49.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-03",
        "price": 51.83,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.35,
        "hold_days": 5
      },
      {
        "date": "2025-07-31",
        "price": 77.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-04",
        "price": 73.85,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.78,
        "hold_days": 4
      },
      {
        "date": "2025-08-14",
        "price": 70.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-21",
        "price": 69.72,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.39,
        "hold_days": 7
      }
    ]
  },
  "002667": {
    "daily": [
      {
        "date": "2025-03-31",
        "price": 11.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-01",
        "price": 12.41,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.02,
        "hold_days": 1
      },
      {
        "date": "2025-11-24",
        "price": 16.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-03",
        "price": 15.31,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -9.41,
        "hold_days": 9
      },
      {
        "date": "2025-12-22",
        "price": 13.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-14",
        "price": 14.24,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.01,
        "hold_days": 23
      }
    ]
  },
  "301075": {
    "daily": [
      {
        "date": "2025-03-31",
        "price": 25.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-01",
        "price": 30.4,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.02,
        "hold_days": 1
      },
      {
        "date": "2025-06-03",
        "price": 30.63,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-06",
        "price": 28.15,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.1,
        "hold_days": 3
      },
      {
        "date": "2025-08-04",
        "price": 37.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-21",
        "price": 41.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.14,
        "hold_days": 17
      }
    ]
  },
  "600363": {
    "daily": [
      {
        "date": "2025-03-31",
        "price": 63.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-02",
        "price": 64.55,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.37,
        "hold_days": 2
      },
      {
        "date": "2025-04-14",
        "price": 56.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-09",
        "price": 57.88,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.08,
        "hold_days": 25
      }
    ]
  },
  "600550": {
    "daily": [
      {
        "date": "2025-03-31",
        "price": 8.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 7.86,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.19,
        "hold_days": 7
      },
      {
        "date": "2025-04-14",
        "price": 8.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-16",
        "price": 7.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.24,
        "hold_days": 2
      }
    ]
  },
  "002757": {
    "daily": [
      {
        "date": "2025-03-31",
        "price": 20.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 17.68,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -15.08,
        "hold_days": 7
      },
      {
        "date": "2025-05-13",
        "price": 20.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-21",
        "price": 19.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.76,
        "hold_days": 8
      }
    ]
  },
  "603900": {
    "daily": [
      {
        "date": "2025-03-31",
        "price": 6.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-08",
        "price": 5.46,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -15.35,
        "hold_days": 8
      }
    ]
  },
  "002907": {
    "daily": [
      {
        "date": "2025-04-01",
        "price": 13.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-02",
        "price": 13.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.29,
        "hold_days": 1
      }
    ]
  },
  "300966": {
    "daily": [
      {
        "date": "2025-04-01",
        "price": 16.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 13.7,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -18.69,
        "hold_days": 6
      }
    ]
  },
  "600851": {
    "daily": [
      {
        "date": "2025-04-01",
        "price": 6.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 6.5,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.55,
        "hold_days": 6
      },
      {
        "date": "2026-04-01",
        "price": 8.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-03",
        "price": 8.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.09,
        "hold_days": 2
      }
    ]
  },
  "300353": {
    "daily": [
      {
        "date": "2025-04-02",
        "price": 23.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-07",
        "price": 19.2,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -17.53,
        "hold_days": 5
      },
      {
        "date": "2025-08-25",
        "price": 25.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 22.79,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.56,
        "hold_days": 2
      },
      {
        "date": "2025-09-30",
        "price": 25.86,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-10",
        "price": 26.04,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.7,
        "hold_days": 10
      }
    ]
  },
  "002471": {
    "daily": [
      {
        "date": "2025-04-02",
        "price": 3.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-08",
        "price": 3.07,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.99,
        "hold_days": 6
      },
      {
        "date": "2025-05-22",
        "price": 4.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-23",
        "price": 4.71,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.05,
        "hold_days": 1
      },
      {
        "date": "2025-10-29",
        "price": 4.96,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-30",
        "price": 4.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.04,
        "hold_days": 1
      },
      {
        "date": "2026-02-02",
        "price": 8.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-05",
        "price": 9.53,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.69,
        "hold_days": 3
      },
      {
        "date": "2026-02-26",
        "price": 9.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 8.04,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.92,
        "hold_days": 5
      }
    ]
  },
  "000813": {
    "daily": [
      {
        "date": "2025-04-03",
        "price": 3.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-08",
        "price": 3.02,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.7,
        "hold_days": 5
      }
    ]
  },
  "920970": {
    "daily": [
      {
        "date": "2025-04-07",
        "price": 8.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-08",
        "price": 9.68,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.13,
        "hold_days": 1
      }
    ]
  },
  "600965": {
    "daily": [
      {
        "date": "2025-04-07",
        "price": 5.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-09",
        "price": 6.7,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.56,
        "hold_days": 2
      }
    ]
  },
  "002234": {
    "daily": [
      {
        "date": "2025-04-07",
        "price": 9.32,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-10",
        "price": 10.01,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.4,
        "hold_days": 3
      }
    ]
  },
  "300021": {
    "daily": [
      {
        "date": "2025-04-08",
        "price": 4.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-10",
        "price": 4.87,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.53,
        "hold_days": 2
      }
    ]
  },
  "000862": {
    "daily": [
      {
        "date": "2025-04-08",
        "price": 5.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 5.56,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.72,
        "hold_days": 3
      },
      {
        "date": "2026-03-04",
        "price": 7.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-09",
        "price": 8.36,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.9,
        "hold_days": 5
      }
    ]
  },
  "688156": {
    "daily": [
      {
        "date": "2025-04-08",
        "price": 14.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 14.84,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.13,
        "hold_days": 3
      }
    ]
  },
  "920429": {
    "daily": [
      {
        "date": "2025-04-08",
        "price": 21.03,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 20.87,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -0.76,
        "hold_days": 3
      },
      {
        "date": "2025-06-03",
        "price": 30.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-06",
        "price": 28.19,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.69,
        "hold_days": 3
      },
      {
        "date": "2025-06-12",
        "price": 28.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-13",
        "price": 26.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.4,
        "hold_days": 1
      }
    ]
  },
  "600979": {
    "daily": [
      {
        "date": "2025-04-08",
        "price": 5.86,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 5.98,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.05,
        "hold_days": 3
      }
    ]
  },
  "000888": {
    "daily": [
      {
        "date": "2025-04-09",
        "price": 14.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 14.35,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.85,
        "hold_days": 2
      }
    ]
  },
  "002707": {
    "daily": [
      {
        "date": "2025-04-09",
        "price": 8.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 8.37,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.95,
        "hold_days": 2
      },
      {
        "date": "2025-04-25",
        "price": 8.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-29",
        "price": 8.28,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -7.49,
        "hold_days": 4
      }
    ]
  },
  "002330": {
    "daily": [
      {
        "date": "2025-04-09",
        "price": 4.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-28",
        "price": 4.21,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.08,
        "hold_days": 19
      }
    ]
  },
  "001337": {
    "daily": [
      {
        "date": "2025-04-10",
        "price": 23.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-11",
        "price": 26.15,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.11,
        "hold_days": 1
      }
    ]
  },
  "601069": {
    "daily": [
      {
        "date": "2025-04-10",
        "price": 16.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-14",
        "price": 18.55,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.61,
        "hold_days": 4
      },
      {
        "date": "2025-10-13",
        "price": 32.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-16",
        "price": 32.09,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.46,
        "hold_days": 3
      }
    ]
  },
  "920982": {
    "daily": [
      {
        "date": "2025-04-10",
        "price": 265.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-16",
        "price": 301.32,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.35,
        "hold_days": 6
      }
    ]
  },
  "002286": {
    "daily": [
      {
        "date": "2025-04-11",
        "price": 8.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-17",
        "price": 7.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.58,
        "hold_days": 6
      },
      {
        "date": "2025-05-27",
        "price": 12.27,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-29",
        "price": 11.96,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.53,
        "hold_days": 2
      }
    ]
  },
  "603718": {
    "daily": [
      {
        "date": "2025-04-11",
        "price": 7.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-18",
        "price": 6.86,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.14,
        "hold_days": 7
      }
    ]
  },
  "600593": {
    "daily": [
      {
        "date": "2025-04-14",
        "price": 38.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-18",
        "price": 33.15,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.54,
        "hold_days": 4
      }
    ]
  },
  "002255": {
    "daily": [
      {
        "date": "2025-04-14",
        "price": 8.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-21",
        "price": 8.76,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.7,
        "hold_days": 7
      }
    ]
  },
  "601399": {
    "daily": [
      {
        "date": "2025-04-14",
        "price": 3.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-28",
        "price": 2.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.84,
        "hold_days": 14
      }
    ]
  },
  "600558": {
    "daily": [
      {
        "date": "2025-04-14",
        "price": 4.43,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-30",
        "price": 4.25,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.06,
        "hold_days": 16
      },
      {
        "date": "2025-06-09",
        "price": 5.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-11",
        "price": 5.24,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.77,
        "hold_days": 2
      }
    ]
  },
  "603456": {
    "daily": [
      {
        "date": "2025-04-15",
        "price": 13.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-16",
        "price": 12.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.95,
        "hold_days": 1
      }
    ]
  },
  "000759": {
    "daily": [
      {
        "date": "2025-04-16",
        "price": 9.46,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-18",
        "price": 8.49,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.25,
        "hold_days": 2
      }
    ]
  },
  "920371": {
    "daily": [
      {
        "date": "2025-04-16",
        "price": 14.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-18",
        "price": 12.9,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.13,
        "hold_days": 2
      },
      {
        "date": "2025-09-04",
        "price": 12.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-17",
        "price": 11.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.08,
        "hold_days": 13
      }
    ]
  },
  "001368": {
    "daily": [
      {
        "date": "2025-04-17",
        "price": 21.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-21",
        "price": 21.18,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.99,
        "hold_days": 4
      }
    ]
  },
  "002626": {
    "daily": [
      {
        "date": "2025-04-17",
        "price": 14.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-25",
        "price": 15.3,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.3,
        "hold_days": 8
      },
      {
        "date": "2025-04-29",
        "price": 15.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-15",
        "price": 18.09,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.11,
        "hold_days": 16
      }
    ]
  },
  "002299": {
    "daily": [
      {
        "date": "2025-04-17",
        "price": 16.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-28",
        "price": 15.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.18,
        "hold_days": 11
      }
    ]
  },
  "301509": {
    "daily": [
      {
        "date": "2025-04-18",
        "price": 28.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-21",
        "price": 26.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.97,
        "hold_days": 3
      }
    ]
  },
  "920656": {
    "daily": [
      {
        "date": "2025-04-18",
        "price": 17.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-23",
        "price": 17.83,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.96,
        "hold_days": 5
      }
    ]
  },
  "000963": {
    "daily": [
      {
        "date": "2025-04-18",
        "price": 37.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-23",
        "price": 38.03,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.01,
        "hold_days": 5
      }
    ]
  },
  "002734": {
    "daily": [
      {
        "date": "2025-04-18",
        "price": 11.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-25",
        "price": 13.08,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.27,
        "hold_days": 7
      },
      {
        "date": "2025-06-16",
        "price": 22.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-18",
        "price": 22.5,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.88,
        "hold_days": 2
      }
    ]
  },
  "600239": {
    "daily": [
      {
        "date": "2025-04-18",
        "price": 2.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-28",
        "price": 2.43,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.18,
        "hold_days": 10
      }
    ]
  },
  "002716": {
    "daily": [
      {
        "date": "2025-04-21",
        "price": 3.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-25",
        "price": 3.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.81,
        "hold_days": 4
      },
      {
        "date": "2025-06-27",
        "price": 3.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-30",
        "price": 3.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.51,
        "hold_days": 3
      }
    ]
  },
  "600790": {
    "daily": [
      {
        "date": "2025-04-22",
        "price": 3.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-23",
        "price": 4.04,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.38,
        "hold_days": 1
      }
    ]
  },
  "002562": {
    "daily": [
      {
        "date": "2025-04-23",
        "price": 4.35,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-25",
        "price": 4.51,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.68,
        "hold_days": 2
      },
      {
        "date": "2025-07-14",
        "price": 6.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-16",
        "price": 6.24,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.32,
        "hold_days": 2
      }
    ]
  },
  "002489": {
    "daily": [
      {
        "date": "2025-04-23",
        "price": 3.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-28",
        "price": 3.18,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.47,
        "hold_days": 5
      }
    ]
  },
  "603605": {
    "daily": [
      {
        "date": "2025-04-25",
        "price": 82.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-28",
        "price": 91.19,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.24,
        "hold_days": 3
      }
    ]
  },
  "000558": {
    "daily": [
      {
        "date": "2025-04-25",
        "price": 4.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-28",
        "price": 4.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.84,
        "hold_days": 3
      }
    ]
  },
  "002627": {
    "daily": [
      {
        "date": "2025-04-25",
        "price": 6.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-30",
        "price": 5.3,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.54,
        "hold_days": 5
      }
    ]
  },
  "300157": {
    "daily": [
      {
        "date": "2025-04-28",
        "price": 3.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-29",
        "price": 3.54,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.97,
        "hold_days": 1
      }
    ]
  },
  "300945": {
    "daily": [
      {
        "date": "2025-04-28",
        "price": 13.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-30",
        "price": 14.18,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.01,
        "hold_days": 2
      }
    ]
  },
  "600490": {
    "daily": [
      {
        "date": "2025-04-28",
        "price": 5.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-04-30",
        "price": 4.81,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.18,
        "hold_days": 2
      }
    ]
  },
  "603351": {
    "daily": [
      {
        "date": "2025-04-28",
        "price": 30.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-07",
        "price": 27.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.55,
        "hold_days": 9
      }
    ]
  },
  "002846": {
    "daily": [
      {
        "date": "2025-04-28",
        "price": 9.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-13",
        "price": 10.49,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.3,
        "hold_days": 15
      }
    ]
  },
  "920663": {
    "daily": [
      {
        "date": "2025-04-29",
        "price": 20.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-07",
        "price": 21.94,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.58,
        "hold_days": 8
      }
    ]
  },
  "002696": {
    "daily": [
      {
        "date": "2025-04-29",
        "price": 5.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-15",
        "price": 6.06,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.99,
        "hold_days": 16
      },
      {
        "date": "2025-11-19",
        "price": 7.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-25",
        "price": 7.01,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.38,
        "hold_days": 6
      }
    ]
  },
  "603767": {
    "daily": [
      {
        "date": "2025-04-30",
        "price": 15.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-09",
        "price": 15.37,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.4,
        "hold_days": 9
      }
    ]
  },
  "603893": {
    "daily": [
      {
        "date": "2025-04-30",
        "price": 169.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-14",
        "price": 164.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.23,
        "hold_days": 14
      }
    ]
  },
  "001287": {
    "daily": [
      {
        "date": "2025-04-30",
        "price": 19.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-16",
        "price": 18.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.3,
        "hold_days": 16
      }
    ]
  },
  "002100": {
    "daily": [
      {
        "date": "2025-04-30",
        "price": 6.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-23",
        "price": 6.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.47,
        "hold_days": 23
      }
    ]
  },
  "002510": {
    "daily": [
      {
        "date": "2025-05-07",
        "price": 5.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-12",
        "price": 6.02,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.38,
        "hold_days": 5
      },
      {
        "date": "2025-09-09",
        "price": 7.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-19",
        "price": 6.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.39,
        "hold_days": 10
      },
      {
        "date": "2025-09-26",
        "price": 7.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-14",
        "price": 6.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.17,
        "hold_days": 18
      },
      {
        "date": "2025-12-18",
        "price": 7.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-30",
        "price": 7.43,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.77,
        "hold_days": 12
      },
      {
        "date": "2026-01-08",
        "price": 7.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-12",
        "price": 7.93,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.8,
        "hold_days": 4
      },
      {
        "date": "2026-01-16",
        "price": 8.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-27",
        "price": 7.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.09,
        "hold_days": 11
      }
    ]
  },
  "600371": {
    "daily": [
      {
        "date": "2025-05-07",
        "price": 9.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-13",
        "price": 9.07,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.78,
        "hold_days": 6
      }
    ]
  },
  "600981": {
    "daily": [
      {
        "date": "2025-05-07",
        "price": 2.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-16",
        "price": 2.66,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.92,
        "hold_days": 9
      }
    ]
  },
  "301000": {
    "daily": [
      {
        "date": "2025-05-08",
        "price": 55.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-14",
        "price": 51.49,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.48,
        "hold_days": 6
      }
    ]
  },
  "920892": {
    "daily": [
      {
        "date": "2025-05-08",
        "price": 16.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-19",
        "price": 16.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.12,
        "hold_days": 11
      }
    ]
  },
  "603983": {
    "daily": [
      {
        "date": "2025-05-09",
        "price": 47.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-19",
        "price": 52.18,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.09,
        "hold_days": 10
      }
    ]
  },
  "300885": {
    "daily": [
      {
        "date": "2025-05-12",
        "price": 14.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-22",
        "price": 13.33,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.39,
        "hold_days": 10
      },
      {
        "date": "2025-08-25",
        "price": 27.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-26",
        "price": 24.9,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.82,
        "hold_days": 1
      },
      {
        "date": "2025-12-04",
        "price": 25.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-08",
        "price": 27.1,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.98,
        "hold_days": 4
      }
    ]
  },
  "300680": {
    "daily": [
      {
        "date": "2025-05-13",
        "price": 45.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-14",
        "price": 43.77,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.8,
        "hold_days": 1
      }
    ]
  },
  "002094": {
    "daily": [
      {
        "date": "2025-05-13",
        "price": 8.15,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-15",
        "price": 8.48,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.05,
        "hold_days": 2
      }
    ]
  },
  "301603": {
    "daily": [
      {
        "date": "2025-05-13",
        "price": 52.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-21",
        "price": 53.17,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.99,
        "hold_days": 8
      },
      {
        "date": "2025-09-10",
        "price": 77.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-18",
        "price": 83.09,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.55,
        "hold_days": 8
      }
    ]
  },
  "002819": {
    "daily": [
      {
        "date": "2025-05-14",
        "price": 32.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-19",
        "price": 37.02,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.66,
        "hold_days": 5
      },
      {
        "date": "2026-01-12",
        "price": 30.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-20",
        "price": 29.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.87,
        "hold_days": 8
      }
    ]
  },
  "603308": {
    "daily": [
      {
        "date": "2025-05-14",
        "price": 20.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-27",
        "price": 19.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.43,
        "hold_days": 13
      },
      {
        "date": "2025-08-12",
        "price": 27.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-21",
        "price": 27.96,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.67,
        "hold_days": 9
      },
      {
        "date": "2026-03-24",
        "price": 61.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-02",
        "price": 63.53,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.92,
        "hold_days": 9
      }
    ]
  },
  "603616": {
    "daily": [
      {
        "date": "2025-05-15",
        "price": 3.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-19",
        "price": 3.91,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.82,
        "hold_days": 4
      },
      {
        "date": "2025-05-19",
        "price": 3.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-11",
        "price": 4.21,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.67,
        "hold_days": 23
      }
    ]
  },
  "002278": {
    "daily": [
      {
        "date": "2025-05-15",
        "price": 8.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-21",
        "price": 8.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.3,
        "hold_days": 6
      }
    ]
  },
  "920106": {
    "daily": [
      {
        "date": "2025-05-15",
        "price": 104.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-23",
        "price": 98.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.0,
        "hold_days": 8
      }
    ]
  },
  "002910": {
    "daily": [
      {
        "date": "2025-05-16",
        "price": 9.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-22",
        "price": 9.21,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.54,
        "hold_days": 6
      }
    ]
  },
  "000055": {
    "daily": [
      {
        "date": "2025-05-16",
        "price": 4.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-23",
        "price": 4.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.2,
        "hold_days": 7
      }
    ]
  },
  "000677": {
    "daily": [
      {
        "date": "2025-05-19",
        "price": 5.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-20",
        "price": 6.12,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.07,
        "hold_days": 1
      }
    ]
  },
  "002194": {
    "daily": [
      {
        "date": "2025-05-19",
        "price": 15.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-23",
        "price": 13.39,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.11,
        "hold_days": 4
      },
      {
        "date": "2026-01-14",
        "price": 15.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-19",
        "price": 13.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.3,
        "hold_days": 5
      }
    ]
  },
  "002389": {
    "daily": [
      {
        "date": "2025-05-20",
        "price": 21.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-21",
        "price": 20.59,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.69,
        "hold_days": 1
      }
    ]
  },
  "000837": {
    "daily": [
      {
        "date": "2025-05-20",
        "price": 13.46,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-21",
        "price": 12.94,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.86,
        "hold_days": 1
      }
    ]
  },
  "688580": {
    "daily": [
      {
        "date": "2025-05-21",
        "price": 47.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-22",
        "price": 44.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.81,
        "hold_days": 1
      }
    ]
  },
  "300920": {
    "daily": [
      {
        "date": "2025-05-21",
        "price": 34.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-23",
        "price": 40.69,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.59,
        "hold_days": 2
      }
    ]
  },
  "001367": {
    "daily": [
      {
        "date": "2025-05-21",
        "price": 20.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-27",
        "price": 23.94,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 15.65,
        "hold_days": 6
      }
    ]
  },
  "600249": {
    "daily": [
      {
        "date": "2025-05-22",
        "price": 6.27,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-23",
        "price": 5.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.58,
        "hold_days": 1
      }
    ]
  },
  "300824": {
    "daily": [
      {
        "date": "2025-05-22",
        "price": 12.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-26",
        "price": 11.73,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.0,
        "hold_days": 4
      }
    ]
  },
  "600562": {
    "daily": [
      {
        "date": "2025-05-22",
        "price": 26.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-06",
        "price": 25.91,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.54,
        "hold_days": 15
      }
    ]
  },
  "688719": {
    "daily": [
      {
        "date": "2025-05-23",
        "price": 34.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-27",
        "price": 34.18,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -0.9,
        "hold_days": 4
      },
      {
        "date": "2025-10-27",
        "price": 40.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-06",
        "price": 39.47,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.25,
        "hold_days": 10
      }
    ]
  },
  "605388": {
    "daily": [
      {
        "date": "2025-05-26",
        "price": 6.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-30",
        "price": 8.72,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 26.19,
        "hold_days": 4
      }
    ]
  },
  "000903": {
    "daily": [
      {
        "date": "2025-05-26",
        "price": 4.17,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-03",
        "price": 4.88,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 17.03,
        "hold_days": 8
      }
    ]
  },
  "300858": {
    "daily": [
      {
        "date": "2025-05-27",
        "price": 17.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-29",
        "price": 16.65,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.53,
        "hold_days": 2
      },
      {
        "date": "2025-08-01",
        "price": 20.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-04",
        "price": 22.66,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.08,
        "hold_days": 3
      }
    ]
  },
  "300575": {
    "daily": [
      {
        "date": "2025-05-27",
        "price": 7.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-29",
        "price": 7.21,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.26,
        "hold_days": 2
      }
    ]
  },
  "002640": {
    "daily": [
      {
        "date": "2025-05-27",
        "price": 4.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-30",
        "price": 4.85,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.62,
        "hold_days": 3
      }
    ]
  },
  "688128": {
    "daily": [
      {
        "date": "2025-05-27",
        "price": 24.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-03",
        "price": 23.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.07,
        "hold_days": 7
      }
    ]
  },
  "301057": {
    "daily": [
      {
        "date": "2025-05-27",
        "price": 16.55,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-12",
        "price": 16.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.97,
        "hold_days": 16
      }
    ]
  },
  "000639": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 3.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-29",
        "price": 3.37,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.32,
        "hold_days": 1
      }
    ]
  },
  "300631": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 23.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-05-30",
        "price": 22.15,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.5,
        "hold_days": 2
      }
    ]
  },
  "002342": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 5.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-03",
        "price": 5.79,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.58,
        "hold_days": 6
      }
    ]
  },
  "600612": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 52.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-06",
        "price": 48.34,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.5,
        "hold_days": 9
      }
    ]
  },
  "688336": {
    "daily": [
      {
        "date": "2025-05-29",
        "price": 60.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-03",
        "price": 58.48,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.47,
        "hold_days": 5
      },
      {
        "date": "2025-06-24",
        "price": 55.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-09",
        "price": 53.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.5,
        "hold_days": 15
      }
    ]
  },
  "300485": {
    "daily": [
      {
        "date": "2025-05-29",
        "price": 10.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-05",
        "price": 10.16,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.39,
        "hold_days": 7
      },
      {
        "date": "2025-06-20",
        "price": 13.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-26",
        "price": 12.93,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -7.25,
        "hold_days": 6
      },
      {
        "date": "2025-07-18",
        "price": 14.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-22",
        "price": 16.63,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.52,
        "hold_days": 4
      }
    ]
  },
  "300434": {
    "daily": [
      {
        "date": "2025-05-30",
        "price": 10.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-03",
        "price": 10.31,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.59,
        "hold_days": 4
      },
      {
        "date": "2025-06-10",
        "price": 10.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-11",
        "price": 10.18,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.45,
        "hold_days": 1
      }
    ]
  },
  "002310": {
    "daily": [
      {
        "date": "2025-05-30",
        "price": 2.37,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-04",
        "price": 2.34,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.27,
        "hold_days": 5
      },
      {
        "date": "2025-06-17",
        "price": 2.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-02",
        "price": 2.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.29,
        "hold_days": 15
      }
    ]
  },
  "002419": {
    "daily": [
      {
        "date": "2025-05-30",
        "price": 5.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-31",
        "price": 5.65,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.73,
        "hold_days": 62
      }
    ]
  },
  "000989": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 9.35,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-04",
        "price": 10.29,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.05,
        "hold_days": 1
      },
      {
        "date": "2025-08-01",
        "price": 11.63,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-20",
        "price": 11.83,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.72,
        "hold_days": 19
      }
    ]
  },
  "002682": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 5.46,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-05",
        "price": 5.08,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.96,
        "hold_days": 2
      },
      {
        "date": "2025-06-18",
        "price": 4.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-03",
        "price": 4.99,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.04,
        "hold_days": 15
      },
      {
        "date": "2026-03-03",
        "price": 7.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-05",
        "price": 6.68,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.91,
        "hold_days": 2
      }
    ]
  },
  "603836": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 13.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-12",
        "price": 13.57,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.52,
        "hold_days": 9
      }
    ]
  },
  "002297": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 7.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-17",
        "price": 7.61,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.7,
        "hold_days": 14
      },
      {
        "date": "2025-08-07",
        "price": 9.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 9.15,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.88,
        "hold_days": 20
      },
      {
        "date": "2026-01-27",
        "price": 12.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-28",
        "price": 12.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.61,
        "hold_days": 1
      }
    ]
  },
  "001255": {
    "daily": [
      {
        "date": "2025-06-04",
        "price": 30.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-05",
        "price": 30.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.99,
        "hold_days": 1
      },
      {
        "date": "2025-07-14",
        "price": 33.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-18",
        "price": 31.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.36,
        "hold_days": 4
      },
      {
        "date": "2025-11-04",
        "price": 36.17,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-05",
        "price": 39.79,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.01,
        "hold_days": 1
      },
      {
        "date": "2026-01-06",
        "price": 35.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-07",
        "price": 34.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.8,
        "hold_days": 1
      },
      {
        "date": "2026-02-02",
        "price": 40.43,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-25",
        "price": 41.05,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.53,
        "hold_days": 23
      }
    ]
  },
  "000507": {
    "daily": [
      {
        "date": "2025-06-04",
        "price": 5.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-12",
        "price": 5.56,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.28,
        "hold_days": 8
      }
    ]
  },
  "002086": {
    "daily": [
      {
        "date": "2025-06-04",
        "price": 2.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-17",
        "price": 2.67,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.32,
        "hold_days": 13
      },
      {
        "date": "2025-07-30",
        "price": 2.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-08",
        "price": 2.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.06,
        "hold_days": 9
      },
      {
        "date": "2025-11-19",
        "price": 2.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-21",
        "price": 2.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -7.38,
        "hold_days": 2
      }
    ]
  },
  "000665": {
    "daily": [
      {
        "date": "2025-06-05",
        "price": 5.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-09",
        "price": 5.77,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.91,
        "hold_days": 4
      },
      {
        "date": "2025-08-21",
        "price": 6.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-28",
        "price": 6.61,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.98,
        "hold_days": 7
      }
    ]
  },
  "603585": {
    "daily": [
      {
        "date": "2025-06-05",
        "price": 17.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-10",
        "price": 19.73,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.85,
        "hold_days": 5
      }
    ]
  },
  "301026": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 25.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-10",
        "price": 26.25,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.14,
        "hold_days": 4
      },
      {
        "date": "2025-08-28",
        "price": 30.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-03",
        "price": 28.89,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.44,
        "hold_days": 6
      },
      {
        "date": "2025-09-09",
        "price": 30.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-18",
        "price": 28.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.28,
        "hold_days": 9
      },
      {
        "date": "2026-02-11",
        "price": 33.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 33.98,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.03,
        "hold_days": 20
      }
    ]
  },
  "605033": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 21.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-10",
        "price": 20.85,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.75,
        "hold_days": 4
      },
      {
        "date": "2025-06-12",
        "price": 22.25,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-17",
        "price": 22.89,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.88,
        "hold_days": 5
      }
    ]
  },
  "688600": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 21.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-11",
        "price": 22.97,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.64,
        "hold_days": 5
      },
      {
        "date": "2025-06-16",
        "price": 24.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-19",
        "price": 22.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.26,
        "hold_days": 3
      },
      {
        "date": "2025-12-24",
        "price": 23.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-31",
        "price": 25.05,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.72,
        "hold_days": 7
      }
    ]
  },
  "300313": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 6.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-13",
        "price": 6.2,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.77,
        "hold_days": 7
      },
      {
        "date": "2025-06-16",
        "price": 6.86,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-07",
        "price": 7.56,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.2,
        "hold_days": 21
      },
      {
        "date": "2025-11-27",
        "price": 9.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-04",
        "price": 9.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.02,
        "hold_days": 7
      }
    ]
  },
  "002440": {
    "daily": [
      {
        "date": "2025-06-09",
        "price": 7.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-11",
        "price": 7.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.4,
        "hold_days": 2
      }
    ]
  },
  "002038": {
    "daily": [
      {
        "date": "2025-06-09",
        "price": 7.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-18",
        "price": 7.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.83,
        "hold_days": 9
      }
    ]
  },
  "301301": {
    "daily": [
      {
        "date": "2025-06-10",
        "price": 12.76,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-13",
        "price": 12.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.47,
        "hold_days": 3
      }
    ]
  },
  "601083": {
    "daily": [
      {
        "date": "2025-06-10",
        "price": 11.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-16",
        "price": 11.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.07,
        "hold_days": 6
      },
      {
        "date": "2026-03-16",
        "price": 12.27,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 11.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.02,
        "hold_days": 4
      },
      {
        "date": "2026-03-26",
        "price": 12.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-31",
        "price": 11.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.13,
        "hold_days": 5
      }
    ]
  },
  "002615": {
    "daily": [
      {
        "date": "2025-06-11",
        "price": 8.47,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-12",
        "price": 9.32,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.04,
        "hold_days": 1
      }
    ]
  },
  "001234": {
    "daily": [
      {
        "date": "2025-06-11",
        "price": 23.86,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-13",
        "price": 21.22,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.06,
        "hold_days": 2
      }
    ]
  },
  "002755": {
    "daily": [
      {
        "date": "2025-06-12",
        "price": 18.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-16",
        "price": 17.94,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.13,
        "hold_days": 4
      }
    ]
  },
  "002731": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 15.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-16",
        "price": 17.19,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.05,
        "hold_days": 3
      }
    ]
  },
  "300875": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 31.43,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-16",
        "price": 37.72,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.01,
        "hold_days": 3
      },
      {
        "date": "2025-07-01",
        "price": 46.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-03",
        "price": 43.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.99,
        "hold_days": 2
      }
    ]
  },
  "300483": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 10.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-18",
        "price": 11.15,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.46,
        "hold_days": 5
      },
      {
        "date": "2025-11-28",
        "price": 15.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-04",
        "price": 15.55,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.51,
        "hold_days": 6
      }
    ]
  },
  "601718": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 2.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-19",
        "price": 3.11,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.36,
        "hold_days": 6
      }
    ]
  },
  "002490": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 4.35,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-24",
        "price": 6.95,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 59.77,
        "hold_days": 11
      }
    ]
  },
  "002828": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 10.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-25",
        "price": 10.57,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 5.28,
        "hold_days": 12
      },
      {
        "date": "2025-11-12",
        "price": 12.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-21",
        "price": 10.9,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.51,
        "hold_days": 9
      },
      {
        "date": "2026-02-24",
        "price": 13.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-05",
        "price": 14.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.41,
        "hold_days": 9
      },
      {
        "date": "2026-03-17",
        "price": 14.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 12.37,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.96,
        "hold_days": 3
      }
    ]
  },
  "000506": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 9.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-01",
        "price": 9.49,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.74,
        "hold_days": 18
      }
    ]
  },
  "300130": {
    "daily": [
      {
        "date": "2025-06-16",
        "price": 27.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-18",
        "price": 27.62,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.54,
        "hold_days": 2
      },
      {
        "date": "2025-07-07",
        "price": 35.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-14",
        "price": 32.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.48,
        "hold_days": 7
      }
    ]
  },
  "300531": {
    "daily": [
      {
        "date": "2025-06-16",
        "price": 17.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-19",
        "price": 18.0,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.27,
        "hold_days": 3
      }
    ]
  },
  "920866": {
    "daily": [
      {
        "date": "2025-06-17",
        "price": 11.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-19",
        "price": 10.18,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.39,
        "hold_days": 2
      }
    ]
  },
  "002391": {
    "daily": [
      {
        "date": "2025-06-17",
        "price": 6.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-19",
        "price": 5.99,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.24,
        "hold_days": 2
      }
    ]
  },
  "301330": {
    "daily": [
      {
        "date": "2025-06-17",
        "price": 27.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-20",
        "price": 24.74,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.39,
        "hold_days": 3
      }
    ]
  },
  "002519": {
    "daily": [
      {
        "date": "2025-06-18",
        "price": 5.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-19",
        "price": 5.02,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.02,
        "hold_days": 1
      }
    ]
  },
  "002055": {
    "daily": [
      {
        "date": "2025-06-18",
        "price": 6.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-27",
        "price": 7.27,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.15,
        "hold_days": 9
      },
      {
        "date": "2025-07-16",
        "price": 7.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-23",
        "price": 7.18,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.42,
        "hold_days": 7
      }
    ]
  },
  "001296": {
    "daily": [
      {
        "date": "2025-06-19",
        "price": 19.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-24",
        "price": 19.31,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 0.63,
        "hold_days": 5
      }
    ]
  },
  "600871": {
    "daily": [
      {
        "date": "2025-06-19",
        "price": 2.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-24",
        "price": 1.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.31,
        "hold_days": 5
      }
    ]
  },
  "605580": {
    "daily": [
      {
        "date": "2025-06-19",
        "price": 12.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-27",
        "price": 13.63,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.9,
        "hold_days": 8
      }
    ]
  },
  "601908": {
    "daily": [
      {
        "date": "2025-06-20",
        "price": 3.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-09",
        "price": 3.49,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.76,
        "hold_days": 19
      },
      {
        "date": "2025-07-10",
        "price": 3.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-15",
        "price": 4.23,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 10.16,
        "hold_days": 5
      },
      {
        "date": "2025-07-23",
        "price": 4.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-04",
        "price": 4.11,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.24,
        "hold_days": 43
      },
      {
        "date": "2026-03-31",
        "price": 5.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-03",
        "price": 4.5,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.18,
        "hold_days": 3
      }
    ]
  },
  "688201": {
    "daily": [
      {
        "date": "2025-06-24",
        "price": 10.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-26",
        "price": 13.19,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.46,
        "hold_days": 2
      },
      {
        "date": "2025-07-11",
        "price": 12.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-23",
        "price": 11.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.89,
        "hold_days": 12
      }
    ]
  },
  "688068": {
    "daily": [
      {
        "date": "2025-06-24",
        "price": 144.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-02",
        "price": 147.07,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.74,
        "hold_days": 8
      },
      {
        "date": "2025-07-28",
        "price": 194.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-01",
        "price": 216.5,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.37,
        "hold_days": 4
      }
    ]
  },
  "688202": {
    "daily": [
      {
        "date": "2025-06-24",
        "price": 34.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-04",
        "price": 38.82,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.71,
        "hold_days": 10
      }
    ]
  },
  "002952": {
    "daily": [
      {
        "date": "2025-06-24",
        "price": 22.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-10",
        "price": 20.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.01,
        "hold_days": 16
      }
    ]
  },
  "600816": {
    "daily": [
      {
        "date": "2025-06-25",
        "price": 2.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-06-30",
        "price": 2.95,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.67,
        "hold_days": 5
      }
    ]
  },
  "300333": {
    "daily": [
      {
        "date": "2025-06-25",
        "price": 16.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-02",
        "price": 15.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.71,
        "hold_days": 7
      },
      {
        "date": "2025-07-07",
        "price": 16.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-10",
        "price": 14.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.44,
        "hold_days": 3
      }
    ]
  },
  "300082": {
    "daily": [
      {
        "date": "2025-06-25",
        "price": 7.63,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-08",
        "price": 7.43,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.62,
        "hold_days": 13
      },
      {
        "date": "2026-03-27",
        "price": 10.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-30",
        "price": 10.8,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.28,
        "hold_days": 3
      },
      {
        "date": "2026-04-22",
        "price": 12.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-27",
        "price": 13.41,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.64,
        "hold_days": 5
      }
    ]
  },
  "002246": {
    "daily": [
      {
        "date": "2025-06-26",
        "price": 13.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-01",
        "price": 15.27,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.11,
        "hold_days": 5
      }
    ]
  },
  "000701": {
    "daily": [
      {
        "date": "2025-06-26",
        "price": 6.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-01",
        "price": 6.45,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 5.74,
        "hold_days": 5
      }
    ]
  },
  "301063": {
    "daily": [
      {
        "date": "2025-06-26",
        "price": 29.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-03",
        "price": 29.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.37,
        "hold_days": 7
      }
    ]
  },
  "002951": {
    "daily": [
      {
        "date": "2025-06-27",
        "price": 14.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-01",
        "price": 13.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.1,
        "hold_days": 4
      }
    ]
  },
  "002384": {
    "daily": [
      {
        "date": "2025-06-27",
        "price": 37.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-01",
        "price": 41.55,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.56,
        "hold_days": 4
      },
      {
        "date": "2025-11-06",
        "price": 75.46,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-21",
        "price": 64.73,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -14.22,
        "hold_days": 15
      }
    ]
  },
  "002629": {
    "daily": [
      {
        "date": "2025-06-27",
        "price": 6.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-01",
        "price": 6.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.5,
        "hold_days": 4
      }
    ]
  },
  "600794": {
    "daily": [
      {
        "date": "2025-06-30",
        "price": 5.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-03",
        "price": 5.15,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.38,
        "hold_days": 3
      }
    ]
  },
  "002741": {
    "daily": [
      {
        "date": "2025-07-01",
        "price": 21.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-02",
        "price": 20.21,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.67,
        "hold_days": 1
      },
      {
        "date": "2025-09-30",
        "price": 22.17,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-10",
        "price": 21.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.92,
        "hold_days": 10
      }
    ]
  },
  "603823": {
    "daily": [
      {
        "date": "2025-07-01",
        "price": 14.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-03",
        "price": 14.63,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.96,
        "hold_days": 2
      },
      {
        "date": "2025-08-26",
        "price": 15.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-03",
        "price": 14.68,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.78,
        "hold_days": 8
      }
    ]
  },
  "600714": {
    "daily": [
      {
        "date": "2025-07-01",
        "price": 12.15,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-15",
        "price": 11.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.47,
        "hold_days": 14
      }
    ]
  },
  "000822": {
    "daily": [
      {
        "date": "2025-07-01",
        "price": 5.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-15",
        "price": 5.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.85,
        "hold_days": 14
      }
    ]
  },
  "688353": {
    "daily": [
      {
        "date": "2025-07-02",
        "price": 34.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-03",
        "price": 39.8,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 15.36,
        "hold_days": 1
      },
      {
        "date": "2025-09-29",
        "price": 44.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-09",
        "price": 47.56,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.38,
        "hold_days": 10
      },
      {
        "date": "2025-10-20",
        "price": 48.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-21",
        "price": 45.47,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.37,
        "hold_days": 1
      },
      {
        "date": "2025-10-30",
        "price": 46.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-03",
        "price": 47.18,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.81,
        "hold_days": 4
      }
    ]
  },
  "300164": {
    "daily": [
      {
        "date": "2025-07-02",
        "price": 6.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-22",
        "price": 5.44,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.08,
        "hold_days": 20
      },
      {
        "date": "2026-02-09",
        "price": 12.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-10",
        "price": 11.74,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.45,
        "hold_days": 1
      },
      {
        "date": "2026-03-17",
        "price": 20.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-18",
        "price": 18.81,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.15,
        "hold_days": 1
      },
      {
        "date": "2026-03-19",
        "price": 20.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 19.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.82,
        "hold_days": 1
      },
      {
        "date": "2026-03-23",
        "price": 20.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-24",
        "price": 18.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.87,
        "hold_days": 1
      }
    ]
  },
  "600467": {
    "daily": [
      {
        "date": "2025-07-02",
        "price": 2.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-19",
        "price": 2.51,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.4,
        "hold_days": 79
      },
      {
        "date": "2025-12-03",
        "price": 2.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-08",
        "price": 2.94,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.68,
        "hold_days": 5
      }
    ]
  },
  "301150": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 23.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-07",
        "price": 23.3,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.47,
        "hold_days": 4
      },
      {
        "date": "2025-09-15",
        "price": 43.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-26",
        "price": 37.7,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -14.16,
        "hold_days": 11
      },
      {
        "date": "2026-03-26",
        "price": 52.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-31",
        "price": 55.93,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.11,
        "hold_days": 5
      }
    ]
  },
  "002721": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 3.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-07",
        "price": 4.42,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 21.1,
        "hold_days": 4
      }
    ]
  },
  "300591": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 11.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-08",
        "price": 12.7,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.77,
        "hold_days": 5
      }
    ]
  },
  "688359": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 58.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-14",
        "price": 59.25,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.07,
        "hold_days": 11
      },
      {
        "date": "2025-08-26",
        "price": 73.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-22",
        "price": 68.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.05,
        "hold_days": 27
      },
      {
        "date": "2026-03-16",
        "price": 93.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-19",
        "price": 78.5,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -16.04,
        "hold_days": 3
      }
    ]
  },
  "002980": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 20.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-14",
        "price": 19.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.73,
        "hold_days": 11
      }
    ]
  },
  "000016": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 5.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-15",
        "price": 4.98,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.23,
        "hold_days": 12
      },
      {
        "date": "2025-09-12",
        "price": 5.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 5.36,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.07,
        "hold_days": 11
      }
    ]
  },
  "300468": {
    "daily": [
      {
        "date": "2025-07-04",
        "price": 47.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-09",
        "price": 48.22,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.14,
        "hold_days": 5
      }
    ]
  },
  "002467": {
    "daily": [
      {
        "date": "2025-07-04",
        "price": 6.47,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-10",
        "price": 6.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.86,
        "hold_days": 6
      }
    ]
  },
  "300537": {
    "daily": [
      {
        "date": "2025-07-07",
        "price": 28.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-08",
        "price": 27.34,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.39,
        "hold_days": 1
      }
    ]
  },
  "603032": {
    "daily": [
      {
        "date": "2025-07-07",
        "price": 17.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-09",
        "price": 17.05,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.12,
        "hold_days": 2
      }
    ]
  },
  "300059": {
    "daily": [
      {
        "date": "2025-07-08",
        "price": 23.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-14",
        "price": 23.52,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.04,
        "hold_days": 6
      }
    ]
  },
  "002865": {
    "daily": [
      {
        "date": "2025-07-08",
        "price": 42.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-14",
        "price": 43.62,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.18,
        "hold_days": 6
      },
      {
        "date": "2025-07-21",
        "price": 44.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-28",
        "price": 45.7,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.72,
        "hold_days": 7
      },
      {
        "date": "2025-12-24",
        "price": 49.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-26",
        "price": 54.87,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.96,
        "hold_days": 2
      },
      {
        "date": "2026-01-06",
        "price": 57.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-08",
        "price": 68.53,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 18.22,
        "hold_days": 2
      },
      {
        "date": "2026-01-22",
        "price": 90.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-23",
        "price": 99.44,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.0,
        "hold_days": 1
      }
    ]
  },
  "002565": {
    "daily": [
      {
        "date": "2025-07-08",
        "price": 6.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-14",
        "price": 6.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.96,
        "hold_days": 6
      },
      {
        "date": "2025-09-09",
        "price": 7.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-12",
        "price": 7.63,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 4.52,
        "hold_days": 3
      },
      {
        "date": "2025-12-18",
        "price": 16.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-22",
        "price": 15.7,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.93,
        "hold_days": 4
      }
    ]
  },
  "688529": {
    "daily": [
      {
        "date": "2025-07-09",
        "price": 21.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-11",
        "price": 22.68,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.49,
        "hold_days": 2
      }
    ]
  },
  "000900": {
    "daily": [
      {
        "date": "2025-07-09",
        "price": 4.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-17",
        "price": 4.41,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.56,
        "hold_days": 8
      }
    ]
  },
  "603203": {
    "daily": [
      {
        "date": "2025-07-09",
        "price": 25.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-30",
        "price": 26.21,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.82,
        "hold_days": 21
      },
      {
        "date": "2026-01-07",
        "price": 37.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-13",
        "price": 36.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.04,
        "hold_days": 6
      },
      {
        "date": "2026-01-15",
        "price": 37.15,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-20",
        "price": 37.12,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.08,
        "hold_days": 5
      }
    ]
  },
  "300169": {
    "daily": [
      {
        "date": "2025-07-09",
        "price": 8.82,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 8.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.18,
        "hold_days": 49
      }
    ]
  },
  "600110": {
    "daily": [
      {
        "date": "2025-07-10",
        "price": 6.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-07",
        "price": 6.16,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.99,
        "hold_days": 28
      },
      {
        "date": "2025-08-08",
        "price": 6.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-11",
        "price": 6.29,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.96,
        "hold_days": 3
      },
      {
        "date": "2025-08-13",
        "price": 6.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-21",
        "price": 7.23,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 12.97,
        "hold_days": 8
      },
      {
        "date": "2025-09-01",
        "price": 7.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-08",
        "price": 7.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.92,
        "hold_days": 7
      }
    ]
  },
  "688707": {
    "daily": [
      {
        "date": "2025-07-11",
        "price": 13.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-15",
        "price": 13.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.26,
        "hold_days": 4
      },
      {
        "date": "2026-04-28",
        "price": 17.31,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-29",
        "price": 17.19,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.69,
        "hold_days": 1
      }
    ]
  },
  "688498": {
    "daily": [
      {
        "date": "2025-07-14",
        "price": 198.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-17",
        "price": 222.61,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.12,
        "hold_days": 3
      },
      {
        "date": "2025-09-29",
        "price": 410.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-09",
        "price": 411.9,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.41,
        "hold_days": 10
      },
      {
        "date": "2026-01-07",
        "price": 700.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-12",
        "price": 707.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.9,
        "hold_days": 5
      }
    ]
  },
  "603685": {
    "daily": [
      {
        "date": "2025-07-14",
        "price": 13.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-21",
        "price": 15.14,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.11,
        "hold_days": 7
      },
      {
        "date": "2025-09-22",
        "price": 18.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 17.99,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.64,
        "hold_days": 1
      }
    ]
  },
  "002048": {
    "daily": [
      {
        "date": "2025-07-14",
        "price": 18.35,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-28",
        "price": 20.36,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.95,
        "hold_days": 14
      }
    ]
  },
  "002281": {
    "daily": [
      {
        "date": "2025-07-15",
        "price": 48.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-01",
        "price": 50.16,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.89,
        "hold_days": 17
      },
      {
        "date": "2026-01-07",
        "price": 71.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-13",
        "price": 70.11,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.5,
        "hold_days": 6
      },
      {
        "date": "2026-01-14",
        "price": 77.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-16",
        "price": 76.5,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.8,
        "hold_days": 2
      }
    ]
  },
  "603980": {
    "daily": [
      {
        "date": "2025-07-16",
        "price": 5.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-18",
        "price": 5.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.53,
        "hold_days": 2
      }
    ]
  },
  "600645": {
    "daily": [
      {
        "date": "2025-07-17",
        "price": 26.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-25",
        "price": 26.81,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.79,
        "hold_days": 8
      }
    ]
  },
  "301326": {
    "daily": [
      {
        "date": "2025-07-17",
        "price": 76.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-01",
        "price": 80.0,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.64,
        "hold_days": 15
      },
      {
        "date": "2025-10-13",
        "price": 134.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-15",
        "price": 127.27,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.02,
        "hold_days": 2
      }
    ]
  },
  "000617": {
    "daily": [
      {
        "date": "2025-07-18",
        "price": 9.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-25",
        "price": 8.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.67,
        "hold_days": 7
      },
      {
        "date": "2025-09-11",
        "price": 11.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-16",
        "price": 10.97,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.99,
        "hold_days": 35
      },
      {
        "date": "2026-03-23",
        "price": 10.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-26",
        "price": 10.24,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.39,
        "hold_days": 3
      }
    ]
  },
  "300215": {
    "daily": [
      {
        "date": "2025-07-21",
        "price": 5.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-22",
        "price": 7.04,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 19.93,
        "hold_days": 1
      },
      {
        "date": "2026-02-12",
        "price": 9.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-26",
        "price": 10.15,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.86,
        "hold_days": 14
      },
      {
        "date": "2026-03-05",
        "price": 10.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-06",
        "price": 10.68,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.37,
        "hold_days": 1
      }
    ]
  },
  "601005": {
    "daily": [
      {
        "date": "2025-07-21",
        "price": 1.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-23",
        "price": 1.6,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.91,
        "hold_days": 2
      }
    ]
  },
  "920570": {
    "daily": [
      {
        "date": "2025-07-22",
        "price": 43.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-23",
        "price": 42.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.86,
        "hold_days": 1
      }
    ]
  },
  "605122": {
    "daily": [
      {
        "date": "2025-07-22",
        "price": 17.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-23",
        "price": 15.35,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.81,
        "hold_days": 1
      }
    ]
  },
  "920790": {
    "daily": [
      {
        "date": "2025-07-22",
        "price": 49.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-25",
        "price": 50.56,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.74,
        "hold_days": 3
      },
      {
        "date": "2025-09-11",
        "price": 49.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-18",
        "price": 48.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.74,
        "hold_days": 7
      }
    ]
  },
  "688210": {
    "daily": [
      {
        "date": "2025-07-23",
        "price": 27.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-24",
        "price": 33.49,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 19.99,
        "hold_days": 1
      },
      {
        "date": "2025-08-01",
        "price": 36.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-06",
        "price": 42.99,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 18.76,
        "hold_days": 5
      },
      {
        "date": "2025-08-22",
        "price": 43.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-25",
        "price": 41.03,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.58,
        "hold_days": 3
      },
      {
        "date": "2025-08-28",
        "price": 42.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 42.5,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.64,
        "hold_days": 5
      },
      {
        "date": "2025-09-23",
        "price": 56.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-24",
        "price": 62.78,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.23,
        "hold_days": 1
      },
      {
        "date": "2025-10-21",
        "price": 52.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-30",
        "price": 58.58,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.44,
        "hold_days": 9
      }
    ]
  },
  "300500": {
    "daily": [
      {
        "date": "2025-07-24",
        "price": 14.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-25",
        "price": 13.54,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.81,
        "hold_days": 1
      }
    ]
  },
  "600807": {
    "daily": [
      {
        "date": "2025-07-24",
        "price": 3.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-28",
        "price": 3.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.62,
        "hold_days": 4
      }
    ]
  },
  "002628": {
    "daily": [
      {
        "date": "2025-07-24",
        "price": 5.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-19",
        "price": 5.17,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.9,
        "hold_days": 26
      }
    ]
  },
  "301285": {
    "daily": [
      {
        "date": "2025-07-25",
        "price": 39.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-28",
        "price": 44.3,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.42,
        "hold_days": 3
      },
      {
        "date": "2025-08-06",
        "price": 45.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-11",
        "price": 51.6,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.06,
        "hold_days": 5
      },
      {
        "date": "2025-08-25",
        "price": 50.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 48.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.36,
        "hold_days": 2
      },
      {
        "date": "2025-08-28",
        "price": 50.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 49.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.83,
        "hold_days": 5
      },
      {
        "date": "2025-09-16",
        "price": 51.63,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-14",
        "price": 46.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.86,
        "hold_days": 28
      },
      {
        "date": "2025-10-21",
        "price": 49.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-23",
        "price": 47.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.52,
        "hold_days": 2
      }
    ]
  },
  "002437": {
    "daily": [
      {
        "date": "2025-07-25",
        "price": 3.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-28",
        "price": 3.4,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.29,
        "hold_days": 3
      }
    ]
  },
  "300357": {
    "daily": [
      {
        "date": "2025-07-25",
        "price": 24.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-30",
        "price": 25.44,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.7,
        "hold_days": 5
      }
    ]
  },
  "603811": {
    "daily": [
      {
        "date": "2025-07-25",
        "price": 11.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-01",
        "price": 12.23,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.6,
        "hold_days": 7
      }
    ]
  },
  "600521": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 22.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-30",
        "price": 22.72,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.34,
        "hold_days": 2
      }
    ]
  },
  "603002": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 7.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-30",
        "price": 7.09,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.14,
        "hold_days": 2
      }
    ]
  },
  "688177": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 29.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-07-31",
        "price": 30.69,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.51,
        "hold_days": 3
      }
    ]
  },
  "300903": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 11.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-01",
        "price": 11.63,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.51,
        "hold_days": 4
      }
    ]
  },
  "002796": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 12.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-07",
        "price": 14.44,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.97,
        "hold_days": 10
      },
      {
        "date": "2025-09-03",
        "price": 14.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-09",
        "price": 15.28,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.8,
        "hold_days": 6
      }
    ]
  },
  "601606": {
    "daily": [
      {
        "date": "2025-07-30",
        "price": 31.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-01",
        "price": 35.3,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.96,
        "hold_days": 2
      }
    ]
  },
  "300527": {
    "daily": [
      {
        "date": "2025-07-30",
        "price": 12.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-04",
        "price": 9.43,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -24.62,
        "hold_days": 5
      }
    ]
  },
  "603879": {
    "daily": [
      {
        "date": "2025-07-30",
        "price": 7.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-04",
        "price": 7.24,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.84,
        "hold_days": 5
      }
    ]
  },
  "002424": {
    "daily": [
      {
        "date": "2025-07-31",
        "price": 5.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-04",
        "price": 6.65,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.95,
        "hold_days": 4
      }
    ]
  },
  "002799": {
    "daily": [
      {
        "date": "2025-07-31",
        "price": 9.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-04",
        "price": 9.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.65,
        "hold_days": 4
      }
    ]
  },
  "688656": {
    "daily": [
      {
        "date": "2025-07-31",
        "price": 125.32,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-08",
        "price": 111.89,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.72,
        "hold_days": 8
      }
    ]
  },
  "002030": {
    "daily": [
      {
        "date": "2025-08-01",
        "price": 7.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-04",
        "price": 7.26,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.11,
        "hold_days": 3
      },
      {
        "date": "2025-08-07",
        "price": 7.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 6.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.92,
        "hold_days": 20
      }
    ]
  },
  "300211": {
    "daily": [
      {
        "date": "2025-08-01",
        "price": 7.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-08",
        "price": 7.86,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.7,
        "hold_days": 7
      }
    ]
  },
  "002644": {
    "daily": [
      {
        "date": "2025-08-04",
        "price": 10.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-05",
        "price": 10.21,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.16,
        "hold_days": 1
      }
    ]
  },
  "300922": {
    "daily": [
      {
        "date": "2025-08-04",
        "price": 30.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-07",
        "price": 31.55,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.84,
        "hold_days": 3
      }
    ]
  },
  "300942": {
    "daily": [
      {
        "date": "2025-08-04",
        "price": 12.37,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-12",
        "price": 12.91,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.37,
        "hold_days": 8
      }
    ]
  },
  "300557": {
    "daily": [
      {
        "date": "2025-08-04",
        "price": 28.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-14",
        "price": 27.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.7,
        "hold_days": 10
      }
    ]
  },
  "002022": {
    "daily": [
      {
        "date": "2025-08-05",
        "price": 7.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-06",
        "price": 7.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.1,
        "hold_days": 1
      }
    ]
  },
  "600111": {
    "daily": [
      {
        "date": "2025-08-07",
        "price": 38.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-12",
        "price": 37.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.45,
        "hold_days": 5
      }
    ]
  },
  "000758": {
    "daily": [
      {
        "date": "2025-08-07",
        "price": 6.22,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-12",
        "price": 6.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.38,
        "hold_days": 5
      }
    ]
  },
  "002096": {
    "daily": [
      {
        "date": "2025-08-08",
        "price": 14.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 13.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.33,
        "hold_days": 19
      }
    ]
  },
  "601868": {
    "daily": [
      {
        "date": "2025-08-08",
        "price": 2.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-28",
        "price": 2.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.76,
        "hold_days": 20
      }
    ]
  },
  "301235": {
    "daily": [
      {
        "date": "2025-08-11",
        "price": 33.22,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-14",
        "price": 29.72,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.54,
        "hold_days": 3
      },
      {
        "date": "2025-08-18",
        "price": 33.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-19",
        "price": 33.09,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.57,
        "hold_days": 1
      },
      {
        "date": "2025-08-28",
        "price": 34.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-01",
        "price": 37.1,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.91,
        "hold_days": 4
      }
    ]
  },
  "600252": {
    "daily": [
      {
        "date": "2025-08-11",
        "price": 2.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 2.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.15,
        "hold_days": 16
      }
    ]
  },
  "002501": {
    "daily": [
      {
        "date": "2025-08-12",
        "price": 2.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-14",
        "price": 2.25,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.45,
        "hold_days": 2
      },
      {
        "date": "2026-01-23",
        "price": 2.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-27",
        "price": 2.61,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.69,
        "hold_days": 4
      }
    ]
  },
  "605183": {
    "daily": [
      {
        "date": "2025-08-12",
        "price": 21.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-20",
        "price": 21.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.02,
        "hold_days": 8
      }
    ]
  },
  "603229": {
    "daily": [
      {
        "date": "2025-08-12",
        "price": 11.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-27",
        "price": 11.39,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.04,
        "hold_days": 15
      }
    ]
  },
  "300642": {
    "daily": [
      {
        "date": "2025-08-14",
        "price": 19.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-18",
        "price": 19.24,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.73,
        "hold_days": 4
      }
    ]
  },
  "300204": {
    "daily": [
      {
        "date": "2025-08-14",
        "price": 50.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-19",
        "price": 58.3,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.36,
        "hold_days": 5
      }
    ]
  },
  "002613": {
    "daily": [
      {
        "date": "2025-08-14",
        "price": 4.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-21",
        "price": 4.59,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.46,
        "hold_days": 7
      }
    ]
  },
  "601608": {
    "daily": [
      {
        "date": "2025-08-18",
        "price": 5.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-21",
        "price": 5.39,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.86,
        "hold_days": 3
      }
    ]
  },
  "688679": {
    "daily": [
      {
        "date": "2025-08-19",
        "price": 20.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-22",
        "price": 18.54,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.82,
        "hold_days": 3
      }
    ]
  },
  "000536": {
    "daily": [
      {
        "date": "2025-08-20",
        "price": 5.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-25",
        "price": 5.67,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.8,
        "hold_days": 5
      }
    ]
  },
  "603290": {
    "daily": [
      {
        "date": "2025-08-20",
        "price": 97.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-28",
        "price": 108.04,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.36,
        "hold_days": 8
      }
    ]
  },
  "688484": {
    "daily": [
      {
        "date": "2025-08-20",
        "price": 51.76,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 46.6,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.97,
        "hold_days": 13
      }
    ]
  },
  "300327": {
    "daily": [
      {
        "date": "2025-08-20",
        "price": 27.63,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 25.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.26,
        "hold_days": 13
      }
    ]
  },
  "601929": {
    "daily": [
      {
        "date": "2025-08-21",
        "price": 3.96,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-22",
        "price": 3.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.82,
        "hold_days": 1
      },
      {
        "date": "2025-08-27",
        "price": 4.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-29",
        "price": 4.55,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.18,
        "hold_days": 2
      }
    ]
  },
  "605228": {
    "daily": [
      {
        "date": "2025-08-21",
        "price": 17.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-25",
        "price": 17.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.65,
        "hold_days": 4
      }
    ]
  },
  "603508": {
    "daily": [
      {
        "date": "2025-08-21",
        "price": 31.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-25",
        "price": 31.24,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.11,
        "hold_days": 4
      }
    ]
  },
  "600601": {
    "daily": [
      {
        "date": "2025-08-22",
        "price": 7.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-26",
        "price": 7.91,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.25,
        "hold_days": 4
      }
    ]
  },
  "000070": {
    "daily": [
      {
        "date": "2025-08-26",
        "price": 11.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-29",
        "price": 11.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.73,
        "hold_days": 3
      },
      {
        "date": "2025-09-19",
        "price": 11.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 10.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.6,
        "hold_days": 4
      },
      {
        "date": "2025-12-10",
        "price": 14.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-12",
        "price": 13.02,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.32,
        "hold_days": 2
      },
      {
        "date": "2025-12-22",
        "price": 12.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-13",
        "price": 11.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.5,
        "hold_days": 22
      },
      {
        "date": "2026-01-14",
        "price": 12.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-15",
        "price": 11.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.8,
        "hold_days": 1
      },
      {
        "date": "2026-03-02",
        "price": 19.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-05",
        "price": 17.51,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.94,
        "hold_days": 3
      },
      {
        "date": "2026-03-26",
        "price": 15.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-15",
        "price": 18.88,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 21.34,
        "hold_days": 20
      },
      {
        "date": "2026-04-17",
        "price": 20.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-24",
        "price": 19.97,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.77,
        "hold_days": 7
      }
    ]
  },
  "301389": {
    "daily": [
      {
        "date": "2025-08-27",
        "price": 60.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-28",
        "price": 72.31,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.1,
        "hold_days": 1
      },
      {
        "date": "2025-09-18",
        "price": 72.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-22",
        "price": 74.47,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.39,
        "hold_days": 4
      }
    ]
  },
  "300300": {
    "daily": [
      {
        "date": "2025-08-27",
        "price": 5.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-28",
        "price": 5.72,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.38,
        "hold_days": 1
      },
      {
        "date": "2025-09-10",
        "price": 5.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 4.76,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.45,
        "hold_days": 13
      }
    ]
  },
  "920438": {
    "daily": [
      {
        "date": "2025-08-27",
        "price": 50.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-28",
        "price": 51.65,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.52,
        "hold_days": 1
      }
    ]
  },
  "300811": {
    "daily": [
      {
        "date": "2025-08-27",
        "price": 72.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-08-29",
        "price": 73.95,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.71,
        "hold_days": 2
      }
    ]
  },
  "002909": {
    "daily": [
      {
        "date": "2025-08-27",
        "price": 7.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 6.69,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.66,
        "hold_days": 6
      }
    ]
  },
  "300806": {
    "daily": [
      {
        "date": "2025-08-28",
        "price": 25.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 23.6,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.38,
        "hold_days": 5
      },
      {
        "date": "2025-10-09",
        "price": 28.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-15",
        "price": 28.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.61,
        "hold_days": 6
      }
    ]
  },
  "600210": {
    "daily": [
      {
        "date": "2025-08-28",
        "price": 7.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-03",
        "price": 7.47,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.66,
        "hold_days": 6
      }
    ]
  },
  "002174": {
    "daily": [
      {
        "date": "2025-08-29",
        "price": 16.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-01",
        "price": 16.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.53,
        "hold_days": 3
      }
    ]
  },
  "603013": {
    "daily": [
      {
        "date": "2025-08-29",
        "price": 24.37,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 24.04,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.35,
        "hold_days": 4
      },
      {
        "date": "2025-09-17",
        "price": 27.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-19",
        "price": 27.52,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 0.11,
        "hold_days": 2
      }
    ]
  },
  "000839": {
    "daily": [
      {
        "date": "2025-08-29",
        "price": 3.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-04",
        "price": 2.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.52,
        "hold_days": 6
      }
    ]
  },
  "002516": {
    "daily": [
      {
        "date": "2025-08-29",
        "price": 5.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-08",
        "price": 6.27,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.0,
        "hold_days": 10
      },
      {
        "date": "2025-09-24",
        "price": 6.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-26",
        "price": 6.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.28,
        "hold_days": 2
      }
    ]
  },
  "603928": {
    "daily": [
      {
        "date": "2025-09-01",
        "price": 18.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-02",
        "price": 16.82,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.64,
        "hold_days": 1
      }
    ]
  },
  "002937": {
    "daily": [
      {
        "date": "2025-09-01",
        "price": 19.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-09",
        "price": 18.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.23,
        "hold_days": 8
      }
    ]
  },
  "301413": {
    "daily": [
      {
        "date": "2025-09-02",
        "price": 136.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-03",
        "price": 127.03,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.6,
        "hold_days": 1
      }
    ]
  },
  "002896": {
    "daily": [
      {
        "date": "2025-09-02",
        "price": 97.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-03",
        "price": 92.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.15,
        "hold_days": 1
      }
    ]
  },
  "605378": {
    "daily": [
      {
        "date": "2025-09-02",
        "price": 26.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-04",
        "price": 25.56,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.26,
        "hold_days": 2
      },
      {
        "date": "2025-09-05",
        "price": 28.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-10",
        "price": 28.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.43,
        "hold_days": 5
      },
      {
        "date": "2025-09-11",
        "price": 29.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-16",
        "price": 29.33,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.28,
        "hold_days": 5
      },
      {
        "date": "2025-09-22",
        "price": 30.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-24",
        "price": 28.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.0,
        "hold_days": 2
      },
      {
        "date": "2025-10-09",
        "price": 28.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-10",
        "price": 28.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.82,
        "hold_days": 1
      }
    ]
  },
  "603626": {
    "daily": [
      {
        "date": "2025-09-02",
        "price": 17.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-04",
        "price": 15.11,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -15.3,
        "hold_days": 2
      }
    ]
  },
  "300456": {
    "daily": [
      {
        "date": "2025-09-02",
        "price": 24.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-04",
        "price": 22.34,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -8.74,
        "hold_days": 2
      }
    ]
  },
  "002326": {
    "daily": [
      {
        "date": "2025-09-02",
        "price": 15.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-04",
        "price": 14.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.09,
        "hold_days": 2
      },
      {
        "date": "2025-11-19",
        "price": 30.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-20",
        "price": 27.98,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.73,
        "hold_days": 1
      }
    ]
  },
  "920469": {
    "daily": [
      {
        "date": "2025-09-02",
        "price": 16.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-09",
        "price": 16.65,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.97,
        "hold_days": 7
      }
    ]
  },
  "600653": {
    "daily": [
      {
        "date": "2025-09-02",
        "price": 2.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-18",
        "price": 2.41,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.05,
        "hold_days": 16
      }
    ]
  },
  "002715": {
    "daily": [
      {
        "date": "2025-09-03",
        "price": 22.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-04",
        "price": 22.02,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.57,
        "hold_days": 1
      },
      {
        "date": "2025-09-18",
        "price": 25.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-19",
        "price": 27.58,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.01,
        "hold_days": 1
      }
    ]
  },
  "002067": {
    "daily": [
      {
        "date": "2025-09-03",
        "price": 4.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-08",
        "price": 5.18,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.12,
        "hold_days": 5
      },
      {
        "date": "2025-09-15",
        "price": 5.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-16",
        "price": 5.92,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.04,
        "hold_days": 1
      }
    ]
  },
  "603444": {
    "daily": [
      {
        "date": "2025-09-03",
        "price": 457.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-10",
        "price": 465.7,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.71,
        "hold_days": 7
      }
    ]
  },
  "000417": {
    "daily": [
      {
        "date": "2025-09-04",
        "price": 6.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-05",
        "price": 6.18,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.0,
        "hold_days": 1
      }
    ]
  },
  "600207": {
    "daily": [
      {
        "date": "2025-09-04",
        "price": 5.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-08",
        "price": 5.49,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.9,
        "hold_days": 4
      },
      {
        "date": "2025-09-17",
        "price": 6.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-25",
        "price": 5.36,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.82,
        "hold_days": 8
      }
    ]
  },
  "002091": {
    "daily": [
      {
        "date": "2025-09-04",
        "price": 7.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-09",
        "price": 8.92,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.64,
        "hold_days": 5
      }
    ]
  },
  "920826": {
    "daily": [
      {
        "date": "2025-09-04",
        "price": 15.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-16",
        "price": 14.35,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.58,
        "hold_days": 12
      }
    ]
  },
  "300395": {
    "daily": [
      {
        "date": "2025-09-10",
        "price": 83.22,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-12",
        "price": 85.2,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 2.38,
        "hold_days": 2
      }
    ]
  },
  "300222": {
    "daily": [
      {
        "date": "2025-09-10",
        "price": 12.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-12",
        "price": 13.15,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.62,
        "hold_days": 2
      }
    ]
  },
  "688007": {
    "daily": [
      {
        "date": "2025-09-10",
        "price": 21.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-16",
        "price": 23.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.6,
        "hold_days": 6
      }
    ]
  },
  "600226": {
    "daily": [
      {
        "date": "2025-09-10",
        "price": 3.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-16",
        "price": 4.07,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.74,
        "hold_days": 6
      }
    ]
  },
  "688757": {
    "daily": [
      {
        "date": "2025-09-11",
        "price": 30.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-22",
        "price": 30.45,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.36,
        "hold_days": 11
      }
    ]
  },
  "603959": {
    "daily": [
      {
        "date": "2025-09-12",
        "price": 5.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-15",
        "price": 6.46,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.05,
        "hold_days": 3
      }
    ]
  },
  "920906": {
    "daily": [
      {
        "date": "2025-09-12",
        "price": 33.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-15",
        "price": 32.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.16,
        "hold_days": 3
      }
    ]
  },
  "300125": {
    "daily": [
      {
        "date": "2025-09-12",
        "price": 8.74,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-15",
        "price": 8.21,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.06,
        "hold_days": 3
      }
    ]
  },
  "688329": {
    "daily": [
      {
        "date": "2025-09-15",
        "price": 24.32,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-16",
        "price": 22.68,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.74,
        "hold_days": 1
      }
    ]
  },
  "603335": {
    "daily": [
      {
        "date": "2025-09-15",
        "price": 5.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-17",
        "price": 5.95,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.06,
        "hold_days": 2
      },
      {
        "date": "2025-09-26",
        "price": 6.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-09",
        "price": 5.68,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.27,
        "hold_days": 13
      },
      {
        "date": "2025-10-31",
        "price": 6.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-03",
        "price": 6.28,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.29,
        "hold_days": 3
      }
    ]
  },
  "300797": {
    "daily": [
      {
        "date": "2025-09-15",
        "price": 18.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-13",
        "price": 20.32,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.4,
        "hold_days": 28
      }
    ]
  },
  "603381": {
    "daily": [
      {
        "date": "2025-09-19",
        "price": 24.96,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 24.37,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.36,
        "hold_days": 4
      },
      {
        "date": "2026-03-20",
        "price": 28.22,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-26",
        "price": 24.57,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.93,
        "hold_days": 6
      }
    ]
  },
  "688248": {
    "daily": [
      {
        "date": "2025-09-19",
        "price": 50.84,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-24",
        "price": 57.86,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.81,
        "hold_days": 5
      },
      {
        "date": "2026-03-06",
        "price": 58.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-09",
        "price": 65.39,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.61,
        "hold_days": 3
      },
      {
        "date": "2026-03-24",
        "price": 67.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-31",
        "price": 57.93,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.9,
        "hold_days": 7
      }
    ]
  },
  "300458": {
    "daily": [
      {
        "date": "2025-09-22",
        "price": 50.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-23",
        "price": 49.64,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.04,
        "hold_days": 1
      }
    ]
  },
  "000727": {
    "daily": [
      {
        "date": "2025-09-22",
        "price": 3.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-26",
        "price": 2.76,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.1,
        "hold_days": 4
      },
      {
        "date": "2026-04-20",
        "price": 2.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-24",
        "price": 2.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.5,
        "hold_days": 4
      }
    ]
  },
  "301229": {
    "daily": [
      {
        "date": "2025-09-23",
        "price": 24.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-24",
        "price": 24.67,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.64,
        "hold_days": 1
      },
      {
        "date": "2025-10-10",
        "price": 24.64,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-13",
        "price": 23.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.4,
        "hold_days": 3
      }
    ]
  },
  "920237": {
    "daily": [
      {
        "date": "2025-09-23",
        "price": 30.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-24",
        "price": 29.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.37,
        "hold_days": 1
      }
    ]
  },
  "603035": {
    "daily": [
      {
        "date": "2025-09-23",
        "price": 17.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-25",
        "price": 18.02,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.04,
        "hold_days": 2
      },
      {
        "date": "2025-10-10",
        "price": 18.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 16.94,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.37,
        "hold_days": 7
      }
    ]
  },
  "605060": {
    "daily": [
      {
        "date": "2025-09-23",
        "price": 28.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-26",
        "price": 28.81,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.05,
        "hold_days": 3
      }
    ]
  },
  "300502": {
    "daily": [
      {
        "date": "2025-09-23",
        "price": 353.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-29",
        "price": 388.28,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.99,
        "hold_days": 6
      }
    ]
  },
  "688347": {
    "daily": [
      {
        "date": "2025-09-24",
        "price": 85.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-26",
        "price": 95.77,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.17,
        "hold_days": 2
      }
    ]
  },
  "002156": {
    "daily": [
      {
        "date": "2025-09-24",
        "price": 37.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-26",
        "price": 37.71,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.03,
        "hold_days": 2
      }
    ]
  },
  "002812": {
    "daily": [
      {
        "date": "2025-09-24",
        "price": 44.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-26",
        "price": 44.35,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.54,
        "hold_days": 2
      },
      {
        "date": "2026-04-24",
        "price": 77.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-28",
        "price": 78.51,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.72,
        "hold_days": 4
      }
    ]
  },
  "002180": {
    "daily": [
      {
        "date": "2025-09-25",
        "price": 25.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-30",
        "price": 23.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.09,
        "hold_days": 5
      }
    ]
  },
  "002266": {
    "daily": [
      {
        "date": "2025-09-25",
        "price": 3.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-09",
        "price": 4.46,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.2,
        "hold_days": 14
      }
    ]
  },
  "600711": {
    "daily": [
      {
        "date": "2025-09-25",
        "price": 8.55,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-14",
        "price": 10.37,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 21.29,
        "hold_days": 19
      },
      {
        "date": "2025-10-15",
        "price": 11.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 10.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.23,
        "hold_days": 2
      }
    ]
  },
  "301216": {
    "daily": [
      {
        "date": "2025-09-26",
        "price": 20.32,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-29",
        "price": 19.95,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.82,
        "hold_days": 3
      },
      {
        "date": "2025-10-10",
        "price": 20.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-14",
        "price": 19.42,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.85,
        "hold_days": 4
      }
    ]
  },
  "688148": {
    "daily": [
      {
        "date": "2025-09-26",
        "price": 6.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-09-30",
        "price": 6.88,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.53,
        "hold_days": 4
      },
      {
        "date": "2025-11-05",
        "price": 8.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-10",
        "price": 10.79,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 24.74,
        "hold_days": 5
      }
    ]
  },
  "600691": {
    "daily": [
      {
        "date": "2025-09-26",
        "price": 2.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-14",
        "price": 2.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.34,
        "hold_days": 18
      },
      {
        "date": "2025-11-17",
        "price": 3.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-18",
        "price": 3.34,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.65,
        "hold_days": 1
      },
      {
        "date": "2026-01-22",
        "price": 3.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-02",
        "price": 3.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.81,
        "hold_days": 11
      },
      {
        "date": "2026-03-30",
        "price": 3.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-03",
        "price": 3.04,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -14.61,
        "hold_days": 4
      }
    ]
  },
  "002057": {
    "daily": [
      {
        "date": "2025-09-29",
        "price": 10.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 10.8,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.09,
        "hold_days": 18
      }
    ]
  },
  "688478": {
    "daily": [
      {
        "date": "2025-09-30",
        "price": 42.17,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-10",
        "price": 39.11,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -7.26,
        "hold_days": 10
      }
    ]
  },
  "000757": {
    "daily": [
      {
        "date": "2025-09-30",
        "price": 5.32,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-14",
        "price": 5.57,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.7,
        "hold_days": 14
      }
    ]
  },
  "003022": {
    "daily": [
      {
        "date": "2025-09-30",
        "price": 21.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-15",
        "price": 20.57,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.97,
        "hold_days": 15
      }
    ]
  },
  "688556": {
    "daily": [
      {
        "date": "2025-10-09",
        "price": 11.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-13",
        "price": 12.06,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 8.06,
        "hold_days": 4
      }
    ]
  },
  "920239": {
    "daily": [
      {
        "date": "2025-10-09",
        "price": 37.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 33.03,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.27,
        "hold_days": 8
      }
    ]
  },
  "601279": {
    "daily": [
      {
        "date": "2025-10-10",
        "price": 4.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 4.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.39,
        "hold_days": 7
      }
    ]
  },
  "301269": {
    "daily": [
      {
        "date": "2025-10-13",
        "price": 136.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-14",
        "price": 126.21,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -7.31,
        "hold_days": 1
      },
      {
        "date": "2025-10-15",
        "price": 135.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-20",
        "price": 121.87,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.01,
        "hold_days": 5
      }
    ]
  },
  "300490": {
    "daily": [
      {
        "date": "2025-10-13",
        "price": 13.64,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-16",
        "price": 13.72,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.59,
        "hold_days": 3
      }
    ]
  },
  "603978": {
    "daily": [
      {
        "date": "2025-10-13",
        "price": 23.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-16",
        "price": 22.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.9,
        "hold_days": 3
      }
    ]
  },
  "688469": {
    "daily": [
      {
        "date": "2025-10-13",
        "price": 7.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 6.32,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.86,
        "hold_days": 4
      }
    ]
  },
  "920634": {
    "daily": [
      {
        "date": "2025-10-14",
        "price": 30.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-15",
        "price": 29.81,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.84,
        "hold_days": 1
      }
    ]
  },
  "301099": {
    "daily": [
      {
        "date": "2025-10-14",
        "price": 46.43,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-15",
        "price": 47.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.23,
        "hold_days": 1
      }
    ]
  },
  "600173": {
    "daily": [
      {
        "date": "2025-10-14",
        "price": 9.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 9.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -8.63,
        "hold_days": 3
      }
    ]
  },
  "301369": {
    "daily": [
      {
        "date": "2025-10-15",
        "price": 91.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 84.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.58,
        "hold_days": 2
      },
      {
        "date": "2026-04-27",
        "price": 168.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-28",
        "price": 162.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.11,
        "hold_days": 1
      }
    ]
  },
  "002256": {
    "daily": [
      {
        "date": "2025-10-15",
        "price": 3.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 2.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.46,
        "hold_days": 2
      }
    ]
  },
  "002154": {
    "daily": [
      {
        "date": "2025-10-15",
        "price": 4.14,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-27",
        "price": 4.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.38,
        "hold_days": 12
      }
    ]
  },
  "001208": {
    "daily": [
      {
        "date": "2025-10-15",
        "price": 13.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-14",
        "price": 12.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.27,
        "hold_days": 30
      }
    ]
  },
  "603933": {
    "daily": [
      {
        "date": "2025-10-16",
        "price": 18.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 19.98,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.02,
        "hold_days": 1
      }
    ]
  },
  "688209": {
    "daily": [
      {
        "date": "2025-10-16",
        "price": 23.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-17",
        "price": 22.49,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.21,
        "hold_days": 1
      }
    ]
  },
  "920971": {
    "daily": [
      {
        "date": "2025-10-16",
        "price": 40.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-20",
        "price": 34.29,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -15.12,
        "hold_days": 4
      }
    ]
  },
  "002276": {
    "daily": [
      {
        "date": "2025-10-16",
        "price": 18.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-06",
        "price": 18.52,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.27,
        "hold_days": 21
      }
    ]
  },
  "002654": {
    "daily": [
      {
        "date": "2025-10-17",
        "price": 15.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-20",
        "price": 17.24,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.02,
        "hold_days": 3
      }
    ]
  },
  "001301": {
    "daily": [
      {
        "date": "2025-10-17",
        "price": 82.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-20",
        "price": 82.98,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.01,
        "hold_days": 3
      }
    ]
  },
  "601956": {
    "daily": [
      {
        "date": "2025-10-17",
        "price": 8.14,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-21",
        "price": 9.13,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.16,
        "hold_days": 4
      }
    ]
  },
  "301446": {
    "daily": [
      {
        "date": "2025-10-17",
        "price": 30.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-21",
        "price": 31.79,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.88,
        "hold_days": 4
      }
    ]
  },
  "002083": {
    "daily": [
      {
        "date": "2025-10-17",
        "price": 5.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-21",
        "price": 6.39,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.11,
        "hold_days": 4
      }
    ]
  },
  "603931": {
    "daily": [
      {
        "date": "2025-10-17",
        "price": 31.25,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-23",
        "price": 28.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.57,
        "hold_days": 6
      }
    ]
  },
  "002971": {
    "daily": [
      {
        "date": "2025-10-17",
        "price": 37.35,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-03",
        "price": 34.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.61,
        "hold_days": 17
      }
    ]
  },
  "605169": {
    "daily": [
      {
        "date": "2025-10-20",
        "price": 17.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-24",
        "price": 16.0,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.01,
        "hold_days": 4
      }
    ]
  },
  "301021": {
    "daily": [
      {
        "date": "2025-10-21",
        "price": 41.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-22",
        "price": 40.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.25,
        "hold_days": 1
      },
      {
        "date": "2025-11-10",
        "price": 43.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-14",
        "price": 41.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.73,
        "hold_days": 4
      }
    ]
  },
  "300604": {
    "daily": [
      {
        "date": "2025-10-21",
        "price": 84.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-30",
        "price": 88.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.69,
        "hold_days": 9
      }
    ]
  },
  "002409": {
    "daily": [
      {
        "date": "2025-10-21",
        "price": 77.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-31",
        "price": 77.39,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.24,
        "hold_days": 10
      }
    ]
  },
  "000838": {
    "daily": [
      {
        "date": "2025-10-21",
        "price": 2.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-05",
        "price": 3.2,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.02,
        "hold_days": 15
      }
    ]
  },
  "688660": {
    "daily": [
      {
        "date": "2025-10-22",
        "price": 21.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-27",
        "price": 19.45,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.82,
        "hold_days": 5
      }
    ]
  },
  "688122": {
    "daily": [
      {
        "date": "2025-10-23",
        "price": 71.99,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-28",
        "price": 79.77,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.81,
        "hold_days": 5
      },
      {
        "date": "2026-01-27",
        "price": 90.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-06",
        "price": 81.65,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.03,
        "hold_days": 10
      }
    ]
  },
  "603993": {
    "daily": [
      {
        "date": "2025-10-23",
        "price": 15.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-28",
        "price": 16.75,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.35,
        "hold_days": 5
      }
    ]
  },
  "000685": {
    "daily": [
      {
        "date": "2025-10-23",
        "price": 12.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-28",
        "price": 12.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.33,
        "hold_days": 5
      }
    ]
  },
  "301629": {
    "daily": [
      {
        "date": "2025-10-23",
        "price": 214.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-30",
        "price": 192.65,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.03,
        "hold_days": 7
      },
      {
        "date": "2026-01-15",
        "price": 331.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-19",
        "price": 339.15,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.29,
        "hold_days": 4
      }
    ]
  },
  "688268": {
    "daily": [
      {
        "date": "2025-10-24",
        "price": 63.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-30",
        "price": 64.51,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.88,
        "hold_days": 6
      },
      {
        "date": "2026-04-09",
        "price": 102.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-10",
        "price": 100.5,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.57,
        "hold_days": 1
      },
      {
        "date": "2026-04-20",
        "price": 99.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-21",
        "price": 119.04,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.0,
        "hold_days": 1
      }
    ]
  },
  "601618": {
    "daily": [
      {
        "date": "2025-10-24",
        "price": 3.74,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-17",
        "price": 3.35,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.43,
        "hold_days": 24
      }
    ]
  },
  "000629": {
    "daily": [
      {
        "date": "2025-10-27",
        "price": 3.03,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-28",
        "price": 2.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.98,
        "hold_days": 1
      },
      {
        "date": "2026-01-20",
        "price": 3.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-26",
        "price": 4.24,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 19.1,
        "hold_days": 6
      },
      {
        "date": "2026-02-12",
        "price": 3.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 4.06,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.33,
        "hold_days": 19
      }
    ]
  },
  "002129": {
    "daily": [
      {
        "date": "2025-10-27",
        "price": 8.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-03",
        "price": 9.72,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 8.6,
        "hold_days": 7
      }
    ]
  },
  "601899": {
    "daily": [
      {
        "date": "2025-10-27",
        "price": 31.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-04",
        "price": 28.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.16,
        "hold_days": 8
      }
    ]
  },
  "688126": {
    "daily": [
      {
        "date": "2025-10-27",
        "price": 24.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-12",
        "price": 22.18,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.49,
        "hold_days": 16
      }
    ]
  },
  "603778": {
    "daily": [
      {
        "date": "2025-10-28",
        "price": 4.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-29",
        "price": 4.6,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.22,
        "hold_days": 1
      }
    ]
  },
  "601126": {
    "daily": [
      {
        "date": "2025-10-29",
        "price": 29.46,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-10-31",
        "price": 28.18,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.34,
        "hold_days": 2
      },
      {
        "date": "2025-11-04",
        "price": 28.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-06",
        "price": 32.55,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.9,
        "hold_days": 2
      }
    ]
  },
  "300141": {
    "daily": [
      {
        "date": "2025-10-29",
        "price": 11.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-06",
        "price": 13.06,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.21,
        "hold_days": 8
      }
    ]
  },
  "000809": {
    "daily": [
      {
        "date": "2025-10-30",
        "price": 3.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-03",
        "price": 3.49,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.29,
        "hold_days": 4
      },
      {
        "date": "2026-01-13",
        "price": 3.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-27",
        "price": 3.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.86,
        "hold_days": 14
      }
    ]
  },
  "603937": {
    "daily": [
      {
        "date": "2025-10-30",
        "price": 12.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-07",
        "price": 12.76,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.51,
        "hold_days": 8
      }
    ]
  },
  "600067": {
    "daily": [
      {
        "date": "2025-10-31",
        "price": 3.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-04",
        "price": 4.47,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.74,
        "hold_days": 4
      },
      {
        "date": "2025-11-10",
        "price": 4.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-12",
        "price": 4.7,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 2.62,
        "hold_days": 2
      }
    ]
  },
  "000826": {
    "daily": [
      {
        "date": "2025-10-31",
        "price": 2.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-04",
        "price": 2.53,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.61,
        "hold_days": 4
      }
    ]
  },
  "002320": {
    "daily": [
      {
        "date": "2025-10-31",
        "price": 13.47,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-05",
        "price": 15.36,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.03,
        "hold_days": 5
      }
    ]
  },
  "603530": {
    "daily": [
      {
        "date": "2025-11-03",
        "price": 40.29,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-04",
        "price": 44.32,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.0,
        "hold_days": 1
      }
    ]
  },
  "603030": {
    "daily": [
      {
        "date": "2025-11-03",
        "price": 3.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-05",
        "price": 3.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.0,
        "hold_days": 2
      },
      {
        "date": "2025-11-10",
        "price": 3.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-14",
        "price": 3.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.63,
        "hold_days": 4
      }
    ]
  },
  "300080": {
    "daily": [
      {
        "date": "2025-11-03",
        "price": 5.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-10",
        "price": 6.12,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.82,
        "hold_days": 7
      }
    ]
  },
  "002513": {
    "daily": [
      {
        "date": "2025-11-04",
        "price": 8.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-10",
        "price": 8.86,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.65,
        "hold_days": 6
      }
    ]
  },
  "002578": {
    "daily": [
      {
        "date": "2025-11-04",
        "price": 4.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-11",
        "price": 4.03,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.47,
        "hold_days": 7
      },
      {
        "date": "2025-12-19",
        "price": 4.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-31",
        "price": 4.49,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -0.88,
        "hold_days": 12
      }
    ]
  },
  "300444": {
    "daily": [
      {
        "date": "2025-11-05",
        "price": 9.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-07",
        "price": 9.93,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 0.4,
        "hold_days": 2
      },
      {
        "date": "2026-03-04",
        "price": 16.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-06",
        "price": 17.65,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.56,
        "hold_days": 2
      }
    ]
  },
  "603077": {
    "daily": [
      {
        "date": "2025-11-05",
        "price": 2.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-12",
        "price": 2.25,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.74,
        "hold_days": 7
      },
      {
        "date": "2026-03-27",
        "price": 2.86,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-20",
        "price": 3.26,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.99,
        "hold_days": 24
      }
    ]
  },
  "002270": {
    "daily": [
      {
        "date": "2025-11-06",
        "price": 27.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-07",
        "price": 28.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.9,
        "hold_days": 1
      }
    ]
  },
  "301291": {
    "daily": [
      {
        "date": "2025-11-06",
        "price": 50.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-11",
        "price": 52.25,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.57,
        "hold_days": 5
      }
    ]
  },
  "002756": {
    "daily": [
      {
        "date": "2025-11-06",
        "price": 47.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-11",
        "price": 49.79,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.04,
        "hold_days": 5
      }
    ]
  },
  "300408": {
    "daily": [
      {
        "date": "2025-11-06",
        "price": 53.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-12",
        "price": 46.75,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.78,
        "hold_days": 6
      }
    ]
  },
  "600382": {
    "daily": [
      {
        "date": "2025-11-06",
        "price": 7.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-12",
        "price": 7.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.33,
        "hold_days": 6
      }
    ]
  },
  "600740": {
    "daily": [
      {
        "date": "2025-11-06",
        "price": 4.46,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-18",
        "price": 4.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.59,
        "hold_days": 12
      }
    ]
  },
  "002240": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 27.3,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-12",
        "price": 28.2,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.3,
        "hold_days": 5
      },
      {
        "date": "2025-12-01",
        "price": 33.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-04",
        "price": 30.3,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.62,
        "hold_days": 3
      },
      {
        "date": "2025-12-10",
        "price": 32.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-23",
        "price": 35.92,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.1,
        "hold_days": 13
      },
      {
        "date": "2026-04-10",
        "price": 40.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-13",
        "price": 44.86,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.0,
        "hold_days": 3
      }
    ]
  },
  "000632": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 4.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-20",
        "price": 7.45,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 50.81,
        "hold_days": 13
      },
      {
        "date": "2025-12-01",
        "price": 6.27,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-04",
        "price": 6.88,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 9.73,
        "hold_days": 3
      }
    ]
  },
  "300518": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 16.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-21",
        "price": 15.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.83,
        "hold_days": 14
      },
      {
        "date": "2026-03-27",
        "price": 20.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-31",
        "price": 20.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.94,
        "hold_days": 4
      }
    ]
  },
  "600792": {
    "daily": [
      {
        "date": "2025-11-10",
        "price": 4.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-14",
        "price": 5.36,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.32,
        "hold_days": 4
      },
      {
        "date": "2026-03-23",
        "price": 4.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-30",
        "price": 5.01,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.83,
        "hold_days": 7
      }
    ]
  },
  "688733": {
    "daily": [
      {
        "date": "2025-11-11",
        "price": 33.98,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-14",
        "price": 34.09,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.32,
        "hold_days": 3
      }
    ]
  },
  "300068": {
    "daily": [
      {
        "date": "2025-11-11",
        "price": 20.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-19",
        "price": 18.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.24,
        "hold_days": 8
      }
    ]
  },
  "002054": {
    "daily": [
      {
        "date": "2025-11-11",
        "price": 8.39,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-19",
        "price": 8.07,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.81,
        "hold_days": 8
      }
    ]
  },
  "600773": {
    "daily": [
      {
        "date": "2025-11-12",
        "price": 12.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-14",
        "price": 13.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.17,
        "hold_days": 2
      },
      {
        "date": "2026-04-13",
        "price": 19.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-17",
        "price": 22.47,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.06,
        "hold_days": 4
      }
    ]
  },
  "601515": {
    "daily": [
      {
        "date": "2025-11-14",
        "price": 5.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-18",
        "price": 4.94,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.18,
        "hold_days": 4
      },
      {
        "date": "2026-04-17",
        "price": 4.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-28",
        "price": 4.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.91,
        "hold_days": 11
      }
    ]
  },
  "603489": {
    "daily": [
      {
        "date": "2025-11-14",
        "price": 31.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-18",
        "price": 30.82,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.34,
        "hold_days": 4
      }
    ]
  },
  "002431": {
    "daily": [
      {
        "date": "2025-11-14",
        "price": 2.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-18",
        "price": 2.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.41,
        "hold_days": 4
      }
    ]
  },
  "600179": {
    "daily": [
      {
        "date": "2025-11-14",
        "price": 4.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-18",
        "price": 4.55,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.76,
        "hold_days": 4
      }
    ]
  },
  "002895": {
    "daily": [
      {
        "date": "2025-11-14",
        "price": 38.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-19",
        "price": 37.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.56,
        "hold_days": 5
      }
    ]
  },
  "600157": {
    "daily": [
      {
        "date": "2025-11-14",
        "price": 1.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-19",
        "price": 1.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.26,
        "hold_days": 5
      }
    ]
  },
  "300450": {
    "daily": [
      {
        "date": "2025-11-14",
        "price": 54.74,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-21",
        "price": 46.68,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -14.72,
        "hold_days": 7
      }
    ]
  },
  "002213": {
    "daily": [
      {
        "date": "2025-11-18",
        "price": 30.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-19",
        "price": 33.31,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.01,
        "hold_days": 1
      }
    ]
  },
  "000636": {
    "daily": [
      {
        "date": "2025-11-18",
        "price": 17.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-19",
        "price": 16.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.6,
        "hold_days": 1
      },
      {
        "date": "2026-03-10",
        "price": 23.89,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 21.29,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.88,
        "hold_days": 10
      }
    ]
  },
  "300071": {
    "daily": [
      {
        "date": "2025-11-18",
        "price": 7.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-20",
        "price": 6.7,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -5.1,
        "hold_days": 2
      }
    ]
  },
  "300520": {
    "daily": [
      {
        "date": "2025-11-18",
        "price": 40.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-21",
        "price": 34.2,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -14.5,
        "hold_days": 3
      }
    ]
  },
  "000426": {
    "daily": [
      {
        "date": "2025-11-19",
        "price": 31.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-08",
        "price": 34.99,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.1,
        "hold_days": 19
      },
      {
        "date": "2026-02-12",
        "price": 50.15,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-27",
        "price": 55.19,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 10.05,
        "hold_days": 15
      }
    ]
  },
  "000735": {
    "daily": [
      {
        "date": "2025-11-20",
        "price": 8.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-27",
        "price": 8.38,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.68,
        "hold_days": 7
      }
    ]
  },
  "002455": {
    "daily": [
      {
        "date": "2025-11-20",
        "price": 8.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-03",
        "price": 7.62,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.6,
        "hold_days": 13
      },
      {
        "date": "2026-01-28",
        "price": 7.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-13",
        "price": 13.85,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 74.65,
        "hold_days": 16
      }
    ]
  },
  "301231": {
    "daily": [
      {
        "date": "2025-11-21",
        "price": 33.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-25",
        "price": 37.1,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.34,
        "hold_days": 4
      }
    ]
  },
  "002264": {
    "daily": [
      {
        "date": "2025-11-21",
        "price": 8.11,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-28",
        "price": 9.53,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 17.51,
        "hold_days": 7
      }
    ]
  },
  "002228": {
    "daily": [
      {
        "date": "2025-11-24",
        "price": 4.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-26",
        "price": 4.14,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -4.39,
        "hold_days": 2
      }
    ]
  },
  "601360": {
    "daily": [
      {
        "date": "2025-11-24",
        "price": 13.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-03",
        "price": 12.41,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.53,
        "hold_days": 9
      }
    ]
  },
  "002574": {
    "daily": [
      {
        "date": "2025-11-24",
        "price": 6.47,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-04",
        "price": 5.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.89,
        "hold_days": 10
      }
    ]
  },
  "603155": {
    "daily": [
      {
        "date": "2025-11-25",
        "price": 18.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-27",
        "price": 18.58,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.11,
        "hold_days": 2
      }
    ]
  },
  "002752": {
    "daily": [
      {
        "date": "2025-11-25",
        "price": 6.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-01",
        "price": 6.75,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.89,
        "hold_days": 6
      },
      {
        "date": "2025-12-23",
        "price": 7.49,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-24",
        "price": 8.24,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 10.01,
        "hold_days": 1
      }
    ]
  },
  "600033": {
    "daily": [
      {
        "date": "2025-11-25",
        "price": 3.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-04",
        "price": 4.15,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.87,
        "hold_days": 9
      }
    ]
  },
  "300477": {
    "daily": [
      {
        "date": "2025-11-26",
        "price": 3.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-11-28",
        "price": 3.81,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.04,
        "hold_days": 2
      }
    ]
  },
  "300619": {
    "daily": [
      {
        "date": "2025-11-27",
        "price": 51.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-01",
        "price": 50.24,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.64,
        "hold_days": 4
      }
    ]
  },
  "002029": {
    "daily": [
      {
        "date": "2025-11-27",
        "price": 10.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-01",
        "price": 10.81,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.84,
        "hold_days": 4
      },
      {
        "date": "2025-12-08",
        "price": 11.76,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-10",
        "price": 12.02,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.21,
        "hold_days": 2
      }
    ]
  },
  "605366": {
    "daily": [
      {
        "date": "2025-11-27",
        "price": 7.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-10",
        "price": 6.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.68,
        "hold_days": 13
      }
    ]
  },
  "920809": {
    "daily": [
      {
        "date": "2025-11-28",
        "price": 7.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-17",
        "price": 7.5,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.53,
        "hold_days": 19
      }
    ]
  },
  "920706": {
    "daily": [
      {
        "date": "2025-11-28",
        "price": 28.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-22",
        "price": 28.12,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.04,
        "hold_days": 24
      }
    ]
  },
  "600257": {
    "daily": [
      {
        "date": "2025-12-01",
        "price": 6.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-10",
        "price": 6.36,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.58,
        "hold_days": 9
      }
    ]
  },
  "301071": {
    "daily": [
      {
        "date": "2025-12-03",
        "price": 39.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-15",
        "price": 35.31,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.47,
        "hold_days": 12
      }
    ]
  },
  "601061": {
    "daily": [
      {
        "date": "2025-12-03",
        "price": 14.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-15",
        "price": 15.51,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 8.01,
        "hold_days": 43
      }
    ]
  },
  "002512": {
    "daily": [
      {
        "date": "2025-12-04",
        "price": 6.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-08",
        "price": 7.13,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.64,
        "hold_days": 4
      }
    ]
  },
  "603122": {
    "daily": [
      {
        "date": "2025-12-04",
        "price": 24.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-09",
        "price": 27.18,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.69,
        "hold_days": 5
      }
    ]
  },
  "603359": {
    "daily": [
      {
        "date": "2025-12-04",
        "price": 8.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-10",
        "price": 8.84,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.26,
        "hold_days": 6
      }
    ]
  },
  "000039": {
    "daily": [
      {
        "date": "2025-12-04",
        "price": 9.15,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-10",
        "price": 9.33,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.97,
        "hold_days": 6
      }
    ]
  },
  "301117": {
    "daily": [
      {
        "date": "2025-12-08",
        "price": 50.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-10",
        "price": 51.6,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.67,
        "hold_days": 2
      }
    ]
  },
  "300565": {
    "daily": [
      {
        "date": "2025-12-08",
        "price": 13.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-12",
        "price": 11.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.5,
        "hold_days": 4
      }
    ]
  },
  "003029": {
    "daily": [
      {
        "date": "2025-12-08",
        "price": 26.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-25",
        "price": 27.1,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.88,
        "hold_days": 17
      }
    ]
  },
  "601566": {
    "daily": [
      {
        "date": "2025-12-09",
        "price": 14.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-11",
        "price": 13.66,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -8.32,
        "hold_days": 2
      }
    ]
  },
  "603232": {
    "daily": [
      {
        "date": "2025-12-09",
        "price": 24.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-12",
        "price": 26.73,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.18,
        "hold_days": 34
      }
    ]
  },
  "600828": {
    "daily": [
      {
        "date": "2025-12-10",
        "price": 7.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-12",
        "price": 6.44,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -9.68,
        "hold_days": 2
      }
    ]
  },
  "002192": {
    "daily": [
      {
        "date": "2025-12-10",
        "price": 49.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-16",
        "price": 47.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.79,
        "hold_days": 6
      },
      {
        "date": "2026-04-16",
        "price": 80.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-20",
        "price": 82.33,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.89,
        "hold_days": 4
      }
    ]
  },
  "688387": {
    "daily": [
      {
        "date": "2025-12-11",
        "price": 8.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-18",
        "price": 9.04,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.49,
        "hold_days": 7
      },
      {
        "date": "2026-04-14",
        "price": 16.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-21",
        "price": 17.73,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 7.32,
        "hold_days": 7
      }
    ]
  },
  "300397": {
    "daily": [
      {
        "date": "2025-12-12",
        "price": 14.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-15",
        "price": 14.8,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.3,
        "hold_days": 3
      }
    ]
  },
  "603992": {
    "daily": [
      {
        "date": "2025-12-12",
        "price": 33.37,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-16",
        "price": 36.6,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.68,
        "hold_days": 4
      }
    ]
  },
  "300726": {
    "daily": [
      {
        "date": "2025-12-12",
        "price": 41.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-16",
        "price": 40.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.06,
        "hold_days": 4
      }
    ]
  },
  "002300": {
    "daily": [
      {
        "date": "2025-12-12",
        "price": 10.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-17",
        "price": 11.65,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 8.98,
        "hold_days": 5
      }
    ]
  },
  "600686": {
    "daily": [
      {
        "date": "2025-12-15",
        "price": 17.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-18",
        "price": 15.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.21,
        "hold_days": 3
      }
    ]
  },
  "300516": {
    "daily": [
      {
        "date": "2025-12-16",
        "price": 67.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-18",
        "price": 66.99,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.33,
        "hold_days": 2
      }
    ]
  },
  "603708": {
    "daily": [
      {
        "date": "2025-12-16",
        "price": 12.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-18",
        "price": 12.92,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.89,
        "hold_days": 2
      }
    ]
  },
  "600280": {
    "daily": [
      {
        "date": "2025-12-16",
        "price": 4.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-19",
        "price": 5.1,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.39,
        "hold_days": 3
      }
    ]
  },
  "300762": {
    "daily": [
      {
        "date": "2025-12-17",
        "price": 34.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-19",
        "price": 36.44,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.93,
        "hold_days": 2
      }
    ]
  },
  "300337": {
    "daily": [
      {
        "date": "2025-12-17",
        "price": 13.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-22",
        "price": 12.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.1,
        "hold_days": 5
      }
    ]
  },
  "300900": {
    "daily": [
      {
        "date": "2025-12-18",
        "price": 24.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-22",
        "price": 23.82,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -2.3,
        "hold_days": 4
      }
    ]
  },
  "002522": {
    "daily": [
      {
        "date": "2025-12-18",
        "price": 5.37,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-26",
        "price": 5.53,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.98,
        "hold_days": 8
      }
    ]
  },
  "002985": {
    "daily": [
      {
        "date": "2025-12-18",
        "price": 30.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-08",
        "price": 33.94,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.21,
        "hold_days": 21
      }
    ]
  },
  "603162": {
    "daily": [
      {
        "date": "2025-12-19",
        "price": 12.47,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-25",
        "price": 12.73,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.08,
        "hold_days": 6
      }
    ]
  },
  "601969": {
    "daily": [
      {
        "date": "2025-12-22",
        "price": 11.47,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-24",
        "price": 11.25,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.92,
        "hold_days": 2
      }
    ]
  },
  "300487": {
    "daily": [
      {
        "date": "2025-12-22",
        "price": 60.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-07",
        "price": 68.9,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.34,
        "hold_days": 16
      }
    ]
  },
  "300123": {
    "daily": [
      {
        "date": "2025-12-24",
        "price": 7.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-30",
        "price": 8.03,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.82,
        "hold_days": 6
      }
    ]
  },
  "600192": {
    "daily": [
      {
        "date": "2025-12-25",
        "price": 9.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-31",
        "price": 10.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.41,
        "hold_days": 6
      }
    ]
  },
  "301306": {
    "daily": [
      {
        "date": "2025-12-26",
        "price": 122.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-29",
        "price": 115.22,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -6.02,
        "hold_days": 3
      },
      {
        "date": "2025-12-31",
        "price": 114.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-06",
        "price": 132.04,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 15.46,
        "hold_days": 6
      }
    ]
  },
  "002378": {
    "daily": [
      {
        "date": "2025-12-26",
        "price": 15.25,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-30",
        "price": 14.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.31,
        "hold_days": 4
      }
    ]
  },
  "002309": {
    "daily": [
      {
        "date": "2025-12-26",
        "price": 3.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-08",
        "price": 3.0,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -16.43,
        "hold_days": 13
      },
      {
        "date": "2026-03-20",
        "price": 3.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-27",
        "price": 4.33,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 13.65,
        "hold_days": 7
      }
    ]
  },
  "002836": {
    "daily": [
      {
        "date": "2025-12-29",
        "price": 15.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-07",
        "price": 15.99,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.33,
        "hold_days": 9
      },
      {
        "date": "2026-01-09",
        "price": 16.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-19",
        "price": 16.26,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.57,
        "hold_days": 10
      }
    ]
  },
  "688668": {
    "daily": [
      {
        "date": "2025-12-30",
        "price": 129.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-31",
        "price": 124.0,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.33,
        "hold_days": 1
      }
    ]
  },
  "000530": {
    "daily": [
      {
        "date": "2025-12-30",
        "price": 7.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2025-12-31",
        "price": 7.32,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.66,
        "hold_days": 1
      }
    ]
  },
  "300817": {
    "daily": [
      {
        "date": "2025-12-30",
        "price": 21.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-07",
        "price": 20.64,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.75,
        "hold_days": 8
      }
    ]
  },
  "688143": {
    "daily": [
      {
        "date": "2025-12-30",
        "price": 50.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-09",
        "price": 58.7,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.93,
        "hold_days": 10
      }
    ]
  },
  "300807": {
    "daily": [
      {
        "date": "2025-12-31",
        "price": 55.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-06",
        "price": 57.64,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.44,
        "hold_days": 6
      },
      {
        "date": "2026-01-09",
        "price": 61.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-13",
        "price": 60.5,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.63,
        "hold_days": 4
      }
    ]
  },
  "000688": {
    "daily": [
      {
        "date": "2025-12-31",
        "price": 27.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-07",
        "price": 27.97,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.08,
        "hold_days": 7
      }
    ]
  },
  "600221": {
    "daily": [
      {
        "date": "2025-12-31",
        "price": 1.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-09",
        "price": 1.73,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.42,
        "hold_days": 9
      }
    ]
  },
  "000703": {
    "daily": [
      {
        "date": "2026-01-06",
        "price": 10.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-12",
        "price": 10.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.47,
        "hold_days": 6
      },
      {
        "date": "2026-01-14",
        "price": 10.88,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-28",
        "price": 11.95,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 9.83,
        "hold_days": 14
      }
    ]
  },
  "002425": {
    "daily": [
      {
        "date": "2026-01-06",
        "price": 4.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-14",
        "price": 4.27,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.75,
        "hold_days": 8
      }
    ]
  },
  "603097": {
    "daily": [
      {
        "date": "2026-01-07",
        "price": 29.31,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-14",
        "price": 30.08,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.63,
        "hold_days": 7
      },
      {
        "date": "2026-01-28",
        "price": 35.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-05",
        "price": 35.8,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.08,
        "hold_days": 8
      },
      {
        "date": "2026-03-06",
        "price": 41.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-13",
        "price": 37.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.11,
        "hold_days": 7
      }
    ]
  },
  "300423": {
    "daily": [
      {
        "date": "2026-01-07",
        "price": 8.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-14",
        "price": 9.25,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.47,
        "hold_days": 7
      }
    ]
  },
  "920077": {
    "daily": [
      {
        "date": "2026-01-08",
        "price": 18.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-09",
        "price": 18.14,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.55,
        "hold_days": 1
      },
      {
        "date": "2026-01-20",
        "price": 18.59,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-26",
        "price": 19.07,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.58,
        "hold_days": 6
      }
    ]
  },
  "688231": {
    "daily": [
      {
        "date": "2026-01-08",
        "price": 28.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-13",
        "price": 27.9,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.71,
        "hold_days": 5
      },
      {
        "date": "2026-01-19",
        "price": 29.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-26",
        "price": 30.4,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.43,
        "hold_days": 7
      }
    ]
  },
  "688066": {
    "daily": [
      {
        "date": "2026-01-08",
        "price": 38.11,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-15",
        "price": 38.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.23,
        "hold_days": 7
      }
    ]
  },
  "000420": {
    "daily": [
      {
        "date": "2026-01-08",
        "price": 4.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-15",
        "price": 4.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.3,
        "hold_days": 7
      }
    ]
  },
  "000571": {
    "daily": [
      {
        "date": "2026-01-09",
        "price": 6.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-13",
        "price": 5.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.2,
        "hold_days": 4
      }
    ]
  },
  "002081": {
    "daily": [
      {
        "date": "2026-01-12",
        "price": 3.7,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-14",
        "price": 3.8,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.7,
        "hold_days": 2
      }
    ]
  },
  "300239": {
    "daily": [
      {
        "date": "2026-01-12",
        "price": 6.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-20",
        "price": 6.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.12,
        "hold_days": 8
      }
    ]
  },
  "920300": {
    "daily": [
      {
        "date": "2026-01-13",
        "price": 16.76,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-14",
        "price": 17.38,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 3.7,
        "hold_days": 1
      }
    ]
  },
  "300842": {
    "daily": [
      {
        "date": "2026-01-13",
        "price": 72.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-14",
        "price": 80.65,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.81,
        "hold_days": 1
      }
    ]
  },
  "603608": {
    "daily": [
      {
        "date": "2026-01-13",
        "price": 10.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-15",
        "price": 9.55,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.82,
        "hold_days": 2
      }
    ]
  },
  "300827": {
    "daily": [
      {
        "date": "2026-01-13",
        "price": 42.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-27",
        "price": 37.81,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.17,
        "hold_days": 14
      },
      {
        "date": "2026-03-20",
        "price": 44.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-31",
        "price": 38.88,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -13.47,
        "hold_days": 11
      }
    ]
  },
  "603666": {
    "daily": [
      {
        "date": "2026-01-13",
        "price": 32.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-28",
        "price": 32.92,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.17,
        "hold_days": 15
      }
    ]
  },
  "601113": {
    "daily": [
      {
        "date": "2026-01-14",
        "price": 4.86,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-29",
        "price": 4.67,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.91,
        "hold_days": 15
      }
    ]
  },
  "300563": {
    "daily": [
      {
        "date": "2026-01-15",
        "price": 42.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-19",
        "price": 39.63,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.02,
        "hold_days": 4
      }
    ]
  },
  "300054": {
    "daily": [
      {
        "date": "2026-01-15",
        "price": 46.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-20",
        "price": 46.99,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.66,
        "hold_days": 5
      }
    ]
  },
  "688510": {
    "daily": [
      {
        "date": "2026-01-19",
        "price": 35.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-20",
        "price": 39.5,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.37,
        "hold_days": 1
      }
    ]
  },
  "688106": {
    "daily": [
      {
        "date": "2026-01-19",
        "price": 25.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-20",
        "price": 24.29,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.82,
        "hold_days": 1
      }
    ]
  },
  "300051": {
    "daily": [
      {
        "date": "2026-01-19",
        "price": 8.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-20",
        "price": 8.75,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.46,
        "hold_days": 1
      },
      {
        "date": "2026-03-16",
        "price": 11.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-18",
        "price": 10.86,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.34,
        "hold_days": 2
      },
      {
        "date": "2026-03-27",
        "price": 12.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-01",
        "price": 12.45,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.98,
        "hold_days": 5
      }
    ]
  },
  "000159": {
    "daily": [
      {
        "date": "2026-01-19",
        "price": 6.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-23",
        "price": 7.47,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 17.08,
        "hold_days": 4
      }
    ]
  },
  "603737": {
    "daily": [
      {
        "date": "2026-01-20",
        "price": 48.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-22",
        "price": 53.28,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.13,
        "hold_days": 2
      }
    ]
  },
  "603916": {
    "daily": [
      {
        "date": "2026-01-20",
        "price": 11.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-22",
        "price": 11.68,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.18,
        "hold_days": 2
      }
    ]
  },
  "601117": {
    "daily": [
      {
        "date": "2026-01-20",
        "price": 8.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-27",
        "price": 8.72,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.35,
        "hold_days": 7
      }
    ]
  },
  "000792": {
    "daily": [
      {
        "date": "2026-01-20",
        "price": 34.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-28",
        "price": 35.08,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.96,
        "hold_days": 8
      }
    ]
  },
  "300597": {
    "daily": [
      {
        "date": "2026-01-23",
        "price": 10.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-28",
        "price": 9.82,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.96,
        "hold_days": 5
      }
    ]
  },
  "301266": {
    "daily": [
      {
        "date": "2026-01-26",
        "price": 43.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-29",
        "price": 43.02,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.6,
        "hold_days": 3
      }
    ]
  },
  "601096": {
    "daily": [
      {
        "date": "2026-01-26",
        "price": 5.32,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-04",
        "price": 6.19,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.35,
        "hold_days": 9
      }
    ]
  },
  "003007": {
    "daily": [
      {
        "date": "2026-01-26",
        "price": 45.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-02",
        "price": 46.3,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.77,
        "hold_days": 35
      }
    ]
  },
  "920961": {
    "daily": [
      {
        "date": "2026-01-27",
        "price": 30.14,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-02",
        "price": 26.66,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.55,
        "hold_days": 6
      }
    ]
  },
  "002049": {
    "daily": [
      {
        "date": "2026-01-28",
        "price": 87.91,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-29",
        "price": 84.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.15,
        "hold_days": 1
      }
    ]
  },
  "300505": {
    "daily": [
      {
        "date": "2026-01-28",
        "price": 30.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-02",
        "price": 27.33,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.2,
        "hold_days": 5
      },
      {
        "date": "2026-03-13",
        "price": 38.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-17",
        "price": 37.59,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.37,
        "hold_days": 4
      }
    ]
  },
  "600935": {
    "daily": [
      {
        "date": "2026-01-28",
        "price": 2.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-02",
        "price": 2.67,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.96,
        "hold_days": 5
      }
    ]
  },
  "601216": {
    "daily": [
      {
        "date": "2026-01-28",
        "price": 5.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-02",
        "price": 5.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.75,
        "hold_days": 5
      }
    ]
  },
  "603115": {
    "daily": [
      {
        "date": "2026-01-28",
        "price": 25.13,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-06",
        "price": 22.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.87,
        "hold_days": 9
      }
    ]
  },
  "300480": {
    "daily": [
      {
        "date": "2026-01-29",
        "price": 22.69,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-01-30",
        "price": 22.67,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.09,
        "hold_days": 1
      },
      {
        "date": "2026-02-27",
        "price": 28.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 25.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.25,
        "hold_days": 4
      },
      {
        "date": "2026-03-05",
        "price": 29.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-06",
        "price": 32.71,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.52,
        "hold_days": 1
      },
      {
        "date": "2026-04-08",
        "price": 31.1,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-13",
        "price": 32.57,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.73,
        "hold_days": 5
      }
    ]
  },
  "002183": {
    "daily": [
      {
        "date": "2026-01-30",
        "price": 6.06,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-02",
        "price": 5.45,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.07,
        "hold_days": 3
      }
    ]
  },
  "603687": {
    "daily": [
      {
        "date": "2026-01-30",
        "price": 11.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-03",
        "price": 10.81,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.0,
        "hold_days": 4
      }
    ]
  },
  "001231": {
    "daily": [
      {
        "date": "2026-01-30",
        "price": 24.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-12",
        "price": 25.44,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.88,
        "hold_days": 13
      }
    ]
  },
  "600172": {
    "daily": [
      {
        "date": "2026-02-02",
        "price": 7.21,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-04",
        "price": 8.03,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.37,
        "hold_days": 2
      }
    ]
  },
  "600986": {
    "daily": [
      {
        "date": "2026-02-02",
        "price": 14.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-05",
        "price": 15.52,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.7,
        "hold_days": 3
      }
    ]
  },
  "002623": {
    "daily": [
      {
        "date": "2026-02-03",
        "price": 25.87,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-04",
        "price": 28.46,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.01,
        "hold_days": 1
      }
    ]
  },
  "603682": {
    "daily": [
      {
        "date": "2026-02-03",
        "price": 6.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-11",
        "price": 7.51,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.13,
        "hold_days": 8
      }
    ]
  },
  "688147": {
    "daily": [
      {
        "date": "2026-02-04",
        "price": 77.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-05",
        "price": 71.73,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.62,
        "hold_days": 1
      },
      {
        "date": "2026-02-10",
        "price": 78.61,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-13",
        "price": 94.98,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.82,
        "hold_days": 3
      }
    ]
  },
  "688503": {
    "daily": [
      {
        "date": "2026-02-04",
        "price": 78.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-09",
        "price": 89.23,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.87,
        "hold_days": 5
      },
      {
        "date": "2026-02-27",
        "price": 105.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 92.3,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.2,
        "hold_days": 4
      }
    ]
  },
  "300393": {
    "daily": [
      {
        "date": "2026-02-04",
        "price": 10.32,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-10",
        "price": 9.98,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -3.29,
        "hold_days": 6
      },
      {
        "date": "2026-02-27",
        "price": 10.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-12",
        "price": 10.68,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 6.06,
        "hold_days": 13
      }
    ]
  },
  "001330": {
    "daily": [
      {
        "date": "2026-02-05",
        "price": 10.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-09",
        "price": 11.34,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.5,
        "hold_days": 4
      }
    ]
  },
  "600084": {
    "daily": [
      {
        "date": "2026-02-05",
        "price": 7.72,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-11",
        "price": 6.91,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.49,
        "hold_days": 6
      }
    ]
  },
  "002187": {
    "daily": [
      {
        "date": "2026-02-05",
        "price": 8.17,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-12",
        "price": 7.29,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.77,
        "hold_days": 7
      }
    ]
  },
  "688646": {
    "daily": [
      {
        "date": "2026-02-05",
        "price": 39.2,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-13",
        "price": 44.81,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.31,
        "hold_days": 8
      }
    ]
  },
  "000591": {
    "daily": [
      {
        "date": "2026-02-06",
        "price": 5.56,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-10",
        "price": 5.58,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.36,
        "hold_days": 4
      },
      {
        "date": "2026-02-25",
        "price": 5.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-06",
        "price": 6.25,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.42,
        "hold_days": 9
      }
    ]
  },
  "002339": {
    "daily": [
      {
        "date": "2026-02-06",
        "price": 12.76,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 10.49,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -17.79,
        "hold_days": 25
      }
    ]
  },
  "300182": {
    "daily": [
      {
        "date": "2026-02-09",
        "price": 7.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-10",
        "price": 8.45,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 20.03,
        "hold_days": 1
      }
    ]
  },
  "688200": {
    "daily": [
      {
        "date": "2026-02-10",
        "price": 307.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-02",
        "price": 287.57,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.55,
        "hold_days": 20
      }
    ]
  },
  "002130": {
    "daily": [
      {
        "date": "2026-02-10",
        "price": 28.41,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 25.56,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.03,
        "hold_days": 21
      }
    ]
  },
  "002169": {
    "daily": [
      {
        "date": "2026-02-11",
        "price": 13.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-13",
        "price": 15.3,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 13.5,
        "hold_days": 2
      }
    ]
  },
  "688216": {
    "daily": [
      {
        "date": "2026-02-11",
        "price": 30.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-13",
        "price": 30.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.69,
        "hold_days": 2
      }
    ]
  },
  "300671": {
    "daily": [
      {
        "date": "2026-02-11",
        "price": 50.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-27",
        "price": 45.37,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.53,
        "hold_days": 16
      }
    ]
  },
  "301590": {
    "daily": [
      {
        "date": "2026-02-12",
        "price": 205.52,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 183.5,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.71,
        "hold_days": 19
      }
    ]
  },
  "300065": {
    "daily": [
      {
        "date": "2026-02-13",
        "price": 28.81,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-24",
        "price": 28.42,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.35,
        "hold_days": 11
      }
    ]
  },
  "600869": {
    "daily": [
      {
        "date": "2026-02-13",
        "price": 12.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-25",
        "price": 14.26,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.64,
        "hold_days": 12
      }
    ]
  },
  "688378": {
    "daily": [
      {
        "date": "2026-02-13",
        "price": 37.67,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 38.27,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 1.59,
        "hold_days": 18
      }
    ]
  },
  "600547": {
    "daily": [
      {
        "date": "2026-02-24",
        "price": 47.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-02",
        "price": 52.03,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.61,
        "hold_days": 6
      }
    ]
  },
  "002491": {
    "daily": [
      {
        "date": "2026-02-24",
        "price": 10.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-04",
        "price": 12.65,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 24.14,
        "hold_days": 8
      }
    ]
  },
  "600968": {
    "daily": [
      {
        "date": "2026-02-24",
        "price": 4.65,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-06",
        "price": 5.04,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 8.39,
        "hold_days": 10
      }
    ]
  },
  "603271": {
    "daily": [
      {
        "date": "2026-02-25",
        "price": 47.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-02-26",
        "price": 46.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.76,
        "hold_days": 1
      }
    ]
  },
  "600307": {
    "daily": [
      {
        "date": "2026-02-25",
        "price": 1.94,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 1.87,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.61,
        "hold_days": 6
      }
    ]
  },
  "920179": {
    "daily": [
      {
        "date": "2026-02-26",
        "price": 56.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-02",
        "price": 53.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.76,
        "hold_days": 4
      }
    ]
  },
  "002957": {
    "daily": [
      {
        "date": "2026-03-02",
        "price": 28.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-03",
        "price": 31.67,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.0,
        "hold_days": 1
      }
    ]
  },
  "600330": {
    "daily": [
      {
        "date": "2026-03-02",
        "price": 17.64,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-04",
        "price": 17.48,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.91,
        "hold_days": 2
      },
      {
        "date": "2026-04-03",
        "price": 17.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-09",
        "price": 19.7,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 15.81,
        "hold_days": 6
      }
    ]
  },
  "600028": {
    "daily": [
      {
        "date": "2026-03-02",
        "price": 7.11,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-05",
        "price": 7.03,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.13,
        "hold_days": 3
      }
    ]
  },
  "300435": {
    "daily": [
      {
        "date": "2026-03-03",
        "price": 34.92,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-04",
        "price": 31.28,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.42,
        "hold_days": 1
      }
    ]
  },
  "600732": {
    "daily": [
      {
        "date": "2026-03-03",
        "price": 14.57,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-04",
        "price": 14.66,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.62,
        "hold_days": 1
      }
    ]
  },
  "688313": {
    "daily": [
      {
        "date": "2026-03-03",
        "price": 86.34,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-04",
        "price": 84.39,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -2.26,
        "hold_days": 1
      }
    ]
  },
  "002506": {
    "daily": [
      {
        "date": "2026-03-03",
        "price": 5.16,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-09",
        "price": 5.78,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.02,
        "hold_days": 6
      },
      {
        "date": "2026-03-23",
        "price": 5.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-26",
        "price": 5.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.9,
        "hold_days": 3
      }
    ]
  },
  "000421": {
    "daily": [
      {
        "date": "2026-03-03",
        "price": 7.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-16",
        "price": 6.94,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.22,
        "hold_days": 13
      }
    ]
  },
  "920046": {
    "daily": [
      {
        "date": "2026-03-04",
        "price": 33.22,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-06",
        "price": 33.69,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.41,
        "hold_days": 2
      }
    ]
  },
  "002167": {
    "daily": [
      {
        "date": "2026-03-04",
        "price": 16.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-11",
        "price": 14.6,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.15,
        "hold_days": 7
      }
    ]
  },
  "601619": {
    "daily": [
      {
        "date": "2026-03-04",
        "price": 7.04,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-13",
        "price": 6.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.38,
        "hold_days": 9
      }
    ]
  },
  "000899": {
    "daily": [
      {
        "date": "2026-03-05",
        "price": 14.47,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-10",
        "price": 14.68,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.45,
        "hold_days": 5
      }
    ]
  },
  "000767": {
    "daily": [
      {
        "date": "2026-03-05",
        "price": 3.83,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-10",
        "price": 3.81,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.52,
        "hold_days": 5
      }
    ]
  },
  "600676": {
    "daily": [
      {
        "date": "2026-03-06",
        "price": 8.45,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-12",
        "price": 7.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.39,
        "hold_days": 6
      }
    ]
  },
  "301218": {
    "daily": [
      {
        "date": "2026-03-06",
        "price": 38.51,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-13",
        "price": 38.04,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.22,
        "hold_days": 7
      }
    ]
  },
  "000545": {
    "daily": [
      {
        "date": "2026-03-06",
        "price": 3.75,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-13",
        "price": 3.94,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 5.07,
        "hold_days": 7
      }
    ]
  },
  "002063": {
    "daily": [
      {
        "date": "2026-03-06",
        "price": 7.01,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-16",
        "price": 7.06,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.71,
        "hold_days": 10
      }
    ]
  },
  "000818": {
    "daily": [
      {
        "date": "2026-03-09",
        "price": 24.31,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-10",
        "price": 24.1,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.86,
        "hold_days": 1
      },
      {
        "date": "2026-03-18",
        "price": 24.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-23",
        "price": 21.19,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.15,
        "hold_days": 5
      }
    ]
  },
  "600256": {
    "daily": [
      {
        "date": "2026-03-09",
        "price": 7.09,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-10",
        "price": 6.69,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.64,
        "hold_days": 1
      }
    ]
  },
  "600938": {
    "daily": [
      {
        "date": "2026-03-09",
        "price": 43.36,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-17",
        "price": 40.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.69,
        "hold_days": 8
      }
    ]
  },
  "688191": {
    "daily": [
      {
        "date": "2026-03-10",
        "price": 54.25,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-13",
        "price": 50.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.08,
        "hold_days": 3
      }
    ]
  },
  "605006": {
    "daily": [
      {
        "date": "2026-03-10",
        "price": 9.62,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 8.64,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.19,
        "hold_days": 10
      },
      {
        "date": "2026-04-10",
        "price": 10.12,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-15",
        "price": 10.14,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.2,
        "hold_days": 5
      },
      {
        "date": "2026-04-21",
        "price": 10.76,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-24",
        "price": 10.31,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.18,
        "hold_days": 3
      }
    ]
  },
  "002539": {
    "daily": [
      {
        "date": "2026-03-11",
        "price": 15.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-16",
        "price": 15.25,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -1.23,
        "hold_days": 5
      }
    ]
  },
  "601390": {
    "daily": [
      {
        "date": "2026-03-11",
        "price": 5.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-03",
        "price": 5.2,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -12.31,
        "hold_days": 23
      }
    ]
  },
  "002109": {
    "daily": [
      {
        "date": "2026-03-12",
        "price": 4.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-17",
        "price": 5.0,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.16,
        "hold_days": 5
      },
      {
        "date": "2026-03-19",
        "price": 5.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 4.75,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.04,
        "hold_days": 1
      }
    ]
  },
  "600800": {
    "daily": [
      {
        "date": "2026-03-13",
        "price": 5.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-16",
        "price": 5.01,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.75,
        "hold_days": 3
      }
    ]
  },
  "002470": {
    "daily": [
      {
        "date": "2026-03-13",
        "price": 3.22,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-17",
        "price": 3.6,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 11.8,
        "hold_days": 4
      }
    ]
  },
  "000010": {
    "daily": [
      {
        "date": "2026-03-13",
        "price": 4.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-18",
        "price": 4.6,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.55,
        "hold_days": 5
      }
    ]
  },
  "600313": {
    "daily": [
      {
        "date": "2026-03-16",
        "price": 9.08,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-18",
        "price": 8.7,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.19,
        "hold_days": 2
      }
    ]
  },
  "002025": {
    "daily": [
      {
        "date": "2026-03-16",
        "price": 57.58,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 63.44,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.18,
        "hold_days": 4
      },
      {
        "date": "2026-03-30",
        "price": 66.48,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-02",
        "price": 60.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.81,
        "hold_days": 3
      }
    ]
  },
  "301282": {
    "daily": [
      {
        "date": "2026-03-18",
        "price": 36.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-19",
        "price": 34.8,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.76,
        "hold_days": 1
      }
    ]
  },
  "300752": {
    "daily": [
      {
        "date": "2026-03-18",
        "price": 19.35,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-19",
        "price": 18.81,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.79,
        "hold_days": 1
      }
    ]
  },
  "300072": {
    "daily": [
      {
        "date": "2026-03-18",
        "price": 5.85,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 5.22,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.77,
        "hold_days": 2
      }
    ]
  },
  "301428": {
    "daily": [
      {
        "date": "2026-03-18",
        "price": 39.79,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-23",
        "price": 35.08,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.84,
        "hold_days": 5
      }
    ]
  },
  "920010": {
    "daily": [
      {
        "date": "2026-03-19",
        "price": 14.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-20",
        "price": 14.58,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.55,
        "hold_days": 1
      }
    ]
  },
  "000407": {
    "daily": [
      {
        "date": "2026-03-19",
        "price": 5.25,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-23",
        "price": 4.69,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.67,
        "hold_days": 4
      }
    ]
  },
  "300880": {
    "daily": [
      {
        "date": "2026-03-20",
        "price": 24.73,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-23",
        "price": 24.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.18,
        "hold_days": 3
      }
    ]
  },
  "301658": {
    "daily": [
      {
        "date": "2026-03-20",
        "price": 60.35,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-24",
        "price": 59.88,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": -0.78,
        "hold_days": 4
      }
    ]
  },
  "601015": {
    "daily": [
      {
        "date": "2026-03-20",
        "price": 5.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-24",
        "price": 5.5,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.85,
        "hold_days": 4
      }
    ]
  },
  "300032": {
    "daily": [
      {
        "date": "2026-03-20",
        "price": 6.03,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-26",
        "price": 6.16,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.16,
        "hold_days": 6
      }
    ]
  },
  "301179": {
    "daily": [
      {
        "date": "2026-03-20",
        "price": 23.66,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-26",
        "price": 23.32,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.44,
        "hold_days": 6
      }
    ]
  },
  "603393": {
    "daily": [
      {
        "date": "2026-03-20",
        "price": 42.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-30",
        "price": 37.82,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.01,
        "hold_days": 10
      }
    ]
  },
  "688032": {
    "daily": [
      {
        "date": "2026-03-20",
        "price": 134.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-30",
        "price": 128.75,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -3.92,
        "hold_days": 10
      }
    ]
  },
  "600121": {
    "daily": [
      {
        "date": "2026-03-23",
        "price": 5.43,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-24",
        "price": 5.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.58,
        "hold_days": 1
      }
    ]
  },
  "600744": {
    "daily": [
      {
        "date": "2026-03-24",
        "price": 8.77,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-03-26",
        "price": 8.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.62,
        "hold_days": 2
      }
    ]
  },
  "300504": {
    "daily": [
      {
        "date": "2026-03-30",
        "price": 15.24,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-13",
        "price": 16.0,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.99,
        "hold_days": 14
      }
    ]
  },
  "688176": {
    "daily": [
      {
        "date": "2026-03-30",
        "price": 13.38,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-20",
        "price": 13.53,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.12,
        "hold_days": 21
      }
    ]
  },
  "000863": {
    "daily": [
      {
        "date": "2026-03-31",
        "price": 5.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-01",
        "price": 5.43,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.9,
        "hold_days": 1
      }
    ]
  },
  "000065": {
    "daily": [
      {
        "date": "2026-03-31",
        "price": 14.55,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-02",
        "price": 15.17,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.26,
        "hold_days": 2
      }
    ]
  },
  "603558": {
    "daily": [
      {
        "date": "2026-03-31",
        "price": 14.78,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-03",
        "price": 13.07,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.57,
        "hold_days": 3
      }
    ]
  },
  "601975": {
    "daily": [
      {
        "date": "2026-04-02",
        "price": 4.8,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-07",
        "price": 5.23,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 8.96,
        "hold_days": 5
      }
    ]
  },
  "002460": {
    "daily": [
      {
        "date": "2026-04-02",
        "price": 79.93,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-14",
        "price": 88.28,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.45,
        "hold_days": 12
      }
    ]
  },
  "002428": {
    "daily": [
      {
        "date": "2026-04-03",
        "price": 51.71,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-13",
        "price": 55.13,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 6.61,
        "hold_days": 10
      }
    ]
  },
  "002348": {
    "daily": [
      {
        "date": "2026-04-07",
        "price": 8.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-08",
        "price": 8.86,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.06,
        "hold_days": 1
      }
    ]
  },
  "300651": {
    "daily": [
      {
        "date": "2026-04-07",
        "price": 32.4,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-10",
        "price": 30.94,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -4.51,
        "hold_days": 3
      }
    ]
  },
  "603929": {
    "daily": [
      {
        "date": "2026-04-08",
        "price": 180.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-14",
        "price": 190.35,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.22,
        "hold_days": 6
      }
    ]
  },
  "002429": {
    "daily": [
      {
        "date": "2026-04-08",
        "price": 10.23,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-22",
        "price": 11.91,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 16.42,
        "hold_days": 14
      }
    ]
  },
  "603659": {
    "daily": [
      {
        "date": "2026-04-09",
        "price": 31.68,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-14",
        "price": 34.93,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 10.26,
        "hold_days": 5
      }
    ]
  },
  "603052": {
    "daily": [
      {
        "date": "2026-04-09",
        "price": 66.26,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-16",
        "price": 75.77,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 14.35,
        "hold_days": 7
      }
    ]
  },
  "002263": {
    "daily": [
      {
        "date": "2026-04-10",
        "price": 4.9,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-14",
        "price": 4.94,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.82,
        "hold_days": 4
      }
    ]
  },
  "301312": {
    "daily": [
      {
        "date": "2026-04-13",
        "price": 122.74,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-14",
        "price": 122.7,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.03,
        "hold_days": 1
      }
    ]
  },
  "301292": {
    "daily": [
      {
        "date": "2026-04-13",
        "price": 89.05,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-15",
        "price": 93.32,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.8,
        "hold_days": 2
      }
    ]
  },
  "603118": {
    "daily": [
      {
        "date": "2026-04-13",
        "price": 14.18,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-21",
        "price": 14.44,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 1.83,
        "hold_days": 8
      }
    ]
  },
  "300936": {
    "daily": [
      {
        "date": "2026-04-14",
        "price": 70.0,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-15",
        "price": 66.2,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -5.43,
        "hold_days": 1
      }
    ]
  },
  "688195": {
    "daily": [
      {
        "date": "2026-04-14",
        "price": 333.28,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-16",
        "price": 342.26,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.69,
        "hold_days": 2
      }
    ]
  },
  "000586": {
    "daily": [
      {
        "date": "2026-04-14",
        "price": 23.19,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-17",
        "price": 19.4,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -16.34,
        "hold_days": 3
      }
    ]
  },
  "300400": {
    "daily": [
      {
        "date": "2026-04-14",
        "price": 27.6,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-21",
        "price": 27.66,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.22,
        "hold_days": 7
      }
    ]
  },
  "002579": {
    "daily": [
      {
        "date": "2026-04-14",
        "price": 13.03,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-24",
        "price": 12.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.61,
        "hold_days": 10
      }
    ]
  },
  "301191": {
    "daily": [
      {
        "date": "2026-04-15",
        "price": 151.02,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-23",
        "price": 150.16,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": -0.57,
        "hold_days": 8
      }
    ]
  },
  "603150": {
    "daily": [
      {
        "date": "2026-04-15",
        "price": 57.53,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-23",
        "price": 60.1,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.47,
        "hold_days": 8
      }
    ]
  },
  "002859": {
    "daily": [
      {
        "date": "2026-04-16",
        "price": 46.33,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-21",
        "price": 46.69,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 0.78,
        "hold_days": 5
      }
    ]
  },
  "603399": {
    "daily": [
      {
        "date": "2026-04-16",
        "price": 12.97,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-22",
        "price": 13.35,
        "type": "sell",
        "reason": "保3%利润",
        "reason_detail": "浮盈曾≥5%，PROT_ADJ利润不足3%且收盘利润≤3%，保3%利润卖出",
        "pnl_pct": 2.93,
        "hold_days": 6
      }
    ]
  },
  "600156": {
    "daily": [
      {
        "date": "2026-04-16",
        "price": 8.42,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-24",
        "price": 9.12,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 8.31,
        "hold_days": 8
      }
    ]
  },
  "600522": {
    "daily": [
      {
        "date": "2026-04-20",
        "price": 30.95,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-22",
        "price": 34.82,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 12.5,
        "hold_days": 2
      }
    ]
  },
  "000890": {
    "daily": [
      {
        "date": "2026-04-20",
        "price": 13.55,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-22",
        "price": 15.24,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 12.47,
        "hold_days": 2
      }
    ]
  },
  "688661": {
    "daily": [
      {
        "date": "2026-04-21",
        "price": 103.44,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-22",
        "price": 119.26,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 15.29,
        "hold_days": 1
      }
    ]
  },
  "000056": {
    "daily": [
      {
        "date": "2026-04-21",
        "price": 2.07,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-29",
        "price": 1.83,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.59,
        "hold_days": 8
      }
    ]
  },
  "003036": {
    "daily": [
      {
        "date": "2026-04-23",
        "price": 30.54,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-28",
        "price": 33.83,
        "type": "sell",
        "reason": "PROT_ADJ止盈(>10%)",
        "reason_detail": "浮盈曾≥10%且PROT_ADJ已高于10%利润线，收盘跌破PROT_ADJ，更大获利卖出",
        "pnl_pct": 10.77,
        "hold_days": 5
      }
    ]
  },
  "603912": {
    "daily": [
      {
        "date": "2026-04-23",
        "price": 11.46,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-28",
        "price": 10.13,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -11.61,
        "hold_days": 5
      }
    ]
  },
  "300097": {
    "daily": [
      {
        "date": "2026-04-24",
        "price": 10.5,
        "type": "buy",
        "reason": "signal",
        "reason_detail": {}
      },
      {
        "date": "2026-04-29",
        "price": 10.98,
        "type": "sell",
        "reason": "保10%利润",
        "reason_detail": "浮盈曾≥10%，盘中最低价跌破10%利润线但未破PROT_ADJ，保10%利润卖出",
        "pnl_pct": 4.57,
        "hold_days": 5
      }
    ]
  }
};
