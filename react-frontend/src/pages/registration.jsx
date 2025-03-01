import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/registrationPage.css";

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const fullNameParts = fullName.split(" ");
      const firstName = fullNameParts[0];
      const lastName = fullNameParts.slice(1).join(" ");

      const response = await fetch("http://157.245.80.36/customers", { // Replace with your API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          password: password, // Send password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      console.log("Registration successful");
      setLoading(false);
      navigate("/login"); // Redirect to login page
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const [fullName, setFullName] = useState("");

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="image-section"></div>
        <div className="right-panel">
          <div className="form-section">
            <h1>Register</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleRegistration}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-container">
                  <span className="icon material-icons">person</span>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number (Optional)</label>
                <div className="input-container">
                  <span className="icon material-icons">phone</span>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <span className="icon material-icons">lock</span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-container">
                  <span className="icon material-icons">lock</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-register" disabled={loading}>
                {loading ? "Registering..." : "Register"}
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

export default Registration;