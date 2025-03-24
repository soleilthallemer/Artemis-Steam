// src/components/employee-dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/employee-dashboard.css';

const EmployeeDashboard = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Get current employee name from localStorage (assumes it's stored upon login)
  const currentEmployee = localStorage.getItem("employee_name") || "Employee";

  useEffect(() => {
    // Fetch orders from backend API dynamically
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://157.245.80.36:5000/orders"); // Replace with your API URL
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        // Assume data is an array of order objects with properties: id, createdAt, items, status, claimedBy
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Separate orders into unclaimed and claimed
  const unclaimedOrders = orders.filter(order => order.claimedBy === null)
    // Sort unclaimed orders in reverse chronological order (newest first)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const claimedOrders = orders.filter(order => order.claimedBy !== null)
    // Sort claimed orders in reverse chronological order (newest first)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // When an employee claims an order, update that order's claimedBy and status.
  // (In a real app, you’d send this update to the backend.)
  const handleClaimOrder = async (orderId) => {
    try {
      // Simulate updating the order via API
      const response = await fetch(`http://157.245.80.36:5000/orders/${orderId}/claim`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ employeeId: currentEmployee })
      });
      if (!response.ok) {
        throw new Error("Failed to claim order");
      }
      // Update local state to reflect the claimed order
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, claimedBy: currentEmployee, status: "Claimed" }
            : order
        )
      );
      // Optionally, navigate to the employee's profile
      // navigate("/employee-profile", { state: { claimedOrderId: orderId } });
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
            <li><Link to="/">Home</Link></li>
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
                <li key={order.id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order #{order.id}</strong>
                    <p>
                      Items:{" "}
                      {order.items
                        .map(item => `${item.name} (${item.size})`)
                        .join(', ')}
                    </p>
                    <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <button className="claim-order-button" onClick={() => handleClaimOrder(order.id)}>
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
                <li key={order.id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order #{order.id}</strong>
                    <p>
                      Items:{" "}
                      {order.items
                        .map(item => `${item.name} (${item.size})`)
                        .join(', ')}
                    </p>
                    <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="order-status">
                    <p>Claimed By: {order.claimedBy}</p>
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
