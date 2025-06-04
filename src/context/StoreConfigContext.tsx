// src/context/StoreConfigContext.tsx
import React, { createContext, useContext } from 'react';

type StoreConfig = {
  storeName: string;
  primaryColor: string;
  logoUrl?: string;
};

const defaultConfig: StoreConfig = {
  storeName: 'My Online Store',
  primaryColor: '#1976d2', // MUI primary blue
};

export const StoreConfigContext = createContext<StoreConfig>(defaultConfig);

export const useStoreConfig = () => useContext(StoreConfigContext);

type StoreConfigProviderProps = {
  children: React.ReactNode;
  config?: Partial<StoreConfig>;
};

export const StoreConfigProvider: React.FC<StoreConfigProviderProps> = ({ children, config = {} }) => {
  const mergedConfig = { ...defaultConfig, ...config };

  return (
    <StoreConfigContext.Provider value={mergedConfig}>
      {children}
    </StoreConfigContext.Provider>
  );
};
export default StoreConfigContext;