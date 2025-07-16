import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if admin is authenticated
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin-login" replace />;
  }
  
  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute; 