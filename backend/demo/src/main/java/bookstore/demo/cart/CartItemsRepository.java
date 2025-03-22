package bookstore.demo.cart;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bookstore.demo.book.Book;

@Repository
public interface CartItemsRepository extends JpaRepository<CartItems, Integer> {

    // Find all items in a cart
    List<CartItems> findByCartCartId(Integer cartId);

    // Find a specific item in a cart
    Optional<CartItems> findByCartAndBook(Cart cart, Book book);

    // Delete all items in a cart
    void deleteByCartCartId(Integer cartId);
}
