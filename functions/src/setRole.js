import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

dotenv.config();

initializeApp({
  credential: applicationDefault(),
});

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email as argument: `npm run setRole you@email.com`');
  process.exit(1);
}

(async () => {
  try {
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`✅ ${email} is now an admin`);
  } catch (error) {
    console.error('❌ Error setting role:', error);
  }
})();
