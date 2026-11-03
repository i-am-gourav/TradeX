const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../index");
const { UserModel } = require("../model/UserModel");
const { JWT_SECRET } = require("../middleware/authMiddleware");

describe("Authentication & User Management APIs", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("POST /auth/signup", () => {
    test("rejects signup when required fields are missing", async () => {
      const res = await request(app).post("/auth/signup").send({
        email: "test@example.com",
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/required/i);
    });

    test("rejects signup when password is less than 6 characters", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: "Test User",
        email: "short@example.com",
        password: "123",
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/at least 6 characters/i);
    });

    test("rejects signup when email is already in use", async () => {
      jest.spyOn(UserModel, "findOne").mockResolvedValue({ email: "existing@example.com" });

      const res = await request(app).post("/auth/signup").send({
        name: "Existing User",
        email: "existing@example.com",
        password: "password123",
      });
      expect(res.status).toBe(409);
      expect(res.body.error).toMatch(/already exists/i);
    });

    test("successfully creates a new user and returns JWT token", async () => {
      jest.spyOn(UserModel, "findOne").mockResolvedValue(null);
      jest.spyOn(UserModel.prototype, "save").mockResolvedValue({
        _id: "user123mockid",
        name: "Gourav Batra",
        email: "gourav@tradex.com",
        accountBalance: 100000,
      });

      const res = await request(app).post("/auth/signup").send({
        name: "Gourav Batra",
        email: "gourav@tradex.com",
        password: "securepassword",
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toEqual({
        id: "user123mockid",
        name: "Gourav Batra",
        email: "gourav@tradex.com",
        accountBalance: 100000,
      });

      // Verify token is valid JWT
      const decoded = jwt.verify(res.body.token, JWT_SECRET);
      expect(decoded.email).toBe("gourav@tradex.com");
    });
  });

  describe("POST /auth/login", () => {
    test("rejects login if email or password missing", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "trader@tradex.com",
      });
      expect(res.status).toBe(400);
    });

    test("rejects login if user does not exist", async () => {
      jest.spyOn(UserModel, "findOne").mockResolvedValue(null);

      const res = await request(app).post("/auth/login").send({
        email: "nonexistent@tradex.com",
        password: "secretpassword",
      });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid/i);
    });

    test("rejects login if password does not match", async () => {
      const hashedPassword = await bcrypt.hash("correctPassword", 10);
      jest.spyOn(UserModel, "findOne").mockResolvedValue({
        _id: "mockid456",
        email: "trader@tradex.com",
        password: hashedPassword,
      });

      const res = await request(app).post("/auth/login").send({
        email: "trader@tradex.com",
        password: "wrongPassword",
      });
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/invalid/i);
    });

    test("successfully logs in and returns user and token", async () => {
      const hashedPassword = await bcrypt.hash("correctPassword", 10);
      jest.spyOn(UserModel, "findOne").mockResolvedValue({
        _id: "mockid789",
        name: "Active Trader",
        email: "active@tradex.com",
        password: hashedPassword,
        accountBalance: 150000,
      });

      const res = await request(app).post("/auth/login").send({
        email: "active@tradex.com",
        password: "correctPassword",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.name).toBe("Active Trader");
    });
  });

  describe("Protected user profile GET /auth/user", () => {
    test("fails with 401 when authorization header is absent", async () => {
      const res = await request(app).get("/auth/user");
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/no token provided/i);
    });

    test("fails with 403 when authorization token is invalid", async () => {
      const res = await request(app)
        .get("/auth/user")
        .set("Authorization", "Bearer invalid.token.value");
      expect(res.status).toBe(403);
    });

    test("succeeds with 200 when valid token provided", async () => {
      const token = jwt.sign(
        { id: "mockuser999", email: "trader@tradex.com", name: "Trader Joe" },
        JWT_SECRET
      );

      jest.spyOn(UserModel, "findById").mockReturnValue({
        select: jest.fn().mockResolvedValue({
          _id: "mockuser999",
          name: "Trader Joe",
          email: "trader@tradex.com",
          accountBalance: 120000,
        }),
      });

      const res = await request(app)
        .get("/auth/user")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Trader Joe");
      expect(res.body.email).toBe("trader@tradex.com");
    });
  });
});

