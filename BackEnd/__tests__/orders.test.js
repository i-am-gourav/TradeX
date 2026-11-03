const request = require("supertest");
const app = require("../index");
const { OrdersModel } = require("../model/OrdersModel");

describe("Orders Management APIs", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  const mockOrder = {
    _id: "order12345",
    name: "RELIANCE",
    qty: 10,
    price: 2112.4,
    mode: "BUY",
    createdAt: new Date(),
  };

  test("GET /allOrders returns sorted orders list", async () => {
    jest.spyOn(OrdersModel, "find").mockReturnValue({
      sort: jest.fn().mockResolvedValue([mockOrder]),
    });

    const res = await request(app).get("/allOrders");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("RELIANCE");
  });

  test("POST /newOrder creates order when payload is valid", async () => {
    jest.spyOn(OrdersModel.prototype, "save").mockResolvedValue(mockOrder);

    const res = await request(app).post("/newOrder").send({
      name: "RELIANCE",
      qty: 10,
      price: 2112.4,
      mode: "BUY",
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("RELIANCE");
    expect(res.body.qty).toBe(10);
  });

  test("POST /newOrder rejects order with missing fields", async () => {
    const res = await request(app).post("/newOrder").send({
      name: "RELIANCE",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/requires name, qty, and price/i);
  });

  test("DELETE /api/orders/:id deletes/cancels order", async () => {
    jest.spyOn(OrdersModel, "findByIdAndDelete").mockResolvedValue(mockOrder);

    const res = await request(app).delete("/api/orders/order12345");
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/cancelled successfully/i);
  });
});

