import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="phonepe-logo">
            <h1>PhonePe</h1>
            <span className="logo-subtitle">Procurement Portal</span>
          </div>
          <p className="login-description">
            Access your procurement tools and manage requests securely
          </p>
        </div>

        <div className="login-form">
          <form onSubmit={handleSubmit}>
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

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label htmlFor="email" style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#333'
              }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
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

            <div className="form-group" style={{ marginBottom: '24px', position: 'relative' }}>
              <label htmlFor="password" style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#333'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '45px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif"
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    color: '#666',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textTransform: 'uppercase'
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: isSubmitting || loading ? 'not-allowed' : 'pointer',
                opacity: isSubmitting || loading ? 0.7 : 1,
                fontFamily: "'Poppins', sans-serif"
              }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-info" style={{ marginTop: '24px' }}>
            <div className="role-info">
              <h4>Available Roles:</h4>
              <ul>
                <li><strong>Admin:</strong> Full system access</li>
                <li><strong>Procurement Team:</strong> Internal tools and approvals</li>
                <li><strong>Requestor:</strong> External request submission</li>
                <li><strong>Guest:</strong> Read-only access</li>
              </ul>
            </div>
            
            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: '#f5f5f5',
              borderRadius: '6px',
              fontSize: '14px',
              color: '#666'
            }}>
              <strong>New User?</strong> Contact your administrator to create an account.
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p className="footer-text">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
