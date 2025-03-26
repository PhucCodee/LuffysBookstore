import React, { useRef } from "react";
import { useCart } from "../context/CartContext";
import useModalAccessibility from "../hooks/useAccessibleModal";
import useQuantityControl from "../hooks/useQuantityControl";
import useSuccessMessage from "../hooks/useSuccessMessage";
import formatStatus from "../utils/formatStatus";
import "../styles/BookDetailsModal.css";

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
        <p className="modal-book-price">${parseFloat(book.price).toFixed(2)}</p>
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
    onQuantityChange,
}) => (
    <div className="cart-controls">
        <div className="quantity-control">
            <button
                className="quantity-btn minus"
                onClick={onDecrease}
                disabled={quantity <= 0 || !isAvailable || loading}
                aria-label="Decrease quantity"
            >
                −
            </button>
            <input
                type="number"
                className="quantity-input"
                value={quantity}
                onChange={onQuantityChange}
                min="0"
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

const BookDetailsModal = ({ book, onClose, modalRef }) => {
    const { addToCart, loading } = useCart();

    const isAvailable = book?.bookStatus === "available";
    const maxStock = book?.stock !== undefined ? book.stock : 10;

    const { quantity, handleDecrease, handleIncrease, handleChange } =
        useQuantityControl(1, maxStock, isAvailable, book?.bookId);

    useModalAccessibility(modalRef, onClose);

    const { showSuccess, displaySuccess } = useSuccessMessage();

    if (!book) return null;

    const handleAddToCart = async () => {
        if (quantity === 0) return;
        const success = await addToCart(book, quantity);
        if (success) {
            displaySuccess();
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
                            onDecrease={handleDecrease}
                            onIncrease={handleIncrease}
                            onAddToCart={handleAddToCart}
                            onQuantityChange={handleChange}
                        />
                    </div>
                </div>

                {showSuccess && (
                    <div className="success-message" role="alert" aria-live="assertive">
                        Added to cart!
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailsModal;
