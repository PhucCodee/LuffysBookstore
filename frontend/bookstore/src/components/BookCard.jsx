import React from 'react';
import PropTypes from 'prop-types';
import formatPrice from '../utils/formatPrice';
import '../styles/BookCard.css'

const BookBadge = ({ status }) => {
    if (!status || status === 'available') return null;

    const badgeText = status === 'upcoming' ? 'Coming Soon' : 'Out of Stock';
    const badgeClass = status === 'upcoming' ? 'book-card__badge--upcoming' : 'book-card__badge--out-of-stock';

    return <div className={`book-card__badge ${badgeClass}`}>{badgeText}</div>;
};

const BookCard = ({ book, hideStatus, onBookClick }) => {
    const handleCardClick = () => {
        if (onBookClick) onBookClick(book);
    };

    const handleKeyDown = (e) => {
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
            <div className="book-card__cover">
                <img
                    className="book-card__cover-image"
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

            <div className="book-card__info">
                <p className="book-card__title" title={book.title}>{book.title}</p>
                <p className="book-card__author" title={book.author}>{book.author}</p>
                <p className="book-card__price">{formatPrice(book.price)}</p>
                <div className="book-card__meta">
                    {book.genre && <span className="book-card__category">{book.genre}</span>}
                </div>
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