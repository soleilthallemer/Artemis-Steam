import React from 'react';
import { Link } from 'react-router-dom';
import '../css/person.css';

function Jocelyn() {
  return (
    <>
      <title>About Jocelyn</title>
      <div className="profile-container">
      <img
          src="/images/group_pictures/JocelynMedium.jpg"
          alt="Jocelyn's Profile"
          className="profile-pic"
        />
        <h1>Jocelyn Ortiz</h1>
        <p className="role">Designer &amp; Developer</p>
        <div className="bio">
          <p>
            Hi, I'm Jocelyn! I'm passionate about computer science and design. I
            love blending creativity with technology to build user-friendly and
            visually appealing interfaces. Throughout this project, I aim to
            improve my web development skills, database skills, and explore
            python interactivity to enhance user experience.
          </p>
        </div>
        <h2>My Interests</h2>
        <div className="interests">
          <div className="interest-item">
            <img src="/images/jocelyns_dog.jpg" alt="dog-image" /> {/* Corrected path */}
            <p>
              I love being a dog mom. A new experience everyday and never a day
              without any fun.
            </p>
          </div>
          <div className="interest-item">
            <a
              href="https://www.thecollector.com/what-are-the-seven-wonders-of-the-world/"
              target="_blank"
              rel="noreferrer" // Add noreferrer
            >
              <img src="/images/travel.jpg" alt="travel-image" /> {/* Corrected path */}
            </a>
            <p>
              Traveling is a huge part of my life. I love exploring new cultures
              and learning about different places. Seeing the world is inspiring
              to me. Click the image to see where I wish to go!
            </p>
          </div>
        </div>
        <div className="links">
          <a
            href="https://github.com/jfaith2004"
            target="_blank"
            rel="noreferrer" // Add noreferrer
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

export default Jocelyn;
