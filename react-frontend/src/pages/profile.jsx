import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/profilepage.css";

const Profile = () => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // Get token
        if (!token) {
          throw new Error("No token found");
        }
        // Fetch customer data
        const customerResponse = await fetch("http://157.245.80.36:5000/customers", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token
          },
        });
        if (!customerResponse.ok) {
          throw new Error("Failed to fetch customer data");
        }
        const customerData = await customerResponse.json();
        setCustomer(customerData[0]);

        // Fetch order history
        const ordersResponse = await fetch("http://157.245.80.36:5000/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.filter((order) => order.customer_id === customerData[0].id)); //Filter orders
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!customer) return <p>No customer data available.</p>;

  return (
    <div className="profile-page">
      <div className="banner">
        <div className="bar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/order" className="active">Order</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container">
        <section className="profile-card">
          <div className="profile-info">
          <img className="profile-picture" src="/images/profilepicture.jpg" alt="Profile" />
            <div className="user-details">
              <h2 className="username">
                {customer.first_name} {customer.last_name}
              </h2>
              <p className="email">{customer.email}</p>
            </div>
            <Link className="logout-button" to="/logout">
              Logout
            </Link>
          </div>

          <div className="order-history">
            <h3>Order History</h3>
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer ID</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer_id}</td>
                    <td>{order.order_date}</td>
                    <td>${order.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;