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

    // Check if email already exists
    const [existing] = await pool.query('SELECT id FROM client_information WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO client_information (name, email, password, phone, company, approved, role, created_at)
       VALUES (?, ?, ?, ?, ?, 0, 'CLIENT', NOW())`,
      [name, email, hashedPassword, phone || null, company || null]
    );

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
      console.warn('MySQL auth query unavailable, checking fallback store:', dbErr.message);
    }

    // 2. Fallback to admin storage
    const { getAdminByEmail } = require('../utils/cmsStorage');
    const fallbackAdmin = await getAdminByEmail(cleanEmail);
    if (!user && fallbackAdmin) {
      user = {
        id: fallbackAdmin.id,
        name: fallbackAdmin.name,
        email: fallbackAdmin.email,
        password: fallbackAdmin.password,
        role: fallbackAdmin.role || 'ADMIN',
        approved: 1,
      };
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

    // Auto-healing from fallback admin store
    if (!isMatch && fallbackAdmin && fallbackAdmin.password) {
      const isFallbackMatch =
        (await bcrypt.compare(password, fallbackAdmin.password)) ||
        (password !== password.trim() && (await bcrypt.compare(password.trim(), fallbackAdmin.password)));

      if (isFallbackMatch) {
        isMatch = true;
        user.password = fallbackAdmin.password;
        user.role = 'ADMIN';
        user.approved = 1;
        if (!user.name) user.name = fallbackAdmin.name;

        try {
          await pool.query(
            `INSERT INTO client_information (name, email, password, approved, role, created_at)
             VALUES (?, ?, ?, 1, 'ADMIN', NOW())
             ON DUPLICATE KEY UPDATE password = VALUES(password), name = VALUES(name), role = 'ADMIN', approved = 1`,
            [user.name || 'Admin', cleanEmail, fallbackAdmin.password]
          );
        } catch {}
      }
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (String(user.role).toUpperCase() === 'ADMIN') {
      user.role = 'ADMIN';
      user.approved = 1;
    }

    if (!user.approved && user.role !== 'ADMIN') {
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
