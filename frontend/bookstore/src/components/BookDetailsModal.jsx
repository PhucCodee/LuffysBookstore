import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/BookDetailsModal.css";

const formatStatus = (status) => {
    switch (status) {
        case "available":
            return "Available";
        case "out_of_stock":
            return "Out of Stock";
        case "upcoming":
            return "Coming Soon";
        default:
            return status?.replace(/_/g, " ") || "Unknown";
    }
};

const BookDetailsModal = ({ book, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const { addToCart, loading } = useCart();

    if (!book) return null;

    const isAvailable = book.bookStatus === "available";
    const maxStock = book.stock !== undefined ? book.stock : 10;

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < maxStock && isAvailable) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = async () => {
        const success = await addToCart(book, quantity);
        if (success) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="book-details-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    ×
                </button>
                <div className="modal-content">
                    {/* Book cover */}
                    <div className="modal-book-cover">
                        <img
                            src={book.cover || "/bookcovers/placeholder.jpg"}
                            alt={`${book.title} cover`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/bookcovers/placeholder.jpg";
                            }}
                        />
                    </div>

                    {/* Book info */}
                    <div className="modal-book-info">
                        <p className="modal-book-title">{book.title}</p>
                        <p className="modal-book-author">by {book.author}</p>
                        <p className="modal-book-price">
                            ${parseFloat(book.price).toFixed(2)}
                        </p>
                        <p className="modal-book-status">
                            Status:{" "}
                            <span className={`status-tag ${book.bookStatus}`}>
                                {formatStatus(book.bookStatus)}
                            </span>
                        </p>
                        <p className="modal-book-genre">Genre: {book.genre}</p>
                        {book.stock !== undefined && (
                            <p className="modal-book-stock">Stock: {book.stock}</p>
                        )}
                        <div className="modal-book-description">
                            <p>Description</p>
                            <p className="book-description">
                                {book.bookDescription || "No description available."}
                            </p>
                        </div>

                        {/* Cart Controls */}
                        <div className="cart-controls">
                            <div className="quantity-control">
                                <button
                                    className="quantity-btn minus"
                                    onClick={decreaseQuantity}
                                    disabled={quantity <= 1 || !isAvailable || loading}
                                    aria-label="Decrease quantity"
                                >
                                    −
                                </button>
                                <span className="quantity-display">{quantity}</span>
                                <button
                                    className="quantity-btn plus"
                                    onClick={increaseQuantity}
                                    disabled={!isAvailable || quantity >= maxStock || loading}
                                    aria-label="Increase quantity"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                className="add-to-cart-btn"
                                onClick={handleAddToCart}
                                disabled={!isAvailable || loading}
                            >
                                {loading ? "Adding..." : isAvailable ? "Add to Cart" : "Not Available"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success message overlay */}
                {showSuccess && <div className="success-message">Added to cart!</div>}
            </div>
        </div>
    );
};

export default BookDetailsModal;