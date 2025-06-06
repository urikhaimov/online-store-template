// functions/src/setAdminUser.js
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

// Get email from CLI args
const email = process.argv[2] || 'admin@example.com';
const password = 'admin123';

async function createAdminUser() {
  try {
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`✅ User already exists: ${user.uid}`);
      await auth.updateUser(user.uid, { password }); // 🔁 This line is critical
      console.log(`🔁 Password reset for ${email}`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        user = await auth.createUser({ email, password, displayName: 'Admin' });
        console.log(`✅ Created user: ${user.uid}`);
      } else {
        throw err;
      }
    }

    await auth.setCustomUserClaims(user.uid, { role: 'admin' });
    console.log(`✅ Set custom claim: role='admin' for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

createAdminUser();
