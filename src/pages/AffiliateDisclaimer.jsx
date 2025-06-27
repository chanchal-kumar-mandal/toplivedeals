// src/pages/AffiliateDisclaimer.jsx

import React from 'react';
import { Helmet } from 'react-helmet';

const AffiliateDisclaimer = () => {
  return (
    <div className="container py-5 px-3">
      <Helmet>
        <title>Affiliate Disclaimer | TopLiveDeals</title>
        <meta name="description" content="TopLiveDeals earns from qualifying purchases through affiliate links. Learn more about how affiliate links support our platform." />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          <h1 className="display-5 fw-bold text-primary text-center mb-4">Affiliate Disclaimer</h1>
          <p className="text-muted text-center mb-5">Last Updated: June 27, 2025</p>

          <h3 className="h5 fw-bold mb-3">Transparency Is Important to Us</h3>
          <p>
            At <strong>Top Live Deals</strong>, we believe in full transparency with our users. We want you to be aware that some of the links to products and deals on this site are “affiliate links.” This means that when you click on certain links and make a purchase, we may earn a small commission — at no extra cost to you.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">Why We Use Affiliate Links</h3>
          <ul>
            <li>To support the platform’s maintenance and operations.</li>
            <li>To keep the service free for all users.</li>
            <li>To continue improving our tools, features, and real-time deal discovery engine.</li>
          </ul>

          <h3 className="h5 fw-bold mt-4 mb-3">What This Means for You</h3>
          <p>
            Clicking on an affiliate link and making a purchase helps us — but it does <strong>not cost you anything extra</strong>. In fact, you may even receive exclusive discounts or offers through our partner links.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">Our Commitment</h3>
          <p>
            Even though we earn from affiliate partnerships, we never compromise on the quality or integrity of the deals we list. Every offer is handpicked or algorithmically filtered for genuine value — not based on commissions.
          </p>

          <div className="alert alert-info mt-5 text-center">
            💬 If you have questions about our affiliate relationships, feel free to email us at  
            <a href="mailto:support@toplivedeals.com" className="ms-1 text-decoration-underline">support@toplivedeals.com</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDisclaimer;
