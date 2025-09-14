import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout, USER_ROLES } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!user) return null;

  const getRoleDisplayName = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Administrator';
      case USER_ROLES.PROCUREMENT_TEAM:
        return 'Procurement Team';
      case USER_ROLES.REQUESTOR:
        return 'Requestor';
      case USER_ROLES.GUEST:
        return 'Guest';
      default:
        return 'Unknown Role';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return '#dc3545'; // Red
      case USER_ROLES.PROCUREMENT_TEAM:
        return '#5f259f'; // PhonePe Purple
      case USER_ROLES.REQUESTOR:
        return '#28a745'; // Green
      case USER_ROLES.GUEST:
        return '#6c757d'; // Gray
      default:
        return '#6c757d';
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="user-profile">
      <div 
        className="user-profile-trigger"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <img 
          src={user.picture || '/default-avatar.png'} 
          alt={user.name}
          className="user-avatar"
        />
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span 
            className="user-role"
            style={{ color: getRoleColor(user.role) }}
          >
            {getRoleDisplayName(user.role)}
          </span>
        </div>
        <svg 
          className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M6 8L2 4h8z" fill="currentColor"/>
        </svg>
      </div>

      {showDropdown && (
        <div className="user-dropdown">
          <div className="dropdown-header">
            <div className="user-details">
              <img 
                src={user.picture || '/default-avatar.png'} 
                alt={user.name}
                className="dropdown-avatar"
              />
              <div>
                <div className="dropdown-name">{user.name}</div>
                <div className="dropdown-email">{user.email}</div>
                <div 
                  className="dropdown-role"
                  style={{ color: getRoleColor(user.role) }}
                >
                  {getRoleDisplayName(user.role)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <div className="dropdown-stats">
            <div className="stat-item">
              <span className="stat-label">Login Time:</span>
              <span className="stat-value">
                {new Date(user.loginTime).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="dropdown-divider"></div>
          
          <div className="dropdown-actions">
            <button 
              className="dropdown-action-btn logout-btn"
              onClick={handleLogout}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 2V1a1 1 0 0 1 2 0v1h4a1 1 0 0 1 0 2H8v1a1 1 0 0 1-2 0V4H2a1 1 0 0 1 0-2h4zM2 6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H2zm0 1h12v6H2V7z"/>
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}

      {showDropdown && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
