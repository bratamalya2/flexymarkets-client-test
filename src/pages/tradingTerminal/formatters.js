
export const formatPrice = (price, symbol) => {
    if (!price || isNaN(price)) return "0.00";
    
    const digits = symbol?.digits || 5;
    return parseFloat(price).toFixed(digits);
};

export const formatPercentage = (value) => {
    if (!value || isNaN(value)) return "0.00%";
    return `${value >= 0 ? '+' : ''}${parseFloat(value).toFixed(2)}%`;
};