import React, { useState, useEffect } from "react";
import axios from "axios";
import { positions as defaultPositions } from "../data/data";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);

  const fetchPositions = () => {
    axios
      .get("http://localhost:3002/allPositions")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAllPositions(res.data);
        } else {
          setAllPositions(defaultPositions);
        }
      })
      .catch(() => {
        setAllPositions(defaultPositions);
      });
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleClosePosition = async (stock, index) => {
    if (!window.confirm(`Close position for ${stock.name}?`)) return;

    if (stock._id) {
      try {
        await axios.delete(`http://localhost:3002/api/positions/${stock._id}`);
      } catch (err) {
        console.error("Failed to close position on backend:", err);
      }
    }
    setAllPositions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const pnl = curValue - stock.avg * stock.qty;
              const isProfit = pnl >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{Number(stock.avg).toFixed(2)}</td>
                  <td>{Number(stock.price).toFixed(2)}</td>
                  <td className={profClass}>{pnl.toFixed(2)}</td>
                  <td className={dayClass}>{stock.day}</td>
                  <td>
                    <button
                      onClick={() => handleClosePosition(stock, index)}
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
                      Close
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
