import { useState, useRef, useEffect } from 'react';

const useAccessibleModal = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const modalRef = useRef(null);

    // Open modal
    const openModal = (item) => {
        setSelectedItem(item);
        document.body.style.overflow = 'hidden';
    };

    // Close modal
    const closeModal = () => {
        setSelectedItem(null);
        document.body.style.overflow = 'auto';
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') closeModal();
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    // Handle focus trapping
    useEffect(() => {
        const modal = modalRef.current;
        if (!modal || !selectedItem) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement?.focus();

        const trapFocus = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        modal.addEventListener('keydown', trapFocus);
        return () => modal.removeEventListener('keydown', trapFocus);
    }, [selectedItem]);

    return {
        selectedItem,
        isOpen: !!selectedItem,
        openModal,
        closeModal,
        modalRef
    };
};

export default useAccessibleModal;