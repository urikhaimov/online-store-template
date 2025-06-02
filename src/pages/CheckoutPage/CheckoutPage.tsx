import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CartItem } from '../../types/CardItem';

// Form schema
const schema = yup.object().shape({
  name: yup.string().required('Name on card is required'),
  cardNumber: yup
    .string()
    .matches(/^\d{16}$/, 'Card number must be 16 digits')
    .required('Card number is required'),
  expiry: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry must be MM/YY')
    .required('Expiration date is required'),
  cvv: yup
    .string()
    .matches(/^\d{3}$/, 'CVV must be 3 digits')
    .required('CVV is required'),
});

const CheckoutPage: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const total = state.items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const onSubmit = async (data: any) => {
    console.log('Mock payment data:', data);
    setLoading(true);

    // Simulate async Stripe payment (mock)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      clearCart();
      reset();
      navigate('/order-success');
    }, 2000);
  };

  if (state.items.length === 0) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Your cart is empty.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Order Summary
      </Typography>
      <List>
        {state.items.map((item: CartItem) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={`${item.name} × ${item.quantity}`}
              secondary={`$${item.price.toFixed(2)} each`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" sx={{ mt: 4 }}>
          Payment Details (Mock Stripe)
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Name on Card"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            label="Card Number"
            fullWidth
            {...register('cardNumber')}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber?.message}
          />
          <TextField
            label="Expiration Date (MM/YY)"
            fullWidth
            {...register('expiry')}
            error={!!errors.expiry}
            helperText={errors.expiry?.message}
          />
          <TextField
            label="CVV"
            fullWidth
            {...register('cvv')}
            error={!!errors.cvv}
            helperText={errors.cvv?.message}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Pay with Stripe (Mock)'}
        </Button>
      </form>

      <Snackbar open={success} autoHideDuration={3000}>
        <Alert severity="success">Payment successful! Redirecting...</Alert>
      </Snackbar>
    </Box>
  );
};
export default CheckoutPage;
