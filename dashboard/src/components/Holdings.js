import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import { holdings as defaultHoldings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStock, setNewStock] = useState({
    name: "",
    qty: 1,
    avg: 100,
    price: 100,
  });

  const fetchHoldings = () => {
    axios
      .get("http://localhost:3002/allHoldings")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAllHoldings(res.data);
        } else {
          setAllHoldings(defaultHoldings);
        }
      })
      .catch(() => {
        setAllHoldings(defaultHoldings);
      });
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  // CRUD: Delete / Sell holding
  const handleDeleteHolding = async (stock, index) => {
    if (!window.confirm(`Are you sure you want to liquidate/sell ${stock.name}?`)) {
      return;
    }

    if (stock._id) {
      try {
        await axios.delete(`http://localhost:3002/api/holdings/${stock._id}`);
      } catch (err) {
        console.error("Failed to delete holding from backend:", err);
      }
    }
    // Update local state immediately
    setAllHoldings((prev) => prev.filter((_, i) => i !== index));
  };

  // CRUD: Add new holding
  const handleAddHolding = async (e) => {
    e.preventDefault();
    if (!newStock.name) return;

    const netChange = (((newStock.price - newStock.avg) / newStock.avg) * 100).toFixed(2);
    const holdingToSave = {
      name: newStock.name.toUpperCase(),
      qty: Number(newStock.qty),
      avg: Number(newStock.avg),
      price: Number(newStock.price),
      net: `${netChange >= 0 ? "+" : ""}${netChange}%`,
      day: "+0.25%",
      isLoss: Number(netChange) < 0,
    };

    try {
      const res = await axios.post("http://localhost:3002/api/holdings", holdingToSave);
      if (res.data && res.data.data) {
        setAllHoldings((prev) => [...prev, ...res.data.data]);
      } else {
        setAllHoldings((prev) => [...prev, holdingToSave]);
      }
    } catch (err) {
      setAllHoldings((prev) => [...prev, holdingToSave]);
    }

    setShowAddForm(false);
    setNewStock({ name: "", qty: 1, avg: 100, price: 100 });
  };

  // Dynamic Portfolio Calculations
  const totalInvestment = allHoldings.reduce(
    (acc, stock) => acc + (Number(stock.avg) || 0) * (Number(stock.qty) || 0),
    0
  );
  const totalCurrentValue = allHoldings.reduce(
    (acc, stock) => acc + (Number(stock.price) || 0) * (Number(stock.qty) || 0),
    0
  );
  const totalPnL = totalCurrentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? ((totalPnL / totalInvestment) * 100).toFixed(2) : "0.00";

  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price (₹)",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(56, 126, 209, 0.6)",
      },
    ],
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 className="title">Holdings ({allHoldings.length})</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            backgroundColor: "#387ed1",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          {showAddForm ? "Cancel" : "+ Add Holding"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddHolding}
          style={{
            background: "#f9f9f9",
            padding: "16px",
            borderRadius: "6px",
            marginBottom: "20px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
            border: "1px solid #e0e0e0",
          }}
        >
          <input
            type="text"
            placeholder="Stock Symbol (e.g. INFY)"
            value={newStock.name}
            onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
            required
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="number"
            placeholder="Qty"
            value={newStock.qty}
            min="1"
            onChange={(e) => setNewStock({ ...newStock, qty: e.target.value })}
            required
            style={{ width: "80px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="number"
            step="0.05"
            placeholder="Avg Price"
            value={newStock.avg}
            onChange={(e) => setNewStock({ ...newStock, avg: e.target.value })}
            required
            style={{ width: "110px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <input
            type="number"
            step="0.05"
            placeholder="Market Price"
            value={newStock.price}
            onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
            required
            style={{ width: "110px", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Save Holding
          </button>
        </form>
      )}

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = (stock.price || 0) * (stock.qty || 0);
              const pnl = curValue - (stock.avg || 0) * (stock.qty || 0);
              const isProfit = pnl >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{Number(stock.avg).toFixed(2)}</td>
                  <td>{Number(stock.price).toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{pnl.toFixed(2)}</td>
                  <td className={profClass}>{stock.net || (pnl >= 0 ? "+" : "") + ((pnl / (stock.avg * stock.qty || 1)) * 100).toFixed(2) + "%"}</td>
                  <td className={dayClass}>{stock.day || "+0.15%"}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteHolding(stock, index)}
                      title="Sell / Liquidate Holding"
                      style={{
                        backgroundColor: "#df514c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "3px",
                        padding: "3px 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dynamic Summary Cards calculated from actual live holdings */}
      <div className="row">
        <div className="col">
          <h5>₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{totalCurrentValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL >= 0 ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalPnL >= 0 ? "+" : ""}{pnlPercent}%)
          </h5>
          <p>Total P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
