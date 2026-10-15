import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';
import { clearBannedIp } from '@/server/middleware/security';

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { ip } = body;
    if (!ip) {
      return NextResponse.json({ error: 'IP is required' }, { status: 400 });
    }

    if (typeof clearBannedIp === 'function') {
      clearBannedIp(ip);
    }

    return NextResponse.json({ message: `IP restriction for [${ip}] lifted successfully` });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error clearing IP' }, { status: 500 });
  }
}
