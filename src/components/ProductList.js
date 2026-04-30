import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const rawIdentifier = user?.name || user?.email || "Guest";
  const username = rawIdentifier.split("@")[0];

  useEffect(() => {
    fetchProducts();
    setCart(JSON.parse(localStorage.getItem("cart")) || []);
    setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const url = selectedCategory === "All"
        ? "https://shopping-backend-y6tm.onrender.com/api/products"
        : `https://shopping-backend-y6tm.onrender.com/api/products?category=${selectedCategory}`;

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ShopEasy Pro',
        text: 'Check out these amazing products!',
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      alert("Copy link to share: " + window.location.href);
    }
  };

  const handleCameraClick = () => {
    alert("Need camera access permission! 📸");
  };

  const addToCart = (product) => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (savedCart.find((item) => item._id === product._id)) {
      alert("⚠️ Product already in cart");
      return;
    }
    const updatedCart = [...savedCart, product];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    alert("Product added to cart ✔");
  };

  const toggleWishlist = (product) => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isExist = savedWishlist.find((item) => item._id === product._id);

    let updatedWishlist;
    if (isExist) {
      updatedWishlist = savedWishlist.filter((item) => item._id !== product._id);
    } else {
      updatedWishlist = [...savedWishlist, product];
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
  };

  const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    return "⭐".repeat(full) + "☆".repeat(5 - full);
  };

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: "850px" }}>

      {/* TOP ROW: HAMBURGER & USER PROFILE */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Updated Hamburger: White background, Dark icon */}
        <button 
          className="btn bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center border fs-4" 
          style={{ width: "45px", height: "45px" }} 
          onClick={() => setIsSidebarOpen(true)}
        >
          <span className="text-dark" style={{ lineHeight: 0, marginBottom: '4px' }}>☰</span>
        </button>

        <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white shadow-sm border" style={{ borderRadius: "50px" }}>
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "38px", height: "38px" }}>
            {username[0]?.toUpperCase()}
          </div>
          <span className="fw-bold text-dark px-1" style={{ textTransform: 'capitalize' }}>{username}</span>
        </div>
      </div>

      {/* SIDEBAR MENU (White Theme from image_1aeafd.png) */}
      <div
        className={`position-fixed top-0 start-0 h-100 bg-white shadow-lg border-end`}
        style={{
          width: isSidebarOpen ? "280px" : "0",
          zIndex: 1050,
          overflowX: "hidden",
          transition: "0.3s ease",
          paddingTop: "60px"
        }}
      >
        <button 
          className="btn text-dark position-absolute top-0 end-0 m-3 fs-4 border-0" 
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>

        <div className="px-4 mt-4">
          <h4 className="fw-bold mb-4 text-dark border-bottom pb-2" style={{ letterSpacing: '0.5px' }}>Categories</h4>
          
          <button 
            className="btn btn-light w-100 text-start mb-2 py-3 border-0 d-flex align-items-center gap-2 rounded-3 bg-transparent hover-bg-light" 
            onClick={() => { setSelectedCategory("All"); setIsSidebarOpen(false); }}
            style={{ transition: '0.2s' }}
          >
            📦 <span className="fw-semibold text-dark">All Products</span>
          </button>
          
          <button 
            className="btn btn-light w-100 text-start mb-2 py-3 border-0 d-flex align-items-center gap-2 rounded-3 bg-transparent hover-bg-light" 
            onClick={() => { setSelectedCategory("laptop"); setIsSidebarOpen(false); }}
            style={{ transition: '0.2s' }}
          >
            💻 <span className="fw-semibold text-dark">Laptops</span>
          </button>
          
          <button 
            className="btn btn-light w-100 text-start mb-2 py-3 border-0 d-flex align-items-center gap-2 rounded-3 bg-transparent hover-bg-light" 
            onClick={() => { setSelectedCategory("phone"); setIsSidebarOpen(false); }}
            style={{ transition: '0.2s' }}
          >
            📱 <span className="fw-semibold text-dark">Phones</span>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-black opacity-25" 
          style={{ zIndex: 1040 }} 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <h1 className="text-center fw-bold mb-4">ShopEasy Pro 🛍️</h1>

      {/* SEARCH BAR */}
      <div className="mb-4 d-flex justify-content-center">
        <div className="input-group w-75 shadow-sm rounded-pill overflow-hidden bg-white border">
          <input
            type="text"
            className="form-control border-0 ps-4"
            placeholder={`🔍 Search ${selectedCategory === "All" ? "products" : selectedCategory + "s"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-white border-0 bg-white text-secondary px-2" type="button" onClick={handleCameraClick}>
            <i className="bi bi-camera" style={{ fontSize: "1.2rem" }}></i>
          </button>
          <button className="btn btn-white border-0 bg-white text-secondary pe-4 ps-2" type="button" onClick={handleShare}>
            <i className="bi bi-share" style={{ fontSize: "1.1rem" }}></i>
          </button>
        </div>
      </div>

      {/* TOP NAVIGATION */}
      <div className="d-flex gap-2 mb-4">
        <button className="btn fw-bold px-4 shadow-sm" style={{ backgroundColor: "#ffc107" }} onClick={() => navigate("/cart")}>🛒 Cart ({cart.length})</button>
        <button className="btn text-white fw-bold px-4 shadow-sm" style={{ backgroundColor: "#ef4444" }} onClick={() => navigate("/wishlist")}>
          <i className="bi bi-heart-fill me-2"></i> Wishlist ({wishlist.length})
        </button>
      </div>

      {/* PRODUCT LIST */}
      {products
        .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((product) => {
          const isInWishlist = wishlist.some((item) => item._id === product._id);

          return (
            <div key={product._id} className="card border-0 shadow-sm mb-5 p-4 bg-white rounded-4">
              <div className="row g-4 align-items-center">
                <div className="col-md-auto">
                  <div className="bg-white rounded-3 shadow-sm d-flex align-items-center justify-content-center overflow-hidden" style={{ width: "250px", height: "250px", border: "1px solid #f0f0f0", padding: "15px" }}>
                    <img src={`https://shopping-backend-y6tm.onrender.com/uploads/${product.image}`} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                </div>

                <div className="col-md">
                  <h1 className="fw-bold m-0" style={{ fontSize: "2.2rem" }}>{product.name}</h1>
                  <h2 className="text-muted fw-normal">₹{product.price}</h2>
                  <div className="mb-3">
                    <span className="fw-bold fs-4">⭐ {getAverageRating(product.reviews)} / 5</span>
                    <div className="text-warning fs-5">{renderStars(getAverageRating(product.reviews))}</div>
                  </div>
                  <div className="d-flex gap-3 mt-4 align-items-center">
                    <button className="btn btn-primary btn-lg shadow-sm" onClick={() => addToCart(product)}>Add to Cart</button>
                    <button className="btn btn-dark btn-lg shadow-sm" onClick={() => navigate("/payment", { state: { product } })}>Buy Now</button>
                    <i
                      className={`bi ${isInWishlist ? "bi-heart-fill text-danger" : "bi-heart text-white"}`}
                      style={{
                        fontSize: "2rem",
                        cursor: "pointer",
                        WebkitTextStroke: isInWishlist ? "none" : "1px #888",
                        filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))"
                      }}
                      onClick={() => toggleWishlist(product)}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ProductList;