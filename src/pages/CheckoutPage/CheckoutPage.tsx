// src/pages/CheckoutPage/CheckoutPage.tsx
import React, { useReducer } from 'react';
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
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getCardBrand, formatCardNumber } from '../../utils/cardUtils';
import {
  validateLuhn,
  validateExpiry,
  validateEmail,
  validateZip,
  validateCVC,
} from '../../utils/validators';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm();

  const [cardBrand, setCardBrand] = React.useState<'Visa' | 'MasterCard' | 'Amex' | 'Unknown'>('Unknown');

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
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="fullName"
              control={control}
              rules={{ required: 'Full Name is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                validate: (val) => validateEmail(val) || 'Invalid card number (Luhn failed)',
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email"
                  type="email"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              rules={{ required: 'Address is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Shipping Address"
                  multiline
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="zip"
              control={control}
              rules={{
                required: 'ZIP code is required',
                validate: validateZip,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="ZIP Code"
                  inputProps={{ maxLength: 10, inputMode: 'numeric' }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ''}
                />
              )}
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <Controller
              name="cardNumber"
              control={control}
              rules={{
                required: 'Card number is required',
                validate: (val) => validateLuhn(val) || 'Invalid card number (Luhn failed)',
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
                    setCardBrand(getCardBrand(raw));
                  }}
                  inputProps={{ maxLength: 23, inputMode: 'numeric' }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <Controller
              name="expiry"
              control={control}
              rules={{
                required: 'Expiry date is required',
                validate: validateExpiry,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Expiry (MM/YY)"
                  placeholder="MM/YY"
                  inputProps={{ maxLength: 5, inputMode: 'numeric' }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <Controller
              name="cvc"
              control={control}
              rules={{
                required: 'cvc is required',
                validate: validateCVC,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="CVC"
                  type="password"
                  inputProps={{ maxLength: 4, inputMode: 'numeric' }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" mt={3}>Stripe Test Card Input</Typography>
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
