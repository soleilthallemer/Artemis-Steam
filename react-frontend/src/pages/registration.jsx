import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/registrationPage.css";

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState(""); // ✅ Separate first name
  const [lastName, setLastName] = useState("");   // ✅ Separate last name
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/auth/register`, { // ✅ Correct API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,  // ✅ Match backend expected keys
          last_name: lastName,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setErrorMsg("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        {/* Left Image Section */}
        <div className="image-section"></div>

        {/* Right Panel with a Page-Specific Banner */}
        <div className="right-panel">
          <div className="banner">
            <div className="bar">
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/order">Order</Link></li>
                <li><Link to="/profile">Profile</Link></li>
              </ul>
            </div>
          </div>

          {/* Form Section */}
          <div className="form-section">
            <h1>Register</h1>
            {errorMsg && <p className="error-message">{errorMsg}</p>}
            {successMsg && <p className="success-message">{successMsg}</p>}

            <form onSubmit={handleRegistration}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-container">
                  <span className="icon material-icons">person</span>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-container">
                  <span className="icon material-icons">person</span>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-container">
                  <span className="icon material-icons">mail</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <div className="input-container">
                  <span className="icon material-icons">phone</span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="(xxx)-xxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    placeholder="Create a password"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-container">
                  <span className="icon material-icons">lock</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <span
                    className="toggle-password material-icons"
                    onClick={toggleConfirmPassword}
                  >
                    {showConfirmPassword ? "visibility" : "visibility_off"}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn-register">
                Register
              </button>
            </form>

            <div className="login-link">
              <p>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
