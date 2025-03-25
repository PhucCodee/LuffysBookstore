import React from 'react';
import PropTypes from 'prop-types';
import '../styles/BookCard.css'

const formatPrice = (price) => {
    return typeof price === 'number'
        ? `$${price.toFixed(2)}`
        : `$${parseFloat(price || 0).toFixed(2)}`;
};

const BookBadge = ({ status }) => {
    if (!status || status === 'available') return null;

    const badgeText = status === 'upcoming' ? 'Coming Soon' : 'Out of Stock';
    const badgeClass = status === 'upcoming' ? 'upcoming' : 'out-of-stock';

    return <div className={`book-badge ${badgeClass}`}>{badgeText}</div>;
};

const BookCard = ({ book, hideStatus, onBookClick }) => {
    const handleCardClick = () => {
        if (onBookClick) onBookClick(book);
    };

    const handleKeyDown = (e) => {
        // Allow activation with Enter or Space key
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            className="book-card"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`View details for ${book.title} by ${book.author}`}
        >
            <div className="book-cover">
                <img
                    src={book.cover || "/bookcovers/placeholder.jpg"}
                    alt={`${book.title} book cover`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/bookcovers/placeholder.jpg";
                    }}
                    loading="lazy"
                />
                {!hideStatus && <BookBadge status={book.bookStatus} />}
            </div>

            <div className="book-info">
                <h3 className="book-title" title={book.title}>{book.title}</h3>
                <p className="book-author" title={book.author}>{book.author}</p>
                <p className="book-price">{formatPrice(book.price)}</p>
                {book.genre && <span className="book-category">{book.genre}</span>}
            </div>
        </div>
    );
};

BookCard.propTypes = {
    book: PropTypes.shape({
        bookId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        cover: PropTypes.string,
        bookStatus: PropTypes.string,
        genre: PropTypes.string
    }).isRequired,
    hideStatus: PropTypes.bool,
    onBookClick: PropTypes.func
};

BookCard.defaultProps = {
    hideStatus: false
};

export default BookCard;