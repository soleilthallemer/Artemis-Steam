import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/reviewPage.css';

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/reviews`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error('Error loading reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !rating || !comment) return alert("All fields are required.");

    const newReview = { name, rating, comment };

    try {
      const res = await fetch(`http://${process.env.REACT_APP_API_IP}:5000/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });

      if (!res.ok) throw new Error('Failed to submit review');

      const savedReview = { ...newReview, id: Date.now() };
      setReviews([savedReview, ...reviews]);
      setName('');
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review.');
    }
  };

  // 🟨 Review Summary Component
  const ReviewSummary = ({ reviews }) => {
    const total = reviews.length;
    const counts = [0, 0, 0, 0, 0, 0];
    reviews.forEach(r => counts[r.rating]++);
    const average = total ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;

    return (
      <div className="review-summary">
        <h2>Customer Reviews</h2>
        <div className="average-rating">
          <span className="avg-number">{average}</span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={`star ${i <= Math.round(average) ? 'filled' : ''}`}>★</span>
            ))}
          </div>
          <p>{total} reviews</p>
        </div>
        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="distribution-row">
              <span>{rating} ★</span>
              <div className="bar-wrapper">
                <div className="bar-filled" style={{ width: `${(counts[rating] / total) * 100 || 0}%` }} />
              </div>
              <span>{counts[rating]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="review-page">
      <div className="banner">
        <div className="bar">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/order">Order</Link></li>
            <li className="dropdown">
              <Link to="/login" className="nav-link">Log In</Link>
              <ul className="dropdown-menu">
                <Link to="/admin-login">Admin Log In</Link>
              </ul>
            </li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/review-page">Reviews</Link></li>
          </ul>
        </div>
      </div>

      <h1 className="page-title">User Reviews</h1>

      {/* 🔷 Review Summary Section */}
      <ReviewSummary reviews={reviews} />

      <div className="review-container">
        {/* Left: Submit Form */}
        <form className="review-form" onSubmit={handleSubmit}>
          <h2>Leave a Review</h2>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="star-select">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filled' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            rows="4"
            placeholder="Your Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
          <button type="submit">Submit Review</button>
        </form>

        {/* Right: Reviews List */}
        <div className="review-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet.</p>
          ) : (
            reviews.map((review, index) => (
              <div key={review.review_id || review.id || index} className="review-item">
                <div className="review-header">
                  <div className="user-avatar">{review.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <p className="user-name">{review.name}</p>
                    <p className="verified">Verified Reviewer</p>
                  </div>
                </div>
                <div className="star-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                  ))}
                </div>
                <p className="review-text">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Review Portal. All rights reserved.
      </footer>
    </div>
  );
}
