// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import cors from 'cors';
import { Request, Response } from 'express';
import { Timestamp } from 'firebase-admin/firestore';

admin.initializeApp();

const stripeSecret = functions.config().stripe?.secret;
if (!stripeSecret) {
  throw new Error('Stripe secret not found in config.');
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: '2022-11-15',
});

const corsHandler = cors({ origin: true });

export const createPaymentIntent = functions.https.onRequest((req: Request, res: Response) => {
  return corsHandler(req, res, async () => {
    try {
      const { amount, userId, items } = req.body;

      if (!amount || !userId || !items) {
        return res.status(400).send({ error: 'Missing amount, userId, or items' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      });

      const orderRef = await admin.firestore().collection('orders').add({
        userId,
        items,
        total: amount / 100,
        paymentIntentId: paymentIntent.id,
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      return res.status(200).send({
        clientSecret: paymentIntent.client_secret,
        orderId: orderRef.id,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).send({ error: message });
    }
  });
});
