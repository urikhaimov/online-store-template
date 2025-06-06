import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { Product, NewProduct } from '../types/firebase';

export async function fetchProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, 'id'>),
  }));
}

export async function addProduct(data: NewProduct): Promise<Product> {
  const { name, description, price, categoryId, images, stock = 0 } = data;

  const productRef = await addDoc(collection(db, 'products'), {
    name,
    description,
    price,
    categoryId,
    stock,
    imageUrls: [],
  });

  const urls: string[] = [];

  for (const file of images) {
    const fileRef = ref(storage, `products/${productRef.id}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    urls.push(url);
  }

  await updateDoc(productRef, { imageUrls: urls });

  return {
    id: productRef.id,
    name,
    description,
    price,
    categoryId,
    imageUrls: urls,
  };
}

export async function deleteProduct(productId: string): Promise<void> {
  const productDocRef = doc(db, 'products', productId);
  await deleteDoc(productDocRef);

  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);
  for (const item of items) {
    await deleteObject(item);
  }
}

// src/api/products.ts
export { addProduct as createProduct };
export { fetchProducts as getProducts };

// If you already have update logic:
export async function updateProduct(productId: string, data: Partial<Omit<Product, 'id'>>): Promise<void> {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, data);
}
