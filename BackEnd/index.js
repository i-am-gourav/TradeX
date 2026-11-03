require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");
const { UserModel } = require("./model/UserModel");
const { verifyToken, JWT_SECRET } = require("./middleware/authMiddleware");
const stockMarketService = require("./services/stockMarketService");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/TradeX";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ==========================================
// 1. Health Check
// ==========================================
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "TradeX Backend API is running!",
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 2. Authentication APIs
// ==========================================
app.post(["/auth/signup", "/api/auth/signup"], async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, name: savedUser.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        accountBalance: savedUser.accountBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
});

app.post(["/auth/login", "/api/auth/login"], async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountBalance: user.accountBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
});

app.get(["/auth/user", "/api/auth/user"], verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile", details: error.message });
  }
});

// ==========================================
// 3. Holdings CRUD REST APIs
// ==========================================

// GET all holdings
app.get(["/allHoldings", "/api/holdings"], async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch holdings", details: error.message });
  }
});

// GET single holding by ID
app.get("/api/holdings/:id", async (req, res) => {
  try {
    const holding = await HoldingsModel.findById(req.params.id);
    if (!holding) {
      return res.status(404).json({ error: "Holding not found" });
    }
    res.json(holding);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving holding", details: error.message });
  }
});

// Add new holding(s) (supports GET for easy browser seeding & POST for API clients)
const addHoldingsHandler = async (req, res) => {
  try {
    if (req.body && (Array.isArray(req.body) || req.body.name)) {
      const itemsToInsert = Array.isArray(req.body) ? req.body : [req.body];
      const inserted = await HoldingsModel.insertMany(itemsToInsert);
      return res.status(201).json({
        message: "Holdings added successfully!",
        count: inserted.length,
        data: inserted,
      });
    }

    // Default batch if no body provided
    const tempHoldings = [
      { name: "BHARTIARTL", qty: 2, avg: 538.05, price: 541.15, net: "+0.58%", day: "+2.99%" },
      { name: "HDFCBANK", qty: 2, avg: 1383.4, price: 1522.35, net: "+10.04%", day: "+0.11%" },
      { name: "HINDUNILVR", qty: 1, avg: 2335.85, price: 2417.4, net: "+3.49%", day: "+0.21%" },
      { name: "INFY", qty: 1, avg: 1350.5, price: 1555.45, net: "+15.18%", day: "-1.60%", isLoss: true },
      { name: "ITC", qty: 5, avg: 202.0, price: 207.9, net: "+2.92%", day: "+0.80%" },
      { name: "KPITTECH", qty: 5, avg: 250.3, price: 266.45, net: "+6.45%", day: "+3.54%" },
      { name: "M&M", qty: 2, avg: 809.9, price: 779.8, net: "-3.72%", day: "-0.01%", isLoss: true },
      { name: "RELIANCE", qty: 1, avg: 2193.7, price: 2112.4, net: "-3.71%", day: "+1.44%" },
      { name: "SBIN", qty: 4, avg: 324.35, price: 430.2, net: "+32.63%", day: "-0.34%", isLoss: true },
      { name: "SGBMAY29", qty: 2, avg: 4727.0, price: 4719.0, net: "-0.17%", day: "+0.15%" },
      { name: "TATAPOWER", qty: 5, avg: 104.2, price: 124.15, net: "+19.15%", day: "-0.24%", isLoss: true },
      { name: "TCS", qty: 1, avg: 3041.7, price: 3194.8, net: "+5.03%", day: "-0.25%", isLoss: true },
      { name: "WIPRO", qty: 4, avg: 489.3, price: 577.75, net: "+18.08%", day: "+0.32%" },
    ];

    const inserted = await HoldingsModel.insertMany(tempHoldings);
    res.status(201).json({ message: "Default holdings added successfully!", count: inserted.length });
  } catch (error) {
    res.status(500).json({ error: "Error adding holdings", details: error.message });
  }
};
app.get("/addHoldings", addHoldingsHandler);
app.post("/addHoldings", addHoldingsHandler);
app.post("/api/holdings", addHoldingsHandler);

// UPDATE holding by ID (PUT / PATCH)
app.put("/api/holdings/:id", async (req, res) => {
  try {
    const updated = await HoldingsModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Holding not found" });
    }
    res.json({ message: "Holding updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: "Error updating holding", details: error.message });
  }
});

// DELETE holding by ID (sell / liquidate holding)
app.delete("/api/holdings/:id", async (req, res) => {
  try {
    const deleted = await HoldingsModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Holding not found" });
    }
    res.json({ message: "Holding removed successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ error: "Error deleting holding", details: error.message });
  }
});

// ==========================================
// 4. Positions REST APIs
// ==========================================

// GET all positions
app.get(["/allPositions", "/api/positions"], async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch positions", details: error.message });
  }
});

// Add new position(s)
const addPositionsHandler = async (req, res) => {
  try {
    if (req.body && (Array.isArray(req.body) || req.body.name)) {
      const itemsToInsert = Array.isArray(req.body) ? req.body : [req.body];
      const inserted = await PositionsModel.insertMany(itemsToInsert);
      return res.status(201).json({ message: "Positions added successfully!", data: inserted });
    }

    const tempPositions = [
      { product: "CNC", name: "EVEREADY", qty: 2, avg: 316.27, price: 312.35, net: "+0.58%", day: "-1.24%", isLoss: true },
      { product: "CNC", name: "JUBLFOOD", qty: 1, avg: 3124.75, price: 3082.65, net: "+10.04%", day: "-1.35%", isLoss: true },
    ];

    const inserted = await PositionsModel.insertMany(tempPositions);
    res.status(201).json({ message: "Default positions added successfully!", count: inserted.length });
  } catch (error) {
    res.status(500).json({ error: "Error adding positions", details: error.message });
  }
};
app.get("/addPositions", addPositionsHandler);
app.post("/addPositions", addPositionsHandler);
app.post("/api/positions", addPositionsHandler);

