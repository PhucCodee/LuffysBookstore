import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";
import cartIcon from "../assets/cart.png";
import profileIcon from "../assets/user.png";
import searchIcon from "../assets/search.png";
import "../styles/NavBar.css";

const NavBar = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const searchInputRef = useRef(null);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            return;
        }

        if (onSearch) {
            onSearch(searchQuery.trim());
        } else {
            navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        }

        setSearchQuery("");
    };

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-container">
                {/* Logo section */}
                <div className="navbar-logo">
                    <Link to="/" aria-label="Home page">
                        <img
                            src={logo}
                            alt="Luffy's Bookstore Logo"
                            className="logo-image"
                        />
                    </Link>
                </div>

                {/* Search section */}
                <div className="search-container">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search for books..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-input"
                            aria-label="Search for books"
                        />
                        <button
                            type="submit"
                            className="search-button"
                            aria-label="Submit search"
                        >
                            <img
                                src={searchIcon}
                                alt=""
                                aria-hidden="true"
                                className="search-icon"
                            />
                        </button>
                    </form>
                </div>

                {/* Icons section */}
                <div className="navbar-actions">
                    <Link
                        to="/cart"
                        className="navbar-icon-link cart-icon-container"
                        aria-label={`Shopping cart with ${cartCount} items`}
                    >
                        <img
                            src={cartIcon}
                            alt=""
                            aria-hidden="true"
                            className="navbar-icon"
                        />
                        {cartCount > 0 && (
                            <span
                                className={`cart-count ${cartCount > 9 ? "large" : ""}`}
                                aria-hidden="true"
                            >
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/profile"
                        className="navbar-icon-link"
                        aria-label="User profile"
                    >
                        <img
                            src={profileIcon}
                            alt=""
                            aria-hidden="true"
                            className="navbar-icon"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
