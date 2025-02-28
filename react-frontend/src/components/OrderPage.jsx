// src/components/OrderPage.jsx
import React, { useState } from "react";
import "../css/orderpage.css";
import { Link } from "react-router-dom";


const OrderPage = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Unused function removed to clear ESLint warnings
  // const addItemToOrder = (item, price) => {
  //   setOrderItems([...orderItems, { item, price }]);
  //   setTotalPrice(totalPrice + price);
  // };

  return (
    <div className="order-page">
      <div className="banner">
        <div className="bar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/order" className="active">
                Order
              </Link>
            </li>
          </ul>
        </div>
        <div className="nav-right">
            <Link to="/login" className="login-btn">Log In</Link>
            <Link to="/profile" className="profile-btn">Profile</Link>
          </div>
      </div>

      <main>
        <div className="order-page-container">
          <h1>Your Current Order</h1>
          <p className="subtitle">Review your items before checkout.</p>

          <div className="order-list-container">
            <ul id="order-list">
              {orderItems.length === 0 ? (
                <li>No items in your order.</li>
              ) : (
                orderItems.map((orderItem, index) => (
                  <li key={index}>
                    {orderItem.item} - ${orderItem.price.toFixed(2)}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="order-summary">
            <p className="total-label">Total Price:</p>
            <p className="total-amount">${totalPrice.toFixed(2)}</p>
          </div>
          <div className="order-actions">
            <button
              id="place-order-btn"
              onClick={() => (window.location.href = "index.html")}
            >
              <span>Place Order</span>
            </button>
          </div>
        </div>
      </main>

      <footer>
        <p>&copy; 2025 Artemis & Steam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderPage;
