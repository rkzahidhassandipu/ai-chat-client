'use client';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return { theme, toggleTheme, setTheme, isDark: theme === 'dark' };
}
