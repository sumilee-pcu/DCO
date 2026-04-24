export const mockIndices = [
  { id: "kospi", name: "코스피", value: 2580.80, change: 28.50, changePercent: 1.12 },
  { id: "kosdaq", name: "코스닥", value: 810.25, change: 6.88, changePercent: 0.85 },
  { id: "nasdaq", name: "나스닥", value: 16253.96, change: -68.27, changePercent: -0.42 },
  { id: "sp500", name: "S&P 500", value: 5120.50, change: -7.68, changePercent: -0.15 },
  { id: "usdkrw", name: "원/달러", value: 1350.20, change: 2.50, changePercent: 0.19 },
];

export const mockStocks = {
  domestic: [
    { id: "005930.KS", name: "삼성전자", logo: "S", category: "IT/반도체", price: 84500, change: 1000, changePercent: 1.20, marketCap: 504040000000000, currency: "KRW",
      financials: { roe: 8.5, per: 15.2, peerPer: 24 }
    },
    { id: "000660.KS", name: "SK하이닉스", logo: "SK", category: "IT/반도체", price: 180500, change: 7800, changePercent: 4.50, marketCap: 131405000000000, currency: "KRW",
      financials: { roe: 15.2, per: 12.5, peerPer: 24 }
    },
    { id: "373220.KS", name: "LG에너지솔루션", logo: "LG", category: "에너지", price: 380000, change: -1500, changePercent: -0.50, marketCap: 88920000000000, currency: "KRW",
      financials: { roe: 4.2, per: 65.4, peerPer: 30 }
    },
    { id: "145020.KS", name: "휴젤", logo: "H", category: "제약/바이오", price: 214000, change: 3500, changePercent: 1.66, marketCap: 2600000000000, currency: "KRW",
      financials: { roe: 12.4, per: 24.1, peerPer: 35 }
    },
  ],
  overseas: [
    { id: "AAPL", name: "애플 (Apple Inc.)", logo: "A", category: "IT", price: 169.30, change: 1.45, changePercent: 0.86, marketCap: 2610000000000, currency: "USD",
      financials: { roe: 156.4, per: 28.4, peerPer: 24,
        revenueData: [
          { year: "2021", revenue: 365, profit: 108 },
          { year: "2022", revenue: 394, profit: 119 },
          { year: "2023", revenue: 383, profit: 114 },
        ] }
    },
    { id: "NVDA", name: "엔비디아 (NVIDIA)", logo: "N", category: "IT/반도체", price: 875.20, change: 25.40, changePercent: 2.99, marketCap: 2180000000000, currency: "USD",
      financials: { roe: 64.2, per: 75.2, peerPer: 35 }
    },
    { id: "MSFT", name: "마이크로소프트", logo: "M", category: "IT/소프트웨어", price: 412.50, change: -2.10, changePercent: -0.50, marketCap: 3060000000000, currency: "USD",
      financials: { roe: 38.5, per: 35.8, peerPer: 30 }
    },
  ],
  etf: [
    { id: "069500.KS", name: "KODEX 200", logo: "K", category: "국내시장", price: 35400, change: 200, changePercent: 0.57, marketCap: 6500000000000, currency: "KRW",
      financials: { roe: 0, per: 0, peerPer: 0 }
    },
    { id: "133690.KS", name: "TIGER 미국나스닥100", logo: "T", category: "해외시장", price: 105200, change: -450, changePercent: -0.42, marketCap: 3200000000000, currency: "KRW",
      financials: { roe: 0, per: 0, peerPer: 0 }
    },
  ]
};

export function generateMockChartData(basePrice: number, points: number = 30) {
  let currentPrice = basePrice * 0.9;
  const data = [];
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const change = currentPrice * (Math.random() * 0.04 - 0.015); // Slight upward bias
    currentPrice += change;
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split("T")[0],
      price: currentPrice
    });
  }
  return data;
}
