import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthSafeOrThrow = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('❌ useAuthSafeOrThrow was called outside of an <AuthProvider>. Make sure your component tree is wrapped properly.');
  }

  return context;
};
