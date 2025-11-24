import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'manager' && user.role !== 'manager') {
    return <Navigate to="/cashier" replace />;
  }

  return children;
};

export default ProtectedRoute;
