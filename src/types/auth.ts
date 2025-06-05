import { User, UserCredential } from 'firebase/auth';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

export interface SafeAuth {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}
