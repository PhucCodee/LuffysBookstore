import React from 'react';
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

    return (
        <main className="home-main">
            <div className="featured-banner">
                <h1>Welcome to Luffy's Bookstore</h1>
                <p>Discover your next favorite read</p>
            </div>

            <div className="book-rows">
                <BookRow
                    title="Coming Soon"
                    books={upcomingBooks}
                    isLoading={isLoadingUpcoming}
                    error={upcomingError}
                    hideStatus="upcoming"
                    onBookClick={handleBookClick}
                />

                {!isLoadingBooks && !booksError ? (
                    availableGenres.map((genre) => (
                        <BookRow
                            key={genre}
                            title={genre}
                            books={booksByGenre[genre] || []}
                            isLoading={false}
                            error={null}
                            onBookClick={handleBookClick}
                        />
                    ))
                ) : isLoadingBooks ? (
                    <LoadingSpinner message="Loading book categories..." />
                ) : (
                    <ErrorMessage message="Failed to load books. Please try again later." details={booksError} />
                )}
            </div>

            {selectedBook && (
                <BookDetailsModal book={selectedBook} onClose={closeModal} />
            )}
        </main>
    );
};

export default HomeMain;