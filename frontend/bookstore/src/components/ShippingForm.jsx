import React from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import '../styles/ShippingForm.css';

const FormInput = ({ label, name, type = 'text', value, onChange, error }) => (
    <div className="form-group full-width">
        <label htmlFor={name}>{label} *</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={error ? 'input-error' : ''}
        />
        {error && <div className="error-message">{error}</div>}
    </div>
);

const ShippingForm = ({
    formData,
    formErrors,
    handleInputChange,
    handlePaymentMethodSelect,
    handleBackToCart,
    handleBackToHome
}) => (
    <div className="checkout-form">
        <h2>Shipping Information</h2>

        <div className="form-row">
            <FormInput
                label="Delivery Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={formErrors.address}
            />
        </div>

        <PaymentMethodSelector
            selectedMethod={formData.paymentMethod}
            onSelect={handlePaymentMethodSelect}
        />

        <div className="navigation-buttons">
            <button onClick={handleBackToCart} className="back-to-cart-btn">
                ← Back to Cart
            </button>
            <button onClick={handleBackToHome} className="back-to-home-btn">
                ← Back to Home
            </button>
        </div>
    </div>
);

export default ShippingForm;