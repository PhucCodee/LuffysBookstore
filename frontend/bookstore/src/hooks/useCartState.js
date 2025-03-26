import { useState, useEffect, useCallback } from 'react';
import * as cartService from '../services/cartService';

const useCartState = (customerId = 1) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cartId, setCartId] = useState(null);

    // Calculate cart count whenever cart items change
    useEffect(() => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
    }, [cartItems]);

    const fetchCartItems = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const cart = await cartService.getCustomerCart(customerId);
            setCartId(cart.cartId);

            const items = await cartService.getCartItems(cart.cartId);
            setCartItems(items);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    // Initial cart fetch
    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    const addToCart = useCallback(async (book, quantity) => {
        if (!cartId) return false;

        setLoading(true);
        try {
            await cartService.addItemToCart(cartId, book.bookId, quantity);
            await fetchCartItems(); // Refresh cart
            return true;
        } catch (err) {
            console.error('Error adding to cart:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [cartId, fetchCartItems]);

    const updateCartItemQuantity = useCallback(async (itemId, quantity) => {
        if (!cartId) return false;

        setLoading(true);
        try {
            await cartService.updateCartItem(cartId, itemId, quantity);
            await fetchCartItems(); // Refresh cart
            return true;
        } catch (err) {
            console.error('Error updating cart item:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [cartId, fetchCartItems]);

    const removeFromCart = useCallback(async (itemId) => {
        if (!cartId) return false;

        setLoading(true);
        try {
            await cartService.removeCartItem(cartId, itemId);
            await fetchCartItems(); // Refresh cart
            return true;
        } catch (err) {
            console.error('Error removing from cart:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, [cartId, fetchCartItems]);

    return {
        cartItems,
        cartCount,
        loading,
        error,
        addToCart,
        updateCartItemQuantity,
        removeFromCart
    };
};

export default useCartState;