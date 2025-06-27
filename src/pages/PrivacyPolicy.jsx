// src/pages/PrivacyPolicy.jsx

import React from 'react';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  return (
    <div className="container py-5 px-3">
      <Helmet>
        <title>Privacy Policy | TopLiveDeals</title>
        <meta name="description" content="Understand how TopLiveDeals collects, uses, and protects your personal data. Your privacy is important to us." />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <h1 className="display-5 fw-bold text-primary text-center mb-4">Privacy Policy</h1>
          <p className="text-muted text-center mb-5">Last Updated: June 27, 2025</p>

          <h3 className="h5 fw-bold mb-3">1. Introduction</h3>
          <p>
            At <strong>Top Live Deals</strong>, we value your privacy and are committed to protecting your personal information.
            This Privacy Policy outlines how we collect, use, and safeguard your data when you access our website or use our services.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">2. Information We Collect</h3>
          <ul className="mb-4">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and Aadhaar (if submitted via contact forms).</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device info, and referral URLs.</li>
            <li><strong>Cookies & Usage Data:</strong> We use cookies to enhance your experience and analyze site traffic.</li>
          </ul>

          <h3 className="h5 fw-bold mt-4 mb-3">3. How We Use Your Information</h3>
          <ul className="mb-4">
            <li>To respond to your inquiries and provide support.</li>
            <li>To personalize the deals and offers shown to you.</li>
            <li>To improve website functionality and user experience.</li>
            <li>To send occasional emails about trending deals, if you've opted in.</li>
          </ul>

          <h3 className="h5 fw-bold mt-4 mb-3">4. Sharing & Disclosure</h3>
          <p>
            We do <strong>not sell or rent</strong> your personal data. We may share limited data with trusted third-party services
            (e.g., analytics, email tools) strictly for site improvement and communication purposes.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">5. Affiliate Links Disclaimer</h3>
          <p>
            Some links on our platform are affiliate links. When you click these and make a purchase, we may earn a small commission — at no extra cost to you.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">6. Data Security</h3>
          <p>
            We implement reasonable technical and organizational measures to protect your data, but no method of transmission over the internet is 100% secure.
            Use our services at your own discretion.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">7. Your Choices & Rights</h3>
          <ul className="mb-4">
            <li>You may contact us to view, correct, or delete your personal data.</li>
            <li>You can opt-out of promotional emails anytime.</li>
            <li>You may disable cookies via your browser settings.</li>
          </ul>

          <h3 className="h5 fw-bold mt-4 mb-3">8. Third-Party Services</h3>
          <p>
            Our site may link to external websites or services. We are not responsible for their privacy practices. Please review their policies before interacting.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">9. Children's Privacy</h3>
          <p>
            Top Live Deals does not knowingly collect personal information from children under the age of 13. If you believe a child has provided us their data, please contact us for immediate removal.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">10. Updates to this Policy</h3>
          <p>
            We may revise this Privacy Policy periodically. Updated versions will be posted on this page with a revised date. Please check back regularly to stay informed.
          </p>

          <h3 className="h5 fw-bold mt-4 mb-3">11. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy or how your data is handled, feel free to email us at:  
            <a href="mailto:support@toplivedeals.com" className="text-decoration-underline ms-1">support@toplivedeals.com</a>
          </p>

          <div className="alert alert-info text-center mt-5">
            📌 We are committed to keeping your data secure and your trust intact.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
