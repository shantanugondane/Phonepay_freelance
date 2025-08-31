import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home', path: '/home' },
    { id: 'people', icon: '👥', label: 'People', path: '/people' },
    { id: 'tools', icon: '🛠️', label: 'Tools', path: '/tools' },
    { id: 'content', icon: '📄', label: 'Content', path: '/content' },
    { id: 'calendar', icon: '📅', label: 'Calendar', path: '/calendar' },
    { id: 'console', icon: '🖥️', label: 'Console', path: '/console' }
  ];



  const isActive = (path) => {
    return location.pathname === path || (path === '/home' && location.pathname === '/');
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo">
          <div className="logo-icon">P</div>
        </div>
      </div>
      
      <nav className="navbar-nav">
        {navItems.map((item) => (
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
    </div>
  );
};

export default Navbar;