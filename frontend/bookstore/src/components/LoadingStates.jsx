import React from 'react';
import '../styles/LoadingStates.css'

export const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{message}</p>
        </div>
    );
};

export const ErrorMessage = ({ message = "Failed to load. Please try again later.", details = null }) => {
    return (
        <div className="error-message">
            <p>{message}</p>
            {details && <small>{details}</small>}
        </div>
    );
};