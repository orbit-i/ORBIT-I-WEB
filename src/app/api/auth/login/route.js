import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/server/config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, password, phone, company, approved, role FROM client_information WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const user = rows[0];

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
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Server error during login' }, { status: 500 });
  }
}
