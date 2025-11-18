import React, { useState } from "react";
import "./ReviewForm.css";

const ReviewForm = ({ restaurantId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
    title: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const review = {
        ...formData,
        restaurantId,
        id: Date.now().toString(),
        date: new Date().toISOString(),
        user: "Current User", // In real app, get from auth context
      };

      onSubmit(review);

      // Reset form
      setFormData({
        rating: 0,
        comment: "",
        title: "",
      });
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = formData.rating > 0 && formData.comment.trim().length > 0;

  return (
    <div className="review-form">
      <div className="form-header">
        <h3>Write a Review</h3>
        <p>Share your experience with this restaurant</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Rating Section */}
        <div className="rating-section">
          <label className="rating-label">Overall Rating *</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star ${
                  star <= (hoverRating || formData.rating) ? "active" : ""
                }`}
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                ★
              </button>
            ))}
          </div>
          <div className="rating-text">
            {formData.rating === 0
              ? "Select a rating"
              : `${formData.rating} out of 5 stars`}
          </div>
        </div>

        {/* Review Title */}
        <div className="form-group">
          <label htmlFor="title">Review Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Summarize your experience (optional)"
            maxLength={100}
          />
        </div>

        {/* Review Comment */}
        <div className="form-group">
          <label htmlFor="comment">Your Review *</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            placeholder="Share details of your own experience at this restaurant..."
            rows={5}
            required
            maxLength={1000}
          />
          <div className="character-count">
            {formData.comment.length}/1000 characters
          </div>
        </div>

        {/* Photo Upload (Optional) */}
        <div className="form-group">
          <label>Add Photos (Optional)</label>
          <div className="photo-upload">
            <div className="upload-placeholder">
              <span>+</span>
              <p>Add Photo</p>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              id="photo-upload"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid || submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>

      {/* Review Guidelines */}
      <div className="review-guidelines">
        <h4>Review Guidelines</h4>
        <ul>
          <li>Be specific and detailed about your experience</li>
          <li>Focus on the food, service, and atmosphere</li>
          <li>Be honest and respectful</li>
          <li>Don't include personal information</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewForm;
