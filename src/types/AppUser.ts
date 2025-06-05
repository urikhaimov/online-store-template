
import type { Role } from './Role';

export interface AppUser {
  id: string;
  email: string;
  role: Role;
  name: string; // ✅ Optional property
}
