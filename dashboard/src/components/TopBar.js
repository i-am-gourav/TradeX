import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";

const TopBar = () => {
  const [indices, setIndices] = useState([
    { symbol: "NIFTY 50", value: 22450.2, percentChange: 0.45 },
    { symbol: "SENSEX", value: 73890.15, percentChange: 0.38 },
  ]);

  useEffect(() => {
    const fetchIndices = () => {
      axios
        .get("http://localhost:3002/api/market/indices")
        .then((res) => {
          if (res.data && res.data.length >= 2) {
            setIndices(res.data);
          }
        })
        .catch(() => {
          // keep fallback
        });
    };

    fetchIndices();
    const interval = setInterval(fetchIndices, 10000); // Poll live market updates every 10s
    return () => clearInterval(interval);
  }, []);

  const nifty = indices.find((i) => i.symbol.includes("NIFTY 50")) || indices[0];
  const sensex = indices.find((i) => i.symbol.includes("SENSEX")) || indices[1];

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">{nifty.symbol}</p>
          <p className="index-points">{Number(nifty.value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <p className={`percent ${nifty.percentChange >= 0 ? "up" : "down"}`}>
            {nifty.percentChange >= 0 ? "+" : ""}
            {nifty.percentChange}%
          </p>
        </div>
        <div className="sensex">
          <p className="index">{sensex.symbol}</p>
          <p className="index-points">{Number(sensex.value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
          <p className={`percent ${sensex.percentChange >= 0 ? "up" : "down"}`}>
            {sensex.percentChange >= 0 ? "+" : ""}
            {sensex.percentChange}%
          </p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
