/* -------------------------------------------------------------------------- */
/*  src/pages/employee-dashboard.jsx                                          */
/* -------------------------------------------------------------------------- */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/employee-dashboard.css";

const EmployeeDashboard = () => {
  /* ════════════════════════════════════ HELPERS ═══════════════════════════ */

  /**
   * Normalise one order‑item coming from the back‑end so we can treat every
   * field consistently in the UI.
   */
  const normaliseItem = (raw) => {
    /* 0. whichever key the API used ─────────────────────────────────────── */
    const incoming = raw.custom ?? raw.customizations;      // ← NEW
    let custom = {};

    /* 1. incoming may be JSON string | object | null/undefined */
    if (typeof incoming === "string" && incoming.trim().startsWith("{")) {
      try   { custom = JSON.parse(incoming); }
      catch { custom = {}; }
    } else if (typeof incoming === "object" && incoming) {
      custom = { ...incoming };
    }

    /* 2. back‑end columns milk_option / syrup override JSON if present */
    if (raw.milk_option) custom.milk  = raw.milk_option;
    if (raw.syrup)       custom.syrup = raw.syrup;

    /* 3. size can be separate or tucked inside that JSON */
    const size = raw.size || custom.size || null;

    return { ...raw, size, custom };
  };

  /**
   * Convert a *normalised* item into a readable string, e.g.  
   * “Matcha Latte – Medium | Oat milk, Vanilla syrup | warmed | x2”
   */
  const formatItem = (it) => {
    if (!it) return "";

    const parts = [];
    parts.push(`${it.name}${it.size ? ` – ${it.size}` : ""}`);

    /* Drinks: milk + syrup */
    if (it.custom.milk || it.custom.syrup) {
      const milk  = it.custom.milk  ?? "Whole";
      const syrup = it.custom.syrup ?? "None";
      parts.push(
        `${milk} milk${syrup !== "None" ? `, ${syrup} syrup` : ""}`
      );
    }

    /* Food flags */
    if (it.custom.warmed)    parts.push("warmed");
    if (it.custom.iceCream)  parts.push("with ice‑cream");
    if (it.custom.chocolate) parts.push("chocolate drizzle");

    parts.push(`x${it.quantity}`);
    return parts.join(" | ");
  };

  /* ════════════════════════════════════ STATE ════════════════════════════ */
  const [orders, setOrders] = useState([]);
  const navigate            = useNavigate();
  const employeeId          = localStorage.getItem("user_id");

  /* ════════════════════════════════════ EFFECTS ══════════════════════════ */
  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(
          `http://${process.env.REACT_APP_API_IP}:5000/orders`
        );
        const data = await res.json();

        /* normalise every item so the rest of the UI is trivial */
        const cleaned = data.map((o) => ({
          ...o,
          items: Array.isArray(o.items) ? o.items.map(normaliseItem) : [],
        }));
        setOrders(cleaned);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    })();
  }, []);

  /* ════════════════════════════════════ DERIVED LISTS ════════════════════ */
  const unclaimedOrders = orders
    .filter((o) => !o.claimed_by && o.status !== "Completed")
    .sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

  const claimedOrders = orders
    .filter((o) => o.claimed_by && o.status !== "Completed")
    .sort((a, b) => new Date(a.order_date) - new Date(b.order_date));

  /* ════════════════════════════════════ ACTIONS ══════════════════════════ */
  const claimOrder = async (orderId) => {
    try {
      const res = await fetch(
        `http://${process.env.REACT_APP_API_IP}:5000/orders/${orderId}/claim`,
        {
          method : "POST",
          headers: { "Content-Type": "application/json" },
          body   : JSON.stringify({ user_id: employeeId }),
        }
      );
      if (!res.ok) throw new Error("Failed to claim order");

      setOrders((prev) =>
        prev.map((o) =>
          o.order_id === orderId ? { ...o, claimed_by: employeeId, status: "Claimed" } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Could not claim order, please try again.");
    }
  };

  /* ════════════════════════════════════ RENDER ═══════════════════════════ */
  return (
    <div className="employee-dashboard">
      {/* ───── Top banner ──────────────────────────────────────────────── */}
      <header className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/employee-dashboard">Dashboard</Link></li>
            <li><Link to="/employee-profile">Profile</Link></li>
            <li><Link to="/login">Log&nbsp;Out</Link></li>
          </ul>
        </div>
      </header>

      <main>
        <h1>Order Dashboard</h1>

        {/* ───── Unclaimed orders ──────────────────────────────────────── */}
        <section className="unclaimed-orders">
          <h2>Unclaimed Orders</h2>
          {unclaimedOrders.length === 0 ? (
            <p>No unclaimed orders at the moment.</p>
          ) : (
            <ul className="order-list">
              {unclaimedOrders.map((o) => (
                <li key={o.order_id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order&nbsp;#{o.order_id}</strong>
                    <ul className="item-breakdown">
                      {o.items.length
                        ? o.items.map((it, idx) => (
                            <li key={idx}>{formatItem(it)}</li>
                          ))
                        : <li>No items listed</li>}
                    </ul>
                    <p>Created: {new Date(o.order_date).toLocaleString()}</p>
                  </div>

                  <button
                    className="claim-order-button"
                    onClick={() => claimOrder(o.order_id)}
                  >
                    Claim
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ───── Claimed orders ────────────────────────────────────────── */}
        <section className="claimed-orders">
          <h2>Claimed Orders</h2>
          {claimedOrders.length === 0 ? (
            <p>No claimed orders at the moment.</p>
          ) : (
            <ul className="order-list">
              {claimedOrders.map((o) => (
                <li key={o.order_id} className="order-summary-item">
                  <div className="order-info">
                    <strong>Order&nbsp;#{o.order_id}</strong>
                    <ul className="item-breakdown">
                      {o.items.length
                        ? o.items.map((it, idx) => (
                            <li key={idx}>{formatItem(it)}</li>
                          ))
                        : <li>No items listed</li>}
                    </ul>
                    <p>Created: {new Date(o.order_date).toLocaleString()}</p>
                  </div>

                  <div className="order-status">
                    <p>Claimed&nbsp;By: {o.claimed_by}</p>
                    <p>Status: {o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer>
        <p>© 2025 Artemis &amp; Steam. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EmployeeDashboard;
