import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import YahooFinance from "yahoo-finance2";
import cors from "cors";

const yahooFinance = new YahooFinance();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());

  // In-memory cache to avoid hitting rate limits
  let marketDataCache: any = null;
  let lastFetchTime = 0;
  const CACHE_TTL = 60 * 1000; // 1 minute

  app.get("/api/market-data", async (req, res) => {
    if (marketDataCache && Date.now() - lastFetchTime < CACHE_TTL) {
      return res.json(marketDataCache);
    }

    try {
      const symbols = [
        "^KS11", "^KQ11", "^IXIC", "^GSPC", "KRW=X",
        "005930.KS", "000660.KS", "373220.KS", "145020.KQ",
        "AAPL", "NVDA", "MSFT",
        "069500.KS", "133690.KS"
      ];

      const results = await Promise.allSettled(
        symbols.map(sym => yahooFinance.quote(sym))
      );

      const quotes: Record<string, any> = {};
      results.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value) {
          quotes[symbols[idx]] = result.value;
        }
      });

      const buildIndex = (id: string, name: string, symbol: string) => {
        const q = quotes[symbol];
        if (!q) return { id, name, value: 0, change: 0, changePercent: 0 };
        return {
          id,
          name,
          value: q.regularMarketPrice || 0,
          change: q.regularMarketChange || 0,
          changePercent: q.regularMarketChangePercent || 0
        };
      };

      const buildStock = (id: string, name: string, symbol: string, logo: string, category: string, currency: string = "KRW", peerPer: number = 20) => {
        const q = quotes[symbol];
        if (!q) return { id, name, logo, category, price: 0, change: 0, changePercent: 0, marketCap: 0, currency, financials: { roe: 0, per: 0, peerPer } };
        
        return {
           id, name, logo, category,
           price: q.regularMarketPrice || 0,
           change: q.regularMarketChange || 0,
           changePercent: q.regularMarketChangePercent || 0,
           marketCap: q.marketCap || 0,
           currency,
           financials: {
             roe: q.trailingPE ? 15 : 0, // Mocked ROE if not available simply
             per: q.trailingPE || 0,
             peerPer
           }
        };
      }

      const indices = [
        buildIndex("kospi", "코스피", "^KS11"),
        buildIndex("kosdaq", "코스닥", "^KQ11"),
        buildIndex("nasdaq", "나스닥", "^IXIC"),
        buildIndex("sp500", "S&P 500", "^GSPC"),
        buildIndex("usdkrw", "원/달러", "KRW=X"),
      ];

      const domestic = [
        buildStock("005930.KS", "삼성전자", "005930.KS", "S", "IT/반도체", "KRW", 24),
        buildStock("000660.KS", "SK하이닉스", "000660.KS", "SK", "IT/반도체", "KRW", 24),
        buildStock("373220.KS", "LG에너지솔루션", "373220.KS", "LG", "에너지", "KRW", 30),
        buildStock("145020.KQ", "휴젤", "145020.KQ", "H", "제약/바이오", "KRW", 35),
      ];

      const overseas = [
        buildStock("AAPL", "애플 (Apple Inc.)", "AAPL", "A", "IT", "USD", 24),
        buildStock("NVDA", "엔비디아 (NVIDIA)", "NVDA", "N", "IT/반도체", "USD", 35),
        buildStock("MSFT", "마이크로소프트", "MSFT", "M", "IT/소프트웨어", "USD", 30),
      ];
      
      // Inject some mock historical revenue data into AAPL just to show the chart
      (overseas[0].financials as any).revenueData = [
          { year: "2021", revenue: 365, profit: 108 },
          { year: "2022", revenue: 394, profit: 119 },
          { year: "2023", revenue: 383, profit: 114 },
      ];

      const etf = [
        buildStock("069500.KS", "KODEX 200", "069500.KS", "K", "국내시장", "KRW", 0),
        buildStock("133690.KS", "TIGER 미국나스닥100", "133690.KS", "T", "해외시장", "KRW", 0),
      ];

      marketDataCache = { indices, stocks: { domestic, overseas, etf } };
      lastFetchTime = Date.now();

      res.json(marketDataCache);
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
