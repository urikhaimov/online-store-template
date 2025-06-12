// src/pages/CheckoutPage.tsx
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Grid,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log('Form Data:', data);
    alert('Order placed successfully!');
    clearCart();
    navigate('/thank-you');
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              fullWidth
              required
              {...register('fullName', { required: 'Full Name is required' })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message?.toString()} // ✅ FIXED
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
               helperText={errors.email?.message?.toString()} // ✅ FIXED
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Shipping Address"
              fullWidth
              required
              multiline
              {...register('address', { required: 'Address is required' })}
              error={!!errors.address}
                helperText={errors.address?.message?.toString()} // ✅ FIXED
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Credit Card Number"
              fullWidth
              required
              inputProps={{ maxLength: 19 }}
              {...register('cardNumber', {
                required: 'Card number is required',
                pattern: {
                  value: /^\d{4} \d{4} \d{4} \d{4}$/,
                  message: 'Format: 1234 5678 9012 3456',
                },
              })}
              placeholder="1234 5678 9012 3456"
              error={!!errors.cardNumber}
              helperText={errors.cardNumber?.message?.toString()} // ✅ FIXED
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="Expiry (MM/YY)"
              fullWidth
              required
              {...register('expiry', {
                required: 'Expiry date is required',
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: 'Format: MM/YY',
                },
              })}
              placeholder="08/25"
              error={!!errors.expiry}
                helperText={errors.expiry?.message?.toString()} // ✅ FIXED
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              label="CVC"
              fullWidth
              required
              type="password"
              inputProps={{ maxLength: 4 }}
              {...register('cvc', {
                required: 'CVC is required',
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: '3 or 4 digit CVC',
                },
              })}
              error={!!errors.cvc}
              helperText={errors.cvc?.message?.toString()} // ✅ FIXED
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Total: ${subtotal.toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          type="submit"
          disabled={items.length === 0}
        >
          Place Order
        </Button>
      </form>
    </Box>
  );
}
