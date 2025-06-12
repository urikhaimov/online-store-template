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

import ControlledTextField from '../../components/ControlledTextField'
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
     <Box sx={{mx: 'auto', width: '80vw', display: 'flex', flexDirection: 'column'}}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
           <ControlledTextField
              name="fullName"
              control={control}
              label="Full Name"
              rules={{
                required: 'Full Name is required',
              }}
             
            />

          </Grid>

          <Grid item xs={6} sm={3}>
           <ControlledTextField
              name="email"
              control={control}
              label="Email"
              rules={{
                required: 'Email is required',
                validate: validateEmail,
              }}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="address"
              control={control}
              label="Address"
              rules={{
                required: 'Address is required',
              }}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>

         <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="zip"
              control={control}
              label="ZIP Code"
              rules={{
                required: 'ZIP is required',
                validate: validateZip,
              }}
              inputProps={{ maxLength: 10 }}
              onChangeFormat={formatZip}
            />
          </Grid>


          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="cardNumber"
              control={control}
              label="Card Number"
              rules={{
                required: 'Card number is required',
                validate: validateLuhn,
              
              }}
              
              onChangeFormat={formatCardNumber}
            />

          </Grid>

          <Grid item xs={6} sm={3}>
           <ControlledTextField
              name="expiry"
              control={control}
              label="Expiry Date"
              rules={{
                required: 'Expiry Date is required',
                validate: validateExpiry,
              }}
             
              onChangeFormat={formatExpiry}
            />

          </Grid>

          <Grid item xs={6} sm={3}>
            <ControlledTextField
              name="cvc"
              control={control}
              label="CVC"
              type="password"
              rules={{
                required: 'cvc is required',
                validate: validateCVC,
              }}
              
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
