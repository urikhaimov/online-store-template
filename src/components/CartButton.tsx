import React, { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';
import { CartDrawer } from './CartDrawer';

const CartButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { state } = useCart();

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <Badge badgeContent={itemCount} color="secondary" showZero>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <CartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};
export default CartButton;