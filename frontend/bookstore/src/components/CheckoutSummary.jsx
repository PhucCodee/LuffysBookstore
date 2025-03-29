import React from "react";
import formatPrice from "../utils/formatPrice";
import CheckoutItem from "./CheckoutItem";
import "../styles/CheckoutSummary.css";

const SummaryRow = ({ label, value, isTotal = false }) => (
    <div className={`summary__row ${isTotal ? "summary__row--total" : ""}`}>
        <span className="summary__label">{label}</span>
        <span className="summary__value">{formatPrice(value)}</span>
    </div>
);

const CheckoutSummary = ({
    cartItems,
    subtotal,
    tax,
    shipping,
    total,
    onPlaceOrder,
    isProcessing,
    error,
}) => {
    return (
        <div className="summary">
            <h2 className="summary__title">Order Summary</h2>

            <div className="summary__items-wrapper">
                <div className="summary__items">
                    {cartItems.map((item) => (
                        <CheckoutItem key={item.cartItemId} item={item} />
                    ))}
                </div>
            </div>

            <div className="summary__totals">
                <SummaryRow label="Subtotal" value={subtotal} />
                {/* <SummaryRow label="Shipping" value={shipping} /> */}
                <SummaryRow label="Tax" value={tax} />
                <SummaryRow label="Total" value={total} isTotal={true} />
            </div>

            {error && <div className="summary__error">{error}</div>}

            <button
                className={`summary__button ${isProcessing ? "summary__button--processing" : ""
                    }`}
                onClick={onPlaceOrder}
                disabled={isProcessing}
            >
                {isProcessing ? "Processing..." : "Place Order"}
            </button>
        </div>
    );
};

export default CheckoutSummary;
