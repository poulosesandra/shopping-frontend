import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderTimeline from "./OrderTimeline";

function Orders() {
  const [orders, setOrders] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(
      `https://shopping-backend-y6tm.onrender.com/api/orders/${user.email}`
    );
    setOrders(res.data);
  };

  // ✅ CANCEL ORDER (BACKEND UPDATE)
  const cancelOrder = async (orderId) => {
    try {
      await axios.put(
        `https://shopping-backend-y6tm.onrender.com/api/orders/cancel/${orderId}`
      );

      // ✅ instantly update UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: "Cancelled" }
            : order
        )
      );

      alert("Order Cancelled ❌");
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order");
    }
  };
  
  return (
    <div className="container mt-4">
      <h2>📦 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card p-3 mb-3">

            <h5>Order ID: {order._id}</h5>

            <p>Total: ₹{order.totalAmount}</p>

            <p>
              Status:{" "}
              <b style={{ color: "blue" }}>{order.status}</b>
            </p>

            {/* ✅ TIMELINE */}
            <OrderTimeline status={order.status} />

            {/* ❌ CANCEL BUTTON (only if not already cancelled/delivered) */}
            {order.status !== "Cancelled" &&
             order.status !== "Delivered" && (
              <button
                className="btn btn-danger mt-2"
                onClick={() => cancelOrder(order._id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;