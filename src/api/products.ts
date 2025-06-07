// src/api/products.ts
import { db, storage } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll, deleteObject
} from 'firebase/storage';
import type { NewProduct, Product } from '../types/firebase';
import { query, where } from 'firebase/firestore';






export async function fetchProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, 'id'>),
  }));
}
export async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  const q = query(collection(db, 'products'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, 'id'>),
    stock: (doc.data() as any).stock ?? 0, // fallback if needed
  }));
}

export async function getProductById(productId: string): Promise<Product | null> {
  const ref = doc(db, 'products', productId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock ?? 0,
    categoryId: data.categoryId,
    imageUrls: data.imageUrls || [],
  } as Product;
}


export async function deleteProduct(productId: string): Promise<void> {
  // Delete product document
  await deleteDoc(doc(db, 'products', productId));

  // Delete associated images from storage
  const folderRef = ref(storage, `products/${productId}`);
  const { items } = await listAll(folderRef);
  for (const item of items) {
    await deleteObject(item);
  }
}
export async function updateProduct(productId: string, data: Partial<Omit<Product, 'id'>>): Promise<void> {
  const ref = doc(db, 'products', productId);
  await updateDoc(ref, data);
}
export async function createProduct(data: NewProduct): Promise<Product> {
  const {
    name,
    description,
    price,
    stock,
    categoryId,
    images,
  } = data;

  // Step 1: Create the product document with initial fields (excluding imageUrls)
  const productRef = await addDoc(collection(db, 'products'), {
    name,
    description,
    price,
    stock: stock ?? 0, // ✅ stock is required, fallback to 0 if missing
    categoryId,
    imageUrls: [],
  });

  // Step 2: Upload images to Firebase Storage
  const urls: string[] = [];

  for (const file of images) {
    const fileRef = ref(storage, `products/${productRef.id}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    urls.push(url);
  }

  // Step 3: Update product document with image URLs
  await updateDoc(productRef, { imageUrls: urls });

  // Step 4: Return fully typed product object
  return {
    id: productRef.id,
    name,
    description,
    price,
    stock: stock ?? 0,
    categoryId,
    imageUrls: urls,
  };
}
