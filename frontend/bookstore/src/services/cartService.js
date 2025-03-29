const API_BASE_URL = '/api';

export const createCart = async (customerId = 1) => {
    console.log('Creating new cart for customer:', customerId);

    const response = await fetch(`${API_BASE_URL}/carts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerId })
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create cart: ${errorData}`);
    }

    const cart = await response.json();

    if (cart && cart.cartId) {
        localStorage.setItem('cartId', cart.cartId.toString());
        console.log('New cart created and ID stored:', cart.cartId);
    }

    return cart;
};

export const getCustomerCart = async (customerId) => {
    const response = await fetch(`${API_BASE_URL}/carts/customer/${customerId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch cart');
    }

    return response.json();
};

export const getCartItems = async (cartId) => {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}/items`);

    if (!response.ok) {
        throw new Error('Failed to fetch cart items');
    }

    return response.json();
};

export const addItemToCart = async (cartId, bookId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId, quantity })
    });

    if (!response.ok) {
        throw new Error('Failed to add item to cart');
    }

    return response.json();
};

export const updateCartItem = async (cartId, itemId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    });

    if (!response.ok) {
        throw new Error('Failed to update cart item');
    }

    return response.json();
};

export const removeCartItem = async (cartId, itemId) => {
    const response = await fetch(`${API_BASE_URL}/carts/${cartId}/items/${itemId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }

    return true;
};

export const clearCart = async (cartId) => {
    if (!cartId) {
        cartId = localStorage.getItem('cartId');
        if (!cartId) {
            console.log('No cart to clear');
            return true; // Nothing to clear
        }
    }

    console.log(`Clearing cart ${cartId}`);

    const response = await fetch(`${API_BASE_URL}/carts/${cartId}/items`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to clear cart');
    }

    return true;
};