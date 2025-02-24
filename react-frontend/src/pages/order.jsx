import React from 'react';
import '../css/order.css'; // Import CSS

function Order() {
  return (
    <>
      <title>Current Order</title>
      <main>
        <div className="order-page-container">
          <h1>Your Current Order</h1>
          <p className="subtitle">Review your items before checkout.</p>
          <div className="order-list-container">
            <ul id="order-list">
              {/* Order items will be dynamically added here */}
            </ul>
          </div>
          <div className="order-summary">
            <p className="total-label">Total Price:</p>
            <p className="total-amount">
              $<span id="total-price">0.00</span>
            </p>
          </div>
        </div>
      </main>
      <footer>
        <p>© 2025 Artemis &amp; Steam. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Order;