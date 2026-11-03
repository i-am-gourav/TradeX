/**
 * Stock Market Service
 * Integrates live stock market APIs (Yahoo Finance Real-time Equities & Indices)
 * with intelligent in-memory caching and fallback simulation for offline/test environments.
 */

const BASE_STOCKS = [
  { symbol: "INFY", name: "Infosys Ltd", ticker: "INFY.NS", price: 1555.45, change: -25.25, percentChange: -1.6, open: 1572.0, high: 1580.0, low: 1548.1, volume: 4521000 },
  { symbol: "TCS", name: "Tata Consultancy Services", ticker: "TCS.NS", price: 3194.8, change: -8.0, percentChange: -0.25, open: 3205.0, high: 3220.0, low: 3180.5, volume: 2105400 },
  { symbol: "RELIANCE", name: "Reliance Industries", ticker: "RELIANCE.NS", price: 2112.4, change: 30.0, percentChange: 1.44, open: 2090.0, high: 2125.0, low: 2085.0, volume: 6890300 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", ticker: "HDFCBANK.NS", price: 1522.35, change: 1.65, percentChange: 0.11, open: 1518.0, high: 1530.0, low: 1515.0, volume: 8320100 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", ticker: "BHARTIARTL.NS", price: 541.15, change: 15.7, percentChange: 2.99, open: 530.0, high: 545.0, low: 528.0, volume: 3410000 },
  { symbol: "ITC", name: "ITC Ltd", ticker: "ITC.NS", price: 207.9, change: 1.65, percentChange: 0.8, open: 206.5, high: 209.0, low: 205.5, volume: 11200000 },
  { symbol: "KPITTECH", name: "KPIT Technologies", ticker: "KPITTECH.NS", price: 266.45, change: 9.1, percentChange: 3.54, open: 258.0, high: 268.0, low: 257.0, volume: 1980000 },
  { symbol: "WIPRO", name: "Wipro Ltd", ticker: "WIPRO.NS", price: 577.75, change: 1.85, percentChange: 0.32, open: 575.0, high: 582.0, low: 573.0, volume: 4120000 },
  { symbol: "M&M", name: "Mahindra & Mahindra", ticker: "M&M.NS", price: 779.8, change: -0.1, percentChange: -0.01, open: 782.0, high: 785.0, low: 775.0, volume: 2310000 },
  { symbol: "SBIN", name: "State Bank of India", ticker: "SBIN.NS", price: 430.2, change: -1.45, percentChange: -0.34, open: 432.0, high: 435.0, low: 428.0, volume: 9400000 },
  { symbol: "TATAPOWER", name: "Tata Power Co.", ticker: "TATAPOWER.NS", price: 124.15, change: -0.3, percentChange: -0.24, open: 125.0, high: 126.5, low: 123.5, volume: 7500000 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", ticker: "HINDUNILVR.NS", price: 2417.4, change: 5.1, percentChange: 0.21, open: 2410.0, high: 2430.0, low: 2405.0, volume: 1450000 },
];

const BASE_INDICES = [
  { symbol: "NIFTY 50", ticker: "%5ENSEI", name: "Nifty 50 Index", value: 22450.2, change: 100.5, percentChange: 0.45, high: 22490.0, low: 22380.0 },
  { symbol: "SENSEX", ticker: "%5EBSESN", name: "BSE Sensex 30", value: 73890.15, change: 279.3, percentChange: 0.38, high: 74010.0, low: 73650.0 },
  { symbol: "NIFTY BANK", ticker: "%5ENSEBANK", name: "Nifty Bank Index", value: 47920.8, change: 185.4, percentChange: 0.39, high: 48050.0, low: 47700.0 },
  { symbol: "NIFTY IT", ticker: "%5ECNXIT", name: "Nifty IT Sector", value: 36150.4, change: -120.2, percentChange: -0.33, high: 36400.0, low: 36080.0 },
];

// In-memory cache for live API quotes (TTL 30 seconds to prevent rate limits)
const cache = new Map();
const CACHE_TTL_MS = 30000;

/**
 * Fetch real-time market data from live Yahoo Finance API with timeout and caching
 */
async function fetchLiveTicker(ticker) {
  const cached = cache.get(ticker);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Bypass live network fetch during unit test runs
  if (process.env.NODE_ENV === "test") {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (TradeX Financial Analytics Platform)",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) return null;

    const data = await response.json();
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta) return null;

    const result = {
      price: meta.regularMarketPrice,
      change: Number((meta.regularMarketPrice - (meta.chartPreviousClose || meta.previousClose || meta.regularMarketPrice)).toFixed(2)),
      percentChange: meta.chartPreviousClose
        ? Number((((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100).toFixed(2))
        : 0.0,
      high: meta.regularMarketDayHigh || meta.regularMarketPrice,
      low: meta.regularMarketDayLow || meta.regularMarketPrice,
      volume: meta.regularMarketVolume || 0,
      source: "live_api",
    };

    cache.set(ticker, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    // Return null on network error or timeout to gracefully trigger fallback
    return null;
  }
}

/**
 * Returns quotes for all tracked stocks (with live market API data when available)
 */
async function getAllQuotes() {
  const quotes = await Promise.all(
    BASE_STOCKS.map(async (stock) => {
      const live = await fetchLiveTicker(stock.ticker);
      if (live && live.price) {
        return {
          ...stock,
          price: live.price,
          change: live.change,
          percentChange: live.percentChange,
          high: live.high,
          low: live.low,
          source: "live_api",
        };
      }
      // Micro-jitter simulation fallback if live API fails
      const jitter = (Math.random() - 0.5) * 0.4;
      return {
        ...stock,
        price: Number((stock.price + jitter).toFixed(2)),
        source: "simulated_fallback",
      };
    })
  );
  return quotes;
}

/**
 * Get quote for a single symbol
 */
async function getQuoteBySymbol(symbol) {
  if (!symbol) return null;
  const upper = symbol.toUpperCase().trim();
  const stock = BASE_STOCKS.find((s) => s.symbol === upper);

  if (!stock) {
    return {
      symbol: upper,
      name: upper,
      price: 100.0,
      change: 0.0,
      percentChange: 0.0,
      volume: 100000,
      source: "mock",
    };
  }

  const live = await fetchLiveTicker(stock.ticker);
  if (live && live.price) {
    return {
      ...stock,
      price: live.price,
      change: live.change,
      percentChange: live.percentChange,
      source: "live_api",
    };
  }

  return { ...stock, source: "simulated_fallback" };
}

/**
 * Returns major market indices (NIFTY 50, SENSEX, etc.)
 */
async function getMarketIndices() {
  const indices = await Promise.all(
    BASE_INDICES.map(async (idx) => {
      const live = await fetchLiveTicker(idx.ticker);
      if (live && live.price) {
        return {
          ...idx,
          value: live.price,
          change: live.change,
          percentChange: live.percentChange,
          source: "live_api",
        };
      }
      const jitter = (Math.random() - 0.5) * 2;
      return {
        ...idx,
        value: Number((idx.value + jitter).toFixed(2)),
        source: "simulated_fallback",
      };
    })
  );
  return indices;
}

/**
 * Generate historical price trend data for Chart.js visualization
 */
function getStockHistory(symbol = "PORTFOLIO", days = 30) {
  const history = [];
  const now = new Date();
  let basePrice = 30000;

  const upper = (symbol || "").toUpperCase();
  const matched = BASE_STOCKS.find((s) => s.symbol === upper);
  if (matched) {
    basePrice = matched.price;
  }

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const changeFactor = 1 + (Math.sin(i / 3) * 0.015 + (Math.random() - 0.48) * 0.02);
    basePrice = Number((basePrice * changeFactor).toFixed(2));

    history.push({
      date: dateStr,
      value: basePrice,
    });
  }

  return history;
}

module.exports = {
  getAllQuotes,
  getQuoteBySymbol,
  getMarketIndices,
  getStockHistory,
  fetchLiveTicker,
};
