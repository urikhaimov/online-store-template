
import type { Role } from '../constants/roles';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}