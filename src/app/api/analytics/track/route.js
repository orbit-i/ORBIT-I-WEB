import { NextResponse } from 'next/server';
import { recordPageView } from '@/server/utils/cmsStorage';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || '';

    const entry = await recordPageView({
      path: body.path || '/',
      referrer: body.referrer || '',
      city: body.city || '',
      country: body.country || 'Pakistan',
      userAgent,
      ip,
    });

    return NextResponse.json({ success: true, recorded: Boolean(entry) });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
