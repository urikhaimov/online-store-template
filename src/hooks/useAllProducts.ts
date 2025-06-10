import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types/firebase';

export function useAllProducts() {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'products'));
      return snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    },
    staleTime: 10000, // ✅ allowed
    // cacheTime is NOT valid in v5
  });
}
