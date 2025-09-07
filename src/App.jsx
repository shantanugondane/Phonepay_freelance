import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
    <Router>
      <Routes>
        {/* Landing page route - no navbar */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Authenticated routes - with navbar */}
        <Route path="/dashboard" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <HomePage isActive={true} />
            </div>
          </div>
        } />
        <Route path="/home" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <HomePage isActive={true} />
            </div>
          </div>
        } />
        <Route path="/people" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <PeoplePage isActive={true} />
            </div>
          </div>
        } />
        <Route path="/tools" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <ToolsPage isActive={true} />
            </div>
          </div>
        } />
        <Route path="/content" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <ContentPage isActive={true} />
            </div>
          </div>
        } />
        <Route path="/calendar" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <CalendarPage isActive={true} />
            </div>
          </div>
        } />
        <Route path="/console" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <ConsolePage isActive={true} />
            </div>
          </div>
        } />
        
        {/* New PhonePe console routes */}
        <Route path="/requestor" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <RequestorConsole isActive={true} />
            </div>
          </div>
        } />
        <Route path="/procurement" element={
          <div className="container">
            <Navbar />
            <div className="main-content">
              <ProcurementConsole isActive={true} />
            </div>
          </div>
        } />
        
        {/* Redirect any unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;