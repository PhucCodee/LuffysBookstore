import { useState, useEffect, useCallback, useRef } from "react";
import * as bookService from "../services/bookService";

const createBooksStore = () => {
    const store = {
        state: {
            upcoming: { data: [], loading: false, error: null, timestamp: 0 },
            genres: { data: [], loading: false, error: null, timestamp: 0 },
            booksByGenre: {
                books: {},
                loading: false,
                error: null,
                timestamp: 0,
            },
            search: {
                results: [],
                totalCount: 0,
                totalPages: 0,
                loading: false,
                error: null,
                query: null,
            },
        },
        listeners: new Set(),

        updateState(section, updates) {
            this.state = {
                ...this.state,
                [section]: {
                    ...this.state[section],
                    ...updates,
                    ...(section !== "search" ? { timestamp: Date.now() } : {}),
                },
            };

            this.notifyListeners();
        },

        notifyListeners() {
            this.listeners.forEach((listener) => listener(this.state));
        },

        subscribe(listener) {
            this.listeners.add(listener);
            return () => this.listeners.delete(listener);
        },
    };

    return store;
};

const booksStore = createBooksStore();

export const useBooks = () => {
    const [state, setState] = useState(booksStore.state);
    const staleTimeout = 5 * 60 * 1000;

    useEffect(() => {
        const unsubscribe = booksStore.subscribe(setState);
        return unsubscribe;
    }, []);

    const isStale = useCallback(
        (section) => {
            return Date.now() - state[section].timestamp > staleTimeout;
        },
        [state]
    );

    const fetchAllGenres = useCallback(
        async (force = false) => {
            if (!force && !isStale("genres") && state.genres.data.length > 0) {
                return state.genres.data;
            }

            booksStore.updateState("genres", { loading: true, error: null });

            try {
                // Use the dedicated API endpoint
                const genres = await bookService.getAllGenres();
                booksStore.updateState("genres", { data: genres, loading: false });
                return genres;
            } catch (err) {
                console.error("Error fetching genres:", err);
                booksStore.updateState("genres", {
                    loading: false,
                    error: err.message,
                });
                return [];
            }
        },
        [isStale, state.genres.data]
    );

    const fetchUpcomingBooks = useCallback(
        async (force = false) => {
            if (!force && !isStale("upcoming") && state.upcoming.data.length > 0) {
                return state.upcoming.data;
            }

            booksStore.updateState("upcoming", { loading: true, error: null });

            try {
                const books = await bookService.getUpcomingBooks();
                booksStore.updateState("upcoming", { data: books, loading: false });
                return books;
            } catch (err) {
                console.error("Error fetching upcoming books:", err);
                booksStore.updateState("upcoming", {
                    loading: false,
                    error: err.message,
                });
                return [];
            }
        },
        [isStale, state.upcoming.data]
    );

    const fetchBooksByGenre = useCallback(
        async (force = false) => {
            // Only fetch books if we have genres and the data is stale or forced
            if (
                !force &&
                !isStale("booksByGenre") &&
                Object.keys(state.booksByGenre.books).length > 0
            ) {
                return {
                    genres: state.genres.data,
                    books: state.booksByGenre.books,
                };
            }

            const genres = await fetchAllGenres();
            if (!genres.length) {
                return { genres: [], books: {} };
            }

            booksStore.updateState("booksByGenre", { loading: true, error: null });

            try {
                const [availableBooks, outOfStockBooks] = await Promise.all([
                    bookService.getAvailableBooks(),
                    bookService.getOutOfStockBooks(),
                ]);

                const allBooks = [...availableBooks, ...outOfStockBooks];
                const booksByGenreMap = {};

                genres.forEach((genre) => {
                    booksByGenreMap[genre] = allBooks.filter(
                        (book) =>
                            book.genre === genre &&
                            (book.bookStatus === "available" ||
                                book.bookStatus === "out_of_stock")
                    );
                });

                booksStore.updateState("booksByGenre", {
                    books: booksByGenreMap,
                    loading: false,
                });

                return { genres, books: booksByGenreMap };
            } catch (err) {
                console.error("Error fetching books by genre:", err);
                booksStore.updateState("booksByGenre", {
                    loading: false,
                    error: err.message,
                });
                return { genres, books: {} };
            }
        },
        [isStale, state.booksByGenre.books, state.genres.data, fetchAllGenres]
    );

    const searchBooks = useCallback(async (query, page = 1, options = {}) => {
        if (!query) {
            booksStore.updateState("search", {
                results: [],
                totalCount: 0,
                totalPages: 0,
                query: null,
            });
            return { results: [], totalCount: 0 };
        }

        const searchOptions = {
            limit: 20,
            ...options,
        };

        booksStore.updateState("search", {
            loading: true,
            error: null,
            query,
        });

        try {
            const response = await bookService.searchBooks(
                query,
                page,
                searchOptions
            );
            booksStore.updateState("search", {
                content: response.content || [],
                totalItems: response.totalItems || 0,
                totalPages: response.totalPages || 1,
                loading: false,
                query,
            });
            return response;
        } catch (err) {
            console.error("Error searching books:", err);
            booksStore.updateState("search", {
                loading: false,
                error: err.message,
            });
            return { results: [], totalCount: 0 };
        }
    }, []);

    return {
        // Genres data
        allGenres: state.genres.data,
        isLoadingGenres: state.genres.loading,
        genresError: state.genres.error,
        fetchAllGenres,

        // Upcoming books data
        upcomingBooks: state.upcoming.data,
        isLoadingUpcoming: state.upcoming.loading,
        upcomingError: state.upcoming.error,
        fetchUpcomingBooks,

        // Books by genre data
        booksByGenre: state.booksByGenre.books,
        isLoadingBooksByGenre: state.booksByGenre.loading,
        booksByGenreError: state.booksByGenre.error,
        fetchBooksByGenre,

        // Search data
        searchResults: state.search.content,
        searchTotalCount: state.search.totalItems,
        searchTotalPages: state.search.totalPages,
        isSearching: state.search.loading,
        searchError: state.search.error,
        searchBooks,

        refetchAll: useCallback(() => {
            fetchAllGenres(true);
            fetchUpcomingBooks(true);
            fetchBooksByGenre(true);
        }, [fetchAllGenres, fetchUpcomingBooks, fetchBooksByGenre]),
    };
};

