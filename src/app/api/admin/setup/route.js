import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/server/config/db';
import { getAdminUsers, saveAdminUser } from '@/server/utils/cmsStorage';

const JWT_SECRET = process.env.JWT_SECRET || 'orbit_i_jwt_secret_key_super_secure_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

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

    // Verify if any admins already exist
    const existingAdmins = await getAdminUsers();
    if (existingAdmins && existingAdmins.length > 0) {
      return NextResponse.json({
        error: 'Security Lockout: Initial SuperAdmin setup has already been completed. Please use SuperAdmin Login.',
      }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Persist to fallback store and MySQL
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

    return NextResponse.json({
      message: 'SuperAdmin account initialized successfully.',
      token,
      name: cleanName,
      email: cleanEmail,
      role: 'ADMIN',
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ error: 'Server error during setup. Please try again.' }, { status: 500 });
  }
}
