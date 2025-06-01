import { getSafeAuth } from '../hooks/getSafeAuth';
export const useIsAdmin = (): boolean => {
  const { user } = getSafeAuth();
  return user?.role === 'admin';
};
