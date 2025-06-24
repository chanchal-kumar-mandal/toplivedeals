// src/components/ProductDataManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit, FaImage, FaLink, FaTags, FaStar, FaPercentage, FaTicketAlt  } from 'react-icons/fa';
import { Button, Modal, Form, Row, Col, Table, Container, InputGroup } from 'react-bootstrap';
import { useFirebase } from '../../contexts/FirebaseContext';
import { subscribeToProducts, addProduct, updateProduct, deleteProduct } from '../../utils/dataProcessor';

const ProductDataManager = () => {
  const navigate = useNavigate();
  const { db } = useFirebase();

  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add'); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);

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

  useEffect(() => {
    if (db) {
      const unsubscribe = subscribeToProducts(db, setProducts, (errMessage) => setMessage(`Error: ${errMessage}`));
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
      title: '', description: '', images: '', affiliateLink: '',
      priceBefore: '', priceAfter: '', discount: '', rating: '', ratingCount: '',
      couponCode: '', postedAgo: '', category: 'electronics', application: 'amazon', isTopDeal: false,
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
    if (!productForm.discount) errs.discount = 'Discount is required';
    if (!productForm.rating) errs.rating = 'Rating is required';
    if (!productForm.ratingCount) errs.ratingCount = 'Rating count is required';
    if (!productForm.category) errs.category = 'Category is required';
    if (!productForm.application) errs.application = 'Platform is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!db || !validateForm()) return;
    const data = {
      ...productForm,
      priceBefore: Number(productForm.priceBefore),
      priceAfter: Number(productForm.priceAfter),
      discount: Number(productForm.discount),
      rating: Number(productForm.rating),
      ratingCount: Number(productForm.ratingCount),
      images: productForm.images.split(',').map(i => i.trim()).join(','),
    };
    try {
      if (mode === 'add') {
        await addProduct(db, data);
        setMessage('Product added successfully');
      } else if (mode === 'edit' && editingId) {
        await updateProduct(db, editingId, data);
        setMessage('Product updated successfully');
      }
      setShowModal(false);
    } catch (e) {
      setMessage('Operation failed: ' + e.message);
    }
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

  const previewImage = productForm.images.split(',')[0]?.trim();

  return (
    <Container fluid className="py-4">
      <Row className="mb-3">
        <Col><h2>Manage Products</h2></Col>
        <Col className="text-end">
          <Button onClick={openAddModal}>Add New Product</Button>
        </Col>
      </Row>

      {message && <div className="alert alert-info">{message}</div>}

      <Table bordered striped hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Platform</th>
            <th>Category</th>
            <th>Price Before</th>
            <th>Price After</th>
            <th>Discount</th>
            <th>Rating</th>
            <th>Rating Count</th>
            <th>Coupon Code</th>
            <th>Posted Ago</th>
            <th>Top Deal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
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
              <td>{p.isTopDeal ? 'Yes' : 'No'}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => openEditModal(p)}><FaEdit /></Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDeleteConfirm(p.id)}><FaTrash /></Button>
              </td>
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
              <Col md={6}><Form.Group><Form.Label><FaImage /> Images</Form.Label><Form.Control name="images" value={productForm.images} onChange={handleChange} isInvalid={!!errors.images} /><Form.Control.Feedback type="invalid">{errors.images}</Form.Control.Feedback>{previewImage && <img src={previewImage} alt="Preview" className="mt-2" style={{ maxHeight: '100px' }} />}</Form.Group></Col>
            </Row>
            <Row>
              <Col md={6}><Form.Group><Form.Label><FaLink /> Affiliate Link</Form.Label><Form.Control name="affiliateLink" value={productForm.affiliateLink} onChange={handleChange} isInvalid={!!errors.affiliateLink} /><Form.Control.Feedback type="invalid">{errors.affiliateLink}</Form.Control.Feedback></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label>Description</Form.Label><Form.Control as="textarea" name="description" value={productForm.description} onChange={handleChange} /></Form.Group></Col>
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
              <Col md={6}><Form.Group><Form.Label>Posted Ago</Form.Label><Form.Control name="postedAgo" value={productForm.postedAgo} onChange={handleChange} /></Form.Group></Col>
              <Col md={3}><Form.Group><Form.Label>Category</Form.Label><Form.Select name="category" value={productForm.category} onChange={handleChange} isInvalid={!!errors.category}>{categories.map(c => <option key={c}>{c}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback></Form.Group></Col>
              <Col md={3}><Form.Group><Form.Label>Platform</Form.Label><Form.Select name="application" value={productForm.application} onChange={handleChange} isInvalid={!!errors.application}>{platforms.map(p => <option key={p}>{p}</option>)}</Form.Select><Form.Control.Feedback type="invalid">{errors.application}</Form.Control.Feedback></Form.Group></Col>
            </Row>
            <Form.Check className="mt-2" type="checkbox" label="Top Deal" name="isTopDeal" checked={productForm.isTopDeal} onChange={handleChange} />
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
