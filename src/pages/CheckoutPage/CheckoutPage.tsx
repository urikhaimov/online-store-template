// src/pages/CheckoutPage/CheckoutPage.tsx
import React, { useState } from 'react';
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
import FormTextField from '../../components/FormTextField';
import FormMaskedInput from '../../components/FormMaskedInput';
import { getCardBrand } from '../../utils/cardUtils';
import { isValidLuhn } from '../../utils/luhnCheck';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [cardBrand, setCardBrand] = useState<'Visa' | 'MasterCard' | 'Amex' | 'Unknown'>('Unknown');

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardBrand(getCardBrand(value));
  };

  const cardMask = cardBrand === 'Amex' ? '9999 999999 99999' : '9999 9999 9999 9999';

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
            <FormTextField
              label="Full Name"
              register={register('fullName', { required: 'Full Name is required' })}
              errorObject={errors.fullName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormTextField
              label="Email"
              type="email"
              register={register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              errorObject={errors.email}
            />
          </Grid>

          <Grid item xs={12}>
            <FormTextField
              label="Shipping Address"
              multiline
              register={register('address', { required: 'Address is required' })}
              errorObject={errors.address}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormMaskedInput
              label={`Card Number (${cardBrand})`}
              mask={cardMask}
              register={register('cardNumber', {
                required: 'Card number is required',
                validate: (val) => isValidLuhn(val) || 'Invalid card number (Luhn failed)',
                onChange: handleCardInput, // ✅ Passed inside register config
              })}
              error={errors.cardNumber}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <FormMaskedInput
              label="Expiry (MM/YY)"
              mask="99/99"
              placeholder="MM/YY"
              register={register('expiry', {
                required: 'Expiry date is required',
                pattern: {
                  value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                  message: 'Format MM/YY',
                },
              })}
              error={errors.expiry}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <FormTextField
              label="CVC"
              type="password"
              inputProps={{ maxLength: 4 }}
              register={register('cvc', {
                required: 'CVC is required',
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: '3 or 4 digit CVC',
                },
              })}
              errorObject={errors.cvc}
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
