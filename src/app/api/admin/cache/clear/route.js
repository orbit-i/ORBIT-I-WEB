import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';
import { globalCache } from '@/server/utils/cache';

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (globalCache && typeof globalCache.clear === 'function') {
      globalCache.clear();
    }

    return NextResponse.json({ message: 'High-speed balance loader memory cache flushed successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error clearing cache' }, { status: 500 });
  }
}
