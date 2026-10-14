const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Client routes
router.get('/my', authenticateToken, projectController.getMyProjects);
router.get('/:id', authenticateToken, projectController.getProject);

// Admin routes
router.post('/admin/create', authenticateToken, requireAdmin, projectController.createProject);
router.post('/admin/milestone', authenticateToken, requireAdmin, projectController.addMilestone);
router.patch('/admin/:id/progress', authenticateToken, requireAdmin, projectController.updateProgress);

module.exports = router;
