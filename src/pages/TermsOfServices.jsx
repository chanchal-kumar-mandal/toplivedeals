// src/pages/TermsOfServices.jsx

import React from 'react';
import { Helmet } from 'react-helmet';

const TermsOfServices = () => {
  return (
    <div className="container py-5 px-3">
      <Helmet>
        <title>Terms of Services | TopLiveDeals</title>
        <meta name="description" content="Read the terms and conditions of using TopLiveDeals — your trusted platform for online deals and discounts." />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <h1 className="display-5 fw-bold text-primary text-center mb-4">Terms of Service</h1>

          <p className="text-muted mb-5 text-center">
            Last Updated: June 27, 2025
          </p>

          <h3 className="h5 fw-bold mb-3">1. Acceptance of Terms</h3>
          <p>
            By accessing or using <strong>Top Live Deals</strong> (“we”, “our”, “us”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree with any part of these Terms, please do not use our website or services.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">2. Use of the Website</h3>
          <p>
            Top Live Deals provides curated deals, coupons, and discounts sourced from third-party e-commerce websites such as Amazon, Flipkart, Myntra, and others. While we strive to ensure accuracy, we do not guarantee the availability, accuracy, or quality of the products or deals listed.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">3. Affiliate Disclosure</h3>
          <p>
            Some of the links provided on Top Live Deals are affiliate links. This means we may earn a small commission when you make purchases through those links — at no additional cost to you. This helps us keep the platform free and operational.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">4. User Conduct</h3>
          <ul className="mb-4">
            <li>You agree not to misuse the site for unlawful or unauthorized purposes.</li>
            <li>You shall not attempt to breach our security measures or interfere with our services.</li>
            <li>Content scraping, automated bots, and crawling are strictly prohibited.</li>
          </ul>

          <h3 className="h5 fw-bold mt-4 mb-3">5. Intellectual Property</h3>
          <p>
            All content, logos, branding, and UI/UX of Top Live Deals are protected by copyright laws and are the exclusive property of Top Live Deals unless otherwise mentioned. You may not reproduce, redistribute, or exploit any part of the platform without prior written permission.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">6. Third-Party Links</h3>
          <p>
            Our platform links to third-party websites for the purpose of displaying offers and deals. We do not control or take responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">7. Disclaimer of Warranties</h3>
          <p>
            All information and services on Top Live Deals are provided “as is” and “as available” without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any information or service.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">8. Limitation of Liability</h3>
          <p>
            In no event shall Top Live Deals be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in connection with the use of our platform or services.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">9. Changes to the Terms</h3>
          <p>
            We may revise these Terms at any time. Any changes will be effective immediately upon posting. Your continued use of the website constitutes your acceptance of those changes.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">10. Termination</h3>
          <p>
            We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including if you breach the Terms.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">11. Governing Law</h3>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India. Any disputes arising in connection with these Terms will be subject to the jurisdiction of courts in Kolkata, India.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">12. Contact Us</h3>
          <p>
            If you have any questions about these Terms, please contact us at:  
            <a href="mailto:support@toplivedeals.com" className="text-decoration-underline ms-1">support@toplivedeals.com</a>
          </p>

          <div className="alert alert-warning text-center mt-5">
            📌 Please review these terms regularly to stay informed of any updates.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServices;
