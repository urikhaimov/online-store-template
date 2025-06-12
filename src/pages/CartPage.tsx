import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCartStore } from '../store/cartStore';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>

      {items.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          {items.map((item) => (
            <Box key={item.id} display="flex" alignItems="center" gap={2} mb={2}>
              <Box flex={1}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">${item.price} x {item.quantity}</Typography>
              </Box>
              <TextField
                type="number"
                size="small"
                value={item.quantity}
                inputProps={{ min: 1, max: item.stock }}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
              />
              <IconButton onClick={() => removeFromCart(item.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">Subtotal: ${subtotal.toFixed(2)}</Typography>

          <Box mt={2} display="flex" gap={2}>
            <Button variant="outlined" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button variant="contained" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
