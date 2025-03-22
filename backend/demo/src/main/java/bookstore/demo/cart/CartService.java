package bookstore.demo.cart;

import org.springframework.stereotype.Service;

import bookstore.demo.customer.Customer;
import bookstore.demo.customer.CustomerRepository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemsRepository cartItemsRepository;
    private final CustomerRepository customerRepository;

    // Constructor injection
    public CartService(CartRepository cartRepository, CartItemsRepository cartItemsRepository, CustomerRepository customerRepository) {
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.customerRepository = customerRepository;
    }

    // Get cart by ID
    public Optional<Cart> getCartById(Integer id) {
        return cartRepository.findById(id);
    }

    // Check if cart exists
    public boolean cartExists(Integer id) {
        return cartRepository.existsById(id);
    }

    // Create a new cart for a customer
    public Cart createCart(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        Cart cart = new Cart(customer);
        return cartRepository.save(cart);
    }

    // Get or create a cart for a customer
    public Cart getOrCreateCartForCustomer(Integer customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Find the most recent cart for this customer
        Optional<Cart> existingCart = cartRepository.findTopByCustomerOrderByCreatedAtDesc(customer);

        if (existingCart.isPresent()) {
            return existingCart.get();
        } else {
            // Create a new cart if none exists
            Cart cart = new Cart(customer);
            return cartRepository.save(cart);
        }
    }

    // Get cart summary with total items and price
    public Map<String, Object> getCartSummary(Integer cartId) {
        if (!cartRepository.existsById(cartId)) {
            throw new IllegalArgumentException("Cart not found");
        }

        List<CartItems> items = cartItemsRepository.findByCartCartId(cartId);

        int totalItems = items.stream()
                .mapToInt(CartItems::getQuantity)
                .sum();

        BigDecimal totalPrice = items.stream()
                .map(item -> item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> summary = new HashMap<>();
        summary.put("cartId", cartId);
        summary.put("totalItems", totalItems);
        summary.put("totalPrice", totalPrice);
        summary.put("items", items);

        return summary;
    }
}
