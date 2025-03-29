import React, { useEffect, useRef } from 'react';
import '../styles/OrderSuccessModal.css';

const OrderSuccessModal = () => {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (overlayRef.current) {
            setTimeout(() => {
                overlayRef.current.classList.add('order-success__overlay--fade-out');
            }, 3000);
        }
    }, []);

    return (
        <div
            ref={overlayRef}
            className="order-success__overlay"
        >
            <div className="order-success__modal">
                <div className="order-success__icon">✓</div>
                <h2 className="order-success__title">Order Placed Successfully!</h2>
                <p className="order-success__text">Redirecting to home page...</p>

                <div className="order-success__message" role="alert" aria-live="assertive">
                    Thank you for your order!
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;