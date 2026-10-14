const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const projectRoutes = require('./routes/projectRoutes');
const adminRoutes = require('./routes/adminRoutes');

const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// API Routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/certificates', certificateRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/admin', adminRoutes);

module.exports = apiRouter;
