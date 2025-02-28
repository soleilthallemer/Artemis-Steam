// src/components/HomePage.jsx

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/homepage.css"; // Import styles
import "@fortawesome/fontawesome-free/css/all.min.css"; // FontAwesome Icons
import backgroundImg from "../assets/images/cafe_image.jpg"; // Background image
import img1 from "../assets/images/img1.jpg";
import img2 from "../assets/images/img2.jpg";
import img3 from "../assets/images/img3.jpg";
import img4 from "../assets/images/img4.jpg";
import dripCoffee from "../assets/images/drip_coffee.webp";
import espresso from "../assets/images/espresso.webp";
import matcha from "../assets/images/matcha.webp";
import blueberryMuffin from "../assets/images/blueberry_muffin.webp";

const HomePage = () => {
  const location = useLocation(); // Get the current route path
  const navigate = useNavigate(); // Get the navigation function

  return (
    <div>
      {/* Banner Section */}
      <div
        className="banner"
        style={
          location.pathname === "/" // Only apply background on the home page
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "100vh",
                width: "100%",
              }
            : {}
        }
      >
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order" className="active">Order</Link></li>
          </ul>
          <div className="nav-right">
            <Link to="/login" className="login-btn">Log In</Link>
            <Link to="/profile" className="profile-btn">Profile</Link>
          </div>
        </div>
        <div className="content">
          <h1>Artemis & Steam</h1>
          <p>Where Nature Meets Craft</p>
        </div>
      </div>

      {/* About Section */}
      <div className="artemis_steam">
        <h2>A Little Bit About Artemis & Steam</h2>
        <p>
          Artemis & Steam - where nature meets craft. Our vision is to blend the artistry of nature with human ingenuity, creating a space where every detail is a reflection of our passion for creating memorable experiences.
        </p>
      </div>

      {/* Menu Section */}
      <div className="menu">
        <h2>Menu</h2>
        <p>Explore our delicious offerings.</p>
                  {/* The button is wrapped in a div with class "homepage" so that your CSS targeting 
              .homepage button applies */}
          <div className="homepage">
            <button type="button" onClick={() => navigate("/menu")}>
              <span>View Menu</span>
            </button>
          </div>
        <div className="featured-items">
          <div className="featured-item">
            <img src={dripCoffee} alt="Drip Coffee" />
          </div>
          <div className="featured-item">
            <img src={espresso} alt="Espresso" />
          </div>
          <div className="featured-item">
            <img src={matcha} alt="Matcha" />
          </div>
          <div className="featured-item">
            <img src={blueberryMuffin} alt="Blueberry Muffin" />
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="amenities">
        <h2>Amenities</h2>
        <div className="amenities-grid">
          {[
            { icon: "wifi", title: "Wi-Fi", text: "Experience fast and reliable Wi-Fi to work or browse." },
            { icon: "walking", title: "Walk-ins", text: "Our doors are always open to spontaneous joy." },
            { icon: "coffee", title: "Lifestyle", text: "A space to relax, unwind, and take in the world." },
            { icon: "moon", title: "Open Late", text: "Join us for extended hours—life has no curfew." }
          ].map((amenity, index) => (
            <div className="amenity" key={index}>
              <i className={`fas fa-${amenity.icon}`}></i>
              <h3>{amenity.title}</h3>
              <p>{amenity.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery">
        <div className="gallery-item"><img src={img1} alt="Cocktail" /></div>
        <div className="gallery-item"><img src={img2} alt="Bar tools" /></div>
        <div className="gallery-item"><img src={img3} alt="Hand with drink" /></div>
        <div className="gallery-item"><img src={img4} alt="Bar stool" /></div>
      </div>

      {/* Footer Section */}
      <div className="bottom-section">
        <div className="bottom-hours">
          <h3>Hours of Operation</h3>
          <table>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
              <tr key={index}>
                <td>{day}</td>
                <td>09:00am - 02:00am</td>
              </tr>
            ))}
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
            {[
              { href: "https://www.facebook.com", icon: "facebook-f", label: "Facebook" },
              { href: "https://www.instagram.com", icon: "instagram", label: "Instagram" },
              { href: "https://www.snapchat.com", icon: "snapchat-ghost", label: "Snapchat" },
              { href: "https://www.twitter.com", icon: "twitter", label: "Twitter" }
            ].map((social, index) => (
              <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                <i className={`fab fa-${social.icon}`}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
