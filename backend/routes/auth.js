const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { ROLE_PERMISSIONS } = require('../config/permissions');

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SAML_ACS_URL = process.env.SAML_ACS_URL || `${process.env.BACKEND_PUBLIC_URL || 'http://localhost:5000'}/api/auth/saml/callback`;
const SAML_SP_ENTITY_ID = process.env.SAML_SP_ENTITY_ID || `${process.env.BACKEND_PUBLIC_URL || 'http://localhost:5000'}/api/auth/saml/metadata`;
const SAML_IDP_ENTRY_POINT = process.env.SAML_IDP_ENTRY_POINT || '';
const SAML_IDP_ISSUER = process.env.SAML_IDP_ISSUER || '';
const SAML_IDP_CERT = process.env.SAML_IDP_CERT || '';
const SAML_DEFAULT_ROLE = process.env.SAML_DEFAULT_ROLE || 'requestor';

const isSamlConfigured = () => {
  return Boolean(SAML_IDP_ENTRY_POINT && SAML_IDP_ISSUER && SAML_IDP_CERT);
};

if (isSamlConfigured() && !passport._strategy('saml')) {
  passport.use('saml', new SamlStrategy(
    {
      callbackUrl: SAML_ACS_URL,
      entryPoint: SAML_IDP_ENTRY_POINT,
      issuer: SAML_SP_ENTITY_ID,
      identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
      cert: SAML_IDP_CERT,
      acceptedClockSkewMs: -1,
      disableRequestedAuthnContext: true,
    },
    async (profile, done) => {
      try {
        const email = (profile.nameID || '').toLowerCase();
        if (!email) return done(new Error('SAML response did not contain NameID/email'));

        let user = await User.findOne({ email });
        if (!user) {
          const fallbackName = profile.displayName || profile.cn || email.split('@')[0];
          const randomPassword = crypto.randomBytes(24).toString('hex');
          user = new User({
            email,
            password: randomPassword,
            name: fallbackName,
            role: SAML_DEFAULT_ROLE,
            isActive: true,
          });
          await user.save();
        }

        if (!user.isActive) {
          return done(new Error('User account is inactive'));
        }

        user.lastLogin = new Date();
        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role = 'guest', department, employeeId } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create user
      const user = new User({
        email,
        password,
        name,
        role,
        department,
        employeeId
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Get user data with permissions
      const userData = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: ROLE_PERMISSIONS[user.role] || {},
        picture: user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=5f259f&color=fff`
      };

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: userData
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is inactive. Please contact administrator' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Get user data with permissions
      const userData = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: ROLE_PERMISSIONS[user.role] || {},
        picture: user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=5f259f&color=fff`,
        loginTime: new Date().toISOString()
      };

      res.json({
        message: 'Login successful',
        token,
        user: userData
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login', error: error.message });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  try {
    const userData = {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      permissions: ROLE_PERMISSIONS[req.user.role] || {},
      picture: req.user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.user.name)}&background=5f259f&color=fff`,
      department: req.user.department,
      employeeId: req.user.employeeId
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', authenticate, (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing token
  // But we can log the logout action here if needed
  res.json({ message: 'Logged out successfully' });
});

// @route   GET /api/auth/saml/login
// @desc    Initiate SAML SSO login
// @access  Public
router.get('/saml/login', (req, res, next) => {
  if (!isSamlConfigured()) {
    return res.status(503).json({
      message: 'SAML is not configured. Set SAML_IDP_ENTRY_POINT, SAML_IDP_ISSUER, and SAML_IDP_CERT.',
    });
  }
  passport.authenticate('saml')(req, res, next);
});

// @route   POST /api/auth/saml/callback
// @desc    SAML Assertion Consumer Service (ACS) endpoint
// @access  Public
router.post('/saml/callback', (req, res, next) => {
  if (!isSamlConfigured()) {
    return res.status(503).json({
      message: 'SAML is not configured. Set SAML_IDP_ENTRY_POINT, SAML_IDP_ISSUER, and SAML_IDP_CERT.',
    });
  }

  passport.authenticate('saml', async (err, user) => {
    if (err || !user) {
      return res.status(401).send(`SAML authentication failed: ${err?.message || 'Unknown error'}`);
    }

    const token = generateToken(user._id);
    const safeFrontendUrl = FRONTEND_URL.replace(/\/$/, '');
    const redirectUrl = `${safeFrontendUrl}/login?sso=success&token=${encodeURIComponent(token)}`;
    return res.send(`
      <!doctype html>
      <html>
      <head><meta charset="utf-8"><title>SSO Login</title></head>
      <body>
        <script>
          localStorage.setItem('phonepe_token', ${JSON.stringify(token)});
          window.location.href = ${JSON.stringify(redirectUrl)};
        </script>
        <p>SSO login successful. Redirecting...</p>
      </body>
      </html>
    `);
  })(req, res, next);
});

// @route   GET /api/auth/saml/metadata
// @desc    Service Provider metadata/details endpoint
// @access  Public
router.get('/saml/metadata', (req, res) => {
  if (!isSamlConfigured()) {
    return res.status(503).json({
      message: 'SAML is not configured. Set SAML_IDP_ENTRY_POINT, SAML_IDP_ISSUER, and SAML_IDP_CERT.',
    });
  }
  res.json({
    protocol: 'SAML 2.0',
    entityId: SAML_SP_ENTITY_ID,
    acsUrl: SAML_ACS_URL,
    idpEntityId: SAML_IDP_ISSUER,
    idpEntryPoint: SAML_IDP_ENTRY_POINT,
    nameIdFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    attributeMapping: {
      NameID: 'email',
      displayNameOrCN: 'name',
      defaultRole: SAML_DEFAULT_ROLE,
    },
  });
});

module.exports = router;
