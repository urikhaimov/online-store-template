import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useAuthStore, useIsAdmin } from '../stores/useAuthStore';
import CartButton from './CartButton';
import {StoreSwitcher} from './StoreSwitcher';
const Navbar = () => {
  const { user, logout } = useAuthStore();
  const isAdmin = useIsAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const navLinks: {
    to?: string;
    label: string;
    action?: () => void;
  }[] = [
      { to: '/', label: 'Home' },
      { to: '/cart', label: 'Cart' },
      { to: '/checkout', label: 'Checkout' },
      ...(user ? [{ to: '/my-orders', label: 'My Orders' }] : []),
      ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : []),
      ...(user
        ? [{ action: logout, label: 'Logout' }]
        : [
          { to: '/login', label: 'Login' },
          { to: '/signup', label: 'Signup' },
        ]),
    ];

  const drawer = (
    <Box onClick={toggleDrawer} sx={{ width: 250 }}>
      <List>
        {navLinks.map((link, index) => (
          <ListItem
            key={index}
            button
            component={link.to ? Link : 'button'}
            to={link.to as string}
            onClick={link.action}
          >
            <ListItemText primary={link.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ zIndex: 1300 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer}
              >
                <MenuIcon />
              </IconButton>
            )}

          </Box>

          {!isMobile && (
            <Box display="flex" gap={1} alignItems="center">
              {navLinks.map((link, index) =>
                link.to ? (
                  <Button
                    key={index}
                    color="inherit"
                    component={Link}
                    to={link.to}
                  >
                    {link.label}
                  </Button>
                ) : (
                  <Button key={index} color="inherit" onClick={link.action}>
                    {link.label}
                  </Button>
                )
              )}
              <CartButton />
              {isAdmin && (
                <Box sx={{ ml: 1 }}>
                  <StoreSwitcher
                    current={localStorage.getItem('storeId') || 'store1'}
                    onChange={(newId: string) => {
                      localStorage.setItem('storeId', newId);
                      window.location.reload();
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
