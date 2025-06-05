import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useRedirect } from '../context/RedirectContext';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const { setRedirectTo, setMessage } = useRedirect();

  if (!user) {
    setRedirectTo(location.pathname);
    setMessage('You must be logged in to continue.');
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};

export const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuthStore();
  const location = useLocation();
  const { setRedirectTo, setMessage } = useRedirect();

  if (loading) return null; // or return a <Spinner />

  if (!user || !isAdmin) {
    setRedirectTo(location.pathname);
    setMessage('You must be an admin to access this page.');
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return <>{children}</>;
};

