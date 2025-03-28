import React from 'react';
import PropTypes from 'prop-types';
import '../styles/BookCover.css';

const BookCover = ({
    book,
    className = '',
    style = {},
    size = 'medium',
    objectFit = null
}) => {
    const coverSrc = book.cover || book.coverImageUrl || "/bookcovers/placeholder.jpg";
    const sizeClass = `book-cover--${size}`;

    const imageStyle = objectFit ? { objectFit } : {};

    return (
        <div className={`book-cover ${sizeClass} ${className}`} style={style}>
            <img
                className="book-cover__image"
                src={coverSrc}
                alt={`Cover of ${book.title}`}
                style={imageStyle}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/bookcovers/placeholder.jpg";
                }}
                loading="lazy"
            />
        </div>
    );
};

BookCover.propTypes = {
    book: PropTypes.shape({
        title: PropTypes.string.isRequired,
        cover: PropTypes.string,
        coverImageUrl: PropTypes.string
    }).isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'custom']),
    objectFit: PropTypes.oneOf(['contain', 'cover', 'fill', 'none', 'scale-down'])
};

export default BookCover;