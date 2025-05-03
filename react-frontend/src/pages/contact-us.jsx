import React, { useState } from "react";
import { Link } from "react-router-dom";
import Bar from "./bar";
import "../css/bar.css";
import "../css/contact-us.css";         

const ContactUs = () => {
  const [form, setForm] = useState({
    name:    "",
    email:   "",
    subject: "",
    message: ""
  });
  const [sent, setSent] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://${process.env.REACT_APP_API_IP}:5000/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );
      if (res.ok) {
        setSent(true);
        setForm({ name:"", email:"", subject:"", message:"" });
      } else {
        alert("Something went wrong — please try again!");
      }
    } catch (err) {
      console.error(err);
      alert("Network error — please try again!");
    }
  };

  return (
    <div className="contact-page">
      {/* ▸ top nav like other pages */}
      <Bar />

      <div style={{ paddingTop: "72px" }}>
      {/* existing container / cart / menu JSX here */}
      </div>

      <main className="contact-container">
        <h1>Contact Us</h1>
        <p className="subtitle">Have a question or feedback? Send us a message!</p>

        {sent ? (
          <p className="success-msg">Thank‑you — we’ll get back to you soon.</p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Subject
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="send-btn">Send</button>
          </form>
        )}
      </main>
    </div>
  );
};

export default ContactUs;
