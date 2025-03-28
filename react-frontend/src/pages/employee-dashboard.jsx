import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/employee-dashboard.css';

const EmployeeDashboard = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Use employee id stored in localStorage after login
  const currentEmployeeId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://157.245.80.36:5000/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders to only show those that are not "Completed"
  const unclaimedOrders = orders
    .filter(order => order.claimed_by == null && order.status !== "Completed")
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

  const claimedOrders = orders
    .filter(order => order.claimed_by != null && order.status !== "Completed")
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

  // When an employee claims an order, update that order's claimed_by and status.
  const handleClaimOrder = async (orderId) => {
    try {
      const response = await fetch(`http://157.245.80.36:5000/orders/${orderId}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id: currentEmployeeId })
      });
      if (!response.ok) {
        throw new Error("Failed to claim order");
      }
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.order_id === orderId
            ? { ...order, claimed_by: currentEmployeeId, status: "Claimed" }
            : order
        )
      );
    } catch (error) {
      console.error("Error claiming order:", error);
      alert("Error claiming order. Please try again.");
    }
  };

  return (
    <div className="employee-dashboard">
      <header className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/employee-dashboard">Dashboard</Link></li>
            <li><Link to="/employee-profile">Profile</Link></li>
            <li><Link to="/login">Log Out</Link></li>
          </ul>
        </div>
      </header>
      <main>
        <h1>Order Dashboard</h1>
  
        {/* Unclaimed Orders Section */}
        <section className="unclaimed-orders">
          <h2>Unclaimed Orders</h2>
          {unclaimedOrders.length === 0 ? (
            <p>No unclaimed orders at the moment.</p>
          ) : (
            <ul className="order-list">
              {unclaimedOrders.map(order => (
                <li key={order.order_id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order #{order.order_id}</strong>
                    <p>
                      Items:{" "}
                      {order.items && Array.isArray(order.items) && order.items.length > 0
                        ? order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
                        : "No items listed"}
                    </p>
                    <p>Created At: {new Date(order.order_date).toLocaleString()}</p>
                  </div>
                  <button className="claim-order-button" onClick={() => handleClaimOrder(order.order_id)}>
                    Claim Order
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
  
        {/* Claimed Orders Section */}
        <section className="claimed-orders">
          <h2>Claimed Orders</h2>
          {claimedOrders.length === 0 ? (
            <p>No claimed orders at the moment.</p>
          ) : (
            <ul className="order-list">
              {claimedOrders.map(order => (
                <li key={order.order_id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order #{order.order_id}</strong>
                    <p>
                      Items:{" "}
                      {order.items && Array.isArray(order.items) && order.items.length > 0
                        ? order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
                        : "No items listed"}
                    </p>
                    <p>Created At: {new Date(order.order_date).toLocaleString()}</p>
                  </div>
                  <div className="order-status">
                    <p>Claimed By: {order.claimed_by}</p>
                    <p>Status: {order.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <footer>
        <p>© 2025 Artemis &amp; Steam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
