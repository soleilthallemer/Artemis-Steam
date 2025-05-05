/* -------------------------------------------------------------------------- */
/*  src/pages/ProfilePage.jsx                                                 */
/* -------------------------------------------------------------------------- */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Bar from "./bar";
import "../css/bar.css";
import "../css/profilepage.css";

const ProfilePage = () => {
  /* ─────────────────────────── helpers ──────────────────────────────── */

  /** merge the many ways custom data may arrive */
  const normaliseItem = (raw) => {
    let custom = {};

    /* JSON string / object / nothing */
    if (typeof raw.customizations === "string" && raw.customizations.trim().startsWith("{")) {
      try   { custom = JSON.parse(raw.customizations); }
      catch { custom = {}; }
    } else if (typeof raw.customizations === "object" && raw.customizations) {
      custom = { ...raw.customizations };
    }

    /* dedicated columns */
    if (raw.milk_option) custom.milk  = raw.milk_option;
    if (raw.syrup)       custom.syrup = raw.syrup;

    const size = raw.size || custom.size || null;

    return { ...raw, size, custom };
  };

  /** turn a normalised item into a human‑readable string */
  const formatItem = (it) => {
    const parts = [];
    parts.push(`${it.name}${it.size ? ` – ${it.size}` : ""}`);

    if (it.custom.milk || it.custom.syrup) {
      const milk  = it.custom.milk  ?? "Whole";
      const syrup = it.custom.syrup ?? "None";
      parts.push(`${milk} milk${syrup !== "None" ? `, ${syrup} syrup` : ""}`);
    }

    if (it.custom.warmed)    parts.push("warmed");
    if (it.custom.iceCream)  parts.push("with ice‑cream");
    if (it.custom.chocolate) parts.push("chocolate drizzle");

    parts.push(`x${it.quantity}`);
    return parts.join(" | ");
  };

  /* ─────────────────────────── state ─────────────────────────────────── */
  const [user,          setUser]          = useState(null);
  const [orderHistory,  setOrderHistory]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [isAuth,        setIsAuth]        = useState(false);
  const navigate                            = useNavigate();

  /* ─────────────────────────── load profile & orders ─────────────────── */
  useEffect(() => {
    const email  = localStorage.getItem("user_email");
    const userId = localStorage.getItem("user_id");

    if (!email || !userId) {
      setIsAuth(false);
      setLoading(false);
      return;
    }
    setIsAuth(true);

    (async () => {
      try {
        /* profile ------------------------------------------------------ */
        const resUser = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/users/${email}`);
        if (resUser.ok) setUser(await resUser.json());

        /* orders ------------------------------------------------------- */
        const resOrders = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/orders/${userId}`);
        if (!resOrders.ok) throw new Error("orders fetch failed");

        const rawOrders = await resOrders.json();
        const formatted = rawOrders.map((o) => ({
          id:          o.order_id,
          total_price: (o.total_amount ?? 0).toFixed(2),
          order_date:  o.order_date ? new Date(o.order_date).toLocaleDateString() : "Unknown",
          status:      o.status ?? "Pending",
          items:       (o.items || []).map(normaliseItem)
        }));
        setOrderHistory(formatted);
      } catch (err) {
        console.error("Failed loading profile / orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─────────────────────────── actions ───────────────────────────────── */
  const logout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (loading) return <div className="profile-page"><p>Loading…</p></div>;

  /* ─────────────────────────── render ────────────────────────────────── */
  const fullName = user ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() : "Guest";

  return (
    <div className="profile-page">
      <Bar />
      <div style={{ paddingTop: "72px" }} />

      <div className="container">
        <section className="profile-card">
          {isAuth && user ? (
            <>
              {/* ---------- profile header ---------- */}
              <div className="profile-info">
                <img
                  className="profile-picture"
                  src={user.profilePicture || "/images/profilepicture.jpg"}
                  alt={fullName}
                />
                <div className="user-details">
                  <h2 className="username">{fullName}</h2>
                  <p className="email">{user.email}</p>
                </div>
                <button className="logout-button" onClick={logout}>
                  Logout
                </button>
              </div>

              {/* ---------- order history ---------- */}
              <div className="order-history">
                <h3>Order History</h3>
                {orderHistory.length === 0 ? (
                  <p>No orders found.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Order&nbsp;#</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Total&nbsp;$</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((o) => (
                        <tr key={o.id}>
                          <td>{o.id}</td>
                          <td>{o.order_date}</td>
                          <td>{o.status}</td>
                          <td>
                            <ul>
                              {o.items.map((it, idx) => (
                                <li key={idx}>{formatItem(it)}</li>
                              ))}
                            </ul>
                          </td>
                          <td>{o.total_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            /* ---------- not logged‑in state ---------- */
            <div className="profile-info" style={{ textAlign: "center", marginTop: "2rem" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 600 }}>No user is logged in.</p>
              <Link to="/login" className="login-button" style={{ marginTop: "1rem" }}>
                Go&nbsp;to&nbsp;Login
              </Link>
              <br />
              <Link to="/admin-login" style={{ marginTop: "0.5rem" }}>
                or&nbsp;Log&nbsp;in&nbsp;as&nbsp;Admin
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
