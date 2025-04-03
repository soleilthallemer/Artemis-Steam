import React, { useState } from "react";
import "../css/admin-login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a backend request
    setTimeout(() => {
      setIsLoading(false);

      if (email && password) {
        alert("Login successful. Welcome to Artemis Café admin panel!");
      } else {
        alert("Login failed. Please enter valid credentials.");
      }
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="admin-login-wrapper">
      {/* Top-left Logo */}
      <div className="admin-login-logo">
        <img src="/images/profilepicture.jpg" alt="Artemis Café Logo" />
      </div>

      {/* Header Section */}
      <div className="admin-login-header">
        <h1>Artemis & Steam</h1>
        <p>Admin Login</p>
      </div>

      {/* Card Section */}
      <div className="admin-login-card">
        <form onSubmit={handleLogin} className="admin-login-form">
          {/* Email */}
          <label htmlFor="email" className="admin-login-label">
            Email
          </label>
          <div className="admin-login-input-wrapper">
            <span className="admin-login-icon material-icons">person</span>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-login-input"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <label htmlFor="password" className="admin-login-label">
            Password
          </label>
          <div className="admin-login-input-wrapper">
            <span className="admin-login-icon material-icons">lock</span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login-input"
              disabled={isLoading}
            />
            <span
              className="toggle-password material-icons"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Login to Dashboard"}
          </button>

          {/* Forgot Password */}
          <a href="#" className="admin-login-forgot">
            Forgot password?
          </a>
        </form>
      </div>

      {/* Footer */}
      <p className="admin-login-footer">
        &copy; {new Date().getFullYear()} Artemis Café. All rights reserved.
      </p>
    </div>
  );
};

export default AdminLogin;
