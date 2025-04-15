import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/adminUserManagement.css';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('all');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedRole === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role === selectedRole));
    }
  }, [users, selectedRole]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const sortedUsers = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    navigate("/admin-login");
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/users/${userId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(prev => prev.filter(user => user.user_id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Could not delete user.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber || undefined,
      role,
      password
    };

    try {
      const response = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (!response.ok) throw new Error('Failed to create user');

      await fetchUsers();
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
      setRole('');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Could not create user.');
    }
  };

  return (
    <div className="admin-user-management dashboard-container">
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
          <Link
            to="/admin-user-management"
            className={`nav-item ${sidebarOpen ? "label" : ""} active`}>
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
        <h2 className="page-title">User Management Portal</h2>

        {/* Create User Form */}
        <form className="create-user-form" onSubmit={handleCreateUser}>
          <h3 className="title-form">Create a New User</h3>
          <input type="text" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required/>
          <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required/>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
          <input type="tel" placeholder="Phone Number (optional)" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <select value={role} onChange={e => setRole(e.target.value)} required>
            <option value="" disabled hidden>
              Select Role
            </option>
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
            <option value="administrator">Administrator</option>
          </select>
          <button type="submit">Add User</button>
        </form>

        {/* Filter Dropdown */}
        <div className="filter-container">
          <label htmlFor="role-filter" className="filter-label">
            Filter by role:
          </label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All</option>
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
            <option value="administrator">Administrator</option>
          </select>
        </div>

        {/* User List */}
        <ul className="user-list">
          {filteredUsers.map(user => (
            <li key={user.user_id} className="user-item">
              <div>
                <strong className="user-info">{`${user.first_name} ${user.last_name}`}
                : {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</strong>
                <p className="user-info">Email: {user.email}</p>
                <p className="user-info">Phone: {user.phone_number || "N/A"}</p>
                <p className="user-info">
                  Registered on: {new Date(user.created_at).toLocaleString()}
                </p>
              </div>
              <button onClick={() => handleDeleteUser(user.user_id)} className="delete-button">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default AdminUserManagement;