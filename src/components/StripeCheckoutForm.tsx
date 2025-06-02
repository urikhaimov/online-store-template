import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Box } from '@mui/material';

export const StripeCheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    // Example: Call backend to create PaymentIntent
    const res = await fetch('/create-payment-intent', { method: 'POST' });
    const { clientSecret } = await res.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      console.error(result.error.message);
      alert(`Payment failed: ${result.error.message}`);
    } else {
      if (result.paymentIntent?.status === 'succeeded') {
        alert('Payment succeeded!');
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Pay with Stripe
      </Button>
    </Box>
  );
};
