import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';

const ProductList = ({ activeTab, loadingProducts, filteredProducts }) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const batchSize = 10;
  const productCountRef = useRef(0);

  const fallbackDeals = [
    { id: 'f1', title: '🔥 Fire TV Stick - 60% OFF' },
    { id: 'f2', title: '💡 Philips LED Combo - 80% OFF' },
    { id: 'f3', title: '📱 Realme Narzo Deal - 50% OFF' }
  ];

  const heading =
    activeTab === 'liveDeals'
      ? 'All Live Deals'
      : activeTab === 'topDeals'
      ? 'Top Deals'
      : 'Deals with Coupons';

  useEffect(() => {
    const initial = filteredProducts.slice(0, batchSize);
    setVisibleProducts(initial);
    productCountRef.current = initial.length;
    setHasMore(filteredProducts.length > batchSize);
  }, [filteredProducts]);

  const loadMoreProducts = useCallback(() => {
    setIsFetchingMore(true);
    const start = productCountRef.current;
    const end = start + batchSize;
    const nextBatch = filteredProducts.slice(start, end);

    if (nextBatch.length > 0) {
      setTimeout(() => {
        setVisibleProducts(prev => [...prev, ...nextBatch]);
        productCountRef.current = end;
        setHasMore(filteredProducts.length > end);
        setIsFetchingMore(false);
      }, 500); // simulate delay
    } else {
      setHasMore(false);
      setIsFetchingMore(false);
    }
  }, [filteredProducts]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

      if (nearBottom && hasMore && !loadingProducts && !isFetchingMore) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingProducts, loadMoreProducts, isFetchingMore]);

  return (
    <>
      <h2 className={styles.sectionTitle}>{heading}</h2>

      {loadingProducts ? (
        <div className={styles.loaderWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading Deals...</p>
        </div>
      ) : (
        <div className={styles.productGrid}>
          {visibleProducts.length > 0 ? (
            visibleProducts.map(product => (
              <div key={product.id} className={styles.productCardWrapper}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className={styles.noProductsWrapper}>
              <p className={styles.noProductsMessage}>
                No products found matching your criteria.
              </p>
              <h4>Trending deals for you:</h4>
              <ul>
                {fallbackDeals.map(deal => (
                  <li key={deal.id}>{deal.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Manual Load More Button */}
      {!loadingProducts && hasMore && visibleProducts.length > 0 && !isFetchingMore && (
        <button onClick={loadMoreProducts} className={styles.loadMoreBtn}>
          Load More Deals
        </button>
      )}

      {/* Bottom Spinner for auto-scroll */}
      {isFetchingMore && (
        <div className={styles.loaderWrapper}>
          <div className={styles.spinner}></div>
          <p>Loading more deals...</p>
        </div>
      )}
    </>
  );
};

export default ProductList;
