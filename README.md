# TradeX — Stock Trading and Portfolio Analytics Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.3-lightgrey.svg)](https://expressjs.com/)
[![React.js](https://img.shields.io/badge/React.js-v18%20%2F%20v19-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v9-brightgreen.svg)](https://www.mongodb.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-v4.4-orange.svg)](https://www.chartjs.org/)
[![Jest](https://img.shields.io/badge/Jest-32%20Tests%20Passing-success.svg)](https://jestjs.io/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT%20%26%20Bcrypt-red.svg)](https://jwt.io/)

**TradeX** is a full-stack stock trading and portfolio analytics platform inspired by Zerodha Kite. It provides an end-to-end investment experience: a high-converting broker landing page, an institutional-grade trading dashboard, real-time stock market API integration, and interactive financial performance visualizations.

---

## 📌 Highlights & Key Features

- **Portfolio Management & Full CRUD Operations:**
  - Create, view, update, and sell/liquidate stock holdings.
  - Execute buy/sell orders with live margin requirements.
  - Track real-time positions with intraday P&L metrics.
  - Dynamic portfolio aggregation (total investment, current valuation, net returns).

- **Live Stock Market APIs:**
  - Integrated with real-time financial market data (Yahoo Finance live feed) for Indian equities (`INFY`, `TCS`, `RELIANCE`, `HDFCBANK`, etc.) and benchmark indices (`NIFTY 50`, `SENSEX`).
  - In-memory anti-rate-limit caching (30s TTL).
  - Resilient offline simulation with micro-volatility drift when markets are closed or offline.

- **Financial Analytics & Chart.js Visualizations:**
  - **Portfolio Performance Line Chart:** Visualizes portfolio equity curve and financial trends over time.
  - **Asset Allocation Doughnut Chart:** Dynamic portfolio breakdown by equity holdings.
  - **Holdings Price Bar Chart:** Visual price comparison across active positions.

- **User Authentication & Security:**
  - Secure registration and login powered by `bcryptjs` password hashing and JWT (`jsonwebtoken`).
  - Protected API routes with bearer token authentication middleware.
  - Quick 1-click **Demo Login** mode for rapid previewing.

- **Automated Backend Testing:**
  - Comprehensive **Jest** and **Supertest** suite covering 32 test cases across 5 test suites (Auth, Holdings CRUD, Orders, Portfolio calculations, and Stock Market APIs).

---

## 🏗️ Architecture

```
                                  +-----------------------------+
                                  |     User Browser Client     |
                                  +--------------+--------------+
                                                 |
                        +------------------------+------------------------+
                        |                                                 |
                        v                                                 v
             +--------------------+                             +--------------------+
             | Frontend / Landing |                             | Trading Dashboard  |
             |   (React :3000)    |                             |   (React :3001)    |
             +---------+----------+                             +---------+----------+
                       |                                                  |
                       +------------------------+-------------------------+
                                                |  REST API (JSON)
                                                v
                                  +-----------------------------+
                                  |      Express.js Backend     |
                                  |       (Node.js :3002)       |
                                  +--------------+--------------+
                                                 |
         +---------------------------------------+---------------------------------------+
         |                                       |                                       |
         v                                       v                                       v
+------------------+                   +--------------------+                  +--------------------+
|  MongoDB Atlas   |                   | Stock Market APIs  |                  | JWT Authentication |
| Holdings, Orders |                   | Live Yahoo Finance |                  | bcryptjs & Tokens  |
| Positions, Users |                   | Cache & Fallback   |                  | Protected Routes   |
+------------------+                   +--------------------+                  +--------------------+
```

---

## 📂 Project Structure

```
TradeX/
├── BackEnd/                         # Node.js & Express.js Backend Service
│   ├── __tests__/                   # Jest unit & integration test suites
│   │   ├── auth.test.js
│   │   ├── holdings.test.js
│   │   ├── orders.test.js
│   │   ├── portfolio.test.js
│   │   └── stockMarket.test.js
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT token verification
│   ├── model/                       # Mongoose Models (Holdings, Orders, Positions, User)
│   ├── schemas/                     # Mongoose Schemas
│   ├── services/
│   │   └── stockMarketService.js    # Live stock quotes, indices, & chart data
│   ├── index.js                     # Express API entry point & routes
│   └── package.json
│
├── dashboard/                       # Trading & Portfolio Analytics Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── Summary.js           # Portfolio overview & metrics
│   │   │   ├── PortfolioPerformanceChart.js  # Chart.js financial trends
│   │   │   ├── Holdings.js          # Holdings table + CRUD actions
│   │   │   ├── Orders.js            # Live order book & cancellation
│   │   │   ├── Positions.js         # Trading positions & close action
│   │   │   ├── WatchList.js         # Real-time stock watchlist
│   │   │   ├── TopBar.js            # Live NIFTY & SENSEX market ticker
│   │   │   └── Menu.js              # Navigation & user profile dropdown
│   │   └── index.js
│   └── package.json
│
└── frontend/                        # Broker Landing Page & Authentication UI
    ├── src/
    │   ├── landing_page/
    │   │   ├── home/                # Hero, Awards, Stats, Pricing, Education
    │   │   ├── login/               # Secure Login Form & 1-click Demo mode
    │   │   ├── signup/              # Account registration form
    │   │   ├── products/            # Technology & product showcases
    │   │   └── pricing/             # Brokerage charges & calculator
    │   └── index.js
    └── package.json
```

---

## 🔌 API Reference

### 1. Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register new user with hashed password & return JWT |
| `POST` | `/auth/login` | Authenticate user credentials & return JWT |
| `GET` | `/auth/user` | **Protected**: Fetch authenticated user profile |

### 2. Portfolio & Holdings Management (CRUD)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/allHoldings` | Retrieve all current stock holdings |
| `GET` | `/api/holdings/:id` | Fetch specific holding by ID |
| `POST` | `/api/holdings` | Add a new stock holding |
| `PUT` | `/api/holdings/:id` | Update holding shares or cost basis |
| `DELETE` | `/api/holdings/:id` | Liquidate / sell stock holding |

### 3. Orders & Positions
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/allOrders` | Fetch order execution history |
| `POST` | `/newOrder` | Place new buy or sell order |
| `DELETE` | `/api/orders/:id` | Cancel pending/executed order |
| `GET` | `/allPositions` | Retrieve open trading positions |
| `DELETE` | `/api/positions/:id` | Close active position |

### 4. Stock Market & Portfolio Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/market/quotes` | Live quotes for tracked market stocks |
| `GET` | `/api/market/quote/:symbol` | Real-time quote for specific ticker |
| `GET` | `/api/market/indices` | Benchmark indices (`NIFTY 50`, `SENSEX`) |
| `GET` | `/api/market/history/:symbol` | Historical price trends formatted for Chart.js |
| `GET` | `/api/portfolio/summary` | Aggregated portfolio valuation & returns |
| `GET` | `/api/portfolio/performance` | Time-series equity curve for financial trends |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB instance (Local or MongoDB Atlas)

---

### 1. Backend Setup
```bash
cd BackEnd
npm install
npm start
```
*Backend runs on `http://localhost:3002`.*

#### Run Automated Unit & Integration Tests:
```bash
npm test
```
*Executes all 32 Jest unit & integration tests.*

---

### 2. Trading Dashboard Setup
```bash
cd dashboard
npm install
npm start
```
*Dashboard runs on `http://localhost:3001`.*

---

### 3. Landing Page & Authentication Setup
```bash
cd frontend
npm install
npm start
```
*Landing page runs on `http://localhost:3000`.*

---

## 🧪 Testing Suite Overview

The backend uses **Jest** & **Supertest** to validate all platform capabilities without network dependencies:
- **`auth.test.js`**: Signup input validation, duplicate email prevention, password hashing, JWT generation, login verification, and bearer token middleware.
- **`holdings.test.js`**: Complete CRUD workflow (Read, Create, Update, Delete/Liquidate).
- **`orders.test.js`**: Order creation, validation of missing attributes, retrieval, and order deletion.
- **`portfolio.test.js`**: Valuation aggregation, P&L calculations, and Chart.js datasets.
- **`stockMarket.test.js`**: Real-time quotes, index endpoints, ticker lookup, and historical time-series generation.

---

## 🛠️ Tech Stack Summary

| Technology | Purpose |
|---|---|
| **Node.js & Express.js 5** | RESTful Backend Architecture & Endpoints |
| **MongoDB & Mongoose 9** | NoSQL Data Persistence & Schema Validation |
| **React.js 18 / 19** | Modern Component Architecture & Responsive UI |
| **Chart.js & react-chartjs-2** | Financial Visualizations (Line, Bar, Doughnut) |
| **JSON Web Tokens (JWT)** | Stateless User Authentication & Route Protection |
| **bcryptjs** | Salted Cryptographic Password Hashing |
| **Jest & Supertest** | Automated Backend Unit & Integration Testing |
| **Bootstrap 5 & Material-UI Icons** | Styling, Layout, and Iconography |

---

## 📄 License

This project is licensed under the ISC License.
