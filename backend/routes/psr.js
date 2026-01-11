const express = require('express');
const { body, validationResult, query } = require('express-validator');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const PSR = require('../models/PSR');

// @route   GET /api/psr
// @desc    Get all PSRs with filters
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, department, priority, requestor } = req.query;
    const filter = {};

    // Requestors can only see their own PSRs
    if (req.user.role === 'requestor') {
      filter.requestor = req.user._id;
    }

    // Apply filters
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (priority) filter.priority = priority;
    if (requestor && (req.user.role === 'admin' || req.user.role === 'procurement_team')) {
      filter.requestor = requestor;
    }

    const psrs = await PSR.find(filter)
      .populate('requestor', 'name email')
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json({ psrs, count: psrs.length });
  } catch (error) {
    console.error('Get PSRs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/psr/my-requests
// @desc    Get current user's PSRs
// @access  Private
router.get('/my-requests', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { requestor: req.user._id };
    
    if (status) filter.status = status;

    const psrs = await PSR.find(filter)
      .populate('requestor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ psrs, count: psrs.length });
  } catch (error) {
    console.error('Get my requests error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/psr/pending
// @desc    Get pending PSRs (for procurement team)
// @access  Private (Procurement Team/Admin only)
router.get('/pending', authenticate, authorize('admin', 'procurement_team'), async (req, res) => {
  try {
    const psrs = await PSR.find({ status: 'pending' })
      .populate('requestor', 'name email')
      .sort({ priority: -1, createdAt: 1 });

    res.json({ psrs, count: psrs.length });
  } catch (error) {
    console.error('Get pending PSRs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/psr/approved
// @desc    Get approved PSRs
// @access  Private
router.get('/approved', authenticate, async (req, res) => {
  try {
    const filter = { status: 'approved' };
    
    if (req.user.role === 'requestor') {
      filter.requestor = req.user._id;
    }

    const psrs = await PSR.find(filter)
      .populate('requestor', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ approvedDate: -1 });

    res.json({ psrs, count: psrs.length });
  } catch (error) {
    console.error('Get approved PSRs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/psr/:id
// @desc    Get PSR by ID
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const psr = await PSR.findById(req.params.id)
      .populate('requestor', 'name email')
      .populate('approvedBy', 'name email')
      .populate('rejectedBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email')
      .populate('history.user', 'name email');

    if (!psr) {
      return res.status(404).json({ message: 'PSR not found' });
    }

    // Requestors can only view their own PSRs
    if (req.user.role === 'requestor' && psr.requestor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ psr });
  } catch (error) {
    console.error('Get PSR error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/psr
// @desc    Create new PSR
// @access  Private
router.post(
  '/',
  authenticate,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('budget.amount').isNumeric().withMessage('Budget amount must be a number'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        department,
        priority = 'medium',
        budget,
        category
      } = req.body;

      // Format budget display
      const budgetAmount = parseFloat(budget.amount || budget);
      let budgetDisplay = `INR ${budgetAmount}`;
      if (budgetAmount >= 1000000) {
        budgetDisplay = `INR ${(budgetAmount / 1000000).toFixed(1)}M`;
      } else if (budgetAmount >= 1000) {
        budgetDisplay = `INR ${(budgetAmount / 1000).toFixed(1)}K`;
      }

      const psrData = {
        title,
        description: description || '',
        department,
        requestor: req.user._id,
        requestorName: req.user.name,
        requestorEmail: req.user.email,
        priority,
        budget: {
          amount: budgetAmount,
          currency: budget.currency || 'INR',
          display: budgetDisplay
        },
        category: category || '',
        status: 'draft'
      };

      const psr = new PSR(psrData);
      
      // Add to history
      psr.history.push({
        action: 'created',
        user: req.user._id,
        userName: req.user.name,
        details: 'PSR created as draft'
      });

      await psr.save();
      
      const populatedPSR = await PSR.findById(psr._id)
        .populate('requestor', 'name email');

      res.status(201).json({
        message: 'PSR created successfully',
        psr: populatedPSR
      });
    } catch (error) {
      console.error('Create PSR error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   PUT /api/psr/:id
// @desc    Update PSR
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const psr = await PSR.findById(req.params.id);

    if (!psr) {
      return res.status(404).json({ message: 'PSR not found' });
    }

    // Only requestor can update their own PSR, and only if draft or pending
    if (req.user.role === 'requestor') {
      if (psr.requestor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (psr.status !== 'draft' && psr.status !== 'pending') {
        return res.status(400).json({ message: 'Cannot update PSR in current status' });
      }
    }

    const {
      title,
      description,
      department,
      priority,
      budget,
      category
    } = req.body;

    if (title) psr.title = title;
    if (description !== undefined) psr.description = description;
    if (department) psr.department = department;
    if (priority) psr.priority = priority;
    if (category !== undefined) psr.category = category;
    
    if (budget) {
      const budgetAmount = parseFloat(budget.amount || budget);
      let budgetDisplay = `INR ${budgetAmount}`;
      if (budgetAmount >= 1000000) {
        budgetDisplay = `INR ${(budgetAmount / 1000000).toFixed(1)}M`;
      } else if (budgetAmount >= 1000) {
        budgetDisplay = `INR ${(budgetAmount / 1000).toFixed(1)}K`;
      }
      
      psr.budget = {
        amount: budgetAmount,
        currency: budget.currency || 'INR',
        display: budgetDisplay
      };
    }

    // Add to history
    psr.history.push({
      action: 'updated',
      user: req.user._id,
      userName: req.user.name,
      details: 'PSR updated'
    });

    await psr.save();

    const updatedPSR = await PSR.findById(psr._id)
      .populate('requestor', 'name email');

    res.json({
      message: 'PSR updated successfully',
      psr: updatedPSR
    });
  } catch (error) {
    console.error('Update PSR error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/psr/:id/submit
// @desc    Submit PSR for approval
// @access  Private
router.post('/:id/submit', authenticate, async (req, res) => {
  try {
    const psr = await PSR.findById(req.params.id);

    if (!psr) {
      return res.status(404).json({ message: 'PSR not found' });
    }

    if (psr.requestor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (psr.status !== 'draft') {
      return res.status(400).json({ message: 'PSR is already submitted' });
    }

    psr.status = 'pending';
    
    // Add to history
    psr.history.push({
      action: 'submitted',
      user: req.user._id,
      userName: req.user.name,
      details: 'PSR submitted for approval'
    });

    await psr.save();

    const updatedPSR = await PSR.findById(psr._id)
      .populate('requestor', 'name email');

    res.json({
      message: 'PSR submitted successfully',
      psr: updatedPSR
    });
  } catch (error) {
    console.error('Submit PSR error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/psr/:id/approve
// @desc    Approve PSR
// @access  Private (Procurement Team/Admin only)
router.post('/:id/approve', authenticate, authorize('admin', 'procurement_team'), async (req, res) => {
  try {
    const psr = await PSR.findById(req.params.id);

    if (!psr) {
      return res.status(404).json({ message: 'PSR not found' });
    }

    if (psr.status !== 'pending') {
      return res.status(400).json({ message: 'PSR is not in pending status' });
    }

    psr.status = 'approved';
    psr.approvedBy = req.user._id;
    psr.approvedDate = new Date();

    // Add to history
    psr.history.push({
      action: 'approved',
      user: req.user._id,
      userName: req.user.name,
      details: 'PSR approved'
    });

    await psr.save();

    const updatedPSR = await PSR.findById(psr._id)
      .populate('requestor', 'name email')
      .populate('approvedBy', 'name email');

    res.json({
      message: 'PSR approved successfully',
      psr: updatedPSR
    });
  } catch (error) {
    console.error('Approve PSR error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/psr/:id/reject
// @desc    Reject PSR
// @access  Private (Procurement Team/Admin only)
router.post(
  '/:id/reject',
  authenticate,
  authorize('admin', 'procurement_team'),
  [body('reason').trim().notEmpty().withMessage('Rejection reason is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const psr = await PSR.findById(req.params.id);

      if (!psr) {
        return res.status(404).json({ message: 'PSR not found' });
      }

      if (psr.status !== 'pending') {
        return res.status(400).json({ message: 'PSR is not in pending status' });
      }

      psr.status = 'rejected';
      psr.rejectedBy = req.user._id;
      psr.rejectedDate = new Date();
      psr.rejectionReason = req.body.reason;

      // Add to history
      psr.history.push({
        action: 'rejected',
        user: req.user._id,
        userName: req.user.name,
        details: `PSR rejected: ${req.body.reason}`
      });

      await psr.save();

      const updatedPSR = await PSR.findById(psr._id)
        .populate('requestor', 'name email')
        .populate('rejectedBy', 'name email');

      res.json({
        message: 'PSR rejected',
        psr: updatedPSR
      });
    } catch (error) {
      console.error('Reject PSR error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   POST /api/psr/:id/comment
// @desc    Add comment to PSR
// @access  Private
router.post(
  '/:id/comment',
  authenticate,
  [body('comment').trim().notEmpty().withMessage('Comment is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const psr = await PSR.findById(req.params.id);

      if (!psr) {
        return res.status(404).json({ message: 'PSR not found' });
      }

      // Requestors can only comment on their own PSRs
      if (req.user.role === 'requestor' && psr.requestor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      psr.comments.push({
        user: req.user._id,
        userName: req.user.name,
        comment: req.body.comment
      });

      await psr.save();

      const updatedPSR = await PSR.findById(psr._id)
        .populate('comments.user', 'name email');

      res.json({
        message: 'Comment added successfully',
        psr: updatedPSR
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   DELETE /api/psr/:id
// @desc    Delete PSR (only draft)
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const psr = await PSR.findById(req.params.id);

    if (!psr) {
      return res.status(404).json({ message: 'PSR not found' });
    }

    if (psr.requestor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (psr.status !== 'draft') {
      return res.status(400).json({ message: 'Can only delete draft PSRs' });
    }

    await PSR.findByIdAndDelete(req.params.id);

    res.json({ message: 'PSR deleted successfully' });
  } catch (error) {
    console.error('Delete PSR error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/psr/statistics/summary
// @desc    Get PSR statistics
// @access  Private
router.get('/statistics/summary', authenticate, async (req, res) => {
  try {
    const filter = {};
    
    if (req.user.role === 'requestor') {
      filter.requestor = req.user._id;
    }

    const total = await PSR.countDocuments(filter);
    const pending = await PSR.countDocuments({ ...filter, status: 'pending' });
    const approved = await PSR.countDocuments({ ...filter, status: 'approved' });
    const rejected = await PSR.countDocuments({ ...filter, status: 'rejected' });
    const inProgress = await PSR.countDocuments({ ...filter, status: 'in_progress' });
    const draft = await PSR.countDocuments({ ...filter, status: 'draft' });

    res.json({
      total,
      pending,
      approved,
      rejected,
      inProgress,
      draft
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
