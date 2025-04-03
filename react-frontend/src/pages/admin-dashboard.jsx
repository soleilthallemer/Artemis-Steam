import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/admin-dashboard.css";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Dynamic state variables
  const [adminInfo, setAdminInfo] = useState({ name: "", email: "", role: "" });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0
  });

  // Fetch all dynamic dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, profileRes, usersRes, employeesRes, ordersRes] = await Promise.all([
          fetch("/api/dashboard/summary"),
          fetch("/api/admin/profile"),
          fetch("/api/users/recent"),
          fetch("/api/employees/active"),
          fetch("/api/orders/recent")
        ]);

        const [summaryData, profileData, usersData, employeesData, ordersData] = await Promise.all([
          summaryRes.json(),
          profileRes.json(),
          usersRes.json(),
          employeesRes.json(),
          ordersRes.json()
        ]);

        setSummaryStats(summaryData);
        setAdminInfo(profileData);
        setRecentUsers(usersData);
        setRecentEmployees(employeesData);
        setRecentOrders(ordersData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  // Sidebar toggle & logout
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleLogout = () => navigate("/admin-login");

  // Order actions
  const claimOrder = (orderId) => {
    setRecentOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, claimedBy: adminInfo.name, status: "Claimed" }
          : order
      )
    );
  };

  const editOrderStatus = (orderId, newStatus) => {
    setRecentOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="admin-dashboard dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h1>Artemis &amp; Steam</h1>}
          <button className="close-btn" onClick={toggleSidebar}>
            {sidebarOpen ? "X" : <span className="material-icons">menu</span>}
          </button>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin-dashboard" className={`nav-item ${sidebarOpen ? "label" : ""} active`}>
            <span className="material-icons">dashboard</span>
            {sidebarOpen && <span>Dashboard</span>}
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
        <h2 className="admin-dashboard-title">Dashboard</h2>
        <p className="admin-dashboard-subtitle">Welcome to your admin dashboard.</p>

        {/* 3x3 Grid Container */}
        <div className="cards-grid">
          {/* Card 1: Total Users */}
          <div className="stats-card">
            <div className="stats-card-icon">
              <span className="material-icons">groups</span>
            </div>
            <h4>Total Users</h4>
            <p>{summaryStats.totalUsers}</p>
          </div>

          {/* Card 2: Products */}
          <div className="stats-card">
            <div className="stats-card-icon">
              <span className="material-icons">inventory_2</span>
            </div>
            <h4>Products</h4>
            <p>{summaryStats.totalProducts}</p>
          </div>

          {/* Card 3: Orders */}
          <div className="stats-card">
            <div className="stats-card-icon">
              <span className="material-icons">shopping_cart</span>
            </div>
            <h4>Orders</h4>
            <p>{summaryStats.totalOrders}</p>
          </div>

          {/* Card 4: Revenue */}
          <div className="stats-card">
            <div className="stats-card-icon">
              <span className="material-icons">show_chart</span>
            </div>
            <h4>Revenue</h4>
            <p>${summaryStats.revenue}</p>
          </div>

          {/* Card 5: Admin Profile */}
          <div className="profile-section">
            <h3 className="profile-title">Admin Profile</h3>
            <div className="profile-info">
              <p className="profile-line">
                <span className="profile-label">Name:</span> {adminInfo.name}
              </p>
              <p className="profile-line">
                <span className="profile-label">Email:</span> {adminInfo.email}
              </p>
              <p className="profile-line">
                <span className="profile-label">Role:</span> {adminInfo.role}
              </p>
            </div>
          </div>

          {/* Card 6: Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <p>Commonly used functions</p>
            <div className="actions-list">
              <Link to="/admin-user-management">
                <button>Add New User</button>
              </Link>
              <Link to="/admin-product-management">
                <button>Create Product</button>
              </Link>
            </div>
          </div>

          {/* Card 7: Recently Active Employees */}
          <div className="recent-employees-section">
            <h3 className="section-title">Recently Active Employees</h3>
            <ul className="employee-list">
              {recentEmployees.map((employee) => (
                <li className="employee-item" key={employee.id}>
                  <strong className="employee-name">{employee.name}</strong>
                  <br />
                  <small className="employee-active">
                    Last active: {employee.lastActive}
                  </small>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 8: Recently Registered Users */}
          <div className="recent-users-section">
            <h3 className="section-title">Recently Registered Users</h3>
            <ul className="user-list">
              {recentUsers.map((user) => (
                <li className="user-item" key={user.id}>
                  <strong className="user-name">{user.name}</strong> - 
                  <span className="user-email"> {user.email}</span>
                  <br />
                  <small className="user-registered">
                    Registered on: {user.registered}
                  </small>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 9: Recently Placed Orders */}
          <div className="recent-orders-section">
            <h3 className="section-title">Recently Placed Orders</h3>
            <ul className="order-list">
              {recentOrders.map((order) => (
                <li className="order-item" key={order.id}>
                  <span className="order-label">Order {order.orderNumber}</span> 
                  <span className="order-status"> - Status: {order.status}</span>{" "}
                  {order.claimedBy && (
                    <em className="order-claimed">
                      (Claimed by {order.claimedBy})
                    </em>
                  )}
                  <div className="order-actions">
                    {!order.claimedBy && (
                      <button className="claim-btn" onClick={() => claimOrder(order.id)}>
                        Claim Order
                      </button>
                    )}
                    <button
                      className="complete-btn"
                      onClick={() => editOrderStatus(order.id, "Completed")}
                    >
                      Mark as Completed
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
