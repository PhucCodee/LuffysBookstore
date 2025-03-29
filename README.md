Luffy's Bookstore - Full Stack E-commerce Application
<img alt="Luffy's Bookstore Logo" src="/frontend/bookstore/src/assets/logo.png">
A modern, responsive e-commerce bookstore application built with Spring Boot backend and React frontend.

# Overview
Luffy's Bookstore is a full-featured e-commerce application for buying books. It includes book browsing, cart management, checkout flow, and order processing.

# Features

- Browse and search books by title, author
- View detailed book information
- Add books to shopping cart
- Manage cart items (update quantity, remove items)
- Checkout process with shipping and payment options

# Tech Stack
# Backend
- Java 21
- Spring Boot
- Spring Data JPA
- MySQL Database
- RESTful API

# Frontend
- React.js
- React Router
- CSS3 with BEM methodology
- Responsive design

# Database setup
# For macOS with Homebrew

brew install mysql

# Start MySQL service

brew services start mysql

# Log into MySQL

mysql -u root -p

# Run the SQL scripts

source /path/to/LuffysBookstore/backend/demo/src/main/resources/bookstore_schema.sql
source /path/to/LuffysBookstore/backend/demo/src/main/resources/bookstore_data.sql

# Backend setup

cd LuffysBookstore/backend/demo

# Configure application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/bookstore
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=none

# Run Spring Boot application
# Using Maven

./mvnw spring-boot:run

# Frontend setup

cd LuffysBookstore/frontend/bookstore
npm install
npm start
