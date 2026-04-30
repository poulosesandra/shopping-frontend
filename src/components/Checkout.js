import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cart = state?.cart || [];

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  // ================= ADDRESS VALIDATION =================
  const validateAddress = () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return false;
    }
    if (address.trim().length < 15) {
      alert("Please enter complete valid address");
      return false;
    }
    return true;
  };

  // ================= PLACE ORDER =================
  const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!validateAddress()) return;

    const orderData = {
      user: user?.email,
      items: cart,
      address,
      paymentMethod,
      totalAmount: total,
      status: "Placed",
    };

    try {
      // UPDATED: Pointing to live Render backend instead of localhost
      await axios.post("https://shopping-backend-y6tm.onrender.com/api/orders", orderData);
      
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = savedCart.filter(
        (cartItem) => !cart.some((orderedItem) => orderedItem._id === cartItem._id)
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      alert("Order placed successfully ✔");
      navigate("/orders");
    } catch (err) {
      console.log(err);
      alert("Order failed");
    }
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "700px" }}>
      <h2 className="fw-bold mb-4">📑 Checkout</h2>

      {/* ================= ORDER SUMMARY ================= */}
      <h4 className="fw-bold text-dark mb-3">Order Summary</h4>
      <div className="card shadow-sm p-4 mb-4 border-0 bg-white">
        {cart.length === 0 ? (
          <p className="text-muted">No selected products</p>
        ) : (
          cart.map((item, i) => (
            <div key={i} className="d-flex align-items-center mb-3 pb-3 border-bottom last-child-border-0">
              
              {/* === LARGE IMAGE CONTAINER === */}
              <div 
                className="d-flex align-items-center justify-content-center overflow-hidden rounded bg-light"
                style={{
                  width: "120px",
                  height: "120px",
                  border: "1px solid #eaeaea",
                  padding: "5px"
                }}
              >
                {/* UPDATED: Added live backend URL for images */}
                <img
                  src={`https://shopping-backend-y6tm.onrender.com/uploads/${item.image}`}
                  alt={item.name}
                  style={{
                    maxWidth: "250%",
                    maxHeight: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="ms-4">
                <h5 className="fw-bold mb-1 fs-5">{item.name}</h5>
                <p className="mb-0 text-dark fs-5 fw-semibold">₹{item.price}</p>
                <p className="mb-0 text-muted small mt-1">Qty: {item.quantity || 1}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 className="fw-bold mb-4">Total: ₹{total}</h3>

      {/* ================= DELIVERY ADDRESS ================= */}
      <h5 className="fw-bold mb-2">Delivery Address</h5>
      <textarea
        className="form-control mb-4 shadow-sm border-2"
        rows="3"
        style={{ borderRadius: "10px" }}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter full delivery address (House No, Street, City, PIN Code)"
      />

      {/* ================= PAYMENT METHOD ================= */}
      <h5 className="fw-bold mb-2">Payment Method</h5>
      <select
        className="form-select mb-3 shadow-sm border-2"
        style={{ borderRadius: "10px" }}
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="COD">Cash on Delivery</option>
        <option value="GPay">Google Pay</option>
        <option value="Card">Card Payment</option>
      </select>

      {/* CONDITIONAL PAYMENT DETAILS */}
      {paymentMethod === "Card" && (
        <div className="card p-3 mb-3 bg-light border-0 shadow-sm animate__animated animate__fadeIn">
          <input className="form-control mb-2" placeholder="Card Number" />
          <div className="d-flex gap-2">
            <input className="form-control" placeholder="MM/YY" />
            <input className="form-control" placeholder="CVV" />
          </div>
        </div>
      )}

      {paymentMethod === "GPay" && (
        <div className="card p-3 mb-3 bg-light border-0 shadow-sm animate__animated animate__fadeIn">
          <p className="mb-2">📱 Pay using UPI ID</p>
          <input className="form-control" placeholder="upi-id@gpay" />
        </div>
      )}

      {/* ================= PLACE ORDER ================= */}
      <button
        className="btn btn-success fw-bold px-4 py-2 mt-2 shadow"
        style={{ 
            backgroundColor: "#198754", 
            fontSize: "1.1rem",
            borderRadius: "8px" 
        }}
        onClick={placeOrder}
      >
        Pay & Place Order
      </button>
    </div>
  );
}

export default Checkout;