// src/components/ProfilePage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/profilepage.css";
import profilePicture from "../assets/images/profilepicture.jpg";

const ProfilePage = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const closeModal = () => {
    setShowLogoutModal(false);
    // Optionally navigate to the login page after closing the modal
    navigate("/login");
  };

  return (
    <div className="profile-page">
      {/* Optional Banner */}
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
            {/* Updated alt text to remove redundancy */}
            <img className="profile-picture" src={profilePicture} alt="John Doe" />
            <div className="user-details">
              <h2 className="username">John Doe</h2>
              <p className="email">john.doe@example.com</p>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="order-history">
            <h3>Order History</h3>
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
                {/* Example row; replace with dynamic data as needed */}
                <tr>
                  <td>001</td>
                  <td>Latte, Croissant</td>
                  <td>Delivered</td>
                  <td>$7.50</td>
                </tr>
              </tbody>
            </table>
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
