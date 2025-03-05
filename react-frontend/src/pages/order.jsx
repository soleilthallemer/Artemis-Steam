// src/components/OrderPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/order.css";

const OrderPage = () => {
  const location = useLocation();
  // Now we store the passed cart items in state so we can clear them later.
  const [orderItems, setOrderItems] = useState(location.state?.cartItems || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Compute the total price from the order items.
    const total = orderItems.reduce((acc, item) => {
      // Remove "$" and convert to number
      const priceNumber = parseFloat(item.price.replace("$", ""));
      return acc + priceNumber * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [orderItems]);

  const handlePlaceOrder = () => {
    // Here you can add any order processing logic if needed.
    // Then, show the confirmation modal.
    setShowOrderPlacedModal(true);
    // Clear the order items so the order table becomes empty.
    setOrderItems([]);
    setTotalPrice(0);
  };

  const closeModal = () => {
    setShowOrderPlacedModal(false);
  };

  const viewOrderInProfile = () => {
    // Navigate to the profile page (or order history page)
    navigate("/profile");
  };

  return (
    <div className="order-page">
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order">Order</Link></li>
            <li><Link to="/login">Log In</Link></li>
            <li><Link to="/profile">Profile</Link></li>
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
                  <li key={index}>
                    {orderItem.name}{" "}
                    {orderItem.size ? `(${orderItem.size})` : ""} x{" "}
                    {orderItem.quantity} - $
                    {(
                      parseFloat(orderItem.price.replace("$", "")) *
                      orderItem.quantity
                    ).toFixed(2)}
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
            <button id="place-order-btn" onClick={handlePlaceOrder}>
              <span>Place Order</span>
            </button>
          </div>
        </div>
      </main>

      {/* Order Placed Modal */}
      {showOrderPlacedModal && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h2>Your order was placed!</h2>
            <p>Would you like to view your order in your profile?</p>
            <div className="order-modal-buttons">
              <button className="view-order-btn" onClick={viewOrderInProfile}>
                View Order
              </button>
              <button className="close-modal-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2025 Artemis &amp; Steam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderPage;
