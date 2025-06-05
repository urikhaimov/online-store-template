// src/components/Navbar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

import CartButton from './CartButton';
import { useAuthStore } from '../stores/useAuthStore';
const Navbar = () => {
  const { user, logout, isAdmin } = useAuthStore();

  return (
    <AppBar position="sticky" sx={{ zIndex: 1300 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ color: '#fff', textDecoration: 'none' }}>
          🛒 My Online Store
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/cart">Cart</Button>
          <Button color="inherit" component={Link} to="/checkout">Checkout</Button>
          {user && <Button color="inherit" component={Link} to="/my-orders">My Orders</Button>}
          {isAdmin && <Button color="inherit" component={Link} to="/admin">Admin</Button>}
          {user ? (
            <Button color="inherit" onClick={logout}>Logout</Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
          )}
          <CartButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
