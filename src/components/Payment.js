import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [gpayConfirmed, setGpayConfirmed] = useState(false);

  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // ✅ ADDRESS STATE (with saved lock)
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    building: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    saved: false
  });

  // ✅ Validate Address
  const validateAddress = () => {
    const { name, phone, building, street, city, state, pincode } = address;

    if (!name || !phone || !building || !street || !city || !state || !pincode) {
      alert("Please fill complete address details");
      return false;
    }

    if (pincode.length !== 6) {
      alert("Invalid pincode");
      return false;
    }

    return true;
  };

  // ✅ Delivery date
  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toDateString();
  };

  // ✅ GPay confirm
  const handleGPayConfirm = () => {
    setGpayConfirmed(true);
  };

  // ✅ Card change
  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  // ✅ ORDER HANDLER
  const handleContinue = () => {
    if (!address.saved) {
      alert("Please save your address first");
      return;
    }

    if (!paymentMethod) {
      alert("Please select payment method");
      return;
    }

    if (paymentMethod === "Google Pay" && !gpayConfirmed) {
      alert("Please complete Google Pay verification first");
      return;
    }

    if (paymentMethod === "Card Payment") {
      const { number, name, expiry, cvv } = cardDetails;

      if (!number || !name || !expiry || !cvv) {
        alert("Please fill all card details");
        return;
      }
    }

    alert(
      `Order Confirmed 🎉
Product: ${product.name}
Price: ₹${product.price}
Delivery Date: ${getDeliveryDate()}
Payment: ${paymentMethod}`
    );

    navigate("/shop");
  };

  if (!product) {
    return <h2>No Product Selected</h2>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Checkout Page</h1>

      <div className="card p-4">

        {/* PRODUCT */}
        <h3>{product.name}</h3>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p>{product.description}</p>

        <hr />

        {/* DELIVERY */}
        <h5>
          Estimated Delivery:{" "}
          <span className="text-success">{getDeliveryDate()}</span>
        </h5>

        <hr />

        {/* ADDRESS SECTION */}
        <h3>Delivery Address</h3>

        <input
          placeholder="Full Name"
          value={address.name}
          disabled={address.saved}
          onChange={(e) => setAddress({ ...address, name: e.target.value })}
        />

        <input
          placeholder="Phone Number"
          value={address.phone}
          disabled={address.saved}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        />

        <input
          placeholder="Building No / House No"
          value={address.building}
          disabled={address.saved}
          onChange={(e) => setAddress({ ...address, building: e.target.value })}
        />

        <input
          placeholder="Street Name"
          value={address.street}
          disabled={address.saved}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />

        <input
          placeholder="City"
          value={address.city}
          disabled={address.saved}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />

        <input
          placeholder="State"
          value={address.state}
          disabled={address.saved}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />

        <input
          placeholder="Pincode"
          value={address.pincode}
          disabled={address.saved}
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        />

        {/* SAVE BUTTON */}
        {!address.saved && (
          <button
            className="btn btn-primary mt-2"
            onClick={() => {
              if (!validateAddress()) return;
              setAddress({ ...address, saved: true });
              alert("Address saved successfully ✔");
            }}
          >
            Save Address
          </button>
        )}

        {address.saved && (
          <p className="text-success mt-2">✔ Address Saved</p>
        )}

        <hr />

        {/* PAYMENT METHODS */}
        <h5>Select Payment Method</h5>

        <div className="form-check">
          <input
            type="radio"
            name="payment"
            value="Google Pay"
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setGpayConfirmed(false);
            }}
          />
          Google Pay
        </div>

        <div className="form-check">
          <input
            type="radio"
            name="payment"
            value="Cash on Delivery"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </div>

        <div className="form-check">
          <input
            type="radio"
            name="payment"
            value="Card Payment"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Card Payment
        </div>

        {/* GOOGLE PAY */}
        {paymentMethod === "Google Pay" && (
          <div className="card p-3 mt-3 bg-light text-center">
            <h5>Google Pay Payment</h5>

            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GPayPayment"
              alt="QR"
              style={{ margin: "auto" }}
            />

            <button className="btn btn-primary mt-2" onClick={handleGPayConfirm}>
              Verify Google Pay
            </button>

            {gpayConfirmed && <p className="text-success">✔ Verified</p>}
          </div>
        )}

        {/* CARD PAYMENT */}
        {paymentMethod === "Card Payment" && (
          <div className="card p-3 mt-3 bg-light">
            <h5>Card Details</h5>

            <input name="number" placeholder="Card Number" onChange={handleCardChange} />
            <input name="name" placeholder="Card Holder Name" onChange={handleCardChange} />
            <input name="expiry" placeholder="Expiry (MM/YY)" onChange={handleCardChange} />
            <input name="cvv" placeholder="CVV" onChange={handleCardChange} />
          </div>
        )}

        {/* FINAL BUTTON */}
        <button className="btn btn-success mt-3" onClick={handleContinue}>
          Place Order
        </button>

      </div>
    </div>
  );
}

export default Payment;