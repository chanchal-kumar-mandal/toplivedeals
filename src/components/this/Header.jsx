// src/components/Header.jsx
import React, { useState } from 'react';
import {
  FaSearch, FaTag, FaFire, FaRegBookmark,
  FaShoppingCart, FaLaptopCode, FaTshirt, FaHome, FaBook,
  FaAmazon, FaShoppingBag, FaUserTie, FaStore, FaRegGem
} from 'react-icons/fa';

const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case 'all': return <FaShoppingCart className="me-1" />;
    case 'electronics': return <FaLaptopCode className="me-1" />;
    case 'fashion': return <FaTshirt className="me-1" />;
    case 'home': return <FaHome className="me-1" />;
    case 'books': return <FaBook className="me-1" />;
    default: return null;
  }
};

const getPlatformIcon = (platform) => {
  switch (platform.toLowerCase()) {
    case 'all': return <FaShoppingCart className="me-1" />;
    case 'amazon': return <FaAmazon className="me-1" />;
    case 'flipkart': return <FaShoppingBag className="me-1" />;
    case 'myntra': return <FaUserTie className="me-1" />;
    case 'meesho': return <FaStore className="me-1" />;
    case 'ajio': return <FaRegGem className="me-1" />;
    default: return null;
  }
};

const Header = ({
  onSearch, currentView, onViewChange,
  selectedCategory, setSelectedCategory,
  selectedPlatform, setSelectedPlatform,
  availableCategories, availablePlatforms
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleViewChange = (view) => {
    onViewChange(view);
    setSearchTerm('');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-2 px-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand fw-bold fs-4 text-white" href="/">TopLiveDeals</a>

          <ul className="navbar-nav flex-row gap-3 mb-0">
            {['live', 'top', 'coupons'].map((view) => (
              <li key={view} className="nav-item">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleViewChange(view); }}
                  className={`nav-link px-2 text-white ${currentView === view ? 'fw-bold border-bottom border-white' : ''}`}
                >
                  {view === 'live' && <><FaFire className="me-1" />Live</>}
                  {view === 'top' && <><FaRegBookmark className="me-1" />Top</>}
                  {view === 'coupons' && <><FaTag className="me-1" />Coupons</>}
                </a>
              </li>
            ))}
          </ul>

          <form className="search-wrapper ms-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="btn btn-outline-light search-icon" type="submit">
              <FaSearch />
            </button>
          </form>
        </div>
      </nav>

      {/* Filters */}
      <div className="bg-light border-bottom shadow-sm px-3 py-2 small-filter-bar">
        <div className="container-fluid">
          <div className="row g-3">

            <div className="col-12 col-md-6 d-flex flex-wrap align-items-center gap-2">
              <span className="fw-bold me-2">Category:</span>
              {availableCategories.map((category) => (
                <button
                  key={category}
                  className={`btn btn-sm ${selectedCategory === category ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryIcon(category)} {category}
                </button>
              ))}
            </div>

            <div className="col-12 col-md-6 d-flex flex-wrap align-items-center gap-2">
              <span className="fw-bold me-2">Platform:</span>
              {availablePlatforms.map((platform) => (
                <button
                  key={platform}
                  className={`btn btn-sm ${selectedPlatform === platform ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedPlatform(platform)}
                >
                  {getPlatformIcon(platform)} {platform}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
