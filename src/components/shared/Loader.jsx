// src/components/common/Loader.jsx
import React from 'react';
import loaderGif from '../../assets/TLD-loading.gif'; // Update path if needed

const Loader = ({ message = "Loading your experience...", size = 100 }) => {
  return (
    <div className="loader-container">
      <img
        src={loaderGif}
        alt="Loading..."
        className="loader-gif"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      <p className="loader-message">{message}</p>
    </div>
  );
};

export default Loader;
