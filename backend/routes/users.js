const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
const { ROLE_PERMISSIONS } = require('../config/permissions');

// @route   POST /api/users
// @desc    Create new user (Admin only)
// @access  Private (Admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').isIn(['admin', 'procurement_team', 'requestor', 'guest']).withMessage('Valid role is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name, role, department, employeeId } = req.body;

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

      // Get user data with permissions (excluding password)
      const userData = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        permissions: ROLE_PERMISSIONS[user.role] || {},
        department: user.department,
        employeeId: user.employeeId,
        isActive: user.isActive,
        createdAt: user.createdAt
      };

      res.status(201).json({
        message: 'User created successfully',
        user: userData
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    const filter = {};

    if (role) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin only)
// @access  Private (Admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      ...user.toObject(),
      permissions: ROLE_PERMISSIONS[user.role] || {}
    };

    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private (Admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { name, role, department, employeeId, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (role) user.role = role;
    if (department !== undefined) user.department = department;
    if (employeeId !== undefined) user.employeeId = employeeId;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role] || {},
      department: user.department,
      employeeId: user.employeeId,
      isActive: user.isActive
    };

    res.json({
      message: 'User updated successfully',
      user: userData
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
