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
import  {StoreSwitcher}  from './StoreSwitcher';
import { useStoreSettings } from '../stores/useStoreSettings';
import { useCartStore } from '../store/cartStore';



const Header: React.FC = () => {
  const { user } = useSafeAuth();
  const isAdmin = user?.role === 'admin';

  const { storeId, setStoreId } = useStoreSettings();
  const [showToast, setShowToast] = useState(false);

  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  console.log('items in Header', items)
  console.log('itemCount in Header', itemCount)





  const handleStoreChange = (newId: string) => {
    setStoreId(newId);
    setShowToast(true);
     setTimeout(() => window.location.reload(), 1000);
   
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Logo */}
        <Typography variant="h6" fontWeight="bold">
          My Online Store
        </Typography>

        {/* Right: Navbar and optionally Store Switcher */}
        <Box display="flex" alignItems="center" gap={2}>
          <Navbar />
          {isAdmin && (
            <StoreSwitcher current={storeId} onChange={handleStoreChange} />
          )}
        </Box>
      </Toolbar>

      {/* Toast notification */}
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
