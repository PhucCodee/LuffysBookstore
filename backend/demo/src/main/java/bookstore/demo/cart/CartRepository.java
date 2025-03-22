package bookstore.demo.cart;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import bookstore.demo.customer.Customer;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    // Find the most recent cart for a customer
    Optional<Cart> findTopByCustomerOrderByCreatedAtDesc(Customer customer);
}
