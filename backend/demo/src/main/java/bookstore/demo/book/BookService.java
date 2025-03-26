package bookstore.demo.book;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Get all books
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Find a book by ID
    public Optional<Book> getBookById(Integer id) {
        return bookRepository.findById(id);
    }

    public Optional<Book> getBookByTitleAndAuthor(String title, String author) {
        return bookRepository.findByTitleAndAuthorIgnoreCase(title, author);
    }

    public boolean isDuplicateBook(Book book) {
        return bookRepository.existsByTitleAndAuthorIgnoreCase(book.getTitle(), book.getAuthor());
    }

    // Save a new book
    public Book saveBook(Book book) {
        // Basic validation
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title cannot be empty");
        }
        if (book.getPrice() == null || book.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Book price must be non-negative");
        }
        if (book.getStock() == null || book.getStock() < 0) {
            throw new IllegalArgumentException("Book stock must be non-negative");
        }

        return bookRepository.save(book);
    }

    // Update an existing book
    public Book updateBook(Book book) {
        // Basic validation
        if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Book title cannot be empty");
        }
        if (book.getPrice() == null || book.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Book price must be non-negative");
        }
        if (book.getStock() == null || book.getStock() < 0) {
            throw new IllegalArgumentException("Book stock must be non-negative");
        }

        return bookRepository.save(book);
    }

    // Check if book exists by ID
    public boolean bookExists(Integer id) {
        return bookRepository.existsById(id);
    }

    // Delete book by ID
    public void deleteBook(Integer id) {
        bookRepository.deleteById(id);
    }

    // Search books by title (partial match)
    public List<Book> searchBooksByTitle(String query) {
        return bookRepository.findByTitleContainingIgnoreCase(query);
    }

    // Get books by genre
    public List<Book> getBooksByGenre(String genre) {
        return bookRepository.findByGenreIgnoreCase(genre);
    }

    // Get books by author
    public List<Book> getBooksByAuthor(String author) {
        return bookRepository.findByAuthorContainingIgnoreCase(author);
    }

    // Update book stock
    public Book updateBookStock(Integer id, Integer newStock) {
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        book.setStock(newStock);

        // Auto-update status based on stock level
        if (newStock == 0) {
            book.setBookStatus(Book.BookStatus.out_of_stock);
        } else if (book.getBookStatus() == Book.BookStatus.out_of_stock) {
            book.setBookStatus(Book.BookStatus.available);
        }

        return bookRepository.save(book);
    }

    // Update book status
    public Book updateBookStatus(Integer id, Book.BookStatus status) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (status == Book.BookStatus.available && book.getStock() == 0) {
            throw new IllegalArgumentException("Cannot set status to available when stock is 0");
        }

        book.setBookStatus(status);
        return bookRepository.save(book);
    }

    // Get books by status
    public List<Book> getBooksByStatus(Book.BookStatus status) {
        return bookRepository.findByBookStatus(status);
    }

    public Map<String, Object> searchBooks(
            String query, int page, int size, String sortField,
            String direction, String bookStatus, String genre) {

        try {
            Sort.Direction sortDirection = direction.equalsIgnoreCase("desc")
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            Sort sort = Sort.by(sortDirection, sortField);
            PageRequest pageable = PageRequest.of(page, size, sort);

            Specification<Book> spec = Specification.where(null);

            if (query != null && !query.trim().isEmpty()) {
                String searchTerm = "%" + query.toLowerCase() + "%";
                spec = spec.and((root, criteriaQuery, criteriaBuilder)
                        -> criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), searchTerm),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("author")), searchTerm)
                        )
                );
            }

            if (bookStatus != null && !bookStatus.isEmpty() && !bookStatus.equalsIgnoreCase("all")) {
                Book.BookStatus status;
                try {
                    status = Book.BookStatus.valueOf(bookStatus);
                    spec = spec.and((root, criteriaQuery, criteriaBuilder)
                            -> criteriaBuilder.equal(root.get("bookStatus"), status)
                    );
                } catch (IllegalArgumentException e) {
                    // Ignore invalid status
                }
            }

            if (genre != null && !genre.isEmpty() && !genre.equalsIgnoreCase("all")) {
                spec = spec.and((root, criteriaQuery, criteriaBuilder)
                        -> criteriaBuilder.equal(root.get("genre"), genre)
                );
            }

            Page<Book> booksPage = bookRepository.findAll(spec, pageable);

            Map<String, Object> result = new HashMap<>();
            result.put("content", booksPage.getContent());
            result.put("currentPage", booksPage.getNumber());
            result.put("totalItems", booksPage.getTotalElements());
            result.put("totalPages", booksPage.getTotalPages());

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error searching books: " + e.getMessage(), e);
        }
    }

    public List<String> getAllGenres() {
        return bookRepository.findDistinctGenres();
    }
}
