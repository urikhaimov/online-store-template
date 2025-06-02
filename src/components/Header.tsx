import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import  CartButton  from './CartButton';

export const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          My Online Store
        </Typography>
        <Box>
          <CartButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
