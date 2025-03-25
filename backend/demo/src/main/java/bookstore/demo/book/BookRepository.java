package bookstore.demo.book;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer>, JpaSpecificationExecutor<Book> {

    // Find books by title (case insensitive, partial match)
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Find books by genre (case insensitive, exact match)
    List<Book> findByGenreIgnoreCase(String genre);

    // Find books by author (case insensitive, partial match)
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // Find books by status
    List<Book> findByBookStatus(Book.BookStatus status);

    boolean existsByTitleAndAuthorIgnoreCase(String title, String author);

    Optional<Book> findByTitleAndAuthorIgnoreCase(String title, String author);

    // Get distinct genres for dropdown filter
    @Query("SELECT DISTINCT b.genre FROM Book b ORDER BY b.genre")
    List<String> findDistinctGenres();
}
