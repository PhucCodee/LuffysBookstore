import React from "react";
import BookRow from "./BookRow";
import useBookPresentation from "../hooks/useBookPresentation";
import useContentRenderer from "../hooks/useContentRenderer";
import BookDetailsModal from "./BookDetailsModal";
import "../styles/HomeMain.css";

const HomeMain = () => {
    const {
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
    } = useBookPresentation("collection");

    const { renderContent } = useContentRenderer();

    // Render the genre rows
    const renderedGenreRows = renderContent({
        isLoading: isLoadingBooks,
        error: booksError,
        content: genreRows?.map((row) => (
            <BookRow
                key={row.key}
                title={row.title}
                books={row.books}
                isLoading={row.isLoading}
                error={row.error}
                onBookClick={handleBookClick}
            />
        )),
        loadingMessage: "Loading book categories...",
        errorMessage: "Failed to load books. Please try again later.",
    });

    return (
        <main className="home">
            <div className="home__banner" role="banner">
                <h1 className="home__title">Welcome to Luffy's Bookstore</h1>
                <p className="home__subtitle">Discover your next favorite read</p>
            </div>

            <div className="home__content">
                {/* Coming Soon section */}
                <section className="home__section" aria-labelledby="upcoming-books-title">
                    <BookRow
                        title="Coming Soon"
                        books={upcomingBooks}
                        isLoading={isLoadingUpcoming}
                        error={upcomingError}
                        hideStatus={true}
                        onBookClick={handleBookClick}
                    />
                </section>

                {/* Genre-based book sections */}
                {renderedGenreRows}
            </div>

            {/* Book details modal */}
            {selectedBook && (
                <BookDetailsModal
                    book={selectedBook}
                    onClose={closeModal}
                    modalRef={modalRef}
                />
            )}
        </main>
    );
};

export default HomeMain;