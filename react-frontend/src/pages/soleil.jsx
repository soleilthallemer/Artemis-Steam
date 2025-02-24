import React from 'react';
import { Link } from 'react-router-dom';
import '../css/soleil.css';

function Soleil() {
  return (
    <>
      <title>Profile Page</title>
      <section className="split-layout">
        <div className="left-content">
          <h1>Soleil Thallemer</h1>
          <p>Computer Science &amp; Catholic Studies Student</p>
        </div>
        <div className="right-content">
          <img
            src="https://res.cloudinary.com/dtljonz0f/image/upload/c_auto,ar_4:3,w_3840,g_auto/f_auto/q_auto/v1/gc-v1/san-francisco/shutterstock_2392291507_san_francisco_non_editorial?_a=BAVARSAP0"
            alt="Artistic arrangement of natural elements"
          />
        </div>
      </section>
      <section className="about">
        <div className="about-content">
          <div className="about-text">
            <h2>About Me</h2>
            <p>
              I'm a junior at St. Edward's University, pursuing a dual major in
              Computer Science &amp; Catholic Studies. My goal is to build a career
              in project management, where I can combine my technical knowledge with
              leadership skills. Through the course of this project, I hope to
              enhance my technical skills while also developing stronger teamwork
              abilities. By collaborating with others and managing different aspects
              of the project, I aim to build my experience in project management,
              learning how to coordinate tasks, communicate effectively, and adapt
              to challenges. This opportunity will allow me to refine my
              problem-solving skills and gain practical insights into leading a
              successful project.
            </p>
            <p>
              Feel free to explore my work on{' '}
              <a
                href="https://github.com/soleilthallemer"
                target="_blank"
                rel="noreferrer"
              >
                GitHub!
              </a>
            </p>
            <p>
              <Link to="/about-us" className="about-us">
                Back to About Us
              </Link>
            </p>
          </div>
          <div className="about-photo">
            <img src="/images/group_pictures/SoleilFullEdited.jpg" alt="Profile" />
          </div>
        </div>
      </section>
      <section className="interests">
        <h2>What I Love</h2>
        <ul>
          <li>
            <span className="emoji">🐕</span> Walking My Dog
          </li>
          <li>
            <span className="emoji">🏋-FE0F;</span> Gym Training
          </li>
          <li>
            <span className="emoji">🚣-FE0F;</span> Rowing
          </li>
        </ul>
        <div className="photo-container">
          <div className="photo-box">
            <img
              src="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/austin/Boardwalk_Credit_David_Aguilar_Lifetime_a83ce847-0fb7-48f5-8a11-3fd98c3104b9.jpg"
              alt="Rowing on Lady Bird Lake"
            />
          </div>
          <div className="photo-box">
            <img src="/images/OsoPhoto.jpg" alt="Oso" />
          </div>
        </div>
        <p>
          One of my favorite activities is rowing on Lady Bird Lake. It's a
          perfect combination of exercise and enjoying Austin's beautiful
          outdoors.
        </p>
        <p>
          When I’m home, usually a few times a month, I enjoy taking my dog for
          walks. It’s a great way to unwind, spend time outdoors, and enjoy a
          break from my school routine.
        </p>
      </section>
    </>
  );
}

export default Soleil;