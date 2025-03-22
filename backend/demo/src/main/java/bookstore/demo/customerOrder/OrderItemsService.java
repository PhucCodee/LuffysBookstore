package bookstore.demo.customerOrder;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import bookstore.demo.book.Book;
import bookstore.demo.book.BookRepository;
import bookstore.demo.book.BookService;

import java.util.List;

@Service
public class OrderItemsService {

    private final OrderItemsRepository orderItemsRepository;
    private final CustomerOrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final BookService bookService;

    public OrderItemsService(OrderItemsRepository orderItemsRepository,
            CustomerOrderRepository orderRepository,
            BookRepository bookRepository,
            BookService bookService) {
        this.orderItemsRepository = orderItemsRepository;
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.bookService = bookService;
    }

    // Get all items in an order
    public List<OrderItems> getOrderItemsByOrderId(Integer orderId) {
        return orderItemsRepository.findByOrderOrderId(orderId);
    }

    // Add an item to an order
    @Transactional
    public OrderItems addItemToOrder(Integer orderId, Integer bookId, Integer quantity) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        // Only can add items to pending orders
        if (order.getOrderStatus() != CustomerOrder.OrderStatus.pending) {
            throw new IllegalArgumentException("Can only add items to pending orders");
        }

        // Check if there's enough stock
        if (book.getStock() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }

        // Create new order item
        OrderItems orderItem = new OrderItems(order, book, quantity, book.getPrice());
        OrderItems savedItem = orderItemsRepository.save(orderItem);

        // Update book stock
        bookService.updateBookStock(book.getBookId(), book.getStock() - quantity);

        // Update order total
        updateOrderTotal(order);

        return savedItem;
    }

    // Remove item from order
    @Transactional
    public void removeOrderItem(Integer orderId, Integer itemId) {
        OrderItems item = orderItemsRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Order item not found"));

        // Verify item belongs to the specified order
        if (!item.getOrder().getOrderId().equals(orderId)) {
            throw new IllegalArgumentException("Item does not belong to the specified order");
        }

        // Only can remove items from pending orders
        if (item.getOrder().getOrderStatus() != CustomerOrder.OrderStatus.pending) {
            throw new IllegalArgumentException("Can only remove items from pending orders");
        }

        // Restore book stock if book exists
        if (item.getBook() != null) {
            Book book = item.getBook();
            bookService.updateBookStock(book.getBookId(), book.getStock() + item.getQuantity());
        }

        // Remove the item
        orderItemsRepository.delete(item);

        // Update order total
        updateOrderTotal(item.getOrder());
    }

    // Update order total based on items
    private void updateOrderTotal(CustomerOrder order) {
        List<OrderItems> items = orderItemsRepository.findByOrderOrderId(order.getOrderId());

        // Calculate new total
        java.math.BigDecimal newTotal = items.stream()
                .map(item -> item.getPriceAtPurchase().multiply(java.math.BigDecimal.valueOf(item.getQuantity())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        order.setTotal(newTotal);
        orderRepository.save(order);
    }
}
