const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { ROLE_PERMISSIONS } = require('../config/permissions');

const router = express.Router();

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

module.exports = router;
