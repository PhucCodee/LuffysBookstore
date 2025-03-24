// src/hooks/useModal.js
import { useState } from 'react';

const useModal = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const openModal = (item) => {
        setSelectedItem(item);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedItem(null);
        document.body.style.overflow = 'auto';
    };

    return {
        selectedItem,
        isOpen: !!selectedItem,
        openModal,
        closeModal
    };
};

export default useModal;