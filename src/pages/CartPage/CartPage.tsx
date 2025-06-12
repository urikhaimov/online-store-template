import React from 'react';
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useCartStore } from '../../store/cartStore';

const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Your cart is empty.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      <List>
        {items.map((item) => (
          <ListItem key={item.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total: ${total.toFixed(2)}
      </Typography>
      <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={clearCart}>
        Clear Cart
      </Button>
    </Box>
  );
};

export default CartPage;
