import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';

const useOrderProcessor = (clearCart, cartItems) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState(null);

    const processOrder = async (formData, total, validateForm) => {
        console.log('Processing order with form data:', formData);

        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }

        // Extra validation for address
        if (!formData.address || formData.address.trim() === '') {
            setError('Please enter a delivery address');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Get cart ID from localStorage
            const cartIdStr = localStorage.getItem('cartId');
            console.log('Cart ID from localStorage:', cartIdStr);

            // Validate cartId
            if (!cartIdStr) {
                throw new Error('No cart found. Please add items to your cart first.');
            }

            // Parse cart ID as integer
            const cartId = parseInt(cartIdStr, 10);
            if (isNaN(cartId)) {
                throw new Error('Invalid cart ID. Please try refreshing the page.');
            }

            // Get payment method
            const paymentMethod = mapPaymentMethod(formData.paymentMethod);
            console.log('Mapped payment method:', paymentMethod);

            // Create order data with all required fields
            const orderData = {
                cartId: cartId,
                customerId: 1, // Hardcoded but will be sent from service
                destination: formData.address.trim(),
                paymentMethod: paymentMethod
            };

            // Log the exact data being sent for debugging
            console.log('Sending order data to API:', orderData);
            console.log('JSON stringify of order data:', JSON.stringify(orderData));

            // Call the backend API
            const order = await orderService.createOrderFromCart(orderData);
            console.log('Order created:', order);

            // Success, clear cart
            await clearCart();
            setOrderPlaced(true);

            // Navigate to confirmation after short delay
            setTimeout(() => {
                navigate('/', {
                    state: {
                        orderDetails: {
                            orderId: order.orderId,
                            orderNumber: order.orderNumber || `ORD-${Date.now()}`,
                            items: cartItems,
                            shippingAddress: {
                                address: formData.address
                            },
                            paymentMethod: formData.paymentMethod,
                            total: order.totalAmount || total,
                            orderDate: order.orderDate || new Date().toISOString()
                        }
                    }
                });
            }, 2000);

        } catch (err) {
            console.error('Failed to place order:', err);
            setError(err.message || 'Failed to place your order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Map frontend payment method names to backend enum values
    // Adjust these values to match your Java enum exactly
    const mapPaymentMethod = (method) => {
        // These should match the enum values in your Java CustomerOrder.PaymentMethod enum
        const mapping = {
            'cod': 'cash_on_delivery',
            'credit_card': 'credit_card',
            'ebanking': 'electronic_banking'
        };

        const result = mapping[method];
        if (!result) {
            console.error(`Unknown payment method: ${method}`);
            return 'CASH_ON_DELIVERY'; // Default
        }

        return result;
    };

    return {
        isProcessing,
        orderPlaced,
        error,
        setError,
        processOrder
    };
};

export default useOrderProcessor;