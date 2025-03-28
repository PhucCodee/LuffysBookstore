import React from 'react';
import '../styles/EmptyCheckout.css';

const EmptyCheckout = ({ onNavigateHome }) => (
    <div className="empty-checkout">
        <div className="empty-checkout-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some books to your cart before proceeding to checkout.</p>
        <button onClick={onNavigateHome} className="button-primary">
            Browse Books
        </button>
    </div>
);

export default EmptyCheckout;