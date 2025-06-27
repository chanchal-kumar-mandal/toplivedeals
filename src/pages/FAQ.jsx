// src/pages/FAQ.jsx

import React from 'react';
import { Helmet } from 'react-helmet';

const FAQ = () => {
  return (
    <div className="container py-5 px-3">
      <Helmet>
        <title>FAQ | TopLiveDeals</title>
        <meta name="description" content="Find answers to common questions about how deals work, how to submit a deal, and how TopLiveDeals operates." />
      </Helmet>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <h1 className="display-5 fw-bold text-primary text-center mb-4">Frequently Asked Questions (FAQ)</h1>
          <p className="text-muted text-center mb-5">Find answers to the most commonly asked questions about Top Live Deals.</p>

          <div className="accordion" id="faqAccordion">

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq1">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1" aria-expanded="true" aria-controls="collapse1">
                  🔍 What is Top Live Deals?
                </button>
              </h2>
              <div id="collapse1" className="accordion-collapse collapse show" aria-labelledby="faq1" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Top Live Deals is a deal discovery platform that brings you the best real-time offers, price drops, coupons, and discounts from e-commerce platforms like Amazon, Flipkart, and more.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq2">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2" aria-expanded="false" aria-controls="collapse2">
                  🛍️ Do I need to register to use the site?
                </button>
              </h2>
              <div id="collapse2" className="accordion-collapse collapse" aria-labelledby="faq2" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  No, you can browse deals without registration. However, signing in may unlock features like bookmarking, voting, and custom deal alerts in the future.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq3">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                  💰 How do you earn money?
                </button>
              </h2>
              <div id="collapse3" className="accordion-collapse collapse" aria-labelledby="faq3" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  We earn through affiliate links. When you buy a product using our deal link, we may earn a small commission — at no extra cost to you.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq4">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse4" aria-expanded="false" aria-controls="collapse4">
                  ⏰ How often are the deals updated?
                </button>
              </h2>
              <div id="collapse4" className="accordion-collapse collapse" aria-labelledby="faq4" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Deals are updated in real-time. We continuously monitor and update the list to ensure freshness and accuracy.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq5">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse5" aria-expanded="false" aria-controls="collapse5">
                  📦 Do you sell products directly?
                </button>
              </h2>
              <div id="collapse5" className="accordion-collapse collapse" aria-labelledby="faq5" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  No, we do not sell any products directly. We only redirect you to the respective e-commerce platform where the product is listed.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header" id="faq6">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse6" aria-expanded="false" aria-controls="collapse6">
                  💬 Can I suggest a deal?
                </button>
              </h2>
              <div id="collapse6" className="accordion-collapse collapse" aria-labelledby="faq6" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  Yes! Please use our upcoming "Submit a Deal" page to share great offers with the community. We review all submissions before publishing.
                </div>
              </div>
            </div>

          </div>

          <div className="alert alert-secondary text-center mt-5">
            Still have questions? Contact us at <strong><a href="mailto:support@toplivedeals.com">support@toplivedeals.com</a></strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
