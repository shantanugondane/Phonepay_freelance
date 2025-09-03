import React, { useState } from 'react';

const ProcurementConsole = ({ isActive }) => {
  const [activeTab, setActiveTab] = useState('pending-requests');

  const pendingRequests = [
    { id: 'REQ-005', title: 'Security System Installation', department: 'Facilities', requestor: 'John Doe', date: '30/07/2025', budget: 'INR 3.5M', priority: 'High' },
    { id: 'REQ-006', title: 'Customer Support Software', department: 'Operations', requestor: 'Jane Smith', date: '30/07/2025', budget: 'INR 0.9M', priority: 'Medium' },
    { id: 'REQ-007', title: 'Employee Training Program', department: 'HR', requestor: 'Mike Johnson', date: '29/07/2025', budget: 'INR 1.2M', priority: 'Medium' }
  ];

  const approvedRequests = [
    { id: 'REQ-002', title: 'Office Furniture for New Branch', department: 'Facilities', requestor: 'Sarah Wilson', date: '26/07/2025', budget: 'INR 1.8M', status: 'Approved' },
    { id: 'REQ-003', title: 'Marketing Campaign Software', department: 'Marketing', requestor: 'David Brown', date: '27/07/2025', budget: 'INR 0.8M', status: 'In Progress' }
  ];

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">Procurement Home Console</h1>
          <div className="breadcrumb">Dashboard / Procurement Console</div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Export Data</button>
          <button className="btn-primary">+ New Vendor</button>
        </div>
      </div>

      {/* HomePage Content - PhonePe Bulletin Section */}
      <div className="bulletin-section">
        <div className="section-header">
          <h2 className="section-title">PhonePe Bulletin</h2>
          <a href="#" className="view-all">View All</a>
        </div>
        
        <div className="bulletin-grid">
          <div className="bulletin-card">
            <div className="bulletin-tag">OMG! Store</div>
            <h3 className="bulletin-title">Explore themed merch on the OMG! Store this June!</h3>
            <p className="bulletin-description">Did you know that apart from regular PhonePe merch, our OMG store also carries themed merchandise!</p>
            <button className="bulletin-action">Click for more details</button>
          </div>
          
          <div className="bulletin-card">
            <div className="bulletin-tag">Insurance</div>
            <h3 className="bulletin-title">Annual Insurance Enrollment is Now Open!</h3>
            <p className="bulletin-description">Are you seeking a benefits program that offers a unique advantage over others?</p>
            <button className="bulletin-action">Click for more details</button>
          </div>
          
          <div className="bulletin-card">
            <div className="bulletin-tag">Pride At PhonePe</div>
            <h3 className="bulletin-title">LGBTQ+ Referral Campaign</h3>
            <p className="bulletin-description">As we enter Pride month, we are thrilled to announce our LGBTQ+ Referral Campaign, aimed at promoting diversity within our organization.</p>
            <button className="bulletin-action">Click for more details</button>
          </div>
        </div>
      </div>

      {/* HomePage Content - Quick Access Section */}
      <div className="section-header">
        <h2 className="section-title">Quick Access</h2>
      </div>
      
             <div className="tools-grid">
         <div className="tool-card">
           <div className="tool-icon" style={{background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)'}}>📊</div>
           <h3 className="tool-title">Analytics</h3>
           <p className="tool-description">View performance metrics</p>
         </div>
         <div className="tool-card">
           <div className="tool-icon" style={{background: 'linear-gradient(135deg, #4ECDC4, #6BDDD6)'}}>📝</div>
           <h3 className="tool-title">Reports</h3>
           <p className="tool-description">Generate and manage reports</p>
         </div>
         <div className="tool-card">
           <div className="tool-icon" style={{background: 'linear-gradient(135deg, #45B7D1, #6BCBDF)'}}>⚙️</div>
           <h3 className="tool-title">Settings</h3>
           <p className="tool-description">Configure your preferences</p>
         </div>
       </div>

       {/* Divider between Quick Access and Console Tabs */}
       <div style={{
         height: '1px',
         background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)',
         margin: '30px 0',
         width: '100%'
       }}></div>

       <div className="console-tabs">
        <button 
          className={`console-tab ${activeTab === 'pending-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending-requests')}
        >
          Pending Requests ({pendingRequests.length})
        </button>
        <button 
          className={`console-tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Requests
        </button>
        <button 
          className={`console-tab ${activeTab === 'vendors' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendors')}
        >
          Vendor Management
        </button>
      </div>

      <div className="console-stats">
        <div className="stat-card">
          <div className="stat-number">3</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">2</div>
          <div className="stat-label">Approved This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">INR 6.2M</div>
          <div className="stat-label">Total Budget</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">15</div>
          <div className="stat-label">Active Vendors</div>
        </div>
      </div>

      {activeTab === 'pending-requests' && (
        <div className="console-table-section">
          <h2 className="console-table-title">Pending Procurement Requests</h2>
          <div className="console-table-container">
            <table className="console-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Requestor</th>
                  <th>Date</th>
                  <th>Budget</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request, index) => (
                  <tr key={index}>
                    <td><a href="#" className="case-link">{request.id}</a></td>
                    <td>{request.title}</td>
                    <td>{request.department}</td>
                    <td>{request.requestor}</td>
                    <td>{request.date}</td>
                    <td>{request.budget}</td>
                    <td><span className={getPriorityClass(request.priority)}>{request.priority}</span></td>
                    <td>
                      <button className="btn-success">Approve</button>
                      <button className="btn-warning">Review</button>
                      <button className="btn-danger">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'approved' && (
        <div className="console-table-section">
          <h2 className="console-table-title">Approved Requests</h2>
          <div className="console-table-container">
            <table className="console-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Title</th>
                  <th>Department</th>
                  <th>Requestor</th>
                  <th>Date</th>
                  <th>Budget</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvedRequests.map((request, index) => (
                  <tr key={index}>
                    <td><a href="#" className="case-link">{request.id}</a></td>
                    <td>{request.title}</td>
                    <td>{request.department}</td>
                    <td>{request.requestor}</td>
                    <td>{request.date}</td>
                    <td>{request.budget}</td>
                    <td><span className="status-approved">{request.status}</span></td>
                    <td>
                      <button className="btn-small">Track</button>
                      <button className="btn-small">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="console-table-section">
          <h2 className="console-table-title">Vendor Management</h2>
          <div className="tools-grid">
            <div className="tool-card">
              <div className="tool-icon" style={{background: 'linear-gradient(135deg, #4ECDC4, #6BDDD6)'}}>🏢</div>
              <h3 className="tool-title">Add New Vendor</h3>
              <p className="tool-description">Register a new vendor in the system</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon" style={{background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)'}}>📊</div>
              <h3 className="tool-title">Vendor Performance</h3>
              <p className="tool-description">View vendor ratings and performance</p>
            </div>
            <div className="tool-card">
              <div className="tool-icon" style={{background: 'linear-gradient(135deg, #45B7D1, #6BCBDF)'}}>📋</div>
              <h3 className="tool-title">Contract Management</h3>
              <p className="tool-description">Manage vendor contracts and agreements</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementConsole;
