import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/profilepage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication immediately
  const email = localStorage.getItem("user_email");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!email || !userId) {
      console.warn("No email or userId found in localStorage. Redirecting to login...");
      navigate("/login", { replace: true });  // Use replace to prevent navigating back
      return;
    }

    async function fetchProfileAndOrders() {
      try {
        const userResponse = await fetch(`http://157.245.80.36:5000/users/${email}`, {
          headers: { "Content-Type": "application/json" }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch profile data.");
        }

        const orderResponse = await fetch(`http://157.245.80.36:5000/orders/${userId}`, {
          headers: { "Content-Type": "application/json" }
        });

        if (orderResponse.ok) {
          const orders = await orderResponse.json();
          setOrderHistory(orders.map(order => ({
            id: order.order_id || "N/A",
            total_price: order.total_amount ? order.total_amount.toFixed(2) : "0.00",
            order_date: order.order_date ? new Date(order.order_date).toLocaleDateString() : "Unknown Date",
            status: order.status || "Pending",
            items: order.items || []
          })));
        } else {
          console.error("Failed to fetch user orders.");
        }
      } catch (error) {
        console.error("Error fetching profile or orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfileAndOrders();
  }, [email, userId, navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    setOrderHistory([]);
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  // 🚀 Prevent rendering if user is not logged in
  if (!email || !userId) {
    return null;  // Ensures component doesn't render anything before redirection
  }

  if (loading) {
    return <div className="profile-page"><p>Loading...</p></div>;
  }

  const fullName = user ? `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Guest" : "Guest";

  return (
    <div className="profile-page">
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order" className="active">Order</Link></li>
          </ul>
        </div>
      </div>

      <div className="container">
        <section className="profile-card">
          {user ? (
            <>
              <div className="profile-info">
                <img 
                  className="profile-picture" 
                  src={user.profilePicture || "/images/profilepicture.jpg"} 
                  alt={fullName || "User profile"} 
                />
                <div className="user-details">
                  <h2 className="username">{fullName}</h2>
                  <p className="email">{user.email || "No email available"}</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
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
            <div className="profile-info">
              <p>Please log in to view your profile.</p>
              <Link to="/login" className="login-button">Login</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
