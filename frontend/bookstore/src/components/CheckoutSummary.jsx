import React from 'react';
import formatPrice from '../utils/formatPrice';
import CheckoutItem from './CheckoutItem';
import '../styles/CheckoutSummary.css';

const SummaryRow = ({ label, value, isTotal = false }) => (
    <div className={`summary-row ${isTotal ? 'total' : ''}`}>
        <span>{label}</span>
        <span>{formatPrice(value)}</span>
    </div>
);

const CheckoutSummary = ({ cartItems, subtotal, tax, shipping, total, onPlaceOrder, isProcessing, error }) => {
    return (
        <div className="checkout-summary">
            <h2>Order Summary</h2>

            <div className="checkout-items">
                {cartItems.map(item => (
                    <CheckoutItem
                        key={item.cartItemId}
                        item={item}
                    />
                ))}
            </div>

            <div className="checkout-totals">
                <SummaryRow label="Subtotal" value={subtotal} />
                <SummaryRow label="Shipping" value={shipping} />
                <SummaryRow label="Tax" value={tax} />
                <SummaryRow label="Total" value={total} isTotal={true} />
            </div>

            {error && (
                <div className="order-error-message">
                    {error}
                </div>
            )}

            <button
                className="place-order-btn"
                onClick={onPlaceOrder}
                disabled={isProcessing}
            >
                {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
        </div>
    );
};

export default CheckoutSummary;