// src/types/firebase.ts
import { Timestamp } from 'firebase/firestore';
export type Category = {
  id: string;
  name: string;
};

export type Product = {
id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrls: string[];
  categoryId: string;
  createdAt?: Timestamp; // ✅ must be Timestamp (from Firestore)
};

export type NewProduct = Omit<Product, 'id' | 'imageUrls'> & {
  images: File[];
};