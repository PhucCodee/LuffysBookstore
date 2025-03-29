import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartState from "../hooks/useCartState";
import useContentRenderer from "../hooks/useContentRenderer";
import useCheckoutForm from "../hooks/useCheckoutForm";
import useOrderProcessor from "../hooks/useOrderProcessor";
import useCartCalculator from "../hooks/useCartCalculator";
import ShippingForm from "../components/ShippingForm";
import CheckoutSummary from "../components/CheckoutSummary";
import OrderSuccessModal from "../components/OrderSuccessModal";
import * as cartService from "../services/cartService";
import "../styles/Checkout.css";

const Checkout = () => {
    const navigate = useNavigate();

    const {
        cartItems,
        loading: isLoading,
        error: cartError,
        clearCart,
        loadCartItems,
    } = useCartState();
    const { renderContent } = useContentRenderer();

    const {
        formData,
        formErrors,
        handleInputChange,
        handlePaymentMethodSelect,
        validateForm,
    } = useCheckoutForm();

    const { subtotal, tax, shipping, total, hasOutOfStock } = useCartCalculator(cartItems, {
        taxRate: 0.05,
        shippingFee: 5.99,
        freeShippingThreshold: 100
    });

    const {
        isProcessing,
        orderPlaced,
        error: orderError,
        processOrder,
        setError: setOrderError,
    } = useOrderProcessor(clearCart, cartItems);

    useEffect(() => {
        const ensureCartExists = async () => {
            const cartId = localStorage.getItem("cartId");
            console.log("Cart ID in checkout:", cartId);

            if (!cartId) {
                console.log("No cart found in checkout, creating one...");
                try {
                    const newCart = await cartService.createCart();
                    console.log("New cart created in checkout:", newCart);

                    await loadCartItems();
                } catch (error) {
                    console.error("Failed to create cart:", error);
                    navigate("/cart"); // Redirect to cart if something goes wrong
                }
            }
        };

        ensureCartExists();
    }, [navigate, loadCartItems]);

    const handlePlaceOrder = async () => {
        console.log("Place order button clicked");

        const cartId = localStorage.getItem("cartId");
        if (!cartId) {
            console.error("No cart ID found when trying to place order");
            setOrderError("Cart not found. Please refresh the page and try again.");
            return;
        }

        if (hasOutOfStock) {
            setOrderError("Some items in your cart are out of stock. Please remove them before proceeding.");
            return;
        }

        processOrder(formData, total, validateForm);
    };

    const renderCheckoutContent = () => {
        if (isLoading) return null;

        return (
            <div className="checkout__content">
                <div className="checkout__column checkout__column--left">
                    <ShippingForm
                        formData={formData}
                        formErrors={formErrors}
                        handleInputChange={handleInputChange}
                        handlePaymentMethodSelect={handlePaymentMethodSelect}
                        handleBackToCart={() => navigate("/cart")}
                        handleBackToHome={() => navigate("/")}
                    />
                </div>
                <div className="checkout__column checkout__column--right">
                    <CheckoutSummary
                        cartItems={cartItems}
                        subtotal={subtotal}
                        tax={tax}
                        shipping={shipping}
                        total={total}
                        onPlaceOrder={handlePlaceOrder}
                        isProcessing={isProcessing}
                        error={orderError}
                        hasOutOfStock={hasOutOfStock}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="checkout">
            <h1 className="checkout__title">Checkout</h1>

            {renderContent({
                isLoading,
                error: cartError,
                content: renderCheckoutContent(),
            })}

            {orderPlaced && <OrderSuccessModal />}
        </div>
    );
};

export default Checkout;