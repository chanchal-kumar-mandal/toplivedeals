// ProductDataManager.jsx
// Ensure this file is saved as .jsx, not .js

import React, { useState, useEffect, useCallback } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct } from '../utils/dataProcessor';

const ProductDataManager = () => {
  const navigate = useNavigate();
  const { id: editingProductId } = useParams();
  const { db } = useFirebase();

  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    title: '', description: '', images: '', affiliateLink: '',
    priceBefore: '', priceAfter: '', discount: '', rating: '', ratingCount: '',
    couponCode: '', postedAgo: '', category: 'electronics', application: 'amazon', isTopDeal: false,
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const categories = ['electronics', 'books', 'fashion', 'home', 'sports', 'kitchen', 'automotive', 'health'];
  const platforms = ['amazon', 'flipkart', 'meesho', 'myntra', 'nykaa', 'cultfit', 'ajio'];

  // Effect to subscribe to real-time product updates from Firestore
  useEffect(() => {
    if (db) {
      const unsubscribe = subscribeToProducts(db, setProducts, (errMessage) => setMessage(`Error: ${errMessage}`));
      return () => unsubscribe();
    }
  }, [db]);

  // Determine current mode (list, add, edit) based on the route
  const currentMode = useCallback(() => {
    if (editingProductId) return 'edit';
    if (window.location.pathname.endsWith('/admin/products/add')) return 'add';
    return 'list';
  }, [editingProductId]);

  // Effect to manage form state based on mode and editingProductId
  useEffect(() => {
    setErrors({});
    setMessage('');

    const mode = currentMode();

    if (mode === 'edit' && editingProductId) {
      const productToEdit = products.find(p => p.id === editingProductId);
      if (productToEdit) {
        setProductForm({
          title: productToEdit.title || '',
          description: productToEdit.description || '',
          images: productToEdit.images || '',
          affiliateLink: productToEdit.affiliateLink || '',
          priceBefore: productToEdit.priceBefore || 0,
          priceAfter: productToEdit.priceAfter || 0,
          discount: productToEdit.discount || 0,
          rating: productToEdit.rating || 0,
          ratingCount: productToEdit.ratingCount || 0,
          couponCode: productToEdit.couponCode || '',
          postedAgo: productToEdit.postedAgo || 'Just now',
          category: productToEdit.category || 'electronics',
          application: productToEdit.application || 'amazon',
          isTopDeal: productToEdit.isTopDeal ?? false,
        });
        setMessage('Editing product...');
      } else if (!products.length && editingProductId) {
        setMessage('Loading product details or product not found...');
      } else {
        navigate('/admin/products', { replace: true });
        setMessage('Product not found or removed.');
      }
    } else if (mode === 'add') {
      setProductForm({
        title: '', description: '', images: '', affiliateLink: '',
        priceBefore: '', priceAfter: '', discount: '', rating: '', ratingCount: '',
        couponCode: '', postedAgo: '', category: 'electronics', application: 'amazon', isTopDeal: false,
      });
      setMessage('Ready to add a new product.');
    }
  }, [products, editingProductId, currentMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['title', 'images', 'affiliateLink', 'priceBefore', 'priceAfter', 'discount', 'rating', 'ratingCount', 'category', 'application'];
    requiredFields.forEach(field => {
      if (typeof productForm[field] === 'string' && productForm[field].trim() === '') {
        newErrors[field] = 'This field is required.';
      } else if (typeof productForm[field] === 'number' && (isNaN(productForm[field]) || !isFinite(productForm[field]))) {
          newErrors[field] = 'This field is required.';
      }
    });

    const numericFields = ['priceBefore', 'priceAfter', 'discount', 'rating', 'ratingCount'];
    numericFields.forEach(field => {
      const numValue = Number(productForm[field]);
      if (productForm[field] !== '' && (isNaN(numValue) || !isFinite(numValue))) {
        newErrors[field] = 'Must be a valid number.';
      } else if (productForm[field] !== '' && numValue < 0) {
        newErrors[field] = 'Cannot be negative.';
      }
    });

    if (productForm.rating !== '' && (Number(productForm.rating) < 1 || Number(productForm.rating) > 5)) {
      newErrors.rating = 'Rating must be between 1 and 5.';
    }
    if (productForm.discount !== '' && (Number(productForm.discount) < 0 || Number(productForm.discount) > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100%.';
    }

    const urlFields = ['images', 'affiliateLink'];
    urlFields.forEach(field => {
      try {
        if (productForm[field]) {
          const urls = productForm[field].split(',').map(url => url.trim()).filter(Boolean);
          for (const url of urls) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              newErrors[field] = `URL for ${field} must start with http:// or https://`;
              break;
            }
            new URL(url);
          }
        }
      } catch (_) {
        newErrors[field] = `Invalid URL format for ${field}. Ensure URLs are valid and separated by commas if multiple.`;
      }
    });

    if (productForm.priceBefore !== '' && productForm.priceAfter !== '' && productForm.discount !== '') {
      const pb = Number(productForm.priceBefore);
      const pa = Number(productForm.priceAfter);
      const disc = Number(productForm.discount);
      if (pb > 0 && pa >= 0) {
        const calculatedDiscount = ((pb - pa) / pb) * 100;
        if (Math.abs(calculatedDiscount - disc) > 1) {
          newErrors.discount = 'Discount does not match prices (within 1% tolerance).';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const commonProductDataMapper = () => ({
    title: productForm.title,
    description: productForm.description || '',
    images: productForm.images.split(',').map(url => url.trim()).filter(Boolean).join(','),
    affiliateLink: productForm.affiliateLink,
    priceBefore: Number(productForm.priceBefore),
    priceAfter: Number(productForm.priceAfter),
    discount: Number(productForm.discount),
    rating: Number(productForm.rating),
    ratingCount: Number(productForm.ratingCount),
    couponCode: productForm.couponCode || '',
    postedAgo: productForm.postedAgo || 'Just now',
    category: productForm.category,
    application: productForm.application,
    isTopDeal: productForm.isTopDeal,
  });

  const handleAddProduct = async () => {
    if (!db) { setMessage('Database not ready.'); return; }
    if (validateForm()) {
      try {
        const newProductData = commonProductDataMapper();
        await addProduct(db, newProductData);
        setMessage('Product added successfully to Firestore!');
        navigate('/admin/products');
      } catch (e) {
        setMessage('Failed to add product: ' + e.message);
        console.error("Add Product Error:", e);
      }
    } else {
      setMessage('Please correct the errors in the form.');
    }
  };

  const handleUpdateProduct = async () => {
    if (!db) { setMessage('Database not ready.'); return; }
    if (validateForm() && editingProductId) {
      try {
        const updatedProductData = commonProductDataMapper();
        await updateProduct(db, editingProductId, updatedProductData);
        setMessage('Product updated successfully in Firestore!');
        navigate('/admin/products');
      } catch (e) {
        setMessage('Failed to update product: ' + e.message);
        console.error("Update Product Error:", e);
      }
    } else {
      setMessage('Please correct the errors in the form or select a product to update.');
    }
  };

  const handleCancelForm = () => {
    navigate('/admin/products');
  };

  const handleDeleteConfirm = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProduct = async () => {
    if (!db) { setMessage('Database not ready.'); return; }
    try {
      await deleteProduct(db, productToDelete);
      setMessage(`Product (ID: ${productToDelete}) deleted successfully from Firestore.`);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    } catch (e) {
      setMessage('Failed to delete product: ' + e.message);
      console.error("Delete Product Error:", e);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div className="product-data-manager-container">
      <Routes>
        <Route path="/" element={<h2 className="section-title">Manage Products</h2>} />
        <Route path="add" element={<h2 className="section-title">Add New Product</h2>} />
        <Route path="edit/:id" element={<h2 className="section-title">Edit Product</h2>} />
      </Routes>

      {message && <div className={`form-message ${Object.keys(errors).length > 0 ? 'error' : 'success'}`}>{message}</div>}

      <Routes>
        <Route path="/" element={
          <div className="product-list-management-section">
            <div className="list-header">
              <h3>Current Products ({products.length})</h3>
              <div className="list-actions">
                <button
                  className="btn secondary-btn"
                  onClick={() => navigate('add')}
                >
                  Add New
                </button>
              </div>
            </div>
            {products.length === 0 ? (
              <p className="no-products-message">No products added yet. Click "Add New" to start.</p>
            ) : (
              <ul className="product-list-full">
                {products.map(product => (
                  <li key={product.id} className="product-list-item">
                    <span className="product-title-list">{product.title}</span>
                    <span className="product-platform-list">{product.application}</span>
                    <span className="product-price-list">₹{product.priceAfter?.toLocaleString() || 'N/A'}</span>
                    <div className="item-actions">
                      <button className="icon-btn edit-btn" onClick={() => navigate(`edit/${product.id}`)}>
                        <FaEdit />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDeleteConfirm(product.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        } />

        <Route path="add" element={
          <div className="product-form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Title <span className="required">*</span></label>
                <input type="text" id="title" name="title" value={productForm.title} onChange={handleChange} />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={productForm.description} onChange={handleChange}></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="images">Image URL(s) (comma-separated) <span className="required">*</span></label>
                <input type="text" id="images" name="images" value={productForm.images} onChange={handleChange} placeholder="e.g., url1.jpg, url2.png" />
                {errors.images && <span className="error-text">{errors.images}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="affiliateLink">Affiliate Link <span className="required">*</span></label>
                <input type="text" id="affiliateLink" name="affiliateLink" value={productForm.affiliateLink} onChange={handleChange} />
                {errors.affiliateLink && <span className="error-text">{errors.affiliateLink}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="priceBefore">Price Before <span className="required">*</span></label>
                <input type="number" id="priceBefore" name="priceBefore" value={productForm.priceBefore} onChange={handleChange} />
                {errors.priceBefore && <span className="error-text">{errors.priceBefore}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="priceAfter">Price After <span className="required">*</span></label>
                <input type="number" id="priceAfter" name="priceAfter" value={productForm.priceAfter} onChange={handleChange} />
                {errors.priceAfter && <span className="error-text">{errors.priceAfter}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="discount">Discount (%) <span className="required">*</span></label>
                <input type="number" id="discount" name="discount" value={productForm.discount} onChange={handleChange} />
                {errors.discount && <span className="error-text">{errors.discount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (1-5) <span className="required">*</span></label>
                <input type="number" id="rating" name="rating" step="0.1" min="1" max="5" value={productForm.rating} onChange={handleChange} />
                {errors.rating && <span className="error-text">{errors.rating}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="ratingCount">Rating Count <span className="required">*</span></label>
                <input type="number" id="ratingCount" name="ratingCount" value={productForm.ratingCount} onChange={handleChange} />
                {errors.ratingCount && <span className="error-text">{errors.ratingCount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="couponCode">Coupon Code</label>
                <input type="text" id="couponCode" name="couponCode" value={productForm.couponCode} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="postedAgo">Posted Ago (e.g., "2 hours ago")</label>
                <input type="text" id="postedAgo" name="postedAgo" value={productForm.postedAgo} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category <span className="required">*</span></label>
                <select id="category" name="category" value={productForm.category} onChange={handleChange}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="application">Platform <span className="required">*</span></label>
                <select id="application" name="application" value={productForm.application} onChange={handleChange}>
                  {platforms.map(plat => (
                    <option key={plat} value={plat}>{plat.charAt(0).toUpperCase() + plat.slice(1)}</option>
                  ))}
                </select>
                {errors.application && <span className="error-text">{errors.application}</span>}
              </div>

              <div className="form-group checkbox-group">
                <input type="checkbox" id="isTopDeal" name="isTopDeal" checked={productForm.isTopDeal} onChange={handleChange} />
                <label htmlFor="isTopDeal">Is Top Deal?</label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn secondary-btn" onClick={handleCancelForm}>
                Cancel
              </button>
              <button type="button" className="btn primary-btn" onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>
        } />

        <Route path="edit/:id" element={
          <div className="product-form-section">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Title <span className="required">*</span></label>
                <input type="text" id="title" name="title" value={productForm.title} onChange={handleChange} />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={productForm.description} onChange={handleChange}></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="images">Image URL(s) (comma-separated) <span className="required">*</span></label>
                <input type="text" id="images" name="images" value={productForm.images} onChange={handleChange} placeholder="e.g., url1.jpg, url2.png" />
                {errors.images && <span className="error-text">{errors.images}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="affiliateLink">Affiliate Link <span className="required">*</span></label>
                <input type="text" id="affiliateLink" name="affiliateLink" value={productForm.affiliateLink} onChange={handleChange} />
                {errors.affiliateLink && <span className="error-text">{errors.affiliateLink}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="priceBefore">Price Before <span className="required">*</span></label>
                <input type="number" id="priceBefore" name="priceBefore" value={productForm.priceBefore} onChange={handleChange} />
                {errors.priceBefore && <span className="error-text">{errors.priceBefore}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="priceAfter">Price After <span className="required">*</span></label>
                <input type="number" id="priceAfter" name="priceAfter" value={productForm.priceAfter} onChange={handleChange} />
                {errors.priceAfter && <span className="error-text">{errors.priceAfter}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="discount">Discount (%) <span className="required">*</span></label>
                <input type="number" id="discount" name="discount" value={productForm.discount} onChange={handleChange} />
                {errors.discount && <span className="error-text">{errors.discount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating (1-5) <span className="required">*</span></label>
                <input type="number" id="rating" name="rating" step="0.1" min="1" max="5" value={productForm.rating} onChange={handleChange} />
                {errors.rating && <span className="error-text">{errors.rating}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="ratingCount">Rating Count <span className="required">*</span></label>
                <input type="number" id="ratingCount" name="ratingCount" value={productForm.ratingCount} onChange={handleChange} />
                {errors.ratingCount && <span className="error-text">{errors.ratingCount}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="couponCode">Coupon Code</label>
                <input type="text" id="couponCode" name="couponCode" value={productForm.couponCode} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="postedAgo">Posted Ago (e.g., "2 hours ago")</label>
                <input type="text" id="postedAgo" name="postedAgo" value={productForm.postedAgo} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category <span className="required">*</span></label>
                <select id="category" name="category" value={productForm.category} onChange={handleChange}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="application">Platform <span className="required">*</span></label>
                <select id="application" name="application" value={productForm.application} onChange={handleChange}>
                  {platforms.map(plat => (
                    <option key={plat} value={plat}>{plat.charAt(0).toUpperCase() + plat.slice(1)}</option>
                  ))}
                </select>
                {errors.application && <span className="error-text">{errors.application}</span>}
              </div>

              <div className="form-group checkbox-group">
                <input type="checkbox" id="isTopDeal" name="isTopDeal" checked={productForm.isTopDeal} onChange={handleChange} />
                <label htmlFor="isTopDeal">Is Top Deal?</label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn secondary-btn" onClick={handleCancelForm}>
                Cancel
              </button>
              <button type="button" className="btn primary-btn" onClick={handleUpdateProduct}>
                Update Product
              </button>
            </div>
          </div>
        } />
      </Routes>

      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn secondary-btn" onClick={handleCancelDelete}>Cancel</button>
              <button className="btn delete-confirm-btn" onClick={handleDeleteProduct}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDataManager;