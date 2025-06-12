// CheckoutPage.tsx
import React from 'react';
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

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  console.log('stripe', stripe)
  console.log('elements',elements)
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    if (!stripe || !elements) return;

    // Mock call to backend to get clientSecret (simulated with static string)
    const clientSecret = 'pi_mock_client_secret_123'; // Replace with actual from mock API later

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
      alert(`Payment failed: ${result.error.message}`);
    } else if (result.paymentIntent?.status === 'succeeded') {
      alert('✅ Mock paymentIntent succeeded!');
      clearCart();
      navigate('/thank-you');
    }
  };

  if (!stripe || !elements) {
    return (
      <Box
        sx={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
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
            <ControlledTextField
              name="fullName"
              control={control}
              label="Full Name"
              rules={{ required: 'Full Name is required' }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="email"
              control={control}
              label="Email"
              rules={{ required: 'Email is required', validate: validateEmail }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="address"
              control={control}
              label="Address"
              rules={{ required: 'Address is required' }}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="zip"
              control={control}
              label="ZIP Code"
              rules={{ required: 'ZIP is required', validate: validateZip }}
              inputProps={{ maxLength: 10 }}
              onChangeFormat={formatZip}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="cardNumber"
              control={control}
              label="Card Number"
              rules={{ required: 'Card number is required', validate: validateLuhn }}
              onChangeFormat={formatCardNumber}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="expiry"
              control={control}
              label="Expiry Date"
              rules={{ required: 'Expiry Date is required', validate: validateExpiry }}
              onChangeFormat={formatExpiry}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="cvc"
              control={control}
              label="CVC"
              type="password"
              rules={{ required: 'cvc is required', validate: validateCVC }}
              onChangeFormat={formatCVC}
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

        <Button variant="contained" type="submit">
          Place Order
        </Button>
      </form>
    </Box>
  );
}