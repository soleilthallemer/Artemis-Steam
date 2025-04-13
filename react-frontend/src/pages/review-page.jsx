import React, { useState } from 'react';
import '../css/reviewPage.css';

export default function ReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !rating || !comment) return alert("All fields are required.");

    const newReview = {
      id: Date.now(),
      name,
      rating,
      comment,
    };

    setReviews([newReview, ...reviews]);
    setName('');
    setRating(0);
    setComment('');
  };

  return (
    <div className="review-page">
      <h1 className="page-title">User Reviews</h1>
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
            reviews.map((review) => (
              <div key={review.id} className="review-item">
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
