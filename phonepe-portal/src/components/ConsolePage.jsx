import React, { useState } from 'react';

const ConsolePage = ({ isActive }) => {
  const [activeView, setActiveView] = useState('buyer');

  const buyerData = [
    { caseNumber: 'PSR-09103', subject: 'PSR-Hexaware New Price Negotiation-#PSR-09103', category: 'F&I, HR,CX & others', closedDate: '23/07/2025', buyerName: 'Amaranath Motupalli', grandTotal: 'INR 762.77M', status: 'Closed' },
    { caseNumber: 'PSR-09225', subject: 'PSR-SS 2.0 (CWD) BOM commercial closure-#PSR-09225', category: 'Marketing', closedDate: '29/07/2025', buyerName: 'Ritij Chaudhary', grandTotal: 'INR 32.23M', status: 'Closed' },
    { caseNumber: 'PSR-09362', subject: 'PSR-Renewal PO2410112720-#PSR-09362', category: 'IT (S/W, H/W, Services) & IT Related', closedDate: '25/07/2025', buyerName: 'Kishan Patel', grandTotal: 'INR 3.98M', status: 'Closed' },
    { caseNumber: 'PSR-09426', subject: 'PSR-Insurance POC for Pune-#PSR-09426', category: 'F&I, HR,CX & others', closedDate: '28/07/2025', buyerName: 'Shanawaz Pinjar', grandTotal: 'INR 4.80M', status: 'Closed' },
    { caseNumber: 'PSR-09546', subject: 'PSR-SMS-Valuefirst Rate Negotiation-#PSR-09546', category: 'Marketing', closedDate: '29/07/2025', buyerName: 'Brian Sequeria', grandTotal: 'INR 91.67M', status: 'Closed' },
    { caseNumber: 'PSR-09547', subject: 'PSR-SMS - Kaleyra Rate Negotiation-#PSR-09547', category: 'Marketing', closedDate: '29/07/2025', buyerName: 'Brian Sequeria', grandTotal: 'INR 74.06M', status: 'Closed' },
    { caseNumber: 'PSR-09595', subject: 'PSR-Mumbai New Office Commercial-#PSR-09595', category: 'F&I, HR,CX & others', closedDate: '23/07/2025', buyerName: 'Amaranath Motupalli', grandTotal: 'INR 266.09M', status: 'Closed' }
  ];

  const requestorData = [
    { ticketId: 'REQ-001', requestTitle: 'New Laptop Procurement for Development Team', department: 'IT', requestDate: '25/07/2025', assignedTo: 'Kishan Patel', estimatedBudget: 'INR 2.5M', status: 'Pending', priority: 'High' },
    { ticketId: 'REQ-002', requestTitle: 'Office Furniture for New Branch', department: 'Facilities', requestDate: '26/07/2025', assignedTo: 'Amaranath Motupalli', estimatedBudget: 'INR 1.8M', status: 'Approved', priority: 'Medium' },
    { ticketId: 'REQ-003', requestTitle: 'Marketing Campaign Software License', department: 'Marketing', requestDate: '27/07/2025', assignedTo: 'Brian Sequeria', estimatedBudget: 'INR 0.8M', status: 'In Progress', priority: 'High' },
    { ticketId: 'REQ-004', requestTitle: 'Cloud Infrastructure Services', department: 'IT', requestDate: '28/07/2025', assignedTo: 'Ritij Chaudhary', estimatedBudget: 'INR 5.2M', status: 'Pending', priority: 'Low' },
    { ticketId: 'REQ-005', requestTitle: 'Employee Training Program', department: 'HR', requestDate: '29/07/2025', assignedTo: 'Shanawaz Pinjar', estimatedBudget: 'INR 1.2M', status: 'Approved', priority: 'Medium' },
    { ticketId: 'REQ-006', requestTitle: 'Security System Installation', department: 'Facilities', requestDate: '30/07/2025', assignedTo: 'Amaranath Motupalli', estimatedBudget: 'INR 3.5M', status: 'Pending', priority: 'High' },
    { ticketId: 'REQ-007', requestTitle: 'Customer Support Software', department: 'Operations', requestDate: '30/07/2025', assignedTo: 'Kishan Patel', estimatedBudget: 'INR 0.9M', status: 'In Progress', priority: 'Medium' }
  ];

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'closed':
      case 'approved':
        return 'status-closed';
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
      <div className="console-header">
        <div className="console-tabs">
          <a 
            href="#" 
            className={`console-tab ${activeView === 'buyer' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveView('buyer');
            }}
          >
            DASHBOARD FOR BUYER
          </a>
          <a 
            href="#" 
            className={`console-tab ${activeView === 'requestor' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveView('requestor');
            }}
          >
            DASHBOARD FOR REQUESTOR
          </a>
        </div>
        <div className="console-info">
          <div className="console-title">
            <div className="console-icon">👁️</div>
            <div>
              <div className="console-subtitle">Dashboard</div>
              <div className="console-main-title">
                {activeView === 'buyer' ? 'Dashboards for Buyer' : 'Dashboards for Requestor'}
              </div>
            </div>
          </div>
          <div className="console-meta">
            <div className="console-date">As of 30-Jul-2025, 7:56 pm</div>
            <div className="console-user">Viewing as Shanawaz Pinjar</div>
          </div>
          <button className="console-refresh-btn">
            Refresh
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </div>

      {/* Buyer Dashboard */}
      {activeView === 'buyer' && (
        <div className="console-view active">
          <div className="console-table-section">
            <h2 className="console-table-title">Commercial Tickets Approved Last Week</h2>
            <div className="console-table-container">
              <table className="console-table">
                <thead>
                  <tr>
                    <th>Case Number</th>
                    <th>Subject</th>
                    <th>Category</th>
                    <th>Closed Date</th>
                    <th>Buyer Name</th>
                    <th>Grand Total Final Order</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {buyerData.map((row, index) => (
                    <tr key={index}>
                      <td><a href="#" className="case-link">{row.caseNumber}</a></td>
                      <td>{row.subject}</td>
                      <td>{row.category}</td>
                      <td>{row.closedDate}</td>
                      <td>{row.buyerName}</td>
                      <td>{row.grandTotal}</td>
                      <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="console-footer">
              <div className="console-timestamp">As of 30-Jul-2025, 7:56 pm</div>
            </div>
          </div>
        </div>
      )}

      {/* Requestor Dashboard */}
      {activeView === 'requestor' && (
        <div className="console-view active">
          <div className="console-table-section">
            <h2 className="console-table-title">My Request Tickets</h2>
            <div className="console-table-container">
              <table className="console-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Request Title</th>
                    <th>Department</th>
                    <th>Request Date</th>
                    <th>Assigned To</th>
                    <th>Estimated Budget</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {requestorData.map((row, index) => (
                    <tr key={index}>
                      <td><a href="#" className="case-link">{row.ticketId}</a></td>
                      <td>{row.requestTitle}</td>
                      <td>{row.department}</td>
                      <td>{row.requestDate}</td>
                      <td>{row.assignedTo}</td>
                      <td>{row.estimatedBudget}</td>
                      <td><span className={getStatusClass(row.status)}>{row.status}</span></td>
                      <td><span className={getPriorityClass(row.priority)}>{row.priority}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="console-footer">
              <div className="console-timestamp">As of 30-Jul-2025, 7:56 pm</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsolePage;
