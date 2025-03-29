import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
            <div className="navbar__container">
                {/* Logo section */}
                <div className="navbar__logo">
                    <Link to="/" aria-label="Home page">
                        <img
                            src={logo}
                            alt="Luffy's Bookstore Logo"
                            className="navbar__logo-img"
                        />
                    </Link>
                </div>

                {/* Search section */}
                <div className="navbar__search">
                    <form onSubmit={handleSearchSubmit} className="navbar__search-form">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search for books..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="navbar__search-input"
                            aria-label="Search for books"
                        />
                        <button
                            type="submit"
                            className="navbar__search-button"
                            aria-label="Submit search"
                        >
                            <img
                                src={searchIcon}
                                alt=""
                                aria-hidden="true"
                                className="navbar__search-icon"
                            />
                        </button>
                    </form>
                </div>

                {/* Icons section */}
                <div className="navbar__actions">
                    <Link
                        to="/cart"
                        className="navbar__action-link navbar__cart-link"
                        aria-label={`Shopping cart with ${cartCount} items`}
                    >
                        <img
                            src={cartIcon}
                            alt=""
                            aria-hidden="true"
                            className="navbar__action-icon"
                        />
                        {cartCount > 0 && (
                            <span
                                className={`navbar__cart-count ${cartCount > 9 ? "navbar__cart-count--large" : ""}`}
                                aria-hidden="true"
                            >
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/profile"
                        className="navbar__action-link"
                        aria-label="User profile"
                    >
                        <img
                            src={profileIcon}
                            alt=""
                            aria-hidden="true"
                            className="navbar__action-icon"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;