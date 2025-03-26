import React, { useState } from 'react';
import BookCard from './BookCard';
import BookDetailsModal from './BookDetailsModal';
import useBookPresentation from '../hooks/useBookPresentation'
import '../styles/SearchResults.css';

const SearchHeader = ({ loading, error, books, searchQuery, totalCount, showCount = false }) => (
    <div className="search-header">
        <h1>Search Results</h1>
        <p className="search-info" aria-live="polite">
            {loading ? 'Searching...' :
                error ? `Error: ${error}` :
                    books.length === 0 ? 'No results found' :
                        showCount
                            ? totalCount
                                ? `Found ${totalCount} results for "${searchQuery}"`
                                : `Found ${books.length} results for "${searchQuery}"`
                            : `for "${searchQuery}"`}
        </p>
    </div>
);

const LoadingState = () => (
    <div className="loading-container" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p>Searching for books...</p>
        <span className="sr-only">Loading search results</span>
    </div>
);

const ErrorState = ({ error }) => (
    <div className="error-message" role="alert">
        <div className="error-icon" aria-hidden="true">!</div>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <p>Please try again later or refine your search.</p>
    </div>
);

const EmptyState = ({ searchQuery }) => (
    <div className="no-results">
        <div className="empty-icon" aria-hidden="true">🔍</div>
        <h2>No books found</h2>
        <p>We couldn't find any books matching "{searchQuery}".</p>
        <ul className="search-suggestions">
            <li>Check for typos or try different keywords</li>
            <li>Use more general terms</li>
            <li>Try adjusting the filters</li>
        </ul>
    </div>
);

const BookGrid = ({ books, onBookClick, totalCount }) => {
    const hasMoreResults = totalCount > books.length;

    return (
        <>
            <div
                className="search-results-grid"
                role="list"
                aria-label="Search results"
            >
                {books.map(book => (
                    <div role="listitem" key={book.bookId} className="book-grid-item">
                        <BookCard
                            book={book}
                            onBookClick={onBookClick}
                        />
                    </div>
                ))}
            </div>

            {hasMoreResults && (
                <div className="search-results-info">
                    <p>
                        Showing {books.length} of {totalCount} results
                    </p>
                    {/* Pagination controls would go here if implemented */}
                </div>
            )}
        </>
    );
};

const SearchResults = ({ books, loading, error, searchQuery, totalCount }) => {
    const {
        content,
        headerInfo,
        selectedBook,
        isModalOpen,
        handleBookClick,
        handleCloseModal
    } = useBookPresentation("search", { books, loading, error, searchQuery, totalCount });

    const renderContent = () => {
        switch (content.type) {
            case 'loading':
                return <LoadingState />;
            case 'error':
                return <ErrorState error={content.error} />;
            case 'empty':
                return <EmptyState searchQuery={content.searchQuery} />;
            case 'results':
                return (
                    <BookGrid
                        books={content.books}
                        onBookClick={handleBookClick}
                        totalCount={content.totalCount}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <section className="search-results-container" aria-label="Search results">
            <SearchHeader
                {...headerInfo}
                showCount={true}
            />

            {renderContent()}

            {isModalOpen && (
                <BookDetailsModal
                    book={selectedBook}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    );
};

export default SearchResults;