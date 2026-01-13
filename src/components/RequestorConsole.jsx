import React, { useState, useEffect } from 'react';
import { psrAPI } from '../utils/api';
import CreatePSR from './CreatePSR';

const RequestorConsole = ({ isActive }) => {
  const [activeTab, setActiveTab] = useState('my-requests');
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreatePSR, setShowCreatePSR] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    inProgress: 0
  });

  useEffect(() => {
    if (isActive) {
      fetchMyRequests();
      fetchStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, activeTab]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      let status = null;
      if (activeTab === 'draft') status = 'draft';
      else if (activeTab === 'approved') status = 'approved';
      
      const response = await psrAPI.getMyRequests(status);
      setMyRequests(response.psrs || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests. Please try again.');
      setMyRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await psrAPI.getStatistics();
      setStats({
        total: response.total || 0,
        pending: response.pending || 0,
        approved: response.approved || 0,
        inProgress: response.inProgress || 0
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  const formatPriority = (priority) => {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'in_progress':
      case 'in progress':
        return 'status-inprogress';
      case 'rejected':
        return 'status-rejected';
      case 'draft':
        return 'status-draft';
      default:
        return 'status-pending';
    }
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

  const handleNewRequest = () => {
    setShowCreatePSR(true);
  };

  const handlePSRCreated = (newPSR) => {
    setShowCreatePSR(false);
    // Refresh the list
    fetchMyRequests();
    fetchStatistics();
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
          onClick={handleNewRequest}
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
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.approved}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
      </div>

      <div className="console-table-section">
        <h2 className="console-table-title">My Procurement Requests</h2>
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
            {myRequests.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <p>No requests found. Click "+ New Request" to create one.</p>
              </div>
            ) : (
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
                  {myRequests.map((request) => (
                    <tr key={request._id}>
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                      <td><a href="#" className="case-link">{request.psrId || request._id}</a></td>
                      <td>{request.title}</td>
                      <td>{request.department}</td>
                      <td>{formatDate(request.requestedDate || request.createdAt)}</td>
                      <td>{request.budget?.display || `INR ${request.budget?.amount || 0}`}</td>
                      <td><span className={getStatusClass(request.status)}>{formatStatus(request.status)}</span></td>
                      <td><span className={getPriorityClass(request.priority)}>{formatPriority(request.priority)}</span></td>
                      <td>
                        <button className="btn-small">View</button>
                        {(request.status === 'draft' || request.status === 'pending') && (
                          <button className="btn-small">Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Create PSR Modal */}
      {showCreatePSR && (
        <CreatePSR
          onClose={() => setShowCreatePSR(false)}
          onSuccess={handlePSRCreated}
        />
      )}
    </div>
  );
};

export default RequestorConsole;
