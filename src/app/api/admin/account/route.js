import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyAdmin } from '@/lib/authServer';
import { getAdminByEmail, updateAdminUser } from '@/server/utils/cmsStorage';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const admin = await getAdminByEmail(auth.user.email);
    if (!admin) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role || 'ADMIN',
      avatar_url: admin.avatar_url || '',
      created_at: admin.created_at,
    });
  } catch (error) {
    console.error('Get account error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { name, email, avatar_url, currentPassword, newPassword } = body;
    const currentAdminEmail = auth.user.email;

    const admin = await getAdminByEmail(currentAdminEmail);
    if (!admin) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    if (newPassword) {
      if (admin.password) {
        if (!currentPassword) {
          return NextResponse.json({ error: 'Current password is required to change password' }, { status: 400 });
        }
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
          return NextResponse.json({ error: 'Current password incorrect' }, { status: 401 });
        }
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
      }
      updates.password = await bcrypt.hash(newPassword, 12);
    }

    await updateAdminUser(currentAdminEmail, updates);

    return NextResponse.json({
      message: 'Admin account credentials updated successfully',
      user: {
        id: admin.id,
        name: updates.name || admin.name,
        email: updates.email || admin.email,
        role: admin.role || 'ADMIN',
        avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : admin.avatar_url,
      },
    });
  } catch (error) {
    console.error('Update account error:', error);
    return NextResponse.json({ error: error.message || 'Server error updating admin account' }, { status: 500 });
  }
}
