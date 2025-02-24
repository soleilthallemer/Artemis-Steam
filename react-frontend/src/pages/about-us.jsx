import React from 'react';
import { Link } from 'react-router-dom';
import '../css/about-us.css';

function AboutUs() {
  return (
    <>
      <title>About Us</title>
      <div className="banner">
        <div className="container">
          <h1>About Us</h1>
          <div className="slideshow-container">
            <img
              className="slide"
              src="/images/group_pictures/TeamMedium2.jpg"
              alt="Group slideshow 1"
              style={{ display: 'block' }}
            />
            <img className="slide" src="/images/artemis.webp" alt="Group slideshow 2" />
            <img className="slide" src="/images/agora.houston.jpg" alt="Group slideshow 3" />
            <button className="prev">❮</button>
            <button className="next">❯</button>
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
                <img
                  src="/images/group_pictures/SoleilMedium2.jpg"
                  alt="Soleil Thallemer"
                />
                <h2>Soleil Thallemer</h2>
              </Link>
            </div>
            <div className="member">
              <Link to="/bliss">
                <img src="/images/group_pictures/BlissMedium.jpg" alt="Bliss Jungo" />
                <h2>Bliss Jungo</h2>
              </Link>
            </div>
            <div className="member">
              <Link to="/paloma">
                <img src="/images/group_pictures/PalomaMedium.jpeg" alt="Paloma Escobedo" />
                <h2>Paloma Escobedo</h2>
              </Link>
            </div>
            <div className="member">
              <Link to="/jocelyn">
                <img src="/images/group_pictures/JocelynMedium.jpg" alt="Jocelyn Ortiz" />
                <h2>Jocelyn Ortiz</h2>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;