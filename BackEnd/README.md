# TradeX — Backend Server

The backend service for TradeX, powering the trading dashboard, user authentication, stock market APIs, and portfolio analytics.

## Tech Stack
- **Node.js** & **Express.js 5**
- **MongoDB Atlas** & **Mongoose 9**
- **JWT (jsonwebtoken)** & **bcryptjs** (User Authentication)
- **Jest** & **Supertest** (Automated Unit & Integration Testing)
- **CORS** & **dotenv**
- **nodemon** (Development)

---

## Directory Structure
```
BackEnd/
├── index.js                     # Express application & API endpoints
├── .env                         # Environment configuration (ignored in git)
├── .env.example                 # Environment variables template
├── schemas/
│   ├── UserSchema.js            # User credentials & account balance schema
│   ├── HoldingsSchema.js        # Schema for portfolio holdings
│   ├── PositionsSchema.js       # Schema for trading positions
│   └── OrdersSchema.js          # Schema for buy/sell orders
├── model/
│   ├── UserModel.js             # Mongoose model for users
│   ├── HoldingsModel.js         # Mongoose model for holdings
│   ├── PositionsModel.js        # Mongoose model for positions
│   └── OrdersModel.js           # Mongoose model for orders
├── middleware/
│   └── authMiddleware.js        # JWT verification middleware
├── services/
│   └── stockMarketService.js    # Live quotes, market indices & historical trends
├── __tests__/                   # Jest Unit & Integration Test Suites
│   ├── auth.test.js
│   ├── holdings.test.js
│   ├── orders.test.js
│   ├── portfolio.test.js
│   └── stockMarket.test.js
└── package.json
```

---

## API Endpoints

### 1. Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Registers new user, hashes password, returns JWT token |
| `POST` | `/auth/login` | Authenticates credentials, returns JWT token |
| `GET` | `/auth/user` | Protected route — returns profile of logged-in user |

### 2. Holdings (Portfolio Management CRUD)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/allHoldings` | Returns all stock holdings |
| `GET` | `/api/holdings/:id` | Returns single holding by ID |
| `POST` | `/addHoldings` | Inserts new holding(s) |
| `PUT` | `/api/holdings/:id` | Updates holding quantity/price |
| `DELETE` | `/api/holdings/:id` | Sells/removes holding |

### 3. Positions & Orders
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/allPositions` | Returns active trading positions |
| `POST` | `/addPositions` | Adds new positions |
| `DELETE` | `/api/positions/:id` | Closes an active position |
| `GET` | `/allOrders` | Returns sorted order history |
| `POST` | `/newOrder` | Places a new buy/sell order |
| `DELETE` | `/api/orders/:id` | Cancels an existing order |

### 4. Stock Market & Portfolio Analytics APIs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/market/quotes` | Live quotes for tracked market stocks |
| `GET` | `/api/market/quote/:symbol` | Quote for individual stock ticker |
| `GET` | `/api/market/indices` | Major benchmark indices (NIFTY 50, SENSEX) |
| `GET` | `/api/market/history/:symbol` | Historical price trends for Chart.js |
| `GET` | `/api/portfolio/summary` | Aggregated portfolio valuation & P&L stats |
| `GET` | `/api/portfolio/performance` | Time-series equity curve for financial trends |

---

## Running Backend Server

```bash
npm start
```
Server runs on: `http://localhost:3002`

---

## Running Jest Unit Tests

```bash
npm test
```
Runs 32 unit and integration tests across 5 test suites validating authentication, holdings CRUD, orders, stock market APIs, and portfolio analytics.
