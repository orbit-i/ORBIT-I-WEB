import { NextResponse } from 'next/server';
import { getSiteNotice, updateSiteNotice } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET() {
  try {
    const notice = getSiteNotice();
    return NextResponse.json(notice);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const updated = updateSiteNotice(body);
    return NextResponse.json({ message: 'Site notice banner updated', notice: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
