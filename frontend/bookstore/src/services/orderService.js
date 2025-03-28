const API_BASE_URL = "/api";

const orderService = {
    createOrderFromCart: async (orderData) => {
        const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartId: orderData.cartId,
                customerId: 1,
                destination: orderData.destination,
                paymentMethod: orderData.paymentMethod
            })
        });

        if (!response.ok) {
            // Get more detailed error information
            let errorMessage = `Failed to create order: ${response.status}`;

            try {
                const errorData = await response.json();
                console.error('Error response:', errorData);

                if (errorData && errorData.error) {
                    errorMessage += ` - ${errorData.error}`;
                }
            } catch (e) {
                // If we can't parse JSON, try to get text
                try {
                    const errorText = await response.text();
                    console.error('Error text:', errorText);
                    if (errorText) {
                        errorMessage += ` - ${errorText}`;
                    }
                } catch (textError) {
                    console.error('Could not read error response text', textError);
                }
            }

            throw new Error(errorMessage);
        }

        return response.json();
    },

    getAllOrders: async () => {
        const response = await fetch(`${API_BASE_URL}/orders`);

        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        return response.json();
    },

    getOrderById: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch order details: ${response.status}`);
        }

        return response.json();
    },

    getCustomerOrders: async () => {
        const response = await fetch(`${API_BASE_URL}/orders/customer/1`);

        if (!response.ok) {
            throw new Error(`Failed to fetch customer orders: ${response.status}`);
        }

        return response.json();
    },

    getOrderItems: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/items`);

        if (!response.ok) {
            throw new Error(`Failed to fetch order items: ${response.status}`);
        }

        return response.json();
    },

    getOrderSummary: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/summary`);

        if (!response.ok) {
            throw new Error(`Failed to fetch order summary: ${response.status}`);
        }

        return response.json();
    },

    cancelOrder: async (orderId) => {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to cancel order: ${response.status}`);
        }

        return response.json();
    },
};

export default orderService;