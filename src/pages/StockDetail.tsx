import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { generateMockChartData } from "../data/mockData";
import { ArrowLeft, Star, ArrowUpRight, ArrowDownRight, Activity, TrendingUp, HelpCircle, ShieldCheck } from "lucide-react";
import { formatCurrency } from "../lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, BarChart, Bar, Legend } from "recharts";
import { useMarketData } from "../contexts/MarketDataContext";

export function StockDetail() {
  const { id } = useParams<{ id: string }>();
  const [timeframe, setTimeframe] = useState("1M");
  const { stocks } = useMarketData();
  
  // Find stock across all categories
  const stock = useMemo(() => {
    return [...stocks.domestic, ...stocks.overseas, ...stocks.etf].find((s: any) => s.id === id) || stocks.domestic[0];
  }, [id, stocks]);

  const chartData = useMemo(() => {
    const points = timeframe === "1W" ? 7 : timeframe === "1M" ? 30 : timeframe === "3M" ? 90 : 365;
    return generateMockChartData(stock.price, points);
  }, [stock.price, timeframe]);

  const isUp = stock.change >= 0;
  const colorMode = isUp ? "#EF4444" : "#3B82F6"; // positive: red, negative: blue for KR market style

  if (!stock) return <div className="p-8 text-center">종목을 찾을 수 없습니다.</div>;

  return (
    <div className="w-full flex flex-col md:py-margin px-4 md:px-0 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 md:pb-0">
      
      {/* Detail Header */}
      <div className="mb-6 mt-4 md:mt-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link to="/" className="md:hidden p-1.5 -ml-1.5 rounded-full hover:bg-surface-container transition-colors mr-1">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">{stock.name}</h1>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-sm font-medium">
              <span className="bg-surface-container px-2 py-0.5 rounded text-xs">{stock.id}</span>
              <span>{stock.category}</span>
            </div>
          </div>
          <button className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
            <Star size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-2 mt-4">
          <div className="text-4xl font-bold text-on-surface font-mono tracking-tighter">
            {formatCurrency(stock.price, stock.currency)}
          </div>
          <div className={`flex items-center text-lg font-bold pb-0.5 font-mono ${isUp ? 'text-positive' : 'text-negative'}`}>
            {isUp ? <ArrowUpRight size={20} className="mr-1" /> : <ArrowDownRight size={20} className="mr-1" />}
            {Math.abs(stock.change).toLocaleString()} ({isUp ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-surface-container-lowest md:rounded-xl border-y md:border border-outline-variant/30 p-4 md:p-6 mb-8 shadow-sm -mx-4 md:mx-0">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar border-b border-surface-variant">
          {["1D", "1W", "1M", "3M", "1Y", "MAX"].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                timeframe === tf 
                  ? `${isUp ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'}` 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="h-[250px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorMode} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colorMode} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.2} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return `${date.getMonth()+1}/${date.getDate()}`;
                }}
                minTickGap={30}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11, fontFamily: 'monospace' }}
                tickFormatter={(val) => val.toLocaleString()}
                orientation="right"
                width={80}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: 'var(--color-on-surface)', fontWeight: 'bold', fontFamily: 'monospace' }}
                labelStyle={{ color: 'var(--color-on-surface-variant)', fontSize: '12px', marginBottom: '4px' }}
                formatter={(value: number) => [value.toLocaleString(), '가격']}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={colorMode} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-column Grid for wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Col: Key Metrics */}
        <div className="col-span-1 lg:col-span-1 border-t border-surface-variant pt-6 md:border-none md:pt-0">
          <h3 className="text-lg font-bold text-on-surface mb-4">핵심 지표</h3>
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
            <MetricCard label="시가" value={stock.price * 0.98} currency={stock.currency} />
            <MetricCard label="고가" value={stock.price * 1.05} currency={stock.currency} highlight="positive" />
            <MetricCard label="저가" value={stock.price * 0.95} currency={stock.currency} highlight="negative" />
            <MetricCard label="거래량" value={12540000} isVolume />
            <MetricCard label="시가총액" value={stock.marketCap} isCompact currency={stock.currency} />
            <MetricCard label="PER" value={stock.financials.per} suffix="x" />
          </div>
        </div>

        {/* Right Col: Financial Health */}
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-on-surface">재무 건강검진</h3>
            <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">AI 분석</span>
          </div>

          <div className="flex flex-col gap-4">
            
            {/* Row 1: Charts & Key Ratios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Revenue vs Profit Chart (If available) */}
              {stock.financials.revenueData ? (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">매출액 vs 영업이익</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">연간 비교 ({stock.currency === 'USD' ? '10억 달러' : '조 원'})</p>
                    </div>
                    <Activity size={16} className="text-primary" />
                  </div>
                  <div className="h-[180px] w-full mt-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stock.financials.revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.2} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--color-on-surface-variant)' }} />
                        <Tooltip cursor={{fill: 'var(--color-surface-container-low)'}} contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }} />
                        <Bar dataKey="revenue" name="매출액" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="profit" name="영업이익" fill="var(--color-secondary-container)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center">
                  <HelpCircle className="text-outline-variant mb-2" size={32} />
                  <p className="text-sm font-medium text-on-surface-variant">재무 데이터가 제공되지 않는 종목입니다.</p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {/* ROE Card */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ROE (자기자본이익률)</h4>
                      <div className="p-1 rounded bg-orange-500/10 text-orange-500">
                        <TrendingUp size={14} />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-on-surface font-mono my-2">{stock.financials.roe}%</div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-on-surface-variant">업계 평균: 24%</span>
                      <span className={stock.financials.roe > 24 ? "text-orange-500" : "text-on-surface-variant"}>
                        {stock.financials.roe > 24 ? "매우 높음" : "보통"}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${Math.min((stock.financials.roe / 40) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* PER Card */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">PER (주가수익비율)</h4>
                      <Activity size={14} className="text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-on-surface font-mono my-2">{stock.financials.per}x</div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-on-surface-variant">예상 PER 그룹</span>
                    <div className="px-2 py-1 bg-secondary-container/20 text-secondary rounded text-xs font-bold tracking-wider">
                      {stock.financials.per > stock.financials.peerPer ? "프리미엄" : "저평가"}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* AI Summary Card */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm text-on-primary">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-bold text-base text-primary mb-1">탄탄한 펀더멘탈</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  이 기업은 동종 업계 대비 탁월한 수익성(ROE {stock.financials.roe}%)과 운영 효율성을 보여줍니다. 매우 높은 자본 배분 능력은 프리미엄 시장 가치(PER {stock.financials.per}x)를 뒷받침하는 핵심 요인입니다.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Floating Action Buttons for quick trade (Mobile mostly, inline on desktop) */}
      <div className="fixed bottom-16 md:static left-0 w-full md:w-auto bg-surface/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t border-surface-variant md:border-none p-4 md:p-0 z-40 flex justify-center mt-8">
        <div className="w-full max-w-7xl flex gap-4 px-0 md:px-0">
          <button className="flex-1 md:flex-none md:w-40 border border-negative text-negative font-bold rounded-lg py-3.5 hover:bg-negative/10 transition-all text-sm tracking-wider">
            매도
          </button>
          <button className="flex-1 md:flex-none md:w-40 bg-primary text-on-primary font-bold rounded-lg py-3.5 shadow-md shadow-primary/20 hover:brightness-110 transition-all text-sm tracking-wider">
            매수
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, currency, highlight, isCompact, isVolume, suffix }: any) {
  let displayValue = value;
  
  if (value === 0) displayValue = "-";
  else if (isVolume) displayValue = `${(value / 1000000).toFixed(2)}M`;
  else if (isCompact) {
    if (value >= 1e12) displayValue = `${(value / 1e12).toFixed(1)}조`;
    else if (value >= 100000000) displayValue = `${(value / 100000000).toFixed(0)}억`;
  } else if (currency) {
    displayValue = formatCurrency(value, currency);
  } else {
    displayValue = value.toLocaleString();
  }

  const colorClass = highlight === 'positive' ? 'text-positive' : highlight === 'negative' ? 'text-negative' : 'text-on-surface';

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 p-3 md:p-4 rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:bg-surface-container-low transition-colors">
      <span className="text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">{label}</span>
      <span className={`text-base md:text-lg font-bold font-mono tracking-tight ${colorClass}`}>
        {displayValue}{suffix && value !== 0 ? suffix : ''}
      </span>
    </div>
  );
}
