import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../types/Product';

export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Product, 'id'>;
    return { ...data, id: doc.id };
  });
};

export const createProduct = async (product: Product) => {
  const docRef = await addDoc(collection(db, 'products'), product);
  return docRef.id;
};

export const updateProduct = async (id: string, updatedData: Partial<Product>) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, updatedData);
};

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, 'products', id);
  await deleteDoc(docRef);
};