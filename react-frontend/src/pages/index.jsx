import React from 'react';
import { Link } from 'react-router-dom';
import '../css/home.css'; // Import your CSS

function HomePage() {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Home Page</title>
      <link
        rel="stylesheet"
      />
      <div className="banner">
        <div className="content">
          <h1>Artemis &amp; Steam</h1>
          <p>Where Nature Meets Craft</p>
        </div>
      </div>
      <div className="artemis_steam">
        <h2>Artemis and Steam</h2>
        <p>
          Here at Artemis &amp; Steam, we blend the art of nature with human
          ingenuity.
        </p>
      </div>
      <div className="menu">
        <h2>Menu</h2>
        <p>Explore our delicious offerings.</p>
        <Link to="/menu">
          <span>View Menu</span>
        </Link>
      </div>
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
      <div className="policy">
        <h2>Policy</h2>
        <p>
          We kindly ask all guests to respect our space and enjoy their time
          responsibly.
          <br />
          Please be mindful of other visitors, keep noise levels appropriate, and
          maintain the
          <br />
          cleanliness of our environment. We appreciate your cooperation in creating
          a warm and
          <br />
          inviting atmosphere for everyone.
        </p>
      </div>
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
              aria-label="Facebook" rel="noreferrer"
            >
              <i className="fab fa-facebook-f" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              aria-label="Instagram" rel="noreferrer"
            >
              <i className="fab fa-instagram" />
            </a>
            <a
              href="https://www.snapchat.com"
              target="_blank"
              aria-label="Snapchat" rel="noreferrer"
            >
              <i className="fab fa-snapchat-ghost" />
            </a>
            <a href="https://www.twitter.com" target="_blank" aria-label="Twitter" rel="noreferrer">
              <i className="fab fa-twitter" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;