import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRedirect } from '../context/RedirectContext';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { setRedirectTo } = useRedirect();

  if (!user) {
    setRedirectTo(location.pathname);
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.email === 'admin@example.com';

  if (!user || !isAdmin) {
    const redirect = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?redirect=${redirect}`} />;
  }

  return <>{children}</>;
};
