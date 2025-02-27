// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeType = 'dark' | 'light';
type ColorScheme = 'green' | 'amber' | 'blue';

interface ThemeContextType {
  theme: ThemeType;
  colorScheme: ColorScheme;
  toggleTheme: () => void;
  changeColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colorScheme: 'green',
  toggleTheme: () => {},
  changeColorScheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Check if there's a saved theme in localStorage
  const savedTheme = localStorage.getItem('theme') as ThemeType;
  const savedColorScheme = localStorage.getItem('colorScheme') as ColorScheme;
  
  const [theme, setTheme] = useState<ThemeType>(savedTheme || 'dark');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(savedColorScheme || 'green');

  // Update the body class and localStorage when theme changes
  useEffect(() => {
    document.body.className = `${theme}-theme ${colorScheme}-scheme`;
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
  }, [theme, colorScheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const changeColorScheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme, changeColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};