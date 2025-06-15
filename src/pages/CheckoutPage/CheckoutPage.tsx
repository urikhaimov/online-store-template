// src/pages/CheckoutPage.tsx
import React, { useReducer } from 'react';
import * as functions from 'firebase/functions';
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import ControlledTextField from '../../components/ControlledTextField';
import { app } from '../../firebase'; // or wherever you initialize Firebase
import {
  validateLuhn,
  validateExpiry,
  validateEmail,
  validateZip,
  validateCVC,
} from '../../utils/validators';
import {
  formatCardNumber,
  formatExpiry,
  formatCVC,
  formatZip,
} from '../../utils/formatters';

import { initialState, reducer } from './LocalReducer'

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [state, dispatch] = useReducer(
    (state: any, action: any) => ({ ...state, ...action }),
    { loading: false, error: '', success: false }
  );

  const { handleSubmit, control, getValues } = useForm();

 const onSubmit = async () => {
  // console.log('Loaded STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY?.slice(0, 8));
  

  dispatch({ type: 'SET_LOADING', payload: true });
  dispatch({ type: 'SET_ERROR', payload: '' });

  try {
    if (!stripe || !elements) {
      throw new Error('Stripe is not loaded');
    }

    // ✅ Call Firebase REST endpoint (make sure this is correct)
    const response = await fetch(
      '/create-payment-intent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: subtotal * 100, currency: 'usd' }),
      }
    );

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: getValues('fullName'),
          email: getValues('email'),
        },
      },
    });

    if (result.error) {
      dispatch({ type: 'SET_ERROR', payload: result.error.message || 'Payment failed.' });
    } else if (result.paymentIntent?.status === 'succeeded') {
      dispatch({ type: 'SET_SUCCESS', payload: true });
      clearCart();
      setTimeout(() => navigate('/thank-you'), 2000);
    }
  } catch (err: any) {
    console.error('Checkout Error:', err);
    dispatch({ type: 'SET_ERROR', payload: err.message || 'Something went wrong during checkout.' });
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};



  if (!stripe || !elements) {
    return (
      <Box sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1">Loading payment interface...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mx: 'auto', width: '80vw', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <ControlledTextField name="fullName" control={control} label="Full Name" rules={{ required: 'Full Name is required' }} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ControlledTextField name="email" control={control} label="Email" rules={{ required: 'Email is required', validate: validateEmail }} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ControlledTextField name="address" control={control} label="Address" rules={{ required: 'Address is required' }} inputProps={{ maxLength: 10 }} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ControlledTextField name="zip" control={control} label="ZIP Code" rules={{ required: 'ZIP is required', validate: validateZip }} inputProps={{ maxLength: 10 }} onChangeFormat={formatZip} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ControlledTextField name="cardNumber" control={control} label="Card Number" rules={{ required: 'Card number is required', validate: validateLuhn }} onChangeFormat={formatCardNumber} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ControlledTextField name="expiry" control={control} label="Expiry Date" rules={{ required: 'Expiry Date is required', validate: validateExpiry }} onChangeFormat={formatExpiry} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <ControlledTextField name="cvc" control={control} label="CVC" type="password" rules={{ required: 'CVC is required', validate: validateCVC }} onChangeFormat={formatCVC} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" mt={3}>Stripe Test Card Input</Typography>
            <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>Total: ${subtotal.toFixed(2)}</Typography>

        {state.errorMsg && (
          <Typography color="error" mt={1}>{state.errorMsg}</Typography>
        )}

        <Button variant="contained" type="submit" disabled={state.loading}>
          {state.loading ? 'Processing...' : 'Place Order'}
        </Button>
      </form>
    </Box>
  );
}

