import { useMemo } from "react";
import { useUpcomingBooks, useBooksByGenre } from "./useBooks";
import useAccessibleModal from "./useAccessibleModal";

const useBookPresentation = (mode = "collection", searchProps = {}) => {
    const {
        selectedItem: selectedBook,
        openModal: handleBookClick,
        closeModal,
        modalRef,
        isOpen: isModalOpen,
    } = useAccessibleModal();

    const {
        upcomingBooks,
        isLoading: isLoadingUpcoming,
        error: upcomingError,
    } = useUpcomingBooks();

    const {
        availableGenres,
        booksByGenre,
        isLoading: isLoadingBooks,
        error: booksError,
    } = useBooksByGenre();

    // Generate rows for each genre with at least 3 books
    const genreRows = useMemo(() => {
        if (
            mode !== "collection" ||
            isLoadingBooks ||
            booksError ||
            !availableGenres
        ) {
            return null;
        }

        const nonEmptyGenres = availableGenres.filter(
            (genre) => booksByGenre[genre] && booksByGenre[genre].length > 3
        );

        // Sort genres by number of books
        const sortedGenres = [...nonEmptyGenres].sort((a, b) => {
            const aCount = booksByGenre[a]?.length || 0;
            const bCount = booksByGenre[b]?.length || 0;
            return bCount - aCount;
        });

        return sortedGenres.map((genre) => ({
            key: genre,
            title: genre,
            books: booksByGenre[genre] || [],
            isLoading: false,
            error: null,
        }));
    }, [mode, availableGenres, booksByGenre, isLoadingBooks, booksError]);

    // Search mode processing
    const { books, loading, error, searchQuery, totalCount } = searchProps;

    const content = useMemo(() => {
        if (mode !== "search") return null;

        if (loading) return { type: "loading" };
        if (error) return { type: "error", error };
        if (!books || books.length === 0) return { type: "empty", searchQuery };
        return { type: "results", books, totalCount: totalCount || books.length };
    }, [mode, loading, error, books, searchQuery, totalCount]);

    const headerInfo = useMemo(() => {
        if (mode !== "search") return null;

        return {
            loading,
            error,
            books: books || [],
            searchQuery,
            totalCount: totalCount || (books ? books.length : 0),
        };
    }, [mode, loading, error, books, searchQuery, totalCount]);

    if (mode === "collection") {
        return {
            upcomingBooks,
            isLoadingUpcoming,
            upcomingError,
            genreRows,
            isLoadingBooks,
            booksError,
            selectedBook,
            handleBookClick,
            closeModal,
            modalRef,
            isModalOpen,
        };
    }

    if (mode === "search") {
        return {
            content,
            headerInfo,
            selectedBook,
            isModalOpen,
            handleBookClick,
            handleCloseModal: closeModal,
            modalRef,
        };
    }

    throw new Error(`Unsupported mode: ${mode}`);
};

export default useBookPresentation;