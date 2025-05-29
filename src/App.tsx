// src/App.tsx
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import HomePage from './pages/HomePage';
import AdminHomePage from './pages/admin/AdminHomePage/AdminHomePage';
import NotFoundPage from './pages/NotFoundPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  if (!auth || auth.loading) return <div>Loading...</div>;
  return auth.user ? <>{children}</> : <Navigate to="/" />;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  if (!auth || auth.loading) return <div>Loading...</div>;
  return auth.user && auth.isAdmin ? <>{children}</> : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminDashboardLayout>
                  <AdminHomePage />
                </AdminDashboardLayout>
              </AdminProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
