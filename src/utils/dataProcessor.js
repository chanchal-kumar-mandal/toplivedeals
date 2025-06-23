// utils/dataProcessor.js

import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';

// FIX: Change PRODUCTS_COLLECTION_NAME to 'toplivedeals'
const PRODUCTS_COLLECTION_NAME = 'toplivedeals'; // <--- THIS IS THE CRITICAL CHANGE

/**
 * Fetches products from Firestore and listens for real-time updates.
 * @param {Firestore} db The Firestore database instance.
 * @param {function(Array): void} setProducts Callback to update React state with products.
 * @param {function(string): void} setError Callback to set an error message.
 * @returns {function(): void} An unsubscribe function to stop listening for updates.
 */
export const subscribeToProducts = (db, setProducts, setError) => {
  if (!db) {
    setError("Firestore database not initialized.");
    return () => {}; // Return empty unsubscribe
  }

  const productsRef = collection(db, PRODUCTS_COLLECTION_NAME);
  const q = query(productsRef); // Can add orderBy, where clauses here if needed

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const productsData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id, // Firestore document ID
        title: data.title || 'Untitled Product',
        description: data.description || '',
        images: data.images || '',
        affiliateLink: data.affiliateLink || '#',
        priceBefore: Number(data.priceBefore) || 0,
        priceAfter: Number(data.priceAfter) || 0,
        discount: Number(data.discount) || 0,
        rating: Number(data.rating) || 0,
        ratingCount: Number(data.ratingCount) || 0,
        couponCode: data.couponCode || '',
        postedAgo: data.postedAgo || 'Just now',
        category: data.category?.toLowerCase() || 'uncategorized',
        application: data.application?.toLowerCase() || 'other',
        isTopDeal: Boolean(data.isTopDeal),
      };
    });
    setProducts(productsData);
    setError(null); // Clear any previous errors
    console.log("Products updated from Firestore:", productsData.length);
  }, (error) => {
    console.error("Error subscribing to products:", error);
    setError("Failed to load products. Please try again.");
    setProducts([]); // Clear products on error
  });

  return unsubscribe; // Return the unsubscribe function
};

/**
 * Adds a new product to Firestore.
 * @param {Firestore} db The Firestore database instance.
 * @param {Object} productData The product data to add.
 */
export const addProduct = async (db, productData) => {
  if (!db) throw new Error("Firestore database not initialized.");
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION_NAME), productData);
    console.log("Product added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding product: ", e);
    throw e; // Re-throw to be handled by caller
  }
};

/**
 * Updates an existing product in Firestore.
 * @param {Firestore} db The Firestore database instance.
 * @param {string} productId The ID of the product to update.
 * @param {Object} productData The updated product data.
 */
export const updateProduct = async (db, productId, productData) => {
  if (!db) throw new Error("Firestore database not initialized.");
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION_NAME, productId);
    await updateDoc(productRef, productData);
    console.log("Product updated: ", productId);
  } catch (e) {
    console.error("Error updating product: ", e);
    throw e;
  }
};

/**
 * Deletes a product from Firestore.
 * @param {Firestore} db The Firestore database instance.
 * @param {string} productId The ID of the product to delete.
 */
export const deleteProduct = async (db, productId) => {
  if (!db) throw new Error("Firestore database not initialized.");
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION_NAME, productId));
    console.log("Product deleted: ", productId);
  } catch (e) {
    console.error("Error deleting product: ", e);
    throw e;
  }
};