import React from 'react';
import { useLocation } from 'react-router-dom';
import '../css/order.css';

function Order() {
  const location = useLocation();
  const cartItems = location.state?.cartItems || ``;

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://157.245.80.36/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      });

      if (response.ok) {
        // Order placed successfully
        alert('Your order is complete!');
      } else {
        // Handle error
        console.error('Error placing order:', response.status);
        alert('Error placing order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again later.');
    }
  };

  return (
    <>
      <title>Current Order</title>
      <main>
        <div className="order-page-container">
          <h1>Your Current Order</h1>
          <p className="subtitle">Review your items before checkout.</p>
          <div className="order-list-container">
            <ul id="order-list">
              {cartItems.map((item) => (
                <li key={item.item_id} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="order-summary">
            <p className="total-label">Total Price:</p>
            <p className="total-amount">${totalPrice.toFixed(2)}</p>
          </div>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      </main>
      <footer>
        <p>© 2025 Artemis &amp; Steam. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Order;