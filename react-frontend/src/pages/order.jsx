// src/components/OrderPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Bar from "./bar";
import "../css/bar.css";
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
      // Validate cart items
      const invalidItems = orderItems.filter(item => !item.id || typeof item.id !== "number");
  
      if (invalidItems.length > 0) {
        console.error("Invalid items detected:", invalidItems);
        alert("One or more items in your cart are invalid. Please remove them and try again.");
        return;
      }
  
      const transformedItems = orderItems.map(item => ({
        item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));
  
      console.log("Sending order to backend:", {
        total_amount: totalPrice,
        items: transformedItems,
      });
  
      const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          total_amount: totalPrice,
          items: transformedItems,
        }),
      });
  
      if (response.ok) {
        alert("Your order is complete!");
        setShowOrderPlacedModal(true);
        setOrderItems([]);
        setTotalPrice(0);
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
      <Bar />

      <div style={{ paddingTop: "72px" }}>
      {/* existing container / cart / menu JSX here */}
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

                  {/* ▸ COL‑1  Name and customization */}
                  <div className="order-item-main">
                    <span className="order-item-info">
                      {orderItem.name}
                      {orderItem.size && <> (<strong>{orderItem.size}</strong>)</>}
                      &nbsp;×&nbsp;{orderItem.quantity}
                    </span>

                    {/* custom details */}
                    {orderItem.custom && (
                      <span className="order-item-custom">
                        {/* drinks */}
                        {orderItem.custom.milk && (
                          <>
                            {orderItem.size ? ", " : ""}
                            {orderItem.custom.milk} milk / {orderItem.custom.syrup}
                            {orderItem.custom.syrup !== "None" ? " syrup" : ""}
                          </>
                        )}
                        {/* foods */}
                        {["warmed", "iceCream", "chocolate"]
                          .filter(k => orderItem.custom[k])
                          .map((k, i) => (
                            <React.Fragment key={k}>
                              {i > 0 || orderItem.custom.milk ? ", " : "" }
                              {{
                                warmed:   " warmed",
                                iceCream: " with ice‑cream",
                                chocolate:" chocolate drizzle"
                              }[k]}
                            </React.Fragment>
                          ))}
                      </span>
                    )}
                  </div>

                  {/* ▸ COL‑2  Price */}
                  <span className="order-item-price">
                    ${(orderItem.price * orderItem.quantity).toFixed(2)}
                  </span>

                  {/* ▸ COL‑3  Qty controls */}
                  <span className="quantity-controls">
                    <button className="quantity-btn" onClick={() => handleDecrement(index)}>–</button>
                    <span className="item-quantity">{orderItem.quantity}</span>
                    <button className="quantity-btn" onClick={() => handleIncrement(index)}>+</button>
                  </span>

                  {/* ▸ COL‑4  Remove */}
                    <button className="remove-button" onClick={() => handleRemove(index)}>
                      Remove
                    </button>
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
