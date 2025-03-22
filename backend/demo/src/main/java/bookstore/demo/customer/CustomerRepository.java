package bookstore.demo.customer;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    // Find a customer by their unique username
    Optional<Customer> findByUsername(String username);

    // Find a customer by their unique email address
    Optional<Customer> findByEmail(String email);
}
