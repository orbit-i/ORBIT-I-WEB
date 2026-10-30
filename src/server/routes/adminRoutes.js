const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { loginRateLimiter } = require('../middleware/security');

// 1. Public Setup Status & First-Time Master SuperAdmin Registration
router.get('/setup-status', adminController.getSetupStatus);
router.post('/setup', loginRateLimiter, adminController.initialSuperAdminSetup);

// 2. All subsequent admin routes protected by JWT + ADMIN role verification
router.use(authenticateToken, requireAdmin);

// Account Settings & Access Control
router.put('/account', adminController.updateAdminAccount);
router.get('/accounts', adminController.getAllAdminAccounts);
router.post('/accounts', adminController.createAdminAccount);
router.put('/accounts/:id', adminController.updateAdminAccountDetails);
router.delete('/accounts/:id', adminController.deleteAdminAccount);

// Security Shield Telemetry & Cache Management
router.get('/security/stats', adminController.getSecurityTelemetry);
router.post('/security/unban', adminController.unbanIp);
router.post('/cache/clear', adminController.clearCache);

// Operations Management & Executive Overview
router.get('/overview', adminController.getAdminOverview);
router.get('/clients', adminController.getAllClients);
router.put('/clients/:id/approve', adminController.approveClient);
router.get('/projects', adminController.getAllProjects);

module.exports = router;
