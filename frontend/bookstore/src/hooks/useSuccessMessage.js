import { useState, useCallback } from 'react';

const useSuccessMessage = (duration = 2000) => {
    const [showSuccess, setShowSuccess] = useState(false);

    const displaySuccess = useCallback(() => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
        }, duration);
    }, [duration]);

    return {
        showSuccess,
        displaySuccess
    };
};

export default useSuccessMessage;