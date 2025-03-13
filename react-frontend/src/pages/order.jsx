// src/components/OrderPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/order.css";

const OrderPage = () => {
  const location = useLocation();
  // Store the passed cart items (default to an empty array)
  const [orderItems, setOrderItems] = useState(location.state?.cartItems || []);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);
  const navigate = useNavigate();
  const orderId = localStorage.getItem("order_id");

  useEffect(() => {
    // Compute total price using numeric values
    const total = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [orderItems]);

  // Combined functionality: place order (via fetch) and then clear order items and show modal
  const handlePlaceOrder = async () => {
    try {
      console.log("total price: ", totalPrice);
      console.log("order Items: ", orderItems)
      const response = await fetch(`http://157.245.80.36:5000/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total_amount: totalPrice, order_items: orderItems }),
      });

      if (response.ok) {
        alert("Your order is complete!");
        // Show confirmation modal
        setShowOrderPlacedModal(true);
        // Clear order items and reset total price
        setOrderItems([]);
        setTotalPrice(0);
      } else {
        console.error("Error placing order:", response.status);
        alert("Error placing order. Please try again later.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again later.");
    }
  };

  const closeModal = () => {
    setShowOrderPlacedModal(false);
  };

  const viewOrderInProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="order-page">
      {/* Banner / Navigation */}
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
                  <li key={index} className="order-item">
                    <span>
                      {orderItem.name} {orderItem.size ? `(${orderItem.size})` : ""} x {orderItem.quantity}
                    </span>
                    <span>${(orderItem.price * orderItem.quantity).toFixed(2)}</span>
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
        <p>© 2025 Artemis &amp; Steam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderPage;
