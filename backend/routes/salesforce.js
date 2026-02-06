const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const salesforceService = require('../services/salesforce');

/**
 * @route   GET /api/salesforce/cases
 * @desc    Get all cases from Salesforce
 * @access  Private (Procurement Team and Admin only)
 * 
 * Query Parameters:
 * - status: Filter by status
 * - caseNumber: Filter by case number
 * - requestorName: Filter by requestor name
 * - vendorName: Filter by vendor name
 */
router.get('/cases', authenticate, authorize(['procurement_team', 'admin']), async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      caseNumber: req.query.caseNumber,
      requestorName: req.query.requestorName,
      vendorName: req.query.vendorName,
    };

    // Remove undefined filters
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    const result = await salesforceService.getCases(filters);

    res.json({
      success: true,
      cases: result.cases,
      totalSize: result.totalSize,
      count: result.cases.length,
    });
  } catch (error) {
    console.error('Salesforce cases error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch cases from Salesforce',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * @route   GET /api/salesforce/cases/:caseNumber
 * @desc    Get a single case by case number
 * @access  Private (Procurement Team and Admin only)
 */
router.get('/cases/:caseNumber', authenticate, authorize(['procurement_team', 'admin']), async (req, res) => {
  try {
    const caseNumber = req.params.caseNumber;
    const caseData = await salesforceService.getCaseByNumber(caseNumber);

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: `Case ${caseNumber} not found in Salesforce`,
      });
    }

    res.json({
      success: true,
      case: caseData,
    });
  } catch (error) {
    console.error('Salesforce case error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch case from Salesforce',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * @route   GET /api/salesforce/test
 * @desc    Test Salesforce connection
 * @access  Private (Admin only)
 */
router.get('/test', authenticate, authorize(['admin']), async (req, res) => {
  try {
    // Try to authenticate
    await salesforceService.authenticate();
    
    // Try to fetch a few cases
    const result = await salesforceService.getCases();
    
    res.json({
      success: true,
      message: 'Salesforce connection successful',
      instanceUrl: salesforceService.instanceUrl,
      totalCases: result.totalSize,
      sampleCases: result.cases.slice(0, 3), // Return first 3 cases as sample
    });
  } catch (error) {
    console.error('Salesforce test error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to connect to Salesforce',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

module.exports = router;
