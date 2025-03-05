// src/components/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css"; 

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const response = await fetch("https://your-api-endpoint.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Assume the API returns a token; store it and redirect
        localStorage.setItem("token", data.token);
        navigate("/profile");
      } else {
        setErrorMsg(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMsg("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="left-panel">
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
          <h1>Log in</h1>
          <p>Please enter your credentials to log in.</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email or Phone Number</label>
              <div className="input-container">
                <span className="icon material-icons">mail</span>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email or phone number"
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
                <span className="toggle-password material-icons" onClick={togglePassword}>
                  {showPassword ? "visibility" : "visibility_off"}
                </span>
              </div>
            </div>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            <div className="options">
              <label>
                <input type="checkbox" name="rememberMe" /> Remember me
              </label>
              <a href="forgotPassword.html">Forgot Password?</a>
            </div>
            <button type="submit" className="btn-login">Log In</button>
          </form>
          <div className="register-link">
            <p>
              Don’t have an account? <Link to="/register">Register now</Link>
            </p>          
          </div>
        </div>
      </div>
      <div className="image-column"></div>
    </div>
  );
};

export default LoginPage;
