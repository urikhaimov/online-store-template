import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import { useCartStore } from '../../store/cartStore';

export default function CheckoutPage() {
  const { items } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with Firebase function or Stripe
    alert('Order placed!');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Name" fullWidth required sx={{ mb: 2 }} />
        <TextField label="Email" type="email" fullWidth required sx={{ mb: 2 }} />
        <TextField label="Shipping Address" fullWidth required multiline sx={{ mb: 2 }} />

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" gutterBottom>
          Total: ${subtotal.toFixed(2)}
        </Typography>

        <Button variant="contained" type="submit">
          Place Order
        </Button>
      </form>
    </Box>
  );
}
