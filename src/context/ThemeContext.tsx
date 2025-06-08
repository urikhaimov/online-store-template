import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme as MuiTheme } from '@mui/material/styles';
import { generateMuiTheme } from '../theme/generateMuiTheme';
import { fetchThemeConfig } from '../utils/fetchThemeConfig';
import { updateUserThemeMode, fetchUserThemeMode } from '../api/userPreferences';
import { useSafeAuth } from '../hooks/useAuth';
import type { ThemeConfig } from '../types/ThemeConfig';
import { defaultThemeConfig } from '../constants/defaultTheme';
type Mode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeConfig | null;
  muiTheme: MuiTheme | null;
  isLoading: boolean;
  error: string | null;
  mode: Mode;
  toggleMode: () => void;
  updateTheme: (newConfig: ThemeConfig) => void;
}

const defaultMode = (localStorage.getItem('themeMode') as Mode) || 'light';

const ThemeContext = createContext<ThemeContextType>({
  theme: null,
  muiTheme: null,
  isLoading: true,
  error: null,
  mode: defaultMode,
  toggleMode: () => { },
  updateTheme: () => { },
});

export const ThemeProvider = ({
  storeId = 'default',
  children,
}: {
  storeId?: string;
  children: ReactNode;
}) => {
  
  const [theme, setTheme] = useState<ThemeConfig | null>(null);
  const [muiTheme, setMuiTheme] = useState<MuiTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(defaultMode);

  const { user } = useSafeAuth();
  console.log(storeId , 'Store ID used in ThemeProvider');
  const toggleMode = () => {
    const newMode: Mode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);

    if (user?.id) {
      updateUserThemeMode(user.id, newMode).catch(console.error);
    }
  };

  const updateTheme = (newConfig: ThemeConfig) => {
    setTheme(newConfig);
    setMuiTheme(generateMuiTheme(newConfig, newConfig.mode || mode));
    if (newConfig.mode && newConfig.mode !== mode) {
      setMode(newConfig.mode);
      localStorage.setItem('themeMode', newConfig.mode);
    }
  };
  useEffect(() => {
    fetchThemeConfig(storeId)
      .then((data) => {
        setTheme(data);
        const theme = generateMuiTheme(data, mode);
        console.log('Generated theme:', theme);
        setMuiTheme(theme);
      })
      .catch((err) => {
        console.error('Fallback theme used due to fetch error:', err);
        setTheme(defaultThemeConfig);
        setMuiTheme(generateMuiTheme(defaultThemeConfig, mode));
      })
      .finally(() => setIsLoading(false));
  }, [storeId]);


  useEffect(() => {
    if (theme) {
      setMuiTheme(generateMuiTheme(theme, mode));
    }
  }, [mode, theme]);

  useEffect(() => {
    if (!user?.id) return;
    fetchUserThemeMode(user.id)
      .then((savedMode) => {
        const fallback = (localStorage.getItem('themeMode') as Mode) || 'light';
        const initial = savedMode || fallback;
        setMode(initial);
        localStorage.setItem('themeMode', initial);
      })
      .catch(console.error);
  }, [user?.id]);



  return (
    <ThemeContext.Provider
      value={{ theme, muiTheme, isLoading, error, mode, toggleMode, updateTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
