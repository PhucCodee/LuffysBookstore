import { useMemo } from 'react';

const useOrderCalculator = (cartItems) => {
    return useMemo(() => {
        let subtotal = 0;
        let itemCount = 0;

        cartItems.forEach(item => {
            subtotal += item.book.price * item.quantity;
            itemCount += item.quantity;
        });

        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.05;
        const total = subtotal + shipping + tax;

        return {
            subtotal,
            tax,
            shipping,
            total,
            itemCount
        };
    }, [cartItems]);
};

export default useOrderCalculator;