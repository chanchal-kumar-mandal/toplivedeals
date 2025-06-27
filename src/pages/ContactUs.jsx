// src/pages/ContactUs.jsx

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const ContactUs = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="container py-5 px-3">
      <Helmet>
        <title>Contact Us | TopLiveDeals</title>
        <meta name="description" content="Get in touch with the TopLiveDeals team for questions, feedback, or support. We're here to help you save more!" />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-xl-7">
          <h2 className="text-center mb-4 display-5 fw-bold text-primary">Contact Us</h2>
          <p className="text-center mb-5">
            Have questions, feedback, or suggestions? We’d love to hear from you.  
            Reach out via the form below or email us directly at:  
            <a href="mailto:support@toplivedeals.com" className="text-decoration-underline ms-1">support@toplivedeals.com</a>
          </p>

          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">Your Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="10-digit phone number"
                pattern="[6-9]{1}[0-9]{9}"
                title="Please enter a valid 10-digit Indian phone number"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="aadhaar" className="form-label fw-semibold">Aadhaar Number</label>
              <input
                type="text"
                className="form-control"
                id="aadhaar"
                placeholder="12-digit Aadhaar number"
                pattern="\d{12}"
                title="Please enter a valid 12-digit Aadhaar number"
                maxLength="12"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label fw-semibold">Message</label>
              <textarea
                className="form-control"
                id="message"
                rows="5"
                maxLength="300"
                placeholder="Write your message (max 300 characters)..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
              <div className="form-text text-end">
                {message.length}/300 characters
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
            </div>
          </form>

          <div className="alert alert-info text-center mt-5">
            📧 Prefer email? Contact us at: <strong>support@toplivedeals.com</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
