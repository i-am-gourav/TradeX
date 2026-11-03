import React, { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";

const Orders = () => {
  const { orders, fetchOrders } = useContext(GeneralContext);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    if (orderId) {
      try {
        await axios.delete(`http://localhost:3002/api/orders/${orderId}`);
      } catch (err) {
        console.error("Failed to cancel order on backend:", err);
      }
    }
    if (fetchOrders) fetchOrders();
  };

  return (
    <div className="orders">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to="/" className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <div className="orders-list" style={{ padding: "20px", width: "100%" }}>
          <h3 style={{ marginBottom: "20px" }}>All Orders ({orders.length})</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eee", color: "#9b9b9b", fontSize: "14px" }}>
                <th style={{ padding: "10px 0" }}>Instrument</th>
                <th>Type</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id || index} style={{ borderBottom: "1px solid #f4f4f4", fontSize: "15px" }}>
                  <td style={{ padding: "12px 0", fontWeight: "500" }}>{order.name}</td>
                  <td style={{ color: order.mode === "BUY" ? "#387ed1" : "#df514c", fontWeight: "500" }}>
                    {order.mode}
                  </td>
                  <td>{order.qty}</td>
                  <td>₹{order.price}</td>
                  <td style={{ color: "#4caf50", fontSize: "13px" }}>Executed</td>
                  <td>
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#666",
                        border: "1px solid #ddd",
                        borderRadius: "3px",
                        padding: "3px 8px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
