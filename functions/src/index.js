import { onCall } from 'firebase-functions/v2/https';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();

const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2022-11-15',
});

// Callable function to create a PaymentIntent
export const createPaymentIntent = onCall<{ amount: number }, { clientSecret: string | null }>(
  async (request) => {
    const { amount } = request.data;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
      console.error('Stripe error:', error.message);
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);
