// src/pages/AboutUs.jsx

import React from 'react';
import { Helmet } from 'react-helmet';

const AboutUs = () => {
  return (
    <div className="container py-5 px-3">
      <Helmet>
        <title>About Us | TopLiveDeals</title>
        <meta
          name="description"
          content="Learn more about TopLiveDeals — your go-to platform for the best real-time deals, discounts, and coupons from top Indian shopping platforms like Amazon and Flipkart."
        />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <h2 className="text-center mb-4 display-5 fw-bold text-primary">About Us</h2>

          <p className="lead mb-4 text-center">
            <strong>Top Live Deals</strong> brings you the best real-time deals, coupons, and discounts from India's leading online shopping platforms like <strong>Amazon</strong>, <strong>Flipkart</strong>, and more.
          </p>

          <div className="border-start border-4 border-primary ps-3 mb-4">
            <p className="mb-0 text-muted">
              💡 <strong>Our Mission:</strong> Help shoppers save smartly, live better.
            </p>
          </div>

          <h3 className="h4 mt-5 mb-3 text-primary">Why Choose Top Live Deals? 🎯</h3>
          <ul className="list-group list-group-flush mb-4">
            <li className="list-group-item">🔍 <strong>Real-Time Price Monitoring</strong> – Stay ahead with live tracking of price drops and lightning deals.</li>
            <li className="list-group-item">⭐ <strong>Handpicked Deals</strong> – We select the most value-for-money offers, filtered by popularity and reviews.</li>
            <li className="list-group-item">🧠 <strong>AI-Powered Sorting</strong> (Coming Soon) – Personalized smart suggestions based on your preferences.</li>
            <li className="list-group-item">📦 <strong>Multi-Platform Coverage</strong> – Discover deals across Amazon, Flipkart, Myntra & more — all in one place.</li>
            <li className="list-group-item">💬 <strong>Community Feedback</strong> – Vote and comment on deals to help others shop smarter.</li>
          </ul>

          <h3 className="h4 mt-5 mb-3 text-primary">Our Vision 🌍</h3>
          <p>
            We aim to become India’s most trusted <strong>deal discovery platform</strong>, empowering online buyers with <strong>transparency, savings, and smarter shopping tools</strong>.
          </p>

          <h3 className="h4 mt-5 mb-3 text-primary">Who Are We? 👨‍💻👩‍💻</h3>
          <p>
            We’re a team of passionate developers, product researchers, and everyday shoppers. We believe discovering the right deal should be <strong>quick, easy, and rewarding</strong>. Proudly built in 🇮🇳 India.
          </p>

          <h3 className="h4 mt-5 mb-3 text-primary">Contact & Feedback 🤝</h3>
          <p>
            Got feedback or found a great deal to share?<br />
            📧 Reach out at: <a href="mailto:support@toplivedeals.com" className="text-decoration-underline">support@toplivedeals.com</a>
          </p>

          <h3 className="h4 mt-5 mb-3 text-primary">Stay Connected 🔗</h3>
          <div className="row gy-3">
            <div className="col-6 col-md-4 d-flex align-items-center">
              <a
                href="https://facebook.com/toplivedeals"
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-facebook me-2 fs-5"></i> Facebook
              </a>
            </div>
            <div className="col-6 col-md-4 d-flex align-items-center">
              <a
                href="https://linkedin.com/company/toplivedeals"
                className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-linkedin me-2 fs-5"></i> LinkedIn
              </a>
            </div>
            <div className="col-6 col-md-4 d-flex align-items-center">
              <a
                href="https://t.me/toplivedeals"
                className="btn btn-outline-info w-100 d-flex align-items-center justify-content-center"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-telegram me-2 fs-5"></i> Telegram
              </a>
            </div>
            <div className="col-6 col-md-4 d-flex align-items-center">
              <a
                href="https://instagram.com/toplivedeals"
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-instagram me-2 fs-5"></i> Instagram
              </a>
            </div>
            <div className="col-6 col-md-4 d-flex align-items-center">
              <a
                href="https://twitter.com/toplivedeals"
                className="btn btn-outline-dark w-100 d-flex align-items-center justify-content-center"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-twitter-x me-2 fs-5"></i> Twitter
              </a>
            </div>
          </div>

          <div className="alert alert-success mt-5 text-center fs-5 fw-semibold">
            Start Saving Smarter Today! 🛒
          </div>
          <p className="text-center text-muted mb-0">
            Because the <strong>right deal at the right time</strong> can make all the difference.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
