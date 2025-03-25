import React, { useMemo } from 'react';
import BookRow from './BookRow';
import BookDetailsModal from './BookDetailsModal';
import { LoadingSpinner, ErrorMessage } from './LoadingStates';
import useUpcomingBooks from '../hooks/useUpcomingBooks';
import useBooksByGenre from '../hooks/useBooksByGenre';
import useModal from '../hooks/useModal';
import '../styles/HomeMain.css';

const HomeMain = () => {
    const { upcomingBooks, isLoading: isLoadingUpcoming, error: upcomingError } = useUpcomingBooks();
    const { availableGenres, booksByGenre, isLoading: isLoadingBooks, error: booksError } = useBooksByGenre();
    const { selectedItem: selectedBook, openModal: handleBookClick, closeModal } = useModal();

    const genreRows = useMemo(() => {
        if (isLoadingBooks || booksError) return null;

        return availableGenres.map((genre) => (
            <BookRow
                key={genre}
                title={genre}
                books={booksByGenre[genre] || []}
                isLoading={false}
                error={null}
                onBookClick={handleBookClick}
            />
        ));
    }, [availableGenres, booksByGenre, isLoadingBooks, booksError, handleBookClick]);

    return (
        <main className="home-main">
            <div className="featured-banner" role="banner">
                <h1>Welcome to Luffy's Bookstore</h1>
                <p>Discover your next favorite read</p>
            </div>

            <div className="book-rows">
                {/* Coming Soon section */}
                <section aria-labelledby="upcoming-books-title">
                    <BookRow
                        title="Coming Soon"
                        books={upcomingBooks}
                        isLoading={isLoadingUpcoming}
                        error={upcomingError}
                        hideStatus="upcoming"
                        onBookClick={handleBookClick}
                    />
                </section>

                {/* Genre-based book sections */}
                {!isLoadingBooks && !booksError ? (
                    genreRows
                ) : isLoadingBooks ? (
                    <LoadingSpinner message="Loading book categories..." />
                ) : (
                    <ErrorMessage
                        message="Failed to load books. Please try again later."
                        details={booksError}
                    />
                )}
            </div>

            {/* Book details modal - only rendered when a book is selected */}
            {selectedBook && (
                <BookDetailsModal book={selectedBook} onClose={closeModal} />
            )}
        </main>
    );
};

export default HomeMain;