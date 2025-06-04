import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import cors from 'cors';
import { Request, Response } from 'express';

admin.initializeApp();

// Load Stripe secret from Firebase config
const stripeSecret =
  process.env.FUNCTIONS_EMULATOR === 'true'
    ? 'sk_test_XXXXXXX' // ⬅️ Local emulator fallback
    : functions.config().stripe?.secret;

if (!stripeSecret) {
  throw new Error('Stripe secret is not set in functions config.');
}
const stripe = new Stripe(stripeSecret, {
  apiVersion: '2022-11-15',
});

const corsHandler = cors({ origin: true });

export const createPaymentIntent = functions.https.onRequest(
  (req: Request, res: Response) => {
    return corsHandler(req, res, async () => {
      try {
        const { amount, userId, items } = req.body;

        if (!amount || !userId || !items) {
          return res.status(400).send({ error: 'Missing amount, userId, or items' });
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
          automatic_payment_methods: { enabled: true },
        });

        // Save order to Firestore
        const orderRef = await admin.firestore().collection('orders').add({
          userId,
          items,
          total: amount / 100,
          paymentIntentId: paymentIntent.id,
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return res.status(200).send({
          clientSecret: paymentIntent.client_secret,
          orderId: orderRef.id,
        });
      } catch (error) {
        console.error('Stripe or Firestore error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error occurred';
        return res.status(500).send({ error: errorMessage });
      }
    });
  }
);
