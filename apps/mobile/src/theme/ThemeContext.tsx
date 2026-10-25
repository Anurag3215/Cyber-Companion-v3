import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tokens } from '../design-system/tokens';
import { Storage } from '../storage/StorageAdapter';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  colors: typeof Tokens.colors.dark;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setMode: () => {},
  colors: Tokens.colors.dark,
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Load persisted theme preference
    Storage.getItem('cyber_theme_mode')
      .then((saved) => {
        if (saved === 'dark' || saved === 'light') {
          setModeState(saved);
        } else {
          setModeState('dark');
        }
      })
      .catch(() => {
        setModeState('dark');
      });
  }, []);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    Storage.setItem('cyber_theme_mode', newMode).catch(() => {});
  };

  const toggleTheme = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
  };

  const isDark = mode === 'dark';
  const colors = isDark ? Tokens.colors.dark : (Tokens.colors.light as any);

  return (
    <ThemeContext.Provider value={{ mode, isDark, toggleTheme, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
