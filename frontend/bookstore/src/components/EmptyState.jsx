import React from "react";
import "../styles/EmptyState.css";

const EmptyState = ({
    icon = "🛒",
    title = "Your cart is empty",
    message = "Looks like you haven't added any books to your cart yet.",
    buttonText = "Browse Books",
    onButtonClick,
    className = "",
    variant = "default",
}) => (
    <div className={`empty-state empty-state--${variant} ${className}`}>
        <div className="empty-state__icon">{icon}</div>
        <h2 className="empty-state__title">{title}</h2>
        <p className="empty-state__text">{message}</p>
        {onButtonClick && (
            <button onClick={onButtonClick} className="empty-state__button">
                {buttonText}
            </button>
        )}
    </div>
);

export default EmptyState;
