import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/bar.css";

export default function Bar() {
  const [scrolled, setScrolled]   = useState(false);
  const [open, setOpen]           = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const wrapRef = useRef(null);

  /* scroll shadow effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* detect outside click */
  useEffect(() => {
    const handler = (e) =>
      open && wrapRef.current && !wrapRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* check login status */
  useEffect(() => {
    const email = localStorage.getItem("user_email");
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!(email && userId));
  }, []);

  const menuItems = [
    { to: "/",           label: "Home" },
    { to: "/menu",       label: "Menu" },
    { to: "/about-us",   label: "About Us" },
    { to: "/order",      label: "Order" },
    !isLoggedIn && { to: "/login", label: "Log In" },
    !isLoggedIn && { to: "/admin-login", label: "Admin Log In" },
    isLoggedIn && { to: "/profile", label: "Profile" },
    isLoggedIn && { to: "/review-page", label: "Reviews" },
    isLoggedIn && { to: "/contact", label: "Contact Us" },
  ].filter(Boolean); // remove false/null entries

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

      <nav className={`dropdown ${open ? "open" : ""}`}>
        <ul>
          {menuItems.map(({ to, label }) => (
            <li key={label} onClick={() => setOpen(false)}>
              <Link className="dd-link" to={to}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
