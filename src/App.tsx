import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
} from '@mui/material';

import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoutes';
import CartButton from './components/CartButton';

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
import { RedirectProvider } from './context/RedirectContext';
// Stripe setup
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

// Top nav

// Main app
export default function App() {
  return (
    <ThemeContextProvider>
       <RedirectProvider>
      <AuthProvider>
        <CartProvider>
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
                  path="/admin"
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
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </Elements>
        </CartProvider>
      </AuthProvider>
      </RedirectProvider>
    </ThemeContextProvider>
  );
}
