import React, { useEffect, useState } from "react";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlist(savedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(
      (item) => item._id !== id
    );

    localStorage.setItem(
      "wishlist",
      JSON.stringify(updatedWishlist)
    );

    setWishlist(updatedWishlist);
  };

  return (
    <div className="container mt-4">
      <h2>❤️ Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>No wishlist products found</p>
      ) : (
        wishlist.map((item) => (
          <div
            key={item._id}
            className="card p-3 mb-3 d-flex flex-row"
          >
            {/* Product Image - UPDATED */}
            <img
              src={`https://shopping-backend-y6tm.onrender.com/uploads/${item.image}`}
              alt={item.name}
              style={{
                width: 100,
                height: 100,
                objectFit: "cover"
              }}
            />

            <div style={{ marginLeft: 15 }}>
              <h4>{item.name}</h4>
              <p>₹{item.price}</p>

              <button
                className="btn btn-danger"
                onClick={() =>
                  removeFromWishlist(item._id)
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;