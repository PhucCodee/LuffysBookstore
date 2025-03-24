import React, { useState, useEffect, useRef } from 'react';
import BookCard from './BookCard';
import '../styles/BookRow.css'

const BookRow = ({ title, books, isLoading, error, hideStatus, onBookClick }) => {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount =
                container.querySelector(".book-card")?.offsetWidth + 420 || 200;

            if (direction === "left") {
                container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;

            setShowLeftArrow(container.scrollLeft > 0);

            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 5
            );
        }
    };

    // Add scroll event listener
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScrollPosition);
            // Initial check
            checkScrollPosition();

            // Also check when window resizes in case row layout changes
            window.addEventListener("resize", checkScrollPosition);

            return () => {
                container.removeEventListener("scroll", checkScrollPosition);
                window.removeEventListener("resize", checkScrollPosition);
            };
        }
    }, [books]);

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
                        aria-label="Scroll left"
                    >
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
                    </button>
                )}

                <div className="books-container" ref={scrollContainerRef}>
                    {isLoading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading books...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>Failed to load books. Please try again later.</p>
                        </div>
                    ) : books.length > 0 ? (
                        books.map((book) => (
                            <BookCard
                                key={book.bookId}
                                book={book}
                                hideStatus={hideStatus}
                                onBookClick={onBookClick}
                            />
                        ))
                    ) : (
                        <p className="no-books-message">
                            No books available in this category
                        </p>
                    )}
                </div>

                {showRightArrow && (
                    <button
                        className="nav-arrow right-arrow"
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                    >
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
                    </button>
                )}
            </div>
        </section>
    );
};

export default BookRow;