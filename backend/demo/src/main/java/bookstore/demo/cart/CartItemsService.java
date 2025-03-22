package bookstore.demo.cart;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bookstore.demo.book.Book;
import bookstore.demo.book.BookRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemsService {

    private final CartRepository cartRepository;
    private final CartItemsRepository cartItemsRepository;
    private final BookRepository bookRepository;

    // Constructor injection
    public CartItemsService(CartRepository cartRepository, CartItemsRepository cartItemsRepository, BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.bookRepository = bookRepository;
    }

    // Get all items in a cart
    public List<CartItems> getCartItemsByCartId(Integer cartId) {
        return cartItemsRepository.findByCartCartId(cartId);
    }

    // Add an item to the cart
    @Transactional
    public CartItems addItemToCart(Integer cartId, Integer bookId, Integer quantity) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        // Check if book is available
        if (book.getBookStatus() != Book.BookStatus.available) {
            throw new IllegalArgumentException("Book is not available");
        }

        // Check if there's enough stock
        if (book.getStock() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }

        // Check if item already exists in cart
        Optional<CartItems> existingItem = cartItemsRepository.findByCartAndBook(cart, book);

        if (existingItem.isPresent()) {
            // Update quantity if item already exists
            CartItems item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;

            if (book.getStock() < newQuantity) {
                throw new IllegalArgumentException("Not enough stock available");
            }

            item.setQuantity(newQuantity);
            return cartItemsRepository.save(item);
        } else {
            // Create new cart item if it doesn't exist
            CartItems newItem = new CartItems(cart, book, quantity);
            return cartItemsRepository.save(newItem);
        }
    }

    // Update cart item quantity
    @Transactional
    public CartItems updateCartItemQuantity(Integer cartId, Integer itemId, Integer quantity) {
        CartItems item = cartItemsRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        // Verify item belongs to the specified cart
        if (!item.getCart().getCartId().equals(cartId)) {
            throw new IllegalArgumentException("Item does not belong to the specified cart");
        }

        // Check if there's enough stock
        if (item.getBook().getStock() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }

        item.setQuantity(quantity);
        return cartItemsRepository.save(item);
    }

    // Remove item from cart
    @Transactional
    public void removeCartItem(Integer cartId, Integer itemId) {
        CartItems item = cartItemsRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        // Verify item belongs to the specified cart
        if (!item.getCart().getCartId().equals(cartId)) {
            throw new IllegalArgumentException("Item does not belong to the specified cart");
        }

        cartItemsRepository.delete(item);
    }

    // Clear cart (remove all items)
    @Transactional
    public void clearCart(Integer cartId) {
        cartItemsRepository.deleteByCartCartId(cartId);
    }
}
