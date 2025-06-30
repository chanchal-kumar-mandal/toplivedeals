import React, { useState } from 'react';
import RatingStars from './RatingStars';
import { FaTag, FaExternalLinkAlt, FaClock } from 'react-icons/fa';
import amazonLogo from '../../assets/platforms/amazon.jpg';
import flipkartLogo from '../../assets/platforms/flipkart.jpg';
import myntraLogo from '../../assets/platforms/myntra.jpg';
import ajioLogo from '../../assets/platforms/ajio.jpg';
import { formatPostedTime } from '../../utils/timeUtils';
import { trackEvent } from '../../utils/analytics';
import styles from './ProductCard.module.css';


// Helper to get platform info (text and logo for better highlighting)
const getPlatformDisplay = (platformName) => {
  const lowerCasePlatform = platformName?.toLowerCase() ?? ''; // Safe access
  switch (lowerCasePlatform) {
    case 'amazon':
      return {
        logo: <img src={amazonLogo} alt="Amazon" className={styles.platformLogo} />,
        name: 'Amazon',
      };
    case 'flipkart':
      return {
        logo: <img src={flipkartLogo} alt="Flipkart" className={styles.platformLogo} />,
        name: 'Flipkart',
      };
    case 'myntra':
      return {
        logo: <img src={myntraLogo} alt="Myntra" className={styles.platformLogo} />,
        name: 'Myntra',
      };
    case 'ajio':
      return {
        logo: <img src={ajioLogo} alt="AJIO" className={styles.platformLogo} />,
        name: 'AJIO',
      };
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

    // Track buy button click event in Google Analytics
    trackEvent('Buy Now Clicked', 'Product Interaction', product.title);
  };

  const handleCopyCoupon = () => {
    if (product.couponCode) {
      navigator.clipboard.writeText(product.couponCode);
      setCouponCopied(true);
      setTimeout(() => setCouponCopied(false), 2000);
    }
  };

  const platformInfo = getPlatformDisplay(product.application);
  const timeLabel = formatPostedTime(product.createdAt, product.updatedAt);

  return (
    <div className={`${styles.card}`}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl || 'https://placehold.co/200x200/cccccc/000000?text=No+Image'}
          alt={product.title}
          className={styles.productMainImage}
          loading="lazy"           // ← native lazy-load
          decoding="async"         // ← hint for async decoding
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'https://placehold.co/200x200/cccccc/000000?text=Image+Error';
          }}
        />
        {/* Added onError fallback */}
        {/* Only show badge if discount is valid and greater than 0 */}
        {(product.discount && product.discount > 0) && <div className={styles.badge}>{product.discount}% OFF</div>}
      </div>

      <div className={styles.info}>
         <h3 className={styles.title}>{product.title}</h3>


        <div className={styles.features}>
          {product.couponCode && (
            <span className={styles.feature} style={{ backgroundColor: '#34c759', color: '#ffffff' }} onClick={handleCopyCoupon}>
              <FaTag style={{ marginRight: 4 }} />
              {couponCopied ? 'Copied!' : product.couponCode}
            </span>
          )}
          {timeLabel && (
            <span className={styles.feature} style={{ marginLeft: 'auto' }}>
              <FaClock style={{ marginRight: 4 }} />
              {timeLabel}
            </span>
          )}
        </div>

        <div className={styles.bottom}>
         <div className={styles.price}>
          <span className={styles.newPrice}>₹{(product.priceAfter ?? 0).toLocaleString()}</span>
           <span className={styles.oldPrice}>₹{(product.priceBefore ?? 0).toLocaleString()}</span>
          </div>
          <div className={styles.rating}>
            {/* Only render RatingStars if rating is valid and greater than 0 */}
            {product.rating > 0 && <RatingStars rating={product.rating} />}
            {product.ratingCount > 0 && <span className={styles.ratingCount}>{product.ratingCount.toLocaleString()}</span>}
          </div>
        </div>

        <div className={styles.meta}>
          <div className={styles.platform}>
            {platformInfo.logo}
            {/*<span className="platform-name">{platformInfo.name}</span>*/}
          </div>
          <button className={styles.buyNowBtn} onClick={handleBuyNowClick}>
            <FaExternalLinkAlt className={styles.icon} />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;