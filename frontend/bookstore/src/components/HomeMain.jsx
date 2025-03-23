import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/HomeMain.css";

const BookCard = ({ book, hideStatus }) => {
    // BookCard component unchanged
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
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // Function to scroll the container left or right
    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount =
                container.querySelector(".book-card")?.offsetWidth + 20 || 200;

            if (direction === "left") {
                container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    // Check scroll position to determine if arrows should be shown
    const checkScrollPosition = () => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;

            // Show left arrow if we've scrolled to the right
            setShowLeftArrow(container.scrollLeft > 0);

            // Show right arrow if we can scroll more to the right
            setShowRightArrow(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 5 // 5px tolerance
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
                            <BookCard key={book.bookId} book={book} hideStatus={hideStatus} />
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
                const response = await fetch("/api/books/upcoming");

                if (!response.ok) {
                    throw new Error("Failed to fetch upcoming books");
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
                    fetch("/api/books/available"),
                    fetch("/api/books/out_of_stock"),
                ]);

                if (!availableResponse.ok) {
                    throw new Error("Failed to fetch available books");
                }

                if (!outOfStockResponse.ok) {
                    throw new Error("Failed to fetch out-of-stock books");
                }

                // Get data from both responses
                const availableBooks = await availableResponse.json();
                const outOfStockBooks = await outOfStockResponse.json();

                // Combine both sets of books
                const allBooks = [...availableBooks, ...outOfStockBooks];

                // Extract unique genres from all books
                const genres = [...new Set(allBooks.map((book) => book.genre))];
                setAvailableGenres(genres);

                // Group books by genre
                const booksByGenreMap = {};
                genres.forEach((genre) => {
                    // Filter books of this genre from both available and out of stock
                    booksByGenreMap[genre] = allBooks.filter(
                        (book) =>
                            book.genre === genre &&
                            (book.bookStatus === "available" ||
                                book.bookStatus === "out_of_stock")
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
