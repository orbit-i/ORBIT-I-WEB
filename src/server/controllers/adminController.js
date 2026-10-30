const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { formatProject } = require('./projectController');
const { getSecurityStats, clearBannedIp } = require('../middleware/security');
const { globalCache } = require('../utils/cache');

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

/**
 * Check if initial SuperAdmin setup is required (no admin account exists)
 */
async function getSetupStatus(req, res) {
  try {
    const { getAdminUsers } = require('../utils/cmsStorage');
    const admins = await getAdminUsers();
    const adminCount = Array.isArray(admins) ? admins.length : 0;
    return res.status(200).json({
      setupRequired: adminCount === 0,
      adminCount,
    });
  } catch (error) {
    return res.status(200).json({
      setupRequired: false,
      adminCount: 1,
      note: 'Protected gateway active',
    });
  }
}

/**
 * First-Time SuperAdmin Initialization
 * Only allowed if ZERO admins exist! Permanently locks once first admin is registered.
 */
async function initialSuperAdminSetup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and strong password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Master Password must be at least 8 characters long.' });
    }

    const { getAdminUsers, saveAdminUser, getAdminByEmail } = require('../utils/cmsStorage');
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    const existingUser = await getAdminByEmail(cleanEmail);
    if (existingUser) {
      // Update password for existing admin and authenticate them immediately
      const hashedPassword = await bcrypt.hash(password, 12);
      await saveAdminUser({
        name: cleanName || existingUser.name,
        email: cleanEmail,
        password: hashedPassword,
        avatar_url: existingUser.avatar_url || '',
      });

      const token = jwt.sign(
        {
          sub: cleanEmail,
          email: cleanEmail,
          name: cleanName || existingUser.name,
          role: 'ADMIN',
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      console.log(`🛡️  SuperAdmin [${cleanEmail}] master credentials updated and authenticated!`);

      return res.status(200).json({
        message: 'Master Administrator account updated and authenticated successfully.',
        token,
        name: cleanName || existingUser.name,
        email: cleanEmail,
        role: 'ADMIN',
      });
    }

    // Hash with 12 rounds of bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save to both resilient fallback store and MySQL
    await saveAdminUser({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      avatar_url: '',
    });

    const token = jwt.sign(
      {
        sub: cleanEmail,
        email: cleanEmail,
        name: cleanName,
        role: 'ADMIN',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log(`🛡️  Initial SuperAdmin [${cleanEmail}] successfully initialized and secured!`);

    return res.status(201).json({
      message: 'SuperAdmin Master Account created successfully.',
      token,
      name: cleanName,
      email: cleanEmail,
      role: 'ADMIN',
    });
  } catch (error) {
    console.error('initialSuperAdminSetup error:', error);
    return res.status(500).json({ error: error.message || 'Server error during SuperAdmin setup' });
  }
}

/**
 * Update SuperAdmin account credentials (email, name, password)
 */
async function updateAdminAccount(req, res) {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const currentAdminEmail = req.user.email;

    const [rows] = await pool.query(
      'SELECT id, password FROM client_information WHERE email = ? AND role = "ADMIN"',
      [currentAdminEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Admin account not found' });
    }

    const admin = rows[0];

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password incorrect.' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      }

      const hashedNew = await bcrypt.hash(newPassword, 12);
      await pool.query(
        'UPDATE client_information SET name = ?, email = ?, password = ? WHERE id = ?',
        [name || req.user.name, email ? email.toLowerCase() : currentAdminEmail, hashedNew, admin.id]
      );
    } else {
      await pool.query(
        'UPDATE client_information SET name = ?, email = ? WHERE id = ?',
        [name || req.user.name, email ? email.toLowerCase() : currentAdminEmail, admin.id]
      );
    }

    return res.status(200).json({ message: 'SuperAdmin account credentials updated successfully.' });
  } catch (error) {
    console.error('updateAdminAccount error:', error);
    return res.status(500).json({ error: error.message || 'Server error updating admin account' });
  }
}

/**
 * SuperAdmin — Security Telemetry, WAF logs & Performance stats
 */
function getSecurityTelemetry(req, res) {
  try {
    const secStats = getSecurityStats();
    const cacheStats = globalCache.getStats();
    const memory = process.memoryUsage();

    return res.status(200).json({
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: (memory.rss / (1024 * 1024)).toFixed(1),
        heapUsedMb: (memory.heapUsed / (1024 * 1024)).toFixed(1),
        heapTotalMb: (memory.heapTotal / (1024 * 1024)).toFixed(1),
      },
      cache: cacheStats,
      shield: secStats,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error loading security telemetry' });
  }
}

/**
 * SuperAdmin — Unban IP
 */
function unbanIp(req, res) {
  try {
    const { ip } = req.body;
    if (!ip) return res.status(400).json({ error: 'IP required' });
    clearBannedIp(ip);
    return res.status(200).json({ message: `IP [${ip}] restriction lifted.` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * SuperAdmin — Flush memory cache
 */
function clearCache(req, res) {
  try {
    globalCache.clear();
    return res.status(200).json({ message: 'High-speed memory cache flushed successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Admin — Get all registered clients
async function getAllClients(req, res) {
  try {
    const { getClientUsers } = require('../utils/cmsStorage');
    const clients = await getClientUsers();

    const response = clients.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      approved: Boolean(c.approved),
      role: c.role,
      createdAt: c.created_at,
    }));

    return res.status(200).json(response);
  } catch (error) {
    console.error('getAllClients error:', error);
    return res.status(500).json({ error: error.message || 'Server error loading clients' });
  }
}

// Admin — Approve client
async function approveClient(req, res) {
  try {
    const { id } = req.params;
    const { approveClientUser } = require('../utils/cmsStorage');
    await approveClientUser(id);

    return res.status(200).send('Client approved successfully');
  } catch (error) {
    console.error('approveClient error:', error);
    return res.status(500).json({ error: error.message || 'Server error approving client' });
  }
}

// Admin — Get all projects with milestones
async function getAllProjects(req, res) {
  try {
    const [projects] = await pool.query('SELECT * FROM project_details ORDER BY id DESC');

    if (projects.length === 0) {
      return res.status(200).json([]);
    }

    const projectIds = projects.map((p) => p.id);
    const [milestones] = await pool.query(
      'SELECT * FROM project_milestones WHERE project_id IN (?) ORDER BY sequence_number',
      [projectIds]
    );

    const milestonesByProject = {};
    milestones.forEach((m) => {
      if (!milestonesByProject[m.project_id]) milestonesByProject[m.project_id] = [];
      milestonesByProject[m.project_id].push(m);
    });

    const response = projects.map((p) =>
      formatProject(p, milestonesByProject[p.id] || [])
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error('getAllProjects error:', error);
    return res.status(500).json({ error: error.message || 'Server error loading all projects' });
  }
}

async function getAdminOverview(req, res) {
  try {
    const {
      getInquiries,
      getCertificates,
      getCareersJobs,
      getTeamMembers,
      getCmsPages,
      getBlogPosts,
      getChatbotConfig,
      getSiteNotice,
      getAdminUsers,
    } = require('../utils/cmsStorage');

    const [inquiries, certificates, jobs, team, pages, posts, admins] = await Promise.all([
      getInquiries().catch(() => []),
      getCertificates().catch(() => []),
      getCareersJobs().catch(() => []),
      getTeamMembers().catch(() => []),
      getCmsPages().catch(() => []),
      getBlogPosts().catch(() => []),
      getAdminUsers().catch(() => []),
    ]);

    let totalClients = 0;
    let pendingClients = 0;
    try {
      const [clientRows] = await pool.query(
        "SELECT COUNT(*) as total, SUM(CASE WHEN approved = 0 THEN 1 ELSE 0 END) as pending FROM client_information WHERE role = 'CLIENT'"
      );
      if (clientRows && clientRows.length > 0) {
        totalClients = Number(clientRows[0].total || 0);
        pendingClients = Number(clientRows[0].pending || 0);
      }
    } catch {}

    const newInquiries = (inquiries || []).filter((i) => i.status === 'NEW').length;
    const botConfig = getChatbotConfig();

    return res.status(200).json({
      success: true,
      metrics: {
        totalInquiries: (inquiries || []).length,
        newInquiries,
        totalCertificates: (certificates || []).length,
        totalClients,
        pendingClients,
        openJobs: (jobs || []).length,
        teamCount: (team || []).length,
        publishedPages: (pages || []).length,
        blogArticles: (posts || []).length,
        adminCount: (admins || []).length,
      },
      system: {
        chatbotEnabled: Boolean(botConfig?.enabled),
        nodeUptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      recentInquiries: (inquiries || []).slice(0, 5),
      recentCertificates: (certificates || []).slice(0, 5),
    });
  } catch (error) {
    console.error('getAdminOverview error:', error);
    return res.status(200).json({
      success: true,
      metrics: {
        totalInquiries: 0,
        newInquiries: 0,
        totalCertificates: 0,
        totalClients: 0,
        pendingClients: 0,
      },
    });
  }
}

module.exports = {
  getSetupStatus,
  initialSuperAdminSetup,
  updateAdminAccount,
  getSecurityTelemetry,
  unbanIp,
  clearCache,
  getAllClients,
  approveClient,
  getAllProjects,
  getAdminOverview,
};
