import React, { useState } from "react";
import './order.css';

const Order = () => {
  const [orderItems, setOrderItems] = useState([]); // You can initialize this with actual items if needed
  const [totalPrice, setTotalPrice] = useState(0);

  // Example function to add items to the order
  const addItemToOrder = (item, price) => {
    setOrderItems([...orderItems, { item, price }]);
    setTotalPrice(totalPrice + price);
  };

  return (
    <div>
      <div className="banner">
        <div className="bar">
          <ul>
            <li><a href="HomePage.html">Home</a></li>
            <li><a href="Catalog_Menu_Page.html">Menu</a></li>
            <li><a href="about_us_page/about-us-page.html">About Us</a></li>
            <li><a href="Order.html" className="active">Order</a></li>
          </ul>
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
                  <li key={index}>{orderItem.item} - ${orderItem.price.toFixed(2)}</li>
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
              onClick={() => window.location.href = 'index.html'}
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

export default Order;
