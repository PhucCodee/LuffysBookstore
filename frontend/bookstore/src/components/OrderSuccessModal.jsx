import React, { useEffect } from 'react';
import '../styles/OrderSuccessModal.css';

const OrderSuccessModal = () => {
    useEffect(() => {
        const modalOverlay = document.querySelector('.order-success-overlay');
        if (modalOverlay) {
            setTimeout(() => {
                modalOverlay.classList.add('fade-out');
            }, 1500);
        }
    }, []);

    return (
        <div className="order-success-overlay">
            <div className="order-success-modal">
                <div className="success-icon">✓</div>
                <h2>Order Placed Successfully!</h2>
                <p>Redirecting to order confirmation...</p>

                <div className="success-message" role="alert" aria-live="assertive">
                    Thank you for your order!
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;