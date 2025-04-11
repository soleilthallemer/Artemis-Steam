// src/pages/HomePage.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/home.css"; // Your existing CSS file
import "@fortawesome/fontawesome-free/css/all.min.css"; // FontAwesome Icons

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* Banner Section with Nav Bar and Background Image */}
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
              <Link to="/order">Order</Link>
            </li>
            <li className="dropdown">
              <Link to="/login" className="nav-link">
                Log In
              </Link>
              <ul className="dropdown-menu">
                <Link to="/admin-login">Admin Log In</Link>
              </ul>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>
        <div className="content">
          <h1>Artemis &amp; Steam</h1>
          <p>Where Nature Meets Craft</p>
        </div>
      </div>

      {/* About Section */}
      <div className="artemis_steam">
        <h2>A Little Bit About Artemis & Steam</h2>
        <p>
          Artemis & Steam - where nature meets craft. 
          Our vision is to blend the artistry of nature with 
          human ingenuity, creating a space where every detail 
          is a reflection of our passion for creating memorable 
          experiences.
        </p>
      </div>

      {/* Menu Section with Styled Button */}
      <div className="menu">
        <h2>Menu</h2>
        <p>Explore our delicious offerings.</p>
        <button type="button" onClick={() => navigate("/menu")}>
          <span>View Menu</span>
        </button>
        
        {/* Featured Items */}
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

      {/* Amenities Section */}
      <div className="amenities">
        <h2>Amenities</h2>
        <div className="amenities-grid">
          <div className="amenity">
            <i className="fas fa-wifi" />
            <h3>Wi-Fi</h3>
            <p>Experience fast and reliable Wi-Fi to work or browse.</p>
          </div>
          <div className="amenity">
            <i className="fas fa-walking" />
            <h3>Walk-ins</h3>
            <p>Our doors are always open to spontaneous joy.</p>
          </div>
          <div className="amenity">
            <i className="fas fa-coffee" />
            <h3>Lifestyle</h3>
            <p>A space to relax, unwind, and take in the world.</p>
          </div>
          <div className="amenity">
            <i className="fas fa-moon" />
            <h3>Open Late</h3>
            <p>Join us for extended hours—life has no curfew.</p>
          </div>
        </div>
      </div>

      {/* Policy Section */}
      <div className="policy">
        <h2>Policy</h2>
        <p>
          We kindly ask all guests to respect our space and enjoy their time responsibly.
          <br />
          Please be mindful of other visitors, keep noise levels appropriate, and
          maintain the
          <br />
          cleanliness of our environment. We appreciate your cooperation in
          creating a warm and inviting atmosphere for everyone.
        </p>
      </div>

      {/* Gallery Section */}
      <div className="gallery">
        <div className="gallery-item">
          <img src="/images/img1.jpg" alt="Cocktail" />
        </div>
        <div className="gallery-item">
          <img src="/images/img2.jpg" alt="Bar tools" />
        </div>
        <div className="gallery-item">
          <img src="/images/img3.jpg" alt="Hand with drink" />
        </div>
        <div className="gallery-item">
          <img src="/images/img4.jpg" alt="Bar stool" />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="bottom-hours">
          <h3>Hours of Operation</h3>
          <table>
            <tbody>
              <tr>
                <td>Monday</td>
                <td>09:00am - 02:00am</td>
              </tr>
              <tr>
                <td>Tuesday</td>
                <td>09:00am - 02:00am</td>
              </tr>
              <tr>
                <td>Wednesday</td>
                <td>09:00am - 02:00am</td>
              </tr>
              <tr>
                <td>Thursday</td>
                <td>09:00am - 02:00am</td>
              </tr>
              <tr>
                <td>Friday</td>
                <td>09:00am - 02:00am</td>
              </tr>
              <tr>
                <td>Saturday</td>
                <td>09:00am - 02:00am</td>
              </tr>
              <tr>
                <td>Sunday</td>
                <td>09:00am - 02:00am</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bottom-location">
          <h3>Location</h3>
          <p>1712 Westheimer Rd, Houston, TX 77098</p>
        </div>
        <div className="bottom-contact">
          <h3>Contact Info</h3>
          <p>Email: info@artemisandsteam.com</p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              href="https://www.snapchat.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Snapchat"
            >
              <i className="fab fa-snapchat-ghost" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
