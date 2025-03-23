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
    const [booksByGenre, setBooksByGenre] = useState({});
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);
    const [booksError, setBooksError] = useState(null);

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

    // Fetch both available and out of stock books
    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                setIsLoadingBooks(true);

                // Fetch both available and out-of-stock books
                const [availableResponse, outOfStockResponse] = await Promise.all([
                    fetch('/api/books/available'),
                    fetch('/api/books/out_of_stock')
                ]);

                if (!availableResponse.ok) {
                    throw new Error('Failed to fetch available books');
                }

                if (!outOfStockResponse.ok) {
                    throw new Error('Failed to fetch out-of-stock books');
                }

                // Get data from both responses
                const availableBooks = await availableResponse.json();
                const outOfStockBooks = await outOfStockResponse.json();

                // Combine both sets of books
                const allBooks = [...availableBooks, ...outOfStockBooks];

                // Extract unique genres from all books
                const genres = [...new Set(allBooks.map(book => book.genre))];
                setAvailableGenres(genres);

                // Group books by genre
                const booksByGenreMap = {};
                genres.forEach(genre => {
                    // Filter books of this genre from both available and out of stock
                    booksByGenreMap[genre] = allBooks.filter(book =>
                        book.genre === genre &&
                        (book.bookStatus === "available" || book.bookStatus === "out_of_stock")
                    );
                });

                setBooksByGenre(booksByGenreMap);

            } catch (err) {
                console.error("Error fetching books:", err);
                setBooksError(err.message);
            } finally {
                setIsLoadingBooks(false);
            }
        };

        fetchAllBooks();
    }, []);

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

                {/* Display available and out-of-stock books by genre */}
                {!isLoadingBooks && !booksError ? (
                    availableGenres.map((genre) => (
                        <BookRow
                            key={genre}
                            title={`${genre}`}
                            books={booksByGenre[genre] || []}
                            isLoading={false}
                            error={null}
                        />
                    ))
                ) : isLoadingBooks ? (
                    <div className="loading-container main-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading book categories...</p>
                    </div>
                ) : (
                    <div className="error-message main-error">
                        <p>Failed to load books. Please try again later.</p>
                        <small>{booksError}</small>
                    </div>
                )}
            </div>
        </main>
    );
};

export default HomeMain;