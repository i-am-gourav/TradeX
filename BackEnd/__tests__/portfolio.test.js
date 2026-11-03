const request = require("supertest");
const app = require("../index");
const { HoldingsModel } = require("../model/HoldingsModel");

describe("Portfolio Analytics APIs", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const mockHoldings = [
    { name: "INFY", qty: 10, avg: 1400.0, price: 1500.0 }, // inv: 14000, cur: 15000, pnl: 1000
    { name: "TCS", qty: 2, avg: 3000.0, price: 3200.0 },   // inv: 6000, cur: 6400, pnl: 400
  ];

  test("GET /api/portfolio/summary correctly calculates totals and P&L", async () => {
    jest.spyOn(HoldingsModel, "find").mockResolvedValue(mockHoldings);

    const res = await request(app).get("/api/portfolio/summary");
    expect(res.status).toBe(200);
    expect(res.body.totalHoldings).toBe(2);
    expect(res.body.totalInvestment).toBe(20000);
    expect(res.body.currentValue).toBe(21400);
    expect(res.body.totalPnL).toBe(1400);
    expect(res.body.netReturnPercent).toBe(7); // 1400 / 20000 * 100 = 7%
    expect(res.body.breakdown.length).toBe(2);
  });

  test("GET /api/portfolio/performance returns time-series chart datasets", async () => {
    jest.spyOn(HoldingsModel, "find").mockResolvedValue(mockHoldings);

    const res = await request(app).get("/api/portfolio/performance");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("labels");
    expect(res.body).toHaveProperty("datasets");
    expect(Array.isArray(res.body.labels)).toBe(true);
    expect(Array.isArray(res.body.datasets)).toBe(true);
    expect(res.body.datasets[0]).toHaveProperty("data");
    expect(res.body.datasets[0].data.length).toBe(res.body.labels.length);
  });
});

