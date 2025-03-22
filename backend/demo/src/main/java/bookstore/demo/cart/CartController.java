package bookstore.demo.cart;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;
    private final CartItemsService cartItemsService;

    public CartController(CartService cartService, CartItemsService cartItemsService) {
        this.cartService = cartService;
        this.cartItemsService = cartItemsService;
    }

    // Get cart by ID
    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartById(@PathVariable Integer id) {
        return cartService.getCartById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get customer's active cart
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCartByCustomerId(@PathVariable Integer customerId) {
        try {
            Cart cart = cartService.getOrCreateCartForCustomer(customerId);
            return ResponseEntity.ok(cart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Create a new cart for a customer
    @PostMapping
    public ResponseEntity<?> createCart(@RequestBody Map<String, Integer> request) {
        Integer customerId = request.get("customerId");
        if (customerId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Customer ID is required"));
        }

        try {
            Cart newCart = cartService.createCart(customerId);
            return ResponseEntity.status(HttpStatus.CREATED).body(newCart);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get cart items
    @GetMapping("/{cartId}/items")
    public ResponseEntity<List<CartItems>> getCartItems(@PathVariable Integer cartId) {
        if (!cartService.cartExists(cartId)) {
            return ResponseEntity.notFound().build();
        }

        List<CartItems> items = cartItemsService.getCartItemsByCartId(cartId);
        return ResponseEntity.ok(items);
    }

    // Add item to cart
    @PostMapping("/{cartId}/items")
    public ResponseEntity<?> addItemToCart(
            @PathVariable Integer cartId,
            @RequestBody Map<String, Integer> request) {

        Integer bookId = request.get("bookId");
        Integer quantity = request.get("quantity");

        if (bookId == null || quantity == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Book ID and quantity are required"));
        }

        if (quantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Quantity must be greater than 0"));
        }

        try {
            CartItems cartItem = cartItemsService.addItemToCart(cartId, bookId, quantity);
            return ResponseEntity.status(HttpStatus.CREATED).body(cartItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update cart item quantity
    @PutMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<?> updateCartItemQuantity(
            @PathVariable Integer cartId,
            @PathVariable Integer itemId,
            @RequestBody Map<String, Integer> request) {

        Integer quantity = request.get("quantity");

        if (quantity == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Quantity is required"));
        }

        if (quantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Quantity must be greater than 0"));
        }

        try {
            CartItems updatedItem = cartItemsService.updateCartItemQuantity(cartId, itemId, quantity);
            return ResponseEntity.ok(updatedItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Remove item from cart
    @DeleteMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Integer cartId,
            @PathVariable Integer itemId) {

        try {
            cartItemsService.removeCartItem(cartId, itemId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Clear cart (remove all items)
    @DeleteMapping("/{cartId}/items")
    public ResponseEntity<?> clearCart(@PathVariable Integer cartId) {
        if (!cartService.cartExists(cartId)) {
            return ResponseEntity.notFound().build();
        }

        cartItemsService.clearCart(cartId);
        return ResponseEntity.noContent().build();
    }

    // Get cart summary (with item count and total price)
    @GetMapping("/{cartId}/summary")
    public ResponseEntity<?> getCartSummary(@PathVariable Integer cartId) {
        try {
            Map<String, Object> summary = cartService.getCartSummary(cartId);
            return ResponseEntity.ok(summary);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
