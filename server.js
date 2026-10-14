require('dotenv').config();
const express = require('express');
const next = require('next');
const cors = require('cors');
const apiRouter = require('./src/server/index');
const { testConnection } = require('./src/server/config/db');

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

// Initialize Next.js app
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  // Test database connection
  await testConnection();

  // Express Middlewares
  server.use(cors());
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Mount API endpoints under /api
  server.use('/api', apiRouter);

  // Delegate all remaining routes to Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`
=====================================================
🚀 ORBIT-I Unified Server Running Successfully!
🌐 Environment: ${dev ? 'Development' : 'Production'}
🔗 URL: http://localhost:${PORT}
📡 API: http://localhost:${PORT}/api/health
=====================================================
    `);
  });
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
