import { useState, useEffect } from 'react';

const useQuantityControl = (initialValue = 0, maxValue = 10, isAvailable = true, resetDependency = null) => {
    const [quantity, setQuantity] = useState(initialValue);

    useEffect(() => {
        setQuantity(initialValue);
    }, [resetDependency, initialValue]);

    const handleDecrease = () => {
        if (quantity > 0 && isAvailable) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (quantity < maxValue && isAvailable) {
            setQuantity(quantity + 1);
        }
    };

    const handleChange = (e) => {
        const value = parseInt(e.target.value, 10);

        if (!isNaN(value)) {
            if (value >= 0 && value <= maxValue && isAvailable) {
                setQuantity(value);
            } else if (value > maxValue) {
                setQuantity(maxValue);
            } else if (value < 0) {
                setQuantity(0);
            }
        }
    };

    return {
        quantity,
        handleDecrease,
        handleIncrease,
        handleChange
    };
};

export default useQuantityControl;