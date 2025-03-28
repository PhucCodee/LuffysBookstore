import { useState, useEffect, useCallback } from "react";
import * as cartService from "../services/cartService";

const useCartState = (customerId = 1) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cartId, setCartId] = useState(null);

    // Calculate cart count whenever cart items change
    useEffect(() => {
        const count = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(count);
    }, [cartItems]);

    const loadCartItems = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Try to get existing cart or create a new one
            console.log("Loading cart for customer:", customerId);
            let cart;

            try {
                cart = await cartService.getCustomerCart(customerId);
            } catch (cartError) {
                console.log(
                    "Error getting customer cart, creating new one:",
                    cartError
                );
                cart = await cartService.createCart(customerId);
            }

            if (!cart || !cart.cartId) {
                throw new Error("Failed to get or create cart");
            }

            // Save cart ID to state and localStorage
            setCartId(cart.cartId);
            localStorage.setItem("cartId", cart.cartId.toString());
            console.log("Cart ID set to:", cart.cartId);

            // Get cart items
            const items = await cartService.getCartItems(cart.cartId);
            setCartItems(items);
            console.log("Loaded cart items:", items.length);
        } catch (err) {
            console.error("Error loading cart:", err);
            setError(err.message || "Failed to load cart");
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    // Initial cart fetch
    useEffect(() => {
        loadCartItems();
    }, [loadCartItems]);

    const addToCart = useCallback(
        async (book, quantity = 1) => {
            if (!cartId) {
                console.log("No cart ID found, loading cart first");
                await loadCartItems();

                // If still no cart ID, fail
                if (!cartId) {
                    setError("Failed to create cart");
                    return false;
                }
            }

            setLoading(true);
            try {
                console.log(
                    `Adding book ${book.bookId} (qty: ${quantity}) to cart ${cartId}`
                );
                await cartService.addItemToCart(cartId, book.bookId, quantity);
                await loadCartItems(); // Refresh cart
                return true;
            } catch (err) {
                console.error("Error adding to cart:", err);
                setError(err.message || "Failed to add item to cart");
                return false;
            } finally {
                setLoading(false);
            }
        },
        [cartId, loadCartItems]
    );

    const updateCartItemQuantity = useCallback(
        async (itemId, quantity) => {
            if (!cartId) return false;

            setLoading(true);
            try {
                console.log(`Updating item ${itemId} to quantity ${quantity}`);
                await cartService.updateCartItem(cartId, itemId, quantity);
                await loadCartItems(); // Refresh cart
                return true;
            } catch (err) {
                console.error("Error updating cart item:", err);
                setError(err.message || "Failed to update cart item");
                return false;
            } finally {
                setLoading(false);
            }
        },
        [cartId, loadCartItems]
    );

    const removeFromCart = useCallback(
        async (itemId) => {
            if (!cartId) return false;

            setLoading(true);
            try {
                console.log(`Removing item ${itemId} from cart`);
                await cartService.removeCartItem(cartId, itemId);
                await loadCartItems(); // Refresh cart
                return true;
            } catch (err) {
                console.error("Error removing from cart:", err);
                setError(err.message || "Failed to remove item from cart");
                return false;
            } finally {
                setLoading(false);
            }
        },
        [cartId, loadCartItems]
    );

    const clearCart = useCallback(async () => {
        if (!cartId) return false;

        setLoading(true);
        try {
            console.log(`Clearing cart ${cartId}`);
            await cartService.clearCart(cartId);
            setCartItems([]);
            return true;
        } catch (err) {
            console.error("Error clearing cart:", err);
            setError(err.message || "Failed to clear cart");
            return false;
        } finally {
            setLoading(false);
        }
    }, [cartId]);

    return {
        cartItems,
        cartCount,
        loading,
        error,
        cartId,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        loadCartItems,
    };
};

export default useCartState;
