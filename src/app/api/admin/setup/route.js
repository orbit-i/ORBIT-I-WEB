import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '@/server/config/db';
import { getAdminUsers, saveAdminUser, getAdminByEmail } from '@/server/utils/cmsStorage';

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

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if admin already exists
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

      return NextResponse.json({
        message: 'Master Administrator account updated and authenticated successfully.',
        token,
        name: cleanName || existingUser.name,
        email: cleanEmail,
        role: 'ADMIN',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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
