// Import required dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
// Static Pages
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsOfServices from './pages/TermsOfServices';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AffiliateDisclaimer from './pages/AffiliateDisclaimer';
import FAQ from './pages/FAQ';
import SubmitDeal from './pages/SubmitDeal';
import Categories from './pages/Categories';
import NotFound from './pages/NotFound';
import ProductCard from './components/public/ProductCard';
import ProductDataManager from './components/admin/ProductDataManager';
import Login from './components/admin/Login';
import Register from './components/admin/Register';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { subscribeToProducts } from './utils/dataProcessor';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { AuthProvider, useAuth } from './contexts/UserAuthContext';
import { FaSearch, FaBars, FaTimes, FaChevronDown, FaChevronUp, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaUserEdit, FaCog, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import logo from './assets/TLD-logo-150.png';
import Loader from './components/shared/Loader';

function App() {
  const { db } = useFirebase();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('liveDeals');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDiscountRange, setSelectedDiscountRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const categories = ['all', 'books', 'electronics', 'fashion', 'home', 'sports', 'kitchen', 'automotive', 'health'];
  const platforms = ['all', 'ajio', 'amazon', 'flipkart', 'meesho', 'myntra', 'nykaa', 'cultfit'];
  const discountRanges = ['all', '10', '20', '30', '40', '50', '60', '70', '80', '90'];

  useEffect(() => {
    if (db) {
      const unsubscribe = subscribeToProducts(
        db,
        (products) => {
          setProducts(products);
          setLoadingProducts(false); // ✅ hide loader after fetch
        },
        (err) => {
          console.error(err);
          setLoadingProducts(false); // ✅ also hide on error
        }
      );
      return () => unsubscribe();
    }
  }, [db]);

  const filteredProducts = products
  .filter(product => {
    // Only include active products
    const isActive = product.isActive !== false;

    const productCategory = product.category?.toLowerCase() ?? '';
    const productApplication = product.application?.toLowerCase() ?? '';
    const productTitle = product.title?.toLowerCase() ?? '';

    const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || productApplication === selectedPlatform;
    const matchesSearch = productTitle.includes(searchTerm.toLowerCase());

    // Tab-specific filtering
    let matchesTab = true;
    if (activeTab === 'topDeals') {
      matchesTab = product.isTopDeal === true;
    } else if (activeTab === 'coupons') {
      matchesTab = !!product.couponCode?.trim();
    }

    // Discount range filter
    let matchesDiscount = true;
    if (selectedDiscountRange !== 'all') {
      const minDiscount = parseInt(selectedDiscountRange, 10);
      matchesDiscount = (product.discount ?? 0) >= minDiscount;
    }

    return (
      isActive &&
      matchesCategory &&
      matchesPlatform &&
      matchesSearch &&
      matchesTab &&
      matchesDiscount
    );
  })
  .sort((a, b) => {
    const aTime = a.createdAt?.seconds ?? 0;
    const bTime = b.createdAt?.seconds ?? 0;
    return bTime - aTime; // Newest first
  });


  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleCategoryClick = (cat) => setSelectedCategory(cat);
  const handlePlatformClick = (plat) => setSelectedPlatform(plat);
  const handleDiscountClick = (range) => setSelectedDiscountRange(range);

  const getSearchPlaceholder = useCallback(() => {
    if (location.pathname !== '/') return "Search disabled...";
    if (selectedCategory !== 'all') return `Search in ${selectedCategory}`;
    if (selectedPlatform !== 'all') return `Search on ${selectedPlatform}`;
    if (selectedDiscountRange !== 'all') return `Search ${selectedDiscountRange}%+ deals...`;
    return `Search all deals...`;
  }, [selectedCategory, selectedPlatform, selectedDiscountRange, location.pathname]);

  const Header = () => {
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); };
    const toggleDropdown = (menu) => setOpenDropdown(prev => prev === menu ? null : menu);

    return (
      <header className="main-header">
        <div className="header-content-wrapper">
          <div className="logo-wrapper">
            <img src={logo} alt="Top Live Deals Logo" className="logo-image" />
            <Link
              to="/"
              className="logo"
              onClick={() => setOpenDropdown(null)}
            >
              Top Live Deals
            </Link>
          </div>
          <div className="nav-links">
            <Link to="/" className={`nav-item ${activeTab === 'liveDeals' ? 'active' : ''}`} onClick={() => setActiveTab('liveDeals')}>Live Deals</Link>
            <Link to="/" className={`nav-item ${activeTab === 'topDeals' ? 'active' : ''}`} onClick={() => setActiveTab('topDeals')}>Top Deals</Link>
            <Link to="/" className={`nav-item ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => setActiveTab('coupons')}>Coupons</Link>
            {isAdminRoute && isLoggedIn && (
              <div className={`nav-item has-submenu ${openDropdown === 'products' ? 'submenu-open' : ''}`} onClick={() => toggleDropdown('products')}>
                <span>Products</span> {openDropdown === 'products' ? <FaChevronUp /> : <FaChevronDown />}
                {openDropdown === 'products' && (
                  <div className="submenu">
                    <Link to="/admin/products" className="submenu-item">View/Manage Products</Link>
                    <Link to="/admin/products/add" className="submenu-item">Add New Product</Link>
                  </div>
                )}
              </div>
            )}
            {isAdminRoute && !isLoggedIn && (
              <>
                <Link to="/login" className="nav-item"><FaSignInAlt /> Login</Link>
                <Link to="/register" className="nav-item"><FaUserPlus /> Register</Link>
              </>
            )}
            {isAdminRoute && isLoggedIn && (
              <div className="nav-item user-menu">
                <div className="user-trigger" onClick={() => toggleDropdown('user')}>
                  <FaUserCircle className="user-icon" />
                  {openDropdown === 'user' ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {openDropdown === 'user' && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <strong>{currentUser.displayName || 'Admin'}</strong>
                      <p>{currentUser.email}</p>
                    </div>
                    <Link to="/admin/profile" className="user-dropdown-item"><FaUserEdit /> Edit Profile</Link>
                    <Link to="/admin/settings" className="user-dropdown-item"><FaCog /> Settings</Link>
                    <div className="user-dropdown-item" onClick={handleLogout}><FaSignOutAlt /> Sign Out</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="search-wrapper">
            <input type="text" placeholder={getSearchPlaceholder()} className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={location.pathname !== '/'} />
            <button className="search-icon" disabled={location.pathname !== '/'}><FaSearch /></button>
          </div>
          <button className="menu-toggle" onClick={toggleMobileMenu}><FaBars /><span className="menu-toggle-text">Filters</span></button>
        </div>
      </header>
    );
  };

  const MobileSideMenu = () => {
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/login'); toggleMobileMenu(); };

    return (
      <div className={`mobile-side-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="menu-close-btn" onClick={toggleMobileMenu}><FaTimes /></button>
        </div>
        <div className="mobile-nav-section">
          <span className="mobile-filter-label">Navigation:</span>
          <div className="mobile-filter-options">
            <Link to="/" className={`filter-btn ${activeTab === 'liveDeals' ? 'active' : ''}`} onClick={() => { setActiveTab('liveDeals'); toggleMobileMenu(); }}>Live Deals</Link>
            <Link to="/" className={`filter-btn ${activeTab === 'topDeals' ? 'active' : ''}`} onClick={() => { setActiveTab('topDeals'); toggleMobileMenu(); }}>Top Deals</Link>
            <Link to="/" className={`filter-btn ${activeTab === 'coupons' ? 'active' : ''}`} onClick={() => { setActiveTab('coupons'); toggleMobileMenu(); }}>Coupons</Link>
            {isAdminRoute && isLoggedIn && (
              <>
                <Link to="/admin/products" className="filter-btn" onClick={toggleMobileMenu}>View/Manage Products</Link>
                <Link to="/admin/products/add" className="filter-btn" onClick={toggleMobileMenu}>Add New Product</Link>
              </>
            )}
            {isAdminRoute && !isLoggedIn && (
              <>
                <Link to="/login" className="filter-btn" onClick={toggleMobileMenu}>Login</Link>
                <Link to="/register" className="filter-btn" onClick={toggleMobileMenu}>Register</Link>
              </>
            )}
            {isAdminRoute && isLoggedIn && (
              <button className="filter-btn" onClick={handleLogout}>Logout ({currentUser.email})</button>
            )}
          </div>
        </div>
        {location.pathname === '/' && (
          <>
            <div className="mobile-filter-section">
              <span className="mobile-filter-label">Category:</span>
              <div className="mobile-filter-options">
                {categories.map(cat => (
                  <button key={cat} className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)}>{cat}</button>
                ))}
              </div>
            </div>
            <div className="mobile-filter-section">
              <span className="mobile-filter-label">Platform:</span>
              <div className="mobile-filter-options">
                {platforms.map(plat => (
                  <button key={plat} className={`filter-btn ${selectedPlatform === plat ? 'active' : ''}`} onClick={() => handlePlatformClick(plat)}>{plat}</button>
                ))}
              </div>
            </div>
            <div className="mobile-filter-section">
              <span className="mobile-filter-label">Discount:</span>
              <div className="mobile-filter-options">
                {discountRanges.map(range => (
                  <button key={range} className={`filter-btn ${selectedDiscountRange === range ? 'active' : ''}`} onClick={() => handleDiscountClick(range)}>{range === 'all' ? 'All' : `${range}%+`}</button>
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
          <Route
            path="/"
            element={
              <>
                <h2 className="section-title">
                  {activeTab === 'liveDeals'
                    ? 'All Live Deals'
                    : activeTab === 'topDeals'
                    ? 'Top Deals'
                    : 'Deals with Coupons'}
                </h2>

                {loadingProducts ? (
                  <Loader message="Top Live Deals - Latest Discounts, Coupons & Offers..." />
                ) : (
                  <div className="product-grid">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <div key={product.id} className="product-card-wrapper">
                          <ProductCard product={product} />
                        </div>
                      ))
                    ) : (
                      <p className="no-products-message">
                        No products found matching your criteria.
                      </p>
                    )}
                  </div>
                )}
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="products/*" element={
            <PrivateRoute>
              <ProductDataManager />
            </PrivateRoute>} />
          </Route>

          {/* Static pages */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/terms-of-services" element={<TermsOfServices />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/affiliate-disclaimer" element={<AffiliateDisclaimer />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/submit-deal" element={<SubmitDeal />} />
          <Route path="/categories" element={<Categories />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="main-footer">
        <div className="footer-links-row">
          <Link to="/about-us" className="footer-link">About Us</Link>
          <Link to="/contact-us" className="footer-link">Contact Us</Link>
          <Link to="/terms-of-services" className="footer-link">Terms of Services</Link>
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <Link to="/affiliate-disclaimer" className="footer-link">Affiliate Disclaimer</Link>
          <Link to="/faq" className="footer-link">FAQ</Link>
          <Link to="/submit-deal" className="footer-link">Submit a Deal</Link>
          <Link to="/categories" className="footer-link">Categories</Link>
        </div>
        <div className="footer-note text-center small mt-4 text-muted">
          © {new Date().getFullYear()} TopLiveDeals. All rights reserved.
          <br />
          Prices and offers are subject to change. Product availability and discounts are determined by respective sellers.
          <br />
          We may earn commissions from qualifying purchases made through affiliate links, at no additional cost to you.
        </div>
      </footer>
    </div>
  );
}

const RootApp = () => (
  <FirebaseProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </FirebaseProvider>
);

export default RootApp;
