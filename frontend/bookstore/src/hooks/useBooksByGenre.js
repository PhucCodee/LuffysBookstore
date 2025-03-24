import { useState, useEffect } from 'react';

const useBooksByGenre = () => {
    const [availableGenres, setAvailableGenres] = useState([]);
    const [booksByGenre, setBooksByGenre] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllBooks = async () => {
            try {
                setIsLoading(true);

                // Fetch both available and out-of-stock books
                const [availableResponse, outOfStockResponse] = await Promise.all([
                    fetch('/api/books/available'),
                    fetch('/api/books/out_of_stock'),
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
                const genres = [...new Set(allBooks.map((book) => book.genre))];
                setAvailableGenres(genres);

                // Group books by genre
                const booksByGenreMap = {};
                genres.forEach((genre) => {
                    // Filter books of this genre from both available and out of stock
                    booksByGenreMap[genre] = allBooks.filter(
                        (book) =>
                            book.genre === genre &&
                            (book.bookStatus === 'available' ||
                                book.bookStatus === 'out_of_stock')
                    );
                });

                setBooksByGenre(booksByGenreMap);
            } catch (err) {
                console.error('Error fetching books:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllBooks();
    }, []);

    return { availableGenres, booksByGenre, isLoading, error };
};

export default useBooksByGenre;