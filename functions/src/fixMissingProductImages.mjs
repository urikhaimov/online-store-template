// fixMissingProductImages.mjs
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { firebaseConfig } from '../../src/shared/firebaseConfig'; // Make sure this is an ES module

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DEFAULT_IMAGE = 'https://picsum.photos/seed/fallback/300/300';


async function fixMissingImages() {
  const snapshot = await getDocs(collection(db, 'products'));

  for (const productDoc of snapshot.docs) {
    const data = productDoc.data();
    if (!Array.isArray(data.imageUrls) || data.imageUrls.length === 0) {
      await updateDoc(doc(db, 'products', productDoc.id), {
        imageUrls: [DEFAULT_IMAGE],
      });
      console.log(`✅ Fixed imageUrls for product: ${productDoc.id}`);
    }
  }

  console.log('🎉 Done fixing missing imageUrls.');
}

fixMissingImages();
