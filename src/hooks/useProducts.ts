import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import type { Product } from '../types/firebase';

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: getProducts,
  });
};
// This hook fetches products from the API and returns them along with the query state.