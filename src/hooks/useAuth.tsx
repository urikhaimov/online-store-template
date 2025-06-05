import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../api/firebase';
import { AppUser } from '../types/AppUser';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const customClaims = idTokenResult.claims;

        const userData: AppUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName ?? '',
          email: firebaseUser.email ?? '',
          role: (customClaims?.role as 'user' | 'admin') ?? 'user',
        };

        setUser(userData);
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
