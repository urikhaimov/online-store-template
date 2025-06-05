import { create } from 'zustand';
import { AppUser } from '../types/AppUser';

export interface AuthState {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AppUser | null) => void;
  isAdmin: boolean; // <-- add this
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  login: async (email, password) => {
    // ... your login logic
  },

  logout: async () => {
    // ... your logout logic
    set({ user: null });
  },

  setUser: (user) => set({ user }),

  get isAdmin() {
    const user = get().user;
    return user?.role === 'admin';
  },
}));
