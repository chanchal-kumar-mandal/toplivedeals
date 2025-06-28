// Import required dependencies
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';

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

import ProductDataManager from './components/admin/ProductDataManager';
import Login from './components/admin/Login';
import Register from './components/admin/Register';
import ProtectedRoute from './components/admin/ProtectedRoute';

import { subscribeToProducts } from './utils/dataProcessor';
import { FirebaseProvider, useFirebase } from './contexts/FirebaseContext';
import { AuthProvider } from './contexts/UserAuthContext';

import Header from './components/shared/Header';
import ProductList from './components/public/ProductList';

function App() {
  const { db } = useFirebase();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('liveDeals');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDiscountRange, setSelectedDiscountRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const categories = ['all', 'books', 'electronics', 'fashion', 'home', 'sports', 'kitchen', 'automotive', 'health'];
  const platforms = ['all', 'ajio', 'amazon', 'flipkart', 'meesho', 'myntra', 'nykaa', 'cultfit'];
  const discountRanges = ['all', '10', '20', '30', '40', '50', '60', '70', '80', '90'];

  /*Use cache products */
  useEffect(() => {
    if (db) {
      const cached = localStorage.getItem('cachedProducts');
      const cachedAt = localStorage.getItem('cachedAt');

      if (cached && cachedAt && Date.now() - cachedAt < 5 * 60 * 1000) {
        setProducts(JSON.parse(cached));
        setLoadingProducts(false);
        return;
      }

      const unsubscribe = subscribeToProducts(
        db,
        (products) => {
          localStorage.setItem('cachedProducts', JSON.stringify(products));
          localStorage.setItem('cachedAt', Date.now().toString());
          setProducts(products);
          setLoadingProducts(false);
        },
        (err) => {
          console.error(err);
          setLoadingProducts(false);
        }
      );
      return () => unsubscribe();
    }
  }, [db]);


  const filteredProducts = products
    .filter(product => {
      const isActive = product.isActive !== false;
      const productCategory = product.category?.toLowerCase() ?? '';
      const productApplication = product.application?.toLowerCase() ?? '';
      const productTitle = product.title?.toLowerCase() ?? '';

      const matchesCategory = selectedCategory === 'all' || productCategory === selectedCategory;
      const matchesPlatform = selectedPlatform === 'all' || productApplication === selectedPlatform;
      const matchesSearch = productTitle.includes(searchTerm.toLowerCase());

      let matchesTab = true;
      if (activeTab === 'topDeals') {
        matchesTab = product.isTopDeal === true;
      } else if (activeTab === 'coupons') {
        matchesTab = !!product.couponCode?.trim();
      }

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
      return bTime - aTime;
    });

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleCategoryClick = (cat) => setSelectedCategory(cat);
  const handlePlatformClick = (plat) => setSelectedPlatform(plat);
  const handleDiscountClick = (range) => setSelectedDiscountRange(range);

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryClick={handleCategoryClick}
        platforms={platforms}
        selectedPlatform={selectedPlatform}
        handlePlatformClick={handlePlatformClick}
        discountRanges={discountRanges}
        selectedDiscountRange={selectedDiscountRange}
        handleDiscountClick={handleDiscountClick}
      />

      {isMobileMenuOpen && <div className="overlay" onClick={toggleMobileMenu}></div>}

      <main className="content-area">
        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                activeTab={activeTab}
                loadingProducts={loadingProducts}
                filteredProducts={filteredProducts}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route
              path="products/*"
              element={
                <PrivateRoute>
                  <ProductDataManager />
                </PrivateRoute>
              }
            />
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
