// ✅ Cleaned and Fixed App.tsx
import React, { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';

import { ThemeContextProvider } from './context/ThemeContext';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoutes';
import HomePage from './pages/HomePage/HomePage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Layout from './layouts/Layout';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage/AdminDashboardPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage/AdminUsersPage';
import AdminLogsPage from './pages/admin/AdminLogsPage/AdminLogsPage';
import AdminProductsPage from './pages/admin/AdminProductsPage/AdminProductsPage';
import { useRedirect } from './context/RedirectContext';
import { useFirebaseAuthListener } from './hooks/useFirebaseAuthListener';
import { useAuthStore, useIsAdmin } from './stores/useAuthStore';
import AddProductPage from './pages/admin/AdminProductsPage/AddProductPage';
import EditProductPage from './pages/admin/AdminProductsPage/EditProductPage';



const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

export default function App() {
  useFirebaseAuthListener();
  const navigate = useNavigate();
  const { user, loading } = useAuthStore();
  const isAdmin = useIsAdmin();
  const hasRedirected = useRef(false);
  const { consumeRedirect } = useRedirect();

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

  return (
    <ThemeContextProvider>
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
                  <CheckoutPage />
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
               <Route path="products/edit/:productId" element={<EditProductPage />} />
            
              <Route path="products/new" element={<AddProductPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Elements>
    </ThemeContextProvider>
  );
}