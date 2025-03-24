import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/profilepage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const userId = localStorage.getItem("user_id");

    if (!email || !userId) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);

    const fetchProfileAndOrders = async () => {
      try {
        const userRes = await fetch(`http://157.245.80.36:5000/users/${email}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user profile.");
        }

        const orderRes = await fetch(`http://157.245.80.36:5000/orders/${userId}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          const formatted = orderData.map((order) => ({
            id: order.order_id || "N/A",
            total_price: order.total_amount ? order.total_amount.toFixed(2) : "0.00",
            order_date: order.order_date
              ? new Date(order.order_date).toLocaleDateString()
              : "Unknown Date",
            status: order.status || "Pending",
            items: order.items || [],
          }));
          setOrderHistory(formatted);
        } else {
          console.error("Failed to fetch order history.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndOrders();
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    setOrderHistory([]);
    localStorage.clear();
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  const fullName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() : "Guest";

  if (loading) {
    return <div className="profile-page"><p>Loading...</p></div>;
  }

  return (
    <div className="profile-page">
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order" className="active">Order</Link></li>
            <li><Link to="/login">Log In</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>
      </div>

      <div className="container">
        <section className="profile-card">
          {isAuthenticated && user ? (
            <>
              <div className="profile-info">
                <img
                  className="profile-picture"
                  src={user.profilePicture || "/images/profilepicture.jpg"}
                  alt={fullName}
                />
                <div className="user-details">
                  <h2 className="username">{fullName}</h2>
                  <p className="email">{user.email || "No email"}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>

              <div className="order-history">
                <h3>Order History</h3>
                {orderHistory.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((order, index) => (
                        <tr key={index}>
                          <td>{order.id}</td>
                          <td>{order.order_date}</td>
                          <td>{order.status}</td>
                          <td>
                            {order.items.length > 0 ? (
                              <ul>
                                {order.items.map((item, i) => (
                                  <li key={i}>
                                    {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              "No items"
                            )}
                          </td>
                          <td>${order.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className="profile-info" style={{ textAlign: "center", marginTop: "2rem" }}>
              <p style={{ fontSize: "1.5rem", color: "black", fontWeight: "bold" }}>
                No user is logged in.
              </p>
              <Link
                to="/login"
                className="login-button"
                style={{
                  display: "inline-block",
                  fontSize: "1.2rem",
                  color: "black",
                  textDecoration: "underline",
                  marginTop: "1rem"
                }}
              >
                Go to Login
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
