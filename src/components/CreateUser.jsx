import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI } from '../utils/api';

const CreateUser = ({ onClose, onSuccess }) => {
  const { USER_ROLES } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'requestor',
    department: '',
    employeeId: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await usersAPI.create(formData);

      // Success
      if (onSuccess) {
        onSuccess(data.user);
      }
      if (onClose) {
        onClose();
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'requestor',
        department: '',
        employeeId: ''
      });
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'Full system access, user management, all consoles';
      case USER_ROLES.PROCUREMENT_TEAM:
        return 'Procurement console, Fusion, SPOTDRAFT, approvals';
      case USER_ROLES.REQUESTOR:
        return 'Requestor console, PSR creation';
      case USER_ROLES.GUEST:
        return 'Read-only access';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content create-user-modal" onClick={(e) => e.stopPropagation()}>
        <span className="modal-close" onClick={onClose}>&times;</span>
        
        <h2 style={{ marginBottom: '24px', color: '#333' }}>Create New User</h2>

        {error && (
          <div className="error-message" style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="name" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="role" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: 'white'
              }}
            >
              <option value="requestor">Requestor</option>
              <option value="procurement_team">Procurement Team</option>
              <option value="admin">Admin</option>
              <option value="guest">Guest</option>
            </select>
            <div style={{
              marginTop: '6px',
              fontSize: '13px',
              color: '#666',
              fontStyle: 'italic'
            }}>
              {getRoleDescription(formData.role)}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="department" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., IT, Marketing, HR"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="employeeId" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Employee ID
            </label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="Optional"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '12px',
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{
                padding: '12px 24px',
                background: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
