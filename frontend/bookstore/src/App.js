import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

// Placeholder components - replace these with actual components when you build them
const Cart = () => (
  <div className="page-container">
    <h1>Shopping Cart Page</h1>
    <p>Your cart items will appear here</p>
  </div>
);

const Profile = () => (
  <div className="page-container">
    <h1>User Profile Page</h1>
    <p>Your profile information will appear here</p>
  </div>
);

export default App;