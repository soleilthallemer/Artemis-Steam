// src/components/EmployeeProfile.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/employee-profile.css';

const EmployeeProfile = () => {
  // 1) Employee data, fetched from backend
  const [employee, setEmployee] = useState(null);

  // 2) Claimed orders for this employee, fetched from backend
  const [claimedOrders, setClaimedOrders] = useState([]);

  // We'll assume the employee's ID is stored in localStorage when they log in
  const employeeId = localStorage.getItem('employee_id');

  // Fetch employee data and claimed orders from backend on mount
  useEffect(() => {
    // If no employee_id is found, handle error or redirect
    if (!employeeId) {
      console.error('No employee_id found in localStorage');
      return;
    }

    // 1) Fetch employee info
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`https://your-backend-url.com/employees/${employeeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee data');
        }
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    // 2) Fetch claimed orders for this employee
    const fetchClaimedOrders = async () => {
      try {
        // Example: your backend might support a query param for claimedBy
        const response = await fetch(`https://your-backend-url.com/orders?claimedBy=${employeeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch claimed orders');
        }
        const orders = await response.json();

        // Optionally sort the orders if you want a specific order
        // e.g. newest first or oldest first
        // Example: newest first:
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setClaimedOrders(orders);
      } catch (error) {
        console.error('Error fetching claimed orders:', error);
      }
    };

    fetchEmployeeData();
    fetchClaimedOrders();
  }, [employeeId]);

  // ========== Methods for updating the front-end state ==========

  // Update order status (PUT/PATCH to backend)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://your-backend-url.com/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // If successful, update state locally
      setClaimedOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    }
  };

  // Remove an order from the list (PUT/PATCH or DELETE to backend)
  const removeOrder = async (orderId) => {
    try {
      // Suppose you have an endpoint that "unclaims" or removes the order
      const response = await fetch(`https://your-backend-url.com/orders/${orderId}/remove-claim`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to remove order claim');
      }

      // If successful, remove from local state
      setClaimedOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error removing order claim:', error);
      alert('Failed to remove order.');
    }
  };

  // Finalize an order (mark as "Completed")
  const finalizeOrder = async (orderId) => {
    try {
      const response = await fetch(`https://your-backend-url.com/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });
      if (!response.ok) {
        throw new Error('Failed to finalize order');
      }

      // Update local state
      setClaimedOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: 'Completed' } : order
        )
      );

      // Optionally remove it from local state if you do not want it shown
      // setClaimedOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error finalizing order:', error);
      alert('Failed to finalize order.');
    }
  };

  return (
    <div className="employee-profile">
      <header className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/employee-dashboard">Dashboard</Link></li>
            <li><Link to="/employee-profile">Profile</Link></li>
            <li><Link to="/login">Log Out</Link></li>
          </ul>
        </div>
      </header>

      <main>
        <div className="profile-info">
          {employee ? (
            <>
              <h1>{employee.name}</h1>
              <p>{employee.email}</p>
            </>
          ) : (
            <p>Loading employee data...</p>
          )}
        </div>

        <section className="claimed-orders">
          <h2>Claimed Orders</h2>
          {claimedOrders.length === 0 ? (
            <p>No orders claimed yet.</p>
          ) : (
            <ul className="order-list">
              {claimedOrders.map(order => (
                <li key={order.id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order #{order.id}</strong>
                    {order.items && Array.isArray(order.items) ? (
                      <p>Items: {order.items.join(', ')}</p>
                    ) : (
                      <p>Items: (none listed)</p>
                    )}
                  </div>

                  <div className="status-and-actions-column">
                    <div className="status-container">
                      <span className="status-label">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="Claimed">Claimed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="order-actions">
                      <button
                        className="action-btn remove-btn"
                        onClick={() => removeOrder(order.id)}
                      >
                        Remove
                      </button>
                      <button
                        className="action-btn finalize-btn"
                        onClick={() => finalizeOrder(order.id)}
                      >
                        Finalize
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer>
        <p>© 2025 Artemis &amp; Steam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeProfile;
