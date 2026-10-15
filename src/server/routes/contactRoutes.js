const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { contactRateLimiter } = require('../middleware/security');

// Protect inquiry submissions against spam and automated bots
router.post('/', contactRateLimiter, contactController.submitInquiry);

module.exports = router;
