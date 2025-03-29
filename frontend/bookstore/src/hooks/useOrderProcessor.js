import { useState } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "../services/orderService";

const useOrderProcessor = (clearCart, cartItems) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [error, setError] = useState(null);

    const processOrder = async (formData, total, validateForm) => {
        if (!validateForm()) return;

        if (!formData.address || formData.address.trim() === "") {
            setError("Please enter a delivery address");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const cartIdStr = localStorage.getItem("cartId");
            if (!cartIdStr) {
                throw new Error("No cart found. Please add items to your cart first.");
            }

            const cartId = parseInt(cartIdStr, 10);
            if (isNaN(cartId)) {
                throw new Error("Invalid cart ID. Please try refreshing the page.");
            }

            const orderData = {
                cartId: cartId,
                customerId: 1,
                destination: formData.address.trim(),
                paymentMethod: mapPaymentMethod(formData.paymentMethod),
            };

            const order = await orderService.createOrderFromCart(orderData);
            await clearCart();
            setOrderPlaced(true);

            setTimeout(() => {
                navigate("/", {
                    state: {
                        orderDetails: {
                            orderId: order.orderId,
                            orderNumber: order.orderNumber || `ORD-${Date.now()}`,
                            items: cartItems,
                            shippingAddress: {
                                address: formData.address,
                            },
                            paymentMethod: formData.paymentMethod,
                            total: order.totalAmount || total,
                            orderDate: order.orderDate || new Date().toISOString(),
                        },
                    },
                });
            }, 3000);
        } catch (err) {
            setError(err.message || "Failed to place your order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const mapPaymentMethod = (method) => {
        const mapping = {
            cod: "cash_on_delivery",
            credit_card: "credit_card",
            ebanking: "electronic_banking",
        };
        return mapping[method] || method;
    };

    return {
        isProcessing,
        orderPlaced,
        error,
        setError,
        processOrder,
    };
};

export default useOrderProcessor;