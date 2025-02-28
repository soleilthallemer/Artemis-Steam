// src/components/RegistrationPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../css/registrationPage.css";


const RegistrationPage = () => {
  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="image-section"></div>
        <div className="right-panel">
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
          <div className="form-section">
            <h1>Register</h1>
            <form>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-container">
                  <span className="icon material-icons">person</span>
                  <input type="text" id="fullName" name="fullName" placeholder="Enter your full name" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">Email or Phone Number</label>
                <div className="input-container">
                  <span className="icon material-icons">mail</span>
                  <input type="text" id="email" name="email" placeholder="Enter your email or phone number" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <span className="icon material-icons">lock</span>
                  <input type="password" id="password" name="password" placeholder="Create a password" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-container">
                  <span className="icon material-icons">lock</span>
                  <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required />
                </div>
              </div>
              <button type="submit" className="btn-register">Register</button>
            </form>
            <div className="login-link">
              <p>Already have an account? <Link to="/login">Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
