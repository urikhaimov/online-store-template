import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../context/CartContext';
import {CartDrawerProps} from '../types/CartDrawerProps';

export const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {state.items.map((item) => (
            <ListItem key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <ListItemText
                primary={`${item.name} (${item.quantity})`}
                secondary={`$${item.price.toFixed(2)} each`}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  -
                </Button>
                <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                <Button color="error" onClick={() => removeFromCart(item.id)}>
                  Remove
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
        <Typography variant="subtitle1">Total: ${total.toFixed(2)}</Typography>
        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={clearCart}>
          Clear Cart
        </Button>
      </Box>
    </Drawer>
  );
};
export default CartDrawer;