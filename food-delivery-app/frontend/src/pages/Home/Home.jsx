import React from "react";
import "./Home.css";

const Home = () => {
  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Fast, Local Food Delivery</h1>
          <p>
            Order from the best local restaurants with real-time tracking, easy
            checkout, and friendly drivers. Fresh food, delivered fast.
          </p>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-title">
          <h2>How it works</h2>
          <p className="lead">
            Browse restaurants, add items to cart, and checkout — we handle the
            rest. No hidden fees, transparent pricing, and support for local
            businesses.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Typical delivery in 20–40 minutes depending on location.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Transparent Pricing</h3>
            <p>No hidden fees — what you see at checkout is what you pay.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Top Rated</h3>
            <p>We partner with highly rated local restaurants only.</p>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <div className="section-title">
          <h2>Pricing</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Standard</h3>
            <p>
              Delivery fee: <strong>$2.99</strong>
            </p>
            <p>
              Service fee: <strong>2%</strong>
            </p>
          </div>
          <div className="feature-card">
            <h3>Priority</h3>
            <p>
              Delivery fee: <strong>$5.99</strong>
            </p>
            <p>Faster delivery windows and priority drivers.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
