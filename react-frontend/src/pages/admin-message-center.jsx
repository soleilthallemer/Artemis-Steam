// src/pages/AdminMessageCenter.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/admin-message-center.css"; // your existing styles

const AdminMessageCenter = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // fetched messages and selected message
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  // fetch the list of messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/admin/contact-submissions`);
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        // expecting an array of { id, subject, from, date, time, body }
        setMessages(data);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };
    fetchMessages();
  }, []);

  const handleViewMessage = (msg) => {
    setSelectedMessage(msg);
  };
  const handleBackToMessages = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="admin-message-center dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h1>Artemis &amp; Steam</h1>}
          <button className="close-btn" onClick={toggleSidebar}>
            {sidebarOpen ? "X" : <span className="material-icons">menu</span>}
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin-dashboard" className={`nav-item ${sidebarOpen ? "label" : ""}`}>
            <span className="material-icons">dashboard</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin-analytics" className={`nav-item ${sidebarOpen ? "label" : ""}`}>
            <span className="material-icons">bar_chart</span>
            {sidebarOpen && <span>Analytics</span>}
          </Link>
          <Link
            to="/admin-message-center"
            className={`nav-item ${sidebarOpen ? "label" : ""} active`}
          >
            <span className="material-icons">message</span>
            {sidebarOpen && <span>Messages</span>}
            <span className="badge">{messages.length}</span>
          </Link>
          <Link to="/admin-user-management" className={`nav-item ${sidebarOpen ? "label" : ""}`}>
            <span className="material-icons">groups</span>
            {sidebarOpen && <span>User Management</span>}
          </Link>
          <Link to="/admin-product-management" className={`nav-item ${sidebarOpen ? "label" : ""}`}>
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

      {/* Main Content */}
      <div className="main-content">
        <h1 className="message-center-title">Message Center</h1>
        <p className="message-center-subtitle">View and respond to customer inquiries</p>

        {selectedMessage ? (
          <div className="message-detail">
            <button className="back-btn" onClick={handleBackToMessages}>
              <span className="material-icons">arrow_back</span>
              Back to messages
            </button>
            <h2 className="message-subject">{selectedMessage.subject}</h2>
            <p className="message-meta">
              From: {selectedMessage.from}
              <br />
              Received: {selectedMessage.created_at}
            </p>
            <div className="message-body">{selectedMessage.message}</div>
          </div>
        ) : (
          <div className="message-list-container">
            <div className="message-card">
              <div className="message-card-header">
                <span className="material-icons">message</span>
                <h2>Customer Messages</h2>
              </div>
              <table className="message-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Recieved</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} onClick={() => handleViewMessage(msg)}>
                      <td>{msg.subject}</td>
                      <td>{msg.name}</td>
                      <td>{msg.email}</td>
                      <td>{msg.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessageCenter;
