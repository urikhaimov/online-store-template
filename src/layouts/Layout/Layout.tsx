// src/layouts/Layout.tsx
import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
        m: 0,
        p: 0,
      }}
    >
      {/* Top Bar */}
      <AppBar position="sticky" sx={{ zIndex: 1300, width: '100%' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            🛒 My Online Store
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          px: 0,
          py: 4,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'grey.100',
          py: 2,
          px: 2,
          width: '100%',
          borderTop: '1px solid #ccc',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} My Online Store
        </Typography>
      </Box>
    </Box>
  );
};

export default Layout;
