import React, { useState } from 'react';

const DashboardConsole = ({ isActive }) => {
  const [activeView, setActiveView] = useState('overview');

  const overviewStats = [
    { label: 'Total Requests', value: '47', change: '+12%', trend: 'up' },
    { label: 'Pending Approval', value: '8', change: '-3%', trend: 'down' },
    { label: 'Approved This Month', value: '23', change: '+8%', trend: 'up' },
    { label: 'Total Budget', value: 'INR 45.2M', change: '+15%', trend: 'up' }
  ];

  const recentActivity = [
    { id: 'ACT-001', action: 'Request Approved', request: 'REQ-002', user: 'Amaranath Motupalli', time: '2 hours ago', type: 'approval' },
    { id: 'ACT-002', action: 'New Request Submitted', request: 'REQ-007', user: 'Mike Johnson', time: '4 hours ago', type: 'submission' },
    { id: 'ACT-003', action: 'Vendor Contract Signed', request: 'REQ-003', user: 'Brian Sequeria', time: '6 hours ago', type: 'contract' },
    { id: 'ACT-004', action: 'Request Rejected', request: 'REQ-004', user: 'Kishan Patel', time: '8 hours ago', type: 'rejection' }
  ];

  const departmentStats = [
    { department: 'IT', requests: 12, approved: 8, pending: 3, budget: 'INR 15.2M' },
    { department: 'Marketing', requests: 8, approved: 6, pending: 2, budget: 'INR 8.5M' },
    { department: 'Facilities', requests: 6, approved: 4, pending: 2, budget: 'INR 12.1M' },
    { department: 'HR', requests: 4, approved: 3, pending: 1, budget: 'INR 3.8M' },
    { department: 'Operations', requests: 3, approved: 2, pending: 1, budget: 'INR 5.6M' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'approval':
        return '✅';
      case 'submission':
        return '📝';
      case 'contract':
        return '📋';
      case 'rejection':
        return '❌';
      default:
        return '📄';
    }
  };

  const getActivityClass = (type) => {
    switch (type) {
      case 'approval':
        return 'activity-approval';
      case 'submission':
        return 'activity-submission';
      case 'contract':
        return 'activity-contract';
      case 'rejection':
        return 'activity-rejection';
      default:
        return 'activity-default';
    }
  };

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">Dashboard for Status</h1>
          <div className="breadcrumb">Dashboard / Status Overview</div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">Export Report</button>
          <button className="btn-primary">Refresh Data</button>
        </div>
      </div>

      <div className="console-tabs">
        <button 
          className={`console-tab ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          Overview
        </button>
        <button 
          className={`console-tab ${activeView === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveView('departments')}
        >
          Department Analytics
        </button>
        <button 
          className={`console-tab ${activeView === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveView('activity')}
        >
          Recent Activity
        </button>
      </div>

      {activeView === 'overview' && (
        <>
          <div className="dashboard-stats">
            {overviewStats.map((stat, index) => (
              <div key={index} className="stat-card-large">
                <div className="stat-content">
                  <div className="stat-number-large">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className={`stat-change ${stat.trend}`}>
                    {stat.change} from last month
                  </div>
                </div>
                <div className="stat-icon">
                  {stat.trend === 'up' ? '📈' : '📉'}
                </div>
              </div>
            ))}
          </div>

          <div className="dashboard-charts">
            <div className="chart-container">
              <h3>Request Status Distribution</h3>
              <div className="chart-placeholder">
                <div className="chart-bar" style={{height: '60%', background: '#4ECDC4'}}>
                  <span>Approved (60%)</span>
                </div>
                <div className="chart-bar" style={{height: '25%', background: '#FF6B6B'}}>
                  <span>Pending (25%)</span>
                </div>
                <div className="chart-bar" style={{height: '15%', background: '#FFB74D'}}>
                  <span>In Progress (15%)</span>
                </div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Monthly Trend</h3>
              <div className="trend-chart">
                <div className="trend-line">
                  <div className="trend-point" style={{bottom: '20%'}}></div>
                  <div className="trend-point" style={{bottom: '35%'}}></div>
                  <div className="trend-point" style={{bottom: '50%'}}></div>
                  <div className="trend-point" style={{bottom: '65%'}}></div>
                  <div className="trend-point" style={{bottom: '80%'}}></div>
                </div>
                <div className="trend-labels">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'departments' && (
        <div className="console-table-section">
          <h2 className="console-table-title">Department-wise Analytics</h2>
          <div className="console-table-container">
            <table className="console-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Requests</th>
                  <th>Approved</th>
                  <th>Pending</th>
                  <th>Total Budget</th>
                  <th>Approval Rate</th>
                </tr>
              </thead>
              <tbody>
                {departmentStats.map((dept, index) => (
                  <tr key={index}>
                    <td><strong>{dept.department}</strong></td>
                    <td>{dept.requests}</td>
                    <td><span className="status-approved">{dept.approved}</span></td>
                    <td><span className="status-pending">{dept.pending}</span></td>
                    <td>{dept.budget}</td>
                    <td>
                      <div className="approval-rate">
                        <div className="rate-bar">
                          <div 
                            className="rate-fill" 
                            style={{width: `${(dept.approved / dept.requests) * 100}%`}}
                          ></div>
                        </div>
                        <span>{Math.round((dept.approved / dept.requests) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === 'activity' && (
        <div className="activity-feed">
          <h2 className="console-table-title">Recent Activity Feed</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className={`activity-item ${getActivityClass(activity.type)}`}>
                <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-details">
                    <span className="activity-request">{activity.request}</span> by <span className="activity-user">{activity.user}</span>
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardConsole;
