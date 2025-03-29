import { useMemo } from 'react';

const useCartCalculator = (cartItems = [], options = {}) => {
    const {
        taxRate = 0.05,
        shippingFee = 0,
        freeShippingThreshold = 0
    } = options;

    return useMemo(() => {
        // Return zeros if cart is empty
        if (!cartItems || cartItems.length === 0) {
            return {
                subtotal: 0,
                tax: 0,
                shipping: 0,
                total: 0,
                itemCount: 0,
                hasOutOfStock: false
            };
        }

        // Calculate basic totals
        let subtotal = 0;
        let itemCount = 0;
        let hasOutOfStock = false;

        cartItems.forEach(item => {
            subtotal += item.book.price * item.quantity;
            itemCount += item.quantity;

            // Check if any item is out of stock
            if (item.book.bookStatus === 'out_of_stock') {
                hasOutOfStock = true;
            }
        });

        // Calculate shipping - free if above threshold or if threshold is 0
        const shipping = (freeShippingThreshold > 0 && subtotal < freeShippingThreshold)
            ? shippingFee
            : 0;

        const tax = subtotal * taxRate;

        const total = subtotal + shipping + tax;

        return {
            subtotal,
            tax,
            shipping,
            total,
            itemCount,
            hasOutOfStock
        };
    }, [cartItems, taxRate, shippingFee, freeShippingThreshold]);
};

export default useCartCalculator;