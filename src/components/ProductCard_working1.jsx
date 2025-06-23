import React, { useState } from 'react';
import RatingStars from './RatingStars';
// import ImageCarousel from './ImageCarousel'; // REMOVED
import { FaTag, FaExternalLinkAlt, FaClock } from 'react-icons/fa'; // Changed FaCartPlus to FaExternalLinkAlt for 'Buy'
import amazonLogo from '../assets/platforms/amazon.png';
import flipkartLogo from '../assets/platforms/flipkart.png';

// Helper to get platform info (text and logo for better highlighting)
const getPlatformDisplay = (platformName) => {
  const lowerCasePlatform = platformName.toLowerCase();
  switch (lowerCasePlatform) {
    case 'amazon': return { logo: <img src={amazonLogo} alt="Amazon" className="platform-logo" />, name: 'Amazon' };
    case 'flipkart': return { logo: <img src={flipkartLogo} alt="Flipkart" className="platform-logo" />, name: 'Flipkart' };
    // Add more platforms as needed
    default: return { logo: null, name: platformName.charAt(0).toUpperCase() + platformName.slice(1) };
  }
};

const ProductCard = ({ product }) => {
  const [couponCopied, setCouponCopied] = useState(false);

  const handleBuyNowClick = () => {
    window.open(product.affiliateLink, '_blank');
  };

  const handleCopyCoupon = () => {
    if (product.couponCode) {
      navigator.clipboard.writeText(product.couponCode);
      setCouponCopied(true);
      setTimeout(() => setCouponCopied(false), 2000);
    }
  };

  const platformInfo = getPlatformDisplay(product.application);

  return (
    <div className="card product-horizontal">
      <div className="img-container"> {/* Changed from img-carousel */}
        <img src={product.images[0]} alt={product.title} className="product-main-image" />
        <div className="badge">{product.discount}% OFF</div>
      </div>

      <div className="info">
        <h3 className="title two-lines">{product.title}</h3>

        <div className="feats">
          {product.couponCode && (
            <span className="feat coupon" onClick={handleCopyCoupon}>
              <FaTag style={{ marginRight: 4 }} />
              {couponCopied ? 'Copied!' : product.couponCode}
            </span>
          )}
          <span className="feat"><FaClock style={{ marginRight: 4 }} />{product.postedAgo || 'Just now'}</span>
        </div>

        <div className="bottom">
          <div className="price">
            <span className="new">₹{product.priceAfter.toLocaleString()}</span>
            <span className="old">₹{product.priceBefore.toLocaleString()}</span>
          </div>
          <div className="rating">
            <RatingStars rating={product.rating} />
            <span className="rcount">{product.ratingCount}</span>
          </div>
        </div>

        <div className="meta">
          <div className="platform-display"> {/* New div for platform */}
            {platformInfo.logo}
            <span className="platform-name">{platformInfo.name}</span>
          </div>
          <button className="btn buy-now-btn" onClick={handleBuyNowClick}> {/* Added buy-now-btn class */}
            <FaExternalLinkAlt className="icon" /> {/* Changed icon */}
            <span>Buy Now</span> {/* Changed text */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;