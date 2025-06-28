// src/components/ProductDataManager.jsx
import { useAuth } from '../../contexts/UserAuthContext';
import { Navigate } from 'react-router-dom'; // redirect unauthorized users
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaImage, FaLink, FaTags, FaStar, FaPercentage, FaTicketAlt, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';
import { Button, Modal, Form, Row, Col, Table, Container, Pagination } from 'react-bootstrap';
import { useFirebase } from '../../contexts/FirebaseContext';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct } from '../../utils/dataProcessor';
import { serverTimestamp, Timestamp } from "firebase/firestore";
import styles from './ProductDataManager.module.css';


const ProductDataManager = () => {
  const { currentUser, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div>Loading authentication...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const { db } = useFirebase();

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [editingId, setEditingId] = useState(null);

  const [productForm, setProductForm] = useState({
    title: '', images: '', affiliateLink: '',
    priceBefore: '', priceAfter: '', discount: '', rating: '', ratingCount: '',
    couponCode: '', postedAgo: '', category: 'electronics', application: 'amazon', isTopDeal: false, isActive: true,
    createdAt: '', updatedAt: '',
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const previewImage = productForm.images?.split(',')[0]?.trim();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ['electronics', 'books', 'fashion', 'home', 'sports', 'kitchen', 'automotive', 'health'];
  const platforms = ['amazon', 'flipkart', 'meesho', 'myntra', 'nykaa', 'cultfit', 'ajio'];

  useEffect(() => {
  if (db) {
    const unsubscribe = subscribeToProducts(db, setProducts, (err) => {
      if (err) {
        setMessage(`Error: ${err}`);
      } else {
        setMessage(""); // clear only on successful load
      }
    });
    return () => unsubscribe();
  }
}, [db]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const openAddModal = () => {
    setProductForm({
      title: '', images: '', affiliateLink: '',
      priceBefore: '', priceAfter: '', discount: '', rating: '', ratingCount: '',
      couponCode: '', postedAgo: '', category: 'electronics', application: 'amazon', isTopDeal: false, isActive: true, createdAt: '', updatedAt: ''
    });
    setEditingId(null);
    setMode('add');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setProductForm(product);
    setEditingId(product.id);
    setMode('edit');
    setShowModal(true);
  };

  const validateForm = () => {
    const errs = {};
    if (!productForm.title) errs.title = 'Title is required';
    if (!productForm.images) errs.images = 'At least one image URL is required';
    if (!productForm.affiliateLink) errs.affiliateLink = 'Affiliate link is required';
    if (!productForm.priceBefore) errs.priceBefore = 'Price before is required';
    if (!productForm.priceAfter) errs.priceAfter = 'Price after is required';
    if (productForm.discount === '' || productForm.discount === null) productForm.discount = 0;
    if (productForm.rating === '' || productForm.rating === null) productForm.rating = 0;
    if (productForm.ratingCount === '' || productForm.ratingCount === null) productForm.ratingCount = 0;
    if (!productForm.category) errs.category = 'Category is required';
    if (!productForm.application) errs.application = 'Platform is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!db || !validateForm()) return;

    const now = serverTimestamp();

    const data = {
      ...productForm,
      priceBefore: Number(productForm.priceBefore),
      priceAfter: Number(productForm.priceAfter),
      discount: Number(productForm.discount) || 0,
      rating: Number(productForm.rating) || 0,
      ratingCount: Number(productForm.ratingCount) || 0,
      images: productForm.images.split(',').map(i => i.trim()).join(','),
    };

    if (mode === 'add') {
      data.createdAt = now;
      data.updatedAt = now;
      try {
        await addProduct(db, data);
        setMessage('Product added successfully');
      } catch (e) {
        setMessage('Operation failed: ' + e.message);
        return;
      }
    } else if (mode === 'edit' && editingId) {
      // Only assign createdAt if it already existed
      if (productForm.createdAt) {
        data.createdAt = productForm.createdAt;
      } else {
        data.createdAt = now; // fallback for legacy
      }
      data.updatedAt = now;
      try {
        await updateProduct(db, editingId, data);
        setMessage('Product updated successfully');
      } catch (e) {
        setMessage('Operation failed: ' + e.message);
        return;
      }
    }

    // ✅ Only close modal if operation succeeded
    setShowModal(false);

  };

  const handleDeleteConfirm = (id) => {
    setProductToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteProduct = async () => {
    if (!db || !productToDelete) return;
    try {
      await deleteProduct(db, productToDelete);
      setMessage('Product deleted');
    } catch (e) {
      setMessage('Delete failed: ' + e.message);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filtered = products.filter(p =>
    (!searchTerm || p.title?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!filterPlatform || p.application === filterPlatform) &&
    (!filterCategory || p.category === filterCategory) &&
    (!filterActive || String(p.isActive) === filterActive)
  );

  const sorted = [...filtered].sort((a, b) => {
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    return a[sortConfig.key] > b[sortConfig.key] ? dir : a[sortConfig.key] < b[sortConfig.key] ? -dir : 0;
  });

  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  return (
    <Container fluid className="py-4">
      <Row className="mb-3 align-items-end">
        <Col md={3}><Form.Control placeholder="Search Title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></Col>
        <Col md={2}><Form.Select value={filterPlatform} onChange={e => setFilterPlatform(e.target.value)}><option value="">All Platforms</option>{platforms.map(p => <option key={p}>{p}</option>)}</Form.Select></Col>
        <Col md={2}><Form.Select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}><option value="">All Categories</option>{categories.map(c => <option key={c}>{c}</option>)}</Form.Select></Col>
        <Col md={2}><Form.Select value={filterActive} onChange={e => setFilterActive(e.target.value)}><option value="">All</option><option value="true">Active</option><option value="false">Inactive</option></Form.Select></Col>
        <Col md={3} className="text-end">
          <Button variant="success" onClick={openAddModal}><FaPlus /> Add New Product</Button>
        </Col>
      </Row>

      {message && (
        <div className={`alert ${message.toLowerCase().includes('error') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {paginated.length} of {sorted.length} products
        </div>
        <Pagination>
          <Pagination.Prev disabled={currentPage === 1} onClick={goToPrevPage} />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>{i + 1}</Pagination.Item>
          ))}
          <Pagination.Next disabled={currentPage === totalPages} onClick={goToNextPage} />
        </Pagination>
      </div>

      <Table bordered striped hover responsive>
        <thead>
          <tr>
            <th onClick={() => handleSort('title')}>Title</th>
            <th>Platform</th>
            <th>Category</th>
            <th>Price Before</th>
            <th>Price After</th>
            <th>Discount</th>
            <th>Rating</th>
            <th>Count</th>
            <th>Coupon</th>
            <th>Posted Ago</th>
            <th>Top Deal</th>
            <th>Active</th>
            <th>Affiliate Link</th>
            <th>Actions</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.application}</td>
              <td>{p.category}</td>
              <td>₹{p.priceBefore}</td>
              <td>₹{p.priceAfter}</td>
              <td>{p.discount}%</td>
              <td>{p.rating}</td>
              <td>{p.ratingCount}</td>
              <td>{p.couponCode}</td>
              <td>{p.postedAgo}</td>
              <td>{p.isTopDeal ? '✔️' : ''}</td>
              <td>{p.isActive ? '✅' : '❌'}</td>
              <td><a href={p.affiliateLink} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt /></a></td>
              <td>
                <Button size="sm" variant="warning" onClick={() => openEditModal(p)}><FaEdit /></Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDeleteConfirm(p.id)}><FaTrash /></Button>
              </td>
              <td>{p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : ''}</td>
              <td>{p.updatedAt?.seconds ? new Date(p.updatedAt.seconds * 1000).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{mode === 'add' ? 'Add New Product' : 'Edit Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}><Form.Group><Form.Label><FaTags /> Title</Form.Label><Form.Control name="title" value={productForm.title} onChange={handleChange} isInvalid={!!errors.title} /><Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label><FaLink /> Affiliate Link</Form.Label><Form.Control name="affiliateLink" value={productForm.affiliateLink} onChange={handleChange} isInvalid={!!errors.affiliateLink} /><Form.Control.Feedback type="invalid">{errors.affiliateLink}</Form.Control.Feedback></Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group><Form.Label><FaImage /> Images</Form.Label><Form.Control name="images" value={productForm.images} onChange={handleChange} isInvalid={!!errors.images} /><Form.Control.Feedback type="invalid">{errors.images}</Form.Control.Feedback></Form.Group></Col>
              <Col md={6}>{!previewImage && mode === 'add' && (
                <div className="mt-2 text-muted">Preview Image will appear here</div>
              )}{previewImage && <img src={previewImage} alt="Preview" className="mt-2" style={{ maxHeight: '100px' }} />}</Col>
            </Row>
            <Row>
              <Col md={4}><Form.Group><Form.Label>Price Before</Form.Label><Form.Control type="number" name="priceBefore" value={productForm.priceBefore} onChange={handleChange} isInvalid={!!errors.priceBefore} /><Form.Control.Feedback type="invalid">{errors.priceBefore}</Form.Control.Feedback></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Price After</Form.Label><Form.Control type="number" name="priceAfter" value={productForm.priceAfter} onChange={handleChange} isInvalid={!!errors.priceAfter} /><Form.Control.Feedback type="invalid">{errors.priceAfter}</Form.Control.Feedback></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label><FaPercentage /> Discount</Form.Label><Form.Control type="number" name="discount" value={productForm.discount} onChange={handleChange} isInvalid={!!errors.discount} /><Form.Control.Feedback type="invalid">{errors.discount}</Form.Control.Feedback></Form.Group></Col>
            </Row>
            <Row>
              <Col md={4}><Form.Group><Form.Label><FaStar /> Rating</Form.Label><Form.Control type="number" name="rating" value={productForm.rating} onChange={handleChange} isInvalid={!!errors.rating} /><Form.Control.Feedback type="invalid">{errors.rating}</Form.Control.Feedback></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Rating Count</Form.Label><Form.Control type="number" name="ratingCount" value={productForm.ratingCount} onChange={handleChange} isInvalid={!!errors.ratingCount} /><Form.Control.Feedback type="invalid">{errors.ratingCount}</Form.Control.Feedback></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label><FaTicketAlt /> Coupon Code</Form.Label><Form.Control name="couponCode" value={productForm.couponCode} onChange={handleChange} /></Form.Group></Col>
            </Row>
            <Row>
              <Col md={4}><Form.Group><Form.Label>Posted Ago</Form.Label><Form.Control name="postedAgo" value={productForm.postedAgo} onChange={handleChange} /></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Category</Form.Label><Form.Select name="category" value={productForm.category} onChange={handleChange} isInvalid={!!errors.category}>{categories.map(c => <option key={c}>{c}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback></Form.Group></Col>
              <Col md={4}><Form.Group><Form.Label>Platform</Form.Label><Form.Select name="application" value={productForm.application} onChange={handleChange} isInvalid={!!errors.application}>{platforms.map(p => <option key={p}>{p}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.application}</Form.Control.Feedback></Form.Group></Col>
            </Row>
            <Row className="mt-3">
              <Col md={2}><Form.Check className="mt-2" type="checkbox" label="Top Deal" name="isTopDeal" checked={productForm.isTopDeal} onChange={handleChange} /></Col>
              <Col md={2}><Form.Check className="mt-2" type="checkbox" label="Active" name="isActive" checked={productForm.isActive} onChange={handleChange} /></Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Created At</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.createdAt?.seconds ? new Date(productForm.createdAt.seconds * 1000).toLocaleString() : ''}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Updated At</Form.Label>
                  <Form.Control
                    type="text"
                    value={productForm.updatedAt?.seconds ? new Date(productForm.updatedAt.seconds * 1000).toLocaleString() : ''}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>{mode === 'add' ? 'Add' : 'Update'}</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton><Modal.Title>Confirm Deletion</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteProduct}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDataManager;
