import { useState, useEffect } from 'react';

const useUpcomingBooks = () => {
    const [upcomingBooks, setUpcomingBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                console.error('Error fetching upcoming books:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUpcomingBooks();
    }, []);

    return { upcomingBooks, isLoading, error };
};

export default useUpcomingBooks;