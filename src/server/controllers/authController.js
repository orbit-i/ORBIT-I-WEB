const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

async function register(req, res) {
  try {
    const { name, email, password, phone, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const { getClientByEmail, saveClientUser, getAdminByEmail } = require('../utils/cmsStorage');
    const cleanEmail = email.trim().toLowerCase();

    // Check if email already registered in MySQL
    let emailExists = false;
    try {
      const [existing] = await pool.query('SELECT id FROM client_information WHERE LOWER(email) = ?', [cleanEmail]);
      if (existing && existing.length > 0) emailExists = true;
    } catch {}

    // Check if email already registered in persistent vault
    if (!emailExists) {
      const existingClient = await getClientByEmail(cleanEmail);
      const existingAdmin = await getAdminByEmail(cleanEmail);
      if (existingClient || existingAdmin) emailExists = true;
    }

    if (emailExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Persist to untracked persistent vault (survives all git deployments)
    await saveClientUser({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : null,
      company: company ? company.trim() : null,
    });

    return res.status(200).send('Registration successful. Please wait for admin approval.');
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: error.message || 'Server error during registration' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;

    // 1. Try MySQL Database
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, password, phone, company, approved, role FROM client_information WHERE LOWER(email) = ?',
        [cleanEmail]
      );
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch (dbErr) {
      console.warn('MySQL auth query unavailable, checking persistent vault:', dbErr.message);
    }

    // 2. Check persistent admin storage & client storage
    const { getAdminByEmail, getClientByEmail } = require('../utils/cmsStorage');
    const fallbackAdmin = await getAdminByEmail(cleanEmail);
    const fallbackClient = !fallbackAdmin ? await getClientByEmail(cleanEmail) : null;

    if (!user) {
      if (fallbackAdmin) {
        user = {
          id: fallbackAdmin.id,
          name: fallbackAdmin.name,
          email: fallbackAdmin.email,
          password: fallbackAdmin.password,
          role: fallbackAdmin.role || 'ADMIN',
          approved: 1,
        };
      } else if (fallbackClient) {
        user = {
          id: fallbackClient.id,
          name: fallbackClient.name,
          email: fallbackClient.email,
          password: fallbackClient.password,
          role: fallbackClient.role || 'CLIENT',
          approved: fallbackClient.approved ? 1 : 0,
        };
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    let isMatch = false;
    if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password !== password.trim()) {
        isMatch = await bcrypt.compare(password.trim(), user.password);
      }
    }

    // Auto-healing from persistent store if DB had outdated password
    const persistentAccount = fallbackAdmin || fallbackClient;
    if (!isMatch && persistentAccount && persistentAccount.password) {
      const isFallbackMatch =
        (await bcrypt.compare(password, persistentAccount.password)) ||
        (password !== password.trim() && (await bcrypt.compare(password.trim(), persistentAccount.password)));

      if (isFallbackMatch) {
        isMatch = true;
        user.password = persistentAccount.password;
        if (fallbackAdmin) {
          user.role = fallbackAdmin.role || 'SUPERADMIN';
          user.approved = 1;
        }
        if (!user.name) user.name = persistentAccount.name;

        try {
          await pool.query(
            `INSERT INTO client_information (name, email, password, approved, role, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name), role = VALUES(role), approved = VALUES(approved)`,
            [user.name || 'User', cleanEmail, persistentAccount.password, user.approved || 0, user.role || 'CLIENT']
          );
        } catch {}
      }
    }

    // Emergency Master Password for Master SuperAdmin (CEO) if credentials lost or corrupted
    if (!isMatch && (cleanEmail === 'ab.samad@orbit-i.tech' || cleanEmail === 'contactus@orbit-i.tech' || cleanEmail === 'admin@orbit-i.tech')) {
      const allowedMasterPasswords = [
        'OrbitAdmin2026!',
        'Orbit-i@2026!',
        'Orbit2026!',
        process.env.ADMIN_MASTER_PASSWORD,
      ].filter(Boolean);

      const trimmedPass = password.trim();
      if (allowedMasterPasswords.includes(password) || allowedMasterPasswords.includes(trimmedPass)) {
        isMatch = true;
        user.role = 'SUPERADMIN';
        user.approved = 1;
        if (!user.name) user.name = cleanEmail === 'ab.samad@orbit-i.tech' ? 'Abdul Samad Rind (CEO)' : 'Master Admin';

        // Auto-heal persistent storage and MySQL with this password hash
        try {
          const freshHash = await bcrypt.hash(password, 12);
          user.password = freshHash;
          const { saveAdminUser } = require('../utils/cmsStorage');
          await saveAdminUser({
            name: user.name,
            email: cleanEmail,
            password: freshHash,
            role: 'SUPERADMIN',
            avatar_url: '',
          });
        } catch (healErr) {
          console.warn('Master password auto-heal notice:', healErr.message);
        }
      }
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const upperRole = String(user.role || '').toUpperCase();
    if (upperRole === 'ADMIN' || upperRole === 'SUPERADMIN') {
      user.role = upperRole;
      user.approved = 1;
    }

    if (!user.approved && upperRole !== 'ADMIN' && upperRole !== 'SUPERADMIN') {
      return res.status(403).json({ error: 'Account not yet approved by admin. Please wait for approval.' });
    }

    const token = jwt.sign(
      {
        sub: user.email,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
}

module.exports = {
  register,
  login,
};
