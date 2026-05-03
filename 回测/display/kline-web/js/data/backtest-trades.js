// 自动生成，请勿手动编辑
// 来源: 引擎回测_prot_adj_2025-01-02_2025-12-31.xlsx
// 交易: 607 笔, 股票: 521 只
// 原因映射: 买入=['均线多头+涨停基因+5日线上'], 卖出=['PROT_ADJ移动止盈', '-10%固定止损', 'PROT_ADJ移动止盈', '保10%利润', '保3%利润', 'PROT_ADJ止盈(>10%)', '四天急跌5%止盈']
var BACKTEST_TRADES = {
  "600778": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 10.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-03",
        "price": 9.0,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.0,
        "hold_days": 1
      }
    ]
  },
  "002582": {
    "daily": [
      {
        "date": "2025-01-02",
        "price": 8.11,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-03",
        "price": 7.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.08,
        "hold_days": 1
      }
    ]
  },
  "603893": {
    "daily": [
      {
        "date": "2025-01-10",
        "price": 125.8,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-13",
        "price": 119.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.77,
        "hold_days": 3
      }
    ]
  },
  "603986": {
    "daily": [
      {
        "date": "2025-01-10",
        "price": 120.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-13",
        "price": 117.51,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.21,
        "hold_days": 3
      }
    ]
  },
  "002335": {
    "daily": [
      {
        "date": "2025-01-15",
        "price": 30.29,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-17",
        "price": 31.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.83,
        "hold_days": 2
      }
    ]
  },
  "300432": {
    "daily": [
      {
        "date": "2025-01-16",
        "price": 11.84,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-17",
        "price": 12.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.28,
        "hold_days": 1
      }
    ]
  },
  "000962": {
    "daily": [
      {
        "date": "2025-01-16",
        "price": 15.32,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-20",
        "price": 14.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.37,
        "hold_days": 4
      }
    ]
  },
  "002543": {
    "daily": [
      {
        "date": "2025-01-17",
        "price": 11.68,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-20",
        "price": 12.87,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.19,
        "hold_days": 3
      }
    ]
  },
  "000951": {
    "daily": [
      {
        "date": "2025-01-17",
        "price": 18.54,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-21",
        "price": 18.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.48,
        "hold_days": 4
      }
    ]
  },
  "002334": {
    "daily": [
      {
        "date": "2025-01-17",
        "price": 7.54,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-27",
        "price": 7.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.05,
        "hold_days": 10
      }
    ]
  },
  "603728": {
    "daily": [
      {
        "date": "2025-01-20",
        "price": 60.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-21",
        "price": 64.49,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.76,
        "hold_days": 1
      }
    ]
  },
  "002698": {
    "daily": [
      {
        "date": "2025-01-20",
        "price": 17.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-23",
        "price": 17.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.22,
        "hold_days": 3
      }
    ]
  },
  "603109": {
    "daily": [
      {
        "date": "2025-01-20",
        "price": 18.06,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-23",
        "price": 17.2,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.76,
        "hold_days": 3
      }
    ]
  },
  "002815": {
    "daily": [
      {
        "date": "2025-01-20",
        "price": 10.76,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-27",
        "price": 10.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.55,
        "hold_days": 7
      },
      {
        "date": "2025-09-19",
        "price": 16.8,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-22",
        "price": 16.73,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.42,
        "hold_days": 3
      }
    ]
  },
  "600480": {
    "daily": [
      {
        "date": "2025-01-21",
        "price": 8.88,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-22",
        "price": 9.58,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.88,
        "hold_days": 1
      }
    ]
  },
  "300433": {
    "daily": [
      {
        "date": "2025-01-22",
        "price": 24.64,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-23",
        "price": 24.02,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.52,
        "hold_days": 1
      }
    ]
  },
  "688668": {
    "daily": [
      {
        "date": "2025-01-22",
        "price": 53.88,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-23",
        "price": 56.61,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.07,
        "hold_days": 1
      }
    ]
  },
  "300693": {
    "daily": [
      {
        "date": "2025-01-23",
        "price": 29.32,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-24",
        "price": 30.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.71,
        "hold_days": 1
      }
    ]
  },
  "603912": {
    "daily": [
      {
        "date": "2025-01-23",
        "price": 8.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-24",
        "price": 8.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.43,
        "hold_days": 1
      }
    ]
  },
  "603915": {
    "daily": [
      {
        "date": "2025-01-23",
        "price": 13.83,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-01-24",
        "price": 14.84,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.3,
        "hold_days": 1
      }
    ]
  },
  "301186": {
    "daily": [
      {
        "date": "2025-02-06",
        "price": 43.41,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-07",
        "price": 47.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 8.94,
        "hold_days": 1
      }
    ]
  },
  "301503": {
    "daily": [
      {
        "date": "2025-02-06",
        "price": 39.01,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-10",
        "price": 40.63,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.15,
        "hold_days": 4
      }
    ]
  },
  "002480": {
    "daily": [
      {
        "date": "2025-02-06",
        "price": 5.37,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-11",
        "price": 5.32,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.93,
        "hold_days": 5
      }
    ]
  },
  "300926": {
    "daily": [
      {
        "date": "2025-02-06",
        "price": 25.55,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-12",
        "price": 25.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.11,
        "hold_days": 6
      }
    ]
  },
  "300124": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 68.59,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-10",
        "price": 67.87,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.05,
        "hold_days": 3
      }
    ]
  },
  "603191": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 14.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-10",
        "price": 14.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.23,
        "hold_days": 3
      }
    ]
  },
  "688213": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 82.72,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-10",
        "price": 85.21,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.01,
        "hold_days": 3
      }
    ]
  },
  "603219": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 15.67,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-11",
        "price": 15.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.47,
        "hold_days": 4
      }
    ]
  },
  "600215": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 8.32,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-12",
        "price": 8.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.61,
        "hold_days": 5
      }
    ]
  },
  "603990": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 12.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-13",
        "price": 13.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.98,
        "hold_days": 6
      },
      {
        "date": "2025-03-07",
        "price": 15.93,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-10",
        "price": 16.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.39,
        "hold_days": 3
      },
      {
        "date": "2025-06-11",
        "price": 16.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-12",
        "price": 15.87,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.37,
        "hold_days": 1
      }
    ]
  },
  "605118": {
    "daily": [
      {
        "date": "2025-02-07",
        "price": 19.34,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-14",
        "price": 18.25,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.64,
        "hold_days": 7
      },
      {
        "date": "2025-02-21",
        "price": 19.68,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-28",
        "price": 18.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.23,
        "hold_days": 7
      }
    ]
  },
  "000795": {
    "daily": [
      {
        "date": "2025-02-10",
        "price": 11.89,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-12",
        "price": 11.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.93,
        "hold_days": 2
      }
    ]
  },
  "600592": {
    "daily": [
      {
        "date": "2025-02-10",
        "price": 11.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-17",
        "price": 11.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.59,
        "hold_days": 7
      }
    ]
  },
  "002594": {
    "daily": [
      {
        "date": "2025-02-11",
        "price": 108.64,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-12",
        "price": 113.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.65,
        "hold_days": 1
      }
    ]
  },
  "603920": {
    "daily": [
      {
        "date": "2025-02-11",
        "price": 36.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-12",
        "price": 37.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.89,
        "hold_days": 1
      },
      {
        "date": "2025-09-01",
        "price": 39.25,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-02",
        "price": 36.6,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.75,
        "hold_days": 1
      }
    ]
  },
  "002148": {
    "daily": [
      {
        "date": "2025-02-11",
        "price": 7.36,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-14",
        "price": 7.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.36,
        "hold_days": 3
      },
      {
        "date": "2025-02-17",
        "price": 7.52,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-18",
        "price": 7.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.86,
        "hold_days": 1
      }
    ]
  },
  "002396": {
    "daily": [
      {
        "date": "2025-02-11",
        "price": 20.71,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-14",
        "price": 21.36,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.14,
        "hold_days": 3
      }
    ]
  },
  "002913": {
    "daily": [
      {
        "date": "2025-02-11",
        "price": 28.15,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-18",
        "price": 28.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.07,
        "hold_days": 7
      }
    ]
  },
  "002967": {
    "daily": [
      {
        "date": "2025-02-11",
        "price": 18.65,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-18",
        "price": 18.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.9,
        "hold_days": 7
      }
    ]
  },
  "300843": {
    "daily": [
      {
        "date": "2025-02-12",
        "price": 35.17,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-13",
        "price": 33.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.83,
        "hold_days": 1
      }
    ]
  },
  "301011": {
    "daily": [
      {
        "date": "2025-02-12",
        "price": 31.99,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-13",
        "price": 30.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.47,
        "hold_days": 1
      }
    ]
  },
  "002209": {
    "daily": [
      {
        "date": "2025-02-12",
        "price": 10.68,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-14",
        "price": 10.32,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.37,
        "hold_days": 2
      },
      {
        "date": "2025-02-20",
        "price": 10.71,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-27",
        "price": 11.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.48,
        "hold_days": 7
      },
      {
        "date": "2025-03-11",
        "price": 11.29,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-14",
        "price": 11.48,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.68,
        "hold_days": 3
      },
      {
        "date": "2025-08-06",
        "price": 16.48,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-22",
        "price": 17.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.34,
        "hold_days": 16
      }
    ]
  },
  "002906": {
    "daily": [
      {
        "date": "2025-02-13",
        "price": 34.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-14",
        "price": 35.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.34,
        "hold_days": 1
      }
    ]
  },
  "300727": {
    "daily": [
      {
        "date": "2025-02-13",
        "price": 24.11,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-14",
        "price": 22.73,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.72,
        "hold_days": 1
      }
    ]
  },
  "002468": {
    "daily": [
      {
        "date": "2025-02-13",
        "price": 11.03,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-18",
        "price": 10.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.09,
        "hold_days": 5
      }
    ]
  },
  "002600": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 9.91,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-18",
        "price": 9.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.74,
        "hold_days": 1
      }
    ]
  },
  "300292": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 5.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
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
  "300449": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 9.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-18",
        "price": 8.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.43,
        "hold_days": 1
      }
    ]
  },
  "603118": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 10.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-18",
        "price": 10.34,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.14,
        "hold_days": 1
      },
      {
        "date": "2025-02-24",
        "price": 12.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-25",
        "price": 12.48,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.57,
        "hold_days": 1
      }
    ]
  },
  "603232": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 15.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-18",
        "price": 14.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.0,
        "hold_days": 1
      }
    ]
  },
  "002322": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 13.78,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-28",
        "price": 12.84,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.82,
        "hold_days": 11
      }
    ]
  },
  "001208": {
    "daily": [
      {
        "date": "2025-02-17",
        "price": 9.95,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-03",
        "price": 10.18,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.31,
        "hold_days": 14
      },
      {
        "date": "2025-12-16",
        "price": 19.77,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-17",
        "price": 20.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.21,
        "hold_days": 1
      }
    ]
  },
  "002960": {
    "daily": [
      {
        "date": "2025-02-18",
        "price": 9.71,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-19",
        "price": 10.2,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.05,
        "hold_days": 1
      }
    ]
  },
  "605060": {
    "daily": [
      {
        "date": "2025-02-18",
        "price": 20.81,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-21",
        "price": 23.51,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 12.97,
        "hold_days": 3
      }
    ]
  },
  "002090": {
    "daily": [
      {
        "date": "2025-02-19",
        "price": 9.46,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-28",
        "price": 9.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.33,
        "hold_days": 9
      }
    ]
  },
  "002358": {
    "daily": [
      {
        "date": "2025-02-20",
        "price": 5.14,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-21",
        "price": 5.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.31,
        "hold_days": 1
      }
    ]
  },
  "002899": {
    "daily": [
      {
        "date": "2025-02-20",
        "price": 26.97,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-21",
        "price": 26.16,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.0,
        "hold_days": 1
      }
    ]
  },
  "001380": {
    "daily": [
      {
        "date": "2025-02-20",
        "price": 19.34,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-24",
        "price": 19.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.15,
        "hold_days": 4
      }
    ]
  },
  "002689": {
    "daily": [
      {
        "date": "2025-02-20",
        "price": 4.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-25",
        "price": 4.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.44,
        "hold_days": 5
      }
    ]
  },
  "002278": {
    "daily": [
      {
        "date": "2025-02-20",
        "price": 5.66,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-13",
        "price": 6.32,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 11.66,
        "hold_days": 21
      }
    ]
  },
  "002364": {
    "daily": [
      {
        "date": "2025-02-21",
        "price": 18.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-24",
        "price": 19.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.71,
        "hold_days": 3
      }
    ]
  },
  "300224": {
    "daily": [
      {
        "date": "2025-02-21",
        "price": 14.57,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-24",
        "price": 14.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.89,
        "hold_days": 3
      }
    ]
  },
  "002362": {
    "daily": [
      {
        "date": "2025-02-21",
        "price": 27.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-27",
        "price": 25.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.2,
        "hold_days": 6
      }
    ]
  },
  "603012": {
    "daily": [
      {
        "date": "2025-02-21",
        "price": 5.48,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-03",
        "price": 5.6,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.19,
        "hold_days": 10
      }
    ]
  },
  "301310": {
    "daily": [
      {
        "date": "2025-02-24",
        "price": 31.49,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-25",
        "price": 32.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.97,
        "hold_days": 1
      }
    ]
  },
  "001324": {
    "daily": [
      {
        "date": "2025-02-24",
        "price": 19.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-27",
        "price": 18.79,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.29,
        "hold_days": 3
      }
    ]
  },
  "002632": {
    "daily": [
      {
        "date": "2025-02-24",
        "price": 9.25,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-28",
        "price": 8.99,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.81,
        "hold_days": 4
      },
      {
        "date": "2025-11-13",
        "price": 11.12,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-17",
        "price": 10.79,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.97,
        "hold_days": 4
      }
    ]
  },
  "688548": {
    "daily": [
      {
        "date": "2025-02-25",
        "price": 10.93,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-26",
        "price": 10.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.27,
        "hold_days": 1
      }
    ]
  },
  "002212": {
    "daily": [
      {
        "date": "2025-02-26",
        "price": 9.31,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-27",
        "price": 9.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.69,
        "hold_days": 1
      }
    ]
  },
  "002254": {
    "daily": [
      {
        "date": "2025-02-27",
        "price": 10.29,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-28",
        "price": 10.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.04,
        "hold_days": 1
      }
    ]
  },
  "002639": {
    "daily": [
      {
        "date": "2025-02-27",
        "price": 7.82,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-28",
        "price": 7.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.37,
        "hold_days": 1
      }
    ]
  },
  "603660": {
    "daily": [
      {
        "date": "2025-02-27",
        "price": 8.94,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-28",
        "price": 9.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.59,
        "hold_days": 1
      }
    ]
  },
  "603926": {
    "daily": [
      {
        "date": "2025-02-27",
        "price": 10.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-02-28",
        "price": 9.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.68,
        "hold_days": 1
      },
      {
        "date": "2025-03-17",
        "price": 10.62,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-20",
        "price": 11.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.82,
        "hold_days": 3
      }
    ]
  },
  "002227": {
    "daily": [
      {
        "date": "2025-03-04",
        "price": 15.15,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-05",
        "price": 13.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.38,
        "hold_days": 1
      }
    ]
  },
  "600184": {
    "daily": [
      {
        "date": "2025-03-04",
        "price": 12.73,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-10",
        "price": 14.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.21,
        "hold_days": 6
      }
    ]
  },
  "688151": {
    "daily": [
      {
        "date": "2025-03-05",
        "price": 18.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-14",
        "price": 18.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.82,
        "hold_days": 9
      }
    ]
  },
  "002523": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 3.78,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-07",
        "price": 3.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.32,
        "hold_days": 1
      }
    ]
  },
  "002937": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 21.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-07",
        "price": 23.64,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.21,
        "hold_days": 1
      }
    ]
  },
  "300451": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 6.87,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-07",
        "price": 6.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.62,
        "hold_days": 1
      }
    ]
  },
  "300777": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 34.13,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-07",
        "price": 34.84,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.08,
        "hold_days": 1
      }
    ]
  },
  "000528": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 12.41,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-10",
        "price": 13.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.64,
        "hold_days": 4
      }
    ]
  },
  "600105": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 6.06,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-10",
        "price": 5.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.48,
        "hold_days": 4
      },
      {
        "date": "2025-05-14",
        "price": 7.22,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-16",
        "price": 7.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.37,
        "hold_days": 2
      },
      {
        "date": "2025-12-22",
        "price": 21.54,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-23",
        "price": 21.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.49,
        "hold_days": 1
      }
    ]
  },
  "002933": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 37.52,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-11",
        "price": 38.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.41,
        "hold_days": 5
      }
    ]
  },
  "301181": {
    "daily": [
      {
        "date": "2025-03-06",
        "price": 25.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-11",
        "price": 24.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.46,
        "hold_days": 5
      },
      {
        "date": "2025-03-20",
        "price": 26.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-21",
        "price": 25.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.31,
        "hold_days": 1
      }
    ]
  },
  "002921": {
    "daily": [
      {
        "date": "2025-03-07",
        "price": 13.76,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-10",
        "price": 15.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.03,
        "hold_days": 3
      }
    ]
  },
  "300881": {
    "daily": [
      {
        "date": "2025-03-07",
        "price": 33.04,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-10",
        "price": 32.2,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.54,
        "hold_days": 3
      }
    ]
  },
  "301135": {
    "daily": [
      {
        "date": "2025-03-07",
        "price": 28.14,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-10",
        "price": 27.58,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.99,
        "hold_days": 3
      }
    ]
  },
  "002097": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 8.64,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-11",
        "price": 8.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.27,
        "hold_days": 1
      }
    ]
  },
  "002553": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 16.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-11",
        "price": 16.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.12,
        "hold_days": 1
      }
    ]
  },
  "300580": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 36.1,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-11",
        "price": 34.33,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.9,
        "hold_days": 1
      }
    ]
  },
  "603082": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 45.07,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-11",
        "price": 44.41,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.46,
        "hold_days": 1
      }
    ]
  },
  "603579": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 16.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-11",
        "price": 17.25,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.07,
        "hold_days": 1
      }
    ]
  },
  "688110": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 31.6,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-12",
        "price": 32.49,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.82,
        "hold_days": 2
      }
    ]
  },
  "601002": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 5.02,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-14",
        "price": 4.93,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.79,
        "hold_days": 4
      }
    ]
  },
  "002943": {
    "daily": [
      {
        "date": "2025-03-10",
        "price": 21.6,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-17",
        "price": 22.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.45,
        "hold_days": 7
      }
    ]
  },
  "688059": {
    "daily": [
      {
        "date": "2025-03-11",
        "price": 45.42,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-12",
        "price": 47.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.84,
        "hold_days": 1
      }
    ]
  },
  "300894": {
    "daily": [
      {
        "date": "2025-03-11",
        "price": 16.49,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-13",
        "price": 15.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.31,
        "hold_days": 2
      },
      {
        "date": "2025-03-18",
        "price": 16.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-20",
        "price": 16.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.35,
        "hold_days": 2
      }
    ]
  },
  "301029": {
    "daily": [
      {
        "date": "2025-03-11",
        "price": 30.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-13",
        "price": 28.24,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.87,
        "hold_days": 2
      }
    ]
  },
  "002010": {
    "daily": [
      {
        "date": "2025-03-12",
        "price": 5.48,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-13",
        "price": 5.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.83,
        "hold_days": 1
      }
    ]
  },
  "002056": {
    "daily": [
      {
        "date": "2025-03-12",
        "price": 14.28,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-21",
        "price": 14.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.2,
        "hold_days": 9
      }
    ]
  },
  "002420": {
    "daily": [
      {
        "date": "2025-03-13",
        "price": 6.35,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-14",
        "price": 6.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.73,
        "hold_days": 1
      }
    ]
  },
  "301228": {
    "daily": [
      {
        "date": "2025-03-14",
        "price": 19.31,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-17",
        "price": 19.05,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.35,
        "hold_days": 3
      }
    ]
  },
  "603773": {
    "daily": [
      {
        "date": "2025-03-14",
        "price": 26.79,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-17",
        "price": 28.33,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.75,
        "hold_days": 3
      },
      {
        "date": "2025-07-29",
        "price": 28.27,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-30",
        "price": 27.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.49,
        "hold_days": 1
      }
    ]
  },
  "002660": {
    "daily": [
      {
        "date": "2025-03-14",
        "price": 11.25,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-18",
        "price": 11.2,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.44,
        "hold_days": 4
      }
    ]
  },
  "600601": {
    "daily": [
      {
        "date": "2025-03-17",
        "price": 5.44,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-18",
        "price": 5.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.76,
        "hold_days": 1
      },
      {
        "date": "2025-07-29",
        "price": 6.12,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-31",
        "price": 6.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.33,
        "hold_days": 2
      }
    ]
  },
  "002080": {
    "daily": [
      {
        "date": "2025-03-17",
        "price": 14.67,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-19",
        "price": 14.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.75,
        "hold_days": 2
      },
      {
        "date": "2025-07-15",
        "price": 24.8,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-17",
        "price": 26.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.66,
        "hold_days": 2
      }
    ]
  },
  "002536": {
    "daily": [
      {
        "date": "2025-03-17",
        "price": 17.62,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-19",
        "price": 16.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.97,
        "hold_days": 2
      },
      {
        "date": "2025-08-06",
        "price": 19.59,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-07",
        "price": 20.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.27,
        "hold_days": 1
      }
    ]
  },
  "002993": {
    "daily": [
      {
        "date": "2025-03-17",
        "price": 46.1,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-19",
        "price": 44.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.62,
        "hold_days": 2
      }
    ]
  },
  "301021": {
    "daily": [
      {
        "date": "2025-03-18",
        "price": 34.76,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-19",
        "price": 32.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.55,
        "hold_days": 1
      }
    ]
  },
  "605058": {
    "daily": [
      {
        "date": "2025-03-18",
        "price": 25.48,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-19",
        "price": 24.84,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.51,
        "hold_days": 1
      }
    ]
  },
  "300307": {
    "daily": [
      {
        "date": "2025-03-18",
        "price": 10.12,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-20",
        "price": 10.2,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.79,
        "hold_days": 2
      }
    ]
  },
  "300733": {
    "daily": [
      {
        "date": "2025-03-18",
        "price": 17.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-20",
        "price": 18.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.9,
        "hold_days": 2
      }
    ]
  },
  "603348": {
    "daily": [
      {
        "date": "2025-03-18",
        "price": 26.55,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-21",
        "price": 25.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.67,
        "hold_days": 3
      }
    ]
  },
  "002630": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 4.73,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-20",
        "price": 4.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.48,
        "hold_days": 1
      }
    ]
  },
  "300095": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 7.32,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-20",
        "price": 7.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.78,
        "hold_days": 1
      }
    ]
  },
  "600735": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 5.97,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-20",
        "price": 5.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.0,
        "hold_days": 1
      }
    ]
  },
  "688722": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 17.43,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-20",
        "price": 18.79,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.8,
        "hold_days": 1
      }
    ]
  },
  "300466": {
    "daily": [
      {
        "date": "2025-03-19",
        "price": 9.73,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-21",
        "price": 8.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.12,
        "hold_days": 2
      }
    ]
  },
  "002207": {
    "daily": [
      {
        "date": "2025-03-20",
        "price": 5.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-21",
        "price": 6.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.01,
        "hold_days": 1
      }
    ]
  },
  "688386": {
    "daily": [
      {
        "date": "2025-03-20",
        "price": 35.31,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-21",
        "price": 34.38,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.63,
        "hold_days": 1
      }
    ]
  },
  "000932": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 5.3,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-24",
        "price": 5.15,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.83,
        "hold_days": 3
      }
    ]
  },
  "301232": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 29.51,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-24",
        "price": 27.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.86,
        "hold_days": 3
      }
    ]
  },
  "600179": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 2.93,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-24",
        "price": 3.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.44,
        "hold_days": 3
      },
      {
        "date": "2025-12-23",
        "price": 4.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-24",
        "price": 5.41,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 9.96,
        "hold_days": 1
      }
    ]
  },
  "603333": {
    "daily": [
      {
        "date": "2025-03-21",
        "price": 5.41,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-24",
        "price": 5.28,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.4,
        "hold_days": 3
      }
    ]
  },
  "000507": {
    "daily": [
      {
        "date": "2025-03-24",
        "price": 5.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-25",
        "price": 5.36,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.65,
        "hold_days": 1
      },
      {
        "date": "2025-04-28",
        "price": 5.51,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-29",
        "price": 5.37,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.54,
        "hold_days": 1
      }
    ]
  },
  "002667": {
    "daily": [
      {
        "date": "2025-03-25",
        "price": 11.33,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-28",
        "price": 10.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.71,
        "hold_days": 3
      }
    ]
  },
  "601399": {
    "daily": [
      {
        "date": "2025-03-26",
        "price": 3.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-27",
        "price": 3.12,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.41,
        "hold_days": 1
      }
    ]
  },
  "601611": {
    "daily": [
      {
        "date": "2025-03-26",
        "price": 8.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-27",
        "price": 8.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.01,
        "hold_days": 1
      },
      {
        "date": "2025-12-22",
        "price": 12.84,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-26",
        "price": 13.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.62,
        "hold_days": 4
      }
    ]
  },
  "301393": {
    "daily": [
      {
        "date": "2025-03-27",
        "price": 45.1,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-03-28",
        "price": 46.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.13,
        "hold_days": 1
      }
    ]
  },
  "000963": {
    "daily": [
      {
        "date": "2025-03-28",
        "price": 35.97,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-01",
        "price": 37.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.23,
        "hold_days": 4
      },
      {
        "date": "2025-04-21",
        "price": 38.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-23",
        "price": 38.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.96,
        "hold_days": 2
      }
    ]
  },
  "688117": {
    "daily": [
      {
        "date": "2025-04-02",
        "price": 21.7,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-03",
        "price": 21.07,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.9,
        "hold_days": 1
      }
    ]
  },
  "002793": {
    "daily": [
      {
        "date": "2025-04-02",
        "price": 4.01,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-07",
        "price": 3.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.23,
        "hold_days": 5
      }
    ]
  },
  "605011": {
    "daily": [
      {
        "date": "2025-04-03",
        "price": 26.33,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-07",
        "price": 23.68,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.06,
        "hold_days": 4
      }
    ]
  },
  "600211": {
    "daily": [
      {
        "date": "2025-04-03",
        "price": 37.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-07",
        "price": 33.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.98,
        "hold_days": 4
      }
    ]
  },
  "600371": {
    "daily": [
      {
        "date": "2025-04-08",
        "price": 10.49,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-10",
        "price": 12.05,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 14.87,
        "hold_days": 2
      }
    ]
  },
  "600180": {
    "daily": [
      {
        "date": "2025-04-09",
        "price": 4.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-11",
        "price": 5.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 15.46,
        "hold_days": 2
      }
    ]
  },
  "000888": {
    "daily": [
      {
        "date": "2025-04-14",
        "price": 14.8,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-16",
        "price": 14.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.81,
        "hold_days": 2
      }
    ]
  },
  "002216": {
    "daily": [
      {
        "date": "2025-04-14",
        "price": 11.7,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-23",
        "price": 11.42,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.39,
        "hold_days": 9
      }
    ]
  },
  "301201": {
    "daily": [
      {
        "date": "2025-04-22",
        "price": 22.01,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-23",
        "price": 21.42,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.68,
        "hold_days": 1
      }
    ]
  },
  "688302": {
    "daily": [
      {
        "date": "2025-04-22",
        "price": 40.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-23",
        "price": 38.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.09,
        "hold_days": 1
      }
    ]
  },
  "002422": {
    "daily": [
      {
        "date": "2025-04-22",
        "price": 35.08,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-24",
        "price": 34.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.66,
        "hold_days": 2
      }
    ]
  },
  "600866": {
    "daily": [
      {
        "date": "2025-04-22",
        "price": 7.51,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-24",
        "price": 7.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.86,
        "hold_days": 2
      },
      {
        "date": "2025-05-06",
        "price": 7.32,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-07",
        "price": 7.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.28,
        "hold_days": 1
      }
    ]
  },
  "002330": {
    "daily": [
      {
        "date": "2025-04-22",
        "price": 4.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-28",
        "price": 4.21,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.68,
        "hold_days": 6
      }
    ]
  },
  "002042": {
    "daily": [
      {
        "date": "2025-04-23",
        "price": 6.25,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-24",
        "price": 6.07,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.88,
        "hold_days": 1
      },
      {
        "date": "2025-09-17",
        "price": 5.59,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-18",
        "price": 5.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.25,
        "hold_days": 1
      }
    ]
  },
  "002365": {
    "daily": [
      {
        "date": "2025-04-23",
        "price": 11.15,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-24",
        "price": 12.28,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.13,
        "hold_days": 1
      }
    ]
  },
  "002853": {
    "daily": [
      {
        "date": "2025-04-23",
        "price": 14.96,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-24",
        "price": 14.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.67,
        "hold_days": 1
      },
      {
        "date": "2025-05-08",
        "price": 14.87,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-12",
        "price": 13.63,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.34,
        "hold_days": 4
      }
    ]
  },
  "603566": {
    "daily": [
      {
        "date": "2025-04-25",
        "price": 13.1,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-29",
        "price": 13.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.08,
        "hold_days": 4
      }
    ]
  },
  "600578": {
    "daily": [
      {
        "date": "2025-04-28",
        "price": 4.1,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-04-29",
        "price": 3.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.1,
        "hold_days": 1
      }
    ]
  },
  "600967": {
    "daily": [
      {
        "date": "2025-05-06",
        "price": 11.75,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-07",
        "price": 12.61,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.32,
        "hold_days": 1
      }
    ]
  },
  "688160": {
    "daily": [
      {
        "date": "2025-05-06",
        "price": 105.52,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-07",
        "price": 103.6,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.82,
        "hold_days": 1
      }
    ]
  },
  "000017": {
    "daily": [
      {
        "date": "2025-05-06",
        "price": 6.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-08",
        "price": 6.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.36,
        "hold_days": 2
      }
    ]
  },
  "688089": {
    "daily": [
      {
        "date": "2025-05-06",
        "price": 25.13,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-09",
        "price": 25.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.52,
        "hold_days": 3
      }
    ]
  },
  "600685": {
    "daily": [
      {
        "date": "2025-05-07",
        "price": 24.54,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-12",
        "price": 25.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.71,
        "hold_days": 5
      },
      {
        "date": "2025-12-10",
        "price": 30.41,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-11",
        "price": 29.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.65,
        "hold_days": 1
      }
    ]
  },
  "002838": {
    "daily": [
      {
        "date": "2025-05-08",
        "price": 16.19,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-09",
        "price": 17.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.68,
        "hold_days": 1
      }
    ]
  },
  "301613": {
    "daily": [
      {
        "date": "2025-05-08",
        "price": 48.15,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-09",
        "price": 46.72,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.97,
        "hold_days": 1
      }
    ]
  },
  "601177": {
    "daily": [
      {
        "date": "2025-05-08",
        "price": 20.81,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-09",
        "price": 19.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.13,
        "hold_days": 1
      }
    ]
  },
  "603313": {
    "daily": [
      {
        "date": "2025-05-08",
        "price": 7.93,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-12",
        "price": 8.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.88,
        "hold_days": 4
      }
    ]
  },
  "002297": {
    "daily": [
      {
        "date": "2025-05-09",
        "price": 7.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-12",
        "price": 7.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.62,
        "hold_days": 3
      }
    ]
  },
  "002977": {
    "daily": [
      {
        "date": "2025-05-09",
        "price": 40.07,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-12",
        "price": 44.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.06,
        "hold_days": 3
      }
    ]
  },
  "301040": {
    "daily": [
      {
        "date": "2025-05-09",
        "price": 22.28,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-12",
        "price": 24.77,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 11.18,
        "hold_days": 3
      }
    ]
  },
  "600343": {
    "daily": [
      {
        "date": "2025-05-09",
        "price": 11.69,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-12",
        "price": 12.07,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.25,
        "hold_days": 3
      }
    ]
  },
  "301022": {
    "daily": [
      {
        "date": "2025-05-12",
        "price": 28.49,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-14",
        "price": 27.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.81,
        "hold_days": 2
      }
    ]
  },
  "605055": {
    "daily": [
      {
        "date": "2025-05-12",
        "price": 6.93,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-14",
        "price": 8.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 21.21,
        "hold_days": 2
      }
    ]
  },
  "301108": {
    "daily": [
      {
        "date": "2025-05-12",
        "price": 19.96,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-15",
        "price": 24.05,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 20.49,
        "hold_days": 3
      }
    ]
  },
  "002190": {
    "daily": [
      {
        "date": "2025-05-12",
        "price": 24.51,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-19",
        "price": 39.48,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 61.08,
        "hold_days": 7
      }
    ]
  },
  "603605": {
    "daily": [
      {
        "date": "2025-05-12",
        "price": 95.26,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-19",
        "price": 95.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.71,
        "hold_days": 7
      }
    ]
  },
  "002378": {
    "daily": [
      {
        "date": "2025-05-14",
        "price": 7.7,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-15",
        "price": 7.93,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.99,
        "hold_days": 1
      }
    ]
  },
  "688128": {
    "daily": [
      {
        "date": "2025-05-14",
        "price": 24.85,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-19",
        "price": 24.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.18,
        "hold_days": 5
      }
    ]
  },
  "600053": {
    "daily": [
      {
        "date": "2025-05-15",
        "price": 14.76,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-16",
        "price": 14.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.15,
        "hold_days": 1
      }
    ]
  },
  "002054": {
    "daily": [
      {
        "date": "2025-05-15",
        "price": 6.53,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-30",
        "price": 6.64,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.68,
        "hold_days": 15
      }
    ]
  },
  "002386": {
    "daily": [
      {
        "date": "2025-05-15",
        "price": 4.6,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-19",
        "price": 4.6,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.0,
        "hold_days": 35
      }
    ]
  },
  "001368": {
    "daily": [
      {
        "date": "2025-05-16",
        "price": 21.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-20",
        "price": 22.35,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.96,
        "hold_days": 4
      }
    ]
  },
  "301526": {
    "daily": [
      {
        "date": "2025-05-16",
        "price": 3.79,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-23",
        "price": 3.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.9,
        "hold_days": 7
      }
    ]
  },
  "000881": {
    "daily": [
      {
        "date": "2025-05-16",
        "price": 7.29,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-26",
        "price": 8.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.29,
        "hold_days": 10
      },
      {
        "date": "2025-07-08",
        "price": 8.86,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-10",
        "price": 8.38,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.42,
        "hold_days": 2
      }
    ]
  },
  "000026": {
    "daily": [
      {
        "date": "2025-05-19",
        "price": 12.36,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-20",
        "price": 12.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.35,
        "hold_days": 1
      }
    ]
  },
  "600844": {
    "daily": [
      {
        "date": "2025-05-19",
        "price": 3.3,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-22",
        "price": 3.15,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.55,
        "hold_days": 3
      }
    ]
  },
  "301210": {
    "daily": [
      {
        "date": "2025-05-20",
        "price": 51.67,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-21",
        "price": 51.58,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.17,
        "hold_days": 1
      }
    ]
  },
  "002513": {
    "daily": [
      {
        "date": "2025-05-20",
        "price": 4.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-22",
        "price": 4.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.41,
        "hold_days": 2
      },
      {
        "date": "2025-05-27",
        "price": 5.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-29",
        "price": 4.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.8,
        "hold_days": 2
      }
    ]
  },
  "002695": {
    "daily": [
      {
        "date": "2025-05-20",
        "price": 10.62,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-22",
        "price": 10.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.3,
        "hold_days": 2
      }
    ]
  },
  "301103": {
    "daily": [
      {
        "date": "2025-05-21",
        "price": 21.1,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-26",
        "price": 20.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.42,
        "hold_days": 5
      }
    ]
  },
  "002382": {
    "daily": [
      {
        "date": "2025-05-21",
        "price": 5.47,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-13",
        "price": 5.49,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.37,
        "hold_days": 23
      }
    ]
  },
  "002846": {
    "daily": [
      {
        "date": "2025-05-23",
        "price": 11.31,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-26",
        "price": 11.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.09,
        "hold_days": 3
      }
    ]
  },
  "000967": {
    "daily": [
      {
        "date": "2025-05-26",
        "price": 6.94,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-27",
        "price": 7.28,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.9,
        "hold_days": 1
      }
    ]
  },
  "605599": {
    "daily": [
      {
        "date": "2025-05-27",
        "price": 14.5,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-28",
        "price": 16.02,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.48,
        "hold_days": 1
      }
    ]
  },
  "002277": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 6.59,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-29",
        "price": 6.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.82,
        "hold_days": 1
      },
      {
        "date": "2025-12-18",
        "price": 7.29,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-19",
        "price": 7.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.12,
        "hold_days": 1
      }
    ]
  },
  "002376": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 7.03,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-29",
        "price": 7.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.12,
        "hold_days": 1
      }
    ]
  },
  "002798": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 4.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-30",
        "price": 5.17,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.08,
        "hold_days": 2
      }
    ]
  },
  "002886": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 20.66,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-05-30",
        "price": 19.72,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.55,
        "hold_days": 2
      }
    ]
  },
  "300973": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 53.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-03",
        "price": 52.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.36,
        "hold_days": 6
      }
    ]
  },
  "603535": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 10.22,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-03",
        "price": 10.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.45,
        "hold_days": 6
      }
    ]
  },
  "688335": {
    "daily": [
      {
        "date": "2025-05-28",
        "price": 12.6,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-10",
        "price": 12.34,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.06,
        "hold_days": 13
      }
    ]
  },
  "300949": {
    "daily": [
      {
        "date": "2025-05-29",
        "price": 38.08,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-03",
        "price": 38.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.15,
        "hold_days": 5
      }
    ]
  },
  "300962": {
    "daily": [
      {
        "date": "2025-05-29",
        "price": 15.83,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-03",
        "price": 15.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.85,
        "hold_days": 5
      }
    ]
  },
  "300756": {
    "daily": [
      {
        "date": "2025-05-29",
        "price": 25.24,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-05",
        "price": 25.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.42,
        "hold_days": 7
      }
    ]
  },
  "002537": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 9.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-04",
        "price": 8.49,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.31,
        "hold_days": 1
      },
      {
        "date": "2025-07-17",
        "price": 11.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-18",
        "price": 10.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.71,
        "hold_days": 1
      }
    ]
  },
  "603569": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 7.94,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-04",
        "price": 7.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.27,
        "hold_days": 1
      }
    ]
  },
  "605198": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 58.73,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-04",
        "price": 61.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.02,
        "hold_days": 1
      }
    ]
  },
  "301211": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 12.5,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-05",
        "price": 12.18,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.56,
        "hold_days": 2
      }
    ]
  },
  "002696": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 5.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-06",
        "price": 6.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.03,
        "hold_days": 3
      },
      {
        "date": "2025-06-11",
        "price": 6.13,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-13",
        "price": 5.84,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.73,
        "hold_days": 2
      },
      {
        "date": "2025-07-03",
        "price": 7.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-04",
        "price": 6.66,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.0,
        "hold_days": 1
      }
    ]
  },
  "603168": {
    "daily": [
      {
        "date": "2025-06-03",
        "price": 7.64,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-06",
        "price": 7.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.83,
        "hold_days": 3
      }
    ]
  },
  "688176": {
    "daily": [
      {
        "date": "2025-06-04",
        "price": 9.3,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-05",
        "price": 9.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.58,
        "hold_days": 1
      },
      {
        "date": "2025-07-22",
        "price": 11.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-25",
        "price": 11.25,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.1,
        "hold_days": 3
      },
      {
        "date": "2025-07-31",
        "price": 12.22,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-01",
        "price": 12.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.39,
        "hold_days": 1
      }
    ]
  },
  "002022": {
    "daily": [
      {
        "date": "2025-06-04",
        "price": 6.15,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-19",
        "price": 5.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.2,
        "hold_days": 15
      },
      {
        "date": "2025-08-05",
        "price": 7.7,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
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
  "301606": {
    "daily": [
      {
        "date": "2025-06-05",
        "price": 52.18,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-06",
        "price": 50.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.36,
        "hold_days": 1
      }
    ]
  },
  "603392": {
    "daily": [
      {
        "date": "2025-06-05",
        "price": 78.36,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-06",
        "price": 72.48,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.5,
        "hold_days": 1
      }
    ]
  },
  "300609": {
    "daily": [
      {
        "date": "2025-06-05",
        "price": 30.75,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-09",
        "price": 30.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.72,
        "hold_days": 4
      },
      {
        "date": "2025-06-27",
        "price": 33.04,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-01",
        "price": 32.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.57,
        "hold_days": 4
      }
    ]
  },
  "002153": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 9.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-09",
        "price": 9.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.22,
        "hold_days": 3
      },
      {
        "date": "2025-07-08",
        "price": 9.34,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-11",
        "price": 9.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.28,
        "hold_days": 3
      }
    ]
  },
  "300139": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 19.85,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-09",
        "price": 19.63,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.11,
        "hold_days": 3
      }
    ]
  },
  "300313": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 6.65,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-09",
        "price": 6.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.45,
        "hold_days": 3
      },
      {
        "date": "2025-12-01",
        "price": 9.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-03",
        "price": 9.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.91,
        "hold_days": 2
      }
    ]
  },
  "605338": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 20.02,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-10",
        "price": 19.82,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.0,
        "hold_days": 4
      }
    ]
  },
  "600807": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 3.19,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-12",
        "price": 3.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.88,
        "hold_days": 6
      }
    ]
  },
  "000935": {
    "daily": [
      {
        "date": "2025-06-06",
        "price": 17.72,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-18",
        "price": 17.82,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.56,
        "hold_days": 12
      }
    ]
  },
  "600830": {
    "daily": [
      {
        "date": "2025-06-09",
        "price": 9.88,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-10",
        "price": 9.98,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.01,
        "hold_days": 1
      },
      {
        "date": "2025-06-27",
        "price": 10.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-01",
        "price": 10.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.86,
        "hold_days": 4
      }
    ]
  },
  "002626": {
    "daily": [
      {
        "date": "2025-06-09",
        "price": 17.87,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-13",
        "price": 17.67,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.12,
        "hold_days": 4
      }
    ]
  },
  "001255": {
    "daily": [
      {
        "date": "2025-06-09",
        "price": 31.35,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-18",
        "price": 30.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.57,
        "hold_days": 9
      }
    ]
  },
  "603716": {
    "daily": [
      {
        "date": "2025-06-10",
        "price": 13.46,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-11",
        "price": 13.35,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.82,
        "hold_days": 1
      }
    ]
  },
  "000756": {
    "daily": [
      {
        "date": "2025-06-10",
        "price": 15.41,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-16",
        "price": 15.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.6,
        "hold_days": 6
      }
    ]
  },
  "002982": {
    "daily": [
      {
        "date": "2025-06-11",
        "price": 16.73,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-13",
        "price": 16.09,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.83,
        "hold_days": 2
      }
    ]
  },
  "601069": {
    "daily": [
      {
        "date": "2025-06-12",
        "price": 19.48,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-16",
        "price": 22.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 14.99,
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
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-16",
        "price": 17.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.05,
        "hold_days": 3
      }
    ]
  },
  "002932": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 20.04,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-16",
        "price": 19.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.45,
        "hold_days": 3
      }
    ]
  },
  "603619": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 20.03,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-16",
        "price": 20.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.64,
        "hold_days": 3
      }
    ]
  },
  "002828": {
    "daily": [
      {
        "date": "2025-06-13",
        "price": 10.04,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-17",
        "price": 12.16,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 21.12,
        "hold_days": 4
      }
    ]
  },
  "000777": {
    "daily": [
      {
        "date": "2025-06-16",
        "price": 19.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-17",
        "price": 21.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.1,
        "hold_days": 1
      }
    ]
  },
  "603639": {
    "daily": [
      {
        "date": "2025-06-16",
        "price": 14.3,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-18",
        "price": 13.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.87,
        "hold_days": 2
      }
    ]
  },
  "000403": {
    "daily": [
      {
        "date": "2025-06-17",
        "price": 18.75,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-18",
        "price": 18.34,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.19,
        "hold_days": 1
      }
    ]
  },
  "002902": {
    "daily": [
      {
        "date": "2025-06-20",
        "price": 20.38,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-27",
        "price": 20.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.74,
        "hold_days": 7
      }
    ]
  },
  "600871": {
    "daily": [
      {
        "date": "2025-06-23",
        "price": 2.07,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-24",
        "price": 1.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.31,
        "hold_days": 1
      }
    ]
  },
  "000555": {
    "daily": [
      {
        "date": "2025-06-24",
        "price": 13.86,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-25",
        "price": 14.38,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.75,
        "hold_days": 1
      }
    ]
  },
  "688201": {
    "daily": [
      {
        "date": "2025-06-24",
        "price": 10.95,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-26",
        "price": 13.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 20.46,
        "hold_days": 2
      }
    ]
  },
  "601908": {
    "daily": [
      {
        "date": "2025-06-24",
        "price": 3.33,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-27",
        "price": 3.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.8,
        "hold_days": 3
      }
    ]
  },
  "002670": {
    "daily": [
      {
        "date": "2025-06-25",
        "price": 14.48,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-27",
        "price": 16.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.57,
        "hold_days": 2
      }
    ]
  },
  "002281": {
    "daily": [
      {
        "date": "2025-06-25",
        "price": 47.71,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-02",
        "price": 46.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.55,
        "hold_days": 7
      },
      {
        "date": "2025-08-15",
        "price": 52.28,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-19",
        "price": 55.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.2,
        "hold_days": 4
      },
      {
        "date": "2025-12-22",
        "price": 70.24,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-31",
        "price": 69.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.41,
        "hold_days": 9
      }
    ]
  },
  "300061": {
    "daily": [
      {
        "date": "2025-06-27",
        "price": 13.88,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-06-30",
        "price": 13.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.94,
        "hold_days": 3
      }
    ]
  },
  "000948": {
    "daily": [
      {
        "date": "2025-06-27",
        "price": 20.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-02",
        "price": 20.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.32,
        "hold_days": 5
      }
    ]
  },
  "600773": {
    "daily": [
      {
        "date": "2025-06-27",
        "price": 10.19,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-15",
        "price": 10.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.47,
        "hold_days": 18
      }
    ]
  },
  "300637": {
    "daily": [
      {
        "date": "2025-06-30",
        "price": 12.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-01",
        "price": 12.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.33,
        "hold_days": 1
      }
    ]
  },
  "301063": {
    "daily": [
      {
        "date": "2025-06-30",
        "price": 29.63,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-01",
        "price": 30.41,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.63,
        "hold_days": 1
      }
    ]
  },
  "600152": {
    "daily": [
      {
        "date": "2025-06-30",
        "price": 7.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-01",
        "price": 7.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.55,
        "hold_days": 1
      }
    ]
  },
  "002629": {
    "daily": [
      {
        "date": "2025-06-30",
        "price": 6.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-02",
        "price": 6.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.06,
        "hold_days": 2
      }
    ]
  },
  "002952": {
    "daily": [
      {
        "date": "2025-06-30",
        "price": 22.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-02",
        "price": 21.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.54,
        "hold_days": 2
      }
    ]
  },
  "600097": {
    "daily": [
      {
        "date": "2025-07-02",
        "price": 11.43,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-03",
        "price": 11.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.41,
        "hold_days": 1
      },
      {
        "date": "2025-11-17",
        "price": 13.29,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 12.99,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.26,
        "hold_days": 1
      }
    ]
  },
  "600320": {
    "daily": [
      {
        "date": "2025-07-02",
        "price": 4.82,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-03",
        "price": 4.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.9,
        "hold_days": 1
      }
    ]
  },
  "002623": {
    "daily": [
      {
        "date": "2025-07-02",
        "price": 17.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-07",
        "price": 22.38,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 30.42,
        "hold_days": 5
      }
    ]
  },
  "002240": {
    "daily": [
      {
        "date": "2025-07-02",
        "price": 12.95,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-10",
        "price": 13.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.78,
        "hold_days": 8
      }
    ]
  },
  "002342": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 7.52,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-04",
        "price": 6.79,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.71,
        "hold_days": 1
      }
    ]
  },
  "300085": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 44.84,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-04",
        "price": 43.81,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.3,
        "hold_days": 1
      }
    ]
  },
  "600543": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 6.78,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-04",
        "price": 6.57,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.1,
        "hold_days": 1
      }
    ]
  },
  "600586": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 5.3,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-04",
        "price": 5.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.32,
        "hold_days": 1
      },
      {
        "date": "2025-07-23",
        "price": 5.47,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-24",
        "price": 5.6,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.38,
        "hold_days": 1
      }
    ]
  },
  "002463": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 44.41,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-07",
        "price": 45.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.13,
        "hold_days": 4
      },
      {
        "date": "2025-07-14",
        "price": 48.01,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-15",
        "price": 51.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.14,
        "hold_days": 1
      }
    ]
  },
  "300237": {
    "daily": [
      {
        "date": "2025-07-03",
        "price": 2.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-07",
        "price": 2.09,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.24,
        "hold_days": 4
      }
    ]
  },
  "002095": {
    "daily": [
      {
        "date": "2025-07-08",
        "price": 21.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-10",
        "price": 22.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.71,
        "hold_days": 2
      }
    ]
  },
  "002395": {
    "daily": [
      {
        "date": "2025-07-08",
        "price": 19.35,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-11",
        "price": 19.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.09,
        "hold_days": 3
      }
    ]
  },
  "001203": {
    "daily": [
      {
        "date": "2025-07-09",
        "price": 10.84,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-10",
        "price": 11.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.4,
        "hold_days": 1
      },
      {
        "date": "2025-10-29",
        "price": 16.12,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-03",
        "price": 20.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 25.43,
        "hold_days": 5
      }
    ]
  },
  "002467": {
    "daily": [
      {
        "date": "2025-07-09",
        "price": 6.5,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-10",
        "price": 6.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.31,
        "hold_days": 1
      }
    ]
  },
  "002725": {
    "daily": [
      {
        "date": "2025-07-09",
        "price": 12.84,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-11",
        "price": 13.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.04,
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
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-28",
        "price": 4.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.02,
        "hold_days": 50
      }
    ]
  },
  "300059": {
    "daily": [
      {
        "date": "2025-07-10",
        "price": 23.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-11",
        "price": 23.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.08,
        "hold_days": 1
      }
    ]
  },
  "002634": {
    "daily": [
      {
        "date": "2025-07-11",
        "price": 4.37,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-14",
        "price": 4.25,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.75,
        "hold_days": 3
      }
    ]
  },
  "002845": {
    "daily": [
      {
        "date": "2025-07-11",
        "price": 15.7,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-14",
        "price": 15.41,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.85,
        "hold_days": 3
      }
    ]
  },
  "301152": {
    "daily": [
      {
        "date": "2025-07-11",
        "price": 29.97,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-14",
        "price": 29.99,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.07,
        "hold_days": 3
      }
    ]
  },
  "301379": {
    "daily": [
      {
        "date": "2025-07-14",
        "price": 27.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-15",
        "price": 27.99,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.32,
        "hold_days": 1
      }
    ]
  },
  "603918": {
    "daily": [
      {
        "date": "2025-07-14",
        "price": 20.8,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-15",
        "price": 21.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.34,
        "hold_days": 1
      }
    ]
  },
  "003037": {
    "daily": [
      {
        "date": "2025-07-14",
        "price": 8.59,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-16",
        "price": 9.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 14.09,
        "hold_days": 2
      }
    ]
  },
  "002133": {
    "daily": [
      {
        "date": "2025-07-15",
        "price": 3.37,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-16",
        "price": 3.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.82,
        "hold_days": 1
      }
    ]
  },
  "002048": {
    "daily": [
      {
        "date": "2025-07-15",
        "price": 18.55,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-17",
        "price": 19.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.02,
        "hold_days": 2
      }
    ]
  },
  "601138": {
    "daily": [
      {
        "date": "2025-07-15",
        "price": 26.28,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 25.99,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.1,
        "hold_days": 7
      }
    ]
  },
  "000705": {
    "daily": [
      {
        "date": "2025-07-16",
        "price": 9.59,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-18",
        "price": 10.38,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 8.24,
        "hold_days": 2
      },
      {
        "date": "2025-08-05",
        "price": 9.56,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-28",
        "price": 9.28,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.93,
        "hold_days": 23
      }
    ]
  },
  "300233": {
    "daily": [
      {
        "date": "2025-07-16",
        "price": 17.21,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-18",
        "price": 18.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 9.82,
        "hold_days": 2
      }
    ]
  },
  "688543": {
    "daily": [
      {
        "date": "2025-07-16",
        "price": 57.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-18",
        "price": 54.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.86,
        "hold_days": 2
      }
    ]
  },
  "002377": {
    "daily": [
      {
        "date": "2025-07-16",
        "price": 3.32,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-21",
        "price": 3.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.01,
        "hold_days": 5
      }
    ]
  },
  "002653": {
    "daily": [
      {
        "date": "2025-07-16",
        "price": 47.76,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 50.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.75,
        "hold_days": 6
      },
      {
        "date": "2025-07-28",
        "price": 53.02,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-29",
        "price": 52.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.49,
        "hold_days": 1
      }
    ]
  },
  "300663": {
    "daily": [
      {
        "date": "2025-07-17",
        "price": 20.74,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-21",
        "price": 20.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.18,
        "hold_days": 4
      }
    ]
  },
  "600435": {
    "daily": [
      {
        "date": "2025-07-17",
        "price": 14.82,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 15.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.86,
        "hold_days": 5
      }
    ]
  },
  "000062": {
    "daily": [
      {
        "date": "2025-07-17",
        "price": 26.33,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-23",
        "price": 25.93,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.52,
        "hold_days": 6
      }
    ]
  },
  "000153": {
    "daily": [
      {
        "date": "2025-07-17",
        "price": 6.91,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-28",
        "price": 7.61,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.13,
        "hold_days": 11
      }
    ]
  },
  "300254": {
    "daily": [
      {
        "date": "2025-07-18",
        "price": 11.35,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 11.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.56,
        "hold_days": 4
      }
    ]
  },
  "688359": {
    "daily": [
      {
        "date": "2025-07-18",
        "price": 60.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 63.58,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.18,
        "hold_days": 4
      },
      {
        "date": "2025-09-10",
        "price": 73.08,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-12",
        "price": 73.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.08,
        "hold_days": 2
      }
    ]
  },
  "600760": {
    "daily": [
      {
        "date": "2025-07-18",
        "price": 65.5,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-23",
        "price": 62.98,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.85,
        "hold_days": 5
      }
    ]
  },
  "002086": {
    "daily": [
      {
        "date": "2025-07-18",
        "price": 2.99,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-29",
        "price": 2.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.68,
        "hold_days": 11
      }
    ]
  },
  "002185": {
    "daily": [
      {
        "date": "2025-07-18",
        "price": 9.99,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-01",
        "price": 9.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.8,
        "hold_days": 14
      },
      {
        "date": "2025-10-17",
        "price": 12.96,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-20",
        "price": 12.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.39,
        "hold_days": 3
      }
    ]
  },
  "002204": {
    "daily": [
      {
        "date": "2025-07-21",
        "price": 6.54,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 6.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.27,
        "hold_days": 1
      }
    ]
  },
  "002266": {
    "daily": [
      {
        "date": "2025-07-21",
        "price": 3.69,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 4.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.03,
        "hold_days": 1
      }
    ]
  },
  "002459": {
    "daily": [
      {
        "date": "2025-07-21",
        "price": 11.68,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 12.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.68,
        "hold_days": 1
      }
    ]
  },
  "600143": {
    "daily": [
      {
        "date": "2025-07-21",
        "price": 12.01,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-22",
        "price": 12.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.41,
        "hold_days": 1
      }
    ]
  },
  "002761": {
    "daily": [
      {
        "date": "2025-07-22",
        "price": 10.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-23",
        "price": 10.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.48,
        "hold_days": 1
      }
    ]
  },
  "600231": {
    "daily": [
      {
        "date": "2025-07-22",
        "price": 2.14,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-23",
        "price": 2.12,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.93,
        "hold_days": 1
      }
    ]
  },
  "603018": {
    "daily": [
      {
        "date": "2025-07-22",
        "price": 9.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-23",
        "price": 8.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.41,
        "hold_days": 1
      }
    ]
  },
  "002564": {
    "daily": [
      {
        "date": "2025-07-22",
        "price": 6.48,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-25",
        "price": 6.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.1,
        "hold_days": 3
      }
    ]
  },
  "003031": {
    "daily": [
      {
        "date": "2025-07-22",
        "price": 52.18,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-25",
        "price": 61.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 18.24,
        "hold_days": 34
      }
    ]
  },
  "600481": {
    "daily": [
      {
        "date": "2025-07-23",
        "price": 5.87,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-24",
        "price": 5.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.68,
        "hold_days": 1
      },
      {
        "date": "2025-08-06",
        "price": 6.03,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-07",
        "price": 5.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.99,
        "hold_days": 1
      },
      {
        "date": "2025-08-19",
        "price": 6.22,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-20",
        "price": 6.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.13,
        "hold_days": 1
      },
      {
        "date": "2025-10-30",
        "price": 6.89,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-03",
        "price": 7.32,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.24,
        "hold_days": 4
      }
    ]
  },
  "603966": {
    "daily": [
      {
        "date": "2025-07-23",
        "price": 12.86,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-24",
        "price": 12.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.24,
        "hold_days": 1
      }
    ]
  },
  "002633": {
    "daily": [
      {
        "date": "2025-07-23",
        "price": 16.7,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-19",
        "price": 16.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.56,
        "hold_days": 27
      }
    ]
  },
  "000078": {
    "daily": [
      {
        "date": "2025-07-24",
        "price": 2.76,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-01",
        "price": 2.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.45,
        "hold_days": 8
      }
    ]
  },
  "003020": {
    "daily": [
      {
        "date": "2025-07-25",
        "price": 25.95,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-28",
        "price": 27.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.78,
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
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-28",
        "price": 26.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.37,
        "hold_days": 3
      }
    ]
  },
  "300308": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 191.47,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-29",
        "price": 209.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 9.43,
        "hold_days": 1
      },
      {
        "date": "2025-10-27",
        "price": 508.94,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-28",
        "price": 513.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.8,
        "hold_days": 1
      },
      {
        "date": "2025-12-23",
        "price": 621.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-25",
        "price": 639.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.03,
        "hold_days": 2
      }
    ]
  },
  "600276": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 62.04,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-29",
        "price": 63.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.84,
        "hold_days": 1
      }
    ]
  },
  "301237": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 36.55,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-30",
        "price": 39.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.41,
        "hold_days": 2
      }
    ]
  },
  "603327": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 9.76,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-31",
        "price": 9.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.18,
        "hold_days": 3
      }
    ]
  },
  "603738": {
    "daily": [
      {
        "date": "2025-07-28",
        "price": 15.57,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-28",
        "price": 16.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.66,
        "hold_days": 31
      }
    ]
  },
  "002865": {
    "daily": [
      {
        "date": "2025-07-29",
        "price": 46.18,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-30",
        "price": 45.16,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.21,
        "hold_days": 1
      }
    ]
  },
  "300118": {
    "daily": [
      {
        "date": "2025-07-29",
        "price": 10.79,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-30",
        "price": 10.55,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.22,
        "hold_days": 1
      }
    ]
  },
  "301067": {
    "daily": [
      {
        "date": "2025-07-29",
        "price": 35.82,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-30",
        "price": 35.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.48,
        "hold_days": 1
      }
    ]
  },
  "300476": {
    "daily": [
      {
        "date": "2025-07-29",
        "price": 187.26,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-01",
        "price": 189.36,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.12,
        "hold_days": 3
      }
    ]
  },
  "301132": {
    "daily": [
      {
        "date": "2025-07-30",
        "price": 39.97,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-07-31",
        "price": 38.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.2,
        "hold_days": 1
      }
    ]
  },
  "002923": {
    "daily": [
      {
        "date": "2025-07-30",
        "price": 13.53,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-01",
        "price": 14.06,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.92,
        "hold_days": 2
      }
    ]
  },
  "603806": {
    "daily": [
      {
        "date": "2025-07-31",
        "price": 14.63,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-01",
        "price": 14.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.62,
        "hold_days": 1
      }
    ]
  },
  "603936": {
    "daily": [
      {
        "date": "2025-07-31",
        "price": 10.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-01",
        "price": 10.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.11,
        "hold_days": 1
      }
    ]
  },
  "600682": {
    "daily": [
      {
        "date": "2025-08-01",
        "price": 7.55,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-04",
        "price": 7.63,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.06,
        "hold_days": 3
      }
    ]
  },
  "002484": {
    "daily": [
      {
        "date": "2025-08-04",
        "price": 26.18,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-06",
        "price": 27.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.25,
        "hold_days": 2
      }
    ]
  },
  "301258": {
    "daily": [
      {
        "date": "2025-08-04",
        "price": 35.65,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-08",
        "price": 37.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.64,
        "hold_days": 4
      }
    ]
  },
  "002131": {
    "daily": [
      {
        "date": "2025-08-04",
        "price": 3.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-11",
        "price": 4.02,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.01,
        "hold_days": 7
      }
    ]
  },
  "002527": {
    "daily": [
      {
        "date": "2025-08-05",
        "price": 17.29,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-06",
        "price": 17.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.12,
        "hold_days": 1
      },
      {
        "date": "2025-09-12",
        "price": 20.14,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-15",
        "price": 20.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.45,
        "hold_days": 3
      }
    ]
  },
  "002796": {
    "daily": [
      {
        "date": "2025-08-05",
        "price": 13.1,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-06",
        "price": 13.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.97,
        "hold_days": 1
      }
    ]
  },
  "002889": {
    "daily": [
      {
        "date": "2025-08-05",
        "price": 16.63,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-07",
        "price": 17.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.79,
        "hold_days": 2
      }
    ]
  },
  "002550": {
    "daily": [
      {
        "date": "2025-08-06",
        "price": 11.89,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-07",
        "price": 10.7,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.01,
        "hold_days": 1
      }
    ]
  },
  "300557": {
    "daily": [
      {
        "date": "2025-08-06",
        "price": 28.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-14",
        "price": 27.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.12,
        "hold_days": 8
      }
    ]
  },
  "300051": {
    "daily": [
      {
        "date": "2025-08-06",
        "price": 7.71,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-27",
        "price": 7.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.15,
        "hold_days": 21
      }
    ]
  },
  "002931": {
    "daily": [
      {
        "date": "2025-08-07",
        "price": 17.42,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-08",
        "price": 16.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.76,
        "hold_days": 1
      }
    ]
  },
  "002981": {
    "daily": [
      {
        "date": "2025-08-07",
        "price": 30.33,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-08",
        "price": 28.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.68,
        "hold_days": 1
      }
    ]
  },
  "601608": {
    "daily": [
      {
        "date": "2025-08-07",
        "price": 4.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-08",
        "price": 5.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.91,
        "hold_days": 1
      }
    ]
  },
  "920682": {
    "daily": [
      {
        "date": "2025-08-08",
        "price": 10.8,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-11",
        "price": 10.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.46,
        "hold_days": 3
      }
    ]
  },
  "603977": {
    "daily": [
      {
        "date": "2025-08-08",
        "price": 13.06,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-14",
        "price": 12.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.83,
        "hold_days": 6
      },
      {
        "date": "2025-11-13",
        "price": 13.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-14",
        "price": 13.09,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.82,
        "hold_days": 1
      }
    ]
  },
  "000762": {
    "daily": [
      {
        "date": "2025-08-11",
        "price": 23.42,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-12",
        "price": 22.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.05,
        "hold_days": 1
      }
    ]
  },
  "002317": {
    "daily": [
      {
        "date": "2025-08-11",
        "price": 21.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-12",
        "price": 21.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.65,
        "hold_days": 1
      }
    ]
  },
  "002466": {
    "daily": [
      {
        "date": "2025-08-11",
        "price": 44.91,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-12",
        "price": 45.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.16,
        "hold_days": 1
      },
      {
        "date": "2025-08-29",
        "price": 43.96,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-03",
        "price": 42.12,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.19,
        "hold_days": 5
      }
    ]
  },
  "002783": {
    "daily": [
      {
        "date": "2025-08-11",
        "price": 10.52,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-15",
        "price": 10.73,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.0,
        "hold_days": 4
      }
    ]
  },
  "603186": {
    "daily": [
      {
        "date": "2025-08-12",
        "price": 36.47,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-14",
        "price": 35.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.66,
        "hold_days": 2
      }
    ]
  },
  "300482": {
    "daily": [
      {
        "date": "2025-08-12",
        "price": 24.38,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-20",
        "price": 23.16,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.0,
        "hold_days": 8
      }
    ]
  },
  "603386": {
    "daily": [
      {
        "date": "2025-08-12",
        "price": 14.64,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-20",
        "price": 16.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.18,
        "hold_days": 8
      }
    ]
  },
  "300595": {
    "daily": [
      {
        "date": "2025-08-12",
        "price": 19.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-21",
        "price": 19.02,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.16,
        "hold_days": 9
      }
    ]
  },
  "605588": {
    "daily": [
      {
        "date": "2025-08-14",
        "price": 57.34,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-18",
        "price": 63.44,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.64,
        "hold_days": 4
      }
    ]
  },
  "301458": {
    "daily": [
      {
        "date": "2025-08-15",
        "price": 38.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-21",
        "price": 38.67,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.57,
        "hold_days": 6
      },
      {
        "date": "2025-08-25",
        "price": 39.56,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-26",
        "price": 40.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.08,
        "hold_days": 1
      }
    ]
  },
  "300748": {
    "daily": [
      {
        "date": "2025-08-19",
        "price": 28.66,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-20",
        "price": 29.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.13,
        "hold_days": 1
      }
    ]
  },
  "300752": {
    "daily": [
      {
        "date": "2025-08-19",
        "price": 23.97,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-20",
        "price": 26.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 8.59,
        "hold_days": 1
      }
    ]
  },
  "000823": {
    "daily": [
      {
        "date": "2025-08-19",
        "price": 13.83,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-26",
        "price": 14.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.18,
        "hold_days": 7
      }
    ]
  },
  "603633": {
    "daily": [
      {
        "date": "2025-08-21",
        "price": 10.78,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-22",
        "price": 10.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.67,
        "hold_days": 1
      }
    ]
  },
  "605228": {
    "daily": [
      {
        "date": "2025-08-21",
        "price": 17.79,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-22",
        "price": 17.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.22,
        "hold_days": 1
      }
    ]
  },
  "003017": {
    "daily": [
      {
        "date": "2025-08-21",
        "price": 33.77,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-25",
        "price": 34.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.16,
        "hold_days": 4
      }
    ]
  },
  "002558": {
    "daily": [
      {
        "date": "2025-08-22",
        "price": 30.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-25",
        "price": 30.77,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.89,
        "hold_days": 3
      },
      {
        "date": "2025-09-25",
        "price": 45.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-26",
        "price": 44.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.09,
        "hold_days": 1
      }
    ]
  },
  "688135": {
    "daily": [
      {
        "date": "2025-08-22",
        "price": 23.35,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-25",
        "price": 24.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.21,
        "hold_days": 3
      }
    ]
  },
  "300572": {
    "daily": [
      {
        "date": "2025-08-22",
        "price": 27.99,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-26",
        "price": 26.74,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.47,
        "hold_days": 4
      },
      {
        "date": "2025-09-25",
        "price": 29.1,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-26",
        "price": 28.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.37,
        "hold_days": 1
      }
    ]
  },
  "688268": {
    "daily": [
      {
        "date": "2025-08-22",
        "price": 60.59,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-26",
        "price": 59.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.96,
        "hold_days": 4
      }
    ]
  },
  "688130": {
    "daily": [
      {
        "date": "2025-08-22",
        "price": 26.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-27",
        "price": 25.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.86,
        "hold_days": 5
      }
    ]
  },
  "688786": {
    "daily": [
      {
        "date": "2025-08-22",
        "price": 27.71,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-28",
        "price": 27.17,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.95,
        "hold_days": 6
      }
    ]
  },
  "002346": {
    "daily": [
      {
        "date": "2025-08-25",
        "price": 16.69,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-26",
        "price": 16.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.52,
        "hold_days": 1
      }
    ]
  },
  "002636": {
    "daily": [
      {
        "date": "2025-08-25",
        "price": 13.86,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-26",
        "price": 14.18,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.31,
        "hold_days": 1
      }
    ]
  },
  "300792": {
    "daily": [
      {
        "date": "2025-08-25",
        "price": 29.25,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-27",
        "price": 29.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.51,
        "hold_days": 2
      }
    ]
  },
  "600877": {
    "daily": [
      {
        "date": "2025-08-25",
        "price": 14.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-27",
        "price": 14.34,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.85,
        "hold_days": 2
      },
      {
        "date": "2025-08-28",
        "price": 15.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-29",
        "price": 14.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.36,
        "hold_days": 1
      }
    ]
  },
  "002249": {
    "daily": [
      {
        "date": "2025-08-26",
        "price": 8.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-27",
        "price": 8.17,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.73,
        "hold_days": 1
      }
    ]
  },
  "002453": {
    "daily": [
      {
        "date": "2025-08-26",
        "price": 6.44,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-27",
        "price": 6.14,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.66,
        "hold_days": 1
      }
    ]
  },
  "002715": {
    "daily": [
      {
        "date": "2025-08-26",
        "price": 21.43,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-27",
        "price": 22.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.41,
        "hold_days": 1
      }
    ]
  },
  "000630": {
    "daily": [
      {
        "date": "2025-08-26",
        "price": 4.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-28",
        "price": 4.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.05,
        "hold_days": 2
      },
      {
        "date": "2025-10-09",
        "price": 5.85,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-10",
        "price": 5.83,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.34,
        "hold_days": 1
      },
      {
        "date": "2025-10-27",
        "price": 5.81,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-28",
        "price": 5.22,
        "type": "sell",
        "reason": "-10%固定止损",
        "reason_detail": "亏损达到-10%固定止损线，强制平仓",
        "pnl_pct": -10.15,
        "hold_days": 1
      }
    ]
  },
  "601512": {
    "daily": [
      {
        "date": "2025-08-27",
        "price": 8.91,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-28",
        "price": 8.58,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.7,
        "hold_days": 1
      },
      {
        "date": "2025-09-11",
        "price": 8.82,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-12",
        "price": 9.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.04,
        "hold_days": 1
      }
    ]
  },
  "603025": {
    "daily": [
      {
        "date": "2025-08-27",
        "price": 16.63,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-28",
        "price": 16.77,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.84,
        "hold_days": 1
      }
    ]
  },
  "002792": {
    "daily": [
      {
        "date": "2025-08-28",
        "price": 18.85,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-08-29",
        "price": 18.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.08,
        "hold_days": 1
      },
      {
        "date": "2025-12-16",
        "price": 35.21,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-17",
        "price": 31.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -10.0,
        "hold_days": 1
      }
    ]
  },
  "600210": {
    "daily": [
      {
        "date": "2025-08-28",
        "price": 7.07,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-01",
        "price": 7.72,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 9.19,
        "hold_days": 4
      }
    ]
  },
  "002156": {
    "daily": [
      {
        "date": "2025-08-29",
        "price": 33.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-01",
        "price": 34.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.41,
        "hold_days": 3
      },
      {
        "date": "2025-10-28",
        "price": 44.14,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-31",
        "price": 42.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.83,
        "hold_days": 3
      }
    ]
  },
  "601717": {
    "daily": [
      {
        "date": "2025-08-29",
        "price": 20.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-01",
        "price": 21.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.16,
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
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-01",
        "price": 25.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.76,
        "hold_days": 3
      }
    ]
  },
  "000417": {
    "daily": [
      {
        "date": "2025-08-29",
        "price": 6.17,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-03",
        "price": 6.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.11,
        "hold_days": 5
      }
    ]
  },
  "000988": {
    "daily": [
      {
        "date": "2025-09-01",
        "price": 75.26,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-02",
        "price": 74.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.33,
        "hold_days": 1
      }
    ]
  },
  "003019": {
    "daily": [
      {
        "date": "2025-09-01",
        "price": 41.87,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-02",
        "price": 40.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.29,
        "hold_days": 1
      }
    ]
  },
  "601958": {
    "daily": [
      {
        "date": "2025-09-01",
        "price": 16.5,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-02",
        "price": 17.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.88,
        "hold_days": 1
      }
    ]
  },
  "688598": {
    "daily": [
      {
        "date": "2025-09-01",
        "price": 32.37,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-02",
        "price": 31.38,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.06,
        "hold_days": 1
      }
    ]
  },
  "600637": {
    "daily": [
      {
        "date": "2025-09-01",
        "price": 9.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-03",
        "price": 8.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.56,
        "hold_days": 2
      }
    ]
  },
  "301358": {
    "daily": [
      {
        "date": "2025-09-03",
        "price": 36.5,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-04",
        "price": 37.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.19,
        "hold_days": 1
      }
    ]
  },
  "603786": {
    "daily": [
      {
        "date": "2025-09-05",
        "price": 61.27,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-08",
        "price": 64.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.46,
        "hold_days": 3
      }
    ]
  },
  "002091": {
    "daily": [
      {
        "date": "2025-09-08",
        "price": 8.45,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-09",
        "price": 8.92,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.56,
        "hold_days": 1
      }
    ]
  },
  "002516": {
    "daily": [
      {
        "date": "2025-09-08",
        "price": 6.27,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-09",
        "price": 5.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.54,
        "hold_days": 1
      }
    ]
  },
  "300587": {
    "daily": [
      {
        "date": "2025-09-08",
        "price": 8.81,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-09",
        "price": 8.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.57,
        "hold_days": 1
      }
    ]
  },
  "301603": {
    "daily": [
      {
        "date": "2025-09-08",
        "price": 79.49,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-09",
        "price": 76.55,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.7,
        "hold_days": 1
      }
    ]
  },
  "603178": {
    "daily": [
      {
        "date": "2025-09-08",
        "price": 20.73,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-09",
        "price": 21.07,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.64,
        "hold_days": 1
      }
    ]
  },
  "002859": {
    "daily": [
      {
        "date": "2025-09-08",
        "price": 31.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-11",
        "price": 32.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.25,
        "hold_days": 3
      },
      {
        "date": "2025-09-30",
        "price": 33.51,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-10",
        "price": 31.97,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.6,
        "hold_days": 10
      }
    ]
  },
  "600176": {
    "daily": [
      {
        "date": "2025-09-09",
        "price": 15.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-10",
        "price": 15.12,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.53,
        "hold_days": 1
      },
      {
        "date": "2025-09-23",
        "price": 15.89,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-25",
        "price": 16.91,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.42,
        "hold_days": 2
      }
    ]
  },
  "600730": {
    "daily": [
      {
        "date": "2025-09-09",
        "price": 10.73,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-10",
        "price": 11.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.54,
        "hold_days": 1
      }
    ]
  },
  "603239": {
    "daily": [
      {
        "date": "2025-09-09",
        "price": 17.31,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-10",
        "price": 17.57,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.5,
        "hold_days": 1
      }
    ]
  },
  "688683": {
    "daily": [
      {
        "date": "2025-09-09",
        "price": 35.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-10",
        "price": 36.19,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.75,
        "hold_days": 1
      },
      {
        "date": "2025-09-16",
        "price": 36.14,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-17",
        "price": 38.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.95,
        "hold_days": 1
      }
    ]
  },
  "002106": {
    "daily": [
      {
        "date": "2025-09-09",
        "price": 11.96,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-11",
        "price": 12.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.18,
        "hold_days": 2
      }
    ]
  },
  "603289": {
    "daily": [
      {
        "date": "2025-09-09",
        "price": 10.64,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-15",
        "price": 10.55,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.85,
        "hold_days": 6
      },
      {
        "date": "2025-09-16",
        "price": 10.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-18",
        "price": 10.57,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.03,
        "hold_days": 2
      }
    ]
  },
  "000826": {
    "daily": [
      {
        "date": "2025-09-10",
        "price": 2.14,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-11",
        "price": 2.23,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.21,
        "hold_days": 1
      },
      {
        "date": "2025-09-24",
        "price": 2.49,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-25",
        "price": 2.28,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.43,
        "hold_days": 1
      },
      {
        "date": "2025-11-11",
        "price": 2.54,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-12",
        "price": 2.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.33,
        "hold_days": 1
      }
    ]
  },
  "600510": {
    "daily": [
      {
        "date": "2025-09-10",
        "price": 7.5,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-11",
        "price": 8.25,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.0,
        "hold_days": 1
      }
    ]
  },
  "002244": {
    "daily": [
      {
        "date": "2025-09-10",
        "price": 11.08,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-15",
        "price": 11.45,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.34,
        "hold_days": 5
      }
    ]
  },
  "002191": {
    "daily": [
      {
        "date": "2025-09-10",
        "price": 4.49,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-22",
        "price": 4.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.89,
        "hold_days": 12
      }
    ]
  },
  "002283": {
    "daily": [
      {
        "date": "2025-09-11",
        "price": 6.94,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-16",
        "price": 7.2,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.75,
        "hold_days": 5
      }
    ]
  },
  "001309": {
    "daily": [
      {
        "date": "2025-09-12",
        "price": 109.38,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-15",
        "price": 117.51,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.43,
        "hold_days": 3
      }
    ]
  },
  "600284": {
    "daily": [
      {
        "date": "2025-09-12",
        "price": 9.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-15",
        "price": 9.12,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.87,
        "hold_days": 3
      },
      {
        "date": "2025-09-16",
        "price": 9.06,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-18",
        "price": 9.81,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 8.28,
        "hold_days": 2
      }
    ]
  },
  "300503": {
    "daily": [
      {
        "date": "2025-09-12",
        "price": 30.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-16",
        "price": 32.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.33,
        "hold_days": 4
      }
    ]
  },
  "002101": {
    "daily": [
      {
        "date": "2025-09-15",
        "price": 13.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-16",
        "price": 14.12,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.58,
        "hold_days": 1
      },
      {
        "date": "2025-09-19",
        "price": 14.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-22",
        "price": 14.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.87,
        "hold_days": 3
      }
    ]
  },
  "002176": {
    "daily": [
      {
        "date": "2025-09-15",
        "price": 10.24,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-16",
        "price": 10.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.25,
        "hold_days": 1
      },
      {
        "date": "2025-10-09",
        "price": 10.25,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-10",
        "price": 9.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.83,
        "hold_days": 1
      }
    ]
  },
  "300582": {
    "daily": [
      {
        "date": "2025-09-15",
        "price": 16.21,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-16",
        "price": 17.05,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.18,
        "hold_days": 1
      }
    ]
  },
  "688116": {
    "daily": [
      {
        "date": "2025-09-15",
        "price": 56.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-16",
        "price": 56.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.46,
        "hold_days": 1
      }
    ]
  },
  "300496": {
    "daily": [
      {
        "date": "2025-09-16",
        "price": 75.83,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-17",
        "price": 77.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.57,
        "hold_days": 1
      }
    ]
  },
  "603278": {
    "daily": [
      {
        "date": "2025-09-16",
        "price": 11.71,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-17",
        "price": 11.55,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.37,
        "hold_days": 1
      },
      {
        "date": "2025-12-26",
        "price": 12.8,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-29",
        "price": 14.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.0,
        "hold_days": 3
      }
    ]
  },
  "603906": {
    "daily": [
      {
        "date": "2025-09-16",
        "price": 17.07,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-17",
        "price": 17.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.87,
        "hold_days": 1
      }
    ]
  },
  "688347": {
    "daily": [
      {
        "date": "2025-09-16",
        "price": 76.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-17",
        "price": 80.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.93,
        "hold_days": 1
      }
    ]
  },
  "688629": {
    "daily": [
      {
        "date": "2025-09-16",
        "price": 88.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-17",
        "price": 88.51,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.44,
        "hold_days": 1
      }
    ]
  },
  "300222": {
    "daily": [
      {
        "date": "2025-09-16",
        "price": 13.54,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-18",
        "price": 13.26,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.07,
        "hold_days": 2
      }
    ]
  },
  "300332": {
    "daily": [
      {
        "date": "2025-09-16",
        "price": 5.74,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-18",
        "price": 5.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.48,
        "hold_days": 2
      }
    ]
  },
  "301319": {
    "daily": [
      {
        "date": "2025-09-17",
        "price": 34.77,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-18",
        "price": 35.82,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.02,
        "hold_days": 1
      }
    ]
  },
  "603286": {
    "daily": [
      {
        "date": "2025-09-17",
        "price": 39.55,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-18",
        "price": 40.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.86,
        "hold_days": 1
      }
    ]
  },
  "605133": {
    "daily": [
      {
        "date": "2025-09-17",
        "price": 48.6,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-18",
        "price": 48.17,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.88,
        "hold_days": 1
      }
    ]
  },
  "000636": {
    "daily": [
      {
        "date": "2025-09-17",
        "price": 15.79,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-23",
        "price": 15.49,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.9,
        "hold_days": 6
      }
    ]
  },
  "002426": {
    "daily": [
      {
        "date": "2025-09-18",
        "price": 3.84,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-19",
        "price": 3.72,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.12,
        "hold_days": 1
      }
    ]
  },
  "002766": {
    "daily": [
      {
        "date": "2025-09-18",
        "price": 5.74,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-19",
        "price": 5.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.66,
        "hold_days": 1
      },
      {
        "date": "2025-09-29",
        "price": 5.7,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-13",
        "price": 5.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.7,
        "hold_days": 14
      }
    ]
  },
  "301272": {
    "daily": [
      {
        "date": "2025-09-18",
        "price": 46.39,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-22",
        "price": 47.47,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.33,
        "hold_days": 4
      }
    ]
  },
  "002916": {
    "daily": [
      {
        "date": "2025-09-19",
        "price": 195.57,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-22",
        "price": 214.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 9.83,
        "hold_days": 3
      }
    ]
  },
  "603659": {
    "daily": [
      {
        "date": "2025-09-22",
        "price": 26.93,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-23",
        "price": 26.37,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.08,
        "hold_days": 1
      }
    ]
  },
  "688371": {
    "daily": [
      {
        "date": "2025-09-22",
        "price": 26.76,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-23",
        "price": 26.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.64,
        "hold_days": 1
      }
    ]
  },
  "688685": {
    "daily": [
      {
        "date": "2025-09-22",
        "price": 64.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-23",
        "price": 61.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.71,
        "hold_days": 1
      }
    ]
  },
  "300035": {
    "daily": [
      {
        "date": "2025-09-23",
        "price": 23.08,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-24",
        "price": 23.93,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.68,
        "hold_days": 1
      }
    ]
  },
  "002418": {
    "daily": [
      {
        "date": "2025-09-24",
        "price": 5.03,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-25",
        "price": 4.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.98,
        "hold_days": 1
      }
    ]
  },
  "300750": {
    "daily": [
      {
        "date": "2025-09-24",
        "price": 372.97,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-25",
        "price": 385.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.46,
        "hold_days": 1
      }
    ]
  },
  "301608": {
    "daily": [
      {
        "date": "2025-09-24",
        "price": 98.01,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-29",
        "price": 94.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.12,
        "hold_days": 5
      }
    ]
  },
  "603328": {
    "daily": [
      {
        "date": "2025-09-25",
        "price": 12.3,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-26",
        "price": 11.77,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.31,
        "hold_days": 1
      }
    ]
  },
  "300390": {
    "daily": [
      {
        "date": "2025-09-25",
        "price": 23.18,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-29",
        "price": 23.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.11,
        "hold_days": 4
      }
    ]
  },
  "605117": {
    "daily": [
      {
        "date": "2025-09-25",
        "price": 73.65,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-30",
        "price": 79.89,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 8.47,
        "hold_days": 5
      }
    ]
  },
  "688390": {
    "daily": [
      {
        "date": "2025-09-25",
        "price": 55.88,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-30",
        "price": 64.69,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 15.77,
        "hold_days": 5
      }
    ]
  },
  "605376": {
    "daily": [
      {
        "date": "2025-09-25",
        "price": 55.53,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-09",
        "price": 63.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 13.99,
        "hold_days": 14
      }
    ]
  },
  "300502": {
    "daily": [
      {
        "date": "2025-09-26",
        "price": 374.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-29",
        "price": 388.28,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.82,
        "hold_days": 3
      }
    ]
  },
  "002407": {
    "daily": [
      {
        "date": "2025-09-29",
        "price": 19.4,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-30",
        "price": 20.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.67,
        "hold_days": 1
      }
    ]
  },
  "002510": {
    "daily": [
      {
        "date": "2025-09-29",
        "price": 7.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-30",
        "price": 7.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.35,
        "hold_days": 1
      },
      {
        "date": "2025-12-19",
        "price": 7.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-24",
        "price": 7.43,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.19,
        "hold_days": 5
      }
    ]
  },
  "300068": {
    "daily": [
      {
        "date": "2025-09-29",
        "price": 20.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-30",
        "price": 20.61,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.59,
        "hold_days": 1
      }
    ]
  },
  "300185": {
    "daily": [
      {
        "date": "2025-09-29",
        "price": 3.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-30",
        "price": 3.16,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.17,
        "hold_days": 1
      }
    ]
  },
  "603026": {
    "daily": [
      {
        "date": "2025-09-29",
        "price": 47.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-09-30",
        "price": 51.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.0,
        "hold_days": 1
      }
    ]
  },
  "301046": {
    "daily": [
      {
        "date": "2025-09-29",
        "price": 27.19,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-09",
        "price": 26.88,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.14,
        "hold_days": 10
      }
    ]
  },
  "600487": {
    "daily": [
      {
        "date": "2025-09-29",
        "price": 23.13,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-09",
        "price": 24.11,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.24,
        "hold_days": 10
      },
      {
        "date": "2025-12-24",
        "price": 26.93,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-25",
        "price": 25.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.31,
        "hold_days": 1
      }
    ]
  },
  "600641": {
    "daily": [
      {
        "date": "2025-09-30",
        "price": 22.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-09",
        "price": 21.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.09,
        "hold_days": 9
      }
    ]
  },
  "603306": {
    "daily": [
      {
        "date": "2025-09-30",
        "price": 56.06,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-09",
        "price": 52.35,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.62,
        "hold_days": 9
      }
    ]
  },
  "688017": {
    "daily": [
      {
        "date": "2025-09-30",
        "price": 180.78,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-09",
        "price": 180.12,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.37,
        "hold_days": 9
      }
    ]
  },
  "002237": {
    "daily": [
      {
        "date": "2025-09-30",
        "price": 14.97,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-10",
        "price": 15.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.67,
        "hold_days": 10
      }
    ]
  },
  "000878": {
    "daily": [
      {
        "date": "2025-10-09",
        "price": 19.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-10",
        "price": 19.58,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.82,
        "hold_days": 1
      },
      {
        "date": "2025-10-30",
        "price": 18.57,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-31",
        "price": 18.04,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.85,
        "hold_days": 1
      }
    ]
  },
  "600547": {
    "daily": [
      {
        "date": "2025-10-09",
        "price": 43.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-10",
        "price": 41.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.66,
        "hold_days": 1
      }
    ]
  },
  "603823": {
    "daily": [
      {
        "date": "2025-10-09",
        "price": 15.9,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-10",
        "price": 16.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.96,
        "hold_days": 1
      }
    ]
  },
  "688041": {
    "daily": [
      {
        "date": "2025-10-09",
        "price": 262.96,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-10",
        "price": 241.4,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.2,
        "hold_days": 1
      }
    ]
  },
  "600489": {
    "daily": [
      {
        "date": "2025-10-09",
        "price": 24.12,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-13",
        "price": 25.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.72,
        "hold_days": 4
      }
    ]
  },
  "600172": {
    "daily": [
      {
        "date": "2025-10-10",
        "price": 5.53,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-13",
        "price": 5.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.18,
        "hold_days": 3
      }
    ]
  },
  "601011": {
    "daily": [
      {
        "date": "2025-10-14",
        "price": 3.96,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-15",
        "price": 3.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.34,
        "hold_days": 1
      }
    ]
  },
  "605111": {
    "daily": [
      {
        "date": "2025-10-15",
        "price": 40.13,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-16",
        "price": 40.37,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.6,
        "hold_days": 1
      }
    ]
  },
  "603703": {
    "daily": [
      {
        "date": "2025-10-15",
        "price": 11.68,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-17",
        "price": 11.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.82,
        "hold_days": 2
      }
    ]
  },
  "002552": {
    "daily": [
      {
        "date": "2025-10-17",
        "price": 18.5,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-20",
        "price": 16.84,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -8.97,
        "hold_days": 3
      }
    ]
  },
  "002083": {
    "daily": [
      {
        "date": "2025-10-20",
        "price": 6.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-21",
        "price": 6.39,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.73,
        "hold_days": 1
      }
    ]
  },
  "002402": {
    "daily": [
      {
        "date": "2025-10-20",
        "price": 51.26,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-22",
        "price": 49.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.85,
        "hold_days": 2
      }
    ]
  },
  "603115": {
    "daily": [
      {
        "date": "2025-10-21",
        "price": 18.95,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-22",
        "price": 18.66,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.53,
        "hold_days": 1
      }
    ]
  },
  "002811": {
    "daily": [
      {
        "date": "2025-10-21",
        "price": 13.88,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-23",
        "price": 13.98,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.72,
        "hold_days": 2
      }
    ]
  },
  "002861": {
    "daily": [
      {
        "date": "2025-10-22",
        "price": 19.61,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-30",
        "price": 19.72,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.56,
        "hold_days": 8
      }
    ]
  },
  "000090": {
    "daily": [
      {
        "date": "2025-10-23",
        "price": 4.11,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-24",
        "price": 3.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -6.33,
        "hold_days": 1
      }
    ]
  },
  "603316": {
    "daily": [
      {
        "date": "2025-10-23",
        "price": 13.67,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-24",
        "price": 14.1,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.15,
        "hold_days": 1
      }
    ]
  },
  "001287": {
    "daily": [
      {
        "date": "2025-10-24",
        "price": 24.05,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-27",
        "price": 26.46,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.02,
        "hold_days": 3
      }
    ]
  },
  "601231": {
    "daily": [
      {
        "date": "2025-10-27",
        "price": 26.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-28",
        "price": 25.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.3,
        "hold_days": 1
      }
    ]
  },
  "603993": {
    "daily": [
      {
        "date": "2025-10-27",
        "price": 17.29,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-28",
        "price": 16.75,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.12,
        "hold_days": 1
      }
    ]
  },
  "688175": {
    "daily": [
      {
        "date": "2025-10-27",
        "price": 24.94,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-31",
        "price": 24.96,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.08,
        "hold_days": 4
      }
    ]
  },
  "002430": {
    "daily": [
      {
        "date": "2025-10-29",
        "price": 26.84,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-30",
        "price": 29.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 9.99,
        "hold_days": 1
      }
    ]
  },
  "301349": {
    "daily": [
      {
        "date": "2025-10-29",
        "price": 45.0,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-31",
        "price": 48.8,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 8.44,
        "hold_days": 2
      }
    ]
  },
  "002560": {
    "daily": [
      {
        "date": "2025-10-29",
        "price": 8.77,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-05",
        "price": 9.13,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.1,
        "hold_days": 7
      }
    ]
  },
  "688599": {
    "daily": [
      {
        "date": "2025-10-30",
        "price": 19.54,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-10-31",
        "price": 20.37,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.25,
        "hold_days": 1
      }
    ]
  },
  "601899": {
    "daily": [
      {
        "date": "2025-10-30",
        "price": 31.11,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-03",
        "price": 30.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.57,
        "hold_days": 4
      }
    ]
  },
  "002169": {
    "daily": [
      {
        "date": "2025-10-31",
        "price": 8.28,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-03",
        "price": 8.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 5.19,
        "hold_days": 3
      }
    ]
  },
  "002452": {
    "daily": [
      {
        "date": "2025-10-31",
        "price": 8.22,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-03",
        "price": 8.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.77,
        "hold_days": 3
      }
    ]
  },
  "002546": {
    "daily": [
      {
        "date": "2025-10-31",
        "price": 7.25,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-04",
        "price": 7.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.03,
        "hold_days": 4
      }
    ]
  },
  "600295": {
    "daily": [
      {
        "date": "2025-11-03",
        "price": 11.39,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-17",
        "price": 11.72,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 2.9,
        "hold_days": 14
      }
    ]
  },
  "300518": {
    "daily": [
      {
        "date": "2025-11-04",
        "price": 16.59,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-05",
        "price": 15.98,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.68,
        "hold_days": 1
      }
    ]
  },
  "603228": {
    "daily": [
      {
        "date": "2025-11-06",
        "price": 76.55,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-07",
        "price": 73.52,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.96,
        "hold_days": 1
      }
    ]
  },
  "300080": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 5.48,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-10",
        "price": 6.12,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 11.68,
        "hold_days": 3
      }
    ]
  },
  "300408": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 52.07,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-10",
        "price": 51.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.5,
        "hold_days": 3
      }
    ]
  },
  "002125": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 15.85,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-11",
        "price": 15.79,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.38,
        "hold_days": 4
      }
    ]
  },
  "000155": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 12.67,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-12",
        "price": 12.27,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.16,
        "hold_days": 5
      }
    ]
  },
  "002140": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 13.15,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-12",
        "price": 12.43,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.48,
        "hold_days": 5
      }
    ]
  },
  "603931": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 31.32,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-12",
        "price": 30.76,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.79,
        "hold_days": 5
      }
    ]
  },
  "601068": {
    "daily": [
      {
        "date": "2025-11-07",
        "price": 5.46,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-17",
        "price": 5.63,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.11,
        "hold_days": 10
      }
    ]
  },
  "603030": {
    "daily": [
      {
        "date": "2025-11-10",
        "price": 3.91,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-11",
        "price": 3.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.53,
        "hold_days": 1
      }
    ]
  },
  "603739": {
    "daily": [
      {
        "date": "2025-11-10",
        "price": 15.83,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-13",
        "price": 16.05,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.39,
        "hold_days": 3
      }
    ]
  },
  "600579": {
    "daily": [
      {
        "date": "2025-11-10",
        "price": 9.46,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 9.51,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.53,
        "hold_days": 8
      }
    ]
  },
  "000421": {
    "daily": [
      {
        "date": "2025-11-11",
        "price": 7.46,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-12",
        "price": 7.53,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.94,
        "hold_days": 1
      }
    ]
  },
  "002482": {
    "daily": [
      {
        "date": "2025-11-11",
        "price": 1.92,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 1.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.04,
        "hold_days": 7
      }
    ]
  },
  "002935": {
    "daily": [
      {
        "date": "2025-11-12",
        "price": 18.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-13",
        "price": 19.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.01,
        "hold_days": 1
      },
      {
        "date": "2025-12-10",
        "price": 19.15,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-15",
        "price": 19.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.83,
        "hold_days": 5
      }
    ]
  },
  "001231": {
    "daily": [
      {
        "date": "2025-11-12",
        "price": 23.98,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 23.33,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.71,
        "hold_days": 6
      }
    ]
  },
  "603948": {
    "daily": [
      {
        "date": "2025-11-13",
        "price": 30.91,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-14",
        "price": 34.0,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.0,
        "hold_days": 1
      }
    ]
  },
  "301283": {
    "daily": [
      {
        "date": "2025-11-13",
        "price": 46.66,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 45.65,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.16,
        "hold_days": 5
      }
    ]
  },
  "600740": {
    "daily": [
      {
        "date": "2025-11-13",
        "price": 4.51,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 4.3,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.66,
        "hold_days": 5
      }
    ]
  },
  "002481": {
    "daily": [
      {
        "date": "2025-11-13",
        "price": 6.01,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-20",
        "price": 5.78,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.83,
        "hold_days": 7
      }
    ]
  },
  "002391": {
    "daily": [
      {
        "date": "2025-11-17",
        "price": 6.71,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 6.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.24,
        "hold_days": 1
      }
    ]
  },
  "600157": {
    "daily": [
      {
        "date": "2025-11-17",
        "price": 1.79,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 1.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.47,
        "hold_days": 1
      }
    ]
  },
  "600327": {
    "daily": [
      {
        "date": "2025-11-17",
        "price": 6.14,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-18",
        "price": 5.85,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.72,
        "hold_days": 1
      }
    ]
  },
  "002398": {
    "daily": [
      {
        "date": "2025-11-26",
        "price": 6.85,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-27",
        "price": 6.17,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -9.93,
        "hold_days": 1
      },
      {
        "date": "2025-12-04",
        "price": 6.3,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-05",
        "price": 6.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.6,
        "hold_days": 1
      }
    ]
  },
  "002702": {
    "daily": [
      {
        "date": "2025-11-27",
        "price": 6.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-11-28",
        "price": 7.24,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.03,
        "hold_days": 1
      }
    ]
  },
  "002729": {
    "daily": [
      {
        "date": "2025-12-02",
        "price": 16.68,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-08",
        "price": 17.86,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.07,
        "hold_days": 6
      }
    ]
  },
  "603668": {
    "daily": [
      {
        "date": "2025-12-04",
        "price": 15.62,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-05",
        "price": 16.29,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 4.29,
        "hold_days": 1
      }
    ]
  },
  "000039": {
    "daily": [
      {
        "date": "2025-12-04",
        "price": 9.15,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-08",
        "price": 9.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.83,
        "hold_days": 4
      }
    ]
  },
  "002540": {
    "daily": [
      {
        "date": "2025-12-08",
        "price": 7.42,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-09",
        "price": 7.16,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.5,
        "hold_days": 1
      }
    ]
  },
  "688333": {
    "daily": [
      {
        "date": "2025-12-08",
        "price": 83.19,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-09",
        "price": 83.2,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.01,
        "hold_days": 1
      }
    ]
  },
  "002903": {
    "daily": [
      {
        "date": "2025-12-08",
        "price": 24.68,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-10",
        "price": 23.94,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.0,
        "hold_days": 2
      }
    ]
  },
  "603421": {
    "daily": [
      {
        "date": "2025-12-08",
        "price": 8.09,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-11",
        "price": 8.08,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -0.12,
        "hold_days": 3
      }
    ]
  },
  "000727": {
    "daily": [
      {
        "date": "2025-12-09",
        "price": 2.89,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-11",
        "price": 2.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -7.27,
        "hold_days": 2
      }
    ]
  },
  "600828": {
    "daily": [
      {
        "date": "2025-12-10",
        "price": 7.13,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-11",
        "price": 7.16,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.42,
        "hold_days": 1
      }
    ]
  },
  "300726": {
    "daily": [
      {
        "date": "2025-12-10",
        "price": 42.12,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-16",
        "price": 40.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.51,
        "hold_days": 6
      }
    ]
  },
  "002625": {
    "daily": [
      {
        "date": "2025-12-12",
        "price": 52.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-16",
        "price": 51.48,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.38,
        "hold_days": 4
      }
    ]
  },
  "002487": {
    "daily": [
      {
        "date": "2025-12-15",
        "price": 57.23,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-16",
        "price": 53.95,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.73,
        "hold_days": 1
      }
    ]
  },
  "601179": {
    "daily": [
      {
        "date": "2025-12-15",
        "price": 9.6,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-16",
        "price": 9.24,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.75,
        "hold_days": 1
      }
    ]
  },
  "002046": {
    "daily": [
      {
        "date": "2025-12-19",
        "price": 39.63,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-22",
        "price": 43.59,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 9.99,
        "hold_days": 3
      }
    ]
  },
  "301073": {
    "daily": [
      {
        "date": "2025-12-19",
        "price": 27.3,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-22",
        "price": 27.7,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.47,
        "hold_days": 3
      }
    ]
  },
  "000801": {
    "daily": [
      {
        "date": "2025-12-22",
        "price": 17.37,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-23",
        "price": 16.9,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.71,
        "hold_days": 1
      }
    ]
  },
  "000969": {
    "daily": [
      {
        "date": "2025-12-23",
        "price": 20.04,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-24",
        "price": 20.22,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 0.9,
        "hold_days": 1
      },
      {
        "date": "2025-12-30",
        "price": 20.69,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-31",
        "price": 21.01,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.55,
        "hold_days": 1
      }
    ]
  },
  "002478": {
    "daily": [
      {
        "date": "2025-12-23",
        "price": 8.41,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-24",
        "price": 8.57,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 1.9,
        "hold_days": 1
      }
    ]
  },
  "300285": {
    "daily": [
      {
        "date": "2025-12-23",
        "price": 27.39,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-24",
        "price": 28.36,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.54,
        "hold_days": 1
      }
    ]
  },
  "000007": {
    "daily": [
      {
        "date": "2025-12-24",
        "price": 11.8,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-25",
        "price": 11.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.03,
        "hold_days": 1
      }
    ]
  },
  "002163": {
    "daily": [
      {
        "date": "2025-12-24",
        "price": 19.35,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-25",
        "price": 20.68,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.87,
        "hold_days": 1
      }
    ]
  },
  "603696": {
    "daily": [
      {
        "date": "2025-12-24",
        "price": 26.88,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-25",
        "price": 26.5,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.41,
        "hold_days": 1
      }
    ]
  },
  "301217": {
    "daily": [
      {
        "date": "2025-12-24",
        "price": 37.2,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-29",
        "price": 36.56,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.72,
        "hold_days": 5
      }
    ]
  },
  "300629": {
    "daily": [
      {
        "date": "2025-12-25",
        "price": 21.74,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-26",
        "price": 23.33,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 7.31,
        "hold_days": 1
      }
    ]
  },
  "603097": {
    "daily": [
      {
        "date": "2025-12-25",
        "price": 30.03,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-26",
        "price": 29.31,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.4,
        "hold_days": 1
      }
    ]
  },
  "603408": {
    "daily": [
      {
        "date": "2025-12-25",
        "price": 13.6,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-26",
        "price": 14.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 3.16,
        "hold_days": 1
      }
    ]
  },
  "000797": {
    "daily": [
      {
        "date": "2025-12-25",
        "price": 4.16,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-29",
        "price": 4.03,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -3.12,
        "hold_days": 4
      }
    ]
  },
  "605358": {
    "daily": [
      {
        "date": "2025-12-25",
        "price": 37.31,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-29",
        "price": 35.54,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -4.74,
        "hold_days": 4
      }
    ]
  },
  "002255": {
    "daily": [
      {
        "date": "2025-12-25",
        "price": 12.83,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-31",
        "price": 12.62,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -1.64,
        "hold_days": 6
      }
    ]
  },
  "601212": {
    "daily": [
      {
        "date": "2025-12-26",
        "price": 5.87,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-29",
        "price": 6.24,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 6.3,
        "hold_days": 3
      }
    ]
  },
  "603667": {
    "daily": [
      {
        "date": "2025-12-26",
        "price": 52.58,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-29",
        "price": 57.84,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": 10.0,
        "hold_days": 3
      }
    ]
  },
  "600108": {
    "daily": [
      {
        "date": "2025-12-26",
        "price": 3.32,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-31",
        "price": 3.15,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.12,
        "hold_days": 5
      }
    ]
  },
  "300141": {
    "daily": [
      {
        "date": "2025-12-29",
        "price": 13.07,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-30",
        "price": 12.71,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.75,
        "hold_days": 1
      }
    ]
  },
  "688053": {
    "daily": [
      {
        "date": "2025-12-29",
        "price": 38.6,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-30",
        "price": 36.48,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -5.49,
        "hold_days": 1
      }
    ]
  },
  "603015": {
    "daily": [
      {
        "date": "2025-12-29",
        "price": 12.87,
        "type": "buy",
        "reason": "均线多头+涨停基因+5日线上",
        "reason_detail": {
          "F1 均线多头": "MA5>MA10>MA20>MA60，四线斜率向上",
          "F2 涨停基因": "近20日内有过涨停（涨幅≥9.8%）",
          "F3 5日线上": "收盘价 > MA5 均线"
        }
      },
      {
        "date": "2025-12-31",
        "price": 12.55,
        "type": "sell",
        "reason": "PROT_ADJ移动止盈",
        "reason_detail": "收盘价跌破PROT_ADJ修正止盈线，触发移动止盈",
        "pnl_pct": -2.49,
        "hold_days": 2
      }
    ]
  }
};
