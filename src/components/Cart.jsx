import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    // Ensure every item has a valid quantity to avoid "NaN"
    const validatedCart = savedCart.map(item => ({
      ...item,
      quantity: item.quantity || 1
    }));
    setCart(validatedCart);
  }, []);

  const updateLocalStorage = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    updateLocalStorage(updated);
    // Remove from selected items if it was checked
    setSelectedCartItems(selectedCartItems.filter(item => item._id !== cart[index]._id));
  };

  // ================= QUANTITY LOGIC =================
  const changeQty = (id, delta) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
        : item
    );
    updateLocalStorage(updatedCart);
  };

  // ================= SELECT ITEMS =================
  const toggleSelectCartItem = (item) => {
    const isSelected = selectedCartItems.some((i) => i._id === item._id);
    if (isSelected) {
      setSelectedCartItems(selectedCartItems.filter((i) => i._id !== item._id));
    } else {
      setSelectedCartItems([...selectedCartItems, item]);
    }
  };

  // ================= CALCULATIONS =================
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-4">🛒 Your Shopping Cart</h2>

      {cart.length === 0 ? (
        <div className="text-center p-5 border rounded bg-light">
          <p className="fs-4 text-muted">Your cart is empty</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Go Shopping</button>
        </div>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={item._id || index} className="card p-3 mb-3 shadow-sm border-0 bg-white">
              <div className="row align-items-center">
                
                {/* Selection Checkbox */}
                <div className="col-auto">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    style={{ width: "22px", height: "22px", cursor: "pointer" }}
                    checked={selectedCartItems.some((i) => i._id === item._id)}
                    onChange={() => toggleSelectCartItem(item)}
                  />
                </div>

                {/* Product Image */}
                <div className="col-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="rounded shadow-sm"
                    style={{ width: "120px", height: "120px", objectFit: "contain" }}
                  />
                </div>

                {/* Product Details */}
                <div className="col">
                  <h4 className="fw-bold mb-1">{item.name}</h4>
                  <p className="text-muted mb-2">Price: ₹{item.price}</p>

                  {/* Quantity Controls - Matching Screenshot Style */}
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <button 
                      className="btn btn-sm btn-danger d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                      onClick={() => changeQty(item._id, -1)}
                    >
                      -
                    </button>
                    <span className="fw-bold">Qty: {item.quantity}</span>
                    <button 
                      className="btn btn-sm btn-success d-flex align-items-center justify-content-center"
                      style={{ width: "32px", height: "32px" }}
                      onClick={() => changeQty(item._id, 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="fw-bold text-dark m-0">
                    Total: ₹{item.price * item.quantity}
                  </p>
                </div>

                {/* Remove Action */}
                <div className="col-auto text-end">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromCart(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Checkout Footer */}
          <div className="card p-4 mt-4 shadow-sm border-0 sticky-bottom bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="text-muted mb-0">Grand Total</h5>
                <h3 className="fw-bold text-success">₹{totalPrice}</h3>
              </div>
              <button
                className="btn btn-success btn-lg px-5 shadow"
                disabled={selectedCartItems.length === 0}
                onClick={() => navigate("/checkout", { state: { cart: selectedCartItems } })}
              >
                Place Order ({selectedCartItems.length})
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;