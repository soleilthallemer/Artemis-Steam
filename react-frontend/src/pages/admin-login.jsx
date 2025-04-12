import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/admin-login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await fetch('http://157.245.80.36:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user_email', email);

      await handleGetUser();

      const role = localStorage.getItem('role');
      if (role === 'administrator') {
        setIsLoading(false);
        navigate('/admin-dashboard');
      } else {
        setIsLoading(false);
        setLoginError('Access denied. You must be an administrator to access this panel.');
        localStorage.clear();
      }
    } catch (error) {
      setLoginError(error.message);
      setIsLoading(false);
    }
  };

  const handleGetUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://157.245.80.36:5000/users/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data');
      }

      const userData = await response.json();

      Object.keys(userData).forEach((key) => {
        const value = userData[key];
        localStorage.setItem(key, value !== null && value !== undefined ? value.toString() : '');
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className="admin-login-wrapper">
      {/* Logo */}
      <div className="admin-login-logo">
        <img src="/images/profilepicture.jpg" alt="Artemis Café Logo" />
      </div>

      {/* Header */}
      <div className="admin-login-header">
        <h1>Artemis & Steam</h1>
        <p>Admin Login</p>
      </div>

      {/* Login Card */}
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
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-login-input"
              disabled={isLoading}
              required
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
              required
            />
            <span
              className="toggle-password material-icons"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </div>

          {/* Error Message */}
          {loginError && <p className="admin-login-error">{loginError}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Login to Dashboard"}
          </button>

          {/* Forgot Password */}
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="admin-login-forgot"
          >
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
