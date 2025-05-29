import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/products';
import { Product } from '../types/Product';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes: avoid refetching too often
    refetchOnWindowFocus: true, // refetch when tab/window regains focus
  });
};
