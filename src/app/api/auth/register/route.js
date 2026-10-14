import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/server/config/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, company } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const [existing] = await pool.query('SELECT id FROM client_information WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO client_information (name, email, password, phone, company, approved, role, created_at)
       VALUES (?, ?, ?, ?, ?, 0, 'CLIENT', NOW())`,
      [name, email, hashedPassword, phone || null, company || null]
    );

    return new Response('Registration successful. Please wait for admin approval.', { status: 200 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Server error during registration' }, { status: 500 });
  }
}
