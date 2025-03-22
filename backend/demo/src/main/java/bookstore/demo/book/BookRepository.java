package bookstore.demo.book;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    // Find books by title (case insensitive, partial match)
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Find books by genre (case insensitive, exact match)
    List<Book> findByGenreIgnoreCase(String genre);

    // Find books by author (case insensitive, partial match)
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // Find books by status
    List<Book> findByBookStatus(Book.BookStatus status);
}
