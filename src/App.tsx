import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CssBaseline, AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { ThemeContextProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDashboardLayout from './layouts/AdminDashboardLayout/AdminDashboardLayout';
import {ProtectedRoute, AdminProtectedRoute} from './components/ProtectedRoutes';

import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Online Store
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/orders">
              My Orders
            </Button>
            {isAdmin && (
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            )}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default function App() {
  return (
    <ThemeContextProvider>
      <AuthProvider>
        <CssBaseline />
        <Router>
          <Navbar />
          <Box sx={{ p: 3 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/orders"
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
                    <AdminDashboardLayout>
                      <AdminDashboardPage />
                    </AdminDashboardLayout>
                  </AdminProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeContextProvider>
  );
}
