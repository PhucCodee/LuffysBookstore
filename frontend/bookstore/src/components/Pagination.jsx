import React from "react";
import "../styles/Pagination.css";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className = "",
}) => {
    if (totalPages <= 1) {
        return null;
    }

    const maxPagesToShow = siblingCount * 2 + 3;

    const range = (start, end) => {
        const length = end - start + 1;
        return Array.from({ length }, (_, idx) => start + idx);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const goToPreviousPage = () => handlePageChange(currentPage - 1);
    const goToNextPage = () => handlePageChange(currentPage + 1);

    const Dots = () => (
        <span className="pagination-dots" aria-hidden="true">
            &hellip;
        </span>
    );

    const getPaginationRange = () => {
        if (totalPages <= maxPagesToShow) {
            return range(1, totalPages);
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = range(1, leftItemCount);
            return [...leftRange, "RIGHT_DOTS", totalPages];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(totalPages - rightItemCount + 1, totalPages);
            return [1, "LEFT_DOTS", ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [1, "LEFT_DOTS", ...middleRange, "RIGHT_DOTS", totalPages];
        }
    };

    const paginationRange = getPaginationRange();

    return (
        <nav
            className={`pagination-container ${className}`}
            aria-label="Pagination Navigation"
        >
            <div className="pagination">
                {/* Previous Button */}
                <button
                    type="button"
                    className="pagination-btn prev"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    aria-label="Go to previous page"
                >
                    Previous
                </button>

                {/* Page Numbers */}
                <div className="page-numbers" role="list">
                    {paginationRange.map((pageNumber, index) => {
                        if (pageNumber === "LEFT_DOTS" || pageNumber === "RIGHT_DOTS") {
                            return <Dots key={`dots-${index}`} />;
                        }

                        return (
                            <button
                                key={pageNumber}
                                type="button"
                                className={`pagination-btn page-num ${currentPage === pageNumber ? "active" : ""
                                    }`}
                                onClick={() => handlePageChange(pageNumber)}
                                aria-label={`Page ${pageNumber}`}
                                aria-current={currentPage === pageNumber ? "page" : undefined}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                </div>

                {/* Next Button */}
                <button
                    type="button"
                    className="pagination-btn next"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                >
                    Next
                </button>
            </div>

            <div className="pagination-info" aria-live="polite">
                <span className="sr-only">
                    Page {currentPage} of {totalPages}
                </span>
            </div>
        </nav>
    );
};

export default Pagination;
