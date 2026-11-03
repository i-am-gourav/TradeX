const stockMarketService = require("../services/stockMarketService");
const request = require("supertest");
const app = require("../index");

describe("Stock Market Service & APIs", () => {
  describe("stockMarketService unit functions", () => {
    test("getAllQuotes returns a non-empty list of quotes with prices", async () => {
      const quotes = await stockMarketService.getAllQuotes();
      expect(Array.isArray(quotes)).toBe(true);
      expect(quotes.length).toBeGreaterThan(0);
      expect(quotes[0]).toHaveProperty("symbol");
      expect(quotes[0]).toHaveProperty("price");
      expect(typeof quotes[0].price).toBe("number");
    });

    test("getQuoteBySymbol returns quote for valid symbol", async () => {
      const quote = await stockMarketService.getQuoteBySymbol("INFY");
      expect(quote).toBeDefined();
      expect(quote.symbol).toBe("INFY");
      expect(quote.price).toBeGreaterThan(0);
    });

    test("getQuoteBySymbol returns placeholder quote for unknown symbol", async () => {
      const quote = await stockMarketService.getQuoteBySymbol("UNKNOWN_XYZ");
      expect(quote).toBeDefined();
      expect(quote.symbol).toBe("UNKNOWN_XYZ");
      expect(quote.price).toBe(100.0);
    });

    test("getMarketIndices returns major benchmark indices", async () => {
      const indices = await stockMarketService.getMarketIndices();
      expect(Array.isArray(indices)).toBe(true);
      const symbols = indices.map((i) => i.symbol);
      expect(symbols).toContain("NIFTY 50");
      expect(symbols).toContain("SENSEX");
    });

    test("getStockHistory returns historical data points for chart", () => {
      const history = stockMarketService.getStockHistory("PORTFOLIO", 15);
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(15);
      expect(history[0]).toHaveProperty("date");
      expect(history[0]).toHaveProperty("value");
    });
  });

  describe("Stock Market REST endpoints", () => {
    test("GET /api/market/quotes returns 200 and list of quotes", async () => {
      const res = await request(app).get("/api/market/quotes");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    test("GET /api/market/quote/:symbol returns single stock quote", async () => {
      const res = await request(app).get("/api/market/quote/RELIANCE");
      expect(res.status).toBe(200);
      expect(res.body.symbol).toBe("RELIANCE");
    });

    test("GET /api/market/indices returns 200 with NIFTY and SENSEX", async () => {
      const res = await request(app).get("/api/market/indices");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      const nifty = res.body.find((item) => item.symbol === "NIFTY 50");
      expect(nifty).toBeDefined();
    });

    test("GET /api/market/history returns history data array", async () => {
      const res = await request(app).get("/api/market/history/INFY?days=10");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(10);
    });
  });
});

