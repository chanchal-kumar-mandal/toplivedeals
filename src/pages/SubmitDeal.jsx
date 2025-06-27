// src/pages/SubmitDeal.jsx

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const SubmitDeal = () => {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    category: '',
    platform: '',
    price: '',
    discount: '',
    image: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Deal:', formData);
    alert("✅ Thank you! Your deal has been submitted for review.");
    // You can integrate Firebase or API submission here
  };

  return (
    <div className="container py-5 px-3">
      <Helmet>
        <title>Submit a Deal | TopLiveDeals</title>
        <meta name="description" content="Have a great deal to share? Submit it to TopLiveDeals and help others save money online!" />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <h1 className="display-5 fw-bold text-primary text-center mb-4">Submit a Deal</h1>
          <p className="text-muted text-center mb-4">
            Found an amazing deal? Share it with the Top Live Deals community! All submissions are reviewed before publishing.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Deal Title *</label>
              <input
                type="text"
                className="form-control"
                name="title"
                required
                placeholder="E.g., Redmi Note 13 at ₹9999"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Product Link *</label>
              <input
                type="url"
                className="form-control"
                name="link"
                required
                placeholder="Paste product link (Amazon, Flipkart, etc.)"
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Category *</label>
                <select
                  className="form-select"
                  name="category"
                  required
                  onChange={handleChange}
                >
                  <option value="">-- Select Category --</option>
                  <option value="Mobiles">Mobiles</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                  <option value="Grocery">Grocery</option>
                  <option value="Travel">Travel</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Platform *</label>
                <select
                  className="form-select"
                  name="platform"
                  required
                  onChange={handleChange}
                >
                  <option value="">-- Select Platform --</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Myntra">Myntra</option>
                  <option value="TataCliq">TataCliq</option>
                  <option value="Ajio">Ajio</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Price (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  placeholder="E.g., 1499"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Discount (%)</label>
                <input
                  type="number"
                  className="form-control"
                  name="discount"
                  placeholder="E.g., 65"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Image URL (optional)</label>
              <input
                type="url"
                className="form-control"
                name="image"
                placeholder="Link to deal image (optional)"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Short Description *</label>
              <textarea
                className="form-control"
                name="description"
                rows="4"
                required
                maxLength="500"
                placeholder="Tell us what's great about this deal (max 500 chars)"
                onChange={handleChange}
              ></textarea>
              <div className="form-text text-end">{formData.description.length}/500</div>
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-success btn-lg">
                Submit Deal ✅
              </button>
            </div>
          </form>

          <div className="alert alert-warning text-center mt-5">
            ⚠️ Note: Submissions are manually reviewed. Spam, fake, or expired links will not be published.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitDeal;
