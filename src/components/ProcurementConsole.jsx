import React, { useState, useEffect } from 'react';
import { psrAPI } from '../utils/api';

const ProcurementConsole = ({ isActive }) => {
  const [activeTab, setActiveTab] = useState('pending-requests');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    totalBudget: 0,
    vendors: 15 // Placeholder for now
  });

  useEffect(() => {
    if (isActive) {
      fetchPendingRequests();
      fetchApprovedRequests();
      fetchStatistics();
    }
  }, [isActive, activeTab]);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await psrAPI.getPending();
      setPendingRequests(response.psrs || []);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
      setError('Failed to load pending requests. Please try again.');
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedRequests = async () => {
    try {
      const response = await psrAPI.getApproved();
      const approved = response.psrs || [];
      setApprovedRequests(approved);
      // Update stats after fetching approved requests
      const totalBudget = approved.reduce((sum, psr) => sum + (psr.budget?.amount || 0), 0);
      setStats(prev => ({ ...prev, totalBudget }));
    } catch (err) {
      console.error('Error fetching approved requests:', err);
      setApprovedRequests([]);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await psrAPI.getStatistics();
      setStats(prev => ({
        pending: response.pending || 0,
        approved: response.approved || 0,
        totalBudget: prev.totalBudget,
        vendors: 15
      }));
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatBudget = (amount) => {
    if (amount >= 1000000) {
      return `INR ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `INR ${(amount / 1000).toFixed(1)}K`;
    }
    return `INR ${amount}`;
  };

  const formatPriority = (priority) => {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
  };

  const formatStatus = (status) => {
    const statusMap = {
      'draft': 'Draft',
      'pending': 'Pending',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'in_progress': 'In Progress'
    };
    return statusMap[status] || status;
  };

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
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

  const handleApprove = async (psrId) => {
    try {
      await psrAPI.approve(psrId);
      alert('PSR approved successfully!');
      fetchPendingRequests();
      fetchApprovedRequests();
      fetchStatistics();
    } catch (err) {
      alert('Failed to approve PSR: ' + err.message);
    }
  };

  const handleReject = async (psrId) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await psrAPI.reject(psrId, reason);
        alert('PSR rejected');
        fetchPendingRequests();
        fetchApprovedRequests();
        fetchStatistics();
      } catch (err) {
        alert('Failed to reject PSR: ' + err.message);
      }
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

      {/* Procurement Team Information Sections */}
      <div className="procurement-sections">
        <div className="section-row">
          <div className="procurement-card">
            <div className="card-header">
              <h3 className="card-title">Policies & SOPs (View Only)</h3>
              <div className="card-icon">📋</div>
            </div>
            <div className="card-content">
              <ul className="card-list">
                <li>Procurement Policy Summary – 2 Pager and Complete</li>
                <li>How to Raise PR and PSR</li>
                <li>Vendor Onboarding Process</li>
              </ul>
            </div>
          </div>
          
          <div className="procurement-card">
            <div className="card-header">
              <h3 className="card-title">PR & PO Access</h3>
              <div className="card-icon">🔐</div>
            </div>
            <div className="card-content">
              <p className="card-description">PR & PO Access Report</p>
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
                <li>Deal Summary</li>
                <li>Fusion & Spotdraft Link</li>
                <li>Contract List</li>
              </ul>
            </div>
          </div>
          
          <div className="procurement-card">
            <div className="card-header">
              <h3 className="card-title">FAQs</h3>
              <div className="card-icon">❓</div>
            </div>
            <div className="card-content">
              <p className="card-description">N/A</p>
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
                <li>1. Fusion</li>
              </ul>
            </div>
          </div>
          
          <div className="procurement-card psr-card">
            <div className="card-header">
              <h3 className="card-title"><strong>PSR Creation</strong> Access</h3>
              <div className="card-icon">📝</div>
            </div>
            <div className="card-content">
              <p className="card-description">Ticket Closure Form</p>
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
          className={`console-tab ${activeTab === 'pending-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending-requests')}
        >
          Pending Requests ({stats.pending})
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
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatBudget(stats.totalBudget)}</div>
          <div className="stat-label">Total Budget</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.vendors}</div>
          <div className="stat-label">Active Vendors</div>
        </div>
      </div>

      {activeTab === 'pending-requests' && (
        <div className="console-table-section">
          <h2 className="console-table-title">Pending Procurement Requests</h2>
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="loading-spinner"></div>
              <p>Loading requests...</p>
            </div>
          ) : (
            <div className="console-table-container">
              {pendingRequests.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  <p>No pending requests found.</p>
                </div>
              ) : (
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
                    {pendingRequests.map((request) => (
                      <tr key={request._id}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <td><a href="#" className="case-link">{request.psrId || request._id}</a></td>
                        <td>{request.title}</td>
                        <td>{request.department}</td>
                        <td>{request.requestorName || request.requestor?.name || 'N/A'}</td>
                        <td>{formatDate(request.requestedDate || request.createdAt)}</td>
                        <td>{request.budget?.display || formatBudget(request.budget?.amount || 0)}</td>
                        <td><span className={getPriorityClass(request.priority)}>{formatPriority(request.priority)}</span></td>
                        <td>
                          <button 
                            className="btn-success" 
                            onClick={() => handleApprove(request._id)}
                            style={{ marginRight: '8px' }}
                          >
                            Approve
                          </button>
                          <button className="btn-warning" style={{ marginRight: '8px' }}>Review</button>
                          <button 
                            className="btn-danger" 
                            onClick={() => handleReject(request._id)}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'approved' && (
        <div className="console-table-section">
          <h2 className="console-table-title">Approved Requests</h2>
          <div className="console-table-container">
            {approvedRequests.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <p>No approved requests found.</p>
              </div>
            ) : (
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
                  {approvedRequests.map((request) => (
                    <tr key={request._id}>
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <td><a href="#" className="case-link">{request.psrId || request._id}</a></td>
                      <td>{request.title}</td>
                      <td>{request.department}</td>
                      <td>{request.requestorName || request.requestor?.name || 'N/A'}</td>
                      <td>{formatDate(request.approvedDate || request.requestedDate || request.createdAt)}</td>
                      <td>{request.budget?.display || formatBudget(request.budget?.amount || 0)}</td>
                      <td><span className="status-approved">{formatStatus(request.status)}</span></td>
                      <td>
                        <button className="btn-small">Track</button>
                        <button className="btn-small">Update</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
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