export const useGenres = () => {
    const { allGenres, isLoadingGenres, genresError, fetchAllGenres } =
        useBooks();

    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            fetchAllGenres();
            initialized.current = true;
        }
    }, [fetchAllGenres]);

    return {
        genres: allGenres,
        isLoading: isLoadingGenres,
        error: genresError,
        refetch: fetchAllGenres,
    };
};

export const useUpcomingBooks = () => {
    const {
        upcomingBooks,
        isLoadingUpcoming,
        upcomingError,
        fetchUpcomingBooks,
    } = useBooks();

    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            fetchUpcomingBooks();
            initialized.current = true;
        }
    }, [fetchUpcomingBooks]);

    return {
        upcomingBooks,
        isLoading: isLoadingUpcoming,
        error: upcomingError,
        refetch: fetchUpcomingBooks,
    };
};

export const useBooksByGenre = () => {
    const {
        allGenres,
        booksByGenre,
        isLoadingBooksByGenre,
        booksByGenreError,
        fetchBooksByGenre,
    } = useBooks();

    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
            fetchBooksByGenre();
            initialized.current = true;
        }
    }, [fetchBooksByGenre]);

    return {
        availableGenres: allGenres,
        booksByGenre,
        isLoading: isLoadingBooksByGenre,
        error: booksByGenreError,
        refetch: fetchBooksByGenre,
    };
};

export const useBookSearch = () => {
    const {
        searchResults,
        searchTotalCount,
        searchTotalPages,
        isSearching,
        searchError,
        searchBooks,
    } = useBooks();

    return {
        searchResults,
        totalCount: searchTotalCount,
        totalPages: searchTotalPages,
        isLoading: isSearching,
        error: searchError,
        searchBooks,
    };
};
