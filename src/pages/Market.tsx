import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency, formatMarketCap } from "../lib/utils";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { useMarketData } from "../contexts/MarketDataContext";

type MarketTab = "domestic" | "overseas" | "etf";

export function Market() {
  const [activeTab, setActiveTab] = useState<MarketTab>("domestic");
  const { indices, stocks } = useMarketData();

  return (
    <div className="w-full flex flex-col md:py-margin animate-in fade-in duration-500">
      <TickerTape indices={indices} />

      <div className="mt-md px-margin md:px-0">
        <div className="flex items-center border-b border-surface-variant font-medium">
          <TabButton active={activeTab === "domestic"} onClick={() => setActiveTab("domestic")}>국내</TabButton>
          <TabButton active={activeTab === "overseas"} onClick={() => setActiveTab("overseas")}>해외</TabButton>
          <TabButton active={activeTab === "etf"} onClick={() => setActiveTab("etf")}>ETF</TabButton>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:gap-8 mt-6">
        {activeTab === "domestic" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-6">
            <MarketStatusCard indices={indices} />
            <TopGainersCard stocks={stocks} />
          </div>
        )}

        <div>
          <h3 className="text-xl font-bold text-on-surface mb-4 mt-2">
            {activeTab === "domestic" ? "시가총액 상위" : activeTab === "overseas" ? "해외 기술주 상위" : "주요 ETF"}
          </h3>
          <div className="bg-surface border-y md:border md:border-outline-variant/30 md:rounded-xl overflow-hidden shadow-[0px_1px_3px_rgba(0,0,0,0.05)] md:shadow-sm -mx-4 md:mx-0">
            <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-4 border-b border-surface-variant bg-surface-container-lowest text-on-surface-variant hidden md:grid">
              <span className="text-xs font-semibold uppercase tracking-wider">종목</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-right">시가총액</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-right">현재가</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-right">대비</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-right">차트</span>
            </div>
            <div className="divide-y divide-surface-variant">
              {(stocks as any)[activeTab].map((stock: any) => (
                <StockRow key={stock.id} stock={stock} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-semibold transition-colors relative ${
        active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
      }`}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
      )}
    </button>
  );
}

function TickerTape({ indices }: { indices: any[] }) {
  return (
    <div className="w-full bg-surface-container-lowest border-b border-outline-variant/30 overflow-hidden md:rounded-lg md:border md:mt-4 shadow-sm">
      <div className="flex overflow-x-auto hide-scrollbar py-3 px-4 md:px-6 gap-6 items-center">
        {indices.map((index) => (
          <div key={index.id} className="flex flex-col min-w-max shrink-0 cursor-pointer group">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-medium text-on-surface-variant">{index.name}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold text-on-surface">
                {index.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className={`font-mono text-xs font-bold flex items-center ${index.change >= 0 ? 'text-positive' : 'text-negative'}`}>
                {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketStatusCard({ indices }: { indices: any[] }) {
  const kospi = indices.find(i => i.id === "kospi")!;
  return (
    <div className="col-span-1 md:col-span-4 bg-surface-container-lowest md:rounded-xl border-y md:border border-outline-variant/30 p-5 md:p-6 flex flex-col justify-between hover:bg-surface-container-low transition-colors shadow-sm -mx-4 md:mx-0">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-bold text-on-surface">코스피 시장</h2>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2 h-2 rounded-full bg-positive animate-pulse"></div>
            <span className="text-xs font-medium text-positive">장 운영 중</span>
          </div>
        </div>
        <div className="p-2 bg-surface-container rounded-lg">
          <TrendingUp className="text-on-surface-variant" size={20} />
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold text-on-surface mb-1 font-mono tracking-tight">
          {kospi.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center font-mono text-sm font-bold ${kospi.change >= 0 ? 'text-positive' : 'text-negative'}`}>
            {kospi.change >= 0 ? <ArrowUpRight size={16} className="mr-0.5" /> : <ArrowDownRight size={16} className="mr-0.5" />}
            {Math.abs(kospi.change).toFixed(2)} ({kospi.change >= 0 ? '+' : ''}{kospi.changePercent.toFixed(2)}%)
          </div>
          <span className="text-xs text-on-surface-variant font-medium">오늘</span>
        </div>
      </div>
    </div>
  );
}

function TopGainersCard({ stocks }: { stocks: any }) {
  const gainers = stocks.domestic.filter((s: any) => s.change > 0).sort((a: any, b: any) => b.changePercent - a.changePercent).slice(0, 4);
  return (
    <div className="col-span-1 md:col-span-8 bg-surface-container-lowest md:rounded-xl border-y md:border border-outline-variant/30 p-5 md:p-6 shadow-sm -mx-4 md:mx-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-on-surface">등락 상위</h3>
        <button className="text-xs font-semibold text-primary hover:underline">전체보기</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {gainers.map((stock: any) => (
          <Link to={`/stock/${stock.id}`} key={stock.id} className="bg-surface-container-low border border-outline-variant/30 rounded-lg p-3 hover:border-outline-variant transition-colors group">
            <span className="text-xs font-medium text-on-surface-variant block mb-2 truncate group-hover:text-on-surface transition-colors">{stock.name}</span>
            <span className="font-mono text-sm font-bold text-on-surface block">{stock.price.toLocaleString()}</span>
            <span className={`font-mono text-xs font-bold mt-1 block ${stock.change >= 0 ? 'text-positive' : 'text-negative'}`}>
              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StockRow({ stock, ...props }: { stock: any; [key: string]: any }) {
  const isUp = stock.change >= 0;
  return (
    <Link {...props} to={`/stock/${stock.id}`} className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 p-3 md:p-4 hover:bg-surface-container-low transition-colors items-center group cursor-pointer bg-surface-container-lowest">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded bg-surface border border-outline-variant/30 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <span className="font-bold text-on-surface text-sm">{stock.logo}</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">{stock.name}</span>
          <span className="text-xs text-on-surface-variant truncate font-mono mt-0.5">{stock.id}</span>
        </div>
      </div>
      
      <span className="font-mono text-sm text-on-surface text-right hidden md:block opacity-90">
        {formatMarketCap(stock.marketCap, stock.currency)}
      </span>
      
      <span className="font-mono text-sm font-bold text-on-surface text-right">
        {formatCurrency(stock.price, stock.currency)}
      </span>
      
      <div className="text-right flex flex-col items-end">
        <span className={`font-mono text-sm font-bold ${isUp ? 'text-positive' : 'text-negative'}`}>
          {isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%
        </span>
        <span className={`font-mono text-xs ${isUp ? 'text-positive' : 'text-negative'} opacity-80 mt-0.5`}>
          {isUp ? '+' : ''}{stock.currency === 'USD' ? stock.change.toFixed(2) : stock.change.toLocaleString()}
        </span>
      </div>
      
      {/* Simple SVG Sparkline placeholder */}
      <div className="w-16 h-8 justify-self-end relative hidden md:block">
        <svg className={`w-full h-full fill-none ${isUp ? 'stroke-positive' : 'stroke-negative'}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 100 30">
          {isUp ? (
            <path d="M0,25 Q10,20 20,22 T40,15 T60,18 T80,5 T100,8" />
          ) : (
            <path d="M0,5 Q10,10 20,8 T40,15 T60,12 T80,25 T100,22" />
          )}
        </svg>
      </div>
    </Link>
  );
}
