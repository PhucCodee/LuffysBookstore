import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartState from '../hooks/useCartState';
import useContentRenderer from '../hooks/useContentRenderer';
import useCheckoutForm from '../hooks/useCheckoutForm';
import useOrderProcessor from '../hooks/useOrderProcessor';
import useOrderCalculator from '../hooks/useOrderCalculator';
import ShippingForm from '../components/ShippingForm';
import CheckoutSummary from '../components/CheckoutSummary';
import EmptyCheckout from '../components/EmptyCheckout';
import OrderSuccessModal from '../components/OrderSuccessModal';
import * as cartService from '../services/cartService';
import '../styles/Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, loading: isLoading, error: cartError, clearCart, loadCartItems } = useCartState();
    const { renderContent } = useContentRenderer();

    const { formData, formErrors, handleInputChange, handlePaymentMethodSelect, validateForm } = useCheckoutForm();
    const { subtotal, tax, shipping, total } = useOrderCalculator(cartItems);

    // Destructure setError from useOrderProcessor
    const { isProcessing, orderPlaced, error: orderError, processOrder, setError: setOrderError } = useOrderProcessor(clearCart, cartItems);

    // Add this useEffect to ensure a cart exists
    useEffect(() => {
        const ensureCartExists = async () => {
            const cartId = localStorage.getItem('cartId');
            console.log('Cart ID in checkout:', cartId);

            if (!cartId) {
                console.log('No cart found in checkout, creating one...');
                try {
                    // Create a new cart
                    const newCart = await cartService.createCart();
                    console.log('New cart created in checkout:', newCart);

                    // Reload cart items with new cart
                    await loadCartItems();
                } catch (error) {
                    console.error('Failed to create cart:', error);
                    navigate('/cart'); // Redirect to cart if something goes wrong
                }
            }
        };

        ensureCartExists();
    }, [navigate, loadCartItems]);

    const handlePlaceOrder = () => {
        console.log('Place order button clicked');

        // Double-check that we have a cart ID before proceeding
        const cartId = localStorage.getItem('cartId');
        if (!cartId) {
            console.error('No cart ID found when trying to place order');
            setOrderError('Cart not found. Please refresh the page and try again.');
            return;
        }

        processOrder(formData, total, validateForm);
    };

    const renderCheckoutContent = () => {
        if (isLoading) return null;
        if (cartItems.length === 0) return <EmptyCheckout onNavigateHome={() => navigate('/')} />;

        return (
            <div className="checkout-content">
                <div className="checkout-left">
                    <ShippingForm
                        formData={formData}
                        formErrors={formErrors}
                        handleInputChange={handleInputChange}
                        handlePaymentMethodSelect={handlePaymentMethodSelect}
                        handleBackToCart={() => navigate('/cart')}
                        handleBackToHome={() => navigate('/')}
                    />
                </div>
                <div className="checkout-right">
                    <CheckoutSummary
                        cartItems={cartItems}
                        subtotal={subtotal}
                        tax={tax}
                        shipping={shipping}
                        total={total}
                        onPlaceOrder={handlePlaceOrder}
                        isProcessing={isProcessing}
                        error={orderError}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            {renderContent({
                isLoading,
                error: cartError,
                content: renderCheckoutContent()
            })}

            {orderPlaced && <OrderSuccessModal />}
        </div>
    );
};

export default Checkout;