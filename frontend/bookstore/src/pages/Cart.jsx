import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartBookItem from '../components/CartBookItem';
import useCartState from '../hooks/useCartState';
import useContentRenderer from '../hooks/useContentRenderer';
import formatPrice from '../utils/formatPrice';
import '../styles/Cart.css';

const CartSummary = ({ subtotal, tax, total, hasOutOfStock, onCheckout, onContinueShopping }) => (
    <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row">
            <span>Shipping</span>
            <span className="shipping-estimate">Calculated at checkout</span>
        </div>
        <div className="summary-row">
            <span>Estimated Tax</span>
            <span>{formatPrice(tax)}</span>
        </div>
        <div className="summary-row total">
            <span>Estimated Total</span>
            <span>{formatPrice(total)}</span>
        </div>

        <div className="cart-actions">
            <button
                onClick={onContinueShopping}
                className="button-secondary"
            >
                Continue Shopping
            </button>
            <button
                onClick={onCheckout}
                className="button-primary"
                disabled={hasOutOfStock}
            >
                Proceed to Checkout
            </button>
        </div>

        {hasOutOfStock && (
            <p className="checkout-warning">
                Some items in your cart are out of stock. Please remove them before proceeding to checkout.
            </p>
        )}
    </div>
);

const EmptyCart = ({ onContinueShopping }) => (
    <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any books to your cart yet.</p>
        <button onClick={onContinueShopping} className="button-primary">
            Browse Books
        </button>
    </div>
);

const Cart = () => {
    const navigate = useNavigate();
    const [updatingItems, setUpdatingItems] = useState({});
    const [itemErrors, setItemErrors] = useState({});

    const {
        cartItems,
        updateCartItemQuantity,
        removeFromCart,
        loading: isLoading,
        error,
    } = useCartState();

    const { renderContent } = useContentRenderer();

    const { subtotal, tax, total, itemCount } = useMemo(() => {
        let subtotal = 0;
        let itemCount = 0;

        cartItems.forEach(item => {
            subtotal += item.book.price * item.quantity;
            itemCount += item.quantity;
        });

        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        return {
            subtotal,
            tax,
            total,
            itemCount
        };
    }, [cartItems]);

    const isCartEmpty = !isLoading && cartItems.length === 0;
    const hasOutOfStockItems = cartItems.some(item => item.book.bookStatus === 'out_of_stock');

    const handleContinueShopping = () => {
        navigate('/');
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));
        setItemErrors(prev => ({ ...prev, [itemId]: null }));

        try {
            await updateCartItemQuantity(itemId, newQuantity);
        } catch (err) {
            setItemErrors(prev => ({
                ...prev,
                [itemId]: "Failed to update quantity. Please try again."
            }));
        } finally {
            setUpdatingItems(prev => ({ ...prev, [itemId]: false }));
        }
    };

    const handleRemoveItem = async (itemId) => {
        setUpdatingItems(prev => ({ ...prev, [itemId]: true }));

        try {
            await removeFromCart(itemId);
        } catch (err) {
            // Handle error if needed
        }
    };

    const cartContent = (
        <>
            <div className="cart-items">
                {cartItems.map(item => (
                    <CartBookItem
                        key={item.cartItemId}
                        book={item.book}
                        quantity={item.quantity}
                        onQuantityChange={(qty) => handleQuantityChange(item.cartItemId, qty)}
                        onRemove={() => handleRemoveItem(item.cartItemId)}
                        isUpdating={updatingItems[item.cartItemId]}
                        error={itemErrors[item.cartItemId]}
                    />
                ))}
            </div>

            <CartSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                hasOutOfStock={hasOutOfStockItems}
                onCheckout={handleCheckout}
                onContinueShopping={handleContinueShopping}
            />
        </>
    );

    return (
        <div className="cart-container">
            <h1>Your Shopping Cart {!isCartEmpty && `(${itemCount} ${itemCount === 1 ? 'item' : 'items'})`}</h1>

            {renderContent({
                isLoading,
                error,
                content: isCartEmpty
                    ? <EmptyCart onContinueShopping={handleContinueShopping} />
                    : cartContent
            })}
        </div>
    );
};

export default Cart;