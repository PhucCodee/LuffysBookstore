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
        'Parable of the Sower',
        19.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781538732182.jpg?width=384&v=v2',
        'Science Fiction',
        'Octavia E Butler',
        50
    ),
    (
        '1984',
        10.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780451524935.jpg?width=384&v=v2',
        'Science Fiction',
        'George Orwell',
        50
    ),
    (
        'I Who Have Never Known Men',
        16.95,
        'This is a test!',
        'out_of_stock',
        'https://images-us.bookshop.org/ingram/9781945492600.jpg?width=384&v=v2',
        'Science Fiction',
        'Jacqueline Harpman',
        0
    ),
    (
        'This Is How You Lose the Time War',
        17.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781534430990.jpg?width=384&v=v2',
        'Science Fiction',
        'Max Gladstone',
        30
    ),
    (
        "The Handmaid's Tale",
        18.00,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9780385490818.jpg?width=384&v=v2',
        'Science Fiction',
        'Margaret Atwood',
        0
    ),
    (
        "Brave New World",
        17.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780060850524.jpg?width=384&v=v2',
        'Science Fiction',
        'Aldous Huxley',
        20
    ),
    (
        "Mickey7",
        19.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781250875280.jpg?width=384&v=v2',
        'Science Fiction',
        'Edward Ashton',
        30
    ),
    (
        "Star Wars: The Mask of Fear (Reign of the Empire)",
        30.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780593723463.jpg?width=384&v=v2',
        'Science Fiction',
        'Alexander Freed',
        50
    ),
    (
        "Murder by Memory",
        21.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781250342249.jpg?width=384&v=v2',
        'Science Fiction',
        'Olivia Waite',
        10
    ),
    (
        "Dune",
        10.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780441172719.jpg?width=384&v=v2',
        'Science Fiction',
        'Frank Herbert',
        30
    ),
    (
        "You Must Take Part in Revolution",
        23.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781951491291.jpg?width=384&v=v2',
        'Science Fiction',
        'Badiucao',
        40
    ),
    (
        "The Buffalo Hunter Hunter",
        29.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781668075081.jpg?width=384&v=v2',
        'Horror',
        'Stephen Graham Jones',
        50
    ),
    (
        "Between Two Fires",
        18.95,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9798662731349.jpg?width=384&v=v2',
        'Horror',
        'Christopher Buehlman',
        0
    ),
    (
        "Lucky Day",
        27.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781250398659.jpg?width=384&v=v2',
        'Horror',
        'Chuck Tingle',
        20
    ),
    (
        "The Book of Accidents",
        19.00,
        'This is a test!',
        'out_of_stock',
        'https://images-us.bookshop.org/ingram/9780399182150.jpg?width=384&v=v2',
        'Horror',
        'Chuck Wendig',
        0
    ),
    (
        "Never Flinch",
        32.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781668089330.jpg?width=384&v=v2',
        'Horror',
        'Stephen King',
        20
    ),
    (
        "Wake Up and Open Your Eyes",
        24.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781683693956.jpg?width=384&v=v2',
        'Horror',
        'Clay McLeod Chapman',
        60
    ),
    (
        "The Lamb",
        27.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780063374607.jpg?width=384&v=v2',
        'Horror',
        'Lucy Rose',
        30
    ),
    (
        "Bad Dreams in the Night",
        24.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781524887186.jpg?width=384&v=v2',
        'Horror',
        'Adam Ellis',
        10
    ),
    (
        "Ring Shout",
        20.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781250767028.jpg?width=384&v=v2',
        'Horror',
        'P Djèlí Clark',
        20
    ),
    (
        "Where Sleeping Girls Lie",
        19.99,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781250800848.jpg?width=384&v=v2',
        'Horror',
        'Faridah Àbíké - Íyímídé',
        40
    ),
    (
        "What Feasts at Night",
        19.99,
        'This is a test!',
        'out_of_stock',
        'https://images-us.bookshop.org/ingram/9781250830852.jpg?width=384&v=v2',
        'Horror',
        'T.Kingfisher',
        0
    ),
    (
        "Abundance",
        19.99,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9781668023488.jpg?width=384&v=v2',
        'Politics',
        'Derek Thompson',
        0
    ),
    (
        "Careless People",
        32.99,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9781250391230.jpg?width=384&v=v2',
        'Politics',
        'Sarah Wynn - Williams',
        0
    ),
    (
        "The River Has Roots",
        24.99,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9781250341082.jpg?width=384&v=v2',
        'Fantasy',
        'Amal El - Mohtar',
        0
    ),
    (
        "The Deer and the Dragon",
        18.99,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9781728280172.jpg?width=384&v=v2',
        'Romance',
        'Piper Cj',
        0
    ),
    (
        "The Odyssey",
        18.95,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9780393356250.jpg?width=384&v=v2',
        'Poetry',
        'Homer',
        0
    ),
    (
        "To Kill a Mockingbird",
        16.99,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9780060935467.jpg?width=384&v=v2',
        'Fantasy',
        'Harper Lee',
        0
    ),
    (
        "The Bluest Eye",
        16.00,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9780307278449.jpg?width=384&v=v2',
        'Literature',
        'Toni Morrison',
        0
    ),
    (
        "Shift",
        29.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780593444412.jpg?width=640&v=v2',
        'Science & Technology',
        'Ethan Kross',
        20
    ),
    (
        "How the World Eats",
        32.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781639368198.jpg?width=384&v=v2',
        'Science & Technology',
        'Julian Baggini',
        30
    ),
    (
        "Life in Three Dimensions",
        27.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780385550390.jpg?width=384&v=v2',
        'Science & Technology',
        'Shigehiro Oishi',
        40
    ),
    (
        "Ends of the Earth",
        32.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780593186527.jpg?width=384&v=v2',
        'Science & Technology',
        'Neil Shubin',
        30
    ),
    (
        "Air - Borne",
        32.00,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9780593473597.jpg?width=640&v=v2',
        'Science & Technology',
        'Carl Zimmer',
        0
    ),
    (
        "Everything Is Tuberculosis",
        28.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780525556572.jpg?width=384&v=v2',
        'Science & Technology',
        'John Green',
        20
    ),
    (
        "What If We Get It Right ?",
        34.00,
        'This is a test!',
        'out_of_stock',
        'https://images-us.bookshop.org/ingram/9780593229361.jpg?width=384&v=v2',
        'Science & Technology',
        'Ayana Elizabeth Johnson',
        0
    ),
    (
        "Breath",
        29.00,
        'This is a test!',
        'out_of_stock',
        'https://images-us.bookshop.org/ingram/9780735213616.jpg?width=384&v=v2',
        'Science & Technology',
        'James Nestor',
        0
    ),
    (
        "You Deserve a Tech Union",
        20.00,
        'This is a test!',
        'out_of_stock',
        'https://images-us.bookshop.org/ingram/9798991542005.jpg?width=384&v=v2',
        'Science & Technology',
        'Ethan Marcotte',
        0
    ),
    (
        "Doppelganger",
        20.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781250338143.jpg?width=384&v=v2',
        'Science & Technology',
        'Naomi Klein',
        30
    ),
    (
        "The Missing Half",
        30.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780593726983.jpg?width=384&v=v2',
        'Mystery',
        'Ashley Flowers',
        10
    ),
    (
        "Murdle: Volume 1",
        16.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781250892317.jpg?width=384&v=v2',
        'Mystery',
        'G.T.Karber',
        20
    ),
    (
        "The London Séance Society",
        30.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780778387114.jpg?width=384&v=v2',
        'Mystery',
        'Sarah Penner',
        30
    ),
    (
        "A Drop of Corruption",
        30.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780593723821.jpg?width=384&v=v2',
        'Mystery',
        'Robert Jackson Bennett',
        40
    ),
    (
        "The Man Who Died Twice",
        18.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9781984881014.jpg?width=384&v=v2',
        'Mystery',
        'Richard Osman',
        50
    ),
    (
        "How to Solve Your Own Murder",
        28.00,
        'This is a test!',
        'available',
        'https://images-us.bookshop.org/ingram/9780593474013.jpg?width=384&v=v2',
        'Mystery',
        'Kristen Perrin',
        40
    ),
    (
        "The Thursday Murder Club",
        10.99,
        'This is a test!',
        'upcoming',
        'https://images-us.bookshop.org/ingram/9781984880987.jpg?width=384&v=v2',
        'Mystery',
        'Richard Osman',
        0
    ),
    (
        "The Secret History of the Rape Kit",
        19.00,
        'This is a test!',
        'out_of_stock',
        'https://images-us.bookshop.org/ingram/9780593314715.jpg?width=384&v=v2',
        'Mystery',
        'Pagan Kennedy',
        0
    ),
    (
        "The Tainted Cup",
        28.99,
        'This is a test!',
        'out_of_stock',
        'https://images-us.bookshop.org/ingram/9781984820709.jpg?width=384&v=v2',
        'Mystery',
        'Robert Jackson Bennett',
        0
    );

-- Mock data for Cart table
INSERT INTO
    Cart (CustomerID)
VALUES (2),
    (3),
    (4),
    (5);

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
        52.48,
        'credit_card'
    ),
    (
        3,
        '456 Oak Ave, Somewhere, SW 67890',
        'in_transit',
        26.24,
        'electronic_banking'
    ),
    (
        4,
        '789 Pine Rd, Nowhere, NW 54321',
        'pending',
        20.99,
        'cash_on_delivery'
    ),
    (
        5,
        '321 Elm Dr, Everywhere, EW 13579',
        'canceled',
        94.47,
        'credit_card'
    ),
    (
        2,
        '123 Main St, Anytown, AT 12345',
        'pending',
        26.24,
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