import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export  function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}


export  function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user } = useAuth();

  const isAdmin = user?.email === 'admin@example.com'; // replace with your admin rule

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}