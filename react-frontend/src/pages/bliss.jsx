import React from 'react';
import { Link } from 'react-router-dom';
import '../css/person.css';

function Bliss() {
  return (
    <>
      <title>Bliss Jungo</title>
      <div className="profile-container">
      <img
          src="/images/group_pictures/BlissMedium.jpg"
          alt="bliss's Profile"
          className="profile-pic"
        />
        <h1>Bliss Jungo</h1>
        <p className="role">Developer and Security Analyst</p>
        <div className="bio">
          <p>
            Hi, I’m Bliss! I have a keen eye for design and a deep curiosity for
            digital security, making me passionate about both front-end
            development and cybersecurity. I love designing websites that look
            great and are easy to use while also making sure they are safe and
            secure. To me, the internet should be both beautiful and protected,
            and I enjoy finding the balance between creativity and security.
            Through this journey, I want to improve my front-end skills, learn
            more about cybersecurity, and create better, safer online
            experiences.
          </p>
        </div>
        <h2>My Interests</h2>
        <div className="interests">
          <div className="interest-item">
            <img src="/images/kayak_sunset.jpg" alt="kayak-img" /> {/* Corrected path */}
            <p>
              I love the thrill of kayaking, gliding through the water and
              exploring nature from a whole new perspective.
            </p>
          </div>
          <div className="interest-item">
            <a
              href="https://www.kqed.org/arts/13879872/dont-worry-your-new-jigsaw-puzzle-obsession-is-perfectly-normal"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://ww2.kqed.org/app/uploads/sites/2/2020/05/hans-peter-gauster-3y1zF4hIPCg-unsplash-1020x682.jpg"
                alt="puzzles"
              />
            </a>
            <p>
              I love solving puzzles because they challenge me to think
              creatively, find patterns, and push my problem-solving skills.
              Whether it's a tricky brain teaser or a complex jigsaw, I enjoy
              the satisfaction of piecing everything together.
            </p>
          </div>
        </div>
        <div className="links">
          <a
            href="https://github.com/Bliss65"
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

export default Bliss;