DROP SCHEMA IF EXISTS bookstore;

CREATE DATABASE IF NOT EXISTS bookstore;

USE bookstore;

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
    -- Decrease available stock
    UPDATE Book
    SET Stock = Stock - NEW.Quantity
    WHERE BookID = NEW.BookID AND Stock >= NEW.Quantity;
    
    -- Update status if stock becomes 0
    UPDATE Book
    SET BookStatus = 'out_of_stock'
    WHERE Stock = 0 AND BookStatus = 'available';
END $$

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

-- Automatically calculate order total when items change
CREATE TRIGGER calculate_order_total
AFTER INSERT ON OrderItems
FOR EACH ROW
BEGIN
    UPDATE CustomerOrder
    SET Total = (
        SELECT SUM(Quantity * PriceAtPurchase)
        FROM OrderItems
        WHERE OrderID = NEW.OrderID
    )
    WHERE OrderID = NEW.OrderID;
END $$

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
    IF v_CartID IS NULL THEN
        SET p_Success = FALSE;
        RETURN;
    END IF;
    
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

-- Add to cart
CREATE PROCEDURE AddToCart(
    IN p_CustomerID INT,
    IN p_BookID INT,
    IN p_Quantity INT
)
BEGIN
    DECLARE v_CartID INT;
    DECLARE v_ExistingItem INT DEFAULT 0;
    
    -- Get customer's cart
    SELECT CartID INTO v_CartID 
    FROM Cart 
    WHERE CustomerID = p_CustomerID 
    LIMIT 1;
    
    -- Create cart if doesn't exist
    IF v_CartID IS NULL THEN
        INSERT INTO Cart (CustomerID) VALUES (p_CustomerID);
        SET v_CartID = LAST_INSERT_ID();
    END IF;
    
    -- Check if book already in cart
    SELECT COUNT(*) INTO v_ExistingItem
    FROM CartItems
    WHERE CartID = v_CartID AND BookID = p_BookID;
    
    IF v_ExistingItem > 0 THEN
        -- Update existing item quantity
        UPDATE CartItems
        SET Quantity = Quantity + p_Quantity
        WHERE CartID = v_CartID AND BookID = p_BookID;
    ELSE
        -- Add new item to cart
        INSERT INTO CartItems (CartID, BookID, Quantity)
        VALUES (v_CartID, p_BookID, p_Quantity);
    END IF;
END $$

-- Search books (with filtering)
CREATE PROCEDURE SearchBooks(
    IN p_Title VARCHAR(255),
    IN p_Author VARCHAR(100),
    IN p_Genre VARCHAR(50),
    IN p_InStock BOOLEAN
) 
BEGIN
    SELECT *
    FROM Book
    WHERE (
            p_Title IS NULL
            OR Title LIKE CONCAT('%', p_Title, '%')
        )
        AND (
            p_Author IS NULL
            OR Author LIKE CONCAT('%', p_Author, '%')
        )
        AND (
            p_Genre IS NULL
            OR Genre = p_Genre
        )
        AND (
            p_InStock IS NULL
            OR (
                p_InStock = TRUE
                AND Stock > 0
                AND BookStatus = 'available'
            )
            OR (p_InStock = FALSE)
        )
    ORDER BY Title;
END $$

-- ====================================================
-- MOCK DATA
-- ====================================================
-- Mock data for Customer table
INSERT INTO
    Customer (
        Username,
        UserPassword,
        CustomerName,
        Email,
        UserRole
    )
VALUES (
        'phuctran',
        '$2a$10$Ix7ULIz',
        'Tran Hoang Phuc',
        'phuc.tran@example.com',
        'admin'
    ),
    (
        'longvo',
        '$2a$10$D9avx8y',
        'Vo Hoang Long',
        'long.vo@example.com',
        'customer'
    ),
    (
        'namnguyen',
        '$2a$10$cvZJjh4',
        'Nguyen Phuc Nam',
        'nam.nguyen@example.com',
        'customer'
    ),
    (
        'quangnguyen',
        '$2a$10$LV9thqI',
        'Nguyen Minh Quang',
        'quang.nguyen@example.com',
        'customer'
    ),
    (
        'ductran',
        '$2a$10$57TBs8m',
        'Tran Tuan Duc',
        'duc.tran@example.com',
        'customer'
    );
-- Mock data for Book table
INSERT INTO
    Book (
        Title,
        Price,
        BookDescription,
        BookStatus,
        Cover,
        Genre,
        Author,
        Stock
    )
VALUES (
        'One Piece: New World',
        19.99,
        'The Straw Hat Pirates journey into the New World',
        'available',
        'one_piece_cover.jpg',
        'Manga',
        'Eiichiro Oda',
        100
    ),
    (
        'The World of Programming',
        29.99,
        'A comprehensive guide to modern programming languages',
        'available',
        'programming_cover.jpg',
        'Education',
        'John Coder',
        50
    ),
    (
        'History of Grand Line',
        15.99,
        'Historical account of the Grand Line and its islands',
        'out_of_stock',
        'history_cover.jpg',
        'History',
        'Edward Newgate',
        0
    ),
    (
        'Cooking with Sanji',
        24.99,
        'Recipes from the Straw Hat Pirates chef',
        'available',
        'cooking_cover.jpg',
        'Cookbook',
        'Sanji Vinsmoke',
        30
    ),
    (
        'The Next Devil Fruit',
        18.99,
        'Upcoming guide to mythical devil fruits',
        'upcoming',
        'devil_fruit_cover.jpg',
        'Fantasy',
        'Dr. Vegapunk',
        0
    );
-- Mock data for Cart table
INSERT INTO
    Cart (CustomerID)
VALUES (2),
    (3),
    (4),
    (5),
    (2);
-- Mock data for CartItems table
INSERT INTO
    CartItems (CartID, BookID, Quantity)
VALUES (1, 1, 1),
    (1, 2, 2),
    (2, 4, 1),
    (3, 1, 1),
    (4, 2, 3);
-- Mock data for CustomerOrder table
INSERT INTO
    CustomerOrder (
        CustomerID,
        Destination,
        OrderStatus,
        Total,
        PaymentMethod
    )
VALUES (
        2,
        '123 Main St, Anytown, AT 12345',
        'delivered',
        49.98,
        'credit_card'
    ),
    (
        3,
        '456 Oak Ave, Somewhere, SW 67890',
        'in_transit',
        24.99,
        'electronic_banking'
    ),
    (
        4,
        '789 Pine Rd, Nowhere, NW 54321',
        'pending',
        19.99,
        'cash_on_delivery'
    ),
    (
        5,
        '321 Elm Dr, Everywhere, EW 13579',
        'canceled',
        89.97,
        'credit_card'
    ),
    (
        2,
        '123 Main St, Anytown, AT 12345',
        'pending',
        24.99,
        'electronic_banking'
    );
-- Mock data for OrderItems table
INSERT INTO
    OrderItems (
        OrderID,
        BookID,
        Quantity,
        PriceAtPurchase
    )
VALUES (1, 1, 1, 19.99),
    (1, 2, 1, 29.99),
    (2, 4, 1, 24.99),
    (3, 1, 1, 19.99),
    (4, 2, 3, 29.99),
    (5, 4, 1, 24.99);