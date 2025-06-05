import { useContext } from 'react';
import { AuthContext} from '../context/AuthContext';
import { UserCredential } from 'firebase/auth';
import { AppUser } from '../types/AppUser';


export interface SafeAuth {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

export function getSafeAuth(): SafeAuth {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Must be used inside AuthProvider');
  return context as unknown as SafeAuth;
}