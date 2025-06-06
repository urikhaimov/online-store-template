import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import rawServiceAccount from '../serviceAccountKey.json' with  { type: 'json' };

dotenv.config();
const serviceAccount = rawServiceAccount as ServiceAccount;
initializeApp({
  credential: cert(serviceAccount)
});

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email: npm run setRole your@email.com');
  process.exit(1);
}

(async () => {
  try {
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`✅ ${email} is now an admin`);
  } catch (error) {
    console.error('❌ Failed to set role:', error);
  }
})();
