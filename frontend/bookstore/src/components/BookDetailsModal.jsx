import React, { useState, useEffect, useCallback, useRef } from "react";
import { useCart } from "../context/CartContext";
import "../styles/BookDetailsModal.css";

const formatStatus = (status) => {
    switch (status) {
        case "available": return "Available";
        case "out_of_stock": return "Out of Stock";
        case "upcoming": return "Coming Soon";
        default: return status?.replace(/_/g, " ") || "Unknown";
    }
};

const BookCover = ({ book }) => (
    <div className="modal-book-cover">
        <img
            src={book.cover || "/bookcovers/placeholder.jpg"}
            alt={`${book.title} cover`}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/bookcovers/placeholder.jpg";
            }}
            loading="lazy"
        />
    </div>
);

const BookInfo = ({ book }) => (
    <>
        <h2 className="modal-book-title">{book.title}</h2>
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
            <h3>Description</h3>
            <p className="book-description">
                {book.bookDescription || "No description available."}
            </p>
        </div>
    </>
);

const CartControls = ({
    quantity,
    isAvailable,
    loading,
    maxStock,
    onDecrease,
    onIncrease,
    onAddToCart,
    onQuantityChange
}) => (
    <div className="cart-controls">
        <div className="quantity-control">
            <button
                className="quantity-btn minus"
                onClick={onDecrease}
                disabled={quantity <= 1 || !isAvailable || loading}
                aria-label="Decrease quantity"
            >
                −
            </button>
            <input
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={onQuantityChange}
                min="1"
                max={maxStock}
                disabled={!isAvailable || loading}
                aria-label="Quantity"
            />
            <button
                className="quantity-btn plus"
                onClick={onIncrease}
                disabled={!isAvailable || quantity >= maxStock || loading}
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>

        <button
            className="add-to-cart-btn"
            onClick={onAddToCart}
            disabled={!isAvailable || loading}
        >
            {loading ? "Adding..." : isAvailable ? "Add to Cart" : "Not Available"}
        </button>
    </div>
);

const BookDetailsModal = ({ book, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const { addToCart, loading } = useCart();
    const modalRef = useRef(null);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);

        if (!isNaN(value)) {
            if (value >= 1 && value <= maxStock && isAvailable) {
                setQuantity(value);
            } else if (value > maxStock) {
                setQuantity(maxStock);
            } else if (value < 1) {
                setQuantity(1);
            }
        }
    };

    useEffect(() => {
        setQuantity(1);
    }, [book?.bookId]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    useEffect(() => {
        const modal = modalRef.current;
        if (modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            firstElement?.focus();

            const trapFocus = (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement?.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement?.focus();
                    }
                }
            };

            modal.addEventListener('keydown', trapFocus);
            return () => modal.removeEventListener('keydown', trapFocus);
        }
    }, []);

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
        <div
            className="modal-backdrop"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
        >
            <div
                className="book-details-modal"
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
            >
                <button
                    className="modal-close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>

                <div className="modal-content">
                    <BookCover book={book} />

                    <div className="modal-book-info">
                        <BookInfo book={book} />

                        <CartControls
                            quantity={quantity}
                            isAvailable={isAvailable}
                            loading={loading}
                            maxStock={maxStock}
                            onDecrease={decreaseQuantity}
                            onIncrease={increaseQuantity}
                            onAddToCart={handleAddToCart}
                            onQuantityChange={handleQuantityChange}
                        />
                    </div>
                </div>

                {/* Success message overlay with improved accessibility */}
                {showSuccess && (
                    <div
                        className="success-message"
                        role="alert"
                        aria-live="assertive"
                    >
                        Added to cart!
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailsModal;