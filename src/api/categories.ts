import { Dispatch } from 'react'
import { db } from './firebase';
import {collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs } from 'firebase/firestore';



export async function fetchCategories() {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as { id: string; name: string }[];
}
export const addCategory = async (name: string) => {
  const docRef = await addDoc(collection(db, 'categories'), { name });
  return docRef.id;
};

export const deleteCategory = async (id: string) => {
  await deleteDoc(doc(db, 'categories', id));
};
// export const updateCategory = async (id: string, name: string) => {
//   const categoryRef = doc(db, 'categories', id);
//   await updateDoc(categoryRef, { name });
//   return id;
// };