import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStars = ({ rating }) => {
  // Ensure rating is a number and clamped between 0 and 5
  const normalizedRating = Math.max(0, Math.min(5, Number(rating) || 0));

  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 !== 0 && normalizedRating % 1 >= 0.5; // Consider half star only if >= 0.5
  // Adjust empty stars calculation to prevent negative values
  const totalRenderedStars = fullStars + (hasHalfStar ? 1 : 0);
  const emptyStars = Math.max(0, 5 - totalRenderedStars); // Ensure emptyStars is not negative

  return (
    <div className="rating-stars">
      {Array.from({ length: fullStars }, (_, i) => (
        <FaStar key={`full-${i}`} className="star-icon full" />
      ))}
      {hasHalfStar && (
        <FaStarHalfAlt key="half" className="star-icon half" />
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <FaRegStar key={`empty-${i}`} className="star-icon empty" />
      ))}
    </div>
  );
};

export default RatingStars;