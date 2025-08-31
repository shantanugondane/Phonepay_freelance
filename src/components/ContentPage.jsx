import React from 'react';

const ContentPage = ({ isActive }) => {
  return (
    <div className={`page-content ${isActive ? 'active' : ''}`}>
      <div className="header">
        <div>
          <h1 className="page-title">Content</h1>
          <div className="breadcrumb">Dashboard / Content</div>
        </div>
      </div>
      <div className="section-header">
        <h2 className="section-title">Company Documents</h2>
      </div>
      <ul style={{listStyle: 'none', padding: 0, marginBottom: '32px'}}>
        <li><a href="#" style={{color: 'var(--primary-color)', textDecoration: 'underline'}}>Employee Handbook.pdf</a></li>
        <li><a href="#" style={{color: 'var(--primary-color)', textDecoration: 'underline'}}>Leave Policy.docx</a></li>
        <li><a href="#" style={{color: 'var(--primary-color)', textDecoration: 'underline'}}>Expense Claim Form.xlsx</a></li>
      </ul>
      <div className="section-header">
        <h2 className="section-title">Announcements</h2>
      </div>
      <div style={{background: 'var(--primary-lightest)', borderRadius: '10px', padding: '16px', marginBottom: '12px'}}>
        <strong>New Remote Work Policy</strong><br />
        We are excited to announce our new flexible remote work policy effective from next month.
      </div>
      <div style={{background: 'var(--primary-lightest)', borderRadius: '10px', padding: '16px'}}>
        <strong>Quarterly Townhall</strong><br />
        Join us for the company-wide townhall on July 15th at 4:00 PM in the main auditorium.
      </div>
    </div>
  );
};

export default ContentPage;
