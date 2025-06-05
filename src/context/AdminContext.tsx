// context/AdminContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

const AdminContext = createContext<any>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminState, setAdminState] = useState({ /* your admin state */ });

  return (
    <AdminContext.Provider value={{ adminState, setAdminState }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used inside AdminProvider');
  return context;
}
