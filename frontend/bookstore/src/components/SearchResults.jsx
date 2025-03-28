import React from 'react';
import BookCard from './BookCard';
import BookDetailsModal from './BookDetailsModal';
import { LoadingSpinner, ErrorMessage, EmptyState } from './LoadingStates';
import useBookPresentation from '../hooks/useBookPresentation'
import '../styles/SearchResults.css';

const SearchHeader = ({ loading, error, books, searchQuery, totalCount, showCount = false }) => (
    <div className="search__header">
        <h1 className="search__title">Search Results</h1>
        <p className="search__info" aria-live="polite">
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

const CustomLoadingState = () => (
    <LoadingSpinner
        message="Searching for books..."
        size="large"
        className="search__loading"
    />
);

const CustomErrorState = ({ error }) => (
    <ErrorMessage
        message="Something went wrong"
        details={`${error}. Please try again later or refine your search.`}
        isMainError={true}
        className="search__error"
    />
);

const CustomEmptyState = ({ searchQuery }) => (
    <div className="search__empty">
        <EmptyState
            message={`We couldn't find any books matching "${searchQuery}".`}
            icon="🔍"
            className="search__empty-state"
        />
        <ul className="search__suggestions">
            <li className="search__suggestion-item">Check for typos or try different keywords</li>
            <li className="search__suggestion-item">Use more general terms</li>
            <li className="search__suggestion-item">Try adjusting the filters</li>
        </ul>
    </div>
);

const BookGrid = ({ books, onBookClick, totalCount }) => {
    const hasMoreResults = totalCount > books.length;

    return (
        <>
            <div
                className="search__grid"
                role="list"
                aria-label="Search results"
            >
                {books.map(book => (
                    <div role="listitem" key={book.bookId} className="search__grid-item">
                        <BookCard
                            book={book}
                            onBookClick={onBookClick}
                        />
                    </div>
                ))}
            </div>

            {hasMoreResults && (
                <div className="search__pagination-info">
                    <p className="search__results-count">
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
                return <CustomLoadingState />;
            case 'error':
                return <CustomErrorState error={content.error} />;
            case 'empty':
                return <CustomEmptyState searchQuery={content.searchQuery} />;
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
        <section className="search" aria-label="Search results">
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