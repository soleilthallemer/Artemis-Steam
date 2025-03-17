// src/components/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';

const LoginPage = () => {
  const [email, setEmail] = useState(''); // using email instead of username
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      localStorage.setItem("user_email", email);

      // Call handleGetUser after successful login
      await handleGetUser();
      setLoading(false);
      navigate('/'); // Redirect after successful login
    } catch (error) {
      setLoginError(error.message);
      setLoading(false);
    }
  };

  const handleGetUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch(`http://157.245.80.36:5000/users/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${token}`, // Uncomment if needed
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user data");
      }
  
      const userData = await response.json();
  
      // Store each user property in localStorage
      Object.keys(userData).forEach((key) => {
        const value = userData[key];
        if (value !== null && value !== undefined) {
          localStorage.setItem(key, value.toString());
        } else {
          localStorage.setItem(key, "");
        }
      });
  
      console.log("User Data Retrieved:", userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        {/* Page-Specific Banner */}
        <div className="banner">
          <div className="bar">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/order">Order</Link></li>
            </ul>
          </div>
        </div>

        {/* Form Section */}
        <div className="form-section">
          <h1>Log in</h1>
          <p>Please enter your credentials to log in.</p>
          {loginError && <p className="error-message">{loginError}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                <span className="icon material-icons">mail</span>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <span className="icon material-icons">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password material-icons"
                  onClick={togglePassword}
                >
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className="register-link">
            <p>
              Don’t have an account? <Link to="/registration-page">Register now</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="image-column"></div>
    </div>
  );
};

export default LoginPage;
