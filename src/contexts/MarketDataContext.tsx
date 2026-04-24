import React, { createContext, useContext, useEffect, useState } from "react";
import { mockIndices, mockStocks } from "../data/mockData";

export interface MarketData {
  indices: typeof mockIndices;
  stocks: typeof mockStocks;
}

const MarketDataContext = createContext<MarketData | null>(null);

export function MarketDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<MarketData>({ indices: mockIndices, stocks: mockStocks });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const url = (import.meta as any).env?.VITE_APP_URL ? `${(import.meta as any).env.VITE_APP_URL}/api/market-data` : '/api/market-data';
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch market data, continuing with mock data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen w-full">데이터를 불러오는 중입니다...</div>;
  }

  return (
    <MarketDataContext.Provider value={data}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error("useMarketData must be used within a MarketDataProvider");
  }
  return context;
}
