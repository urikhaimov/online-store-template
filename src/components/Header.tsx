import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import Navbar from './Navbar';

import { useSafeAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user } = useSafeAuth();
  const isAdmin = user?.role === 'admin';

  const [storeId, setStoreId] = useState(() => localStorage.getItem('storeId') || 'store1');
  const [showToast, setShowToast] = useState(false);

  const handleStoreChange = (newStoreId: string) => {
    localStorage.setItem('storeId', newStoreId);
    setStoreId(newStoreId);
    setShowToast(true);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">
          My Online Store
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Navbar />
        
        </Box>
      </Toolbar>

      <Snackbar
        open={showToast}
        autoHideDuration={1000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Theme updated for store: <strong>{storeId}</strong>
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

export default Header;
