import React, { useState } from 'react';
import { psrAPI } from '../utils/api';

const CreatePSR = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    priority: 'medium',
    budget: {
      amount: '',
      currency: 'INR'
    },
    category: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  const departments = ['IT', 'Marketing', 'HR', 'Facilities', 'Operations', 'Finance', 'Sales'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'budgetAmount') {
      setFormData({
        ...formData,
        budget: {
          ...formData.budget,
          amount: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const psrData = {
        title: formData.title,
        description: formData.description,
        department: formData.department,
        priority: formData.priority,
        budget: {
          amount: parseFloat(formData.budget.amount) || 0,
          currency: formData.budget.currency
        },
        category: formData.category
      };

      const response = await psrAPI.create(psrData);
      
      // If not saving as draft, submit the PSR
      if (!saveAsDraft && response.psr && response.psr._id) {
        await psrAPI.submit(response.psr._id);
      }

      if (onSuccess) {
        onSuccess(response.psr);
      }
      if (onClose) {
        onClose();
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        department: '',
        priority: 'medium',
        budget: {
          amount: '',
          currency: 'INR'
        },
        category: ''
      });
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-content create-user-modal" onClick={(e) => e.stopPropagation()} style={{
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <span className="modal-close" onClick={onClose}>&times;</span>
        
        <h2 style={{ marginBottom: '24px', color: '#333' }}>Create New PSR Request</h2>

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
            <label htmlFor="title" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Request Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., New Laptop for Development Team"
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
            <label htmlFor="description" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your procurement request in detail..."
              rows="4"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif",
                resize: 'vertical'
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="department" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Department *
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
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
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="priority" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
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
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="budgetAmount" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Budget Amount (INR) *
            </label>
            <input
              type="number"
              id="budgetAmount"
              name="budgetAmount"
              value={formData.budget.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="e.g., 2500000"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '15px',
                fontFamily: "'Poppins', sans-serif"
              }}
            />
            <div style={{
              marginTop: '6px',
              fontSize: '13px',
              color: '#666',
              fontStyle: 'italic'
            }}>
              Enter amount in INR (e.g., 2500000 for INR 2.5M)
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label htmlFor="category" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333'
            }}>
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Hardware, Software, Services"
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

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={saveAsDraft}
                onChange={(e) => setSaveAsDraft(e.target.checked)}
                style={{
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '14px', color: '#666' }}>
                Save as draft (submit later)
              </span>
            </label>
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
              {isSubmitting ? 'Creating...' : (saveAsDraft ? 'Save as Draft' : 'Create & Submit')}
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

export default CreatePSR;
