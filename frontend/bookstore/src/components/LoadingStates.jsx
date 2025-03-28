import React from 'react';
import PropTypes from 'prop-types';
import '../styles/LoadingStates.css';

export const LoadingSpinner = ({ message = "Loading...", size = "default", className = "" }) => {
    const containerClass = `loading__container ${size === "large" ? "loading__container--main" : ""} ${className}`;

    return (
        <div className={containerClass} role="status" aria-live="polite">
            <div
                className={`loading__spinner ${size === "small" ? "loading__spinner--small" : ""}`}
                aria-hidden="true"
            ></div>
            <p className="loading__message">{message}</p>
            <span className="util__sr-only">Loading content, please wait.</span>
        </div>
    );
};

export const ErrorMessage = ({
    message = "Failed to load. Please try again later.",
    details = null,
    isMainError = false,
    onRetry = null,
    className = ""
}) => {
    const errorClass = `error ${isMainError ? "error--main" : ""} ${className}`;

    return (
        <div className={errorClass} role="alert">
            <p>{message}</p>
            {details && <small className="error__details">{details}</small>}
            {onRetry && (
                <button
                    className="error__retry-button"
                    onClick={onRetry}
                    aria-label="Try loading the content again"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export const EmptyState = ({
    message = "No items found",
    icon = null,
    className = ""
}) => {
    return (
        <div className={`empty ${className}`}>
            {icon && <div className="empty__icon">{icon}</div>}
            <p className="empty__message">{message}</p>
        </div>
    );
};

LoadingSpinner.propTypes = {
    message: PropTypes.string,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    className: PropTypes.string
};

ErrorMessage.propTypes = {
    message: PropTypes.string,
    details: PropTypes.string,
    isMainError: PropTypes.bool,
    onRetry: PropTypes.func,
    className: PropTypes.string
};

EmptyState.propTypes = {
    message: PropTypes.string,
    icon: PropTypes.node,
    className: PropTypes.string
};