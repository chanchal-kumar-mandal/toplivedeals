import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Loader from '../components/shared/Loader';

const FirebaseContext = createContext(null);

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }) => {
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [loadingFirebase, setLoadingFirebase] = useState(true);

  useEffect(() => {
    try {
      // MANDATORY: Use Canvas provided Firebase config
      const firebaseConfig = typeof __firebase_config !== 'undefined'
        ? JSON.parse(__firebase_config)
        : {
            apiKey: "AIzaSyDbWjUOkRFA0JyMq87ira-tyGbtLTyNKmA", // You'll get this from your Firebase project settings for your web app
            authDomain: "toplivedeals.firebaseapp.com",
            projectId: "toplivedeals",
            storageBucket: "toplivedeals.firebasestorage.app",
            messagingSenderId: "331636227694",
            appId: "331636227694" // You'll get this from your Firebase project settings for your web app
          };

      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setFirebaseApp(app);
      setDb(firestoreDb);
      setAuth(firebaseAuth);

      // MANDATORY: Handle initial auth token or sign in anonymously
      const handleAuth = async () => {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            console.log("Signing in with custom token...");
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
            console.log("Signed in with custom token.");
          } else {
            console.log("No custom token found, signing in anonymously...");
            await signInAnonymously(firebaseAuth);
            console.log("Signed in anonymously.");
          }
        } catch (error) {
          console.error("Firebase initial auth error:", error);
        } finally {
          setLoadingFirebase(false);
        }
      };

      // Listen for auth state changes to ensure user is ready
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        // User object available here, we don't need to manually set `currentUser` in AuthContext now
        // AuthContext will now directly read auth.currentUser
        if (user) {
            console.log("Firebase Auth State Changed: User logged in", user.uid);
        } else {
            console.log("Firebase Auth State Changed: User logged out");
        }
        if (loadingFirebase) { // Only call handleAuth once after first auth state check
            handleAuth();
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();

    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      setLoadingFirebase(false);
    }
  }, []); // Run only once on mount

  // Display a loading state if Firebase isn't ready
  if (loadingFirebase) {
    return <Loader message="Top Live Deals - Latest Discounts, Coupons & Offers..." />;
  }

  return (
    <FirebaseContext.Provider value={{ firebaseApp, db, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
};