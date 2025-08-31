import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './phonepe_redesign.css';
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
      <div className="container">
        <Navbar />
        <div className="main-content">
          <Routes>
            {/* Original routes */}
            <Route path="/" element={<HomePage isActive={true} />} />
            <Route path="/home" element={<HomePage isActive={true} />} />
            <Route path="/people" element={<PeoplePage isActive={true} />} />
            <Route path="/tools" element={<ToolsPage isActive={true} />} />
            <Route path="/content" element={<ContentPage isActive={true} />} />
            <Route path="/calendar" element={<CalendarPage isActive={true} />} />
            <Route path="/console" element={<ConsolePage isActive={true} />} />
            
            {/* New PhonePe console routes */}
            <Route path="/requestor" element={<RequestorConsole isActive={true} />} />
            <Route path="/procurement" element={<ProcurementConsole isActive={true} />} />
            <Route path="/dashboard" element={<DashboardConsole isActive={true} />} />
            
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;