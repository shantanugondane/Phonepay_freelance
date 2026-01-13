import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import './phonepe_redesign.css';
import LandingPage from './components/LandingPage';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PeoplePage from './components/PeoplePage';
import ToolsPage from './components/ToolsPage';
import ContentPage from './components/ContentPage';
import CalendarPage from './components/CalendarPage';
import ConsolePage from './components/ConsolePage';
import RequestorConsole from './components/RequestorConsole';
import ProcurementConsole from './components/ProcurementConsole';
import DashboardConsole from './components/DashboardConsole';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page route - no navbar */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Direct login route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Authenticated routes - with navbar and role-based access */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <DashboardConsole isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/home" element={
            <ProtectedRoute>
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <HomePage isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/people" element={
            <ProtectedRoute requiredPermission="canManageUsers">
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <PeoplePage isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/tools" element={
            <ProtectedRoute>
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <ToolsPage isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/content" element={
            <ProtectedRoute>
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <ContentPage isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/calendar" element={
            <ProtectedRoute>
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <CalendarPage isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/console" element={
            <ProtectedRoute>
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <ConsolePage isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Requestor Console - accessible to Requestors and above */}
          <Route path="/requestor" element={
            <ProtectedRoute requiredPermission="canCreatePSR">
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <RequestorConsole isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Procurement Console - accessible to Procurement Team and Admins */}
          <Route path="/procurement" element={
            <ProtectedRoute requiredPermission="canAccessProcurementConsole">
              <div className="container">
                <Navbar />
                <div className="main-content">
                  <ProcurementConsole isActive={true} />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Redirect any unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;