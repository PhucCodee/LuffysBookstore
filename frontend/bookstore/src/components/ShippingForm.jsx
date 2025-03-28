import React from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';
import '../styles/ShippingForm.css';

const FormInput = ({ label, name, type = 'text', value, onChange, error }) => (
    <div className="shipping-form__group shipping-form__group--full">
        <label className="shipping-form__label" htmlFor={name}>{label} *</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`shipping-form__input ${error ? 'shipping-form__input--error' : ''}`}
        />
        {error && <div className="shipping-form__error">{error}</div>}
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
    <div className="shipping-form">
        <h2 className="shipping-form__title">Shipping Information</h2>

        <div className="shipping-form__row">
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

        <div className="shipping-form__navigation">
            <button onClick={handleBackToCart} className="shipping-form__button shipping-form__button--back">
                ← Back to Cart
            </button>
            <button onClick={handleBackToHome} className="shipping-form__button shipping-form__button--home">
                ← Back to Home
            </button>
        </div>
    </div>
);

export default ShippingForm;