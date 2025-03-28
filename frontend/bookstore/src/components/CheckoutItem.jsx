import React from "react";
import formatPrice from "../utils/formatPrice";
import "../styles/CheckoutItem.css";

const CheckoutItem = ({ item }) => (
    <div className="checkout-item">
        <div className="checkout-item-image">
            <img
                src={
                    item.book.cover ||
                    item.book.coverImageUrl ||
                    "/bookcovers/placeholder.jpg"
                }
                alt={item.book.title}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/bookcovers/placeholder.jpg";
                }}
                loading="lazy"
            />
        </div>
        <div className="checkout-item-details">
            <h4>{item.book.title}</h4>
            <p className="checkout-item-author">by {item.book.author}</p>
            <div className="checkout-item-price-qty">
                <span>{formatPrice(item.book.price)}</span>
                <span>×</span>
                <span>{item.quantity}</span>
            </div>
        </div>
        <div className="checkout-item-subtotal">
            {formatPrice(item.book.price * item.quantity)}
        </div>
    </div>
);

export default CheckoutItem;
