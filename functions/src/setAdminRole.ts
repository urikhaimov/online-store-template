import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const serviceAccount = require('../serviceAccountKey.json');

// ✅ Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

// 🔁 Replace with the actual UID of the user to promote
const targetUid = 's5lU9vG9afYEO5LIS57CWfs1AYZ2';

getAuth()
  .setCustomUserClaims(targetUid, { role: 'admin' })
  .then(() => {
    console.log(`✅ Admin role set for UID: ${targetUid}`);
  })
  .catch((error) => {
    console.error('❌ Error setting admin role:', error);
  });
