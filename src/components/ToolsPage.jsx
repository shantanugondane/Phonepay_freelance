import React from 'react';

const ToolsPage = ({ isActive }) => {
  const mostUsedTools = [
    { icon: '📨', title: 'SF Workqueue', description: 'Manage work queues efficiently', gradient: 'linear-gradient(135deg, #9C27B0, #BA68C8)' },
    { icon: '⏰', title: 'Request Time Off', description: 'Submit time off requests', gradient: 'linear-gradient(135deg, #FF5722, #FF7043)' },
    { icon: '✅', title: 'Check ESOPs', description: 'View employee stock options', gradient: 'linear-gradient(135deg, #00BCD4, #26C6DA)' },
    { icon: '💰', title: 'Payroll & Tax Declaration', description: 'Access payroll information', gradient: 'linear-gradient(135deg, #3F51B5, #5C6BC0)' },
    { icon: '🔐', title: 'Access Management', description: 'Manage user permissions', gradient: 'linear-gradient(135deg, #673AB7, #9575CD)' }
  ];

  const employeeProcesses = [
    { icon: '⏱️', title: 'Request Time Off', description: 'Submit time off requests', gradient: 'linear-gradient(135deg, #E91E63, #F06292)' },
    { icon: '📊', title: 'Complete a census', description: 'Fill out employee census', gradient: 'linear-gradient(135deg, #FF9800, #FFB74D)' },
    { icon: '👤', title: 'Edit Profile', description: 'Update your profile information', gradient: 'linear-gradient(135deg, #795548, #A1887F)' },
    { icon: '⭐', title: 'Performance Review', description: 'Access performance reviews', gradient: 'linear-gradient(135deg, #607D8B, #78909C)' }
  ];

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">Tools</h1>
          <div className="breadcrumb">Dashboard / Tools</div>
        </div>
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input type="text" placeholder="Search for people by name, role, location and more..." />
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Most Used Tools</h2>
      </div>
      
      <div className="tools-grid">
        {mostUsedTools.map((tool, index) => (
          <div key={index} className="tool-card">
            <div className="tool-icon" style={{background: tool.gradient}}>{tool.icon}</div>
            <h3 className="tool-title">{tool.title}</h3>
            <p className="tool-description">{tool.description}</p>
          </div>
        ))}
      </div>

      <div className="section-header" style={{marginTop: '40px'}}>
        <h2 className="section-title">Employee Processes</h2>
      </div>
      
      <div className="tools-grid">
        {employeeProcesses.map((process, index) => (
          <div key={index} className="tool-card">
            <div className="tool-icon" style={{background: process.gradient}}>{process.icon}</div>
            <h3 className="tool-title">{process.title}</h3>
            <p className="tool-description">{process.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
