import { useMemo } from 'react';

const useCartTotals = (cartItems, options = {}) => {
    const {
        taxRate = 0.07,
        shippingFee = 5.99,
        freeShippingThreshold = 0
    } = options;

    const totals = useMemo(() => {
        let subtotal = 0;
        let itemCount = 0;

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

        let hasOutOfStock = false;

        cartItems.forEach(item => {
            subtotal += item.book.price * item.quantity;
            itemCount += item.quantity;

            if (item.book.bookStatus === 'out_of_stock') {
                hasOutOfStock = true;
            }
        });

        // Calculate shipping - free if above threshold
        const shipping = subtotal > freeShippingThreshold ? shippingFee : 0;

        // Calculate tax
        const tax = subtotal * taxRate;

        // Calculate total
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

    return totals;
};

export default useCartTotals;