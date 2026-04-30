import React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Auth from "./components/Auth";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import Checkout from "./components/Checkout";
import MyOrders from "./components/MyOrders";
import Wishlist from "./components/Wishlist";
import Orders from "./components/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Auth />}
        />

        <Route
          path="/shop"
          element={<ProductList />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />
        <Route path="/orders" element={<Orders/>}
       />
        <Route
          path="/myorders"
          element={<MyOrders />}
        />

        <Route
          path="/wishlist"
          element={<Wishlist />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;