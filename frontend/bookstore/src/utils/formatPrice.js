const formatPrice = (price) => {
    return typeof price === 'number'
        ? `$${price.toFixed(2)}`
        : `$${parseFloat(price || 0).toFixed(2)}`;
};

export default formatPrice;