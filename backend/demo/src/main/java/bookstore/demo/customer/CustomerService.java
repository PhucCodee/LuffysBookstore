package bookstore.demo.customer;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all customers from the database
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Find a customer by their ID
    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }

    // Find a customer by their username
    public Optional<Customer> getCustomerByUsername(String username) {
        return customerRepository.findByUsername(username);
    }

    // Save a new customer with password encryption
    public Customer saveCustomer(Customer customer) {
        // Check if username already exists
        if (customerRepository.findByUsername(customer.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username is already taken");
        }

        // Check if email already exists
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Encrypt the password before saving
        customer.setUserPassword(passwordEncoder.encode(customer.getUserPassword()));
        return customerRepository.save(customer);
    }

    // Update an existing customer
    public Customer updateCustomer(Customer customer) {
        // Check if username is already taken by another customer
        Optional<Customer> existingUsername = customerRepository.findByUsername(customer.getUsername());
        if (existingUsername.isPresent() && !existingUsername.get().getCustomerId().equals(customer.getCustomerId())) {
            throw new IllegalArgumentException("Username is already taken");
        }

        // Check if email is already taken by another customer
        Optional<Customer> existingEmail = customerRepository.findByEmail(customer.getEmail());
        if (existingEmail.isPresent() && !existingEmail.get().getCustomerId().equals(customer.getCustomerId())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // If password was changed, encrypt it
        if (!passwordEncoder.matches(customer.getUserPassword(), getCustomerById(customer.getCustomerId()).get().getUserPassword())) {
            customer.setUserPassword(passwordEncoder.encode(customer.getUserPassword()));
        }

        return customerRepository.save(customer);
    }

    // Check if a customer exists by ID
    public boolean customerExists(Integer id) {
        return customerRepository.existsById(id);
    }

    // Delete a customer by ID
    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }

    // Authenticate a customer login
    public Customer authenticateCustomer(String username, String password) {
        // Find customer by username
        Optional<Customer> customer = customerRepository.findByUsername(username);

        // Check if customer exists and password matches
        if (customer.isPresent() && passwordEncoder.matches(password, customer.get().getUserPassword())) {
            return customer.get();
        }

        throw new IllegalArgumentException("Invalid username or password");
    }

    // Change a customer's password
    public void changePassword(Integer id, String currentPassword, String newPassword) {
        // Find customer by ID
        Optional<Customer> optionalCustomer = customerRepository.findById(id);

        if (optionalCustomer.isEmpty()) {
            throw new IllegalArgumentException("Customer not found");
        }

        Customer customer = optionalCustomer.get();

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, customer.getUserPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Set and encrypt new password
        customer.setUserPassword(passwordEncoder.encode(newPassword));
        customerRepository.save(customer);
    }
}
