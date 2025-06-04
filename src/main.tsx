import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { AuthProvider } from './context/AuthContext';
import { StoreConfigContext } from './context/StoreConfigContext';
import { ErrorBoundary } from '@sentry/react';

import { ThemeProvider } from '@mui/material/styles';
import { getStoreIdFromURL } from './utils/getStoreIdFromURL';
import { loadStoreConfig } from './utils/loadStoreConfig';
import { generateTheme } from './theme/generateTheme';


import './index.css';

// Step 1: Get store ID from URL (e.g. ?store=tech-store)
const storeId = getStoreIdFromURL();

// Step 2: Load corresponding config from storesConfig
const storeConfig = loadStoreConfig(storeId);

// Step 3: Defensive check (should never fail if fallback is set correctly)
if (!storeConfig) {
  throw new Error(`❌ Store config not found for: ${storeId}`);
}

// Step 4: Create MUI theme based on store config
const theme = generateTheme(storeConfig);

// Step 5: Render app with context
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<p>⚠ Something went wrong. Our team has been notified!</p>}>
      <StoreConfigContext.Provider value={storeConfig}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </StoreConfigContext.Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
