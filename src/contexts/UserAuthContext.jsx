import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebase } from './FirebaseContext'; // Import FirebaseContext
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged // Still useful for reacting to global auth state
} from 'firebase/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { auth, db, firebaseApp } = useFirebase(); // Get auth and db from FirebaseContext
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoadingAuth(false);
      });
      return () => unsubscribe();
    }
  }, [auth]); // Re-run if auth instance changes

  const login = async (email, password) => {
    if (!auth) {
      console.error("Firebase Auth not initialized.");
      return { success: false, message: "Authentication service not ready." };
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // currentUser state will be updated by onAuthStateChanged listener
      return { success: true, message: "Logged in successfully!" };
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to log in.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many login attempts. Please try again later.";
      }
      return { success: false, message: errorMessage };
    }
  };

  const register = async (email, password) => {
    if (!auth) {
      console.error("Firebase Auth not initialized.");
      return { success: false, message: "Authentication service not ready." };
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // currentUser state will be updated by onAuthStateChanged listener
      return { success: true, message: "Registration successful! You are now logged in." };
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Failed to register.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Email already in use. Please use a different email or log in.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      }
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    if (!auth) {
      console.error("Firebase Auth not initialized.");
      return;
    }
    try {
      await signOut(auth);
      // currentUser state will be updated by onAuthStateChanged listener
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Provide Firebase instances to context consumers
  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    login,
    register,
    logout,
    loadingAuth // Indicate if auth state is still loading
  };

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#333' }}>
        Authenticating...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};