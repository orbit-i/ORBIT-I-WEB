const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

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
    if (!user) {
      const { getAdminByEmail } = require('../utils/cmsStorage');
      const fallbackAdmin = await getAdminByEmail(cleanEmail);
      if (fallbackAdmin) {
        user = {
          id: fallbackAdmin.id,
          name: fallbackAdmin.name,
          email: fallbackAdmin.email,
          password: fallbackAdmin.password,
          role: fallbackAdmin.role || 'ADMIN',
          approved: 1,
        };
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
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
