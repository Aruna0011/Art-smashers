import React from 'react';
import { Navigate } from 'react-router-dom';
import userService from '../utils/userService';

const UserProtectedRoute = ({ children }) => {
  const user = userService.getCurrentUser();
  if (!user) {
    return <Navigate to="/register" replace />;
  }
  return children;
};

export default UserProtectedRoute; 