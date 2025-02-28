import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/about_us_page.css';

// Import slideshow images
import TeamMedium2 from "../assets/images/group_pictures/TeamMedium2.jpg";
import artemis from "../assets/images/artemis.webp";
import agoraHouston from "../assets/images/agora.houston.jpg";


// Import team member images
import SoleilMedium2 from "../assets/images/group_pictures/SoleilMedium2.jpg";
import BlissMedium from "../assets/images/group_pictures/BlissMedium.jpg";
import PalomaMedium from "../assets/images/group_pictures/PalomaMedium.jpeg";
import JocelynMedium from "../assets/images/group_pictures/JocelynMedium.jpg";

const AboutUsPage = () => {
  const slides = [TeamMedium2, artemis, agoraHouston];
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance the slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="aboutus-page">
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order" className="active">Order</Link></li>
          </ul>
        </div>
        <div className="nav-right">
            <Link to="/login" className="login-btn">Log In</Link>
            <Link to="/profile" className="profile-btn">Profile</Link>
          </div>
      </div>

      <div className="container">
        <h1>About Us</h1>
        <div className="slideshow-container">
          <img
            className="slide"
            src={slides[currentSlide]}
            alt={`Team slideshow ${currentSlide + 1}`}
            style={{ display: 'block' }}
          />
          <button className="prev" onClick={prevSlide}>❮</button>
          <button className="next" onClick={nextSlide}>❯</button>
        </div>
        <div className="about-description">
          <p>
            We are a team of four passionate women in software engineering who
            came together to create something special. Our journey led us to
            develop a website for Artemis &amp; Steam, a unique cafe that blends
            creativity with technology. Inspired by the fusion of art and
            innovation, our goal is to craft an inviting digital space that
            reflects the warmth, charm, and energy of the cafe. Whether you're
            here for a cup of coffee, a spark of inspiration, or simply to
            explore, we hope our website enhances your experience at Artemis
            &amp; Steam.
          </p>
        </div>
        <div className="short-title">
          <p>Get to know each member!</p>
        </div>
        <div className="team">
          <div className="member">
            <Link to="/soleil">
              <img src={SoleilMedium2} alt="Soleil Thallemer" />
              <h2>Soleil Thallemer</h2>
            </Link>
          </div>
          <div className="member">
            <Link to="/bliss">
              <img src={BlissMedium} alt="Bliss Jungo" />
              <h2>Bliss Jungo</h2>
            </Link>
          </div>
          <div className="member">
            <Link to="/paloma">
              <img src={PalomaMedium} alt="Paloma Escobedo" />
              <h2>Paloma Escobedo</h2>
            </Link>
          </div>
          <div className="member">
            <Link to="/jocelyn">
              <img src={JocelynMedium} alt="Jocelyn Ortiz" />
              <h2>Jocelyn Ortiz</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
