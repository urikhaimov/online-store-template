// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../firebase';
import { AppUser } from '../types/AppUser';
import { UserCredential } from 'firebase/auth';



export interface AuthContextType {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  const signup = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult();
        const customClaims = tokenResult.claims;

        const userData: AppUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          role: customClaims?.role === 'admin' ? 'admin' : 'user',
        };

        setUser(userData);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

export { AuthContext };
