import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';
import { getClientUsers } from '@/server/utils/cmsStorage';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const clients = await getClientUsers();
    const response = (clients || []).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      approved: Boolean(c.approved),
      role: c.role,
      createdAt: c.created_at,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('getAllClients error:', error);
    return NextResponse.json([]);
  }
}
