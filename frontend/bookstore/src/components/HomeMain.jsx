import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/HomeMain.css";

const BookCard = ({ book, hideStatus }) => {
    return (
        <div className="book-card">
            <Link to={`/book/${book.bookId}`}>
                <div className="book-cover">
                    <img
                        src={book.cover || "/bookcovers/placeholder.jpg"}
                        alt={`${book.title} cover`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/bookcovers/placeholder.jpg";
                        }}
                    />
                    {!hideStatus && book.bookStatus === "upcoming" && (
                        <div className="book-badge upcoming">Coming Soon</div>
                    )}
                    {book.bookStatus === "out_of_stock" && (
                        <div className="book-badge out-of-stock">Out of Stock</div>
                    )}
                </div>
                <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">{book.author}</p>
                    <p className="book-price">${parseFloat(book.price).toFixed(2)}</p>
                    <span className="book-category">{book.genre}</span>
                </div>
            </Link>
        </div>
    );
};

const BookRow = ({ title, books, isLoading, error, hideStatus }) => {
    return (
        <section className="book-row">
            <h2 className="row-title">{title}</h2>
            <div className="books-container">
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
                    books.map(book => <BookCard key={book.bookId} book={book} hideStatus={hideStatus} />)
                ) : (
                    <p className="no-books-message">No books available in this category</p>
                )}
            </div>
        </section>
    );
};

const HomeMain = () => {
    // State for upcoming books
    const [upcomingBooks, setUpcomingBooks] = useState([]);
    const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(true);
    const [upcomingError, setUpcomingError] = useState(null);

    // State for available books by genre
    const [availableGenres, setAvailableGenres] = useState([]);
    const [availableBooksByGenre, setAvailableBooksByGenre] = useState({});
    const [isLoadingAvailable, setIsLoadingAvailable] = useState(true);
    const [availableError, setAvailableError] = useState(null);

    // Fetch upcoming books
    useEffect(() => {
        const fetchUpcomingBooks = async () => {
            try {
                const response = await fetch('/api/books/upcoming');

                if (!response.ok) {
                    throw new Error('Failed to fetch upcoming books');
                }

                const books = await response.json();
                setUpcomingBooks(books);
            } catch (err) {
                console.error("Error fetching upcoming books:", err);
                setUpcomingError(err.message);
            } finally {
                setIsLoadingUpcoming(false);
            }
        };

        fetchUpcomingBooks();
    }, []);

    // Fetch available books
    useEffect(() => {
        const fetchAvailableBooks = async () => {
            try {
                const response = await fetch('/api/books/available');

                if (!response.ok) {
                    throw new Error('Failed to fetch available books');
                }

                const books = await response.json();

                // Extract unique genres from available books
                const genres = [...new Set(books.map(book => book.genre))];
                setAvailableGenres(genres);

                // Group available books by genre
                const booksByGenre = {};
                genres.forEach(genre => {
                    booksByGenre[genre] = books.filter(book => book.genre === genre);
                });
                setAvailableBooksByGenre(booksByGenre);

            } catch (err) {
                console.error("Error fetching available books:", err);
                setAvailableError(err.message);
            } finally {
                setIsLoadingAvailable(false);
            }
        };

        fetchAvailableBooks();
    }, []);

    // Function to fetch books by genre as a fallback method
    const fetchBooksByGenre = async (genre) => {
        try {
            const encodedGenre = encodeURIComponent(genre);
            const response = await fetch(`/api/books/genre/${encodedGenre}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch ${genre} books`);
            }

            const books = await response.json();
            // Filter to only include available books
            const availableBooks = books.filter(book => book.bookStatus === "available");

            // Update state for this specific genre
            setAvailableBooksByGenre(prev => ({
                ...prev,
                [genre]: availableBooks
            }));

        } catch (err) {
            console.error(`Error fetching ${genre} books:`, err);
        }
    };

    return (
        <main className="home-main">
            <div className="featured-banner">
                <h1>Welcome to Luffy's Bookstore</h1>
                <p>Discover your next favorite read</p>
            </div>

            <div className="book-rows">
                {/* Display Upcoming Books row - hide "Coming Soon" badge because it's redundant */}
                <BookRow
                    title="Coming Soon"
                    books={upcomingBooks}
                    isLoading={isLoadingUpcoming}
                    error={upcomingError}
                    hideStatus="upcoming"
                />

                {/* Display available books by genre */}
                {!isLoadingAvailable && !availableError ? (
                    availableGenres.map((genre) => (
                        <BookRow
                            key={genre}
                            title={`${genre}`}
                            books={availableBooksByGenre[genre] || []}
                            isLoading={false}
                            error={null}
                        />
                    ))
                ) : isLoadingAvailable ? (
                    <div className="loading-container main-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading book categories...</p>
                    </div>
                ) : (
                    <div className="error-message main-error">
                        <p>Failed to load available books. Please try again later.</p>
                        <small>{availableError}</small>
                    </div>
                )}
            </div>
        </main>
    );
};

export default HomeMain;