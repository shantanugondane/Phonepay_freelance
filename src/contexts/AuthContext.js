import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import { USER_ROLES } from '../config/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const token = localStorage.getItem('phonepe_token');
    const savedUser = localStorage.getItem('phonepe_user');
    
    if (token && savedUser) {
      try {
        // Verify token is still valid by fetching current user
        const response = await authAPI.getCurrentUser();
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('phonepe_user', JSON.stringify(response.user));
      } catch (error) {
        // Token invalid, clear storage
        console.error('Session expired:', error);
        localStorage.removeItem('phonepe_token');
        localStorage.removeItem('phonepe_user');
      }
    }
    
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('phonepe_token', response.token);
      localStorage.setItem('phonepe_user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      // Store token and user data
      localStorage.setItem('phonepe_token', response.token);
      localStorage.setItem('phonepe_user', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      return { success: true, user: response.user };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('phonepe_token');
      localStorage.removeItem('phonepe_user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions[permission] === true;
  };

  const isRole = (role) => {
    return user && user.role === role;
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasPermission,
    isRole,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
