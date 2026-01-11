import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreateUser from './CreateUser';

const PeoplePage = ({ isActive }) => {
  const { hasPermission } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [modalData, setModalData] = useState({ name: '', role: '', avatar: '', email: '', phone: '' });

  const handleMemberClick = (name, role, avatar) => {
    setModalData({ name, role, avatar, email: '', phone: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCreateUserSuccess = (newUser) => {
    setShowCreateUser(false);
    // You can add a success message or refresh user list here
    alert(`User ${newUser.name} created successfully!`);
  };

  const teamMembers = [
    { name: 'Amaranat Motupalli', role: 'Lead - Services Procurement', avatar: 'AM' },
    { name: 'Rajesh Kumar', role: 'Senior Procurement Analyst', avatar: 'RK' },
    { name: 'Priya Sharma', role: 'Procurement Specialist', avatar: 'PS' },
    { name: 'Vikram Nair', role: 'Contract Manager', avatar: 'VN' },
    { name: 'Anita Gupta', role: 'Vendor Relations Manager', avatar: 'AG' },
    { name: 'Mohit Singh', role: 'Junior Procurement Officer', avatar: 'MS' },
    { name: 'Kavya Reddy', role: 'Cost Analysis Specialist', avatar: 'KR' },
    { name: 'Arjun Tiwari', role: 'Strategic Sourcing Lead', avatar: 'AT' }
  ];

  const departmentColleagues = [
    { name: 'Suresh Krishnan', role: 'Finance Manager', avatar: 'SK' },
    { name: 'Neha Mehta', role: 'Accounts Payable Lead', avatar: 'NM' },
    { name: 'Deepak Patel', role: 'Financial Analyst', avatar: 'DP' },
    { name: 'Rashmi Lal', role: 'Budget Planning Specialist', avatar: 'RL' },
    { name: 'Abhishek Sood', role: 'Tax Consultant', avatar: 'AS' },
    { name: 'Meera Joshi', role: 'Internal Audit Manager', avatar: 'MJ' }
  ];

  const isAdmin = hasPermission('canManageUsers');

  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">People</h1>
          <div className="breadcrumb">Dashboard / People / Profile</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAdmin && (
            <button
              className="btn-primary"
              onClick={() => setShowCreateUser(true)}
              style={{
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '500',
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>+</span>
              <span>Create User</span>
            </button>
          )}
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
            <input type="text" placeholder="Search for people by name, role, location and more..." />
          </div>
        </div>
      </div>

      <div className="nav-tabs">
        <a href="#" className="nav-tab active">Profile</a>
        <a href="#" className="nav-tab">Org Chart</a>
        <a href="#" className="nav-tab">List View</a>
      </div>

      <div className="profile-header">
        <div className="profile-main">
          <div className="profile-avatar">SP</div>
          <div className="profile-info">
            <h1>Shanawaz Pinjar</h1>
            <div className="profile-role">Lead - Services Procurement, PhonePe</div>
            <div className="profile-id">Employee ID: 410944</div>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-item">
            <div className="detail-label">Business Unit</div>
            <div className="detail-value">Corporate</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Department</div>
            <div className="detail-value">Finance & Accounting</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Manager</div>
            <div className="detail-value">Preetiman Roy</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">HRBP</div>
            <div className="detail-value">Siddharth Naik</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Location</div>
            <div className="detail-value">Bengaluru - Salarpuria Softzone</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Join Date</div>
            <div className="detail-value">November 22, 2021</div>
          </div>
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <span>📧</span>
            <span>shanawaz.pinjar@phonepe.com</span>
          </div>
          <div className="contact-item">
            <span>📱</span>
            <span>(+91) 8147962201</span>
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Team Members</h2>
        <a href="#" className="view-all">View All (12)</a>
      </div>
      
      <div className="tools-grid team-members-grid">
        {teamMembers.map((member, index) => (
          <div 
            key={index}
            className="tool-card"
            onClick={() => handleMemberClick(member.name, member.role, member.avatar)}
          >
            <div 
              className="profile-avatar" 
              style={{
                width: '48px', 
                height: '48px', 
                fontSize: '16px', 
                margin: '0 auto 16px',
                background: `linear-gradient(135deg, ${index % 2 === 0 ? '#FF6B6B, #FF8E8E' : '#4ECDC4, #6BDDD6'})`
              }}
            >
              {member.avatar}
            </div>
            <h3 className="tool-title">{member.name}</h3>
            <p className="tool-description">{member.role}</p>
          </div>
        ))}
      </div>

      <div className="section-header" style={{marginTop: '40px'}}>
        <h2 className="section-title">Department Colleagues</h2>
        <a href="#" className="view-all">View All (28)</a>
      </div>
      
      <div className="tools-grid">
        {departmentColleagues.map((colleague, index) => (
          <div 
            key={index}
            className="tool-card"
            onClick={() => handleMemberClick(colleague.name, colleague.role, colleague.avatar)}
          >
            <div 
              className="profile-avatar" 
              style={{
                width: '48px', 
                height: '48px', 
                fontSize: '16px', 
                margin: '0 auto 16px',
                background: `linear-gradient(135deg, ${index % 3 === 0 ? '#E91E63, #F06292' : index % 3 === 1 ? '#FF9800, #FFB74D' : '#607D8B, #78909C'})`
              }}
            >
              {colleague.avatar}
            </div>
            <h3 className="tool-title">{colleague.name}</h3>
            <p className="tool-description">{colleague.role}</p>
          </div>
        ))}
      </div>

      {/* Create User Modal - Only for Admin */}
      {showCreateUser && (
        <CreateUser
          onClose={() => setShowCreateUser(false)}
          onSuccess={handleCreateUserSuccess}
        />
      )}

      {/* Member Detail Modal */}
      {showModal && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <div className="modal-profile-avatar">{modalData.avatar}</div>
            <h2>{modalData.name}</h2>
            <p>{modalData.role}</p>
            <p>{modalData.email}</p>
            <p>{modalData.phone}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
