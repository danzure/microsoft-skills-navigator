import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ms-cert-tracker-theme';

const ThemeContext = createContext(null);

/**
 * Provider component that manages the application's dark/light theme state.
 * Automatically synchronizes the theme with localStorage and updates the DOM.
 */
export const ThemeProvider = ({ children }) => {
  const [themePref, setThemePref] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'system' || stored === 'light' || stored === 'dark') return stored;
    } catch {
      // Ignore error
    }
    return 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() => 
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return;

    const handleSystemThemeChange = (e) => {
      setSystemPrefersDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const isDark = themePref === 'system' ? systemPrefersDark : themePref === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, themePref);
  }, [isDark, themePref]);

  const setTheme = useCallback((newTheme) => {
    setThemePref(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ themePref, setTheme, isDark, systemPrefersDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to consume the ThemeContext.
 * @returns An object containing the current theme, an isDark boolean, and a toggleTheme function.
 * @throws {Error} If called outside of a ThemeProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
