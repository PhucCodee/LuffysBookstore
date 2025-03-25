package bookstore.demo.book;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Integer id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new book
    @PostMapping
    public ResponseEntity<?> createBook(@RequestBody Book book) {
        try {
            if (bookService.isDuplicateBook(book)) {
                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "This book already exists in the database",
                                "suggestion", "Consider updating the stock instead"));
            }
            Book savedBook = bookService.saveBook(book);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update an existing book
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@PathVariable Integer id, @RequestBody Book book) {
        if (!id.equals(book.getBookId())) {
            return ResponseEntity.badRequest().body(Map.of("error", "ID in path must match ID in body"));
        }

        try {
            Optional<Book> existingBook = bookService.getBookById(id);
            if (existingBook.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Book updatedBook = bookService.updateBook(book);
            return ResponseEntity.ok(updatedBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete book by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Integer id) {
        if (!bookService.bookExists(id)) {
            return ResponseEntity.notFound().build();
        }

        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchBooks(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sort,
            @RequestParam(required = false) String bookStatus,
            @RequestParam(required = false) String genre) {

        try {
            String[] sortParams = sort.split(",");
            String sortField = sortParams[0];
            String direction = sortParams.length > 1 ? sortParams[1] : "asc";

            Map<String, Object> response = bookService.searchBooks(
                    query, page, size, sortField, direction, bookStatus, genre);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error performing search: " + e.getMessage()));
        }
    }

    // Add endpoint to get all available genres
    @GetMapping("/genres")
    public ResponseEntity<List<String>> getAllGenres() {
        List<String> genres = bookService.getAllGenres();
        return ResponseEntity.ok(genres);
    }

    // Get books by genre
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<Book>> getBooksByGenre(@PathVariable String genre) {
        List<Book> books = bookService.getBooksByGenre(genre);
        return ResponseEntity.ok(books);
    }

    // Get books by author
    @GetMapping("/author/{author}")
    public ResponseEntity<List<Book>> getBooksByAuthor(@PathVariable String author) {
        List<Book> books = bookService.getBooksByAuthor(author);
        return ResponseEntity.ok(books);
    }

    // Update book stock
    @PatchMapping("/{id}/stock")
    public ResponseEntity<?> updateBookStock(@PathVariable Integer id, @RequestBody Map<String, Integer> stockUpdate) {
        Integer newStock = stockUpdate.get("stock");

        if (newStock == null || newStock < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valid stock value required"));
        }

        try {
            Book updatedBook = bookService.updateBookStock(id, newStock);
            return ResponseEntity.ok(updatedBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update book status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateBookStatus(@PathVariable Integer id, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");

        if (newStatus == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status value required"));
        }

        try {
            Book.BookStatus bookStatus = Book.BookStatus.valueOf(newStatus);
            Book updatedBook = bookService.updateBookStatus(id, bookStatus);
            return ResponseEntity.ok(updatedBook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status value"));
        }
    }

    // Get available books
    @GetMapping("/available")
    public ResponseEntity<List<Book>> getAvailableBooks() {
        List<Book> books = bookService.getBooksByStatus(Book.BookStatus.available);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Book>> getUpcomingBooks() {
        List<Book> books = bookService.getBooksByStatus(Book.BookStatus.upcoming);
        return ResponseEntity.ok(books);
    }

    @GetMapping("/out_of_stock")
    public ResponseEntity<List<Book>> getOutOfStockBooks() {
        List<Book> books = bookService.getBooksByStatus(Book.BookStatus.out_of_stock);
        return ResponseEntity.ok(books);
    }

}
