DROP SCHEMA IF EXISTS bookstore;

CREATE DATABASE IF NOT EXISTS bookstore;

USE bookstore;

-- Customer table
CREATE TABLE
    Customer (
        CustomerID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Name VARCHAR(100) NOT NULL,
        Email VARCHAR(255) UNIQUE NOT NULL,
        Role ENUM ('admin', 'customer') DEFAULT 'customer' NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Book table
CREATE TABLE
    Book (
        BookID INT AUTO_INCREMENT PRIMARY KEY,
        Title VARCHAR(255) NOT NULL,
        Price DECIMAL(7, 2) NOT NULL CHECK (Price >= 0),
        Description TEXT,
        Status ENUM ('upcoming', 'out_of_stock', 'available') NOT NULL DEFAULT 'available',
        Cover VARCHAR(255),
        Genre VARCHAR(50) NOT NULL,
        Author VARCHAR(100) NOT NULL,
        Stock INT DEFAULT 0 NOT NULL CHECK (Stock >= 0),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Cart table
CREATE TABLE
    Cart (
        CartID INT AUTO_INCREMENT PRIMARY KEY,
        CustomerID INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID) ON DELETE CASCADE
    );

-- CartItems table
CREATE TABLE
    CartItems (
        CartItemID INT AUTO_INCREMENT PRIMARY KEY,
        CartID INT NOT NULL,
        BookID INT NOT NULL,
        Quantity INT NOT NULL CHECK (Quantity > 0),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (CartID) REFERENCES Cart (CartID) ON DELETE CASCADE,
        FOREIGN KEY (BookID) REFERENCES Book (BookID) ON DELETE CASCADE
    );

-- Order table
CREATE TABLE
    CustomerOrder (
        OrderID INT AUTO_INCREMENT PRIMARY KEY,
        CustomerID INT,
        Destination VARCHAR(255) NOT NULL,
        Status ENUM ('pending', 'in_transit', 'delivered', 'canceled') DEFAULT 'pending' NOT NULL,
        Total DECIMAL(7, 2) NOT NULL CHECK (Total >= 0),
        PaymentMethod ENUM (
            'electronic_banking',
            'cash_on_delivery',
            'credit_card'
        ) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (CustomerID) REFERENCES Customer (CustomerID) ON DELETE SET NULL
    );

-- OrderItems table
CREATE TABLE
    OrderItems (
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

-- Mock data for Customer table
INSERT INTO
    Customer (Username, Password, Name, Email, Role)
VALUES
    (
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
        Description,
        Status,
        Cover,
        Genre,
        Author,
        Stock
    )
VALUES
    (
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
VALUES
    (2),
    (3),
    (4),
    (5),
    (2);

-- Mock data for CartItems table
INSERT INTO
    CartItems (CartID, BookID, Quantity)
VALUES
    (1, 1, 1),
    (1, 2, 2),
    (2, 4, 1),
    (3, 1, 1),
    (4, 2, 3);

-- Mock data for CustomerOrder table
INSERT INTO
    CustomerOrder (
        CustomerID,
        Destination,
        Status,
        Total,
        PaymentMethod
    )
VALUES
    (
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
    OrderItems (OrderID, BookID, Quantity, PriceAtPurchase)
VALUES
    (1, 1, 1, 19.99),
    (1, 2, 1, 29.99),
    (2, 4, 1, 24.99),
    (3, 1, 1, 19.99),
    (4, 2, 3, 29.99),
    (5, 4, 1, 24.99);