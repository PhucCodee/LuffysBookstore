import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import SearchMain from '../components/SearchMain';

const BookSearchPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

    const handleSearchSubmit = (query) => {
        navigate(`/search?query=${encodeURIComponent(query)}`);
    };

    return (
        <div className="book-search-page">
            <NavBar onSearch={handleSearchSubmit} />
            <SearchMain searchQuery={searchQuery} />
        </div>
    );
};

export default BookSearchPage;