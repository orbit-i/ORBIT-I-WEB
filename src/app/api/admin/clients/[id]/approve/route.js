import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';
import { approveClientUser } from '@/server/utils/cmsStorage';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    await approveClientUser(id);

    return new Response('Client approved successfully', { status: 200 });
  } catch (error) {
    console.error('approveClient error:', error);
    return NextResponse.json({ error: error.message || 'Server error approving client' }, { status: 500 });
  }
}
