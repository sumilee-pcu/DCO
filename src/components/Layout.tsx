import React, { useEffect } from "react";
import { TrendingUp, User, Search, LineChart, Star, Wallet, Lightbulb } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Ensure dark mode is active by default as requested
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col pb-[80px] md:pb-0">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-variant flex items-center justify-between px-4 h-14 md:px-margin md:h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 text-primary mr-8">
            <div className="p-1.5 rounded-full hover:bg-surface-container-high transition-colors">
              <TrendingUp size={20} className="stroke-primary" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl text-on-surface tracking-tight hidden sm:block">StockBoard</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <DesktopNavItem to="/" label="시장" active={location.pathname === "/"} />
            <DesktopNavItem to="/watchlist" label="관심종목" active={location.pathname === "/watchlist"} />
            <DesktopNavItem to="/portfolio" label="포트폴리오" active={location.pathname === "/portfolio"} />
            <DesktopNavItem to="/insights" label="인사이트" active={location.pathname === "/insights"} />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <Search size={20} />
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer">
            <User size={16} className="text-on-surface-variant" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col px-0 md:px-margin">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant flex items-center justify-around h-16 pb-safe z-50">
        <NavItem to="/" icon={<LineChart />} label="시장" active={location.pathname === "/"} />
        <NavItem to="/watchlist" icon={<Star />} label="관심종목" active={location.pathname === "/watchlist"} />
        <NavItem to="/portfolio" icon={<Wallet />} label="포트폴리오" active={location.pathname === "/portfolio"} />
        <NavItem to="/insights" icon={<Lightbulb />} label="인사이트" active={location.pathname === "/insights"} />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-16 gap-1 transition-all ${
        active ? "text-primary scale-105" : "text-on-surface-variant hover:text-on-surface active:scale-95"
      }`}
    >
      <div className={`[&>svg]:w-6 [&>svg]:h-6 ${active ? "[&>svg]:fill-primary/20" : ""}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium tracking-wider">{label}</span>
    </Link>
  );
}

function DesktopNavItem({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`text-sm font-semibold transition-colors relative py-4 ${
        active ? "text-on-surface" : "text-on-surface-variant hover:text-on-surface"
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full" />
      )}
    </Link>
  );
}
