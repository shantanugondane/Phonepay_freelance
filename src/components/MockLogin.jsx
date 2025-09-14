import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './MockLogin.css';

const MockLogin = () => {
  const { mockLogin } = useAuth();
  const [selectedRole, setSelectedRole] = useState('requestor');
  const [userEmail, setUserEmail] = useState('test@phonepe.com');

  const handleMockLogin = () => {
    mockLogin(userEmail, selectedRole);
  };

  return (
    <div className="mock-login-container">
      <div className="mock-login-card">
        <div className="mock-login-header">
          <div className="phonepe-logo">
            <h1>PhonePe</h1>
            <span className="logo-subtitle">Procurement Portal</span>
          </div>
          <p className="mock-login-description">
            Development Mode - Mock Authentication
          </p>
        </div>

        <div className="mock-login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              id="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Role:</label>
            <select
              id="role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="admin">Admin - Full Access</option>
              <option value="procurement_team">Procurement Team</option>
              <option value="requestor">Requestor</option>
              <option value="guest">Guest - Read Only</option>
            </select>
          </div>

          <button 
            className="mock-login-btn"
            onClick={handleMockLogin}
          >
            🚀 Login with Mock Account
          </button>

          <div className="mock-info">
            <h4>Role Permissions:</h4>
            <ul>
              <li><strong>Admin:</strong> All access, user management, all consoles</li>
              <li><strong>Procurement Team:</strong> Procurement console, Fusion, SPOTDRAFT</li>
              <li><strong>Requestor:</strong> Requestor console, PSR creation</li>
              <li><strong>Guest:</strong> Read-only access</li>
            </ul>
          </div>
        </div>

        <div className="mock-footer">
          <p className="footer-text">
            This is a development mock login. In production, this will be replaced with Google OAuth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MockLogin;
