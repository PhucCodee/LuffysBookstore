const API_BASE_URL = '/api';

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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add item to cart');
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
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to remove item from cart');
    }

    return true;
};