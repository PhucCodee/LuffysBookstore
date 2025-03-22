package bookstore.demo.customerOrder;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bookstore.demo.cart.CartService;

@RestController
@RequestMapping("/api/orders")
public class CustomerOrderController {

    private final CustomerOrderService orderService;
    private final OrderItemsService orderItemsService;

    // Constructor injection
    public CustomerOrderController(CustomerOrderService orderService, OrderItemsService orderItemsService, CartService cartService) {
        this.orderService = orderService;
        this.orderItemsService = orderItemsService;
    }

    // Get all orders (admin)
    @GetMapping
    public ResponseEntity<List<CustomerOrder>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Get order by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomerOrder> getOrderById(@PathVariable Integer id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get customer's orders
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomerOrder>> getCustomerOrders(@PathVariable Integer customerId) {
        List<CustomerOrder> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }

    // Create order from cart
    @PostMapping("/checkout")
    public ResponseEntity<?> createOrderFromCart(@RequestBody Map<String, Object> request) {
        try {
            Integer cartId = (Integer) request.get("cartId");
            Integer customerId = (Integer) request.get("customerId");
            String destination = (String) request.get("destination");
            String paymentMethod = (String) request.get("paymentMethod");

            if (cartId == null || customerId == null || destination == null || paymentMethod == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Required fields missing: cartId, customerId, destination, paymentMethod"));
            }

            // Validate payment method
            CustomerOrder.PaymentMethod payment;
            try {
                payment = CustomerOrder.PaymentMethod.valueOf(paymentMethod);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Invalid payment method",
                        "validOptions", CustomerOrder.PaymentMethod.values()));
            }

            // Create order
            CustomerOrder order = orderService.createOrderFromCart(cartId, customerId, destination, payment);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error creating order: " + e.getMessage()));
        }
    }

    // Create order directly (without cart)
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CustomerOrder order) {
        try {
            CustomerOrder createdOrder = orderService.createOrder(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Update order status
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Integer id,
            @RequestBody Map<String, String> statusUpdate) {

        String newStatus = statusUpdate.get("status");

        if (newStatus == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Status value required"));
        }

        try {
            CustomerOrder.OrderStatus orderStatus = CustomerOrder.OrderStatus.valueOf(newStatus);
            CustomerOrder updatedOrder = orderService.updateOrderStatus(id, orderStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Invalid status value or order not found",
                    "validOptions", CustomerOrder.OrderStatus.values()));
        }
    }

    // Cancel order
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id) {
        try {
            CustomerOrder canceledOrder = orderService.cancelOrder(id);
            return ResponseEntity.ok(canceledOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get order items
    @GetMapping("/{orderId}/items")
    public ResponseEntity<List<OrderItems>> getOrderItems(@PathVariable Integer orderId) {
        if (!orderService.orderExists(orderId)) {
            return ResponseEntity.notFound().build();
        }

        List<OrderItems> items = orderItemsService.getOrderItemsByOrderId(orderId);
        return ResponseEntity.ok(items);
    }

    // Add item to order (admin)
    @PostMapping("/{orderId}/items")
    public ResponseEntity<?> addItemToOrder(
            @PathVariable Integer orderId,
            @RequestBody Map<String, Object> request) {

        try {
            Integer bookId = (Integer) request.get("bookId");
            Integer quantity = (Integer) request.get("quantity");

            if (bookId == null || quantity == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Book ID and quantity are required"));
            }

            if (quantity <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Quantity must be greater than 0"));
            }

            OrderItems orderItem = orderItemsService.addItemToOrder(orderId, bookId, quantity);
            return ResponseEntity.status(HttpStatus.CREATED).body(orderItem);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Delete order (admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Integer id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get order summary
    @GetMapping("/{orderId}/summary")
    public ResponseEntity<?> getOrderSummary(@PathVariable Integer orderId) {
        try {
            Map<String, Object> summary = orderService.getOrderSummary(orderId);
            return ResponseEntity.ok(summary);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
