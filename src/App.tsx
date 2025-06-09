// src/App.tsx
import React, { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  ThemeProvider as MuiThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
} from '@mui/material';

import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoutes';
import HomePage from './pages/HomePage/HomePage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Layout from './layouts/MainLayout';
import AdminDashboardLayout from './layouts/AdminDashboardLayout/AdminDashboardLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage/AdminDashboardPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage/AdminUsersPage';
import AdminLogsPage from './pages/admin/AdminLogsPage/AdminLogsPage';
import AdminProductsPage from './pages/admin/AdminProductsPage/AdminProductsPage';
import ProductFormPage from './pages/admin/AdminProductsPage/ProductFormPage';
import AdminThemePage from './pages/admin/AdminThemePage/ThemePage';
import { useRedirect } from './context/RedirectContext';
import { useFirebaseAuthListener } from './hooks/useFirebaseAuthListener';
import { useAuthStore, useIsAdmin } from './stores/useAuthStore';
import { useThemeContext } from './context/ThemeContext';

import './App.css';

const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

export default function App() {
  useFirebaseAuthListener();
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();
  const isAdmin = useIsAdmin();
  const hasRedirected = useRef(false);
  const { consumeRedirect } = useRedirect();
  const { theme, isLoading } = useThemeContext();
 
  useEffect(() => {
    if (loading || hasRedirected.current) return;

    if (!user) {
      navigate('/login');
    } else {
      const target = consumeRedirect();
      navigate(target || (isAdmin ? '/admin' : '/'));
      hasRedirected.current = true;
    }
  }, [user, loading, isAdmin, navigate]);

  if (isLoading || !theme) {
    return (
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={theme?.palette.background.default || '#fff'}
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>
      <Elements stripe={stripePromise}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage
                    items={[]}
                    total={0}
                    onSubmit={() => {}}
                    loading={false}
                    success={false}
                    register={() => {}}
                    errors={{}}
                    handleSubmit={(fn: any) => (e: any) => fn(e)}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminDashboardLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="logs" element={<AdminLogsPage />} />
              <Route path="products" element={<AdminProductsPage />} />
               <Route path="products/add" element={<ProductFormPage mode="add" />} />
                <Route path="products/edit/:productId" element={<ProductFormPage mode="edit" />} />
              <Route path="theme" element={<AdminThemePage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Elements>
    </MuiThemeProvider>
  );
}
