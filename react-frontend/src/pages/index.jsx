// src/pages/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Bar from "./bar";
import "../css/bar.css";
import "../css/home.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ─── fixed navigation bar ─────────────────────────────────────────────── */}
      <Bar />

      {/* add top‑padding so content isn’t hidden behind the bar */}
      <div className="homepage pt-[88px] md:pt-[96px]">
        {/* ─── Banner ─────────────────────────────────────────────────────────── */}
        <div className="banner">
          <div className="content">
            <h1>Artemis &amp; Steam</h1>
            <p>Where Nature Meets Craft</p>
          </div>
        </div>
      </div>

      {/* ─── About Section ───────────────────────────────────────────────────── */}
      <div className="artemis_steam">
        <h2>A Little Bit About Artemis &amp; Steam</h2>
        <p>
          Artemis &amp; Steam – where nature meets craft. Our vision is to blend
          the artistry of nature with human ingenuity, creating a space where
          every detail is a reflection of our passion for memorable experiences.
        </p>
      </div>

      {/* ─── Menu Section ────────────────────────────────────────────────────── */}
      <div className="menu">
        <h2>Menu</h2>
        <p>Explore our delicious offerings.</p>
        <button type="button" className="menu-btn" onClick={() => navigate("/menu")}>
          <span>View Menu</span>
        </button>

        <h3 className="featured-items-title">Featured Items</h3>
        <div className="featured-items">
          <div className="featured-item">
            <img src="/images/drip_coffee.webp" alt="Drip Coffee" />
          </div>
          <div className="featured-item">
            <img src="/images/espresso.webp" alt="Espresso" />
          </div>
          <div className="featured-item">
            <img src="/images/matcha.webp" alt="Matcha" />
          </div>
          <div className="featured-item">
            <img src="/images/blueberry_muffin.webp" alt="Blueberry Muffin" />
          </div>
        </div>
      </div>

      {/* ─── Amenities Section ──────────────────────────────────────────────── */}
      <div className="amenities">
        <h2>Amenities</h2>
        <div className="amenities-grid">
          <div className="amenity">
            <i className="fas fa-wifi" />
            <h3>Wi‑Fi</h3>
            <p>Fast and reliable to work or browse.</p>
          </div>
          <div className="amenity">
            <i className="fas fa-walking" />
            <h3>Walk‑ins</h3>
            <p>Our doors are always open to spontaneous joy.</p>
          </div>
          <div className="amenity">
            <i className="fas fa-coffee" />
            <h3>Lifestyle</h3>
            <p>A space to relax, unwind, and take in the world.</p>
          </div>
          <div className="amenity">
            <i className="fas fa-moon" />
            <h3>Open Late</h3>
            <p>Join us for extended hours—life has no curfew.</p>
          </div>
        </div>
      </div>

      {/* ─── Policy Section ─────────────────────────────────────────────────── */}
      <div className="policy">
        <h2>Policy</h2>
        <p>
          We kindly ask all guests to respect our space and enjoy their time
          responsibly. Please be mindful of other visitors, keep noise levels
          appropriate, and maintain the cleanliness of our environment.
        </p>
      </div>

      {/* ─── Gallery Section ────────────────────────────────────────────────── */}
      <div className="gallery">
        {["img1.jpg","img2.jpg","img3.jpg","img4.jpg"].map((file,i) => (
          <div className="gallery-item" key={i}>
            <img src={`/images/${file}`} alt={`Gallery ${i+1}`} />
          </div>
        ))}
      </div>

      {/* ─── Bottom Section ─────────────────────────────────────────────────── */}
      <div className="bottom-section">
        <div className="bottom-hours">
          <h3>Hours of Operation</h3>
          <table>
            <tbody>
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
                .map(day => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>09 : 00 am – 02 : 00 am</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bottom-location">
          <h3>Location</h3>
          <p>1712 Westheimer Rd, Houston, TX 77098</p>
        </div>

        <div className="bottom-contact">
          <h3>Contact Info</h3>
          <p>Email: info@artemisandsteam.com</p>
          <div className="social-icons">
            {[
              { href:"facebook.com",   icon:"facebook-f",  label:"Facebook"},
              { href:"instagram.com",  icon:"instagram",   label:"Instagram"},
              { href:"snapchat.com",   icon:"snapchat-ghost", label:"Snapchat"},
              { href:"twitter.com",    icon:"twitter",     label:"Twitter"},
            ].map(s => (
              <a
                key={s.icon}
                href={`https://www.${s.href}`}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
              >
                <i className={`fab fa-${s.icon}`} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
