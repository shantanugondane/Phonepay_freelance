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

                           {/* Procurement Information Sections */}
        <div className="procurement-sections">
          <div className="section-row">
            <div className="procurement-card">
              <div className="card-header">
                <h3 className="card-title">Policies & SOPs (View Only)</h3>
                <div className="card-icon">📋</div>
              </div>
              <div className="card-content">
                <ul className="card-list">
                  <li>Procurement Policy Summary – 2 Pager and complete</li>
                  <li>How to Raise PR & PSR</li>
                  <li>Vendor Onboarding Process</li>
                </ul>
                <div className="card-note">Section for Independent SOPs</div>
              </div>
            </div>
            
            <div className="procurement-card">
              <div className="card-header">
                <h3 className="card-title">PR & PO Access</h3>
                <div className="card-icon">🔐</div>
              </div>
              <div className="card-content">
                <p className="card-description">Access to Purchase Requests and Purchase Orders</p>
              </div>
            </div>
          </div>
          
          <div className="section-row">
            <div className="procurement-card">
              <div className="card-header">
                <h3 className="card-title">Quick Links</h3>
                <div className="card-icon">🔗</div>
              </div>
              <div className="card-content">
                <ul className="card-list">
                  <li>PSR Create & Link</li>
                  <li>Fusion & SPOTDRAFT Link</li>
                  <li>O Paper Link - VMT Tool Link</li>
                </ul>
              </div>
            </div>
            
            <div className="procurement-card">
              <div className="card-header">
                <h3 className="card-title">FAQs</h3>
                <div className="card-icon">❓</div>
              </div>
              <div className="card-content">
                <p className="card-description">Do You Know About Procurement? To Be Explore</p>
              </div>
            </div>
          </div>
          
          <div className="section-row">
            <div className="procurement-card spoc-card">
              <div className="card-header">
                <h3 className="card-title"><strong>SPOC</strong> Details</h3>
                <div className="card-icon">👥</div>
              </div>
              <div className="card-content">
                <ul className="card-list">
                  <li>Procurement</li>
                  <li>Fusion</li>
                </ul>
              </div>
            </div>
            
            <div className="procurement-card psr-card">
              <div className="card-header">
                <h3 className="card-title"><strong>PSR Creation</strong> Access</h3>
                <div className="card-icon">📝</div>
              </div>
              <div className="card-content">
                <p className="card-description">Request Raising Forum</p>
              </div>
            </div>
          </div>
          
          <div className="section-row">
            <div className="procurement-card vmt-card">
              <div className="card-header">
                <h3 className="card-title">VMT Information</h3>
                <div className="card-icon">🛠️</div>
              </div>
              <div className="card-content">
                <ul className="card-list">
                  <li>Request Forum</li>
                  <li>VMT Tool Integration (To Be Explored)</li>
                </ul>
              </div>
            </div>
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
