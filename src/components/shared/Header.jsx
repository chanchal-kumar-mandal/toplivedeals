import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaSearch, FaChevronDown, FaChevronUp, FaTags,
  FaShoppingCart, FaPercent, FaUserCircle, FaSignOutAlt,
  FaSignInAlt, FaUserPlus, FaUserEdit, FaCog, FaAngleDown, FaAngleUp, FaBars
} from 'react-icons/fa';
import logo from '../../assets/TLD-logo-150.png';
import { useAuth } from '../../contexts/UserAuthContext';
import styles from './Header.module.css';
import { trackEvent } from '../../utils/analytics';


const Header = ({
  activeTab, setActiveTab, searchTerm, setSearchTerm,
  openDropdown, setOpenDropdown,
  categories, selectedCategory, handleCategoryClick,
  platforms, selectedPlatform, handlePlatformClick,
  discountRanges, selectedDiscountRange, handleDiscountClick
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(prev => (prev === menu ? null : menu));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const getSearchPlaceholder = () => {
    if (location.pathname !== '/') return "Search disabled...";
    if (activeTab === 'topDeals') return "Search Top Deals...";
    if (activeTab === 'coupons') return "Search Coupons...";
    return "Search Live Deals...";
  };

  return (
    <>
      <header className={styles['main-header']}>
        <div className={styles['header-content-wrapper']}>

          {/* Hamburger - Mobile Only */}
          {isMobileView && (
            <button className={styles['menu-toggle']} onClick={toggleMobileMenu}>
              <FaBars />
            </button>
          )}

          {/* Logo */}
          <div className={styles['logo-wrapper']}>
            <img src={logo} alt="Top Live Deals Logo" className={styles['logo-image']} />
            <Link to="/" className={styles.logo} onClick={() => setOpenDropdown(null)}>Top Live Deals</Link>
          </div>

          {/* Nav Links */}
          <div className={styles['nav-links']}>
            <Link to="/" className={`${styles['nav-item']} ${activeTab === 'liveDeals' ? styles.active : ''}`} onClick={() => setActiveTab('liveDeals')}>Live Deals</Link>
            <Link to="/" className={`${styles['nav-item']} ${activeTab === 'topDeals' ? styles.active : ''}`} onClick={() => setActiveTab('topDeals')}>Top Deals</Link>
            <Link to="/" className={`${styles['nav-item']} ${activeTab === 'coupons' ? styles.active : ''}`} onClick={() => setActiveTab('coupons')}>Coupons</Link>

            {/* Filters */}
            {['category', 'platform', 'discount'].map((type) => {
              const icon = type === 'category' ? <FaTags /> :
                type === 'platform' ? <FaShoppingCart /> : <FaPercent />;
              const items = type === 'category' ? categories :
                type === 'platform' ? platforms : discountRanges;
              const selected = type === 'category' ? selectedCategory :
                type === 'platform' ? selectedPlatform : selectedDiscountRange;
              const handleClick = type === 'category' ? handleCategoryClick :
                type === 'platform' ? handlePlatformClick : handleDiscountClick;

              return (
                <div
                  key={type}
                  className={`${styles['filter-hover-group']} ${openDropdown === type ? styles['submenu-open'] : ''}`}
                  onClick={() => toggleDropdown(type)}
                  onMouseEnter={() => setOpenDropdown(type)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <div className={styles['filter-hover-title']}>
                    {icon} {type.charAt(0).toUpperCase() + type.slice(1)}
                    {openDropdown === type ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  <div className={styles['filter-hover-menu']}>
                    {items.map(item => (
                      <div key={item}
                        className={`${styles['filter-hover-item']} ${selected === item ? styles.active : ''}`}
                        onClick={() => handleClick(item)}
                      >
                        {type === 'discount' && item !== 'all' ? `${item}%+` : item.charAt(0).toUpperCase() + item.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Admin Menus */}
            {isAdminRoute && isLoggedIn && (
              <div
                className={`${styles['nav-item']} ${styles['has-submenu']} ${openDropdown === 'products' ? styles['submenu-open'] : ''}`}
                onClick={() => toggleDropdown('products')}
              >
                <span>Products</span> {openDropdown === 'products' ? <FaChevronUp /> : <FaChevronDown />}
                <div className={styles.submenu}>
                  <Link to="/admin/products" className={styles['submenu-item']}>View/Manage Products</Link>
                  <Link to="/admin/products/add" className={styles['submenu-item']}>Add New Product</Link>
                </div>
              </div>
            )}

            {/* Auth */}
            {isAdminRoute && !isLoggedIn && (
              <>
                <Link to="/login" className={styles['nav-item']}><FaSignInAlt /> Login</Link>
                <Link to="/register" className={styles['nav-item']}><FaUserPlus /> Register</Link>
              </>
            )}

            {isAdminRoute && isLoggedIn && (
              <div className={`${styles['nav-item']} ${styles['user-info']}`}>
                <div className={styles['user-trigger']} onClick={() => toggleDropdown('user')}>
                  <FaUserCircle className={styles['user-icon']} />
                  {openDropdown === 'user' ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {openDropdown === 'user' && (
                  <div className={styles['submenu']}>
                    <div className={styles['user-info']}>
                      <strong>{currentUser.displayName || 'Admin'}</strong>
                      <p>{currentUser.email}</p>
                    </div>
                    <Link to="/admin/profile" className={styles['submenu-item']}><FaUserEdit /> Edit Profile</Link>
                    <Link to="/admin/settings" className={styles['submenu-item']}><FaCog /> Settings</Link>
                    <div className={styles['submenu-item']} onClick={handleLogout}><FaSignOutAlt /> Sign Out</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search Input */}
          <div className={`${styles['search-wrapper']} ${isSearchOpen ? styles['search-open'] : ''}`}>
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              className={styles['search-input']}
              value={searchTerm}
              onChange={(e) => {
                const keyword = e.target.value;
                setSearchTerm(keyword);

                // Trigger GA4 search tracking if user has typed at least 2 characters
                if (keyword.trim().length >= 2) {
                  trackEvent('Search Input', 'Search', keyword);
                }
              }}
              disabled={location.pathname !== '/'}
            />
            <button
              className={styles['search-icon']}
              onClick={() => {
                if (isSearchOpen && searchTerm) {
                  setSearchTerm('');
                } else {
                  setIsSearchOpen(!isSearchOpen);
                }
              }}
              disabled={location.pathname !== '/'}
              style={{ right: isSearchOpen ? 0 : 'auto', left: isSearchOpen ? 'auto' : 0 }}
            >
              {isSearchOpen ? '✕' : <FaSearch />}
            </button>
          </div>
        </div>
      </header>

      {/* === Mobile Sidebar Menu === */}
      {isMobileView && isMobileMenuOpen && (
        <>
        {/* Overlay */}
        <div
          className={styles['sidebar-overlay']}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Sidebar */}
        <div className={styles['mobile-sidebar']}>
          <button
            className={styles['sidebar-close-btn']}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ✕
          </button>

          <div className={styles['mobile-nav-section']}>
            <strong>Categories</strong>
            {categories.map(cat => (
              <div
                key={cat}
                className={selectedCategory === cat ? styles.active : ''}
                onClick={() => {
                  handleCategoryClick(cat);
                  setIsMobileMenuOpen(false); // optionally close menu
                }}
              >
                {cat}
              </div>
            ))}
          </div>
          <div className={styles['mobile-nav-section']}>
            <strong>Platforms</strong>
            {platforms.map(plat => (
              <div
                key={plat}
                className={selectedPlatform === plat ? styles.active : ''}
                onClick={() => {
                  handlePlatformClick(plat);
                  setIsMobileMenuOpen(false);
                }}
              >
                {plat}
              </div>
            ))}
          </div>
          <div className={styles['mobile-nav-section']}>
            <strong>Discounts</strong>
            {discountRanges.map(range => (
              <div
                key={range}
                className={selectedDiscountRange === range ? styles.active : ''}
                onClick={() => {
                  handleDiscountClick(range);
                  setIsMobileMenuOpen(false);
                }}
              >
                {range}%+
              </div>
            ))}
          </div>
        </div>
      </>
    )}
    </>
  );
};

export default Header;
