import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MockLogin from './MockLogin';
import './LoginPage.css';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const [showMockLogin, setShowMockLogin] = useState(false);

  const handleGoogleLogin = () => {
    login();
  };

  const handleShowMockLogin = () => {
    setShowMockLogin(true);
  };

  const handleBackToGoogle = () => {
    setShowMockLogin(false);
  };

  // Initialize Google Sign-In button when component mounts
  useEffect(() => {
    // Call login function to initialize Google OAuth
    login();
  }, [login]);

  if (loading) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  // Show mock login if requested
  if (showMockLogin) {
    return <MockLogin />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="phonepe-logo">
            <h1>PhonePe</h1>
            <span className="logo-subtitle">Procurement Portal</span>
          </div>
          <p className="login-description">
            Access your procurement tools and manage requests securely
          </p>
        </div>

        <div className="login-form">
          <div id="google-signin-button"></div>
          
          <button 
            className="google-login-btn fallback-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{ display: 'none' }}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="login-info">
            <p className="info-text">
              Sign in with your Google account to access the PhonePe Procurement Portal
            </p>
            <div className="role-info">
              <h4>Available Roles:</h4>
              <ul>
                <li><strong>Admin:</strong> Full system access</li>
                <li><strong>Procurement Team:</strong> Internal tools and approvals</li>
                <li><strong>Requestor:</strong> External request submission</li>
                <li><strong>Guest:</strong> Read-only access</li>
              </ul>
            </div>
            
            <div className="development-options">
              <p className="dev-text">Having trouble with Google OAuth?</p>
              <button 
                className="mock-login-toggle"
                onClick={handleShowMockLogin}
              >
                🛠️ Use Development Mode (Mock Login)
              </button>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p className="footer-text">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
