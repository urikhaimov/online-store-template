import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthSafe = () => {
  try {
    const context = useContext(AuthContext);
    return context || null;
  } catch (err) {
    console.warn('⚠ useAuthSafe called outside AuthProvider, returning null.');
    return null;
  }
};
