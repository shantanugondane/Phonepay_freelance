import React, { useState, useEffect } from 'react';
import { psrAPI, salesforceAPI } from '../utils/api';

const ProcurementConsole = ({ isActive }) => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [contractCases, setContractCases] = useState([]);
  const [contractsSearch, setContractsSearch] = useState('');
  const [contractsPage, setContractsPage] = useState(1);
  const contractsPageSize = 30;
  const [loading, setLoading] = useState(true);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contractsError, setContractsError] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    totalBudget: 0,
    vendors: 15 // Placeholder for now
  });

  useEffect(() => {
    if (!isActive) return;

    if (activeTab === 'contracts') {
      fetchContractCases();
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

  const fetchContractCases = async () => {
    try {
      setContractsLoading(true);
      setContractsError('');
      const response = await salesforceAPI.getCases();
      const cases = response.cases || [];
      setContractCases(cases);
      setContractsPage(1);
    } catch (err) {
      console.error('Error fetching Salesforce contract cases:', err);
      setContractsError(err.message || 'Failed to load contract list from Salesforce.');
      setContractCases([]);
    } finally {
      setContractsLoading(false);
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

  // Derived data for Contract List (search + pagination)
  const filteredContractCases = contractCases.filter((c) => {
    if (!contractsSearch.trim()) return true;
    const term = contractsSearch.toLowerCase();
    return (
      (c.caseNumber || '').toLowerCase().includes(term) ||
      (c.title || '').toLowerCase().includes(term) ||
      (c.buyerName || '').toLowerCase().includes(term) ||
      (c.vendorName || '').toLowerCase().includes(term)
    );
  });

  const totalContracts = filteredContractCases.length;
  const totalContractsPages = Math.max(1, Math.ceil(totalContracts / contractsPageSize));
  const currentContractsPage = Math.min(contractsPage, totalContractsPages);
  const contractsStartIndex = (currentContractsPage - 1) * contractsPageSize;
  const contractsEndIndex = contractsStartIndex + contractsPageSize;
  const paginatedContractCases = filteredContractCases.slice(contractsStartIndex, contractsEndIndex);

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">Procurement Home Console</h1>
          <div className="breadcrumb">Dashboard / Procurement Console</div>
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

      {/* Pending Requests table */}
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

      {/* Approved Requests table */}
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

      {/* Vendor Management placeholder */}
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
      {/* Contract List from Salesforce */}
      {activeTab === 'contracts' && (
        <div className="console-table-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 className="console-table-title" style={{ marginBottom: 0 }}>
              Contract List (Salesforce){' '}
              {totalContracts > 0 && (
                <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 500 }}>
                  — {totalContracts} contracts
                </span>
              )}
            </h2>
            <div className="search-bar" style={{ maxWidth: 320 }}>
              <span role="img" aria-label="search">🔍</span>
              <input
                type="text"
                placeholder="Search by case, title, buyer, vendor"
                value={contractsSearch}
                onChange={(e) => {
                  setContractsSearch(e.target.value);
                  setContractsPage(1);
                }}
              />
            </div>
          </div>
          {contractsError && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              {contractsError}
            </div>
          )}
          {contractsLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div className="loading-spinner"></div>
              <p>Loading contracts from Salesforce...</p>
            </div>
          ) : (
            <div className="console-table-container">
              {totalContracts === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  <p>No contracts found from Salesforce.</p>
                </div>
              ) : (
                <>
                  <table className="console-table">
                    <thead>
                      <tr>
                        <th>Case Number</th>
                        <th>Title</th>
                        <th>Buyer</th>
                        <th>Vendor</th>
                        <th>Ticket Type</th>
                        <th>Contract Start</th>
                        <th>Expiry Status</th>
                        <th>TPI Applicability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedContractCases.map((c) => (
                        <tr key={c.salesforceId}>
                          <td>{c.caseNumber}</td>
                          <td>{c.title}</td>
                          <td>{c.buyerName || 'N/A'}</td>
                          <td>{c.vendorName || 'N/A'}</td>
                          <td>{c.ticketType || 'N/A'}</td>
                          <td>{formatDate(c.contractStartDate || c.startDateTime)}</td>
                          <td>{c.expiryStatus || 'N/A'}</td>
                          <td>{c.tpiApplicability || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {totalContracts > contractsPageSize && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                      <div style={{ fontSize: '0.9rem', color: '#000', fontWeight: 600 }}>
                        Showing {contractsStartIndex + 1}–
                        {Math.min(contractsEndIndex, totalContracts)} of {totalContracts} contracts
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          className="btn-secondary"
                          disabled={currentContractsPage === 1}
                          onClick={() => setContractsPage((p) => Math.max(1, p - 1))}
                        >
                          Previous
                        </button>
                        <span style={{ color: '#000', fontSize: '0.9rem', fontWeight: 600 }}>
                          Page {currentContractsPage} of {totalContractsPages}
                        </span>
                        <button
                          className="btn-secondary"
                          disabled={currentContractsPage === totalContractsPages}
                          onClick={() =>
                            setContractsPage((p) => Math.min(totalContractsPages, p + 1))
                          }
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProcurementConsole;
