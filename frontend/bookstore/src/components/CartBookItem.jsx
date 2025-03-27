import React from "react";
import formatPrice from "../utils/formatPrice";
import "../styles/CartBookItem.css";

const BookCover = ({ book }) => (
    <div className="book-cover">
        <img
            src={book.cover || book.coverImageUrl || "/bookcovers/placeholder.jpg"}
            alt={`Cover of ${book.title}`}
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/bookcovers/placeholder.jpg";
            }}
            loading="lazy"
        />
    </div>
);

const BookDetails = ({ book }) => (
    <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>

        <div className="book-meta">
            <span className="book-price">{formatPrice(book.price)}</span>
            {book.genre && <span className="book-category">{book.genre}</span>}
        </div>

        {book.bookStatus === "out_of_stock" && (
            <p className="stock-warning">Out of stock</p>
        )}
    </div>
);

const QuantityControl = ({ quantity, onQuantityChange }) => (
    <div className="quantity-control">
        <button
            className="quantity-btn decrease"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
        >
            -
        </button>
        <span className="quantity">{quantity}</span>
        <button
            className="quantity-btn increase"
            onClick={() => onQuantityChange(quantity + 1)}
            aria-label="Increase quantity"
        >
            +
        </button>
    </div>
);

const ItemSubtotal = ({ price, quantity }) => (
    <div className="item-subtotal">
        <span className="subtotal-label">Subtotal:</span>
        <span className="subtotal-value">
            {formatPrice(price * quantity)}
        </span>
    </div>
);

const CartBookItem = ({ book, quantity, onQuantityChange, onRemove }) => {
    return (
        <div className="cart-book-item">
            <BookCover book={book} />
            <BookDetails book={book} />

            <div className="book-actions">
                {onQuantityChange && <QuantityControl quantity={quantity} onQuantityChange={onQuantityChange} />}

                {onRemove && (
                    <button
                        className="remove-btn"
                        onClick={onRemove}
                        aria-label={`Remove ${book.title} from cart`}
                    >
                        ×
                    </button>
                )}

                {quantity > 0 && book.price && <ItemSubtotal price={book.price} quantity={quantity} />}
            </div>
        </div>
    );
};

CartBookItem.defaultProps = {
    quantity: 1,
};

export default CartBookItem;