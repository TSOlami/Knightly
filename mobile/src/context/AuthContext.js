import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  storeAuthToken, 
  getAuthToken, 
  removeAuthToken, 
  storeUserData, 
  getUserData, 
  removeUserData 
} from '../utils/secureStorage';
import authService from '../services/authService';
import { Alert, Platform } from 'react-native';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setLoading(true);
        
        // Check if token exists
        const token = await getAuthToken();
        if (token) {
          // Get user data from secure storage
          const storedUser = await getUserData();
          if (storedUser) {
            setUser(storedUser);
            setAuthenticated(true);
            console.log('User logged in from stored credentials');
          } else {
            // If token exists but no user data, try to fetch user from API
            try {
              console.log('Token found but no user data, fetching from API');
              const userData = await authService.getCurrentUser();
              setUser(userData);
              storeUserData(userData);
              setAuthenticated(true);
            } catch (err) {
              console.error('Error fetching user data:', err);
              // If API call fails, clear invalid token
              await removeAuthToken();
              await removeUserData();
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);
  
  // Register a new user
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.register(username, email, password);
      
      // Store auth token and user data
      await storeAuthToken(data.token);
      await storeUserData(data.user);
      
      setUser(data.user);
      setAuthenticated(true);
      
      return data;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login with email and password
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.login(email, password);
      
      // Store auth token and user data
      await storeAuthToken(data.token);
      await storeUserData(data.user);
      
      setUser(data.user);
      setAuthenticated(true);
      
      return data;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login as guest
  const loginAsGuest = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting guest login');
      const data = await authService.loginAsGuest();
      console.log('Guest login response:', data);
      
      // Store auth token and user data
      await storeAuthToken(data.token);
      await storeUserData(data.user);
      
      setUser(data.user);
      setAuthenticated(true);
      
      return data;
    } catch (err) {
      console.error('Guest login error:', err);
      setError(err.message || 'Guest login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.loginWithGoogle();
      
      // Store auth token and user data
      if (data.token) {
        await storeAuthToken(data.token);
      }
      await storeUserData(data);
      
      setUser(data);
      setAuthenticated(true);
      
      return data;
    } catch (err) {
      setError(err.message || 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      
      try {
        await authService.logout();
      } catch (err) {
        console.log('Error during server logout, continuing with local logout');
      }
      
      // Clear auth token and user data locally
      await removeAuthToken();
      await removeUserData();
      
      setUser(null);
      setAuthenticated(false);
    } catch (err) {
      setError(err.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Convert guest account to regular account
  const convertGuestAccount = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.convertGuestAccount(username, email, password);
      
      // Update stored user data
      await storeUserData(data.user);
      
      setUser(data.user);
      
      return data;
    } catch (err) {
      setError(err.message || 'Account conversion failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await authService.updatePreferences(preferences);
      
      // Update stored user data
      const updatedUser = { ...user, preferences: data.preferences };
      await storeUserData(updatedUser);
      
      setUser(updatedUser);
      
      return data;
    } catch (err) {
      setError(err.message || 'Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user stats
  const updateUserStats = (newStats) => {
    if (user) {
      const updatedUser = { ...user, ...newStats };
      setUser(updatedUser);
      storeUserData(updatedUser);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        authenticated,
        register,
        login,
        loginAsGuest,
        loginWithGoogle,
        logout,
        convertGuestAccount,
        updatePreferences,
        updateUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 