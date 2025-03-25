import React, { useState } from 'react';
import BookCard from './BookCard';
import BookDetailsModal from './BookDetailsModal';
import '../styles/SearchResults.css';

const SearchHeader = ({ loading, error, books, searchQuery, totalCount, showCount = false }) => (
    <div className="search-header">
        <h1>Search Results</h1>
        <p className="search-info" aria-live="polite">
            {loading ? 'Searching...' :
                error ? `Error: ${error}` :
                    books.length === 0 ? 'No results found' :
                        showCount ? `Found ${totalCount || books.length} results for "${searchQuery}"` :
                            `for "${searchQuery}"`}
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

const BookGrid = ({ books, onBookClick }) => (
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
);

const SearchResults = ({ books, loading, error, searchQuery, totalCount }) => {
    const [selectedBook, setSelectedBook] = useState(null);

    const handleBookClick = (book) => {
        setSelectedBook(book);
    };

    const handleCloseModal = () => {
        setSelectedBook(null);
    };

    const renderContent = () => {
        if (loading) return <LoadingState />;
        if (error) return <ErrorState error={error} />;
        if (books.length === 0) return <EmptyState searchQuery={searchQuery} />;
        return <BookGrid books={books} onBookClick={handleBookClick} />;
    };

    return (
        <section className="search-results-container" aria-label="Search results">
            <SearchHeader
                loading={loading}
                error={error}
                books={books}
                searchQuery={searchQuery}
                totalCount={totalCount}
                showCount={true}
            />

            {renderContent()}

            {selectedBook && (
                <BookDetailsModal
                    book={selectedBook}
                    onClose={handleCloseModal}
                />
            )}
        </section>
    );
};

export default SearchResults;