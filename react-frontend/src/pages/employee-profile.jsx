// src/components/EmployeeProfile.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/employee-profile.css";

const EmployeeProfile = () => {
  /* ───────────────────────── helpers ───────────────────────── */

  /** ensure predictable shape: { size, custom:{} } */
  const normaliseItem = (raw) => {
    let custom = raw.customizations ?? raw.custom;   // back‑end may call it either
    if (typeof custom === "string" && custom.trim().startsWith("{")) {
      try   { custom = JSON.parse(custom); }
      catch { custom = {}; }
    }
    custom = custom || {};

    const size = raw.size || custom.size || null;

    return { ...raw, size, custom };
  };

  /** human‑readable summary */
  const formatItem = (item) => {
    const { name, size, quantity } = item;
    const c = item.custom || {};

    const parts = [];
    parts.push(`${name}${size ? ` – ${size}` : ""}`);

    /* drink custom options */
    if (c.milk || c.syrup) {
      const milk  = c.milk  ?? "Whole";
      const syrup = c.syrup ?? "None";
      parts.push(`${milk} milk${syrup !== "None" ? `, ${syrup} syrup` : ""}`);
    }

    /* food flags */
    if (c.warmed)    parts.push("warmed");
    if (c.iceCream)  parts.push("with ice‑cream");
    if (c.chocolate) parts.push("chocolate drizzle");

    parts.push(`x${quantity}`);
    return parts.join(" | ");
  };

  /* ───────────────────────── state ─────────────────────────── */
  const [user, setUser]                   = useState(null);
  const [claimedOrders, setClaimedOrders] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [isAuthenticated, setAuth]        = useState(false);
  const navigate                          = useNavigate();

  /* ───────────────────────── effects ────────────────────────── */
  useEffect(() => {
    const email   = localStorage.getItem("user_email");
    const userId  = localStorage.getItem("user_id");

    if (!email || !userId) {
      setAuth(false);
      setLoading(false);
      return;
    }
    setAuth(true);

    (async () => {
      try {
        /* ── profile */
        const uRes = await fetch(
          `http://${process.env.REACT_APP_API_IP}:5000/users/${email}`
        );
        if (uRes.ok) setUser(await uRes.json());

        /* ── orders */
        const oRes = await fetch(
          `http://${process.env.REACT_APP_API_IP}:5000/orders`
        );
        if (oRes.ok) {
          const allOrders = await oRes.json();

          /* keep only orders claimed by this employee and normalise items */
          const mine = allOrders
            .filter((o) => String(o.claimed_by) === String(userId))
            .map((o) => ({
              ...o,
              items: Array.isArray(o.items)
                ? o.items.map(normaliseItem)
                : [],
            }))
            .sort((a, b) => new Date(b.order_date) - new Date(a.order_date)); // newest first

          setClaimedOrders(mine);
        }
      } catch (err) {
        console.error("Error fetching profile/orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  /* ───────────────────────── actions (unchanged) ───────────── */
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(
        `http://${process.env.REACT_APP_API_IP}:5000/orders/${orderId}/status`,
        {
          method : "PATCH",
          headers: { "Content-Type": "application/json" },
          body   : JSON.stringify({ status }),
        }
      );
      if (!res.ok) throw new Error();
      setClaimedOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? { ...o, status } : o))
      );
    } catch {
      alert("Failed to update order status.");
    }
  };

  const unclaimOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://${process.env.REACT_APP_API_IP}:5000/orders/${orderId}/remove-claim`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error();
      setClaimedOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    } catch {
      alert("Failed to remove order.");
    }
  };

  const finalizeOrder = async (orderId) => {
    await updateOrderStatus(orderId, "Completed");
    await unclaimOrder(orderId);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  /* ───────────────────────── render ─────────────────────────── */
  if (loading) return <div className="profile-page">Loading…</div>;

  return (
    <div className="employee-profile">
      <header className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/employee-dashboard">Dashboard</Link></li>
            <li><Link to="/employee-profile">Profile</Link></li>
            <li><Link to="/login">Log Out</Link></li>
          </ul>
        </div>
      </header>

      <main>
        <div className="profile-info">
          {user ? (
            <>
              <h1>{`${user.first_name} ${user.last_name}`}</h1>
              <p>{user.email}</p>
            </>
          ) : (
            <p>Loading employee data…</p>
          )}
        </div>

        <section className="claimed-orders">
          <h2>Claimed Orders</h2>
          {claimedOrders.length === 0 ? (
            <p>No orders claimed yet.</p>
          ) : (
            <ul className="order-list">
              {claimedOrders.map((order) => (
                <li key={order.order_id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order #{order.order_id}</strong>
                    <ul className="item-breakdown">
                      {order.items.length
                        ? order.items.map((it, idx) => (
                            <li key={idx}>{formatItem(it)}</li>
                          ))
                        : <li>No items listed</li>}
                    </ul>
                    <p>Created: {new Date(order.order_date).toLocaleString()}</p>
                  </div>

                  <div className="status-and-actions-column">
                    <div className="status-container">
                      <span className="status-label">Status:</span>
                      <select
                        value={
                          ["Claimed", "In Progress", "Completed"].includes(order.status)
                            ? order.status
                            : "Claimed"
                        }
                        onChange={(e) =>
                          updateOrderStatus(order.order_id, e.target.value)
                        }
                      >
                        <option>Claimed</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                    </div>

                    <div className="order-actions">
                      <button
                        className="action-btn remove-btn"
                        onClick={() => unclaimOrder(order.order_id)}
                      >
                        Remove
                      </button>
                      <button
                        className="action-btn finalize-btn"
                        onClick={() => finalizeOrder(order.order_id)}
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
        <p>© 2025 Artemis & Steam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeProfile;
