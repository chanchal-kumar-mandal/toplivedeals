import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { FaTag, FaExternalLinkAlt, FaClock } from 'react-icons/fa';
import amazonLogo from '../../assets/platforms/amazon.png';
import flipkartLogo from '../../assets/platforms/flipkart.png';

// Helper to get platform info (text and logo for better highlighting)
const getPlatformDisplay = (platformName) => {
  const lowerCasePlatform = platformName?.toLowerCase() ?? ''; // Safe access
  switch (lowerCasePlatform) {
    case 'amazon': return { logo: <img src={amazonLogo} alt="Amazon" className="platform-logo" />, name: 'Amazon' };
    case 'flipkart': return { logo: <img src={flipkartLogo} alt="Flipkart" className="platform-logo" />, name: 'Flipkart' };
    default: return { logo: null, name: platformName ? platformName.charAt(0).toUpperCase() + platformName.slice(1) : 'Unknown' };
  }
};

const ProductCard = ({ product }) => {
  const [couponCopied, setCouponCopied] = useState(false);

  // Ensure images is a string, split it, get first, and provide a placeholder if none
  const imageUrl = (product.images && product.images.split(',')[0]) || 'https://placehold.co/200x200/cccccc/000000?text=No+Image';

  const handleBuyNowClick = () => {
    // Safely open affiliate link, default to a placeholder if undefined/null
    window.open(product.affiliateLink || '#', '_blank');
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
      <div className="img-container">
        <img src={imageUrl} alt={product.title} className="product-main-image" onError={(e) => { e.target.src = 'https://placehold.co/200x200/cccccc/000000?text=Image+Error'; }} /> {/* Added onError fallback */}
        {/* Only show badge if discount is valid and greater than 0 */}
        {(product.discount && product.discount > 0) && <div className="badge">{product.discount}% OFF</div>}
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
          {product.postedAgo && <span className="feat"><FaClock style={{ marginRight: 4 }} />{product.postedAgo}</span>}
        </div>

        <div className="bottom">
          <div className="price">
            <span className="new">₹{(product.priceAfter ?? 0).toLocaleString()}</span>
            <span className="old">₹{(product.priceBefore ?? 0).toLocaleString()}</span>
          </div>
          <div className="rating">
            {/* Only render RatingStars if rating is valid and greater than 0 */}
            {product.rating > 0 && <RatingStars rating={product.rating} />}
            {product.ratingCount > 0 && <span className="rcount">{product.ratingCount.toLocaleString()}</span>}
          </div>
        </div>

        <div className="meta">
          <div className="platform-display">
            {platformInfo.logo}
            <span className="platform-name">{platformInfo.name}</span>
          </div>
          <button className="btn buy-now-btn" onClick={handleBuyNowClick}>
            <FaExternalLinkAlt className="icon" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;