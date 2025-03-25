import React from 'react';
import PropTypes from 'prop-types';
import '../styles/LoadingStates.css';

export const LoadingSpinner = ({ message = "Loading...", size = "default", className = "" }) => {
    const containerClass = `loading-container ${size === "large" ? "main-loading" : ""} ${className}`;

    return (
        <div className={containerClass} role="status" aria-live="polite">
            <div
                className={`loading-spinner ${size === "small" ? "loading-spinner-sm" : ""}`}
                aria-hidden="true"
            ></div>
            <p>{message}</p>
            <span className="sr-only">Loading content, please wait.</span>
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
    const errorClass = `error-message ${isMainError ? "main-error" : ""} ${className}`;

    return (
        <div className={errorClass} role="alert">
            <p>{message}</p>
            {details && <small className="error-details">{details}</small>}
            {onRetry && (
                <button
                    className="retry-button"
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
        <div className={`empty-state ${className}`}>
            {icon && <div className="empty-state-icon">{icon}</div>}
            <p>{message}</p>
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