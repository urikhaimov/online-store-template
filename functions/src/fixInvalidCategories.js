const admin = require('firebase-admin');
const path = require('path');

// ✅ Replace with your fallback valid category ID
const fallbackCategoryId = 'FuIMiBgY4Vn0Z6jUKzx4';

const serviceAccount = require(path.resolve(__dirname, '../serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function fixInvalidCategoryIds() {
  const validCategoryIds = new Set();

  const categoriesSnap = await db.collection('categories').get();
  categoriesSnap.forEach(doc => validCategoryIds.add(doc.id));

  const productsSnap = await db.collection('products').get();

  const batch = db.batch();
  let fixedCount = 0;

  productsSnap.forEach(doc => {
    const data = doc.data();
    const ref = doc.ref;

    if (!validCategoryIds.has(data.categoryId)) {
      batch.update(ref, { categoryId: fallbackCategoryId });
      fixedCount++;
    }
  });

  await batch.commit();
  console.log(`✅ Fixed ${fixedCount} product(s) with invalid categoryId.`);
}

fixInvalidCategoryIds().catch(console.error);
