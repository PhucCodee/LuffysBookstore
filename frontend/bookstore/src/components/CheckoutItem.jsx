import React from "react";
import formatPrice from "../utils/formatPrice";
import "../styles/CheckoutItem.css";

const CheckoutItem = ({ item }) => (
    <div className="checkout-item">
        <div className="checkout-item__image">
            <img
                src={
                    item.book.cover ||
                    item.book.coverImageUrl ||
                    "/bookcovers/placeholder.jpg"
                }
                alt={item.book.title}
                className="checkout-item__img"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/bookcovers/placeholder.jpg";
                }}
                loading="lazy"
            />
        </div>
        <div className="checkout-item__details">
            <h4 className="checkout-item__title">{item.book.title}</h4>
            <p className="checkout-item__author">by {item.book.author}</p>
            <div className="checkout-item__price-info">
                <span className="checkout-item__price">{formatPrice(item.book.price)}</span>
                <span className="checkout-item__multiply">×</span>
                <span className="checkout-item__quantity">{item.quantity}</span>
            </div>
        </div>
        <div className="checkout-item__subtotal">
            {formatPrice(item.book.price * item.quantity)}
        </div>
    </div>
);

export default CheckoutItem;