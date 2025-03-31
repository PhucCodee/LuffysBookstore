const API_BASE_URL = "/api";

// Get all books
export const getAllBooks = async () => {
    const response = await fetch(`${API_BASE_URL}/books`);

    if (!response.ok) {
        throw new Error(`Failed to fetch all books: ${response.status}`);
    }

    return response.json();
};

// Get book by ID
export const getBookById = async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch book details: ${response.status}`);
    }

    return response.json();
};

// Create a new book
export const createBook = async (bookData) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error || `Failed to create book: ${response.status}`
        );
    }

    return response.json();
};

// Update a book
export const updateBook = async (bookId, bookData) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error || `Failed to update book: ${response.status}`
        );
    }

    return response.json();
};

// Delete a book
export const deleteBook = async (bookId) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error(`Failed to delete book: ${response.status}`);
    }

    return true;
};

// Search books with filters
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

        let url = `${API_BASE_URL}/books/search?query=${encodeURIComponent(query)}`;

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
            content: data.content || [],
            totalItems: data.totalItems || 0,
            totalPages: data.totalPages || 1,
        };
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
};

// Get all genres
export const getAllGenres = async () => {
    const response = await fetch(`${API_BASE_URL}/books/genres`);

    if (!response.ok) {
        throw new Error(`Failed to fetch genres: ${response.status}`);
    }

    return response.json();
};

// Get books by genre
export const getBooksByGenre = async (genre) => {
    const response = await fetch(
        `${API_BASE_URL}/books/genre/${encodeURIComponent(genre)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch books by genre: ${response.status}`);
    }

    return response.json();
};

// Get books by author
export const getBooksByAuthor = async (author) => {
    const response = await fetch(
        `${API_BASE_URL}/books/author/${encodeURIComponent(author)}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch books by author: ${response.status}`);
    }

    return response.json();
};

// Update book stock
export const updateBookStock = async (bookId, stockQuantity) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/stock`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: stockQuantity }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error || `Failed to update stock: ${response.status}`
        );
    }

    return response.json();
};

// Update book status
export const updateBookStatus = async (bookId, status) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error || `Failed to update status: ${response.status}`
        );
    }

    return response.json();
};

// Get available books
export const getAvailableBooks = async () => {
    const response = await fetch(`${API_BASE_URL}/books/available`);

    if (!response.ok) {
        throw new Error(`Failed to fetch available books: ${response.status}`);
    }

    return response.json();
};

// Get upcoming books
export const getUpcomingBooks = async () => {
    const response = await fetch(`${API_BASE_URL}/books/upcoming`);

    if (!response.ok) {
        throw new Error(`Failed to fetch upcoming books: ${response.status}`);
    }

    return response.json();
};

// Get out of stock books
export const getOutOfStockBooks = async () => {
    const response = await fetch(`${API_BASE_URL}/books/out_of_stock`);

    if (!response.ok) {
        throw new Error(`Failed to fetch out of stock books: ${response.status}`);
    }

    return response.json();
};
