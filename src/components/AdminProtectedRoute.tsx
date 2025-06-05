import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
