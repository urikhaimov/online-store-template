import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import {ProtectedRoute,AdminProtectedRoute} from './components/ProtectedRoutes';
import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import HomePage from './pages/HomePage/HomePage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage/AdminDashboardPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage/AdminUsersPage';
import AdminLogsPage from './pages/admin/AdminLogsPage/AdminLogsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/my-orders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />

            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboardLayout /></AdminProtectedRoute>}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="logs" element={<AdminLogsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeContextProvider>
  );
}
