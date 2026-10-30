import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '@/server/config/db';
import { getClientByEmail, saveClientUser, getAdminByEmail } from '@/server/utils/cmsStorage';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, company } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check MySQL
    let emailExists = false;
    try {
      const [existing] = await pool.query('SELECT id FROM client_information WHERE LOWER(email) = ?', [cleanEmail]);
      if (existing && existing.length > 0) emailExists = true;
    } catch {}

    // Check persistent vault
    if (!emailExists) {
      const existingClient = await getClientByEmail(cleanEmail);
      const existingAdmin = await getAdminByEmail(cleanEmail);
      if (existingClient || existingAdmin) emailExists = true;
    }

    if (emailExists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to persistent vault
    await saveClientUser({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone ? phone.trim() : null,
      company: company ? company.trim() : null,
    });

    return new Response('Registration successful. Please wait for admin approval.', { status: 200 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Server error during registration' }, { status: 500 });
  }
}
