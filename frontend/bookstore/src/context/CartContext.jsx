import React, { createContext, useContext } from 'react';
import useCartState from '../hooks/useCartState';

const CartContext = createContext({
    cartItems: [],
    cartCount: 0,
    loading: false,
    error: null,
    addToCart: () => Promise.resolve(false),
    updateCartItemQuantity: () => Promise.resolve(false),
    removeFromCart: () => Promise.resolve(false)
});

export const CartProvider = ({ children, customerId = 1 }) => {
    const cartState = useCartState(customerId);

    return (
        <CartContext.Provider value={cartState}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};