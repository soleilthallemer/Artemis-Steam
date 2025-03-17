// src/components/OrderPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/order.css";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = localStorage.getItem("order_id");

  // Initialize orderItems from localStorage if available, otherwise from location.state
  const [orderItems, setOrderItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : (location.state?.cartItems || []);
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [showOrderPlacedModal, setShowOrderPlacedModal] = useState(false);

  // Calculate total price whenever orderItems changes
  useEffect(() => {
    const total = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [orderItems]);

  // Increase item quantity by 1
  const handleIncrement = (index) => {
    setOrderItems((prevItems) => {
      const updated = [...prevItems];
      updated[index].quantity += 1;
      // Persist changes to localStorage
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };

  // Decrease item quantity by 1 (remove if quantity goes to 0)
  const handleDecrement = (index) => {
    setOrderItems((prevItems) => {
      const updated = [...prevItems];
      if (updated[index].quantity > 1) {
        updated[index].quantity -= 1;
      } else {
        updated.splice(index, 1);
      }
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };

  // Remove an item entirely
  const handleRemove = (index) => {
    setOrderItems((prevItems) => {
      const updated = [...prevItems];
      updated.splice(index, 1);
      localStorage.setItem("cartItems", JSON.stringify(updated));
      return updated;
    });
  };

  // Place Order: update the order with total_amount and order_items
  const handlePlaceOrder = async () => {
    try {
      console.log("Total Price: ", totalPrice);
      console.log("Order Items: ", orderItems);
      const response = await fetch(`http://157.245.80.36:5000/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ total_amount: totalPrice, order_items: orderItems }),
      });

      if (response.ok) {
        alert("Your order is complete!");
        setShowOrderPlacedModal(true);
        setOrderItems([]);
        setTotalPrice(0);
        // Clear the saved cart items from localStorage
        localStorage.removeItem("cartItems");
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
                    {/* Column 1: Name (size) x quantity */}
                    <span className="order-item-info">
                      {orderItem.name} {orderItem.size ? `(${orderItem.size})` : ""} x {orderItem.quantity}
                    </span>
                    {/* Column 2: Price */}
                    <span className="order-item-price">
                      ${ (orderItem.price * orderItem.quantity).toFixed(2) }
                    </span>
                    {/* Column 3: Quantity controls */}
                    <span className="quantity-controls">
                      <button className="quantity-btn" onClick={() => handleDecrement(index)}>–</button>
                      <span className="item-quantity">{orderItem.quantity}</span>
                      <button className="quantity-btn" onClick={() => handleIncrement(index)}>+</button>
                    </span>
                    {/* Column 4: Remove button */}
                    <button className="remove-button" onClick={() => handleRemove(index)}>Remove</button>
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

      {showOrderPlacedModal && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h2>Your order was placed!</h2>
            <p>Would you like to view your order in your profile?</p>
            <div className="order-modal-buttons">
              <button className="view-order-btn" onClick={viewOrderInProfile}>View Order</button>
              <button className="close-modal-btn" onClick={closeModal}>Close</button>
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
