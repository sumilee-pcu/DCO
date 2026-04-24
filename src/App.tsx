/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Market } from "./pages/Market";
import { StockDetail } from "./pages/StockDetail";
import { Watchlist } from "./pages/Watchlist";
import { Portfolio } from "./pages/Portfolio";
import { Insights } from "./pages/Insights";
import { MarketDataProvider } from "./contexts/MarketDataContext";

export default function App() {
  return (
    <BrowserRouter>
      <MarketDataProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Market />} />
            <Route path="/stock/:id" element={<StockDetail />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={
              <div className="flex h-full flex-col items-center justify-center p-8 text-center mt-20">
                <h2 className="text-2xl font-bold text-on-surface mb-2">개발 중인 페이지입니다</h2>
                <p className="text-on-surface-variant">곧 새로운 기능으로 찾아뵙겠습니다.</p>
              </div>
            } />
          </Routes>
        </Layout>
      </MarketDataProvider>
    </BrowserRouter>
  );
}
