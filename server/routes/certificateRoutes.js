const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public route to verify certificate by code
router.get('/verify/:code', certificateController.verifyCertificate);

// Admin route to create certificate
router.post('/admin/create', authenticateToken, requireAdmin, certificateController.createCertificate);

module.exports = router;
