package bookstore.demo.customerOrder;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemsRepository extends JpaRepository<OrderItems, Integer> {

    // Find all items in an order
    List<OrderItems> findByOrderOrderId(Integer orderId);

    // Delete all items in an order
    void deleteByOrderOrderId(Integer orderId);
}
