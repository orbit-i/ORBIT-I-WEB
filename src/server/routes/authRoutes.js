const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { loginRateLimiter } = require('../middleware/security');

// Strict brute-force rate limiting on auth endpoints
router.post('/register', loginRateLimiter, authController.register);
router.post('/login', loginRateLimiter, authController.login);

module.exports = router;
