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
    // Use stored user_email and user_id (for employees, they are users)
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
        // Fetch user profile using the /users/<email> endpoint
        const userRes = await fetch(`http://157.245.80.36:5000/users/${email}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user profile.");
        }

        // Fetch all orders and then filter those claimed by this user (employee)
        const orderRes = await fetch(`http://157.245.80.36:5000/orders`, {
          headers: { "Content-Type": "application/json" },
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          // Filter orders where claimed_by equals the current user's id.
          const filteredOrders = orderData.filter(
            order => order.claimed_by == userId
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
  }, []);

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
    <div className="profile-page">
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/employee-dashboard">Dashboard</Link></li>
            <li><Link to="/employee-profile">Profile</Link></li>
            <li><Link to="/login">Log Out</Link></li>
          </ul>
        </div>
      </div>

      <div className="container">
        <section className="profile-card">
          {isAuthenticated && user ? (
            <>
              <div className="profile-info">
                <img
                  className="profile-picture"
                  src={user.profilePicture || "/images/profilepicture.jpg"}
                  alt={fullName}
                />
                <div className="user-details">
                  <h2 className="username">{fullName}</h2>
                  <p className="email">{user.email || "No email"}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>

              <div className="order-history">
                <h3>Order History</h3>
                {claimedOrders.length === 0 ? (
                  <p>No orders claimed yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {claimedOrders.map((order, index) => (
                        <tr key={index}>
                          <td>{order.order_id}</td>
                          <td>
                            {order.order_date
                              ? new Date(order.order_date).toLocaleDateString()
                              : "Unknown Date"}
                          </td>
                          <td>{order.status || "Pending"}</td>
                          <td>
                            {order.items && order.items.length > 0 ? (
                              <ul>
                                {order.items.map((item, i) => (
                                  <li key={i}>
                                    {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              "No items"
                            )}
                          </td>
                          <td>${order.total_amount ? order.total_amount.toFixed(2) : "0.00"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className="profile-info" style={{ textAlign: "center", marginTop: "2rem" }}>
              <p style={{ fontSize: "1.5rem", color: "black", fontWeight: "bold" }}>
                No user is logged in.
              </p>
              <Link
                to="/login"
                className="login-button"
                style={{
                  display: "inline-block",
                  fontSize: "1.2rem",
                  color: "black",
                  textDecoration: "underline",
                  marginTop: "1rem"
                }}
              >
                Go to Login
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default EmployeeProfile;
