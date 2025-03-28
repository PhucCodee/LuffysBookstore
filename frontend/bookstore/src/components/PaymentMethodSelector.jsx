import React from 'react';
import '../styles/PaymentMethodSelector.css';

const PaymentOption = ({ method, selectedMethod, onSelect }) => (
    <div
        className={`payment-method-option ${selectedMethod === method.id ? 'selected' : ''}`}
        onClick={() => onSelect(method.id)}
    >
        <div className="payment-selector">
            <div className={`payment-radio ${selectedMethod === method.id ? 'checked' : ''}`}>
                {selectedMethod === method.id && <div className="payment-radio-dot"></div>}
            </div>
            <div className="payment-method-info">
                <h4>{method.label}</h4>
                <p>{method.description}</p>
            </div>
        </div>
    </div>
);

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
    const paymentMethods = [
        { id: 'cod', label: 'Cash on Delivery', description: 'Pay when you receive your books' },
        { id: 'ebanking', label: 'E-Banking Transfer', description: 'Pay via bank transfer' },
        { id: 'credit_card', label: 'Credit/Debit Card', description: 'Pay with your card' }
    ];

    return (
        <div className="payment-method-selector">
            <h3>Payment Method</h3>
            {paymentMethods.map(method => (
                <PaymentOption
                    key={method.id}
                    method={method}
                    selectedMethod={selectedMethod}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
};

export default PaymentMethodSelector;