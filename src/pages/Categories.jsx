// src/pages/Categories.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const categories = [
  { name: 'Mobiles', slug: 'mobiles', icon: '📱' },
  { name: 'Electronics', slug: 'electronics', icon: '💻' },
  { name: 'Fashion', slug: 'fashion', icon: '👗' },
  { name: 'Home & Kitchen', slug: 'home', icon: '🏠' },
  { name: 'Grocery', slug: 'grocery', icon: '🛒' },
  { name: 'Beauty', slug: 'beauty', icon: '💅' },
  { name: 'Travel', slug: 'travel', icon: '✈️' },
  { name: 'Books', slug: 'books', icon: '📚' },
];

const Categories = () => {
  return (
    <div className="container py-5">
      <Helmet>
        <title>Categories | TopLiveDeals</title>
        <meta name="description" content="Browse deals by categories like Electronics, Fashion, Mobiles, and more. Find the best offers that match your interests." />
      </Helmet>
      <h1 className="text-center text-primary mb-5 fw-bold">Shop by Categories</h1>
      <div className="row g-4">
        {categories.map((cat) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={cat.slug}>
            <Link
              to={`/category/${cat.slug}`}
              className="text-decoration-none card h-100 shadow-sm"
            >
              <div className="card-body text-center">
                <div className="fs-1 mb-2">{cat.icon}</div>
                <h5 className="card-title text-dark">{cat.name}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
