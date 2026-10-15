import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/server/config/db';
import { getAdminByEmail } from '@/server/utils/cmsStorage';

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = null;

    // 1. Attempt lookup in MySQL Database
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, password, phone, company, approved, role FROM client_information WHERE LOWER(email) = ?',
        [cleanEmail]
      );
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } catch (dbErr) {
      console.warn('MySQL auth query unavailable, checking secure fallback storage:', dbErr.message);
    }

    // 2. Fallback to local admin store if DB is down or user not in DB
    if (!user) {
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
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (!user.approved && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Account not yet approved by admin. Please wait for approval.' }, { status: 403 });
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

    return NextResponse.json({
      token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Login processing error:', error);
    // NEVER leak raw database connection or access denied errors to the client!
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
}
