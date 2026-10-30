require('dotenv').config();
const express = require('express');
const next = require('next');
const cors = require('cors');
const compression = require('compression');
const apiRouter = require('./src/server/index');
const { testConnection } = require('./src/server/config/db');
const { cyberShieldWaf, securityHeaders } = require('./src/server/middleware/security');

const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 3000;

// Initialize Next.js app
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  // Test database connection
  await testConnection();

  // 1. Trust Reverse Proxy (Cloudflare / Nginx / Hostinger)
  server.set('trust proxy', 1);

  // 2. High-Performance Gzip/Deflate Payload Compression
  server.use(compression({
    threshold: 1024, // Compress responses above 1KB
    level: 6,
  }));

  // 3. Military-Grade Security Headers (Anti-MIME, Anti-XSS, Anti-Clickjacking)
  server.use(securityHeaders);

  // 4. Express Core Middlewares with Strict Payload Caps
  server.use(cors({
    origin: true,
    credentials: true,
  }));
  server.use(express.json({ limit: '2mb' })); // Prevents memory exhaustion attacks
  server.use(express.urlencoded({ extended: true, limit: '2mb' }));

  // 5. Deep Inspection Cyber Shield WAF (SQLi, XSS, RCE, Reverse Shell, Path Traversal)
  server.use(cyberShieldWaf);

  // 6. Mount API endpoints under /api
  server.use('/api', apiRouter);

  // 7. Route /superadmin and /admin to secret portal controller
  server.get(['/superadmin', '/admin'], (req, res) => {
    return res.redirect(process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || '/control-vault-2026');
  });

  // Redirect legacy /home path permanently to root /
  server.get('/home', (req, res) => {
    return res.redirect(301, '/');
  });

  // 8. Delegate all remaining routes to Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const httpServer = server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`
=====================================================
🛡️  ORBIT-I High-Concurrency Cyber Shield Active!
🌐  Environment: ${dev ? 'Development' : 'Production'}
🔗  Public URL:  http://localhost:${PORT}
⚡  SuperAdmin:  http://localhost:${PORT}/superadmin
📡  Health API:  http://localhost:${PORT}/api/health
=====================================================
    `);
  });

  // High-concurrency socket tuning for 10,000+ requests
  httpServer.keepAliveTimeout = 65000;
  httpServer.headersTimeout = 66000;
  httpServer.maxHeadersCount = 100;
}).catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
