import { create } from 'zustand';
import { AppUser } from '../types/AppUser';

interface AuthState {
  user: AppUser | null;
  loading: boolean;
  setUser: (user: AppUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

// Initialize auth listener separately (e.g., in main App.tsx or a setup file)
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

onAuthStateChanged(auth, async (firebaseUser) => {
  const { setUser, setLoading } = useAuthStore.getState();
  if (firebaseUser) {
    try {
      const tokenResult = await firebaseUser.getIdTokenResult(true);
      const customClaims = tokenResult.claims;
      const userData: AppUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        role: customClaims?.role === 'admin' ? 'admin' : 'user',
      };
      setUser(userData);
    } catch (err) {
      console.error('❌ Failed to load token claims', err);
      setUser(null);
    }
  } else {
    setUser(null);
  }
  setLoading(false);
});
