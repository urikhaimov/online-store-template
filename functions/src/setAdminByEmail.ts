import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

// 🔁 Replace with the actual user email
const userEmail = 'admin@example.com';

async function setAdminByEmail(email: string) {
  try {
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`✅ Admin role set for user ${email} (UID: ${user.uid})`);
  } catch (error) {
    console.error('❌ Error setting admin role:', error);
  }
}

setAdminByEmail(userEmail);
