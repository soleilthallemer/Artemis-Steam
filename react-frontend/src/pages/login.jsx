import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();
      const token = data.access_token;

      // Store the token (e.g., in localStorage, cookies)
      localStorage.setItem('token', token);

      console.log('Login successful');
      setLoading(false);
      navigate('/'); // Redirect to home or dashboard
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="left-panel">
        <div className="form-section">
          <h1>Log in</h1>
          <p>Please enter your credentials to log in.</p>
          {loginError && <p className="error-message">{loginError}</p>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label> 
              <div className="input-container">
                <span className="icon material-icons">person</span> 
                <input
                  type="text" // Change type to text since it's a username
                  id="username" // Change id to username
                  name="username" // Change name to username
                  placeholder="Enter your username" // Change placeholder
                  value={username} // Change value to username
                  onChange={(e) => setUsername(e.target.value)} // Change onChange to setUsername
                  required
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
          <div className="register-link">
            <p>
              Don’t have an account?
              <Link to="/registration-page"> Register now</Link>
            </p>
          </div>
        </div>
      </div>
      <div className="image-column"></div>
    </div>
  );
}

export default Login;