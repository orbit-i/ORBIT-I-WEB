import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyAdmin } from '@/lib/authServer';
import { getAdminUsers, saveAdminUser, getAdminByEmail } from '@/server/utils/cmsStorage';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const admins = await getAdminUsers();
    return NextResponse.json(admins);
  } catch (error) {
    console.error('List admin accounts error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { name, email, password, avatar_url, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await getAdminByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json({ error: `An admin with email ${cleanEmail} already exists` }, { status: 400 });
    }

    const assignedRole = role ? String(role).toUpperCase().trim() : 'ADMIN';
    const hashedPassword = await bcrypt.hash(password, 12);
    const newAdmin = await saveAdminUser({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      avatar_url: avatar_url || '',
      role: assignedRole,
    });

    return NextResponse.json(
      {
        message: 'New administrator account created successfully',
        admin: {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: assignedRole,
          avatar_url: newAdmin.avatar_url,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create admin account error:', error);
    return NextResponse.json({ error: error.message || 'Server error creating admin account' }, { status: 500 });
  }
}
