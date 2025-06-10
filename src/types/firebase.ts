// src/types/firebase.ts
import { Timestamp } from 'firebase/firestore';
export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
   description?: string;
  name: string;
  price: number;
  stock: number;
  imageUrls?: string[];
  createdAt?: any; // Firestore Timestamp if needed
  categoryId: string; // ✅ ADD THIS
};

export type NewProduct = Omit<Product, 'id' | 'imageUrls'> & {
  images: File[];
};