// React hook for theme management

import { useState, useEffect, useCallback } from 'react';
import { ThemeMode } from '../types/common';

// Theme context types
export interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  systemPrefersDark: boolean;
}

const THEME_STORAGE_KEY = 'moneyball_theme';

/**
 * Custom hook for theme management
 * Handles dark/light mode switching with system preference detection
 */
export function useTheme(): ThemeContextType {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        return saved as ThemeMode;
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }
    return 'system';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  // Get system preference for dark mode
  const systemPrefersDark = typeof window !== 'undefined' && 
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Apply theme
  const applyTheme = useCallback(
    (themeMode: ThemeMode) => {
      const dark = themeMode === 'dark' || (themeMode === 'system' && systemPrefersDark);
      setIsDark(dark);

      if (dark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    },
    [systemPrefersDark]
  );

  // Effect to apply theme when mode changes
  useEffect(() => {
    applyTheme(mode);
  }, [mode, applyTheme]);

  // Effect to listen for system theme changes
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDark(event.matches);
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const toggleTheme = useCallback((): void => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
      return newMode;
    });
  }, []);

  const setTheme = useCallback(
    (newMode: ThemeMode): void => {
      setMode(newMode);
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    },
    []
  );

  return {
    mode,
    isDark,
    toggleTheme,
    setTheme,
    systemPrefersDark,
  };
}

/**
 * Custom hook to get current theme as a boolean
 * @returns true if dark mode is enabled
 */
export function useIsDarkMode(): boolean {
  const { isDark } = useTheme();
  return isDark;
}

/**
 * Custom hook for theme-aware class names
 * Returns a function that generates class names based on theme
 */
export function useThemeClassnames() {
  const { isDark } = useTheme();

  const themeClassnames = {
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    bg: isDark ? 'bg-gray-800' : 'bg-white',
    bgMuted: isDark ? 'bg-gray-700' : 'bg-gray-50',
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
  };

  return themeClassnames;
}