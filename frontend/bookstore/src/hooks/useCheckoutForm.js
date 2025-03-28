import { useState } from 'react';

const useCheckoutForm = () => {
    const [formData, setFormData] = useState({
        address: '',
        paymentMethod: 'cod'
    });
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handlePaymentMethodSelect = (method) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: method
        }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.address.trim()) errors.address = 'Delivery address is required';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return {
        formData,
        formErrors,
        handleInputChange,
        handlePaymentMethodSelect,
        validateForm
    };
};

export default useCheckoutForm;