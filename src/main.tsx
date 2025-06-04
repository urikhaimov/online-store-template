import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { AuthProvider } from './context/AuthContext';
import { StoreConfigContext, defaultConfig } from './context/StoreConfigContext';
import { ErrorBoundary } from '@sentry/react';
import { ThemeProvider } from '@mui/material/styles';

import { BrowserRouter } from 'react-router-dom';
import { getStoreIdFromURL } from './utils/getStoreIdFromURL';
import { loadStoreConfig } from './utils/loadStoreConfig';
import { generateTheme } from './theme/generateTheme';

import './index.css';

// Step 1: Get storeId from URL (?store=tech-store)
const storeId = getStoreIdFromURL();

// Step 2: Load corresponding store config, fallback to default
const storeConfig = loadStoreConfig(storeId) ?? defaultConfig;

// Step 3: Generate theme dynamically based on store config
const theme = generateTheme(storeConfig);

// Step 4: Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </React.StrictMode>
);
