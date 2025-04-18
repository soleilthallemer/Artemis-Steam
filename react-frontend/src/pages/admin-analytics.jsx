// src/pages/AdminAnalytics.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/admin-analytics.css";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [mostProductiveEmployees, setMostProductiveEmployees] = useState([]);
  const [mostPopularItems, setMostPopularItems] = useState([]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          `http://${process.env.REACT_APP_API_IP}:5000/dashboard/analytics?range=${timeRange}`
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        // Expecting: { activeUsers: [...], productiveEmployees: [...], popularItems: [...] }
        setMostActiveUsers(json.activeUsers || []);
        setMostProductiveEmployees(json.productiveEmployees || []);
        setMostPopularItems(json.popularItems || []);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  return (
    <div className="admin-analytics dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h1>Artemis &amp; Steam</h1>}
          <button className="close-btn" onClick={toggleSidebar}>
            {sidebarOpen ? "X" : <span className="material-icons">menu</span>}
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="/admin-dashboard"
            className={`nav-item ${sidebarOpen ? "label" : ""}`}
          >
            <span className="material-icons">dashboard</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link
            to="/admin-analytics"
            className={`nav-item ${sidebarOpen ? "label" : ""} active`}
          >
            <span className="material-icons">bar_chart</span>
            {sidebarOpen && <span>Analytics</span>}
          </Link>
          <Link
            to="/admin-message-center"
            className={`nav-item ${sidebarOpen ? "label" : ""}`}
          >
            <span className="material-icons">message</span>
            {sidebarOpen && <span>Messages</span>}
            <span className="badge"></span>
          </Link>
          <Link
            to="/admin-user-management"
            className={`nav-item ${sidebarOpen ? "label" : ""}`}
          >
            <span className="material-icons">groups</span>
            {sidebarOpen && <span>User Management</span>}
          </Link>
          <Link
            to="/admin-product-management"
            className={`nav-item ${sidebarOpen ? "label" : ""}`}
          >
            <span className="material-icons">inventory_2</span>
            {sidebarOpen && <span>Product Management</span>}
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="material-icons">logout</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Page Header */}
        <div className="analytics-header">
          <div className="header-text">
            <h1 className="analytics-title">Analytics Dashboard</h1>
            <p className="analytics-subtitle">
              Monitor your business performance and trends.
            </p>
          </div>
          <div className="time-range-select">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Two-Column Cards */}
        <div className="analytics-cards-row">
          <div className="analytics-card">
            <div className="card-header">
              <h2>Most Active Users</h2>
              <span className="material-icons">groups</span>
            </div>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Activity</th>
                </tr>
              </thead>
              <tbody>
                {mostActiveUsers.map((u) => (
                  <tr key={u.rank}>
                    <td>{u.rank}</td>
                    <td>{u.name}</td>
                    <td>{u.activity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="analytics-card">
            <div className="card-header">
              <h2>Most Productive Employees</h2>
              <span className="material-icons">task_alt</span>
            </div>
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee</th>
                  <th>Tasks</th>
                </tr>
              </thead>
              <tbody>
                {mostProductiveEmployees.map((emp) => (
                  <tr key={emp.rank}>
                    <td>{emp.rank}</td>
                    <td>{emp.name}</td>
                    <td>{emp.tasks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Popular Items */}
        <div className="analytics-card">
          <div className="card-header">
            <h2>Most Popular Items</h2>
            <span className="material-icons">insights</span>
          </div>
          <p className="card-subtitle">
            Top 5 items by sales volume (includes discontinued items)
          </p>
          <div className="popular-items-grid">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {mostPopularItems.map((item) => (
                  <tr key={item.rank}>
                    <td>{item.rank}</td>
                    <td>{item.product}</td>
                    <td>
                      {item.status === "In Stock" && (
                        <span className="status-badge in-stock">
                          In Stock
                        </span>
                      )}
                      {item.status === "Discontinued" && (
                        <span className="status-badge discontinued">
                          Discontinued
                        </span>
                      )}
                    </td>
                    <td>{item.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
