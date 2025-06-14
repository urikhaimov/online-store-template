"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const serviceAccount = require('../serviceAccountKey.json');
// Initialize Firebase Admin
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
});
// 🔁 Replace with the actual user email
const userEmail = 'admin@example.com';
async function setAdminByEmail(email) {
    try {
        const user = await (0, auth_1.getAuth)().getUserByEmail(email);
        await (0, auth_1.getAuth)().setCustomUserClaims(user.uid, { role: 'admin' });
        console.log(`✅ Admin role set for user ${email} (UID: ${user.uid})`);
    }
    catch (error) {
        console.error('❌ Error setting admin role:', error);
    }
}
setAdminByEmail(userEmail);
