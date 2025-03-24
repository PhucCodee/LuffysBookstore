import React from 'react';
import '../styles/BookCard.css'

const BookCard = ({ book, hideStatus, onBookClick }) => {
    return (
        <div className="book-card" onClick={() => onBookClick && onBookClick(book)}>
            <div className="book-cover">
                <img
                    src={book.cover || "/bookcovers/placeholder.jpg"}
                    alt={`${book.title} cover`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/bookcovers/placeholder.jpg";
                    }}
                />
                {!hideStatus && book.bookStatus === "upcoming" && (
                    <div className="book-badge upcoming">Coming Soon</div>
                )}
                {book.bookStatus === "out_of_stock" && (
                    <div className="book-badge out-of-stock">Out of Stock</div>
                )}
            </div>
            <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-price">${parseFloat(book.price).toFixed(2)}</p>
                <span className="book-category">{book.genre}</span>
            </div>
        </div>
    );
};

export default BookCard;