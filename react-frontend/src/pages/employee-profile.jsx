// src/components/EmployeeProfile.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/employee-profile.css";

const EmployeeProfile = () => {
  const [user, setUser] = useState(null);
  const [claimedOrders, setClaimedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve stored user_email and user_id (for employees, they are users)
    const email = localStorage.getItem("user_email");
    const userId = localStorage.getItem("user_id");

    if (!email || !userId) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    const fetchProfileAndOrders = async () => {
      try {
        // Fetch employee profile using the /users/<email> endpoint
        const userRes = await fetch(`http://157.245.80.36:5000/users/${email}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user profile.");
        }

        // Fetch all orders
        const orderRes = await fetch(`http://157.245.80.36:5000/orders`, {
          headers: { "Content-Type": "application/json" },
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          // Filter orders claimed by the current user (employee)
          const filteredOrders = orderData.filter(
            order => String(order.claimed_by) === String(userId)
          );
          // Sort orders by newest first using order_date
          filteredOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
          setClaimedOrders(filteredOrders);
        } else {
          console.error("Failed to fetch order history.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, [navigate]);

  // Handler to update an order's status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://157.245.80.36:5000/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      setClaimedOrders(prev =>
        prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order)
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  // Handler to remove an order claim (unclaim)
  const removeOrder = async (orderId) => {
    try {
      const response = await fetch(`http://157.245.80.36:5000/orders/${orderId}/remove-claim`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) {
        throw new Error("Failed to remove order claim");
      }
      setClaimedOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error("Error removing order claim:", error);
      alert("Failed to remove order.");
    }
  };

  // Handler to finalize an order (mark as Completed)
  const finalizeOrder = async (orderId) => {
    try {
      const response = await fetch(`http://157.245.80.36:5000/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Completed" })
      });
      if (!response.ok) {
        throw new Error("Failed to finalize order");
      }
      setClaimedOrders(prev =>
        prev.map(order => order.id === orderId ? { ...order, status: "Completed" } : order)
      );
    } catch (error) {
      console.error("Error finalizing order:", error);
      alert("Failed to finalize order.");
    }
  };

  // Handler for logging out
  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    setClaimedOrders([]);
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  const fullName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Guest";

  if (loading) {
    return <div className="profile-page"><p>Loading...</p></div>;
  }

  return (
    <div className="employee-profile">
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
        <div className="profile-info">
          {user ? (
            <>
              <h1>{user.name || `${user.first_name} ${user.last_name}`}</h1>
              <p>{user.email}</p>
            </>
          ) : (
            <p>Loading employee data...</p>
          )}
        </div>
        
        <section className="claimed-orders">
          <h2>Claimed Orders</h2>
          {claimedOrders.length === 0 ? (
            <p>No orders claimed yet.</p>
          ) : (
            <ul className="order-list">
              {claimedOrders.map(order => (
                <li key={order.id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order #{order.id}</strong>
                    {order.items && Array.isArray(order.items) ? (
                      <p>Items: {order.items.join(', ')}</p>
                    ) : (
                      <p>Items: (none listed)</p>
                    )}
                  </div>

                  <div className="status-and-actions-column">
                    <div className="status-container">
                      <span className="status-label">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="Claimed">Claimed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="order-actions">
                      <button
                        className="action-btn remove-btn"
                        onClick={() => removeOrder(order.id)}
                      >
                        Remove
                      </button>
                      <button
                        className="action-btn finalize-btn"
                        onClick={() => finalizeOrder(order.id)}
                      >
                        Finalize
                      </button>
                    </div>
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

export default EmployeeProfile;
