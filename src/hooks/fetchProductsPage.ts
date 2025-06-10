import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../../src/types/firebase';

export async function fetchProductsPage(
  lastDoc: QueryDocumentSnapshot<DocumentData> | null = null,
  pageSize: number = 10
): Promise<{ products: Product[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> {
  let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(pageSize));

  if (lastDoc) {
    q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(pageSize));
  }

  const snapshot = await getDocs(q);
  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return { products, lastVisible };
}