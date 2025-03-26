const API_BASE_URL = "/api";

export const getAvailableBooks = async () => {
    const response = await fetch(`${API_BASE_URL}/books/available`);

    if (!response.ok) {
        throw new Error(`Failed to fetch available books: ${response.status}`);
    }

    return response.json();
};

export const getOutOfStockBooks = async () => {
    const response = await fetch(`${API_BASE_URL}/books/out_of_stock`);

    if (!response.ok) {
        throw new Error(`Failed to fetch out of stock books: ${response.status}`);
    }

    return response.json();
};

export const getUpcomingBooks = async () => {
    const response = await fetch(`${API_BASE_URL}/books/upcoming`);

    if (!response.ok) {
        throw new Error(`Failed to fetch upcoming books: ${response.status}`);
    }

    return response.json();
};

export const searchBooks = async (query, page = 1, options = {}) => {
    if (!query || query.trim() === "") {
        return {
            results: [],
            totalCount: 0,
            totalPages: 0,
        };
    }

    try {
        const { sortBy = "title", status = "all", genre = "all" } = options;

        let url = `/api/books/search?query=${encodeURIComponent(query)}`;

        url += `&page=${page - 1}&size=20`;
        url += `&sort=${sortBy}`;

        if (status !== "all") {
            url += `&bookStatus=${status}`;
        }

        if (genre !== "all") {
            url += `&genre=${encodeURIComponent(genre)}`;
        }

        console.log(`Searching with URL: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        return {
            results: data.content || [],
            totalCount: data.totalElements || 0,
            totalPages: data.totalPages || 1,
        };
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};

export const getBookById = async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch book details: ${response.status}`);
    }

    return response.json();
};
