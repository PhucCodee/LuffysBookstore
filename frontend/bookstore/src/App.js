import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import BookSearch from "./pages/BookSearch";
import Cart from "./pages/Cart";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<BookSearch />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

const Profile = () => (
  <div className="page-container">
    <h1>User Profile Page</h1>
    <p>Your profile information will appear here</p>
  </div>
);

export default App;
