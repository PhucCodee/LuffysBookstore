package bookstore.demo.customerOrder;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bookstore.demo.book.Book;
import bookstore.demo.book.BookRepository;
import bookstore.demo.book.BookService;
import bookstore.demo.cart.Cart;
import bookstore.demo.cart.CartItems;
import bookstore.demo.cart.CartItemsRepository;
import bookstore.demo.cart.CartRepository;
import bookstore.demo.customer.Customer;
import bookstore.demo.customer.CustomerRepository;

@Service
public class CustomerOrderService {

    private final CustomerOrderRepository orderRepository;
    private final OrderItemsRepository orderItemsRepository;
    private final CustomerRepository customerRepository;
    private final CartRepository cartRepository;
    private final CartItemsRepository cartItemsRepository;
    private final BookService bookService;

    public CustomerOrderService(CustomerOrderRepository orderRepository,
            OrderItemsRepository orderItemsRepository,
            CustomerRepository customerRepository,
            CartRepository cartRepository,
            CartItemsRepository cartItemsRepository,
            BookRepository bookRepository,
            BookService bookService) {
        this.orderRepository = orderRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.customerRepository = customerRepository;
        this.cartRepository = cartRepository;
        this.cartItemsRepository = cartItemsRepository;
        this.bookService = bookService;
    }

    // Get all orders
    public List<CustomerOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get order by ID
    public Optional<CustomerOrder> getOrderById(Integer id) {
        return orderRepository.findById(id);
    }

    // Check if order exists
    public boolean orderExists(Integer id) {
        return orderRepository.existsById(id);
    }

    // Get orders by customer ID
    public List<CustomerOrder> getOrdersByCustomerId(Integer customerId) {
        return orderRepository.findByCustomerCustomerId(customerId);
    }

    // Create order from cart
    @Transactional
    public CustomerOrder createOrderFromCart(Integer cartId, Integer customerId, String destination, CustomerOrder.PaymentMethod paymentMethod) {
        // Validate cart exists
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new IllegalArgumentException("Cart not found"));

        // Validate customer exists
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));

        // Verify cart belongs to customer
        if (!cart.getCustomer().getCustomerId().equals(customerId)) {
            throw new IllegalArgumentException("Cart does not belong to the specified customer");
        }

        // Get cart items
        List<CartItems> cartItems = cartItemsRepository.findByCartCartId(cartId);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Cannot create order from empty cart");
        }

        // Calculate total
        BigDecimal total = cartItems.stream()
                .map(item -> item.getBook().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Create order
        CustomerOrder order = new CustomerOrder(
                customer,
                destination,
                CustomerOrder.OrderStatus.pending,
                total,
                paymentMethod
        );

        CustomerOrder savedOrder = orderRepository.save(order);

        // Create order items from cart items
        for (CartItems cartItem : cartItems) {
            Book book = cartItem.getBook();

            // Check stock
            if (book.getStock() < cartItem.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock for " + book.getTitle());
            }

            // Create order item
            OrderItems orderItem = new OrderItems(
                    savedOrder,
                    book,
                    cartItem.getQuantity(),
                    book.getPrice()
            );

            orderItemsRepository.save(orderItem);

            // Update stock
            bookService.updateBookStock(book.getBookId(), book.getStock() - cartItem.getQuantity());
        }

        // Clear cart
        cartItemsRepository.deleteByCartCartId(cartId);

        return savedOrder;
    }

    // Create order directly
    @Transactional
    public CustomerOrder createOrder(CustomerOrder order) {
        // Validate customer
        if (order.getCustomer() != null && order.getCustomer().getCustomerId() != null) {
            Customer customer = customerRepository.findById(order.getCustomer().getCustomerId())
                    .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
            order.setCustomer(customer);
        }

        // Validate required fields
        if (order.getDestination() == null || order.getDestination().trim().isEmpty()) {
            throw new IllegalArgumentException("Destination is required");
        }

        if (order.getTotal() == null || order.getTotal().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valid total amount is required");
        }

        if (order.getPaymentMethod() == null) {
            throw new IllegalArgumentException("Payment method is required");
        }

        // Set default status if not provided
        if (order.getOrderStatus() == null) {
            order.setOrderStatus(CustomerOrder.OrderStatus.pending);
        }

        return orderRepository.save(order);
    }

    // Update order status
    @Transactional
    public CustomerOrder updateOrderStatus(Integer orderId, CustomerOrder.OrderStatus status) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        // Cannot change status if already canceled
        if (order.getOrderStatus() == CustomerOrder.OrderStatus.canceled) {
            throw new IllegalArgumentException("Cannot change status of canceled order");
        }

        order.setOrderStatus(status);
        return orderRepository.save(order);
    }

    // Cancel order
    @Transactional
    public CustomerOrder cancelOrder(Integer orderId) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        // Can only cancel if order is still pending
        if (order.getOrderStatus() != CustomerOrder.OrderStatus.pending) {
            throw new IllegalArgumentException("Only pending orders can be canceled");
        }

        // Restore stock
        List<OrderItems> orderItems = orderItemsRepository.findByOrderOrderId(orderId);
        for (OrderItems item : orderItems) {
            if (item.getBook() != null) {
                Book book = item.getBook();
                bookService.updateBookStock(book.getBookId(), book.getStock() + item.getQuantity());
            }
        }

        // Update order status
        order.setOrderStatus(CustomerOrder.OrderStatus.canceled);
        return orderRepository.save(order);
    }

    // Delete order
    @Transactional
    public void deleteOrder(Integer orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new IllegalArgumentException("Order not found");
        }

        // Delete order items first
        orderItemsRepository.deleteByOrderOrderId(orderId);

        // Then delete the order
        orderRepository.deleteById(orderId);
    }

    // Get order summary
    public Map<String, Object> getOrderSummary(Integer orderId) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        List<OrderItems> items = orderItemsRepository.findByOrderOrderId(orderId);

        int totalItems = items.stream()
                .mapToInt(OrderItems::getQuantity)
                .sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("orderId", order.getOrderId());
        summary.put("customer", order.getCustomer());
        summary.put("status", order.getOrderStatus());
        summary.put("paymentMethod", order.getPaymentMethod());
        summary.put("destination", order.getDestination());
        summary.put("totalItems", totalItems);
        summary.put("total", order.getTotal());
        summary.put("createdAt", order.getCreatedAt());
        summary.put("items", items);

        return summary;
    }
}
