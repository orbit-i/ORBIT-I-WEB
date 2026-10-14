const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All admin routes protected by authenticateToken + requireAdmin
router.use(authenticateToken, requireAdmin);

router.get('/clients', adminController.getAllClients);
router.put('/clients/:id/approve', adminController.approveClient);
router.get('/projects', adminController.getAllProjects);

module.exports = router;
