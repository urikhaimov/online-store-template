import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const setUserRole = functions.https.onCall(async (data, context) => {
  // Only allow logged-in users with admin rights
  if (!context.auth?.token?.role || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can assign roles.');
  }

  const { uid, role } = data;
  if (!uid || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'UID and role are required.');
  }

  await admin.auth().setCustomUserClaims(uid, { role });
  return { message: `Role '${role}' assigned to UID: ${uid}` };
});
