import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import ProductDataManager from './components/ProductDataManager';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { subscribeToProducts } from './utils/dataProcessor'; // Only subscribeToProducts
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext'; // Import FirebaseProvider and useFirebase
import { AuthProvider, useAuth } from './contexts/UserAuthContext'; // Import AuthProvider and useAuth
import { FaSearch, FaBars, FaTimes, FaChevronDown, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

// Main App Component (now handles overall layout and routing)
function App() {
  const { db } = useFirebase(); // Get db from FirebaseContext
  const { isLoggedIn, currentUser, logout, loadingAuth } = useAuth(); // Use auth context

  const [products, setProducts] = useState([]); // Products for main display
  const [activeTab, setActiveTab] = useState('liveDeals');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDiscountRange, setSelectedDiscountRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false); // For desktop submenu

  const location = useLocation(); // Get current location to hide search/filters on non-home routes

  // Dummy filter data
  const categories = ['all', 'books', 'electronics', 'fashion', 'home', 'sports', 'kitchen', 'automotive', 'health'];
  const platforms = ['all', 'ajio', 'amazon', 'flipkart', 'meesho', 'myntra', 'nykaa', 'cultfit'];
  const discountRanges = ['all', '10', '20', '30', '40', '50', '60', '70', '80', '90'];

  // Effect to subscribe to real-time product updates from Firestore for main display
  useEffect(() => {
    if (db) {
      const unsubscribe = subscribeToProducts(db, setProducts, (errMessage) => console.error(errMessage)); // Use console.error for general loading
      return () => unsubscribe();
    }
  }, [db]); // Re-run if db instance changes

  const filteredProducts = products.filter(product => {
    const productCategory = product.category?.toLowerCase() ?? '';
    const productApplication = product.application?.toLowerCase() ?? '';
    const productTitle = product.title?.toLowerCase() ?? '';

    const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || productApplication === selectedPlatform;
    const matchesSearch = productTitle.includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (activeTab === 'topDeals') {
      matchesTab = product.isTopDeal;
    } else if (activeTab === 'coupons') {
      matchesTab = product.couponCode !== null && product.couponCode !== '';
    }

    let matchesDiscount = true;
    if (selectedDiscountRange !== 'all') {
      const minDiscount = parseInt(selectedDiscountRange);
      matchesDiscount = (product.discount ?? 0) >= minDiscount;
    }

    return matchesCategory && matchesPlatform && matchesSearch && matchesTab && matchesDiscount;
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
  };

  const handleDiscountClick = (range) => {
    setSelectedDiscountRange(range);
  };

  const handleProductMenuToggle = () => {
    setIsProductsMenuOpen(!isProductsMenuOpen);
  };

  const getSearchPlaceholder = useCallback(() => {
    // Search is only relevant on the main home page (path "/")
    if (location.pathname !== '/') {
      return "Search disabled...";
    }

    let activeFiltersCount = 0;
    let specificFilterName = '';
    let specificFilterValue = '';

    if (selectedCategory !== 'all') { activeFiltersCount++; specificFilterName = 'category'; specificFilterValue = selectedCategory; }
    if (selectedPlatform !== 'all') { activeFiltersCount++; specificFilterName = 'platform'; specificFilterValue = selectedPlatform; }
    if (selectedDiscountRange !== 'all') { activeFiltersCount++; specificFilterName = 'discount'; specificFilterValue = `${selectedDiscountRange}%+`; }

    if (activeFiltersCount === 1) {
      if (specificFilterName === 'category') { return `Search in ${specificFilterValue.charAt(0).toUpperCase() + specificFilterValue.slice(1)}...`; }
      else if (specificFilterName === 'platform') { return `Search on ${specificFilterValue.charAt(0).toUpperCase() + specificFilterValue.slice(1)}...`; }
      else if (specificFilterName === 'discount') { return `Search ${specificFilterValue} deals...`; }
    } else if (activeFiltersCount > 1) {
      return `Search filtered deals...`;
    }
    return `Search all deals...`;
  }, [selectedCategory, selectedPlatform, selectedDiscountRange, location.pathname]);


  const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn, currentUser, logout } = useAuth(); // Use auth context
    const location = useLocation(); // To determine if search should be enabled

    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    return (
      <header className="main-header">
        <div className="header-content-wrapper">
          <Link to="/" className="logo" onClick={() => setIsProductsMenuOpen(false)}>TopLiveDeals</Link>

          <div className="nav-links">
            <Link to="/"
              className={`nav-item ${activeTab === 'liveDeals' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('liveDeals'); setIsProductsMenuOpen(false); }}
            >
              Live Deals
            </Link>
            <Link to="/"
              className={`nav-item ${activeTab === 'topDeals' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('topDeals'); setIsProductsMenuOpen(false); }}
            >
              Top Deals
            </Link>
            <Link to="/"
              className={`nav-item ${activeTab === 'coupons' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('coupons'); setIsProductsMenuOpen(false); }}
            >
              Coupons
            </Link>

            {/* Products Dropdown/Menu Item for Admin */}
            {isLoggedIn && currentUser?.email && ( // Only show if logged in (any user for now)
              <div
                className={`nav-item has-submenu ${location.pathname.startsWith('/admin/products') ? 'active' : ''} ${isProductsMenuOpen ? 'submenu-open' : ''}`}
                onClick={handleProductMenuToggle}
              >
                <span>Products</span> <FaChevronDown className="submenu-arrow" />
                {isProductsMenuOpen && (
                  <div className="submenu">
                    <Link
                      to="/admin/products"
                      className="submenu-item"
                      onClick={(e) => { e.stopPropagation(); setIsProductsMenuOpen(false); }}
                    >
                      View/Manage Products
                    </Link>
                    <Link
                      to="/admin/products/add"
                      className="submenu-item"
                      onClick={(e) => { e.stopPropagation(); setIsProductsMenuOpen(false); }}
                    >
                      Add New Product
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* User Auth Links */}
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="nav-item">
                  <FaSignInAlt /> Login
                </Link>
                <Link to="/register" className="nav-item">
                  <FaUserPlus /> Register
                </Link>
              </>
            ) : (
              <div className="nav-item user-info" onClick={handleLogout}>
                <FaUserCircle /> {currentUser.email} {currentUser.uid && <span className="user-id-display"> (ID: {currentUser.uid.substring(0, 5)}...)</span>} <FaSignOutAlt className="ml-1" />
              </div>
            )}
          </div>

          <div className="search-wrapper">
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={location.pathname !== '/'} // Disable search input unless on home view
            />
            <button className="search-icon" disabled={location.pathname !== '/'}>
              <FaSearch />
            </button>
          </div>

          <button className="menu-toggle" onClick={toggleMobileMenu}>
            <FaBars />
            <span className="menu-toggle-text">Filters</span>
          </button>
        </div>
      </header>
    );
  };

  const MobileSideMenu = () => {
    const { isLoggedIn, currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
      logout();
      navigate('/login');
      toggleMobileMenu();
    };

    return (
      <div className={`mobile-side-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="menu-close-btn" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>
        <div className="mobile-nav-section">
          <span className="mobile-filter-label">Navigation:</span>
          <div className="mobile-filter-options">
            <Link
              to="/"
              className={`filter-btn ${activeTab === 'liveDeals' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('liveDeals'); toggleMobileMenu(); }}
            >
              Live Deals
            </Link>
            <Link
              to="/"
              className={`filter-btn ${activeTab === 'topDeals' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('topDeals'); toggleMobileMenu(); }}
            >
              Top Deals
            </Link>
            <Link
              to="/"
              className={`filter-btn ${activeTab === 'coupons' && location.pathname === '/' ? 'active' : ''}`}
              onClick={() => { setActiveTab('coupons'); toggleMobileMenu(); }}
            >
              Coupons
            </Link>

            {isLoggedIn && currentUser?.email && (
              <>
                <Link
                  to="/admin/products"
                  className={`filter-btn ${location.pathname.startsWith('/admin/products') && !location.pathname.endsWith('/add') && !location.pathname.includes('/edit/') ? 'active' : ''}`}
                  onClick={() => { toggleMobileMenu(); }}
                >
                  View/Manage Products
                </Link>
                <Link
                  to="/admin/products/add"
                  className={`filter-btn ${location.pathname.endsWith('/add') ? 'active' : ''}`}
                  onClick={() => { toggleMobileMenu(); }}
                >
                  Add New Product
                </Link>
              </>
            )}

            {!isLoggedIn ? (
              <>
                <Link to="/login" className="filter-btn" onClick={toggleMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="filter-btn" onClick={toggleMobileMenu}>
                  Register
                </Link>
              </>
            ) : (
              <button className="filter-btn" onClick={handleLogout}>
                Logout ({currentUser.email}) {currentUser.uid && <span className="user-id-display"> (ID: {currentUser.uid.substring(0, 5)}...)</span>}
              </button>
            )}
          </div>
        </div>

        {/* Filters section (only visible if on home route) */}
        {location.pathname === '/' && (
          <>
            <div className="mobile-filter-section">
              <span className="mobile-filter-label">Category:</span>
              <div className="mobile-filter-options">
                {categories.map(category => (
                  <button
                    key={`mobile-cat-${category}`}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="mobile-filter-section">
              <span className="mobile-filter-label">Platform:</span>
              <div className="mobile-filter-options">
                {platforms.map(platform => (
                  <button
                    key={`mobile-plat-${platform}`}
                    className={`filter-btn ${selectedPlatform === platform ? 'active' : ''}`}
                    onClick={() => handlePlatformClick(platform)}
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="mobile-filter-section">
              <span className="mobile-filter-label">Discount:</span>
              <div className="mobile-filter-options">
                {discountRanges.map(range => (
                  <button
                    key={`mobile-disc-${range}`}
                    className={`filter-btn ${selectedDiscountRange === range ? 'active' : ''}`}
                    onClick={() => handleDiscountClick(range)}
                  >
                    {range === 'all' ? 'All' : `${range}%+`}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };


  return (
    <div className="app-container">
      <Header />
      <MobileSideMenu />
      {isMobileMenuOpen && <div className="overlay" onClick={toggleMobileMenu}></div>}

      <main className="content-area">
        <Routes>
          <Route path="/" element={
            <>
              <h2 className="section-title">
                {activeTab === 'liveDeals' && 'All Live Deals'}
                {activeTab === 'topDeals' && 'Top Deals'}
                {activeTab === 'coupons' && 'Deals with Coupons'}
              </h2>
              <div className="product-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div key={product.id} className="product-card-wrapper">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <p className="no-products-message">No products found matching your criteria.</p>
                )}
              </div>
            </>
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route path="products/*" element={ // Use /* to allow nested routes within ProductDataManager
              <ProductDataManager />
            } />
          </Route>

          <Route path="*" element={<h2 className="section-title">404: Page Not Found</h2>} />
        </Routes>
      </main>

      <footer className="main-footer">
        © {new Date().getFullYear()} TopLiveDeals. All rights reserved.
        <br />As an Amazon Associate, I learn from qualifying purchases. Other affiliate programs apply.
      </footer>
    </div>
  );
}

// Wrapper component to provide Firebase and Auth Providers
const RootApp = () => (
  <FirebaseProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </FirebaseProvider>
);

export default RootApp;