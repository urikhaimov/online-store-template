import { useContext } from 'react';
import { AuthContext, AppUser } from '../context/AuthContext';
import { UserCredential } from 'firebase/auth';

export interface SafeAuth {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

export const getSafeAuth = (): SafeAuth => {
  const context = useContext(AuthContext);

  if (!context) {
    console.warn('⚠ getSafeAuth called outside AuthProvider, returning safe defaults.');
    return {
      user: null,
      loading: false,
      isAdmin: false,
      login: async () => {
        console.warn('⚠ login called outside AuthProvider');
        return {} as UserCredential;
      },
      signup: async () => {
        console.warn('⚠ signup called outside AuthProvider');
        return {} as UserCredential;
      },
      logout: async () => {
        console.warn('⚠ logout called outside AuthProvider');
      },
    };
  }

  return context;
};
