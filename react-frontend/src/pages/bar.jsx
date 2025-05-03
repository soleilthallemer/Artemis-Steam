import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/bar.css";

export default function Bar() {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const wrapRef = useRef(null);           // to close when you click outside

  /* add / remove shadow when scrolling */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* click‑away close */
  useEffect(() => {
    const handler = e =>
      open && wrapRef.current && !wrapRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <header className={`topbar ${scrolled ? "shadow" : ""}`} ref={wrapRef}>
      <Link to="/" className="brand">Artemis & Steam</Link>

      <button
        aria-label={open ? "Close menu" : "Open menu"}
        className="burger"
        onClick={() => setOpen(!open)}
      >
        <span className={open ? "line line1 open" : "line line1"} />
        <span className={open ? "line line2 open" : "line line2"} />
        <span className={open ? "line line3 open" : "line line3"} />
      </button>

      {/* ---------- drop‑down ---------- */}
      <nav className={`dropdown ${open ? "open" : ""}`}>
        <ul>
          {[
            { to: "/",           label: "Home"        },
            { to: "/menu",       label: "Menu"        },
            { to: "/about-us",   label: "About Us"    },
            { to: "/order",      label: "Order"       },
            { to: "/login",      label: "Log In"      },
            { to: "/admin-login",label: "Admin Log In"},
            { to: "/profile",    label: "Profile"     },
            { to: "/review-page",label: "Reviews"     },
            { to: "/contact",    label: "Contact Us"  },
          ].map(({ to, label }) => (
            <li key={label} onClick={() => setOpen(false)}>
              <Link className="dd-link" to={to}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
