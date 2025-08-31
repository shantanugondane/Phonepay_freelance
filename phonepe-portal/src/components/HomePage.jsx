import React from 'react';

const HomePage = ({ isActive }) => {
  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">Home</h1>
          <div className="breadcrumb">Dashboard / Home</div>
        </div>
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          <input type="text" placeholder="Search for people by name, role, location and more..." />
        </div>
      </div>

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
    </div>
  );
};

export default HomePage;
