import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GOOGLE_CONFIG, USER_ROLES, ROLE_PERMISSIONS, getUserRole } from '../config/auth';

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

  // Initialize Google OAuth
  useEffect(() => {
    const initializeGoogleAuth = () => {
      if (window.google && window.google.accounts) {
        // Initialize Google Identity Services with proper configuration
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CONFIG.clientId,
          callback: handleAuthResponse,
          auto_select: false,
          cancel_on_tap_outside: false
        });
      }
      setLoading(false);
    };

    // Load Google OAuth script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      script.onerror = () => {
        console.log('Google script failed to load');
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleAuth();
    }

    // Check for existing session
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    const savedUser = localStorage.getItem('phonepe_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('phonepe_user');
      }
    }
  };

  const handleAuthResponse = (response) => {
    console.log('🔐 Google Auth Response received:', response);
    
    if (response.credential) {
      try {
        // Decode JWT token using jwt-decode library
        const payload = jwtDecode(response.credential);
        console.log('📋 Decoded JWT payload:', payload);
        
        const userRole = getUserRole(payload.email);
        const userData = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          role: userRole,
          permissions: ROLE_PERMISSIONS[userRole],
          loginTime: new Date().toISOString()
        };

        console.log('✅ User data created:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('phonepe_user', JSON.stringify(userData));
        console.log('🎉 User successfully logged in!');
        
      } catch (error) {
        console.error('❌ Error decoding JWT:', error);
        alert('Login failed: Could not process authentication data.');
      }
    } else {
      console.error('❌ No credential in response:', response);
      alert('Login failed: No authentication data received.');
    }
  };

  const login = () => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        console.log('🚀 Starting Google OAuth login...');
        
        // Initialize Google Identity Services
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CONFIG.clientId,
          callback: handleAuthResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: false
        });
        
        // Use renderButton instead of prompt to avoid Cross-Origin issues
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with'
          }
        );
        
        console.log('✅ Google OAuth initialized successfully');
        
      } catch (error) {
        console.error('❌ Google OAuth error:', error);
        // Fallback to mock login if Google OAuth fails
        alert('Google OAuth failed. Please use the Development Mode option below.');
      }
    } else {
      console.error('❌ Google OAuth not loaded');
      alert('Google OAuth not available. Please use the Development Mode option below.');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('phonepe_user');
    
    // Revoke Google token if available
    if (window.google && window.google.accounts) {
      window.google.accounts.oauth2.revoke();
    }
  };

  // Mock authentication for development
  const mockLogin = (email, role) => {
    console.log('🔐 Mock login called with:', { email, role });
    
    const userData = {
      id: `mock_${Date.now()}`,
      email: email,
      name: email.split('@')[0].replace('.', ' ').replace(/([A-Z])/g, ' $1').trim(),
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=5f259f&color=fff`,
      role: role,
      permissions: ROLE_PERMISSIONS[role],
      loginTime: new Date().toISOString(),
      isMock: true
    };

    console.log('✅ Mock user data created:', userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('phonepe_user', JSON.stringify(userData));
    console.log('🎉 Mock login completed successfully!');
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
    logout,
    mockLogin,
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
