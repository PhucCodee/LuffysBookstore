package bookstore.demo.customerOrder;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Integer> {

    // Find all orders for a customer
    List<CustomerOrder> findByCustomerCustomerId(Integer customerId);

    // Find orders by status
    List<CustomerOrder> findByOrderStatus(CustomerOrder.OrderStatus status);
}
