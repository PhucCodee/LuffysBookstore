import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/SearchFilters.css";

const SearchFilters = ({
    sortBy,
    onSortChange,
    filterStatus,
    onStatusChange,
    selectedGenre,
    onGenreChange,
    genres = [],
    isLoading = false,
}) => {
    const [mobileExpanded, setMobileExpanded] = useState(false);

    const handleSortChange = (e) => {
        if (onSortChange) onSortChange(e);
    };

    const handleStatusChange = (e) => {
        if (onStatusChange) onStatusChange(e);
    };

    const handleGenreChange = (e) => {
        if (onGenreChange) {
            const newGenre = e;
            onGenreChange(newGenre === 'all' ? '' : newGenre);
        }
    };

    const toggleMobileFilters = () => {
        setMobileExpanded(!mobileExpanded);
    };

    return (
        <div className="filters">
            <div className="filters__header">
                <div className="filters__count"></div>

                <button
                    className="filters__toggle"
                    onClick={toggleMobileFilters}
                    aria-expanded={mobileExpanded}
                    aria-controls="filter-controls"
                >
                    <span className="filters__toggle-text">Filters & Sort</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`filters__toggle-icon ${mobileExpanded ? "filters__toggle-icon--expanded" : ""}`}
                        aria-hidden="true"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>

            <div
                id="filter-controls"
                className={`filters__controls ${mobileExpanded ? "filters__controls--expanded" : ""}`}
                role="group"
                aria-label="Filter and sort options"
            >
                <div className="filters__group">
                    <label htmlFor="sort-select" className="filters__label">Sort by:</label>
                    <div className="filters__select-wrapper">
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="filters__select"
                            aria-label="Sort results by"
                            disabled={isLoading}
                        >
                            <option value="title">Title (A-Z)</option>
                            <option value="title,desc">Title (Z-A)</option>
                            <option value="price">Price (Low to High)</option>
                            <option value="price,desc">Price (High to Low)</option>
                            <option value="author">Author (A-Z)</option>
                        </select>
                        <div className="filters__select-arrow" aria-hidden="true"></div>
                    </div>
                </div>

                <div className="filters__group">
                    <label htmlFor="status-filter" className="filters__label">Status:</label>
                    <div className="filters__select-wrapper">
                        <select
                            id="status-filter"
                            value={filterStatus}
                            onChange={handleStatusChange}
                            className="filters__select"
                            aria-label="Filter by availability status"
                            disabled={isLoading}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="upcoming">Coming Soon</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                        <div className="filters__select-arrow" aria-hidden="true"></div>
                    </div>
                </div>

                <div className="filters__group">
                    <label htmlFor="genre-filter" className="filters__label">Genre:</label>
                    <div className="filters__select-wrapper">
                        <select
                            id="genre-filter"
                            value={selectedGenre || 'all'}
                            onChange={handleGenreChange}
                            className="filters__select"
                            aria-label="Filter by book genre"
                            disabled={isLoading || !genres.length}
                        >
                            <option value="all">All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                        <div className="filters__select-arrow" aria-hidden="true"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;