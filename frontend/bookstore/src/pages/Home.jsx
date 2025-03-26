import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import HomeMain from '../components/HomeMain';

const HomePage = () => {
    const navigate = useNavigate();

    const handleSearchSubmit = (query) => {
        navigate(`/search?query=${encodeURIComponent(query)}`);
    };

    return (
        <div className="home-page">
            <NavBar onSearch={handleSearchSubmit} />
            <HomeMain />
        </div>
    );
};

export default HomePage;