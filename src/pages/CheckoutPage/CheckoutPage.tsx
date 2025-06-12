// src/pages/CheckoutPage/CheckoutPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  TextField,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { getCardBrand } from '../../utils/cardUtils';
import { isValidLuhn } from '../../utils/luhnCheck';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { formatCardNumber } from '../../utils/formatCardNumber';
import{formatExpiry} from '../../utils/cardUtils';
export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm();

  const [cardBrand, setCardBrand] = useState<'Visa' | 'MasterCard' | 'Amex' | 'Unknown'>('Unknown');

  const handleCardInput = (raw: string) => {
    setCardBrand(getCardBrand(raw));
  };

  const onSubmit = async () => {
    if (!stripe || !elements) return;

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
      billing_details: {
        name: getValues('fullName'),
        email: getValues('email'),
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      alert('Payment method created (test)!');
      clearCart();
      navigate('/thank-you');
    }
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
              fullWidth
              label="Full Name"
              error={!!errors.fullName}
              helperText={typeof errors.fullName?.message === 'string' ? errors.fullName.message : ''}
              {...register('fullName', { required: 'Full Name is required' })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={typeof errors.email?.message === 'string' ? errors.email.message : ''}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              label="Shipping Address"
              error={!!errors.address}
              helperText={typeof errors.address?.message === 'string' ? errors.address.message : ''}
              {...register('address', { required: 'Address is required' })}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="cardNumber"
              control={control}
              rules={{
                required: 'Card number is required',
                validate: (val) => isValidLuhn(val.replace(/\s/g, '')) || 'Invalid card number (Luhn failed)',
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={`Card Number (${cardBrand})`}
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(field.value || '')}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '');
                    field.onChange(raw);
                    handleCardInput(raw);
                  }}
                  inputProps={{
                    maxLength: 23, // 19 digits + spaces
                    inputMode: 'numeric',
                  }}
                  error={!!fieldState.error}
                  helperText={typeof fieldState.error?.message === 'string' ? fieldState.error.message : ''}
                />
              )}
            />
          </Grid>

         
          // Inside your form JSX
          <Grid item xs={6} sm={3}>
            <Controller
              name="expiry"
              control={control}
              rules={{
                required: 'Expiry date is required',
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: 'Format must be MM/YY',
                },
                validate: (value: string) => {
                  const [monthStr, yearStr] = value.split('/');
                  const month = parseInt(monthStr, 10);
                  const year = parseInt('20' + yearStr, 10); // assuming 20YY

                  if (isNaN(month) || isNaN(year)) return 'Invalid date';

                  const now = new Date();
                  const currentMonth = now.getMonth() + 1;
                  const currentYear = now.getFullYear();

                  if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    return 'Card has expired';
                  }

                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Expiry (MM/YY)"
                  placeholder="MM/YY"
                  value={formatExpiry(field.value || '')}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 4); // 4 digits max
                    const formatted = formatExpiry(raw);
                    field.onChange(formatted);
                  }}
                  inputProps={{
                    maxLength: 5,
                    inputMode: 'numeric',
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              label="CVC"
              type="password"
              error={!!errors.cvc}
              helperText={typeof errors.cvc?.message === 'string' ? errors.cvc.message : ''}
              inputProps={{
                maxLength: 4,
                inputMode: 'numeric',
              }}
              {...register('cvc', {
                required: 'CVC is required',
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: '3 or 4 digit CVC',
                },
              })}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" mt={3}>
              Stripe Test Card Input
            </Typography>
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Total: ${subtotal.toFixed(2)}
        </Typography>

        <Button
          variant="contained"
          type="submit"
          disabled={items.length === 0 || !stripe || !elements}
        >
          Place Order
        </Button>
      </form>
    </Box>
  );
}
