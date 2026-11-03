import React, { useState, useEffect } from "react";
import axios from "axios";
import PortfolioPerformanceChart from "./PortfolioPerformanceChart";
import DoughnutChart from "./DoughnoutChart";

const Summary = () => {
  const [userProfile, setUserProfile] = useState({
    name: "Trader",
    email: "",
    accountBalance: 100000,
  });

  const [portfolio, setPortfolio] = useState({
    totalHoldings: 13,
    totalInvestment: 29875.55,
    currentValue: 31428.95,
    totalPnL: 1553.4,
    netReturnPercent: 5.2,
    breakdown: [],
  });

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // 1. Check URL query parameters and local storage for authentication
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get("token");
    const nameFromUrl = queryParams.get("name");
    const emailFromUrl = queryParams.get("email");

    if (tokenFromUrl) {
      localStorage.setItem("tradex_token", tokenFromUrl);
    }

    let currentName = nameFromUrl;
    if (!currentName) {
      const storedUser = localStorage.getItem("tradex_user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          currentName = parsed.name;
          setUserProfile(parsed);
        } catch (e) {
          currentName = storedUser;
        }
      } else {
        currentName = localStorage.getItem("dashboardTraderName") || "Trader";
      }
    }

    if (currentName) {
      setUserProfile((prev) => ({
        ...prev,
        name: currentName,
        email: emailFromUrl || prev.email,
      }));
      localStorage.setItem("dashboardTraderName", currentName);
    }

    // 2. Fetch live portfolio summary from backend
    axios
      .get("http://localhost:3002/api/portfolio/summary")
      .then((res) => {
        if (res.data && res.data.totalHoldings > 0) {
          setPortfolio(res.data);
        }
      })
      .catch(() => {
        // Fallback to default state if backend not reached
      });

    // 3. Fetch portfolio performance trend data for Chart.js
    axios
      .get("http://localhost:3002/api/portfolio/performance")
      .then((res) => {
        if (res.data && res.data.datasets) {
          setChartData(res.data);
        }
      })
      .catch(() => {
        // Fallback to default internal trend
      });
  }, []);

  // Prepare allocation doughnut data from portfolio breakdown
  const doughnutLabels =
    portfolio.breakdown.length > 0
      ? portfolio.breakdown.slice(0, 6).map((b) => b.name)
      : ["INFY", "RELIANCE", "TCS", "HDFC", "ITC", "Others"];

  const doughnutValues =
    portfolio.breakdown.length > 0
      ? portfolio.breakdown.slice(0, 6).map((b) => b.currentValue)
      : [4800, 7200, 6100, 5400, 3200, 4728];

  const allocationChartData = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutValues,
        backgroundColor: [
          "#387ed1",
          "#4184f3",
          "#669df6",
          "#8ab4f8",
          "#aecbfa",
          "#d2e3fc",
        ],
        borderWidth: 1,
      },
    ],
  };

  const isProfitable = portfolio.totalPnL >= 0;

  return (
    <>
      <div className="username">
        <h1>Hi, {userProfile.name}!</h1>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <h2>Equity & Margin</h2>
        </span>

        <div className="data">
          <div className="first">
            <h2>₹{(userProfile.accountBalance || 100000).toLocaleString("en-IN")}</h2>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>₹{portfolio.totalInvestment.toLocaleString("en-IN")}</span>
            </p>
            <p>
              Opening balance <span>₹{((userProfile.accountBalance || 100000) + portfolio.totalInvestment).toLocaleString("en-IN")}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="section">
        <span>
          <h2>Holdings ({portfolio.totalHoldings})</h2>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={isProfitable ? "profit" : "loss"}>
              {isProfitable ? "+" : ""}
              ₹{portfolio.totalPnL.toLocaleString("en-IN")}{" "}
              <small>
                ({isProfitable ? "+" : ""}
                {portfolio.netReturnPercent}%)
              </small>
            </h3>
            <p>Total P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>₹{portfolio.currentValue.toLocaleString("en-IN")}</span>
            </p>
            <p>
              Investment <span>₹{portfolio.totalInvestment.toLocaleString("en-IN")}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      {/* Visualizations for Portfolio Performance & Financial Trends */}
      <div className="section" style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: "2", minWidth: "320px", background: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #eee" }}>
            <PortfolioPerformanceChart data={chartData} />
          </div>
          <div style={{ flex: "1", minWidth: "260px", background: "#fff", padding: "16px", borderRadius: "8px", border: "1px solid #eee", textAlign: "center" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#444", fontSize: "15px" }}>Asset Allocation</h4>
            <div style={{ maxWidth: "220px", margin: "0 auto" }}>
              <DoughnutChart data={allocationChartData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Summary;
