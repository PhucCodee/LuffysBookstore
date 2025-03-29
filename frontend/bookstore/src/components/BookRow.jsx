import React from "react";
import PropTypes from "prop-types";
import BookCard from "./BookCard";
import useCarousel from "../hooks/useCarousel";
import useContentRenderer from "../hooks/useContentRenderer";
import { LoadingSpinner, ErrorMessage, EmptyState } from "./LoadingStates";
import "../styles/BookRow.css";

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

const BookRow = ({
    title,
    books = [],
    isLoading = false,
    error = null,
    hideStatus = false,
    onBookClick,
}) => {
    const { scrollContainerRef, showLeftArrow, showRightArrow, scroll } =
        useCarousel([books]);

    const { renderItems } = useContentRenderer();

    const bookContent = renderItems({
        isLoading,
        error,
        items: books,
        renderItem: (book) => (
            <BookCard
                key={book.bookId}
                book={book}
                hideStatus={hideStatus}
                onBookClick={onBookClick}
            />
        ),
        LoadingState: () => (
            <LoadingSpinner
                message="Loading books..."
                className="book-row__loading"
            />
        ),
        ErrorState: () => (
            <ErrorMessage
                message="Failed to load books. Please try again later."
                className="book-row__error"
            />
        ),
        EmptyState: () => (
            <EmptyState
                message="No books available in this category"
                className="book-row__empty"
            />
        ),
    });

    return (
        <section className="book-row">
            <div className="book-row__header">
                <h2 className="book-row__title">{title}</h2>
            </div>
            <div className="book-row__container-wrapper">
                {showLeftArrow && (
                    <button
                        className="book-row__nav-arrow book-row__nav-arrow--left"
                        onClick={() => scroll("left")}
                        aria-label={`Scroll left in ${title}`}
                    >
                        <ArrowLeftIcon />
                    </button>
                )}

                <div
                    className="book-row__container"
                    ref={scrollContainerRef}
                    tabIndex={0}
                    role="region"
                    aria-label={`${title} books carousel`}
                >
                    {bookContent}
                </div>

                {showRightArrow && (
                    <button
                        className="book-row__nav-arrow book-row__nav-arrow--right"
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
    onBookClick: PropTypes.func,
};

export default React.memo(BookRow);