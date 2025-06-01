import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuthSafe = () => {
  try {
    const context = useContext(AuthContext);
    return context || { user: null, loading: true, login: async () => {}, signup: async () => {}, logout: async () => {} };
  } catch (err) {
    console.warn('⚠ useAuthSafe called outside AuthProvider, returning fallback.');
    return { user: null, loading: true, login: async () => {}, signup: async () => {}, logout: async () => {} };
  }
};
