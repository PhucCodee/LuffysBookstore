Luffy's Bookstore - A modern, responsive e-commerce bookstore application built with Spring Boot backend and React frontend.
<img alt="Luffy's Bookstore Logo" src="/frontend/bookstore/src/assets/logo.png">

# Overview

Luffy's Bookstore is an e-commerce application for buying books. It includes book browsing, cart management, checkout flow, and order processing.
<img alt="Luffy's Bookstore Home Page" src="/frontend/bookstore/src/assets/HomePage.png">

# Demo
📽️ **[Watch the Demo](https://drive.google.com/file/d/1BBaQdTpQwoMM44Y0qHEWBS_CXJhtNpoZ/view?usp=sharing)**  

# Features

- Browse and search books by title and author
- Different filters for search results (genre, status)
- View detailed book information including descriptions, cover images, and pricing
- Add books to shopping cart
- Manage cart items (update quantity, remove items)
- Simulated checkout process with shipping and payment options
- Order placement (with mock payment processing)

# Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Data JPA
- MySQL Database
- RESTful API

### Frontend

- React.js
- React Router
- CSS3 with BEM methodology
- Responsive design

# Database setup

### For macOS with Homebrew

- brew install mysql
- brew services start mysql
- mysql -u root -p

### For Windows

- Download MySQL Installer from [MySQL official website](https://dev.mysql.com/downloads/installer/)
- Run the installer and select "MySQL Server" at minimum
- Follow the installation wizard (note your root password)
- Start MySQL through Windows Services or MySQL Workbench
- Open Command Prompt and run: `mysql -u root -p`

### Run the SQL scripts

- source /path/to/LuffysBookstore/backend/demo/src/main/resources/bookstore_schema.sql
- source /path/to/LuffysBookstore/backend/demo/src/main/resources/bookstore_data.sql

# Backend setup

### Configure application.properties

- spring.datasource.url=jdbc:mysql://localhost:3306/bookstore
- spring.datasource.username=root
- spring.datasource.password=**yourpassword**
- spring.jpa.hibernate.ddl-auto=none

### Run Spring Boot application

#### On macOS/Linux

- cd LuffysBookstore/backend/demo
- ./mvnw spring-boot:run

#### On Windows

- cd LuffysBookstore\backend\demo
- mvnw.cmd spring-boot:run

# Frontend setup

- cd LuffysBookstore/frontend/bookstore
- npm install
- npm start

# Usage

- Ensure the backend is running (http://localhost:8080).
- Start the frontend and visit http://localhost:3000 in your browser.

# Current Development Status

This project is currently in development with some features not yet fully implemented. Important notes:

#### Development Notes

- **Authentication**: Currently using a hard-coded customer ID (1) for all operations. This ID corresponds to the admin user in the database.
- **Cart Management**: Currently, customer ID 1 (admin user) is used for all carts. In the final implementation, each customer will have one persistent cart that's initialized upon their first visit after registration. This cart remains associated with their account across sessions until items are purchased, at which point the cart items are converted to an order and the cart is cleared but retained for future use.
- **Admin Features**: Admin dashboard for managing books and orders is planned but not yet implemented.
- **Payment Processing**: Payment is simulated and no actual payment processing is implemented.

For a complete list of planned features, please see our [ROADMAP.md](ROADMAP.md) file.
