import { NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
