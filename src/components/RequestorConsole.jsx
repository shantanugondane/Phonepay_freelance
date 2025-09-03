import React, { useState } from 'react';

const RequestorConsole = ({ isActive }) => {
  const [activeTab, setActiveTab] = useState('my-requests');

  const myRequests = [
    { id: 'REQ-001', title: 'New Laptop for Development Team', department: 'IT', date: '25/07/2025', status: 'Pending', priority: 'High', budget: 'INR 2.5M' },
    { id: 'REQ-002', title: 'Office Furniture for New Branch', department: 'Facilities', date: '26/07/2025', status: 'Approved', priority: 'Medium', budget: 'INR 1.8M' },
    { id: 'REQ-003', title: 'Marketing Campaign Software', department: 'Marketing', date: '27/07/2025', status: 'In Progress', priority: 'High', budget: 'INR 0.8M' },
    { id: 'REQ-004', title: 'Cloud Infrastructure Services', department: 'IT', date: '28/07/2025', status: 'Pending', priority: 'Low', budget: 'INR 5.2M' }
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'in progress':
        return 'status-inprogress';
      default:
        return 'status-pending';
    }
  };

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
          <h1 className="page-title">Requestor Home Console</h1>
          <div className="breadcrumb">Dashboard / Requestor Console</div>
        </div>
        <button 
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            padding: '10px 18px', 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: '500', 
            fontSize: '15px', 
            cursor: 'pointer'
          }}
        >
          + New Request
        </button>
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
          className={`console-tab ${activeTab === 'my-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-requests')}
        >
          My Requests
        </button>
        <button 
          className={`console-tab ${activeTab === 'draft' ? 'active' : ''}`}
          onClick={() => setActiveTab('draft')}
        >
          Draft Requests
        </button>
        <button 
          className={`console-tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Requests
        </button>
      </div>

      <div className="console-stats">
        <div className="stat-card">
          <div className="stat-number">4</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">2</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">1</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">1</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>

      <div className="console-table-section">
        <h2 className="console-table-title">My Procurement Requests</h2>
        <div className="console-table-container">
          <table className="console-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Title</th>
                <th>Department</th>
                <th>Date</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((request, index) => (
                <tr key={index}>
                  <td><a href="#" className="case-link">{request.id}</a></td>
                  <td>{request.title}</td>
                  <td>{request.department}</td>
                  <td>{request.date}</td>
                  <td>{request.budget}</td>
                  <td><span className={getStatusClass(request.status)}>{request.status}</span></td>
                  <td><span className={getPriorityClass(request.priority)}>{request.priority}</span></td>
                  <td>
                    <button className="btn-small">View</button>
                    <button className="btn-small">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestorConsole;
