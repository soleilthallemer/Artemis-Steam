import React from 'react';
import { Link } from 'react-router-dom';
import '../css/person.css';

function Soleil() {
  return (
    <>
      <title>About Soleil</title>
      <div className="profile-container">
        <img
          src="/images/group_pictures/SoleilMedium2.jpg"
          alt="Soleil Thallemer"
          className="profile-pic"
        />
        <h1>Soleil Thallemer</h1>
        <p className="role">Computer Science &amp; Catholic Studies Student</p>
        <div className="bio">
          <p>
            I'm a junior at St. Edward's University, pursuing a dual major in Computer Science &amp; Catholic Studies. My goal is to build a career in project management, where I can combine my technical knowledge with leadership skills. Through this project, I hope to enhance my technical skills while developing stronger teamwork abilities, learning how to coordinate tasks, communicate effectively, and adapt to challenges.
          </p>
        </div>
        <h2>What I Love</h2>
        <div className="interests">
          <div className="interest-item">
            <img
              src="https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/v1/gc-v1/san-francisco/shutterstock_2392291507_san_francisco_non_editorial?_a=BAVARSAP0"
              alt="Rowing on Lady Bird Lake"
            />
            <p>Rowing on Lady Bird Lake</p>
          </div>
          <div className="interest-item">
            <img
              src="/images/OsoPhoto.jpg" // Corrected path
              alt="Walking My Dog"
            />
            <p>Walking My Dog</p>
          </div>
        </div>
        <div className="links">
          <a
            href="https://github.com/soleilthallemer"
            target="_blank"
            rel="noopener noreferrer"
            className="github"
          >
            My GitHub
          </a>
          <Link to="/about-us" className="about-us">
            Back to about us
          </Link>
        </div>
      </div>
    </>
  );
}

export default Soleil;