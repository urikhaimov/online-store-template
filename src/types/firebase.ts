// src/types/firebase.ts

export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrls: string[];
  stock?: number; // ✅ optional if not always defined
  
};
export type NewProduct = Omit<Product, 'id' | 'imageUrls'> & {
  images: File[];
};