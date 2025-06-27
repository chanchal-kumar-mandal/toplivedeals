// src/pages/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const NotFound = () => {
  return (
    <div className="container py-5 text-center">
      <Helmet>
        <title>404 - Page Not Found | TopLiveDeals</title>
        <meta name="description" content="Oops! The page you're looking for doesn't exist. Check the URL or return to TopLiveDeals homepage." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-4 text-secondary">Page Not Found</h2>
      <p className="mb-4">
        Sorry, the page you’re looking for doesn’t exist or may have been moved.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        ⬅ Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
