import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { StoreConfigContext, defaultConfig } from './context/StoreConfigContext';
import { ErrorBoundary } from '@sentry/react';
import { ThemeProvider } from './context/ThemeContext'; // ✅ must be YOUR version

import { BrowserRouter } from 'react-router-dom';
import { getStoreIdFromURL } from './utils/getStoreIdFromURL';
import { loadStoreConfig } from './utils/loadStoreConfig';
import { generateTheme } from './theme/generateTheme';
import { RedirectProvider } from './context/RedirectContext';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const savedStoreId = localStorage.getItem('storeId') || 'store1';
const storeConfig = loadStoreConfig(savedStoreId) ?? defaultConfig;
const theme = generateTheme(storeConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <BrowserRouter>
    <ErrorBoundary fallback={<p>⚠ Something went wrong. Our team has been notified!</p>}>
      <StoreConfigContext.Provider value={storeConfig}>
       <ThemeProvider storeId={savedStoreId}>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <RedirectProvider>
                <App />
              </RedirectProvider>
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </StoreConfigContext.Provider>
    </ErrorBoundary>
  </BrowserRouter>
</React.StrictMode>
);
