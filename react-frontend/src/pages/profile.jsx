// src/components/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/profilepage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile and order history data from API
    async function fetchProfile() {
      try {
        const response = await fetch("https://your-api-endpoint.com/profile", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          // Assuming API returns an object with user and orderHistory properties
          setUser(data.user);
          setOrderHistory(data.orderHistory);
        } else {
          console.error("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const closeModal = () => {
    setShowLogoutModal(false);
    // Clear stored token and navigate to login page
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return <div className="profile-page"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-page">
      {/* Banner */}
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order" className="active">Order</Link></li>
          </ul>
        </div>
      </div>

      {/* Main Container */}
      <div className="container">
        <section className="profile-card">
          <div className="profile-info">
            {/* Use an absolute path to the image in public */}
            <img 
              className="profile-picture" 
              src={user && user.profilePicture ? user.profilePicture : "/images/profilepicture.jpg"} 
              alt={user ? user.name : "User profile"} 
            />
            <div className="user-details">
              <h2 className="username">{user ? user.name : "User"}</h2>
              <p className="email">{user ? user.email : ""}</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="order-history">
            <h3>Order History</h3>
            {orderHistory.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map((order, index) => (
                    <tr key={index}>
                      <td>{order.orderNumber}</td>
                      <td>{order.items.join(", ")}</td>
                      <td>{order.status}</td>
                      <td>${order.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>You have successfully logged out.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      <footer>
        <p>&copy; 2025 Artemis &amp; Steam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProfilePage;
