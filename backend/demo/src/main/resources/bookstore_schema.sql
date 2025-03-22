DROP SCHEMA IF EXISTS bookstore;

CREATE DATABASE IF NOT EXISTS bookstore;

USE bookstore;

-- ====================================================
-- TABLES
-- ====================================================
-- Customer table
CREATE TABLE Customer (
    CustomerID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    UserPassword VARCHAR(255) NOT NULL,
    CustomerName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    UserRole ENUM('admin', 'customer') DEFAULT 'customer' NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Book table
CREATE TABLE Book (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Price DECIMAL(7, 2) NOT NULL CHECK (Price >= 0),
    BookDescription TEXT,
    BookStatus ENUM(
        'upcoming',
        'out_of_stock',
        'available'
    ) NOT NULL DEFAULT 'available',
    Cover VARCHAR(255),
    Genre VARCHAR(50) NOT NULL,
    Author VARCHAR(100) NOT NULL,
    Stock INT DEFAULT 0 NOT NULL CHECK (Stock >= 0),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE Cart (
    CartID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID) ON DELETE CASCADE
);

-- CartItems table
CREATE TABLE CartItems (
    CartItemID INT AUTO_INCREMENT PRIMARY KEY,
    CartID INT NOT NULL,
    BookID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CartID) REFERENCES Cart (CartID) ON DELETE CASCADE,
    FOREIGN KEY (BookID) REFERENCES Book (BookID) ON DELETE CASCADE
);

-- Order table
CREATE TABLE CustomerOrder (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    Destination VARCHAR(255) NOT NULL,
    OrderStatus ENUM(
        'pending',
        'in_transit',
        'delivered',
        'canceled'
    ) DEFAULT 'pending' NOT NULL,
    Total DECIMAL(7, 2) NOT NULL CHECK (Total >= 0),
    PaymentMethod ENUM(
        'electronic_banking',
        'cash_on_delivery',
        'credit_card'
    ) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID) ON DELETE SET NULL
);

-- OrderItems table
CREATE TABLE OrderItems (
    OrderItemID INT AUTO_INCREMENT PRIMARY KEY,
    OrderID INT NOT NULL,
    BookID INT,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    PriceAtPurchase DECIMAL(7, 2) NOT NULL CHECK (PriceAtPurchase >= 0),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (OrderID) REFERENCES CustomerOrder (OrderID) ON DELETE CASCADE,
    FOREIGN KEY (BookID) REFERENCES Book (BookID) ON DELETE SET NULL
);

-- ====================================================
-- INDEXES
-- ====================================================
-- Book table indexes
CREATE INDEX idx_book_title ON Book (Title);
CREATE INDEX idx_book_author ON Book (Author);
CREATE INDEX idx_book_genre ON Book (Genre);
CREATE INDEX idx_book_status ON Book (BookStatus);
CREATE INDEX idx_book_stock_status ON Book (Stock, BookStatus);

-- Customer table indexes
CREATE INDEX idx_customer_name ON Customer (CustomerName);
CREATE INDEX idx_customer_email ON Customer (Email);

-- Cart table indexes
CREATE INDEX idx_cart_customer ON Cart (CustomerID);

-- Order table indexes
CREATE INDEX idx_order_customer ON CustomerOrder (CustomerID);
CREATE INDEX idx_order_status ON CustomerOrder (OrderStatus);
CREATE INDEX idx_order_date ON CustomerOrder (CreatedAt);

-- CartItems and OrderItems table indexes
CREATE INDEX idx_cart_items ON CartItems (CartID, BookID);
CREATE INDEX idx_order_items ON OrderItems (OrderID, BookID);

-- ====================================================
-- TRIGGERS, PROCEDURES
-- ====================================================

DELIMITER $$
-- Update book stock when order is placed
CREATE TRIGGER after_order_placed
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    DECLARE stock_available INT;
    SELECT Stock INTO stock_available FROM Book WHERE BookID = NEW.BookID;
    IF stock_available < NEW.Quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock for book';
    ELSE
        UPDATE Book
        SET Stock = Stock - NEW.Quantity
        WHERE BookID = NEW.BookID;
        UPDATE Book
        SET BookStatus = 'out_of_stock'
        WHERE Stock = 0 AND BookStatus = 'available';
    END IF;
END $$
DELIMITER ;

DELIMITER $$
-- Restore book stock if an order is canceled
CREATE TRIGGER after_order_canceled
AFTER UPDATE ON CustomerOrder
FOR EACH ROW
BEGIN
    IF NEW.OrderStatus = 'canceled' AND OLD.OrderStatus != 'canceled' THEN
        -- Restore stock for all items in the canceled order
        UPDATE Book b
        JOIN OrderItems oi ON b.BookID = oi.BookID
        SET b.Stock = b.Stock + oi.Quantity
        WHERE oi.OrderID = NEW.OrderID;
        
        -- Update book status if stock becomes available
        UPDATE Book
        SET BookStatus = 'available'
        WHERE Stock > 0 AND BookStatus = 'out_of_stock';
    END IF;
END $$
DELIMITER ;

DELIMITER $$
-- Place order
CREATE PROCEDURE PlaceOrder(
    IN p_CustomerID INT,
    IN p_Destination VARCHAR(255),
    IN p_PaymentMethod VARCHAR(50),
    OUT p_OrderID INT,
    OUT p_Success BOOLEAN
)
BEGIN
    DECLARE v_CartID INT;
    DECLARE v_ItemsAvailable BOOLEAN DEFAULT TRUE;
    
    -- Get customer's cart
    SELECT CartID INTO v_CartID 
    FROM Cart 
    WHERE CustomerID = p_CustomerID 
    LIMIT 1;
    
    -- Check if cart exists and has items
    -- IF v_CartID IS NULL THEN
    --     SET p_Success = FALSE;
    --     RETURN;
    -- END IF;
    
    -- Check if all items are available in requested quantities
    SELECT COALESCE(MIN(b.Stock >= ci.Quantity), TRUE) INTO v_ItemsAvailable
    FROM CartItems ci
    JOIN Book b ON ci.BookID = b.BookID
    WHERE ci.CartID = v_CartID
    AND b.BookStatus = 'available';
    
    -- Only proceed if all items are available
    IF v_ItemsAvailable THEN
        -- Create new order
        INSERT INTO CustomerOrder (CustomerID, Destination, OrderStatus, Total, PaymentMethod)
        VALUES (p_CustomerID, p_Destination, 'pending', 0, p_PaymentMethod);
        
        -- Get the new order ID
        SET p_OrderID = LAST_INSERT_ID();
        
        -- Move items from cart to order
        INSERT INTO OrderItems (OrderID, BookID, Quantity, PriceAtPurchase)
        SELECT p_OrderID, ci.BookID, ci.Quantity, b.Price
        FROM CartItems ci
        JOIN Book b ON ci.BookID = b.BookID
        WHERE ci.CartID = v_CartID;
        
        -- Clear the cart
        DELETE FROM CartItems WHERE CartID = v_CartID;
        
        SET p_Success = TRUE;
    ELSE
        SET p_Success = FALSE;
    END IF;
END $$
DELIMITER ;