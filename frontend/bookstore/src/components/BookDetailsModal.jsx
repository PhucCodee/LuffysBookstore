import React from "react";
import { useCart } from "../context/CartContext";
import useModalAccessibility from "../hooks/useAccessibleModal";
import useQuantityControl from "../hooks/useQuantityControl";
import useSuccessMessage from "../hooks/useSuccessMessage";
import formatStatus from "../utils/formatStatus";
import BookCover from "../components/BookCover";
import "../styles/BookDetailsModal.css";

const BookInfo = ({ book }) => (
    <>
        <h2 className="book-modal__title">{book.title}</h2>
        <p className="book-modal__author">by {book.author}</p>
        <p className="book-modal__price">${parseFloat(book.price).toFixed(2)}</p>
        <p className="book-modal__status">
            Status:{" "}
            <span
                className={`book-modal__status-tag book-modal__status-tag--${book.bookStatus}`}
            >
                {formatStatus(book.bookStatus)}
            </span>
        </p>
        <p className="book-modal__genre">Genre: {book.genre}</p>
        {book.stock !== undefined && (
            <p className="book-modal__stock">Stock: {book.stock}</p>
        )}
        <div className="book-modal__description-container">
            <h3 className="book-modal__description-title">Description</h3>
            <p className="book-modal__description-text">
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
    <div className="book-modal__cart-controls">
        <div className="book-modal__quantity-control">
            <button
                className="book-modal__quantity-btn book-modal__quantity-btn--decrease"
                onClick={onDecrease}
                disabled={quantity <= 0 || !isAvailable || loading}
                aria-label="Decrease quantity"
            >
                −
            </button>
            <input
                type="number"
                className="book-modal__quantity-input"
                value={quantity}
                onChange={onQuantityChange}
                min="0"
                max={maxStock}
                disabled={!isAvailable || loading}
                aria-label="Quantity"
            />
            <button
                className="book-modal__quantity-btn book-modal__quantity-btn--increase"
                onClick={onIncrease}
                disabled={!isAvailable || quantity >= maxStock || loading}
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>

        <button
            className="book-modal__add-btn"
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
            className="book-modal__backdrop"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
        >
            <div
                className="book-modal"
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
            >
                <button
                    className="book-modal__close-btn"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    ×
                </button>

                <div className="book-modal__content">
                    <BookCover
                        book={book}
                        className="book-modal__book-cover"
                        size="large"
                    />

                    <div className="book-modal__info">
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
                    <div
                        className="book-modal__success-message"
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
