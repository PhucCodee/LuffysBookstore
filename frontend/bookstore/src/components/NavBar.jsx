import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";
import cartIcon from "../assets/cart.png";
import profileIcon from "../assets/user.png";
import searchIcon from "../assets/search.png";
import "../styles/NavBar.css";

const NavBar = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { cartCount } = useCart();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            console.log("Please enter a search term");
            return;
        }
        console.log("Searching for:", searchQuery);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <Link to="/">
                        <img src={logo} alt="Luffy's Bookstore Logo" className="logo-image" />
                    </Link>
                </div>

                <div className="search-container">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search for books..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        <button
                            type="submit"
                            className="search-button"
                            aria-label="Submit search"
                        >
                            <img src={searchIcon} alt="Search" className="search-icon" />
                        </button>
                    </form>
                </div>

                <div className="navbar-actions">
                    <Link to="/cart" className="navbar-icon-link cart-icon-container">
                        <img src={cartIcon} alt="Shopping Cart" className="navbar-icon" />
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                    <Link to="/profile" className="navbar-icon-link">
                        <img src={profileIcon} alt="User Profile" className="navbar-icon" />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;