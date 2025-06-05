// src/types/AppUser.ts

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
