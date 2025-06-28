import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import styles from './RatingStars.module.css'; // ✅ Import the CSS module

const RatingStars = ({ rating }) => {
  // Normalize rating between 0 and 5
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));

  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const totalRenderedStars = fullStars + (hasHalfStar ? 1 : 0);
  const emptyStars = Math.max(0, 5 - totalRenderedStars);

  return (
    <div className={styles.ratingStars}>
      {Array.from({ length: fullStars }, (_, i) => (
        <FaStar key={`full-${i}`} className={`${styles.starIcon} ${styles.full}`} />
      ))}
      {hasHalfStar && (
        <FaStarHalfAlt key="half" className={`${styles.starIcon} ${styles.half}`} />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <FaRegStar key={`empty-${i}`} className={`${styles.starIcon} ${styles.empty}`} />
      ))}
    </div>
  );
};

export default RatingStars;
