import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';

const Navbar = () => {
  const location = useLocation();
  const { user, hasPermission, isAuthenticated } = useAuth();
  
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/home', permission: null },
    { id: 'dashboard', icon: '📊', label: 'Dashboard', path: '/dashboard', permission: null },
    { id: 'requestor', icon: '📝', label: 'Requestor Console', path: '/requestor', permission: 'canCreatePSR' },
    { id: 'procurement', icon: '🛒', label: 'Procurement Console', path: '/procurement', permission: 'canAccessProcurementConsole' },
    { id: 'people', icon: '👥', label: 'People', path: '/people', permission: 'canManageUsers' },
    { id: 'tools', icon: '🛠️', label: 'Tools', path: '/tools', permission: null },
    { id: 'content', icon: '📄', label: 'Content', path: '/content', permission: null },
    { id: 'calendar', icon: '📅', label: 'Calendar', path: '/calendar', permission: null },
    { id: 'console', icon: '🖥️', label: 'Console', path: '/console', permission: null }
  ];



  const isActive = (path) => {
    return location.pathname === path || (path === '/home' && location.pathname === '/');
  };

  // Filter nav items based on user permissions
  const visibleNavItems = navItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <div className="logo-icon">P</div>
          <span className="logo-text">PhonePe Portal</span>
        </div>
      </div>
      
      <nav className="navbar-nav">
        {visibleNavItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <div className="nav-icon">{item.icon}</div>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="navbar-right">
        {isAuthenticated ? (
          <UserProfile />
        ) : (
          <div className="navbar-auth">
            <Link 
              to="/login" 
              className="nav-login-btn"
              onClick={() => console.log('Navbar Login button clicked!')}
            >
              Login
            </Link>
            <Link to="/" className="nav-home-btn">
              Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;