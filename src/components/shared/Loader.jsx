// src/components/common/Loader.jsx
import React from 'react';
import styles from './Loader.module.css';
import loaderGif from '../../assets/TLD-loading.gif'; // Update path if needed

const Loader = ({ message = "Loading your experience...", size = 100 }) => {
  return (
    <div className={styles.loaderContainer}>
      <img
        src={loaderGif}
        alt="Loading..."
        className={styles.loaderImage}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      <p className={styles.loaderText}>{message}</p>
    </div>
  );
};

export default Loader;
