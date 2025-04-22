import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { useAuth } from './AuthContext';
import lightTheme from '../theme/lightTheme';
import darkTheme from '../theme/darkTheme';

// Create Theme Context with default values to prevent issues during initialization
const ThemeContext = createContext({
  theme: lightTheme,
  themeMode: 'light',
  toggleTheme: () => {},
  changeTheme: () => {},
  isDarkMode: false
});

// Provider component
export const ThemeProvider = ({ children }) => {
  let auth = { user: null };
  try {
    auth = useAuth();
  } catch (error) {
    console.warn('AuthContext not available yet, using defaults');
  }
  
  const { user } = auth;
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [theme, setTheme] = useState(deviceTheme === 'dark' ? darkTheme : lightTheme);

  // Apply theme based on user preferences
  useEffect(() => {
    if (user?.preferences?.theme) {
      setThemeMode(user.preferences.theme);
    }
  }, [user]);

  // Update theme whenever themeMode changes
  useEffect(() => {
    let selectedTheme;
    
    if (themeMode === 'system') {
      selectedTheme = deviceTheme === 'dark' ? darkTheme : lightTheme;
    } else {
      selectedTheme = themeMode === 'dark' ? darkTheme : lightTheme;
    }
    
    setTheme(selectedTheme);
  }, [themeMode, deviceTheme]);

  // Toggle theme
  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  // Change theme to specific mode
  const changeTheme = (mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      setThemeMode(mode);
    }
  };

  const isDarkMode = themeMode === 'dark' || (themeMode === 'system' && deviceTheme === 'dark');

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        toggleTheme,
        changeTheme,
        isDarkMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 