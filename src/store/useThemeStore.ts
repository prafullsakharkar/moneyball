import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  systemTheme: boolean;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  isDark: false,
  systemTheme: false,

  setMode: (mode: ThemeMode) => {
    set({ mode });
    
    if (mode === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set({ isDark: isSystemDark, systemTheme: true });
    } else {
      set({ isDark: mode === 'dark', systemTheme: false });
    }
  },

  toggleTheme: () => {
    const { mode, isDark } = get();
    if (mode === 'system') {
      set({ isDark: !isDark, systemTheme: false });
    } else {
      set({ mode: isDark ? 'light' : 'dark', isDark: !isDark });
    }
  },
}));