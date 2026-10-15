import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/server/config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Master Password must be at least 8 characters long.' }, { status: 400 });
    }

    // Verify no admins exist
    let adminCount = 0;
    try {
      const [rows] = await pool.query("SELECT COUNT(*) as count FROM client_information WHERE role = 'ADMIN'");
      adminCount = Number(rows[0]?.count || 0);
    } catch {
      adminCount = 0;
    }

    if (adminCount > 0) {
      return NextResponse.json({
        error: 'Security Lockout: Initial SuperAdmin setup has already been completed. Please use SuperAdmin Login.',
      }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      await pool.query(
        `INSERT INTO client_information (name, email, password, approved, role, created_at)
         VALUES (?, ?, ?, 1, 'ADMIN', NOW())`,
        [name.trim(), email.trim().toLowerCase(), hashedPassword]
      );
    } catch (dbErr) {
      console.error('DB Insert error during setup:', dbErr.message);
    }

    const token = jwt.sign(
      {
        sub: email.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: 'ADMIN',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return NextResponse.json({
      message: 'SuperAdmin account initialized successfully.',
      token,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'ADMIN',
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ error: error.message || 'Server error during setup' }, { status: 500 });
  }
}
