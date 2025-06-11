// migrateProductImages.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import path from 'path';

// 🔐 Replace this with your own service account key path
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'onlinestoretemplate-59d3e.appspot.com', // your bucket name
});

const db = getFirestore();
const bucket = getStorage().bucket();

async function migrateGsUrls() {
  const snapshot = await db.collection('products').get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const images = data.images || [];

    const updatedImages = await Promise.all(
      images.map(async (url) => {
        if (!url.startsWith('gs://')) return url;

        // Convert gs:// URL to download URL
        const filePath = url.replace('gs://onlinestoretemplate-59d3e.appspot.com/', '');
        const file = bucket.file(filePath);
        const [downloadURL] = await file.getSignedUrl({
          action: 'read',
          expires: '03-01-2030',
        });

        console.log(`✔ Converted ${url} → ${downloadURL}`);
        return downloadURL;
      })
    );

    // Update only if changes were made
    if (JSON.stringify(images) !== JSON.stringify(updatedImages)) {
      await doc.ref.update({ images: updatedImages });
      console.log(`📝 Updated product: ${doc.id}`);
    }
  }

  console.log('✅ Migration complete.');
}

migrateGsUrls().catch((err) => {
  console.error('❌ Migration failed:', err);
});
