import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const customerId = 1;

    useEffect(() => {
        fetchCartItems();
    }, []);

    useEffect(() => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
    }, [cartItems]);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const cartResponse = await fetch(`/api/carts/customer/${customerId}`);

            if (!cartResponse.ok) {
                throw new Error('Failed to fetch cart');
            }

            const cart = await cartResponse.json();

            const itemsResponse = await fetch(`/api/carts/${cart.cartId}/items`);

            if (!itemsResponse.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const items = await itemsResponse.json();
            setCartItems(items);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (book, quantity) => {
        setLoading(true);
        try {
            // First get the active cart
            const cartResponse = await fetch(`/api/carts/customer/${customerId}`);

            if (!cartResponse.ok) {
                throw new Error('Failed to fetch cart');
            }

            const cart = await cartResponse.json();

            // Add item to cart
            const response = await fetch(`/api/carts/${cart.cartId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookId: book.bookId,
                    quantity: quantity
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add item to cart');
            }

            // Refresh cart items
            await fetchCartItems();
            return true;
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateCartItemQuantity = async (itemId, quantity) => {
        // Implementation similar to addToCart
        // ...
    };

    const removeFromCart = async (itemId) => {
        // Implementation similar to addToCart
        // ...
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                loading,
                error,
                addToCart,
                updateCartItemQuantity,
                removeFromCart
            }}
        >
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