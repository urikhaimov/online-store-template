import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { Request,  } from 'firebase-functions/https';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || functions.config().stripe.secret_key,
  { apiVersion: '2022-11-15' }
);

app.post('/create-payment-intent', async (req:Request, res: any) => {
  try {
    console.log('[DEBUG] Stripe Secret Key:', process.env.STRIPE_SECRET_KEY?.slice(0, 6)); // ✅ See if loaded
    console.log('[DEBUG] Incoming body:', req.body); // ✅ Confirm payload shape

    const { amount } = req.body;

    if (!amount || typeof amount !== 'number') {
      console.error('[ERROR] Invalid or missing amount:', amount); // ✅
      return res.status(400).send({ error: 'Invalid or missing amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    console.log('[DEBUG] Created paymentIntent:', paymentIntent.id); // ✅

    return res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    console.error('[STRIPE ERROR]', err.message); // ✅
    return res.status(500).send({ error: err.message });
  }
});

// 👇 Export this Express app under `/api`
export const api = functions.https.onRequest(app);
