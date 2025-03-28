import React from "react";
import formatPrice from "../utils/formatPrice";
import BookCover from "./BookCover";
import "../styles/CartBookItem.css";

const BookDetails = ({ book }) => (
    <div className="cart-item__info">
        <p className="cart-item__title" title={book.title}>
            {book.title}
        </p>
        <p className="cart-item__author" title={book.author}>
            by {book.author}
        </p>
        <p className="cart-item__price">{formatPrice(book.price)}</p>
        <div className="cart-item__meta">
            {book.genre && <span className="cart-item__category">{book.genre}</span>}
        </div>

        {book.bookStatus === "out_of_stock" && (
            <p className="cart-item__warning">Out of stock</p>
        )}
    </div>
);

const QuantityControl = ({ quantity, onQuantityChange }) => (
    <div className="cart-item__quantity">
        <button
            className="cart-item__quantity-btn cart-item__quantity-btn--decrease"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
        >
            -
        </button>
        <span className="cart-item__quantity-value">{quantity}</span>
        <button
            className="cart-item__quantity-btn cart-item__quantity-btn--increase"
            onClick={() => onQuantityChange(quantity + 1)}
            aria-label="Increase quantity"
        >
            +
        </button>
    </div>
);

const ItemSubtotal = ({ price, quantity }) => (
    <div className="cart-item__subtotal">
        <span className="cart-item__subtotal-label">Subtotal:</span>
        <span className="cart-item__subtotal-value">
            {formatPrice(price * quantity)}
        </span>
    </div>
);

const CartBookItem = ({ book, quantity, onQuantityChange, onRemove }) => {
    return (
        <div className="cart-item">
            <BookCover book={book} className="cart-item__book-cover" size="medium" />
            <BookDetails book={book} />

            <div className="cart-item__actions">
                {onQuantityChange && (
                    <QuantityControl
                        quantity={quantity}
                        onQuantityChange={onQuantityChange}
                    />
                )}

                {onRemove && (
                    <button
                        className="cart-item__remove-btn"
                        onClick={onRemove}
                        aria-label={`Remove ${book.title} from cart`}
                    >
                        ×
                    </button>
                )}

                {quantity > 0 && book.price && (
                    <ItemSubtotal price={book.price} quantity={quantity} />
                )}
            </div>
        </div>
    );
};

CartBookItem.defaultProps = {
    quantity: 1,
};

export default CartBookItem;
