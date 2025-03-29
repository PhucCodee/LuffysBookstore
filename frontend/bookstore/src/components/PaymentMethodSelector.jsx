import React from 'react';
import '../styles/PaymentMethodSelector.css';

const PaymentOption = ({ method, selectedMethod, onSelect }) => (
    <div
        className={`payment__option ${selectedMethod === method.id ? 'payment__option--selected' : ''}`}
        onClick={() => onSelect(method.id)}
    >
        <div className="payment__selector">
            <div className={`payment__radio ${selectedMethod === method.id ? 'payment__radio--checked' : ''}`}>
                {selectedMethod === method.id && <div className="payment__radio-dot"></div>}
            </div>
            <div className="payment__info">
                <h4 className="payment__title">{method.label}</h4>
                <p className="payment__description">{method.description}</p>
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
        <div className="payment">
            <h3 className="payment__heading">Payment Method</h3>
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