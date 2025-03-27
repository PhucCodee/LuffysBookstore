import React from "react";

const QuantityControls = ({
    quantity,
    onIncrease,
    onDecrease,
    minQuantity = 1,
    maxQuantity = 99,
    itemName = "item",
}) => {
    return (
        <>
            <button
                onClick={onDecrease}
                disabled={quantity <= minQuantity}
                aria-label={`Decrease quantity of ${itemName}`}
                className="quantity-button"
            >
                -
            </button>
            <span className="quantity-display">{quantity}</span>
            <button
                onClick={onIncrease}
                disabled={quantity >= maxQuantity}
                aria-label={`Increase quantity of ${itemName}`}
                className="quantity-button"
            >
                +
            </button>
        </>
    );
};

export default QuantityControls;
