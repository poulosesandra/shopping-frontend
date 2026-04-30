import React, { useEffect, useState } from "react";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  // ================= CANCEL ORDER =================
  const cancelOrder = (index) => {
    const updatedOrders = [...orders];
    updatedOrders[index].status = "Cancelled";

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setOrders(updatedOrders);
    alert("Order Cancelled Successfully");
  };

  // Helper to render tracking dots
  const renderTracking = (status) => {
    const steps = ["Placed", "Packed", "Shipped", "Delivered"];
    return (
      <div className="d-flex gap-4 mt-3 align-items-center">
        {steps.map((step) => (
          <div key={step} className="text-center">
            <div
              style={{
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                margin: "0 auto",
                background: status === "Cancelled" 
                  ? "#ccc" 
                  : (step === "Placed" ? "blue" : "#aaa"),
              }}
            />
            <p className="small mb-0 mt-1" style={{ fontSize: "0.85rem", color: "#555" }}>
              {step}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "800px" }}>
      {/* Header with Box Icon */}
      <h1 className="fw-bold mb-4">
        <span role="img" aria-label="box">📦</span> My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <p className="text-muted fs-5">No Orders Found</p>
        </div>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="card border-0 shadow-sm p-4 mb-4 bg-white rounded-4">
            
            {/* Order Header Info */}
            <h5 className="fw-bold mb-1">Order ID: {order._id || `ORD-${index + 100}`}</h5>
            <p className="mb-1 text-secondary">Total: ₹{order.totalAmount || order.total || order.price}</p>
            
            <p className="mb-0">
              Status:{" "}
              <span 
                className="fw-bold" 
                style={{ color: order.status === "Cancelled" ? "#ef4444" : "#2563eb" }}
              >
                {order.status || "Placed"}
              </span>
            </p>

            {/* Order Tracking Section */}
            <div className="mt-4">
              <h6 className="fw-bold text-dark">Order Tracking</h6>
              {renderTracking(order.status)}
            </div>

            {/* Cancel Button - Full Width Style */}
            {order.status !== "Cancelled" && (
              <button
                className="btn btn-danger w-100 mt-4 fw-bold py-2 shadow-sm"
                style={{ borderRadius: "8px", backgroundColor: "#dc3545" }}
                onClick={() => cancelOrder(index)}
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

export default MyOrders;