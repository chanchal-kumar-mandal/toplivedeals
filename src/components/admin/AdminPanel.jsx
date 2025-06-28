import styles from './AdminPanel.module.css';

return (
  <div className={styles.container}>
    <h2 className={styles.sectionTitle}>Manage Products</h2>

    <div className={styles.listSection}>
      <div className={styles.listHeader}>
        <h3 className={styles.listTitle}>Product List</h3>
        <div className={styles.listActions}>
          {/* action buttons here */}
        </div>
      </div>

      <ul className={styles.productList}>
        {products.map((product) => (
          <li className={styles.productItem} key={product.id}>
            <span className={styles.title}>{product.title}</span>
            <span className={styles.platform}>{product.platform}</span>
            <span className={styles.price}>{product.price}</span>
            <div className={styles.actions}>
              <button className={`${styles.iconBtn} ${styles.edit}`}>
                <i className="fas fa-edit" />
              </button>
              <button className={`${styles.iconBtn} ${styles.delete}`}>
                <i className="fas fa-trash" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
