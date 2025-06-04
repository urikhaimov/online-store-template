import { createTheme } from '@mui/material/styles';
import type { StoreConfig } from '../types/StoreConfig';

export function generateTheme(config: StoreConfig) {
  return createTheme({
    palette: {
      primary: {
        main: config?.primaryColor || '#1976d2',
      },
    },
    typography: {
      fontFamily: config?.font || 'Roboto',
    },
  });
}
