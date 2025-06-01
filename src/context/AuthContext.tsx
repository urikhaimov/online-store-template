import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../api/firebase';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';

export interface AppUser {
  firebaseUser: User;
  role: string;
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  const fetchUserRole = async (uid: string): Promise<string> => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data().role as string) : 'user';
  };

  const handleAuthState = async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const role = await fetchUserRole(firebaseUser.uid);
      setUser({ firebaseUser, role });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await handleAuthState(firebaseUser);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<UserCredential> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await handleAuthState(userCredential.user);
    return userCredential;
  };

  const signup = async (email: string, password: string): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: userCredential.user.email,
      role: 'user',
      createdAt: new Date().toISOString(),
    });
    await handleAuthState(userCredential.user);
    return userCredential;
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ EXPORT THE HOOK
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
};
