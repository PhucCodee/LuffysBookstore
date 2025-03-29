import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartBookItem from "../components/CartBookItem";
import EmptyState from "../components/EmptyState";
import useCartState from "../hooks/useCartState";
import useContentRenderer from "../hooks/useContentRenderer";
import formatPrice from "../utils/formatPrice";
import "../styles/Cart.css";

const CartSummary = ({
    subtotal,
    tax,
    total,
    hasOutOfStock,
    onCheckout,
    onContinueShopping,
}) => (
    <div className="cart__summary">
        <h2 className="cart__summary-title">Order Summary</h2>
        <div className="cart__summary-row">
            <span className="cart__summary-label">Subtotal</span>
            <span className="cart__summary-value">{formatPrice(subtotal)}</span>
        </div>
        <div className="cart__summary-row">
            <span className="cart__summary-label">Shipping</span>
            <span className="cart__summary-value cart__summary-value--estimate">
                Calculated at checkout
            </span>
        </div>
        <div className="cart__summary-row">
            <span className="cart__summary-label">Estimated Tax</span>
            <span className="cart__summary-value">{formatPrice(tax)}</span>
        </div>
        <div className="cart__summary-row cart__summary-row--total">
            <span className="cart__summary-label">Estimated Total</span>
            <span className="cart__summary-value">{formatPrice(total)}</span>
        </div>

        <div className="cart__actions">
            <button onClick={onContinueShopping} className="cart__button cart__button--secondary">
                Continue Shopping
            </button>
            <button
                onClick={onCheckout}
                className="cart__button cart__button--primary"
                disabled={hasOutOfStock}
            >
                Proceed to Checkout
            </button>
        </div>

        {hasOutOfStock && (
            <p className="cart__warning">
                Some items in your cart are out of stock. Please remove them before
                proceeding to checkout.
            </p>
        )}
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

        cartItems.forEach((item) => {
            subtotal += item.book.price * item.quantity;
            itemCount += item.quantity;
        });

        const tax = subtotal * 0.05;
        const total = subtotal + tax;

        return {
            subtotal,
            tax,
            total,
            itemCount,
        };
    }, [cartItems]);

    const isCartEmpty = !isLoading && cartItems.length === 0;
    const hasOutOfStockItems = cartItems.some(
        (item) => item.book.bookStatus === "out_of_stock"
    );

    const handleContinueShopping = () => {
        navigate("/");
    };

    const handleCheckout = () => {
        navigate("/checkout");
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));
        setItemErrors((prev) => ({ ...prev, [itemId]: null }));

        try {
            await updateCartItemQuantity(itemId, newQuantity);
        } catch (err) {
            setItemErrors((prev) => ({
                ...prev,
                [itemId]: "Failed to update quantity. Please try again.",
            }));
        } finally {
            setUpdatingItems((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    const handleRemoveItem = async (itemId) => {
        setUpdatingItems((prev) => ({ ...prev, [itemId]: true }));

        try {
            await removeFromCart(itemId);
        } catch (err) {
            // Handle error if needed
        }
    };

    const cartContent = (
        <>
            <div className="cart__items">
                {cartItems.map((item) => (
                    <CartBookItem
                        key={item.cartItemId}
                        book={item.book}
                        quantity={item.quantity}
                        onQuantityChange={(qty) =>
                            handleQuantityChange(item.cartItemId, qty)
                        }
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
        <div className="cart">
            <h1 className="cart__title">
                Your Shopping Cart{" "}
                {!isCartEmpty && (
                    <span className="cart__count">
                        ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </span>
                )}
            </h1>

            {renderContent({
                isLoading,
                error,
                content: isCartEmpty ? (
                    <EmptyState
                        variant="cart"
                        icon="🛒"
                        title="Your cart is empty"
                        message="Looks like you haven't added any books to your cart yet."
                        buttonText="Browse Books"
                        onButtonClick={handleContinueShopping}
                        className="cart__empty"
                    />
                ) : (
                    cartContent
                ),
            })}
        </div>
    );
};

export default Cart;