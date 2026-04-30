import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://shopping-backend-y6tm.onrender.com/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `https://shopping-backend-y6tm.onrender.com/api/orders/${id}/status`,
        { status }
      );

      fetchOrders(); // refresh after update
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mt-4">

      <h2>🧾 Admin Orders Panel</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="card p-3 mb-3">

            {/* ORDER INFO */}
            <h5>Order ID: {order._id}</h5>
            <p>User: {order.user}</p>
            <p>Total: ₹{order.totalAmount}</p>

            {/* ITEMS */}
            <p><b>Items:</b></p>
            {order.items?.map((item, i) => (
              <div key={i} style={{ marginBottom: "5px" }}>
                🛒 {item.name} - ₹{item.price}
              </div>
            ))}

            {/* ADDRESS */}
            <p><b>Address:</b> {order.address}</p>

            {/* PAYMENT */}
            <p><b>Payment:</b> {order.paymentMethod}</p>

            {/* STATUS SELECT */}
            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order._id, e.target.value)
              }
              className="form-control w-25"
            >
              <option>Placed</option>
              <option>Packed</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>

          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;