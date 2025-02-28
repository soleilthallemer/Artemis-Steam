// src/components/ProfilePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../css/profilepage.css";
import profilePicture from "../assets/images/profilepicture.jpg";


const ProfilePage = () => {
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
          <img className="profile-picture" src={profilePicture} alt="Profile Picture" />

            <div className="user-details">
              <h2 className="username">John Doe</h2>
              <p className="email">john.doe@example.com</p>
            </div>
            <Link className="logout-button" to="/logout">
              Logout
            </Link>
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
                {/* Example rows or dynamic data */}
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
    </div>
  );
};

export default ProfilePage;
