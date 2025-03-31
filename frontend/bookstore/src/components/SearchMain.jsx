import React, { useState, useEffect } from "react";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResults";
import Pagination from "./Pagination";
import { useGenres, useBookSearch } from "../hooks/useBooks";
import "../styles/SearchMain.css";

const SearchMain = ({ searchQuery }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("title");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedGenre, setSelectedGenre] = useState("");
    const { genres, isLoading: isLoadingGenres } = useGenres();
    const {
        searchResults,
        totalCount,
        isLoading,
        error,
        searchBooks,
        totalPages,
    } = useBookSearch();

    useEffect(() => {
        if (!searchQuery) return;
        console.log("🔍 Search query:", searchQuery);

        const timeoutId = setTimeout(() => {
            console.log("🔍 Executing search with params:", {
                query: searchQuery,
                page: currentPage,
                sortBy,
                status: filterStatus,
                genre: selectedGenre,
            });

            searchBooks(searchQuery, currentPage, {
                sortBy,
                status: filterStatus,
                genre: selectedGenre,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [
        searchQuery,
        currentPage,
        sortBy,
        filterStatus,
        selectedGenre,
        searchBooks,
    ]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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

    return (
        <main className="search">
            <div className="search__container">
                <SearchFilters
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    filterStatus={filterStatus}
                    onStatusChange={handleStatusFilterChange}
                    selectedGenre={selectedGenre}
                    onGenreChange={handleGenreFilterChange}
                    genres={genres || []}
                    isLoading={isLoading || isLoadingGenres}
                    resultsCount={totalCount}
                />

                <SearchResults
                    books={searchResults}
                    loading={isLoading}
                    error={error}
                    searchQuery={searchQuery}
                    totalCount={totalCount}
                />

                {searchResults?.length > 0 && totalPages > 1 && (
                    <div className="search__pagination">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </main>
    );
};

export default SearchMain;
