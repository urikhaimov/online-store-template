import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { db } from '../firebase';
import  {Product} from '../../src/types/firebase'


export async function fetchProductsPage(
  lastDoc: any = null,
  pageSize: number = 10
): Promise<{ products: Product[]; lastVisible: any }> {
  let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(pageSize));
  if (lastDoc) q = query(q, startAfter(lastDoc));

  const snapshot = await getDocs(q);
  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { products, lastVisible };
}
