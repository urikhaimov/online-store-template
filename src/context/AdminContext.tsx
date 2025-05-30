import { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AdminContextType {
  isAdmin: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@example.com'; // or use a claim/check

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
