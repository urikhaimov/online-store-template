import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RedirectContextType {
  redirectTo: string | null;
  setRedirectTo: (path: string | null) => void;
  message: string | null;
  setMessage: (msg: string | null) => void;
}

const RedirectContext = createContext<RedirectContextType | undefined>(undefined);

export const RedirectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <RedirectContext.Provider value={{ redirectTo, setRedirectTo, message, setMessage }}>
      {children}
    </RedirectContext.Provider>
  );
};

export const useRedirect = (): RedirectContextType => {
  const context = useContext(RedirectContext);
  if (!context) {
    throw new Error('useRedirect must be used within a RedirectProvider');
  }
  return context;
};
