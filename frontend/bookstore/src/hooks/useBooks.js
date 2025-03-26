import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import * as bookService from "../services/bookService";

const createBooksStore = () => {
    const store = {
        state: {
            upcoming: { data: [], loading: false, error: null, timestamp: 0 },
            byGenre: {
                genres: [],
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
            if (
                !force &&
                !isStale("byGenre") &&
                state.byGenre.genres.length > 0 &&
                Object.keys(state.byGenre.books).length > 0
            ) {
                return {
                    genres: state.byGenre.genres,
                    books: state.byGenre.books,
                };
            }

            booksStore.updateState("byGenre", { loading: true, error: null });

            try {
                const [availableBooks, outOfStockBooks] = await Promise.all([
                    bookService.getAvailableBooks(),
                    bookService.getOutOfStockBooks(),
                ]);

                const allBooks = [...availableBooks, ...outOfStockBooks];
                const genres = [...new Set(allBooks.map((book) => book.genre))]
                    .filter(Boolean)
                    .sort();

                const booksByGenreMap = {};
                genres.forEach((genre) => {
                    booksByGenreMap[genre] = allBooks.filter(
                        (book) =>
                            book.genre === genre &&
                            (book.bookStatus === "available" ||
                                book.bookStatus === "out_of_stock")
                    );
                });

                booksStore.updateState("byGenre", {
                    genres,
                    books: booksByGenreMap,
                    loading: false,
                });

                return { genres, books: booksByGenreMap };
            } catch (err) {
                console.error("Error fetching books by genre:", err);
                booksStore.updateState("byGenre", {
                    loading: false,
                    error: err.message,
                });
                return { genres: [], books: {} };
            }
        },
        [isStale, state.byGenre.genres, state.byGenre.books]
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
                results: response.results || [],
                totalCount: response.totalCount || 0,
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
        upcomingBooks: state.upcoming.data,
        isLoadingUpcoming: state.upcoming.loading,
        upcomingError: state.upcoming.error,
        fetchUpcomingBooks,

        availableGenres: state.byGenre.genres,
        booksByGenre: state.byGenre.books,
        isLoadingByGenre: state.byGenre.loading,
        byGenreError: state.byGenre.error,
        fetchBooksByGenre,

        searchResults: state.search.results,
        searchTotalCount: state.search.totalCount,
        searchTotalPages: state.search.totalPages,
        isSearching: state.search.loading,
        searchError: state.search.error,
        searchBooks,

        refetchAll: useCallback(() => {
            fetchUpcomingBooks(true);
            fetchBooksByGenre(true);
        }, [fetchUpcomingBooks, fetchBooksByGenre]),
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
        availableGenres,
        booksByGenre,
        isLoadingByGenre,
        byGenreError,
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
        availableGenres,
        booksByGenre,
        isLoading: isLoadingByGenre,
        error: byGenreError,
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
