import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/admin-dashboard.css";

const AdminDashboard = () => {

  const [user, setUser] = useState(null);
  const [summaryStats, setSummaryStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const statusOptions = ["Pending", "Claimed", "In Progress", "Completed"];
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("user_email")?.toLowerCase();
    const userId = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");

    if (!email || !userId || !role) {
      // Wait for next render when localStorage is populated
      return;
    }
    
    if (role !== "administrator") {
      setLoading(false);
      alert("Access denied. Administrator only.");
      navigate("/login");
      return;
    }
    

    const fetchDashboardData = async () => {
      try {
        const userRes = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/users/${email}`);
        const userData = await userRes.json();
        if (userData.error) {
          console.error("User fetch error:", userData.error);
          setUser(null);
        } else {
          setUser(userData);
        }
    
        const summaryRes = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/dashboard/summary`);
        const summaryData = await summaryRes.json();
    
        const {
          totalUsers,
          totalProducts,
          totalOrders,
          revenue,
          recentUsers = [],
          recentEmployees = [],
          recentOrders = []
        } = summaryData;
    
        setSummaryStats({ totalUsers, totalProducts, totalOrders, revenue });
        setRecentUsers(recentUsers);
        setRecentEmployees(recentEmployees);
        setRecentOrders(recentOrders);
    
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    

    fetchDashboardData();
  }, [navigate]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const claimOrder = async (orderId) => {
    try {
      const res = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/orders/${orderId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: localStorage.getItem("user_id") }),
      });
      if (res.ok) {
        setRecentOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, claimedBy: `${user.first_name} ${user.last_name}`, status: "Claimed" } : order
          )
        );
      }
    } catch (err) {
      console.error("Error claiming order:", err);
    }
  };

  const editOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRecentOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

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

          <Link to="/admin-dashboard" className="nav-item active">
            <span className="material-icons">dashboard</span>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin-user-management" className="nav-item">
            <span className="material-icons">groups</span>
            {sidebarOpen && <span>User Management</span>}
          </Link>
          <Link to="/admin-product-management" className="nav-item">
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


      {/* Main */}

      <div className="main-content">
        <h2 className="admin-dashboard-title">Dashboard</h2>
        <p className="admin-dashboard-subtitle">Welcome to your admin dashboard.</p>


        <div className="cards-grid">
          {/* Summary Stats */}
          <div className="stats-card">
            <div className="stats-card-icon"><span className="material-icons">groups</span></div>
            <h4>Total Users</h4>
            <p>{summaryStats.totalUsers}</p>
          </div>
          <div className="stats-card">
            <div className="stats-card-icon"><span className="material-icons">inventory_2</span></div>
            <h4>Products</h4>
            <p>{summaryStats.totalProducts}</p>
          </div>
          <div className="stats-card">
            <div className="stats-card-icon"><span className="material-icons">shopping_cart</span></div>
            <h4>Orders</h4>
            <p>{summaryStats.totalOrders}</p>
          </div>
          <div className="stats-card">
            <div className="stats-card-icon"><span className="material-icons">show_chart</span></div>
            <h4>Revenue</h4>
            <p>${Number(summaryStats.revenue).toFixed(2)}</p>
          </div>

          {/* Admin Profile */}
          <div className="profile-section">
            <h3 className="profile-title">Admin Profile</h3>
            {user ? (
              <div className="profile-info">
                <p className="admin-profile-info"><strong className="admin-profile-info">Name:</strong> {user.first_name} {user.last_name}</p>
                <p className="admin-profile-info"><strong className="admin-profile-info">Email:</strong> {user.email}</p>
                <p className="admin-profile-info"><strong className="admin-profile-info">Role:</strong> {user.role.toUpperCase()}</p>
              </div>
            ) : (
              <p>Unable to load admin info.</p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-list">
              <Link to="/admin-user-management"><button>Add New User</button></Link>
              <Link to="/admin-product-management"><button>Create Product</button></Link>
            </div>
          </div>

          {/* Recently Active Employees */}
          <div className="recent-employees-section">
            <h3 className="section-title">Recently Active Employees</h3>
            <ul className="employee-list">
              {recentEmployees.map((employee) => (

                <li key={employee.id}>
                  <strong className="employee-name">{employee.name}</strong><br />
                  <small className="employee-active">Last active: {employee.lastActive}</small>

                </li>
              ))}
            </ul>
          </div>


          {/* Recently Registered Users */}
          <div className="recent-users-section">
            <h3 className="section-title">Recently Registered Users</h3>
            <ul className="user-list">
              {recentUsers.map((user) => (
                <li key={user.id}>
                  <strong className="user-name">{user.name}</strong> <span className="user-email"> - {user.email}</span><br />
                  <small className="user-registered">Registered on: {user.registered}</small>
                </li>
              ))}
            </ul>
          </div>


          {/* Recently Placed Orders */}
          <div className="recent-orders-section">
            <h3 className="section-title">Recently Placed Orders</h3>
            <ul className="order-list">
                {recentOrders
    .filter((order) => order.status.toLowerCase() !== "completed")
    .map((order) => (
      <li key={order.id}>
        <span className="order-label">Order {order.orderNumber}</span>
        <span className="order-label">
          - Status:&nbsp;
          <select
            value={order.status}
            onChange={(e) => editOrderStatus(order.id, e.target.value)}
            className="order-status-dropdown"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </span>
        {order.claimedBy ? (
          <em className="claimed-by"> (Claimed by {order.claimedBy})</em>
        ) : (
          <em className="claimed-by unclaimed"> (Unclaimed)</em>
        )}
        <div className="order-actions">
          {!order.claimedBy && (
            <button onClick={() => claimOrder(order.id)}>Claim</button>
          )}
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

