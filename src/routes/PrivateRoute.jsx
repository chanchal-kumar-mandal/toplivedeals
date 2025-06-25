// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/UserAuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loadingAuth } = useAuth();

  if (loadingAuth) return <div>Loading auth...</div>;

  return currentUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
