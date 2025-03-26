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
        if (onGenreChange) onGenreChange(e);
    };

    const toggleMobileFilters = () => {
        setMobileExpanded(!mobileExpanded);
    };

    return (
        <div className="search-filters-wrapper">
            <div className="search-filters-header">
                <div className="results-count"></div>

                <button
                    className="mobile-toggle-filters"
                    onClick={toggleMobileFilters}
                    aria-expanded={mobileExpanded}
                    aria-controls="filter-controls"
                >
                    <span>Filters & Sort</span>
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
                        className={`filter-toggle-icon ${mobileExpanded ? "expanded" : ""}`}
                        aria-hidden="true"
                    >
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
            </div>

            <div
                id="filter-controls"
                className={`search-filters ${mobileExpanded ? "expanded" : ""}`}
                role="group"
                aria-label="Filter and sort options"
            >
                <div className="filter-group">
                    <label htmlFor="sort-select">Sort by:</label>
                    <div className="select-wrapper">
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="filter-select"
                            aria-label="Sort results by"
                            disabled={isLoading}
                        >
                            <option value="title">Title (A-Z)</option>
                            <option value="title,desc">Title (Z-A)</option>
                            <option value="price">Price (Low to High)</option>
                            <option value="price,desc">Price (High to Low)</option>
                            <option value="author">Author (A-Z)</option>
                        </select>
                        <div className="select-arrow" aria-hidden="true"></div>
                    </div>
                </div>

                <div className="filter-group">
                    <label htmlFor="status-filter">Status:</label>
                    <div className="select-wrapper">
                        <select
                            id="status-filter"
                            value={filterStatus}
                            onChange={handleStatusChange}
                            className="filter-select"
                            aria-label="Filter by availability status"
                            disabled={isLoading}
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="upcoming">Coming Soon</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                        <div className="select-arrow" aria-hidden="true"></div>
                    </div>
                </div>

                <div className="filter-group">
                    <label htmlFor="genre-filter">Genre:</label>
                    <div className="select-wrapper">
                        <select
                            id="genre-filter"
                            value={selectedGenre}
                            onChange={handleGenreChange}
                            className="filter-select"
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
                        <div className="select-arrow" aria-hidden="true"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

SearchFilters.propTypes = {
    sortBy: PropTypes.string.isRequired,
    onSortChange: PropTypes.func.isRequired,
    filterStatus: PropTypes.string.isRequired,
    onStatusChange: PropTypes.func.isRequired,
    selectedGenre: PropTypes.string.isRequired,
    onGenreChange: PropTypes.func.isRequired,
    genres: PropTypes.array,
    resultsCount: PropTypes.number,
    isLoading: PropTypes.bool,
};

SearchFilters.defaultProps = {
    genres: [],
    resultsCount: 0,
    isLoading: false,
};

export default SearchFilters;
