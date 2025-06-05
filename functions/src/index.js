const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp();

exports.setAdminRole = functions.https.onCall(async (data, context) => {
  const email = data.email;
  if (!email) throw new functions.https.HttpsError('invalid-argument', 'Email is required');

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    return { message: `Success! ${email} is now an admin.` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
