import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "KRW") {
  return new Intl.NumberFormat(currency === "KRW" ? "ko-KR" : "en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: currency === "KRW" ? 0 : 2,
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatMarketCap(value: number, currency: string = "KRW") {
  if (value === 0 || !value) return "0";
  
  if (currency === "USD") {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    return `$${(value / 1e6).toFixed(0)}M`;
  } else {
    // For KRW
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}조`;
    if (value >= 1e8) return `${(value / 1e8).toFixed(0)}억`;
    return value.toLocaleString();
  }
}
