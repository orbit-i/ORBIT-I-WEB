import { NextResponse } from 'next/server';
import { getInquiries } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const inquiries = await getInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiries' }, { status: 500 });
  }
}
