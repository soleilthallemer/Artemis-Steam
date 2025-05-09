import React from 'react';
import { Link } from 'react-router-dom';
import '../css/person.css';

function Paloma() {
  return (
    <>
      <title>About Paloma</title>
      <div className="profile-container">
        <img
          src="/images/group_pictures/PalomaHeadshot.jpeg" // Corrected path
          alt="Paloma's Profile"
          className="profile-pic"
        />
        <h1>Paloma Escobedo</h1>
        <p className="role">Front End Programmer</p>
        <div className="bio">
          <p>
            I'm Paloma, computer science major with a minor in graphic design! I'm
            also passionate about art and crafting. I love combining my creativity
            with technology by creating redesigns of brands. From their logo to
            their web systems. Overall this semester, I hope to improve my full
            stack skills while working on a project that I am passionate about.
          </p>
        </div>
        <h2>My Interests</h2>
        <div className="interests">
          <div className="interest-item">
            <img src="/images/FriendsInLondon.jpeg" alt="FriendsInLondonImage" />
            <p>
              This was over winter break when I took a trip abroad to London,
              England.
            </p>
          </div>
          <div className="interest-item">
            <a
              href="https://www.artic.edu/iiif/2/3c27b499-af56-f0d5-93b5-a7f2f1ad5813/full/843,/0/default.jpg"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://www.artic.edu/iiif/2/3c27b499-af56-f0d5-93b5-a7f2f1ad5813/full/843,/0/default.jpg"
                alt="WaterLillies"
              />
            </a>
            <p>This is my favorite painting at the moment.</p>
          </div>
        </div>
        <div className="links">
          <a
            href="https://github.com/pescobed"
            target="_blank"
            rel="noreferrer"
            className="github"
          >
            My GitHub
          </a>
          <Link to="/about-us" className="about-us">
            Back to About Us
          </Link>
        </div>
      </div>
    </>
  );
}

export default Paloma;