// DELETE position by ID
app.delete("/api/positions/:id", async (req, res) => {
  try {
    const deleted = await PositionsModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Position not found" });
    }
    res.json({ message: "Position closed successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ error: "Error deleting position", details: error.message });
  }
});

// ==========================================
// 5. Orders CRUD REST APIs
// ==========================================

// GET all orders
app.get(["/allOrders", "/api/orders"], async (req, res) => {
  try {
    const allOrders = await OrdersModel.find({}).sort({ createdAt: -1 });
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
});

// Create new order
app.post(["/newOrder", "/api/orders"], async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;
    if (!name || !qty || price === undefined) {
      return res.status(400).json({ error: "Order requires name, qty, and price" });
    }

    const newOrder = new OrdersModel({
      name,
      qty: Number(qty),
      price: Number(price),
      mode: mode || "BUY",
    });
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to save order", details: error.message });
  }
});

// DELETE / Cancel order by ID
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const deleted = await OrdersModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order cancelled successfully", data: deleted });
  } catch (error) {
    res.status(500).json({ error: "Error cancelling order", details: error.message });
  }
});

// ==========================================
// 6. Stock Market APIs
// ==========================================

// Get all real-time/simulated market quotes
app.get("/api/market/quotes", async (req, res) => {
  try {
    const quotes = await stockMarketService.getAllQuotes();
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock quotes", details: error.message });
  }
});

// Get single stock quote by symbol
app.get("/api/market/quote/:symbol", async (req, res) => {
  try {
    const quote = await stockMarketService.getQuoteBySymbol(req.params.symbol);
    if (!quote) {
      return res.status(404).json({ error: "Stock symbol not found" });
    }
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stock quote", details: error.message });
  }
});

// Get major market indices (NIFTY 50, SENSEX, etc.)
app.get("/api/market/indices", async (req, res) => {
  try {
    const indices = await stockMarketService.getMarketIndices();
    res.json(indices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch indices", details: error.message });
  }
});

// Get historical price trends for Chart.js
app.get(["/api/market/history", "/api/market/history/:symbol"], (req, res) => {
  try {
    const symbol = req.params.symbol || "PORTFOLIO";
    const days = Number(req.query.days) || 30;
    const history = stockMarketService.getStockHistory(symbol, days);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate market history", details: error.message });
  }
});

// ==========================================
// 7. Portfolio Analytics APIs
// ==========================================

// Portfolio summary: total investment, current value, P&L, allocation
app.get("/api/portfolio/summary", async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({});

    let totalInvestment = 0;
    let currentValue = 0;

    const breakdown = holdings.map((h) => {
      const inv = (h.avg || 0) * (h.qty || 0);
      const cur = (h.price || 0) * (h.qty || 0);
      const pnl = cur - inv;
      totalInvestment += inv;
      currentValue += cur;
      return {
        name: h.name,
        qty: h.qty,
        investment: Number(inv.toFixed(2)),
        currentValue: Number(cur.toFixed(2)),
        pnl: Number(pnl.toFixed(2)),
      };
    });

    const totalPnL = currentValue - totalInvestment;
    const netReturnPercent = totalInvestment > 0 ? (totalPnL / totalInvestment) * 100 : 0;

    res.json({
      totalHoldings: holdings.length,
      totalInvestment: Number(totalInvestment.toFixed(2)),
      currentValue: Number(currentValue.toFixed(2)),
      totalPnL: Number(totalPnL.toFixed(2)),
      netReturnPercent: Number(netReturnPercent.toFixed(2)),
      breakdown,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to calculate portfolio summary", details: error.message });
  }
});

// Portfolio performance over time (Chart.js financial trends data)
app.get("/api/portfolio/performance", async (req, res) => {
  try {
    const holdings = await HoldingsModel.find({});
    let curVal = holdings.reduce((sum, h) => sum + (h.price || 0) * (h.qty || 0), 0);
    if (curVal === 0) curVal = 31428.95;

    const labels = [];
    const equityCurve = [];
    const benchmarkNifty = [];

    const now = new Date();
    let valWalk = curVal * 0.92;
    let niftyWalk = 21200;

    for (let i = 14; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i * 2);
      labels.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));

      const drift = 1 + (Math.sin(i / 2) * 0.015 + (Math.random() - 0.45) * 0.02);
      valWalk = Number((valWalk * drift).toFixed(2));
      equityCurve.push(i === 0 ? Number(curVal.toFixed(2)) : valWalk);

      niftyWalk = Number((niftyWalk * (1 + (Math.random() - 0.47) * 0.012)).toFixed(2));
      benchmarkNifty.push(niftyWalk);
    }

    res.json({
      labels,
      datasets: [
        {
          label: "Portfolio Value (₹)",
          data: equityCurve,
          borderColor: "#387ed1",
          backgroundColor: "rgba(56, 126, 209, 0.15)",
          fill: true,
          tension: 0.3,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate performance trends", details: error.message });
  }
});

// ==========================================
// 8. Server Connection & Boot
// ==========================================
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("DB connected successfully!");
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
    });

  app.listen(PORT, () => {
    console.log(`App started on port ${PORT}!`);
  });
}

module.exports = app;
