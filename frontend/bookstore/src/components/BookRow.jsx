import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import BookCard from './BookCard';
import '../styles/BookRow.css';

// Extract SVG components for cleaner code
const ArrowLeftIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 8 8 12 12 16"></polyline>
        <line x1="16" y1="12" x2="8" y2="12"></line>
    </svg>
);

const ArrowRightIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 16 16 12 12 8"></polyline>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

// Loading State Component
const LoadingState = () => (
    <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading books...</p>
    </div>
);

// Error State Component
const ErrorState = () => (
    <div className="error-message">
        <p>Failed to load books. Please try again later.</p>
    </div>
);

// Empty State Component
const EmptyState = () => (
    <p className="no-books-message">
        No books available in this category
    </p>
);

const BookRow = ({ title, books = [], isLoading = false, error = null, hideStatus = false, onBookClick }) => {
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
    }, [checkScrollPosition, handleTouchStart, handleTouchMove, handleTouchEnd, handleKeyDown, books]);

    const renderContent = () => {
        if (isLoading) return <LoadingState />;
        if (error) return <ErrorState />;
        if (books.length === 0) return <EmptyState />;

        return books.map((book) => (
            <BookCard
                key={book.bookId}
                book={book}
                hideStatus={hideStatus}
                onBookClick={onBookClick}
            />
        ));
    };

    return (
        <section className="book-row">
            <div className="row-header">
                <h2 className="row-title">{title}</h2>
            </div>
            <div className="books-container-wrapper">
                {showLeftArrow && (
                    <button
                        className="nav-arrow left-arrow"
                        onClick={() => scroll("left")}
                        aria-label={`Scroll left in ${title}`}
                    >
                        <ArrowLeftIcon />
                    </button>
                )}

                <div
                    className="books-container"
                    ref={scrollContainerRef}
                    tabIndex={0}
                    role="region"
                    aria-label={`${title} books carousel`}
                >
                    {renderContent()}
                </div>

                {showRightArrow && (
                    <button
                        className="nav-arrow right-arrow"
                        onClick={() => scroll("right")}
                        aria-label={`Scroll right in ${title}`}
                    >
                        <ArrowRightIcon />
                    </button>
                )}
            </div>
        </section>
    );
};

BookRow.propTypes = {
    title: PropTypes.string.isRequired,
    books: PropTypes.array,
    isLoading: PropTypes.bool,
    error: PropTypes.any,
    hideStatus: PropTypes.bool,
    onBookClick: PropTypes.func
};

export default React.memo(BookRow);