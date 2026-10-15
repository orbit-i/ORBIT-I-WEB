import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { verifyAdmin } from '@/lib/authServer';
import { updateAdminUser, deleteAdminUser, getAdminUsers } from '@/server/utils/cmsStorage';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, email, password, avatar_url } = body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.trim().toLowerCase();
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
      }
      updates.password = await bcrypt.hash(password, 12);
    }

    await updateAdminUser(id, updates);

    return NextResponse.json({ message: 'Admin account updated successfully' });
  } catch (error) {
    console.error('Update admin error:', error);
    return NextResponse.json({ error: error.message || 'Server error updating admin' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const allAdmins = await getAdminUsers();
    if (allAdmins.length <= 1) {
      return NextResponse.json({ error: 'Cannot delete the sole remaining administrator' }, { status: 400 });
    }

    await deleteAdminUser(id);
    return NextResponse.json({ message: 'Admin account removed successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    return NextResponse.json({ error: error.message || 'Server error deleting admin' }, { status: 500 });
  }
}
