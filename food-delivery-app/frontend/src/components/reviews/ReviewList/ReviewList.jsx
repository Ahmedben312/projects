import React, { useState, useEffect } from "react";
import ReviewForm from "../ReviewForm/ReviewForm";
import "./ReviewList.css";

const ReviewList = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState(0);

  // Mock reviews data - in real app, this would come from an API
  const mockReviews = [
    {
      id: "1",
      user: "John D.",
      rating: 5,
      title: "Amazing food and service!",
      comment:
        "The pizza was absolutely delicious. Fresh ingredients and perfect crust. Delivery was fast and the food arrived hot.",
      date: "2024-01-15T18:30:00Z",
      helpful: 12,
    },
    {
      id: "2",
      user: "Sarah M.",
      rating: 4,
      title: "Great quality, a bit slow",
      comment:
        "Food quality is excellent, but delivery took longer than expected. Will order again though!",
      date: "2024-01-10T20:15:00Z",
      helpful: 5,
    },
    {
      id: "3",
      user: "Mike R.",
      rating: 3,
      title: "Average experience",
      comment:
        "Food was okay, nothing special. Portion sizes could be better for the price.",
      date: "2024-01-05T19:45:00Z",
      helpful: 2,
    },
  ];

  useEffect(() => {
    loadReviews();
  }, [restaurantId, sortBy, filterRating]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredReviews = [...mockReviews];

      // Filter by rating
      if (filterRating > 0) {
        filteredReviews = filteredReviews.filter(
          (review) => review.rating === filterRating
        );
      }

      // Sort reviews
      filteredReviews.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.date) - new Date(a.date);
          case "oldest":
            return new Date(a.date) - new Date(b.date);
          case "highest":
            return b.rating - a.rating;
          case "lowest":
            return a.rating - b.rating;
          case "most_helpful":
            return b.helpful - a.helpful;
          default:
            return new Date(b.date) - new Date(a.date);
        }
      });

      setReviews(filteredReviews);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setShowReviewForm(false);
  };

  const handleHelpfulClick = (reviewId) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: (review.helpful || 0) + 1 }
          : review
      )
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? "star filled" : "star"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews.length;
  const averageRating = getAverageRating();

  if (loading) {
    return (
      <div className="review-list">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-list">
      {/* Reviews Header */}
      <div className="reviews-header">
        <div className="reviews-summary">
          <div className="average-rating">
            <div className="rating-score">{averageRating}</div>
            <div className="rating-details">
              {renderStars(parseFloat(averageRating))}
              <span className="total-reviews">{totalReviews} reviews</span>
            </div>
          </div>

          <button
            className="write-review-btn"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        </div>

        {/* Rating Distribution */}
        {totalReviews > 0 && (
          <div className="rating-distribution">
            <h4>Rating Breakdown</h4>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="distribution-row">
                <span className="rating-label">{rating} stars</span>
                <div className="distribution-bar">
                  <div
                    className="distribution-fill"
                    style={{
                      width: `${
                        totalReviews > 0
                          ? (ratingDistribution[rating] / totalReviews) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="distribution-count">
                  ({ratingDistribution[rating]})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="review-form-modal">
          <div className="modal-content">
            <ReviewForm
              restaurantId={restaurantId}
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        </div>
      )}

      {/* Reviews Controls */}
      {totalReviews > 0 && (
        <div className="reviews-controls">
          <div className="sort-filter">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="most_helpful">Most Helpful</option>
            </select>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="filter-select"
            >
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-container">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">{review.user}</h4>
                    <div className="review-meta">
                      {renderStars(review.rating)}
                      <span className="review-date">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                </div>

                {review.helpful > 0 && (
                  <div className="helpful-count">
                    {review.helpful} people found this helpful
                  </div>
                )}
              </div>

              <div className="review-content">
                {review.title && (
                  <h5 className="review-title">{review.title}</h5>
                )}
                <p className="review-comment">{review.comment}</p>
              </div>

              <div className="review-actions">
                <button
                  className="helpful-btn"
                  onClick={() => handleHelpfulClick(review.id)}
                >
                  👍 Helpful ({review.helpful || 0})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-reviews">
            <div className="empty-icon">💬</div>
            <h3>No reviews yet</h3>
            <p>
              {filterRating > 0
                ? `No reviews with ${filterRating} stars found`
                : "Be the first to review this restaurant!"}
            </p>
            {filterRating > 0 ? (
              <button
                onClick={() => setFilterRating(0)}
                className="clear-filter-btn"
              >
                Show All Reviews
              </button>
            ) : (
              <button
                onClick={() => setShowReviewForm(true)}
                className="write-first-review-btn"
              >
                Write the First Review
              </button>
            )}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {reviews.length > 0 && reviews.length >= 5 && (
        <div className="load-more">
          <button className="load-more-btn">Load More Reviews</button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
