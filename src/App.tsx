import React from 'react';
import {
 
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

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

import AdminDashboardLayout from './layouts/AdminDashboardLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage/AdminDashboardPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage/AdminCategoriesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage/AdminUsersPage';
import AdminLogsPage from './pages/admin/AdminLogsPage/AdminLogsPage';

// Replace with your actual Stripe key
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

// Navbar defined inside App to access `useAuth`
function Navbar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Online Store
        </Typography>

        <Box>
          <CartButton />
        </Box>

        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/cart">
          Cart
        </Button>
        <Button color="inherit" component={Link} to="/checkout">
          Checkout
        </Button>

        {user && (
          <Button color="inherit" component={Link} to="/my-orders">
            My Orders
          </Button>
        )}
        {isAdmin && (
          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
        )}
        {user ? (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <CartProvider>
          <Elements stripe={stripePromise}>
        
              <Navbar />
              <Container sx={{ mt: 4 }}>
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
              </Container>
           
          </Elements>
        </CartProvider>
      </AuthProvider>
    </ThemeContextProvider>
  );
}
