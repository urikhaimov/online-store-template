import { createContext, useContext, ReactNode } from 'react';
import { getSafeAuth } from '../hooks/getSafeAuth';
interface AdminContextType {
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = getSafeAuth();
  const isAdmin = user?.firebaseUser.email === 'admin@example.com'; // or use a claim/check

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used inside AdminProvider');
  }
  return context;
};
