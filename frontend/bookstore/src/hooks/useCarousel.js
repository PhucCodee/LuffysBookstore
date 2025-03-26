import { useState, useCallback, useRef, useEffect } from 'react';

const useCarousel = (dependencies = []) => {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [touchStartX, setTouchStartX] = useState(null);

    const scroll = useCallback((direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = 600;

            if (direction === "left") {
                container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    }, []);

    const checkScrollPosition = useCallback(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const isAtStart = container.scrollLeft <= 5;
            const isAtEnd = container.scrollLeft >= container.scrollWidth - container.clientWidth - 5;

            setShowLeftArrow(!isAtStart);
            setShowRightArrow(!isAtEnd);
        }
    }, []);

    // Touch event handlers
    const handleTouchStart = useCallback((e) => {
        setTouchStartX(e.touches[0].clientX);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (touchStartX === null) return;

        const touchEndX = e.touches[0].clientX;
        const diffX = touchStartX - touchEndX;

        if (Math.abs(diffX) > 30) {
            if (diffX > 0 && showRightArrow) {
                scroll('right');
            } else if (diffX < 0 && showLeftArrow) {
                scroll('left');
            }
            setTouchStartX(null);
        }
    }, [touchStartX, showLeftArrow, showRightArrow, scroll]);

    const handleTouchEnd = useCallback(() => {
        setTouchStartX(null);
    }, []);

    // Keyboard navigation
    const handleKeyDown = useCallback((e) => {
        if (document.activeElement === scrollContainerRef.current) {
            if (e.key === 'ArrowLeft' && showLeftArrow) {
                e.preventDefault();
                scroll('left');
            } else if (e.key === 'ArrowRight' && showRightArrow) {
                e.preventDefault();
                scroll('right');
            }
        }
    }, [scroll, showLeftArrow, showRightArrow]);

    // Set up event listeners
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollPosition);
            container.addEventListener("touchstart", handleTouchStart);
            container.addEventListener("touchmove", handleTouchMove);
            container.addEventListener("touchend", handleTouchEnd);
            container.addEventListener("keydown", handleKeyDown);

            checkScrollPosition();
            window.addEventListener("resize", checkScrollPosition);

            return () => {
                container.removeEventListener("scroll", checkScrollPosition);
                container.removeEventListener("touchstart", handleTouchStart);
                container.removeEventListener("touchmove", handleTouchMove);
                container.removeEventListener("touchend", handleTouchEnd);
                container.removeEventListener("keydown", handleKeyDown);
                window.removeEventListener("resize", checkScrollPosition);
            };
        }
    }, [
        checkScrollPosition,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleKeyDown,
        ...dependencies
    ]);

    return {
        scrollContainerRef,
        showLeftArrow,
        showRightArrow,
        scroll
    };
};

export default useCarousel;