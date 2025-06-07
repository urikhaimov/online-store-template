import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { google } from 'googleapis';
import * as fs from 'fs';

// Load service account JSON
const serviceAccount = JSON.parse(
  fs.readFileSync('./serviceAccountKey.json', 'utf8')
);

console.log('🔐 Initializing Firebase Admin with explicit credentials...');
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'onlinestoretemplate-59d3e.appspot.com',
});

const storage = getStorage();
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

const corsConfig = [
  {
    origin: ['http://localhost:4173'],
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAgeSeconds: 3600,
    responseHeader: ['Content-Type', 'Authorization'],
  },
];

export async function setCors() {
  console.log('☁️ Getting authenticated client...');
  const client = await auth.getClient();
  const storageAPI = google.storage('v1');

  await storageAPI.buckets.patch({
    bucket: 'onlinestoretemplate-59d3e.appspot.com',
    requestBody: {
      cors: corsConfig,
    },
    auth: client,
  });

  console.log('✅ CORS configuration updated successfully!');
}

setCors().catch((err) => {
  console.error('❌ Failed to set CORS:', err);
});
