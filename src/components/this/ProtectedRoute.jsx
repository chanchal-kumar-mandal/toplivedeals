import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/UserAuthContext';

const ProtectedRoute = () => {
  const { isLoggedIn, loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5rem', color: '#333' }}>
             Loading authentication state...
           </div>;
  }
  // If authenticated, render the child routes/components
  // Otherwise, redirect to the login page
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;