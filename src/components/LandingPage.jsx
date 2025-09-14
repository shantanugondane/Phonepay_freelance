import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    console.log('Login button clicked!');
    console.log('Login function:', login);
    try {
      login();
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + error.message);
    }
  };

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleDirectLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <div className="logo-icon">📱</div>
            <span className="logo-text">PhonePe Portal</span>
          </div>
          <div className="nav-actions">
            <button className="btn-login" onClick={handleDirectLogin}>Login</button>
            <button className="btn-signup" onClick={handleGetStarted}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Streamline Your
              <span className="gradient-text"> Procurement</span>
              <br />
              Process
            </h1>
            <p className="hero-description">
              A comprehensive platform for managing procurement requests, 
              vendor relationships, and approval workflows with ease and efficiency.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary-large" onClick={handleGetStarted}>Get Started</button>
              <button className="btn-secondary-large" onClick={handleDirectLogin}>Login</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-card card-1">
                <div className="card-header"></div>
                <div className="card-content">
                  <div className="content-line"></div>
                  <div className="content-line short"></div>
                  <div className="content-line"></div>
                </div>
              </div>
              <div className="preview-card card-2">
                <div className="card-header"></div>
                <div className="card-content">
                  <div className="content-line"></div>
                  <div className="content-line short"></div>
                </div>
              </div>
              <div className="preview-card card-3">
                <div className="card-header"></div>
                <div className="card-content">
                  <div className="content-line"></div>
                  <div className="content-line short"></div>
                  <div className="content-line"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Our Platform?</h2>
            <p className="section-subtitle">
              Built for modern procurement teams with powerful features
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Fast Processing</h3>
              <p className="feature-description">
                Streamlined approval workflows that reduce processing time by 60%
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Compliant</h3>
              <p className="feature-description">
                Enterprise-grade security with full audit trails and compliance
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Real-time Analytics</h3>
              <p className="feature-description">
                Comprehensive dashboards and reporting for better decision making
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3 className="feature-title">Vendor Management</h3>
              <p className="feature-description">
                Complete vendor lifecycle management from onboarding to performance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Procurement?</h2>
            <p className="cta-description">
              Join thousands of teams already using our platform to streamline their procurement processes
            </p>
            <div className="cta-buttons">
              <button className="btn-primary-large">Start Free Trial</button>
              <button className="btn-outline-large">Schedule Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">📱</div>
                <span className="logo-text">PhonePe Portal</span>
              </div>
              <p className="footer-description">
                Empowering procurement teams with modern, efficient tools.
              </p>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Product</h4>
              <ul className="footer-links">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Status</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 PhonePe Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
