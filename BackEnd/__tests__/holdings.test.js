const request = require("supertest");
const app = require("../index");
const { HoldingsModel } = require("../model/HoldingsModel");

describe("Holdings Portfolio Management CRUD APIs", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const mockHolding = {
    _id: "654321deadbeef1234567890",
    name: "TCS",
    qty: 5,
    avg: 3100.0,
    price: 3200.0,
    net: "+3.22%",
    day: "+0.5%",
    isLoss: false,
  };

  test("GET /allHoldings returns array of holdings", async () => {
    jest.spyOn(HoldingsModel, "find").mockResolvedValue([mockHolding]);

    const res = await request(app).get("/allHoldings");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("TCS");
  });

  test("GET /api/holdings/:id returns single holding", async () => {
    jest.spyOn(HoldingsModel, "findById").mockResolvedValue(mockHolding);

    const res = await request(app).get("/api/holdings/654321deadbeef1234567890");
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("TCS");
    expect(res.body.qty).toBe(5);
  });

  test("GET /api/holdings/:id returns 404 when holding not found", async () => {
    jest.spyOn(HoldingsModel, "findById").mockResolvedValue(null);

    const res = await request(app).get("/api/holdings/654321deadbeef1234567890");
    expect(res.status).toBe(404);
  });

  test("POST /addHoldings inserts new custom holding", async () => {
    jest.spyOn(HoldingsModel, "insertMany").mockResolvedValue([
      { ...mockHolding, name: "INFY" },
    ]);

    const res = await request(app).post("/addHoldings").send({
      name: "INFY",
      qty: 10,
      avg: 1400.0,
      price: 1550.0,
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/added successfully/i);
  });

  test("PUT /api/holdings/:id updates existing holding", async () => {
    const updatedHolding = { ...mockHolding, qty: 15, avg: 3150.0 };
    jest.spyOn(HoldingsModel, "findByIdAndUpdate").mockResolvedValue(updatedHolding);

    const res = await request(app)
      .put("/api/holdings/654321deadbeef1234567890")
      .send({ qty: 15, avg: 3150.0 });

    expect(res.status).toBe(200);
    expect(res.body.data.qty).toBe(15);
  });

  test("DELETE /api/holdings/:id removes holding", async () => {
    jest.spyOn(HoldingsModel, "findByIdAndDelete").mockResolvedValue(mockHolding);

    const res = await request(app).delete("/api/holdings/654321deadbeef1234567890");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removed successfully/i);
  });
});

