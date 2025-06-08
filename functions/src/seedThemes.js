import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from '../serviceAccountKey.json' assert { type: 'json' };


const themes = {
  store1: {
    storeName: 'Urban Outfitters',
    logoUrl: '/logos/store1.png',
    primaryColor: '#1976d2',
    secondaryColor: '#f50057',
    fontFamily: 'Roboto',
    mode: 'light',
  },
  store2: {
    storeName: 'Gadget Hub',
    logoUrl: '/logos/store2.png',
    primaryColor: '#009688',
    secondaryColor: '#ff5722',
    fontFamily: 'Open Sans',
    mode: 'light',
  },
  store3: {
    storeName: 'Fresh Mart',
    logoUrl: '/logos/store3.png',
    primaryColor: '#4caf50',
    secondaryColor: '#cddc39',
    fontFamily: 'Lato',
    mode: 'light',
  },
};

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: 'plenary-edition-452708-s5', // ✅ Force correct project ID
});
console.log('Detected Project ID:', app.options.projectId);
const db = getFirestore(app);

async function seedThemes() {
  try {
    const themeCollection = db.collection('themes');
    for (const [storeId, theme] of Object.entries(themes)) {
      await themeCollection.doc(storeId).set(theme, { merge: true });
      console.log(`✅ Seeded theme for ${storeId}`);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed themes:', err);
    process.exit(1);
  }
}

seedThemes();
