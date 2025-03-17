import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/profilepage.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const email = localStorage.getItem("user_email");
  const userId = localStorage.getItem("user_id");
  const fullName = `${localStorage.getItem("first_name") || ""} ${localStorage.getItem("last_name") || ""}`;

  useEffect(() => {
    async function fetchProfileAndOrders() {
      if (!email || !userId) {
        console.warn("No email or userId found in localStorage.");
        navigate("/login"); // Redirect to login if no user info is found
        return;
      }

      try {
        // Fetch user profile
        const userResponse = await fetch(`http://157.245.80.36:5000/users/${email}`, {
          headers: { "Content-Type": "application/json" }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch profile data.");
        }

        // Fetch user orders
        const orderResponse = await fetch(`http://157.245.80.36:5000/orders/${userId}`, {
          headers: { "Content-Type": "application/json" }
        });

        if (orderResponse.ok) {
          const orders = await orderResponse.json();
          console.log("Raw Order Data:", orders); // Debugging log

          // Ensure order data is formatted correctly
          const formattedOrders = orders.map(order => ({
            id: order.order_id, // ✅ Change from `order.id` to `order.order_id`
            total_price: order.total_amount ? order.total_amount.toFixed(2) : "0.00",
            order_date: order.order_date ? new Date(order.order_date).toLocaleDateString() : "Unknown Date"
          }));

          console.log("Formatted Orders:", formattedOrders); // Debugging log
          setOrderHistory(formattedOrders);
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

  // ✅ Directly log out the user
  const handleLogout = (e) => {
    e.preventDefault();
    setUser(null);
    setOrderHistory([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    localStorage.removeItem("first_name");
    localStorage.removeItem("last_name");
    navigate("/login"); // ✅ Redirect to login page immediately
  };

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
          </ul>
        </div>
      </div>

      <div className="container">
        <section className="profile-card">
          <div className="profile-info">
            <img className="profile-picture" src={user?.profilePicture || "/images/profilepicture.jpg"} alt={fullName || "User profile"} />
            <div className="user-details">
              <h2 className="username">{fullName || "User"}</h2>
              <p className="email">{user?.email || ""}</p>
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
                  <tr><th>Order #</th><th>Date</th><th>Price</th></tr>
                </thead>
                <tbody>
                  {orderHistory.map((order, index) => (
                    <tr key={index}>
                      <td>{order.id || order.order_id || "N/A"}</td>
                      <td>{order.order_date}</td>
                      <td>${order.total_price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
