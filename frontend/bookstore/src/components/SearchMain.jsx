import React, { useState, useEffect, useCallback } from 'react';
import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';
import Pagination from './Pagination';
import '../styles/SearchMain.css';

const SearchMain = ({ searchQuery }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('title');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedGenre, setSelectedGenre] = useState('all');

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [genres, setGenres] = useState([]);
    const [genreError, setGenreError] = useState(null);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const fetchGenres = useCallback(async () => {
        try {
            setGenreError(null);
            const response = await fetch('/api/books/genres');
            if (!response.ok) {
                throw new Error(`Failed to fetch genres: ${response.status}`);
            }
            const data = await response.json();
            setGenres(data || []);
        } catch (err) {
            console.error('Failed to fetch genres:', err);
            setGenreError('Failed to load genre filters');
        }
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            setError(null);

            try {
                const statusParam = filterStatus !== 'all' ? `&bookStatus=${filterStatus}` : '';
                const genreParam = selectedGenre !== 'all' ? `&genre=${encodeURIComponent(selectedGenre)}` : '';
                const url = `/api/books/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage - 1}&size=20&sort=${sortBy}${statusParam}${genreParam}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                setBooks(data.content || []);
                setTotalPages(data.totalPages || 1);
                setTotalResults(data.totalElements || 0);

                if (genres.length === 0) {
                    fetchGenres();
                }
            } catch (err) {
                console.error('Error fetching books:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchBooks();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentPage, sortBy, filterStatus, selectedGenre, genres.length, fetchGenres]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (e) => {
        setFilterStatus(e.target.value);
        setCurrentPage(1);
    };

    const handleGenreFilterChange = (e) => {
        setSelectedGenre(e.target.value);
        setCurrentPage(1);
    };

    // Handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="search-main">
            <div className="container">
                <SearchFilters
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    filterStatus={filterStatus}
                    onStatusChange={handleStatusFilterChange}
                    selectedGenre={selectedGenre}
                    onGenreChange={handleGenreFilterChange}
                    genres={genres}
                    isLoading={loading}
                    resultsCount={totalResults}
                />

                <SearchResults
                    books={books}
                    loading={loading}
                    error={error}
                    searchQuery={searchQuery}
                />

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </main>
    );
};

export default SearchMain;